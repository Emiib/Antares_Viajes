import { useState } from "react";

export function LegalesPage({ darkMode }: { darkMode: boolean }) {
  function LegalesPage({ darkMode }: { darkMode: boolean }) {
    const [showRepentanceForm, setShowRepentanceForm] = useState(false);
    const [repentanceForm, setRepentanceForm] = useState({
      name: "",
      email: "",
      phone: "",
      bookingRef: "",
      reason: "",
    });
  
    const handleRepentanceSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const msg = `Solicitud de Botón de Arrepentimiento:\n\nNombre: ${repentanceForm.name}\nEmail: ${repentanceForm.email}\nTeléfono: ${repentanceForm.phone}\nReferencia de Reserva: ${repentanceForm.bookingRef}\nMotivo: ${repentanceForm.reason}`;
      window.location.href = `https://api.whatsapp.com/send?phone=5493446528749&text=${encodeURIComponent(msg)}`;
      setShowRepentanceForm(false);
    };
  
    return (
      <main
        className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-[calc(100vh-80px)]`}
      >
        <section
          className={`py-12 md:py-16 ${darkMode ? "bg-stone-900" : "bg-stone-50"} border-b ${darkMode ? "border-stone-800" : "border-stone-100"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <a
              href="#"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
            >
              ← Volver al inicio
            </a>
            <h1
              className={`text-3xl md:text-5xl font-black ${darkMode ? "text-white" : "text-stone-900"} mb-3`}
            >
              Legales & Protección
            </h1>
            <p
              className={`${darkMode ? "text-stone-400" : "text-stone-600"} max-w-2xl text-base md:text-lg`}
            >
              Condiciones de contratación y derechos del consumidor.
            </p>
          </div>
        </section>
  
        <section className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Condiciones de Contratación */}
              <div
                className={`rounded-2xl border p-6 lg:col-span-2 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">📋</div>
                  <h2
                    className={`text-2xl font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                  >
                    Condiciones de Contratación
                  </h2>
                </div>
                <div
                  className={`text-sm leading-relaxed space-y-4 ${darkMode ? "text-stone-400" : "text-stone-600"}`}
                >
                  <div>
                    <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                      A) SOLICITUDES Y PAGOS
                    </h3>
                    <p>
                      Los precios son orientativos y no revisten confirmación. Los depósitos iniciales funcionan como reserva, no confirmación. El pago total debe realizarse antes de la fecha establecida.
                    </p>
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                      B) SERVICIOS INCLUIDOS
                    </h3>
                    <p>
                      Transporte, alojamiento en categorías oficiales, comidas según se indique, excursiones, traslados aeroportuarios.
                    </p>
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                      C) SERVICIOS NO INCLUIDOS
                    </h3>
                    <p>
                      Bebidas, propinas, tasas de embarque, seguros, exceso de equipaje, gastos de visado, excursiones opcionales.
                    </p>
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                      D) VIAJES EN GRUPO
                    </h3>
                    <p>
                      Requieren mínimo 30 personas. Sin alcanzar ese número, pueden cancelar con 10 días de anticipación.
                    </p>
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                      G) CANCELACIONES
                    </h3>
                    <p>
                      Políticas específicas según servicios contratados. Para charter: se perderá la totalidad de lo abonado en transporte no regular.
                    </p>
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                      J) RESPONSABILIDAD
                    </h3>
                    <p>
                      La agencia actúa como intermediaria. Declina responsabilidad por deficiencias de terceros prestadores.
                    </p>
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                      O) JURISDICCIÓN
                    </h3>
                    <p>
                      Tribunales provinciales de Gualeguaychú, Entre Ríos.
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Botón de Arrepentimiento */}
              <div
                className={`rounded-2xl border p-6 lg:col-span-2 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">🔄</div>
                  <h2
                    className={`text-2xl font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                  >
                    Botón de Arrepentimiento
                  </h2>
                </div>
                <p
                  className={`text-sm leading-relaxed mb-6 ${darkMode ? "text-stone-400" : "text-stone-600"}`}
                >
                  De conformidad con la legislación de protección al consumidor argentina, tienes derecho a arrepentirte de tu compra dentro de los 10 días hábiles posteriores a la confirmación del viaje, sin necesidad de justificación. El reembolso se procesará según la política de cancelación aplicable a tu reserva.
                </p>
                <button
                  onClick={() => setShowRepentanceForm(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg"
                >
                  🔗 Ejercer derecho de arrepentimiento
                </button>
              </div>
            </div>
          </div>
        </section>
  
        {showRepentanceForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowRepentanceForm(false)}
          >
            <div
              className={`${darkMode ? "border-stone-700 bg-stone-900" : "border-stone-200 bg-white"} w-full max-w-md rounded-2xl border p-6 shadow-2xl md:p-8`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className={`text-xl font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                >
                  Solicitar Arrepentimiento
                </h3>
                <button
                  onClick={() => setShowRepentanceForm(false)}
                  className="text-stone-400 transition-colors hover:text-red-500"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="mb-5 text-sm text-stone-500">
                Completa el formulario y te responderemos dentro de 48 horas.
              </p>
              <form onSubmit={handleRepentanceSubmit} className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Nombre completo"
                  value={repentanceForm.name}
                  onChange={(e) =>
                    setRepentanceForm({
                      ...repentanceForm,
                      name: e.target.value,
                    })
                  }
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={repentanceForm.email}
                  onChange={(e) =>
                    setRepentanceForm({
                      ...repentanceForm,
                      email: e.target.value,
                    })
                  }
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
                />
                <input
                  required
                  type="tel"
                  placeholder="Teléfono"
                  value={repentanceForm.phone}
                  onChange={(e) =>
                    setRepentanceForm({
                      ...repentanceForm,
                      phone: e.target.value,
                    })
                  }
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
                />
                <input
                  required
                  type="text"
                  placeholder="Referencia de reserva"
                  value={repentanceForm.bookingRef}
                  onChange={(e) =>
                    setRepentanceForm({
                      ...repentanceForm,
                      bookingRef: e.target.value,
                    })
                  }
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Motivo de arrepentimiento"
                  value={repentanceForm.reason}
                  onChange={(e) =>
                    setRepentanceForm({
                      ...repentanceForm,
                      reason: e.target.value,
                    })
                  }
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 py-3 text-sm font-bold text-white transition-all hover:shadow-lg"
                >
                  Enviar por WhatsApp
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    );
  }
}