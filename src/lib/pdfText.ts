// Extrae el texto de un PDF en el navegador con pdf.js.
// pdfjs-dist se carga de forma diferida (dynamic import) para que NO entre
// en el bundle público: solo se descarga cuando el admin sube un PDF.

/**
 * Lee un PDF y devuelve su texto plano, agrupado por párrafos.
 * Une los fragmentos de cada página respetando saltos de línea razonables.
 */
export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  // El worker se sirve desde el mismo paquete; Vite resuelve la URL.
  const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();

    let lastY: number | null = null;
    let line = "";
    const lines: string[] = [];

    for (const item of content.items) {
      // Solo nos interesan los items con texto y transform (posición).
      if (!("str" in item)) continue;
      const y = item.transform?.[5] ?? null;
      // Cambio de renglón: el desplazamiento vertical supera un umbral.
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) {
        if (line.trim()) lines.push(line.trim());
        line = "";
      }
      line += item.str;
      lastY = y;
    }
    if (line.trim()) lines.push(line.trim());
    pages.push(lines.join("\n"));
  }

  // Normalizamos: colapsamos espacios y dejamos doble salto entre bloques.
  return pages
    .join("\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
