import { Link } from "react-router-dom";
import { SITE_CONFIG } from "../../config/site";

const NAV_LINKS = [
  { label: "Argentina", to: "/argentina" },
  { label: "Grupales", to: "/grupales" },
  { label: "Circuitos", to: "/circuitos" },
  { label: "Quinceañeras", to: "/quinceaneras" },
  { label: "Experiencias de Lujo", to: "/experiencias" },
  { label: "Cruceros", to: "/cruceros" },
];

export function Footer() {
  return (
    <footer className="bg-stone-900 py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <div className="mb-4">
              <img src="/branding/Logo-footer.png" alt={SITE_CONFIG.branding.logoAlt} className="h-16 w-auto" />
            </div>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/antares_viajes/" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-stone-800 hover:bg-[#D94E3F] rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/antaresviajes" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-stone-800 hover:bg-[#D94E3F] rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">Navegación</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-stone-500 transition-colors hover:text-white">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">Antares</h4>
            <ul className="space-y-2.5 mb-4">
              <li><a href="#quienes-somos" className="text-sm text-stone-500 transition-colors hover:text-white">Quiénes Somos</a></li>
            </ul>
            <ul className="space-y-3 text-sm text-stone-500">
              <li>+54 3446 429808</li>
              <li>+549 3446 528749</li>
              <li>{SITE_CONFIG.salesEmail}</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">Horarios</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li>Lun a Vie: 9:00 - 13:00 y 15:00 - 19:00</li>
              <li>Sábados: 9:00 - 13:00</li>
              <li className="pt-2">
                <a href="https://maps.app.goo.gl/E8D3vAMZwhHRG8Rd7" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 group">
                  <span className="text-sm underline underline-offset-2 decoration-stone-700 group-hover:text-white group-hover:decoration-white transition-colors">
                    Churruarín 248
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">Info Útil</h4>
            <ul className="space-y-2.5">
              <li><Link to="/blog" className="text-sm text-stone-500 transition-colors hover:text-white">Blog de Viajes</Link></li>
              <li><Link to="/info-util" className="text-sm text-stone-500 transition-colors hover:text-white">Visas</Link></li>
              <li><Link to="/info-util" className="text-sm text-stone-500 transition-colors hover:text-white">Web Check-in</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">Legales</h4>
            <ul className="space-y-2.5">
              <li><Link to="/legales" className="text-sm text-stone-500 transition-colors hover:text-white leading-snug">Condiciones de Contratación</Link></li>
              <li><Link to="/legales" className="text-sm text-stone-500 transition-colors hover:text-white leading-snug">Botón de Arrepentimiento</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 text-center">
          <p className="text-sm text-stone-600">{SITE_CONFIG.slogan}</p>
          <p className="mt-2 text-xs text-stone-700">
            © 2026 Antares Viajes y Turismo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}