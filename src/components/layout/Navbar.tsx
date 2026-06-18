import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { useLeadModal } from "../../context/LeadModalContext";
import { usePackages } from "../../data/packagesStore";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  navbarVisible: boolean;
}

const SERVICIOS = [
  { label: "Argentina", to: "/argentina" },
  { label: "Circuitos", to: "/circuitos" },
  { label: "Cruceros", to: "/cruceros" },
  { label: "Quinceañeras", to: "/quinceaneras" },
];

type NavItem = { label: string; href?: string; to?: string };
const LINKS: NavItem[] = [
  { label: "Destinos", href: "#destinos" },
  { label: "Luxury", href: "#premium" },
  { label: "Nosotros", to: "/nosotros" },
  { label: "Contacto", href: "#contacto" },
];

/** Va a la sección si está en la página actual; si no, navega al home con el hash. */
function goAnchor(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.location.href = "/" + href;
}

export function Navbar({ darkMode, setDarkMode, navbarVisible }: NavbarProps) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [serviciosOpen, setServiciosOpen] = useState(false);
  const { openLead } = useLeadModal();
  const { config } = usePackages();
  const ISOTIPO = "/branding/Logo-footer.webp";
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  // Solo el home tiene hero oscuro detrás; en el resto la barra va sólida siempre.
  const isSolid = solid || pathname !== "/";
  const onDark = !isSolid || darkMode;
  const navColor = onDark ? "#F4EDE2" : "#1B1610";
  const logoSrc = (onDark ? config.logo_dark_path : config.logo_header_path) || ISOTIPO;

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
          {/* Isologo */}
          <Link to="/" className="flex shrink-0 items-center">
            <img src={logoSrc} alt="Antares Viajes y Turismo" className="h-12 w-auto sm:h-14" />
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            <div className="relative" onMouseEnter={() => setServiciosOpen(true)} onMouseLeave={() => setServiciosOpen(false)}>
              <button className="flex items-center gap-1 text-[0.82rem] font-medium tracking-wide transition-colors duration-300" style={{ color: navColor }}>
                Servicios
                <Icon name="arrowDown" className={`h-3.5 w-3.5 transition-transform duration-300 ${serviciosOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                className="absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 pt-3 transition-all duration-300"
                style={{
                  opacity: serviciosOpen ? 1 : 0,
                  visibility: serviciosOpen ? "visible" : "hidden",
                  transform: `translateX(-50%) translateY(${serviciosOpen ? "0" : "6px"})`,
                }}
              >
                <div className="card-base overflow-hidden rounded-2xl py-1.5 shadow-xl" style={{ border: "1px solid var(--line)" }}>
                  {SERVICIOS.map((s) => (
                    <Link key={s.to} to={s.to}
                      className="t-soft block px-4 py-2.5 text-center text-sm transition-colors hover:text-[var(--terra)]">
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {LINKS.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} className="group relative text-[0.82rem] font-medium tracking-wide transition-colors duration-300" style={{ color: navColor }}>
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" style={{ background: "var(--terra)" }} />
                </Link>
              ) : (
                <a key={l.label} href={l.href} onClick={(e) => { e.preventDefault(); goAnchor(l.href!); }}
                  className="group relative text-[0.82rem] font-medium tracking-wide transition-colors duration-300" style={{ color: navColor }}>
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" style={{ background: "var(--terra)" }} />
                </a>
              )
            )}

            <button onClick={() => setDarkMode(!darkMode)} aria-label="Cambiar modo claro u oscuro"
              className="grid h-11 w-11 place-items-center rounded-full transition-transform hover:scale-110" style={{ color: navColor }}>
              <Icon name={darkMode ? "sun" : "moon"} className="h-5 w-5" />
            </button>
            <Link to="/paquetes?filtro=ofertas"
              className="rounded-full px-6 py-2.5 text-[0.82rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "var(--terra)", boxShadow: "0 8px 22px -10px rgba(217,78,63,.9)" }}>
              Ofertas
            </Link>
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
      <div className="fixed inset-0 z-[60] flex flex-col md:hidden"
        style={{
          background: "#100D0B",
          transition: "opacity .5s var(--ease), visibility .5s",
          opacity: open ? 1 : 0, visibility: open ? "visible" : "hidden", pointerEvents: open ? "auto" : "none",
        }}>
        <div className="flex h-[76px] items-center justify-between px-5">
          <img src={config.logo_dark_path || ISOTIPO} alt="Antares Viajes y Turismo" className="h-11 w-auto" />
          <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="-mr-2 grid h-11 w-11 place-items-center text-white">
            <Icon name="close" className="h-7 w-7" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-7 py-4">
          <span className="mb-1 text-[0.7rem] font-semibold uppercase ls-wide text-white/40">Servicios</span>
          {SERVICIOS.map((s) => (
            <Link key={s.to} to={s.to} onClick={() => setOpen(false)} className="font-display text-[1.5rem] leading-[1.5] text-white/90">{s.label}</Link>
          ))}
          <span className="mb-1 mt-5 text-[0.7rem] font-semibold uppercase ls-wide text-white/40">Explorar</span>
          {LINKS.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="font-display text-[1.7rem] leading-[1.4] text-white">{l.label}</Link>
            ) : (
              <a key={l.label} href={l.href} onClick={(e) => { e.preventDefault(); setOpen(false); setTimeout(() => goAnchor(l.href!), 380); }}
                className="font-display text-[1.7rem] leading-[1.4] text-white">{l.label}</a>
            )
          )}
          <Link to="/paquetes?filtro=ofertas" onClick={() => setOpen(false)} className="font-display text-[1.7rem] leading-[1.4]" style={{ color: "var(--terra-soft)" }}>Ofertas</Link>
        </nav>
        <div className="px-7 pb-12">
          <button onClick={() => { setOpen(false); openLead({ context: "nav-mobile" }); }}
            className="block w-full rounded-full py-4 text-center text-base font-semibold text-white" style={{ background: "var(--terra)" }}>
            Consultar
          </button>
        </div>
      </div>
    </>
  );
}
