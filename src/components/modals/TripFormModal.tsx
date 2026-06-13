import { useState } from "react";
import type { FormEvent } from "react";
import { departureMonthOptions } from "../../data/dates";
import { captureLead } from "../../lib/leads";

interface TripFormModalProps {
  darkMode: boolean;
  wa: (text?: string) => string;
  onClose: () => void;
}

export function TripFormModal({ darkMode, wa, onClose }: TripFormModalProps) {
  const [tripForm, setTripForm] = useState({
    name: "", phone: "", destination: "", date: "", details: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const msg = `Hola! Quiero armar un viaje a medida.\n\nNombre: ${tripForm.name}\nTeléfono: ${tripForm.phone}\nDestino: ${tripForm.destination}\nFecha: ${tripForm.date}\nDetalles: ${tripForm.details}`;
    captureLead({
      source: "trip_form",
      name: tripForm.name,
      contact: tripForm.phone,
      destination: tripForm.destination,
      message: tripForm.details,
      payload: { date: tripForm.date },
    });
    window.location.href = wa(msg);
    onClose();
  };

  const inputClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${
    darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
  }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`${darkMode ? "border-stone-700 bg-stone-900" : "border-stone-200 bg-white"} w-full max-w-md rounded-2xl border p-6 shadow-2xl md:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-stone-900"}`}>
            Armá tu viaje a medida
          </h3>
          <button onClick={onClose} className="text-stone-400 transition-colors hover:text-red-500">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mb-5 text-sm text-stone-500">Completá el formulario y te respondemos por WhatsApp.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="Nombre completo"
            value={tripForm.name} onChange={(e) => setTripForm({ ...tripForm, name: e.target.value })}
            className={inputClass} />
          <input required type="tel" placeholder="Teléfono"
            value={tripForm.phone} onChange={(e) => setTripForm({ ...tripForm, phone: e.target.value })}
            className={inputClass} />
          <input type="text" placeholder="Destino deseado"
            value={tripForm.destination} onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
            className={inputClass} />
          <select
            value={tripForm.date} onChange={(e) => setTripForm({ ...tripForm, date: e.target.value })}
            className={`${inputClass} ${darkMode ? "" : "text-stone-700"}`}
          >
            <option value="">¿Cuándo?</option>
            {departureMonthOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <textarea rows={3} placeholder="Contanos tu idea de viaje"
            value={tripForm.details} onChange={(e) => setTripForm({ ...tripForm, details: e.target.value })}
            className={inputClass} />
          <button type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-3 text-sm font-bold text-white transition-all hover:shadow-lg">
            Enviar por WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}