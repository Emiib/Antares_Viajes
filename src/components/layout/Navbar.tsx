import { useState } from "react";
import { SITE_CONFIG } from "../../config/site";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  navbarVisible: boolean;
}

export function Navbar({ darkMode, setDarkMode, navbarVisible }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 backdrop-blur-md shadow-md transition-all duration-300 ${
        navbarVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-24 opacity-0 pointer-events-none"
      } rounded-[32px] ${
        darkMode
          ? "border border-stone-800/50 bg-stone-950/30"
          : "border border-stone-200/50 bg-white/20"
      }`}
    >
      <div className="px-6 sm:px-10 lg:px-12 py-2 md:py-3">
        <div className="flex h-20 items-center justify-between md:h-24">
          <a href="#" className="flex shrink-0 items-center gap-2 md:gap-3">
            <img
              src={darkMode ? "/branding/logo-dark.png" : SITE_CONFIG.branding.logo}
              alt={SITE_CONFIG.branding.logoAlt}
              className="h-20 w-auto md:h-28"
            />
          </a>

          <div className="hidden items-center gap-1 xl:flex">
            {[
              { label: "Argentina", href: "#argentina" },
              { label: "Grupales", href: "#grupales" },
              { label: "Circuitos", href: "#circuitos" },
              { label: "Quinceañeras", href: "#quinceaneras" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={
                  darkMode
                    ? "rounded-lg px-3 py-2 text-sm font-medium text-stone-300 transition-all hover:bg-stone-800 hover:text-red-400"
                    : "rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-red-50 hover:text-red-600"
                }
              >
                {item.label}
              </a>
            ))}
            <a
              href="#experiencias"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--antares-gold)] transition-all hover:bg-amber-50/10"
            >
              Lujo
            </a>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition-all ${
                darkMode
                  ? "bg-white text-amber-500 hover:bg-stone-100"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
              aria-label="Cambiar modo claro u oscuro"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <a
              href="#ofertas"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg transition-all hover:scale-110 group"
              aria-label="Ofertas"
            >
              🔥
              <span className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-red-500" />
              <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-stone-900 text-white rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Ofertas
                <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-stone-900 rotate-45" />
              </div>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 transition-colors hover:bg-stone-100 xl:hidden"
            >
              <svg className="h-5 w-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`space-y-1 border-t pb-4 pt-3 xl:hidden ${darkMode ? "border-stone-800" : "border-stone-100"}`}>
            {[
              { label: "Argentina", href: "#argentina" },
              { label: "Grupales", href: "#grupales" },
              { label: "Circuitos", href: "#circuitos" },
              { label: "Quinceañeras", href: "#quinceaneras" },
              { label: "Lujo", href: "#experiencias" },
              { label: "Ofertas", href: "#ofertas" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-4 py-2.5 font-medium transition-all ${
                  darkMode
                    ? "text-stone-300 hover:bg-stone-800 hover:text-red-400"
                    : "text-stone-700 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}