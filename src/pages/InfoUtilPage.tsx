export function InfoUtilPage({ darkMode }: { darkMode: boolean }) {
  const sections = [
    {
      id: "visas",
      title: "Requisitos de Visas",
      icon: "🛂",
      content: [
        {
          country: "Schengen (Europa)",
          info: "Los ciudadanos argentinos pueden viajar sin visa por 90 días. Requiere pasaporte vigente.",
        },
        {
          country: "Estados Unidos",
          info: "Requiere visa ESTA o visa de turista. Tramitar con anticipación en la embajada.",
        },
        {
          country: "Brasil",
          info: "Ciudadanos argentinos no requieren visa. Solo pasaporte vigente.",
        },
        {
          country: "Caribe (RD, Turquía)",
          info: "Generalmente sin visa. Verificar según nacionalidad y destino específico.",
        },
      ],
    },
    {
      id: "check-in",
      title: "Web Check-In",
      icon: "✈️",
      content: [
        {
          country: "Aeroméxico",
          info: "Check-in online desde 24 horas antes del vuelo en aeromexico.com",
        },
        {
          country: "LATAM",
          info: "Web check-in disponible 24 horas antes. Acceso desde latam.com",
        },
        {
          country: "Aerolíneas Argentinas",
          info: "Check-in digital en aerolineas.com.ar desde 24 horas antes",
        },
        {
          country: "Consejo General",
          info: "Recomendamos hacer check-in online para ahorrar tiempo en aeropuerto",
        },
      ],
    },
  ];

  return (
    <main className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-screen`}>
      <section
        className={`pt-32 md:pt-40 pb-12 md:pb-16 ${darkMode ? "bg-stone-900" : "bg-stone-50"} border-b ${darkMode ? "border-stone-800" : "border-stone-100"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="#" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600">
            ← Volver al inicio
          </a>
          <h1 className={`text-3xl md:text-5xl font-black ${darkMode ? "text-white" : "text-stone-900"} mb-3`}>
            Información Útil
          </h1>
          <p className={`${darkMode ? "text-stone-400" : "text-stone-600"} max-w-2xl text-base md:text-lg`}>
            Todo lo que necesitas saber antes de viajar: visas, trámites y recomendaciones.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {sections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-4xl">{section.icon}</div>
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-stone-900"}`}>
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((item, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl p-4 border ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}
                    >
                      <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                        {item.country}
                      </h3>
                      <p className={`text-sm ${darkMode ? "text-stone-400" : "text-stone-600"}`}>
                        {item.info}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            className={`rounded-2xl border p-6 md:p-8 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}
          >
            <h3 className={`text-lg font-bold mb-3 ${darkMode ? "text-white" : "text-stone-900"}`}>
              ¿Tenés dudas? Contactanos
            </h3>
            <p className={`mb-4 ${darkMode ? "text-stone-400" : "text-stone-600"}`}>
              Nuestro equipo está disponible para asesorarte sobre cualquier requisito específico de tu destino.
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=5493446528749&text=${encodeURIComponent("Hola! Tengo dudas sobre requisitos de visa")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg"
            >
              📞 Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}