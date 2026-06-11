import { useParams, Link } from "react-router-dom";
import { getAllPackages } from "../data/packages";

export function PackageDetailPage({
  darkMode,
  whatsappLink,
}: {
  darkMode: boolean;
  whatsappLink: (msg: string) => string;
}) {
  const { id } = useParams(); // Obtenemos el ID de la URL automáticamente
  const allPackages = getAllPackages();
  const pkg = id ? allPackages.find((p) => p.id === id) : null;
  if (!pkg) {
    return (
      <main
        className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-[calc(100vh-80px)]`}
      >
        <section
          className={`pt-28 pb-12 md:pt-32 md:pb-16 ${darkMode ? "bg-stone-900" : "bg-stone-50"} border-b ${darkMode ? "border-stone-800" : "border-stone-100"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
            >
              ← Volver al inicio
            </Link>
            <h1
              className={`text-3xl md:text-5xl font-black ${darkMode ? "text-white" : "text-stone-900"} mb-3`}
            >
              Paquete no encontrado
            </h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-[calc(100vh-80px)]`}
    >
      <section
        className={`pt-28 pb-8 md:pt-32 md:pb-12 ${darkMode ? "bg-stone-900" : "bg-stone-50"}`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            ← Volver
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Slider de imágenes */}
            <div className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden h-96 md:h-[500px] bg-stone-200">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                {pkg.badge && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {pkg.badge}
                  </div>
                )}
              </div>

              {/* Información del paquete */}
              <div
                className={`mt-8 rounded-2xl border p-6 md:p-8 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}
              >
                <h2
                  className={`text-2xl md:text-3xl font-black mb-6 ${darkMode ? "text-white" : "text-stone-900"}`}
                >
                  {pkg.title}
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-stone-500" : "text-stone-500"}`}
                      >
                        Destino
                      </p>
                      <p
                        className={`text-lg font-semibold ${darkMode ? "text-white" : "text-stone-900"}`}
                      >
                        {pkg.destination}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌙</span>
                    <div>
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-stone-500" : "text-stone-500"}`}
                      >
                        Duración
                      </p>
                      <p
                        className={`text-lg font-semibold ${darkMode ? "text-white" : "text-stone-900"}`}
                      >
                        {pkg.duration}
                      </p>
                    </div>
                  </div>

                  {pkg.departure && (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✈️</span>
                      <div>
                        <p
                          className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-stone-500" : "text-stone-500"}`}
                        >
                          Salida
                        </p>
                        <p
                          className={`text-lg font-semibold ${darkMode ? "text-white" : "text-stone-900"}`}
                        >
                          {pkg.departure}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`border-t pt-6 ${darkMode ? "border-stone-800" : "border-stone-200"}`}
                >
                  <h3
                    className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-stone-900"}`}
                  >
                    Incluye:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pkg.includes?.map((inc, i) => (
                      <span
                        key={i}
                        className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                      >
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Panel de precio y CTA */}
            <div className="lg:col-span-1">
              <div
                className={`rounded-2xl border p-6 md:p-8 sticky top-32 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Precio por persona
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-black text-red-600">
                    {pkg.price}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const msg = `Hola! Me interesa saber más sobre el paquete "${pkg.title}". Quiero más detalles.`;
                    window.location.href = whatsappLink(msg);
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 mb-4"
                >
                  Consultar Disponibilidad
                </button>

                <div
                  className={`text-xs text-center ${darkMode ? "text-stone-400" : "text-stone-600"}`}
                >
                  Hablaremos directamente por WhatsApp sobre disponibilidad y detalles.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
