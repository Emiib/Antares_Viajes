import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { TravelCard } from "../types";
import type { PackageType } from "../data/packagesStore";
import { usePackages } from "../data/packagesStore";
import { PackageCard } from "../components/ui/PackageCard";

// Catálogo general: todos los tipos menos "experiencias" (Lujo tiene su propia página).
const CATALOG_TYPES: PackageType[] = ["ofertas", "featured", "argentina", "circuitos", "grupales", "quinceaneras", "cruceros"];

const parsePrice = (p: string) => {
  const n = parseInt((p || "").replace(/[^\d]/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
};
const parseNights = (d: string) => {
  const m = (d || "").match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
};

const PRICE_RANGES = [
  { label: "Hasta USD 1.000", test: (n: number) => n > 0 && n <= 1000 },
  { label: "USD 1.000 a 2.000", test: (n: number) => n > 1000 && n <= 2000 },
  { label: "USD 2.000 a 4.000", test: (n: number) => n > 2000 && n <= 4000 },
  { label: "Más de USD 4.000", test: (n: number) => n > 4000 },
];
const NIGHT_RANGES = [
  { label: "1 a 3 noches", test: (n: number) => n >= 1 && n <= 3 },
  { label: "4 a 7 noches", test: (n: number) => n >= 4 && n <= 7 },
  { label: "8 a 14 noches", test: (n: number) => n >= 8 && n <= 14 },
  { label: "15+ noches", test: (n: number) => n >= 15 },
];

const fieldCls = "rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--terra)]";
const fieldStyle = { border: "1px solid var(--line)", background: "var(--card)", color: "var(--text)" } as const;

export function PaquetesPage({ darkMode }: { darkMode: boolean }) {
  const { byType } = usePackages();
  const [params, setParams] = useSearchParams();

  const ofertasIds = useMemo(() => new Set(byType.ofertas.map((p) => p.id)), [byType]);

  const allCards = useMemo(() => {
    const map = new Map<string, TravelCard>();
    CATALOG_TYPES.forEach((t) => byType[t]?.forEach((p) => map.set(p.id, p)));
    return [...map.values()];
  }, [byType]);

  const destinos = useMemo(
    () => [...new Set(allCards.map((p) => p.destination).filter(Boolean))].sort(),
    [allCards]
  );

  const [destino, setDestino] = useState(params.get("destino") || "");
  const [priceRange, setPriceRange] = useState("");
  const [nightRange, setNightRange] = useState("");
  const [orden, setOrden] = useState("relevancia");
  const [soloOfertas, setSoloOfertas] = useState(params.get("filtro") === "ofertas");

  // Reaccionar a cambios de query (ej. al tocar "Ofertas" en el navbar estando ya acá).
  useEffect(() => {
    setSoloOfertas(params.get("filtro") === "ofertas");
    setDestino(params.get("destino") || "");
  }, [params]);

  const results = useMemo(() => {
    let r = allCards.slice();
    if (soloOfertas) r = r.filter((p) => ofertasIds.has(p.id));
    if (destino) r = r.filter((p) => p.destination.toLowerCase().includes(destino.toLowerCase()));
    const pr = PRICE_RANGES.find((x) => x.label === priceRange);
    if (pr) r = r.filter((p) => pr.test(parsePrice(p.price)));
    const nr = NIGHT_RANGES.find((x) => x.label === nightRange);
    if (nr) r = r.filter((p) => nr.test(parseNights(p.duration)));
    if (orden === "precio-asc") r = r.slice().sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    else if (orden === "precio-desc") r = r.slice().sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    return r;
  }, [allCards, ofertasIds, soloOfertas, destino, priceRange, nightRange, orden]);

  const hasFilters = soloOfertas || !!destino || !!priceRange || !!nightRange || orden !== "relevancia";
  const clearAll = () => {
    setPriceRange("");
    setNightRange("");
    setOrden("relevancia");
    setParams({}, { replace: true });
  };
  const destinoOptions = destino && !destinos.includes(destino) ? [destino, ...destinos] : destinos;

  return (
    <main className="bg-base" style={{ minHeight: "100vh" }}>
      <section className="border-b border-base px-5 pb-10 pt-28 sm:px-8 md:pt-32">
        <div className="mx-auto max-w-[1340px]">
          <Link to="/" className="terra mb-4 inline-flex items-center gap-2 text-sm font-semibold">← Volver al inicio</Link>
          <h1 className="font-display t1 leading-[1.02]" style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)" }}>Paquetes</h1>
          <p className="t-mut mt-3 max-w-2xl text-base md:text-lg">
            Todas nuestras propuestas en un solo lugar. Filtrá por destino, precio o duración y encontrá tu próximo viaje.
          </p>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 md:py-10">
        <div className="mx-auto max-w-[1340px]">
          {/* Barra de filtros */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => setSoloOfertas((v) => !v)}
                className="rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
                style={soloOfertas
                  ? { background: "var(--terra)", color: "#fff" }
                  : { border: "1px solid var(--line)", color: "var(--text)" }}>
                🔥 Ofertas
              </button>
              <select aria-label="Destino" value={destino} onChange={(e) => setDestino(e.target.value)} className={fieldCls} style={fieldStyle}>
                <option value="">Todos los destinos</option>
                {destinoOptions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select aria-label="Precio" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className={fieldCls} style={fieldStyle}>
                <option value="">Cualquier precio</option>
                {PRICE_RANGES.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
              </select>
              <select aria-label="Duración" value={nightRange} onChange={(e) => setNightRange(e.target.value)} className={fieldCls} style={fieldStyle}>
                <option value="">Cualquier duración</option>
                {NIGHT_RANGES.map((n) => <option key={n.label} value={n.label}>{n.label}</option>)}
              </select>
            </div>
            <select aria-label="Ordenar" value={orden} onChange={(e) => setOrden(e.target.value)} className={fieldCls} style={fieldStyle}>
              <option value="relevancia">Orden: relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <p className="t-mut text-sm">{results.length} {results.length === 1 ? "paquete" : "paquetes"}</p>
            {hasFilters && <button onClick={clearAll} className="terra text-sm font-semibold">Limpiar filtros</button>}
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
              {results.map((pkg) => (
                <div key={pkg.id} className="h-full">
                  <PackageCard pkg={pkg} accent="red" darkMode={darkMode} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="t-mut text-xl">No encontramos paquetes con esos filtros.</p>
              <button onClick={clearAll} className="terra mt-4 font-semibold">Ver todos los paquetes</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
