import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { blogPosts, continents } from './data/blog';
import { useInView } from './hooks/useInView';

type RouteKey = 'home' | 'ofertas' | 'argentina' | 'quinceaneras' | 'experiencias' | 'cruceros' | 'blog';
type Accent = 'red' | 'amber' | 'gold' | 'rose';

type TravelCard = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: string;
  image: string;
  badge?: string;
  departure?: string;
  people?: string;
  includes?: string[];
  highlights?: string[];
};

const SITE_CONFIG = {
  whatsapp: '5493446528749',
  salesEmail: 'ventas@antaresviajes.com.ar',
  slogan: 'El mejor de los viajes es el próximo',
  branding: {
    logo: '/branding/logo-header.png',
    logoAlt: 'Antares Viajes',
    footerShowcase: {
      type: 'gradient' as 'gradient' | 'image' | 'video',
      image: '/branding/footer-media.jpg',
      videoWebm: '/branding/footer-media.webm',
      videoMp4: '/branding/footer-media.mp4',
      poster: '/branding/footer-media-poster.jpg'
    }
  }
} as const;

const heroSlides = [
  {
    label: 'París',
    poster: '/videos/hero/paris-poster.jpg',
    sources: {
      mobileWebm: '/videos/hero/paris-mobile.webm',
      mobileMp4: '/videos/hero/paris-mobile.mp4',
      desktopWebm: '/videos/hero/paris-desktop.webm',
      desktopMp4: '/videos/hero/paris-desktop.mp4'
    }
  },
  {
    label: 'Playa del Carmen',
    poster: '/videos/hero/pcarmen-poster.jpg',
    sources: {
      mobileWebm: '/videos/hero/pcarmen-mobile.webm',
      mobileMp4: '/videos/hero/pcarmen-mobile.mp4',
      desktopWebm: '/videos/hero/pcarmen-desktop.webm',
      desktopMp4: '/videos/hero/pcarmen-desktop.mp4'
    }
  },
  {
    label: 'Turquía',
    poster: '/videos/hero/turquia-poster.jpg',
    sources: {
      mobileWebm: '/videos/hero/turquia-mobile.webm',
      mobileMp4: '/videos/hero/turquia-mobile.mp4',
      desktopWebm: '/videos/hero/turquia-desktop.webm',
      desktopMp4: '/videos/hero/turquia-desktop.mp4'
    }
  }
] as const;

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const minDepartureMonth = (() => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  return currentMonth < '2026-01' ? '2026-01' : currentMonth;
})();
const maxDepartureMonth = '2027-12';
const departureMonthOptions = (() => {
  const start = minDepartureMonth > maxDepartureMonth ? maxDepartureMonth : minDepartureMonth;
  const [startYear, startMonth] = start.split('-').map(Number);
  const [endYear, endMonth] = maxDepartureMonth.split('-').map(Number);
  const options: Array<{ value: string; label: string }> = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    const value = `${year}-${String(month).padStart(2, '0')}`;
    options.push({ value, label: `${monthNames[month - 1]} ${year}` });
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return options;
})();

const offersPackages: TravelCard[] = [
  { id: 'o1', title: 'Caribe Flash', destination: 'Punta Cana', duration: '7 Noches', departure: 'Solo esta semana', price: 'USD 1.790', image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Flash', includes: ['All Inclusive', 'Aéreo', 'Traslados'] },
  { id: 'o2', title: 'Europa Smart', destination: 'Madrid & París', duration: '9 Noches', departure: 'Últimos lugares', price: 'USD 2.990', image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Promo', includes: ['Hoteles', 'Aéreos', 'Desayunos'] },
  { id: 'o3', title: 'Brasil Express', destination: 'Río & Buzios', duration: '6 Noches', departure: 'Tiempo limitado', price: 'USD 1.150', image: 'https://images.pexels.com/photos/1619569/pexels-photo-1619569.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Oferta', includes: ['Hotel', 'Aéreo', 'Asistencia'] },
  { id: 'o4', title: 'México directo', destination: 'Cancún', duration: '5 Noches', departure: 'Cupos limitados', price: 'USD 1.980', image: 'https://images.pexels.com/photos/60217/pexels-photo-60217.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Imperdible', includes: ['Resort', 'Aéreo', 'Traslados'] }
];

const featuredPackages: TravelCard[] = [
  { id: 'f1', title: 'Porto Seguro - Brasil', destination: 'Brasil', duration: '7 Noches', departure: '22 FEB 2026', price: 'USD 1.240', image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Más Vendido', includes: ['All Inclusive', 'Aéreo', 'Traslados'] },
  { id: 'f2', title: 'Punta Cana - Caribe', destination: 'República Dominicana', duration: '8 Noches', departure: '27 FEB 2026', price: 'USD 2.355', image: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Popular', includes: ['Resort 5★', 'Aéreo', 'Traslados'] },
  { id: 'f3', title: 'Buzios & Arraial Do Cabo', destination: 'Brasil', duration: '7 Días / 6 Noches', departure: '07 FEB 2026', price: 'USD 1.358', image: 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Oferta', includes: ['Hotel', 'Aéreo', 'City Tour'] },
  { id: 'f4', title: 'Cancún - México', destination: 'México', duration: '5 Noches', departure: '10 MAR 2026', price: 'USD 2.100', image: 'https://images.pexels.com/photos/3280130/pexels-photo-3280130.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Imperdible', includes: ['All Inclusive', 'Aéreo', 'Traslados'] }
];

const argentinaPackages: TravelCard[] = [
  { id: 'a1', title: 'Bariloche - Patagonia', destination: 'Argentina', duration: '5 Noches', departure: 'Salidas diarias', price: 'ARS 890.000', image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Más Vendido', includes: ['Hotel 4★', 'Desayuno', 'Traslados'] },
  { id: 'a2', title: 'Iguazú - Misiones', destination: 'Argentina', duration: '4 Noches', departure: 'Salidas diarias', price: 'ARS 720.000', image: 'https://images.pexels.com/photos/4825701/pexels-photo-4825701.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Imperdible', includes: ['Hotel 4★', 'Media pensión', 'Cataratas'] },
  { id: 'a3', title: 'Mendoza - Bodegas', destination: 'Argentina', duration: '4 Noches', departure: 'Salidas semanales', price: 'ARS 650.000', image: 'https://images.pexels.com/photos/5947011/pexels-photo-5947011.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Oferta', includes: ['Hotel boutique', 'Tour bodegas', 'City tour'] },
  { id: 'a4', title: 'Ushuaia - Fin del Mundo', destination: 'Argentina', duration: '5 Noches', departure: 'Salidas diarias', price: 'ARS 980.000', image: 'https://images.pexels.com/photos/301667/pexels-photo-301667.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Exclusivo', includes: ['Hotel 4★', 'Canal Beagle', 'Glaciar'] }
];

const circuitPackages: TravelCard[] = [
  { id: 'c1', title: 'Europa Clásica', destination: 'Francia, Italia, España', duration: '14 Días', price: 'USD 3.890', image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Circuito', highlights: ['París', 'Roma', 'Barcelona'] },
  { id: 'c2', title: 'Asia Fascinante', destination: 'Tailandia, Vietnam, Camboya', duration: '18 Días', price: 'USD 4.290', image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Circuito', highlights: ['Bangkok', 'Phnom Penh', 'Ho Chi Minh'] },
  { id: 'c3', title: 'Perú Ancestral', destination: 'Machu Picchu, Cusco, Lima', duration: '10 Días', price: 'USD 2.890', image: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Circuito', highlights: ['Machu Picchu', 'Valle Sagrado', 'Cusco'] },
  { id: 'c4', title: 'Medio Oriente Mágico', destination: 'Emiratos, Qatar', duration: '12 Días', price: 'USD 5.490', image: 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Circuito', highlights: ['Dubai', 'Abu Dhabi', 'Doha'] }
];

const groupPackages: TravelCard[] = [
  { id: 'g1', title: 'Grupo Joven - Caribe', destination: 'Caribe', duration: 'Grupal', people: 'Desde 15 personas', price: 'USD 950 p/p', image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Grupal', includes: ['Hotel 4★', 'Traslados', 'Actividades'] },
  { id: 'g2', title: 'Grupo Ejecutivo - España', destination: 'España', duration: 'Grupal', people: 'Desde 20 personas', price: 'USD 1.890 p/p', image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Grupal', includes: ['Hotel 5★', 'Guía profesional', 'Tours privados'] },
  { id: 'g3', title: 'Grupo Familiar - Brasil', destination: 'Brasil', duration: 'Grupal', people: 'Desde 10 personas', price: 'USD 1.150 p/p', image: 'https://images.pexels.com/photos/1619569/pexels-photo-1619569.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Grupal', includes: ['Todo incluido', 'Actividades familia', 'Asistencia'] },
  { id: 'g4', title: 'Grupo Corporativo - Miami', destination: 'Estados Unidos', duration: 'Grupal', people: 'Desde 25 personas', price: 'USD 1.690 p/p', image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Grupal', includes: ['Hotel premium', 'Team building', 'VIP'] }
];

const quincePackages: TravelCard[] = [
  { id: 'q1', title: 'Caribe Soñado', destination: 'República Dominicana', duration: '5 Noches', price: 'USD 1.890', image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Quinceañeras', includes: ['Fiesta temática', 'Cena especial', 'Fotos profesionales'] },
  { id: 'q2', title: 'Experiencia Europa', destination: 'España & Italia', duration: '10 Días', price: 'USD 3.490', image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Quinceañeras', includes: ['Guía especializado', 'Experiencia VIP', 'Regalo sorpresa'] },
  { id: 'q3', title: 'Lujo Miami', destination: 'Miami, Florida', duration: '7 Noches', price: 'USD 2.690', image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Quinceañeras', includes: ['Shopping premium', 'Cena de gala', 'Spa & relax'] },
  { id: 'q4', title: 'Maldivas Inolvidable', destination: 'Islas Maldivas', duration: '6 Noches', price: 'USD 4.290', image: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Quinceañeras', includes: ['Resort all-inclusive', 'Experiencia de lujo', 'Recuerdos únicos'] }
];

const luxuryExperiences: TravelCard[] = [
  { id: 'l1', title: 'Maldivas Signature', destination: 'Maldivas', duration: '6 Noches', price: 'USD 6.900', image: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Luxury', includes: ['Resort 5★', 'Traslados privados', 'Experiencia gourmet'] },
  { id: 'l2', title: 'Dubái & Abu Dhabi Luxury', destination: 'Emiratos Árabes', duration: '7 Noches', price: 'USD 5.750', image: 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Luxury', includes: ['Hotel de lujo', 'Chofer privado', 'Excursiones premium'] },
  { id: 'l3', title: 'Santorini Exclusive Escape', destination: 'Grecia', duration: '5 Noches', price: 'USD 4.980', image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Luxury', includes: ['Hotel boutique', 'Sunset cruise', 'Experiencia privada'] },
  { id: 'l4', title: 'Safari & Lodge de Lujo', destination: 'África', duration: '8 Noches', price: 'USD 8.490', image: 'https://images.pexels.com/photos/4577793/pexels-photo-4577793.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Luxury', includes: ['Lodge premium', 'Experiencia safari', 'Asistencia exclusiva'] }
];

const cruisePackages: TravelCard[] = [
  { id: 'cr1', title: 'MSC Caribe', destination: 'Caribe', duration: '8 Noches', price: 'USD 2.450', image: 'https://images.pexels.com/photos/813011/pexels-photo-813011.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Cruceros', includes: ['Cabina externa', 'Pensión completa', 'Entretenimiento'] },
  { id: 'cr2', title: 'Mediterráneo Clásico', destination: 'Italia, España, Francia', duration: '10 Noches', price: 'USD 3.290', image: 'https://images.pexels.com/photos/753331/pexels-photo-753331.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Cruceros', includes: ['Cabina balcón', 'Pensión completa', 'Shows'] },
  { id: 'cr3', title: 'Sudamérica en Crucero', destination: 'Brasil & Uruguay', duration: '7 Noches', price: 'USD 1.980', image: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', badge: 'Cruceros', includes: ['Cabina interna', 'A bordo', 'Excursiones opcionales'] }
];

const popularDestinations = [
  { name: 'Caribe', count: '120+ paquetes', icon: '🏝️', subtitle: 'Playas, all inclusive y relax' },
  { name: 'Brasil', count: '85+ paquetes', icon: '⛪', subtitle: 'Cercanía, playa y diversión' },
  { name: 'Europa', count: '200+ paquetes', icon: '🗼', subtitle: 'Ciudades icónicas y circuitos' },
  { name: 'México', count: '95+ paquetes', icon: '🗿', subtitle: 'Caribe, cultura y gastronomía' },
  { name: 'Argentina', count: '150+ paquetes', icon: '🇦🇷', subtitle: 'Escapadas y viajes nacionales' },
  { name: 'Estados Unidos', count: '110+ paquetes', icon: '🗽', subtitle: 'Compras, parques y ciudades' }
] as const;
const destinationImages: Record<string, string> = {
  'Caribe':         '/videos/destinospop/caribe.jpg',
  'Brasil':         '/videos/destinospop/brasil.jpg',
  'Europa':         '/videos/destinospop/europa.jpg',
  'México':         '/videos/destinospop/mexico.jpg',
  'Argentina':      '/videos/destinospop/argentina.jpg',
  'Estados Unidos': '/videos/destinospop/estados-unidos.jpg',
};

function getRouteFromHash(hash: string): RouteKey {
  const cleaned = hash.replace('#', '');
  if (cleaned === 'ofertas') return 'ofertas';
  if (cleaned === 'argentina') return 'argentina';
  if (cleaned === 'quinceaneras') return 'quinceaneras';
  if (cleaned === 'experiencias') return 'experiencias';
  if (cleaned === 'cruceros') return 'cruceros';
  if (cleaned === 'blog') return 'blog';
  return 'home';
}

function useHashRoute() {
  const [route, setRoute] = useState<RouteKey>(() => getRouteFromHash(window.location.hash));

  useEffect(() => {
    const handler = () => setRoute(getRouteFromHash(window.location.hash));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}

function PackageCard({ pkg, accent = 'red', darkMode }: { pkg: TravelCard; accent?: Accent; darkMode: boolean }) {
  const badgeClass = accent === 'gold' || pkg.badge === 'Luxury'
    ? 'bg-gradient-to-r from-[var(--antares-gold)] to-[#b89060]'
    : accent === 'amber'
      ? 'bg-gradient-to-r from-amber-600 to-amber-500'
      : accent === 'rose'
        ? 'bg-gradient-to-r from-rose-500 to-pink-500'
        : 'bg-gradient-to-r from-red-600 to-red-500';

  const priceClass = accent === 'gold' || pkg.badge === 'Luxury'
    ? 'text-[var(--antares-gold)]'
    : accent === 'amber'
      ? 'text-amber-600'
      : accent === 'rose'
        ? 'text-rose-600'
        : 'text-red-600';

  const buttonClass = accent === 'gold' || pkg.badge === 'Luxury'
    ? 'from-[#C4A882] to-[#b89060] hover:from-[#b89972] hover:to-[#a17f57]'
    : accent === 'amber'
      ? 'from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600'
      : accent === 'rose'
        ? 'from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
        : 'from-red-600 to-red-500 hover:from-red-700 hover:to-red-600';

  const ringClass = accent === 'gold' || pkg.badge === 'Luxury' ? 'hover:ring-amber-200' : accent === 'amber' ? 'hover:ring-amber-200' : accent === 'rose' ? 'hover:ring-rose-200' : 'hover:ring-red-200';

  return (
    <div className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 ${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'} ${ringClass}`}>
      <div className="relative h-48 overflow-hidden">
        <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {pkg.badge && (
          <div className="absolute left-3 top-3">
            <span className={`${badgeClass} rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md`}>
              {pkg.badge}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="space-y-2">
          <h3 className={`min-h-[2.75rem] text-base font-bold leading-tight ${darkMode ? 'text-white' : 'text-stone-800'}`}>{pkg.title}</h3>
          <div className={`flex flex-wrap items-center gap-2 text-xs ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
            <span>📍 {pkg.destination}</span>
            <span>•</span>
            <span>🕐 {pkg.duration}</span>
            {pkg.departure && <><span>•</span><span>✈️ {pkg.departure}</span></>}
            {pkg.people && <><span>•</span><span>👥 {pkg.people}</span></>}
          </div>
          <div className="min-h-[4.5rem] space-y-1 pt-1">
            {pkg.includes && pkg.includes.slice(0, 3).map((item, i) => (
              <div key={i} className={`flex items-center gap-1.5 text-xs ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                <span className="text-red-500">✔</span>
                <span>{item}</span>
              </div>
            ))}
            {pkg.highlights && pkg.highlights.slice(0, 3).map((item, i) => (
              <div key={i} className={`flex items-center gap-1.5 text-xs ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                <span className="text-red-500">📍</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="min-h-[2.25rem] flex items-end">
            <span className={`origin-left text-2xl font-black transition-all group-hover:scale-110 ${priceClass}`}>{pkg.price}</span>
          </div>
          <a href={`https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsapp}&text=${encodeURIComponent(`Hola! Me interesa: ${pkg.title}`)}`} className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg ${buttonClass}`}>
            Consultar
          </a>
        </div>
      </div>
    </div>
  );
}

function AnimatedSection({ children, className = '', threshold = 0.15, ...props }: React.ComponentProps<'section'> & { threshold?: number }) {
  const { ref, inView } = useInView(threshold);
  return (
    <section ref={ref} {...props} className={`transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}>
      {children}
    </section>
  );
}

// ===== Pegá esto FUERA del App, junto a los otros datos =====

const destinationImages: Record<string, string> = {
  'Caribe':         '/videos/destinospop/caribe.jpg',
  'Brasil':         '/videos/destinospop/brasil.jpg',
  'Europa':         '/videos/destinospop/europa.jpg',
  'México':         '/videos/destinospop/mexico.jpg',
  'Argentina':      '/videos/destinospop/argentina.jpg',
  'Estados Unidos': '/videos/destinospop/estados-unidos.jpg',
};

function PopularDestinationsCarousel({
  darkMode,
  whatsappLink,
}: {
  darkMode: boolean;
  whatsappLink: (msg: string) => string;
}) {
  const [active, setActive] = useState(0);
  const total = popularDestinations.length;

  // Auto-avance sin dependencias que se recreen
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % total), 5800);
    return () => clearInterval(t);
  }, [total]);

  // Offset circular: -3 a +3
  const getOffset = (i: number) => {
    let off = i - active;
    if (off > total / 2) off -= total;
    if (off < -total / 2) off += total;
    return off;
  };

  // Transforma cada card según su posición relativa al activo
  const getStyle = (offset: number): React.CSSProperties => {
    const abs = Math.abs(offset);
    const sign = offset >= 0 ? 1 : -1;

    const configs: Record<number, {
      tx: number; ry: number; scale: number;
      opacity: number; z: number; brightness: number;
    }> = {
      0: { tx: 0,   ry: 0,   scale: 1,    opacity: 1,    z: 20, brightness: 1 },
      1: { tx: 48,  ry: -44, scale: 0.78, opacity: 0.72, z: 15, brightness: 0.62 },
      2: { tx: 76,  ry: -56, scale: 0.60, opacity: 0.38, z: 10, brightness: 0.45 },
    };

    if (abs > 2) return { opacity: 0, pointerEvents: 'none', zIndex: 0 };

    const c = configs[abs];
    return {
      transform: `translateX(${sign * c.tx}%) rotateY(${-sign * c.ry}deg) scale(${c.scale})`,
      opacity: c.opacity,
      zIndex: c.z,
      filter: `brightness(${c.brightness})`,
      cursor: abs > 0 ? 'pointer' : 'default',
      // Origen de rotación: cards derechas rotan desde su borde izquierdo y viceversa
      transformOrigin: offset > 0 ? 'left center' : offset < 0 ? 'right center' : 'center center',
      transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.65s ease, filter 0.65s ease',
      willChange: 'transform',
    };
  };

// Asumo que estas variables y funciones están definidas en el scope del componente:
// darkMode, popularDestinations, destinationImages, active, setActive,
// getOffset, getStyle, total, whatsappLink

return (
  <section className={`${darkMode ? 'bg-stone-950' : 'bg-stone-50'} py-16 md:py-24`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <h2 className={`text-3xl md:text-5xl font-black mb-3 ${darkMode ? 'text-white' : 'text-stone-900'}`}>
          Destinos <span style={{ color: 'var(--antares-red)' }}>Populares</span>
        </h2>
        <p className={`text-base md:text-lg ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
          Los más elegidos por nuestros viajeros
        </p>
      </div>
      
      {/* Stage 3D */}
      <div
        style={{ perspective: '1300px', perspectiveOrigin: '50% 45%' }}
        className="overflow-hidden"
      >
        <div
          className="relative flex items-center justify-center mx-auto"
          style={{
            height: '460px',
            maxWidth: '760px',
            transformStyle: 'preserve-3d',
          }}
        >
          {popularDestinations.map((dest, i) => {
            const offset = getOffset(i);
            if (Math.abs(offset) > 2) return null;

            // FIX: El div principal ahora envuelve todo el contenido de la tarjeta.
            // No se auto-cierra con "/>".
            return (
              <div
                key={dest.name}
                onClick={() => offset !== 0 && setActive(i)}
                // SUGERENCIA (a11y): Añadido para mejorar accesibilidad en tarjetas clickables
                role="button"
                tabIndex={offset !== 0 ? 0 : -1}
                aria-label={`Ver detalles de ${dest.name}`}
                className="absolute cursor-pointer"
                style={{
                  width: '320px',
                  height: '420px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: offset === 0
                    ? '0 32px 80px rgba(0,0,0,0.40)'
                    : '0 8px 24px rgba(0,0,0,0.18)',
                  ...getStyle(offset),
                }}
              >
                {/* --- INICIO DEL CONTENIDO DE LA TARJETA --- */}

                {/* Imagen local */}
                <img
                  src={destinationImages[dest.name]}
                  alt={dest.name}
                  // SUGERENCIA (Rendimiento): Carga diferida de imágenes
                  loading="lazy"
                  className="w-full h-full object-cover"
                  draggable={false}
                />

                {/* Overlay degradado */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)',
                  }}
                />

                {/* Contenido activo (solo para la tarjeta del centro) */}
                {offset === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p
                      className="text-[10px] font-bold uppercase tracking-[3px] mb-1.5"
                      // SUGERENCIA: Usar variable CSS si este color se repite
                      style={{ color: 'var(--antares-gold, #C4A882)' }}
                    >
                      Antares Selection
                    </p>
                    <h3 className="text-3xl font-black text-white mb-1 leading-tight">
                      {dest.name}
                    </h3>
                    <p className="text-white/55 text-xs mb-4 leading-snug">
                      {dest.count} · {dest.subtitle}
                    </p>
                    <a
                      href={whatsappLink(`Hola! Quiero ver paquetes para ${dest.name}`)}
                      target="_blank" // Es buena práctica abrir links externos en nueva pestaña
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-full transition-all hover:opacity-90 hover:shadow-lg"
                      style={{ background: 'linear-gradient(135deg, var(--antares-red), var(--antares-red-dark))' }}
                    >
                      Ver paquetes
                    </a>
                  </div>
                )}

                {/* Label en tarjetas laterales */}
                {offset !== 0 && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-sm drop-shadow">{dest.name}</p>
                    <p className="text-white/50 text-xs">{dest.count}</p>
                  </div>
                )}

                {/* --- FIN DEL CONTENIDO DE LA TARJETA --- */}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navegación */}
      <div className="flex flex-col items-center gap-5 mt-10">

        {/* Dots */}
        <div className="flex items-center gap-2">
          {popularDestinations.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? '28px' : '7px',
                height: '7px',
                background: i === active
                  ? 'var(--antares-red)'
                  : darkMode ? '#44403c' : '#d6d3d1',
              }}
              aria-label={`Ir a ${popularDestinations[i].name}`}
            />
          ))}
        </div>

        {/* Flechas */}
        <div className="flex gap-3">
          <button
            onClick={() => setActive(p => (p - 1 + total) % total)}
            // SUGERENCIA (a11y): Añadir aria-label
            aria-label="Destino anterior"
            className={`w-11 h-11 rounded-full border text-lg font-bold transition-all hover:scale-110 flex items-center justify-center
              ${darkMode
                ? 'border-stone-700 text-stone-300 hover:bg-stone-800'
                : 'border-stone-200 text-stone-600 hover:bg-white shadow-sm'
              }`}
          >‹</button>
          <button
            onClick={() => setActive(p => (p + 1) % total)}
            // SUGERENCIA (a11y): Añadir aria-label
            aria-label="Destino siguiente"
            className={`w-11 h-11 rounded-full border text-lg font-bold transition-all hover:scale-110 flex items-center justify-center
              ${darkMode
                ? 'border-stone-700 text-stone-300 hover:bg-stone-800'
                : 'border-stone-200 text-stone-600 hover:bg-white shadow-sm'
              }`}
          >›</button>
        </div>
      </div>

    </div>
  </section>
);

function ScrollPlane({ darkMode }: { darkMode: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [planePos, setPlanePos] = useState({ x: 40, y: 2, rotate: 90 });
  const [waypoints, setWaypoints] = useState<Array<{ x: number; y: number }>>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [tooltipIdx, setTooltipIdx] = useState<number | null>(null);
  const totalLenRef = useRef(0);

  const sections = [
    { id: 'hero', label: 'Inicio', icon: '🏠' },
    { id: 'paquetes', label: 'Paquetes', icon: '✈️' },
    { id: 'circuitos', label: 'Circuitos', icon: '🌍' },
    { id: 'grupales', label: 'Grupales', icon: '👥' },
    { id: 'experiencias-home', label: 'Lujo', icon: '⭐' },
  ];

  // Path sinusoidal — zigzag elegante
  const pathD = "M 40 2 C 40 10, 72 18, 72 28 C 72 38, 8 46, 8 56 C 8 66, 72 74, 72 84 C 72 92, 40 96, 40 98";

  // Inicializar al montar: calcular length total y posiciones de waypoints
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    totalLenRef.current = len;
    
    const wps = sections.map((_, i) => {
      const pt = path.getPointAtLength((i / (sections.length - 1)) * len);
      return { x: pt.x, y: pt.y };
    });
    setWaypoints(wps);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(Math.max(scrollTop / docH, 0), 1);

      const path = pathRef.current;
      const len = totalLenRef.current;
      if (path && len > 0) {
        const currentLen = p * len;
        const pt = path.getPointAtLength(currentLen);
        const nextPt = path.getPointAtLength(Math.min(currentLen + 3, len));
        const angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI);
        setPlanePos({ x: pt.x, y: pt.y, rotate: angle + 90 });
      }

      let cur = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.6) cur = i;
      });
      setActiveIdx(cur);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:block select-none"
      style={{ height: '58vh', width: '90px' }}
    >
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 80 100"
        preserveAspectRatio="none"
      >
        {/* Path base dashed */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke={darkMode ? '#3c3834' : '#e0ddd8'}
          strokeWidth="1.5"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />

        {/* Waypoint dots */}
        {waypoints.map((pos, i) => {
          const isVisited = i <= activeIdx;
          const isCurrent = i === activeIdx;
          return (
            <g key={i} style={{ cursor: 'pointer' }} onClick={() => document.getElementById(sections[i].id)?.scrollIntoView({ behavior: 'smooth' })}>
              {/* Hitbox invisible */}
              <circle cx={pos.x} cy={pos.y} r="10" fill="transparent" />
              
              {/* Pulse ring en activo */}
              {isCurrent && (
                <circle cx={pos.x} cy={pos.y} r="7" fill="none" stroke="#D94E3F" strokeWidth="1" opacity="0.4">
                  <animate attributeName="r" from="5" to="14" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Dot */}
              <circle
                cx={pos.x} cy={pos.y}
                r={isCurrent ? 5 : 3}
                fill={isVisited ? '#D94E3F' : (darkMode ? '#44403c' : '#d6d3d1')}
                style={{ transition: 'r 0.3s, fill 0.3s' }}
              />
            </g>
          );
        })}

        {/* Avión SVG con rotación siguiendo el path */}
        <g
          transform={`translate(${planePos.x}, ${planePos.y}) rotate(${planePos.rotate})`}
          style={{ transition: 'transform 0.1s linear' }}
        >
          {/* Sombra suave */}
          <circle cx="0.5" cy="1" r="9" fill="rgba(0,0,0,0.2)" />
          {/* Círculo fondo */}
          <circle cx="0" cy="0" r="9" fill="#D94E3F" />
          <circle cx="0" cy="0" r="9" fill="none" stroke="#B91C1C" strokeWidth="1.5" />
          {/* Avión - path SVG simplificado, apunta hacia arriba */}
          <path d="M0,-5 L2.5,3 L0,1.5 L-2.5,3 Z" fill="white" />
          <path d="M-5.5,1 L-1.5,0 L-1.5,2.5 Z" fill="white" opacity="0.85" />
          <path d="M5.5,1 L1.5,0 L1.5,2.5 Z" fill="white" opacity="0.85" />
          <path d="M-1.5,3.5 L0,3 L1.5,3.5 Z" fill="white" opacity="0.7" />
        </g>
      </svg>

      {/* Tooltips HTML (posicionados relativos al contenedor fixed) */}
      {waypoints.map((pos, i) =>
        tooltipIdx === i ? (
          <div
            key={i}
            className="absolute pointer-events-none z-50 bg-white text-stone-900 rounded-xl shadow-xl px-3 py-2 border border-stone-100 whitespace-nowrap text-xs font-bold"
            style={{
              right: '100%',
              top: `${(pos.y / 100) * 100}%`,
              transform: 'translateY(-50%)',
              marginRight: '10px',
            }}
          >
            {sections[i].icon} {sections[i].label}
            <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-r border-t border-stone-100 rotate-45" />
          </div>
        ) : null
      )}

      {/* Overlay invisible para hover tooltips */}
      {waypoints.map((pos, i) => (
        <div
          key={i}
          className="absolute w-6 h-6 cursor-pointer rounded-full"
          style={{
            left: `${(pos.x / 80) * 100}%`,
            top: `${(pos.y / 100) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onMouseEnter={() => setTooltipIdx(i)}
          onMouseLeave={() => setTooltipIdx(null)}
          onClick={() => document.getElementById(sections[i].id)?.scrollIntoView({ behavior: 'smooth' })}
        />
      ))}
    </div>
  );
}

function FooterShowcase({ darkMode, onOpenForm }: { darkMode: boolean; onOpenForm: () => void }) {
  const media = SITE_CONFIG.branding.footerShowcase;

  return (
    <section className="relative overflow-hidden py-14 md:py-20 text-white">
      <div className="absolute inset-0">
        {media.type === 'image' && <img src={media.image} alt="Antares showcase" className="h-full w-full object-cover" />}
        {media.type === 'video' && (
          <video className="h-full w-full object-cover" poster={media.poster} autoPlay muted loop playsInline preload="metadata">
            <source src={media.videoWebm} type="video/webm" />
            <source src={media.videoMp4} type="video/mp4" />
          </video>
        )}
        {media.type === 'gradient' && <div className={`h-full w-full ${darkMode ? 'bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950' : 'bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900'}`} />}
        <div className="absolute inset-0 bg-black/45" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="mb-4 text-3xl font-black italic leading-tight md:text-5xl">“{SITE_CONFIG.slogan}”</h2>
        <p className="mb-8 text-lg text-stone-200">Armemos tu viaje totalmente a medida</p>
        <button type="button" onClick={onOpenForm} className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-10 py-4 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-2xl">
          Completar formulario
        </button>
      </div>
    </section>
  );
}

function PageLayout({ title, subtitle, accent = 'red', cards, darkMode }: { title: string; subtitle: string; accent?: Accent; cards: TravelCard[]; darkMode: boolean }) {
  return (
    <main className={`${darkMode ? 'bg-stone-950' : 'bg-white'} min-h-[calc(100vh-80px)]`}>
      <section className={`py-12 md:py-16 ${darkMode ? 'bg-stone-900' : 'bg-stone-50'} border-b ${darkMode ? 'border-stone-800' : 'border-stone-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="#" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600">← Volver al inicio</a>
          <h1 className={`text-3xl md:text-5xl font-black ${darkMode ? 'text-white' : 'text-stone-900'} mb-3`}>{title}</h1>
          <p className={`${darkMode ? 'text-stone-400' : 'text-stone-600'} max-w-2xl text-base md:text-lg`}>{subtitle}</p>
        </div>
      </section>
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {cards.map((pkg, i) => (
              <div key={pkg.id} style={{ transitionDelay: `${i * 90}ms` }} className="transition-all duration-500 opacity-100 translate-y-0 h-full">
                <PackageCard pkg={pkg} accent={accent} darkMode={darkMode} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function BlogPage({ activeCont, setActiveCont, darkMode }: { activeCont: string; setActiveCont: (value: string) => void; darkMode: boolean }) {
  const filteredPosts = useMemo(() => blogPosts.filter((post) => post.continent === activeCont), [activeCont]);

  return (
    <main className={`${darkMode ? 'bg-stone-950' : 'bg-white'} min-h-[calc(100vh-80px)]`}>
      <section className={`py-12 md:py-16 ${darkMode ? 'bg-stone-900' : 'bg-stone-50'} border-b ${darkMode ? 'border-stone-800' : 'border-stone-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="#" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600">← Volver al inicio</a>
          <h1 className={`text-3xl md:text-5xl font-black ${darkMode ? 'text-white' : 'text-stone-900'} mb-3`}>Blog de Viajes</h1>
          <p className={`${darkMode ? 'text-stone-400' : 'text-stone-600'} max-w-2xl text-base md:text-lg`}>Notas, ideas y consejos para planificar mejor cada viaje.</p>
        </div>
      </section>
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {continents.map((c) => (
              <button key={c} onClick={() => setActiveCont(c)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${activeCont === c ? 'bg-[var(--antares-red)] text-white' : `${darkMode ? 'bg-stone-900 text-stone-300 border-stone-700' : 'bg-white text-stone-600 border-stone-200'} border hover:border-red-300`}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map((post) => (
              <article key={post.id} className={`${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'} overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
                <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
                <div className="space-y-3 p-5">
                  <div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                    <span>{post.continent}</span><span>•</span><span>{post.country}</span>
                  </div>
                  <h3 className={`text-lg font-bold leading-tight ${darkMode ? 'text-white' : 'text-stone-900'}`}>{post.title}</h3>
                  <p className={`${darkMode ? 'text-stone-400' : 'text-stone-600'} text-sm leading-relaxed`}>{post.excerpt}</p>
                  <div className={`flex items-center justify-between border-t pt-3 text-xs ${darkMode ? 'border-stone-800 text-stone-500' : 'border-stone-100 text-stone-400'}`}>
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const route = useHashRoute();
  const [searchData, setSearchData] = useState({ destination: '', departure: '', passengers: '2' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showTripForm, setShowTripForm] = useState(false);
  const [tripForm, setTripForm] = useState({ name: '', phone: '', destination: '', date: '', details: '' });
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [activeCont, setActiveCont] = useState('América');
  const activeHeroSlide = heroSlides[currentHeroSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('antares-dark', darkMode);
  }, [darkMode]);

  const wa = (text?: string) => `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsapp}${text ? `&text=${encodeURIComponent(text)}` : ''}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola! Quiero buscar viajes:${searchData.destination ? ` Destino: ${searchData.destination}` : ''}${searchData.departure ? ` Fecha: ${searchData.departure}` : ''}${searchData.passengers ? ` Pasajeros: ${searchData.passengers}` : ''}`;
    window.location.href = wa(msg);
  };

  const handleTripForm = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola! Quiero armar un viaje a medida.\n\nNombre: ${tripForm.name}\nTeléfono: ${tripForm.phone}\nDestino: ${tripForm.destination}\nFecha: ${tripForm.date}\nDetalles: ${tripForm.details}`;
    window.location.href = wa(msg);
    setShowTripForm(false);
  };

  const renderRoute = () => {
    switch (route) {
      case 'ofertas':
        return <PageLayout title="Ofertas Flash" subtitle="Promociones y tarifas especiales con vigencia limitada." cards={offersPackages} accent="red" darkMode={darkMode} />;
      case 'argentina':
        return <PageLayout title="Descubrí Argentina" subtitle="Escapadas y viajes nacionales con los mejores destinos del país." cards={argentinaPackages} accent="amber" darkMode={darkMode} />;
      case 'quinceaneras':
        return <PageLayout title="Quinceañeras" subtitle="Programas pensados para viajes inolvidables de quince." cards={quincePackages} accent="rose" darkMode={darkMode} />;
      case 'experiencias':
        return <PageLayout title="Experiencias de Lujo" subtitle="Propuestas premium y viajes exclusivos de otra categoría." cards={luxuryExperiences} accent="gold" darkMode={darkMode} />;
      case 'cruceros':
        return <PageLayout title="Cruceros" subtitle="Preparado para futuras conexiones con MSC y Organfur Central de Cruceros." cards={cruisePackages} accent="amber" darkMode={darkMode} />;
      case 'blog':
        return <BlogPage activeCont={activeCont} setActiveCont={setActiveCont} darkMode={darkMode} />;
      default:
        return (
          <main>
            <section id="hero" className="relative min-h-[80vh] overflow-hidden md:min-h-[85vh] flex items-center">
              <div className="absolute inset-0 z-0">
              {/* Poster base siempre visible como fallback */}
                <img src={heroSlides[0].poster} alt="Antares Viajes" className="absolute inset-0 h-full w-full object-cover"/>
                {/* Los 3 videos montados simultáneamente — solo el activo es visible */}
                {heroSlides.map((slide, i) => (<video key={slide.label} className="absolute inset-0 h-full w-full object-cover"
                    style={{opacity: i === currentHeroSlide ? 1 : 0, transition: 'opacity 1.4s ease-in-out', zIndex: i === currentHeroSlide ? 1 : 0,}}
                    poster={slide.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload={i === 0 ? 'auto' : 'none'}
>
                    <source src={slide.sources.mobileWebm} type="video/webm" media="(max-width: 767px)" />
                    <source src={slide.sources.mobileMp4} type="video/mp4" media="(max-width: 767px)" />
                    <source src={slide.sources.desktopWebm} type="video/webm" />
                    <source src={slide.sources.desktopMp4} type="video/mp4" />
                  </video>
                ))}
  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/12 to-transparent" style={{ zIndex: 2 }} />
  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" style={{ zIndex: 2 }} />
</div>

              <div className="relative z-10 max-w-7xl mx-auto w-full px-4 py-16 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  <h1 className="mb-8 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] sm:text-5xl md:text-7xl">
                    {SITE_CONFIG.slogan}
                  </h1>
                  <form onSubmit={handleSearch} className="rounded-2xl bg-white p-4 shadow-2xl md:p-5">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <div className="col-span-2 md:col-span-1">
                        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">Destino</label>
                        <input type="text" placeholder="¿A dónde?" value={searchData.destination} onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-red-400" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">Fecha</label>
                        <select value={searchData.departure} onChange={(e) => setSearchData({ ...searchData, departure: e.target.value })} className={`w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-red-400 ${searchData.departure ? 'text-stone-900' : 'text-stone-400'}`}>
                          <option value="">¿Cuándo?</option>
                          {departureMonthOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">Pasajeros</label>
                        <select value={searchData.passengers} onChange={(e) => setSearchData({ ...searchData, passengers: e.target.value })} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-red-400">
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5+">5+</option>
                        </select>
                      </div>
                      <div className="col-span-2 flex items-end md:col-span-1">
                        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:from-red-700 hover:to-red-600 hover:shadow-lg">
                          🔍 Buscar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </section>

            <PopularDestinationsCarousel darkMode={darkMode} whatsappLink={wa} />

            <AnimatedSection id="paquetes" className={`${darkMode ? 'bg-stone-900' : 'bg-stone-50'} py-14 md:py-20`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col items-center justify-center gap-4 text-center">
                  <h2 className={`mb-2 text-3xl font-black leading-tight md:text-5xl ${darkMode ? 'text-white' : 'text-stone-900'}`}>Paquetes <span className="text-red-600">Recomendados</span></h2>
                  <p className={`${darkMode ? 'text-stone-400' : 'text-stone-600'} text-base md:text-lg max-w-2xl`}>Las propuestas más elegidas para viajar en pareja, en familia o con amigos.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
                  {featuredPackages.map((pkg, i) => (
                    <div key={pkg.id} style={{ transitionDelay: `${i * 100}ms` }} className="h-full">
                      <PackageCard pkg={pkg} accent="red" darkMode={darkMode} />
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection id="circuitos" className={`${darkMode ? 'bg-stone-950' : 'bg-white'} py-14 md:py-20`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col items-center justify-center gap-4 text-center">
                  <h2 className={`mb-2 text-3xl font-black leading-tight md:text-5xl ${darkMode ? 'text-white' : 'text-stone-900'}`}>Circuitos <span className="text-red-600">Internacionales</span></h2>
                  <p className={`${darkMode ? 'text-stone-400' : 'text-stone-600'} text-base md:text-lg max-w-2xl`}>Rutas completas para descubrir grandes destinos con itinerarios armados.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
                  {circuitPackages.map((pkg, i) => (
                    <div key={pkg.id} style={{ transitionDelay: `${i * 100}ms` }} className="h-full">
                      <PackageCard pkg={pkg} accent="red" darkMode={darkMode} />
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection id="grupales" className={`${darkMode ? 'bg-stone-900' : 'bg-stone-50'} py-14 md:py-20`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                  <h2 className={`mb-2 text-3xl font-black md:text-5xl ${darkMode ? 'text-white' : 'text-stone-900'}`}>Viajes <span className="text-red-600">Grupales</span></h2>
                  <p className={`${darkMode ? 'text-stone-400' : 'text-stone-600'} mx-auto max-w-2xl text-base md:text-lg`}>Paquetes especiales para empresas, amigos y familias con tarifas pensadas para grupos.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
                  {groupPackages.map((pkg, i) => (
                    <div key={pkg.id} style={{ transitionDelay: `${i * 100}ms` }} className="h-full">
                      <PackageCard pkg={pkg} accent="red" darkMode={darkMode} />
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection id="experiencias-home" className={`${darkMode ? 'bg-stone-950' : 'bg-white'} py-14 md:py-20`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                  <h2 className={`mb-2 text-3xl font-black md:text-5xl ${darkMode ? 'text-white' : 'text-stone-900'}`}>Experiencias de <span style={{ color: 'var(--antares-gold)' }}>Lujo</span></h2>
                  <p className={`${darkMode ? 'text-stone-400' : 'text-stone-600'} mx-auto max-w-2xl text-base md:text-lg`}>Una categoría premium con servicio exclusivo y atención de primer nivel.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
                  {luxuryExperiences.map((pkg, i) => (
                    <div key={pkg.id} style={{ transitionDelay: `${i * 100}ms` }} className="h-full">
                      <PackageCard pkg={pkg} accent="gold" darkMode={darkMode} />
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="bg-stone-900 py-14 text-white md:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                  <h2 className="mb-3 text-3xl font-black md:text-5xl">¿Por qué <span style={{ color: 'var(--antares-gold)' }}>Antares</span>?</h2>
                </div>
                <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
                  {[
                    { icon: '🚨', title: 'Guardia 24hs', desc: 'Atención 24/7 para nuestros pasajeros en viaje.' },
                    { icon: '🏆', title: 'Trayectoria', desc: 'Más de 30 años nos avalan en experiencias.' },
                    { icon: '🎯', title: 'Atención Personalizada', desc: 'Asesoramiento cercano y pensado para cada cliente.' },
                    { icon: '🧳', title: 'Viajes a medida', desc: 'Armamos tu idea de viaje según tus tiempos, gustos y presupuesto.' }
                  ].map((item, idx) => (
                    <div key={item.title} style={{ transitionDelay: `${idx * 80}ms` }} className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/20">
                      <div className="mb-3 text-3xl md:text-4xl">{item.icon}</div>
                      <h3 className="mb-1 text-base font-bold md:text-lg">{item.title}</h3>
                      <p className="text-xs text-stone-300 md:text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </main>
        );
    }
  };

  return (
    <div className={`min-h-screen font-['Inter'] transition-colors duration-300 ${darkMode ? 'antares-dark bg-stone-950' : 'bg-white'}`}>
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-md shadow-sm transition-colors ${darkMode ? 'border-stone-800 bg-stone-950/95' : 'border-stone-100 bg-white/98'}`}>
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, var(--antares-red), var(--antares-gold), var(--antares-red))' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            <a href="#" className="flex shrink-0 items-center gap-2 md:gap-3">
              <span className={darkMode ? 'logo-safe rounded-xl bg-white px-2 py-1 shadow-sm' : ''}>
                <img src={SITE_CONFIG.branding.logo} alt={SITE_CONFIG.branding.logoAlt} className="h-14 w-auto md:h-20" />
              </span>
            </a>

            <div className="hidden items-center gap-1 xl:flex">
              <a href="#argentina" className={darkMode ? 'rounded-lg px-3 py-2 text-sm font-medium text-stone-300 transition-all hover:bg-stone-800 hover:text-red-400' : 'rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-red-50 hover:text-red-600'}>Argentina</a>
              <a href="#grupales" className={darkMode ? 'rounded-lg px-3 py-2 text-sm font-medium text-stone-300 transition-all hover:bg-stone-800 hover:text-red-400' : 'rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-red-50 hover:text-red-600'}>Grupales</a>
              <a href="#circuitos" className={darkMode ? 'rounded-lg px-3 py-2 text-sm font-medium text-stone-300 transition-all hover:bg-stone-800 hover:text-red-400' : 'rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-red-50 hover:text-red-600'}>Circuitos</a>
              <a href="#quinceaneras" className={darkMode ? 'rounded-lg px-3 py-2 text-sm font-medium text-stone-300 transition-all hover:bg-stone-800 hover:text-red-400' : 'rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-red-50 hover:text-red-600'}>Quinceañeras</a>
              <a href="#experiencias" className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--antares-gold)] transition-all hover:bg-amber-50/10">Experiencias</a>
              <a href="#ofertas" className="relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-amber-500 transition-all hover:bg-amber-50/10">
                🔥 <span className="hidden xl:inline">Ofertas</span>
                <span className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-red-500" />
              </a>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button type="button" onClick={() => setDarkMode(!darkMode)} className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition-all ${darkMode ? 'bg-white text-amber-500 hover:bg-stone-100' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`} aria-label="Cambiar modo claro u oscuro">
                {darkMode ? '☀️' : '🌙'}
              </button>
              <a href={wa()} className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-green-600 hover:shadow-lg md:px-5 md:text-sm">
                <svg className="h-3.5 w-3.5 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z"/></svg>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 transition-colors hover:bg-stone-100 xl:hidden">
                <svg className="h-5 w-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">{mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}</svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className={`space-y-1 border-t pb-4 pt-3 xl:hidden ${darkMode ? 'border-stone-800' : 'border-stone-100'}`}>
              {[
                { label: 'Argentina', href: '#argentina' },
                { label: 'Grupales', href: '#grupales' },
                { label: 'Circuitos', href: '#circuitos' },
                { label: 'Quinceañeras', href: '#quinceaneras' },
                { label: 'Experiencias', href: '#experiencias' },
                { label: 'Ofertas', href: '#ofertas' }
              ].map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`block rounded-lg px-4 py-2.5 font-medium transition-all ${darkMode ? 'text-stone-300 hover:bg-stone-800 hover:text-red-400' : 'text-stone-700 hover:bg-red-50 hover:text-red-600'}`}>
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {renderRoute()}

      {route === 'home' && <FooterShowcase darkMode={darkMode} onOpenForm={() => setShowTripForm(true)} />}

      <footer className="bg-stone-900 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className={darkMode ? 'logo-safe rounded-xl bg-white px-2 py-1 shadow-sm' : ''}>
                  <img src={SITE_CONFIG.branding.logo} alt={SITE_CONFIG.branding.logoAlt} className="h-16 w-auto" />
                </span>
              </div>
              <p className="mb-4 text-sm text-stone-500">Tu agencia de viajes de confianza. Los mejores destinos al mejor precio.</p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">Navegación</h4>
              <ul className="space-y-2.5">
                <li><a href="#argentina" className="text-sm text-stone-500 transition-colors hover:text-white">Argentina</a></li>
                <li><a href="#grupales" className="text-sm text-stone-500 transition-colors hover:text-white">Grupales</a></li>
                <li><a href="#circuitos" className="text-sm text-stone-500 transition-colors hover:text-white">Circuitos</a></li>
                <li><a href="#quinceaneras" className="text-sm text-stone-500 transition-colors hover:text-white">Quinceañeras</a></li>
                <li><a href="#experiencias" className="text-sm text-stone-500 transition-colors hover:text-white">Experiencias de Lujo</a></li>
                <li><a href="#cruceros" className="text-sm text-stone-500 transition-colors hover:text-white">Cruceros</a></li>
                <li><a href="#blog" className="text-sm text-stone-500 transition-colors hover:text-white">Blog de Viajes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">Contacto</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-stone-500">📞 +54 3446 429808</li>
                <li className="flex items-center gap-2 text-stone-500"><svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z"/></svg>+549 3446 528749</li>
                <li className="flex items-center gap-2 text-stone-500">✉️ {SITE_CONFIG.salesEmail}</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">Horarios</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li>Lun a Vie: 9:00 - 13:00 y 15:00 - 19:00</li>
                <li>Sábados: 9:00 - 13:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-6 text-center">
            <p className="text-sm text-stone-600">{SITE_CONFIG.slogan}</p>
            <p className="mt-2 text-xs text-stone-700">© 2026 Antares Viajes y Turismo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {route === 'home' && <ScrollPlane darkMode={darkMode} />}

      <a href={wa()} className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-2xl transition-all hover:scale-110 hover:bg-green-600">
        <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z"/></svg>
      </a>

      {showTripForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowTripForm(false)}>
          <div className={`${darkMode ? 'border-stone-700 bg-stone-900' : 'border-stone-200 bg-white'} w-full max-w-md rounded-2xl border p-6 shadow-2xl md:p-8`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-stone-900'}`}>Armá tu viaje a medida</h3>
              <button onClick={() => setShowTripForm(false)} className="text-stone-400 transition-colors hover:text-red-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="mb-5 text-sm text-stone-500">Completá el formulario y te respondemos por WhatsApp.</p>
            <form onSubmit={handleTripForm} className="space-y-4">
              <input required type="text" placeholder="Nombre completo" value={tripForm.name} onChange={(e) => setTripForm({ ...tripForm, name: e.target.value })} className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`} />
              <input required type="tel" placeholder="Teléfono" value={tripForm.phone} onChange={(e) => setTripForm({ ...tripForm, phone: e.target.value })} className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`} />
              <input type="text" placeholder="Destino deseado" value={tripForm.destination} onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })} className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`} />
              <select value={tripForm.date} onChange={(e) => setTripForm({ ...tripForm, date: e.target.value })} className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-700'}`}>
                <option value="">¿Cuándo?</option>
                {departureMonthOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <textarea rows={3} placeholder="Contanos tu idea de viaje" value={tripForm.details} onChange={(e) => setTripForm({ ...tripForm, details: e.target.value })} className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`} />
              <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-3 text-sm font-bold text-white transition-all hover:shadow-lg">Enviar por WhatsApp</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}