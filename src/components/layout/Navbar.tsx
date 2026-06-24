import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "../ui/Icon";
import { useLeadModal } from "../../context/LeadModalContext";
import { usePackages } from "../../data/packagesStore";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  navbarVisible: boolean;
}

type MenuItem = { label: string; to: string };
type Menu = { label: string; items: MenuItem[] };

/** Navegación principal: 3 grupos con desplegable. Cada item lleva a su subpágina. */
const MENUS: Menu[] = [
  {
    label: "Destinos",
    items: [
      { label: "Argentina", to: "/argentina" },
      { label: "Caribe & Centroamérica", to: "/caribe-centroamerica" },
      { label: "Exóticos", to: "/exoticos" },
      { label: "Europa", to: "/europa" },
      { label: "EEUU & Canadá", to: "/eeuu-canada" },
      { label: "Sudamérica", to: "/sudamerica" },
    ],
  },
  {
    label: "Explorar",
    items: [
      { label: "Cruceros", to: "/cruceros" },
      { label: "Circuitos", to: "/circuitos" },
      { label: "Grupales", to: "/grupales" },
      { label: "Quinceañeras", to: "/quinceaneras" },
    ],
  },
  {
    label: "Especiales",
    items: [
      { label: "Experiencias", to: "/experiencias" },
      { label: "Eventos", to: "/eventos" },
      { label: "Lujo", to: "/lujo" },
    ],
  },
];

// Logo completo "Antares Viajes y Turismo": variante para fondo claro / oscuro.
const LOGO_LIGHT = "/branding/logo-header1.png"; // texto rojo (transparente)
const LOGO_DARK = "/branding/logo-footer-full.png"; // texto blanco

export function Navbar({ darkMode, setDarkMode, navbarVisible }: NavbarProps) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>("Destinos");
  const { openLead } = useLeadModal();
  const { config } = usePackages();
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  // Al cambiar de ruta, cerrar cualquier menú abierto.
  useEffect(() => { setOpen(false); setOpenMenu(null); }, [pathname]);

  // Solo el home tiene hero oscuro detrás; en el resto la barra va sólida siempre.
  const isSolid = solid || pathname !== "/";
  const onDark = !isSolid || darkMode;
  const navColor = onDark ? "#F4EDE2" : "#1B1610";
  const logoSrc = (onDark ? config.logo_dark_path : config.logo_header_path) || (onDark ? LOGO_DARK : LOGO_LIGHT);

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 transition-all duration-500"
        style={{
          transform: navbarVisible ? "translateY(0)" : "translateY(-110%)",
          background: isSolid ? "var(--nav-solid)" : "transparent",
          backdropFilter: isSolid ? "blur(16px) saturate(1.2)" : "none",
          borderBottom: isSolid ? "1px solid var(--nav-border)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex h-[76px] max-w-[1340px] items-center justify-between px-5 sm:px-8">
          {/* Logo completo */}
          <Link to="/" className="flex shrink-0 items-center" aria-label="Antares Viajes y Turismo — Inicio">
            <img src={logoSrc} alt="Antares Viajes y Turismo" className="h-11 w-auto sm:h-[52px]" />
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-7 md:flex">
            {MENUS.map((menu) => {
              const isMenuOpen = openMenu === menu.label;
              return (
                <div
                  key={menu.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(menu.label)}
                  onMouseLeave={() => setOpenMenu((m) => (m === menu.label ? null : m))}
                >
                  <button
                    className="flex items-center gap-1 text-[0.82rem] font-medium tracking-wide transition-colors duration-300"
                    style={{ color: navColor }}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen}
                    onClick={() => setOpenMenu(isMenuOpen ? null : menu.label)}
                  >
                    {menu.label}
                    <Icon name="arrowDown" className={`h-3.5 w-3.5 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div
                    className="absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-3 transition-all duration-300"
                    style={{
                      opacity: isMenuOpen ? 1 : 0,
                      visibility: isMenuOpen ? "visible" : "hidden",
                      transform: `translateX(-50%) translateY(${isMenuOpen ? "0" : "6px"})`,
                    }}
                  >
                    <div className="card-base overflow-hidden rounded-2xl py-1.5 shadow-xl" style={{ border: "1px solid var(--line)" }}>
                      {menu.items.map((it) => (
                        <Link
                          key={it.to}
                          to={it.to}
                          className="t-soft block px-5 py-2.5 text-center text-sm transition-colors hover:text-[var(--terra)]"
                        >
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <Link
              to="/nosotros"
              className="group relative text-[0.82rem] font-medium tracking-wide transition-colors duration-300"
              style={{ color: navColor }}
            >
              Nosotros
              <span className="absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" style={{ background: "var(--terra)" }} />
            </Link>

            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Cambiar modo claro u oscuro"
              className="grid h-11 w-11 place-items-center rounded-full transition-transform hover:scale-110"
              style={{ color: navColor }}
            >
              <Icon name={darkMode ? "sun" : "moon"} className="h-5 w-5" />
            </button>
          </nav>

          {/* Mobile triggers */}
          <div className="flex items-center gap-1 md:hidden">
            <button onClick={() => setDarkMode(!darkMode)} aria-label="Cambiar modo" className="grid h-11 w-11 place-items-center rounded-full" style={{ color: navColor }}>
              <Icon name={darkMode ? "sun" : "moon"} className="h-5 w-5" />
            </button>
            <button onClick={() => setOpen(true)} aria-label="Abrir menú" className="-mr-2 grid h-11 w-11 place-items-center" style={{ color: navColor }}>
              <Icon name="menu" className="h-7 w-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-[60] flex flex-col md:hidden"
        style={{
          background: "#100D0B",
          transition: "opacity .45s var(--ease), visibility .45s",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-between px-5">
          <img src={config.logo_dark_path || LOGO_DARK} alt="Antares Viajes y Turismo" className="h-11 w-auto" />
          <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="-mr-2 grid h-11 w-11 place-items-center text-white">
            <Icon name="close" className="h-7 w-7" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-7 py-2">
          {MENUS.map((menu) => {
            const isGroupOpen = mobileGroup === menu.label;
            return (
              <div key={menu.label} style={{ borderBottom: "1px solid rgba(244,237,226,.1)" }}>
                <button
                  onClick={() => setMobileGroup(isGroupOpen ? null : menu.label)}
                  aria-expanded={isGroupOpen}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="font-display text-[1.55rem] leading-none text-white">{menu.label}</span>
                  <Icon name="arrowDown" className={`h-5 w-5 text-white/55 transition-transform duration-300 ${isGroupOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isGroupOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col pb-3">
                        {menu.items.map((it) => (
                          <Link
                            key={it.to}
                            to={it.to}
                            onClick={() => setOpen(false)}
                            className="py-2.5 pl-1 text-[1.05rem] text-white/70 transition-colors active:text-[var(--terra-soft)]"
                          >
                            {it.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <Link
            to="/nosotros"
            onClick={() => setOpen(false)}
            className="flex items-center py-4 font-display text-[1.55rem] leading-none text-white"
            style={{ borderBottom: "1px solid rgba(244,237,226,.1)" }}
          >
            Nosotros
          </Link>
        </nav>

        <div className="shrink-0 px-7 pb-10 pt-4">
          <button
            onClick={() => { setOpen(false); openLead({ context: "nav-mobile" }); }}
            className="block w-full rounded-full py-4 text-center text-base font-semibold text-white"
            style={{ background: "var(--terra)" }}
          >
            Consultar
          </button>
        </div>
      </div>
    </>
  );
}
