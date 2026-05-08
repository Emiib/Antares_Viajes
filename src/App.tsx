import { useEffect, useState } from 'react';

// ===== CONSTANTES =====
const WHATSAPP = "5493446528749";
const LOGO_URL = "https://www.antaresviajes.tur.ar/images/logo-antares-2.jpeg";
const SLOGAN = "El mejor de los viajes es el próximo";
const SALES_EMAIL = "ventas@antaresviajes.com.ar";

const heroSlides = [
  {
    src: "https://videos.pexels.com/video-files/33022213/14072538_3840_2160_30fps.mp4",
    poster: "https://images.pexels.com/videos/33022213/2025-travel-4k-aerial-footage-4k-beach-4k-drone-33022213.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920",
    label: "Tailandia"
  },
  {
    src: "https://videos.pexels.com/video-files/29947197/12852218_3840_2160_30fps.mp4",
    poster: "https://images.pexels.com/videos/29947197/central-rome-citta-del-vaticano-classic-italy-daybreak-29947197.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920",
    label: "Roma"
  },
  {
    src: "https://videos.pexels.com/video-files/17487256/17487256-uhd_3840_2160_30fps.mp4",
    poster: "https://images.pexels.com/videos/17487256/beach-drone-gili-holiday-17487256.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920",
    label: "Bali"
  },
  {
    src: "https://videos.pexels.com/video-files/32504481/13860591_3840_2160_30fps.mp4",
    poster: "https://images.pexels.com/videos/32504481/4k-aerial-4k-aerial-footage-4k-drone-4k-drone-footage-32504481.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920",
    label: "Sri Lanka"
  },
  {
    src: "https://videos.pexels.com/video-files/36584879/15510650_3840_2160_60fps.mp4",
    poster: "https://images.pexels.com/videos/36584879/ancient-roman-architecture-central-italy-historic-rome-italian-architecture-36584879.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920",
    label: "Italia"
  },
  {
    src: "https://videos.pexels.com/video-files/20312200/20312200-uhd_3840_2160_30fps.mp4",
    poster: "https://images.pexels.com/videos/20312200/hat-yai-thailand-samila-beach-samila-beach-hat-yai-samila-beach-songkhla-20312200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920",
    label: "Asia"
  }
];

// Paleta de marca Antares
// Rojo principal: #D94E3F
// Rojo oscuro: #B91C1C
// Dorado/Beige: #C4A882
// Marrón texto: #6B4E31
// Blanco: #FFFFFF

const wa = (text?: string) => `https://api.whatsapp.com/send?phone=${WHATSAPP}${text ? `&text=${encodeURIComponent(text)}` : ''}`;

// ===== DATOS =====

const argentinaPackages = [
  { id: 1, title: "Bariloche - Patagonia", duration: "5 Noches", departure: "Salidas diarias", price: "ARS 890.000", image: "https://images.pexels.com/photos/7227901/pexels-photo-7227901.png?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", badge: "Más Vendido", includes: ["Hotel 4★", "Desayuno", "Traslados"] },
  { id: 2, title: "Iguazú - Misiones", duration: "4 Noches", departure: "Salidas diarias", price: "ARS 720.000", image: "https://images.pexels.com/photos/30826588/pexels-photo-30826588.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", badge: "Imperdible", includes: ["Hotel 4★", "Media pensión", "Cataratas"] },
  { id: 3, title: "Mendoza - Bodegas", duration: "4 Noches", departure: "Salidas semanales", price: "ARS 650.000", image: "https://images.pexels.com/photos/9470519/pexels-photo-9470519.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", badge: "Oferta", includes: ["Hotel boutique", "Tour bodegas", "City tour"] },
  { id: 4, title: "Ushuaia - Fin del Mundo", duration: "5 Noches", departure: "Salidas diarias", price: "ARS 980.000", image: "https://images.pexels.com/photos/29318864/pexels-photo-29318864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", badge: "Exclusivo", includes: ["Hotel 4★", "Canal Beagle", "Glaciar"] }
];

const featuredPackages = [
  { id: 1, title: "Porto Seguro - Brasil", duration: "7 Noches", departure: "22 FEB 2026", price: "USD 1.240", image: "https://images.pexels.com/photos/7227901/pexels-photo-7227901.png?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", badge: "Más Vendido", includes: ["All Inclusive", "Aéreo", "Traslados"] },
  { id: 2, title: "Bayahibe - Rep. Dominicana", duration: "8 Noches", departure: "27 FEB 2026", price: "USD 3.155", image: "https://images.pexels.com/photos/30826588/pexels-photo-30826588.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", badge: "Luxury", includes: ["Resort 5★", "All Inclusive", "Aéreo"] },
  { id: 3, title: "Buzios & Arraial Do Cabo", duration: "7 Días / 6 Noches", departure: "07 FEB 2026", price: "USD 1.358", image: "https://images.pexels.com/photos/9470519/pexels-photo-9470519.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", badge: "Oferta", includes: ["Hotel", "Aéreo", "City Tour"] },
  { id: 4, title: "Cancún - México", duration: "5 Noches", departure: "10 MAR 2026", price: "USD 2.100", image: "https://images.pexels.com/photos/15925413/pexels-photo-15925413.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", badge: "Popular", includes: ["All Inclusive", "Aéreo", "Traslados"] }
];

const circuits = [
  { id: 1, title: "Europa Clásica", destination: "Francia, Italia, España", duration: "14 Días", price: "USD 3.890", image: "https://images.pexels.com/photos/15925413/pexels-photo-15925413.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", highlights: ["París", "Roma", "Barcelona"] },
  { id: 2, title: "Asia Fascinante", destination: "Tailandia, Vietnam, Camboya", duration: "18 Días", price: "USD 4.290", image: "https://images.pexels.com/photos/29318864/pexels-photo-29318864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", highlights: ["Bangkok", "Phnom Penh", "Ho Chi Minh"] },
  { id: 3, title: "Perú Ancestral", destination: "Machu Picchu, Cusco, Lima", duration: "10 Días", price: "USD 2.890", image: "https://images.pexels.com/photos/7227901/pexels-photo-7227901.png?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", highlights: ["Machu Picchu", "Valle Sagrado", "Cusco"] },
  { id: 4, title: "Medio Oriente Mágico", destination: "Emiratos, Qatar", duration: "12 Días", price: "USD 5.490", image: "https://images.pexels.com/photos/30826588/pexels-photo-30826588.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", highlights: ["Dubai", "Abu Dhabi", "Doha"] }
];

const groupPackages = [
  { id: 1, title: "Grupo Joven - Caribe", people: "Desde 15 personas", price: "USD 950 p/p", image: "https://images.pexels.com/photos/7227901/pexels-photo-7227901.png?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", include: ["Hotel 4★", "Traslados", "Actividades"] },
  { id: 2, title: "Grupo Ejecutivo - España", people: "Desde 20 personas", price: "USD 1.890 p/p", image: "https://images.pexels.com/photos/15925413/pexels-photo-15925413.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", include: ["Hotel 5★", "Guía profesional", "Tours privados"] },
  { id: 3, title: "Grupo Familiar - Brasil", people: "Desde 10 personas", price: "USD 1.150 p/p", image: "https://images.pexels.com/photos/30826588/pexels-photo-30826588.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", include: ["Todo incluido", "Actividades familia", "Asistencia 24/7"] },
  { id: 4, title: "Grupo Corporativo - Miami", people: "Desde 25 personas", price: "USD 1.690 p/p", image: "https://images.pexels.com/photos/9470519/pexels-photo-9470519.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", include: ["Hotel premium", "Team building", "VIP"] }
];

const quincePackages = [
  { id: 1, title: "Caribe Soñado", destination: "República Dominicana", duration: "5 Noches", price: "USD 1.890", image: "https://images.pexels.com/photos/7227901/pexels-photo-7227901.png?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", include: ["Fiesta temática", "Cena especial", "Fotos profesionales"] },
  { id: 2, title: "Experiencia Europa", destination: "España & Italia", duration: "10 Días", price: "USD 3.490", image: "https://images.pexels.com/photos/15925413/pexels-photo-15925413.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", include: ["Guía especializado", "Experiencia VIP", "Regalo sorpresa"] },
  { id: 3, title: "Lujo Miami", destination: "Miami, Florida", duration: "7 Noches", price: "USD 2.690", image: "https://images.pexels.com/photos/30826588/pexels-photo-30826588.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", include: ["Shopping premium", "Cena de gala", "Spa & relax"] },
  { id: 4, title: "Maldivas Inolvidable", destination: "Islas Maldivas", duration: "6 Noches", price: "USD 4.290", image: "https://images.pexels.com/photos/29318864/pexels-photo-29318864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600", include: ["Resort all-inclusive", "Experiencia de lujo", "Recuerdos únicos"] }
];

const destinations = [
  { name: "Caribe", count: "120+ paquetes" },
  { name: "Brasil", count: "85+ paquetes" },
  { name: "Europa", count: "200+ paquetes" },
  { name: "México", count: "95+ paquetes" },
  { name: "Argentina", count: "150+ paquetes" },
  { name: "Estados Unidos", count: "110+ paquetes" }
];

function DestinationIcon({ name }: { name: string }) {
  if (name === "Caribe") {
    return <span className="text-4xl">🏝️</span>;
  }

  if (name === "Brasil") {
    return (
      <svg className="h-11 w-11" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#1FA463" opacity="0.12" />
        <path d="M24 7c-4 5-5 10-5 16h10c0-6-1-11-5-16Z" fill="#2F855A" />
        <path d="M14 24h20" stroke="#2F855A" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 34c3-5 13-5 16 0" stroke="#F2C94C" strokeWidth="3" strokeLinecap="round" />
        <path d="M24 23v14" stroke="#2F855A" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "Europa") {
    return (
      <svg className="h-11 w-11" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#4066D5" opacity="0.12" />
        <path d="M24 7 15 41M24 7l9 34M18 27h12M16 36h16M20 17h8" stroke="#4066D5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 41h22" stroke="#C4A882" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "México") {
    return (
      <svg className="h-11 w-11" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#C4A882" opacity="0.18" />
        <path d="M12 38h24M16 32h16M19 26h10M22 20h4" stroke="#8B5E34" strokeWidth="4" strokeLinecap="round" />
        <path d="M24 10 12 38h24L24 10Z" stroke="#D94E3F" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "Argentina") {
    return <span className="text-4xl">🇦🇷</span>;
  }

  return (
    <svg className="h-11 w-11" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#3B82F6" opacity="0.12" />
      <path d="M24 7v31" stroke="#2F5DA8" strokeWidth="3" strokeLinecap="round" />
      <path d="M19 38h10M17 42h14" stroke="#2F5DA8" strokeWidth="3" strokeLinecap="round" />
      <path d="M17 17h14l-3 7h-8l-3-7Z" fill="#7DD3FC" stroke="#2F5DA8" strokeWidth="2" />
      <path d="M24 7l4 7h-8l4-7Z" fill="#FBBF24" />
    </svg>
  );
}

// ===== COMPONENTE PRINCIPAL =====

export default function App() {
  const [searchData, setSearchData] = useState({ destination: "", departure: "", passengers: "2" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showTripForm, setShowTripForm] = useState(false);
  const [tripForm, setTripForm] = useState({ name: "", phone: "", destination: "", date: "", details: "" });
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola! Quiero buscar viajes:${searchData.destination ? ` Destino: ${searchData.destination}` : ''}${searchData.departure ? ` Fecha: ${searchData.departure}` : ''}${searchData.passengers ? ` Pasajeros: ${searchData.passengers}` : ''}`;
    window.open(wa(msg), '_blank');
  };

  const handleTripForm = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = "Solicitud de viaje a medida";
    const body = `Nombre: ${tripForm.name}\nTeléfono: ${tripForm.phone}\nDestino: ${tripForm.destination}\nFecha estimada: ${tripForm.date}\nDetalles: ${tripForm.details}`;
    window.location.href = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setShowTripForm(false);
  };

  // ===== TARJETAS =====

  const PackageCard = ({ pkg, accent = "red" }: { pkg: typeof featuredPackages[0], accent?: string }) => {
    const colors: Record<string, { badge: string, btn: string, priceColor: string, ring: string }> = {
      red: {
        badge: "bg-gradient-to-r from-red-600 to-red-500",
        btn: "from-red-600 to-red-500",
        priceColor: "text-red-600",
        ring: "hover:ring-red-200"
      },
      amber: {
        badge: "bg-gradient-to-r from-amber-600 to-amber-500",
        btn: "from-amber-600 to-amber-500",
        priceColor: "text-amber-600",
        ring: "hover:ring-amber-200"
      },
      teal: {
        badge: "bg-gradient-to-r from-teal-600 to-teal-500",
        btn: "from-teal-600 to-teal-500",
        priceColor: "text-teal-600",
        ring: "hover:ring-teal-200"
      },
      rose: {
        badge: "bg-gradient-to-r from-rose-600 to-rose-500",
        btn: "from-rose-600 to-rose-500",
        priceColor: "text-rose-600",
        ring: "hover:ring-rose-200"
      },
      purple: {
        badge: "bg-gradient-to-r from-purple-600 to-purple-500",
        btn: "from-purple-600 to-purple-500",
        priceColor: "text-purple-600",
        ring: "hover:ring-purple-200"
      }
    };
    const c = colors[accent] || colors.red;

    return (
      <div className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-stone-100 hover:ring-2 ${c.ring} group`}>
        <div className="relative h-48 overflow-hidden">
          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 left-3">
            <span className={`${c.badge} text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md tracking-wide uppercase`}>
              {pkg.badge}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-base font-bold text-stone-800 mb-1 leading-tight">{pkg.title}</h3>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span>🕐 {pkg.duration}</span>
            <span>·</span>
            <span>✈️ {pkg.departure}</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {pkg.includes.map((inc, i) => (
              <span key={i} className="bg-stone-50 text-stone-500 text-[10px] px-1.5 py-0.5 rounded font-medium">✓ {inc}</span>
            ))}
          </div>
          <div className="flex items-end justify-between">
            <span className={`text-2xl font-black ${c.priceColor}`}>{pkg.price}</span>
          </div>
          <a
            href={wa(`Hola! Me interesa el paquete: ${pkg.title}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
          >
            💬 Consultar
          </a>
        </div>
      </div>
    );
  };

  const CircuitCard = ({ circuit }: { circuit: typeof circuits[0] }) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-stone-100 hover:ring-2 hover:ring-red-200 group">
      <div className="relative h-52 overflow-hidden">
        <img src={circuit.image} alt={circuit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
          <div>
            <h3 className="text-xl font-bold text-white">{circuit.title}</h3>
            <p className="text-white/70 text-sm">{circuit.destination}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-stone-500 text-xs">🕐 {circuit.duration}</span>
          <span className="text-2xl font-black text-red-600">{circuit.price}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {circuit.highlights.map((h, i) => (
            <span key={i} className="bg-red-50 text-red-700 text-[10px] px-2 py-1 rounded-full font-medium">📍 {h}</span>
          ))}
        </div>
        <a
          href={wa(`Hola! Me interesa el circuito: ${circuit.title}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
        >
          Más Información
        </a>
      </div>
    </div>
  );

  const GroupCard = ({ group }: { group: typeof groupPackages[0] }) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-stone-100 hover:ring-2 hover:ring-amber-200 group">
      <div className="relative h-52 overflow-hidden">
        <img src={group.image} alt={group.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          👥 GRUPAL
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-stone-800 mb-1">{group.title}</h3>
        <p className="text-xs text-stone-500 mb-2">{group.people}</p>
        <p className="text-2xl font-black text-red-600 mb-3">{group.price}</p>
        <ul className="space-y-1 mb-4">
          {group.include.map((item, i) => (
            <li key={i} className="text-xs text-stone-600 flex items-center gap-1.5">
              <span className="text-red-500 text-[10px]">✔</span> {item}
            </li>
          ))}
        </ul>
        <a
          href={wa(`Hola! Me interesa cotizar un viaje grupal: ${group.title}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center text-sm"
        >
          Cotizar Grupo
        </a>
      </div>
    </div>
  );

  const QuinceCard = ({ quince }: { quince: typeof quincePackages[0] }) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-stone-100 hover:ring-2 hover:ring-rose-200 group">
      <div className="relative h-52 overflow-hidden">
        <img src={quince.image} alt={quince.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          ✨ QUINCEAÑERA
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-stone-800 mb-1">{quince.title}</h3>
        <p className="text-xs text-stone-500 mb-2">📍 {quince.destination} · {quince.duration}</p>
        <p className="text-2xl font-black text-rose-600 mb-3">{quince.price}</p>
        <ul className="space-y-1 mb-4">
          {quince.include.map((item, i) => (
            <li key={i} className="text-xs text-stone-600 flex items-center gap-1.5">
              <span className="text-rose-400 text-[10px]">✨</span> {item}
            </li>
          ))}
        </ul>
        <a
          href={wa(`Hola! Me interesa el viaje de quinceañera: ${quince.title}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center text-sm"
        >
          Consultar
        </a>
      </div>
    </div>
  );

  // ===== RENDER =====

  return (
    <div className={`min-h-screen font-['Inter'] transition-colors duration-300 ${darkMode ? "antares-dark bg-stone-950" : "bg-white"}`}>

      {/* ===== NAVBAR ===== */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md shadow-sm border-b transition-colors ${darkMode ? "bg-stone-950/95 border-stone-800" : "bg-white/98 border-stone-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <span className={darkMode ? "logo-safe bg-white rounded-xl px-2 py-1 shadow-sm" : ""}>
                <img src={LOGO_URL} alt="Antares Viajes y Turismo" className="h-10 md:h-14 w-auto" />
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center gap-1">
              {[
                { label: "Argentina", href: "#argentina" },
                { label: "Paquetes", href: "#paquetes" },
                { label: "Circuitos", href: "#circuitos" },
                { label: "Grupales", href: "#grupales" },
                { label: "Quinceañeras", href: "#quinceaneras" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-lg text-stone-600 hover:text-red-600 hover:bg-red-50 font-medium transition-all text-sm"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA + Mobile */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition-all ${darkMode ? "bg-white text-amber-500 hover:bg-stone-100" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
                aria-label="Cambiar modo claro u oscuro"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <a
                href={wa()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-3 md:px-5 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-all hover:shadow-lg text-xs md:text-sm"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z"/>
                </svg>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="xl:hidden pb-4 border-t border-stone-100 pt-3 space-y-1">
              {[
                { label: "Argentina", href: "#argentina" },
                { label: "Paquetes", href: "#paquetes" },
                { label: "Circuitos", href: "#circuitos" },
                { label: "Grupales", href: "#grupales" },
                { label: "Quinceañeras", href: "#quinceaneras" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-stone-700 hover:text-red-600 hover:bg-red-50 font-medium transition-all"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
                currentHeroSlide === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
              }`}
            >
              <video
                className="h-full w-full object-cover"
                src={slide.src}
                poster={slide.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-2xl">
            <h1 className="max-w-3xl text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 leading-[0.95] tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)]">
              El mejor de los viajes es el próximo
            </h1>

            <p className="text-base md:text-lg text-white/90 mb-8 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Encontrá los mejores paquetes a los destinos que soñás. Atención personalizada y las mejores tarifas del mercado.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 md:p-5 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Destino</label>
                  <input
                    type="text"
                    placeholder="¿A dónde?"
                    value={searchData.destination}
                    onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none text-sm bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Fecha</label>
                  <input
                    type="month"
                    value={searchData.departure}
                    onChange={(e) => setSearchData({...searchData, departure: e.target.value})}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none text-sm bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Pasajeros</label>
                  <select
                    value={searchData.passengers}
                    onChange={(e) => setSearchData({...searchData, passengers: e.target.value})}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none text-sm bg-stone-50"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1 flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-2.5 px-5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    🔍 Buscar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-20 hidden items-center gap-2 md:flex">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.label}
              type="button"
              onClick={() => setCurrentHeroSlide(index)}
              className={`h-1.5 rounded-full transition-all ${currentHeroSlide === index ? "w-9 bg-white" : "w-4 bg-white/45 hover:bg-white/70"}`}
              aria-label={`Ver destino ${slide.label}`}
            />
          ))}
        </div>
      </section>

      {/* ===== ARGENTINA ===== */}
      <section id="argentina" className={`py-14 md:py-20 transition-colors ${darkMode ? "bg-stone-950" : "bg-gradient-to-b from-red-50/50 to-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                Destino Argentina
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-stone-900 leading-tight">
                Descubrí <span className="text-red-600">Argentina</span>
              </h2>
              <p className="text-stone-600 mt-2 text-base md:text-lg">Los mejores destinos del país, al mejor precio</p>
            </div>
            <a
              href={wa("Hola! Quiero ver más opciones de viajes por Argentina")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 text-red-600 font-semibold hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              Ver todo →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {argentinaPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} accent="amber" />
            ))}
          </div>
        </div>
      </section>

      {/* ===== DESTINOS POPULARES ===== */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-stone-900 mb-3">
              Destinos <span className="text-red-600">Populares</span>
            </h2>
            <p className="text-stone-600 text-base md:text-lg">Explorá los destinos más elegidos</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {destinations.map((dest, idx) => (
              <div
                key={idx}
                className="bg-stone-50 hover:bg-white rounded-2xl p-4 md:p-5 text-center shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-stone-100 group"
              >
                <div className="mb-2 flex justify-center group-hover:scale-110 transition-transform"><DestinationIcon name={dest.name} /></div>
                <h3 className="font-bold text-stone-800 text-sm">{dest.name}</h3>
                <p className="text-[10px] md:text-xs text-stone-400 mt-1">{dest.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PAQUETES RECOMENDADOS ===== */}
      <section id="paquetes" className="py-14 md:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-stone-900 mb-2 leading-tight">
                Paquetes <span className="text-red-600">Recomendados</span>
              </h2>
              <p className="text-stone-600 text-base md:text-lg">Las ofertas más populares del momento</p>
            </div>
            <a
              href={wa("Hola! Quiero ver todos los paquetes disponibles")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 text-red-600 font-semibold hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              Ver todos →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} accent="red" />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CIRCUITOS ===== */}
      <section id="circuitos" className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-stone-900 mb-2 leading-tight">
                Circuitos <span className="text-red-600">Internacionales</span>
              </h2>
              <p className="text-stone-600 text-base md:text-lg">Viajes completos a los destinos más increíbles</p>
            </div>
            <a
              href={wa("Hola! Quiero ver más circuitos internacionales")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 text-red-600 font-semibold hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              Ver todos →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {circuits.map((circuit) => (
              <CircuitCard key={circuit.id} circuit={circuit} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== GRUPALES ===== */}
      <section id="grupales" className="py-14 md:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-stone-900 mb-2">
              Viajes <span className="text-red-600">Grupales</span>
            </h2>
            <p className="text-stone-600 text-base md:text-lg max-w-2xl mx-auto">
              Paquetes especiales para empresas, amigos y familias con descuentos exclusivos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {groupPackages.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>

          <div className="mt-10 bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-6 md:p-8 border border-red-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-1">¿Necesitás una cotización personalizada?</h3>
                <p className="text-stone-600">Grupos desde 10 personas con descuentos especiales.</p>
              </div>
              <a
                href={wa("Hola! Me interesa cotizar un viaje grupal")}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold px-8 py-3.5 rounded-full hover:shadow-lg transition-all whitespace-nowrap text-sm"
              >
                Solicitar Cotización
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUINCEAÑERAS ===== */}
      <section id="quinceaneras" className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-stone-900 mb-2">
              Viajes de <span className="text-rose-500">Quinceañera</span>
            </h2>
            <p className="text-stone-600 text-base md:text-lg max-w-2xl mx-auto">
              Un viaje único e inolvidable para ese momento tan especial
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {quincePackages.map((quince) => (
              <QuinceCard key={quince.id} quince={quince} />
            ))}
          </div>

          <div className="mt-10 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 md:p-8 border border-rose-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-1">¡Hacé de tu quince un viaje soñado!</h3>
                <p className="text-stone-600">Personalizamos cada detalle para que sea único.</p>
              </div>
              <a
                href={wa("Hola! Me interesa un viaje de quinceañera")}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-8 py-3.5 rounded-full hover:shadow-lg transition-all whitespace-nowrap text-sm"
              >
                Consultar Ahora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POR QUÉ ELEGIRNOS ===== */}
      <section className="py-14 md:py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black mb-3">
              ¿Por qué <span className="text-red-200">Antares</span>?
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "💰", title: "Mejores Precios", desc: "Las tarifas más competitivas del mercado" },
              { icon: "🔒", title: "Pago Seguro", desc: "Mercado Pago, PayPal, cuotas y más" },
              { icon: "🎯", title: "Atención Personal", desc: "Asesores expertos a tu disposición" },
              { icon: "💬", title: "Respuesta Rápida", desc: "Te respondemos al instante por WhatsApp" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-3xl md:text-4xl mb-3">{item.icon}</div>
                <h3 className="text-base md:text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-red-100 text-xs md:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SLOGAN SECTION ===== */}
      <section className="py-14 md:py-20 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight italic font-light">
            "{SLOGAN}"
          </h2>
          <p className="text-stone-400 text-lg mb-8">
            Armemos tu viaje totalmente a medida
          </p>
          <button
            type="button"
            onClick={() => setShowTripForm(true)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-lg px-10 py-4 rounded-full hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Completar formulario
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-stone-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={darkMode ? "logo-safe bg-white rounded-xl px-2 py-1 shadow-sm" : ""}>
                  <img src={LOGO_URL} alt="Antares" className="h-12 w-auto" />
                </span>
              </div>
              <p className="text-stone-500 text-sm mb-4">
                Tu agencia de viajes de confianza. Los mejores destinos al mejor precio.
              </p>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/antaresviajes" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-stone-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/antares_viajes/?hl=es" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-stone-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold mb-4 uppercase tracking-widest text-stone-500">Navegación</h4>
              <ul className="space-y-2.5">
                <li><a href="#argentina" className="text-stone-500 hover:text-white transition-colors text-sm">Argentina</a></li>
                <li><a href="#paquetes" className="text-stone-500 hover:text-white transition-colors text-sm">Paquetes</a></li>
                <li><a href="#circuitos" className="text-stone-500 hover:text-white transition-colors text-sm">Circuitos</a></li>
                <li><a href="#grupales" className="text-stone-500 hover:text-white transition-colors text-sm">Grupales</a></li>
                <li><a href="#quinceaneras" className="text-stone-500 hover:text-white transition-colors text-sm">Quinceañeras</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold mb-4 uppercase tracking-widest text-stone-500">Contacto</h4>
              <ul className="space-y-3 text-stone-500 text-sm">
                <li className="flex items-center gap-2">📞 +54 3446 429808</li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z"/>
                  </svg>
                  +549 3446 528749
                </li>
                <li className="flex items-center gap-2">✉️ ventas@antaresviajes.com.ar</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold mb-4 uppercase tracking-widest text-stone-500">Horarios</h4>
              <ul className="space-y-2 text-stone-500 text-sm">
                <li>Lun a Vie: 9:00 - 13:00 y 15:00 - 19:00</li>
                <li>Sábados: 9:00 - 13:00</li>
                <li className="text-green-400 font-semibold">WhatsApp 24/7</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-6 text-center">
            <p className="text-stone-600 text-sm">{SLOGAN}</p>
            <p className="text-stone-700 text-xs mt-2">© 2026 Antares Viajes y Turismo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* ===== FORMULARIO A MEDIDA ===== */}
      {showTripForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <form onSubmit={handleTripForm} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-stone-900">Armemos tu viaje a medida</h3>
                <p className="mt-1 text-sm text-stone-500">Completá tus datos y te contactamos.</p>
              </div>
              <button type="button" onClick={() => setShowTripForm(false)} className="rounded-full bg-stone-100 px-3 py-1 text-stone-600 hover:bg-stone-200">
                Cerrar
              </button>
            </div>

            <div className="grid gap-3">
              <input
                required
                placeholder="Nombre y apellido"
                value={tripForm.name}
                onChange={(e) => setTripForm({ ...tripForm, name: e.target.value })}
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-400"
              />
              <input
                required
                placeholder="Teléfono / WhatsApp"
                value={tripForm.phone}
                onChange={(e) => setTripForm({ ...tripForm, phone: e.target.value })}
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-400"
              />
              <input
                placeholder="Destino deseado"
                value={tripForm.destination}
                onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-400"
              />
              <input
                placeholder="Fecha estimada"
                value={tripForm.date}
                onChange={(e) => setTripForm({ ...tripForm, date: e.target.value })}
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-400"
              />
              <textarea
                placeholder="Contanos cantidad de pasajeros, presupuesto aproximado y cualquier detalle importante"
                rows={4}
                value={tripForm.details}
                onChange={(e) => setTripForm({ ...tripForm, details: e.target.value })}
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <button type="submit" className="mt-5 w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-bold text-white hover:from-red-700 hover:to-red-600">
              Enviar solicitud
            </button>
          </form>
        </div>
      )}

      {/* ===== FLOATING WHATSAPP ===== */}
      <a
        href={wa()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 1.83c4.47 0 8.08 3.61 8.08 8.08s-3.61 8.08-8.08 8.08c-1.63 0-3.15-.49-4.41-1.33l-.31-.2-3.12.82.83-3.04-.2-.32A8.03 8.03 0 013.96 12c0-4.47 3.61-8.08 8.08-8.08z"/>
        </svg>
      </a>
    </div>
  );
}
