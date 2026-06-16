import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { useLeadModal } from "../../context/LeadModalContext";

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

const ANCHORS = [
  { label: "Destinos", href: "#destinos" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Luxury", href: "#premium" },
  { label: "Contacto", href: "#contacto" },
];

function smoothTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar({ darkMode, setDarkMode, navbarVisible }: NavbarProps) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [serviciosOpen, setServiciosOpen] = useState(false);
  const { openLead } = useLeadModal();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 transition-all duration-500"
        style={{
          transform: navbarVisible ? "translateY(0)" : "translateY(-110%)",
          background: solid ? "var(--nav-solid)" : "transparent",
          backdropFilter: solid ? "blur(16px) saturate(1.2)" : "none",
          borderBottom: solid ? "1px solid var(--nav-border)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex h-[76px] max-w-[1340px] items-center justify-between px-5 sm:px-8">
          {/* Wordmark */}
          <Link to="/" className="flex select-none flex-col leading-none">
            <span className="font-display t1 text-[1.5rem] font-semibold ls-mid sm:text-[1.7rem]">ANTARES</span>
            <span className="t-mut mt-[3px] text-[0.55rem] font-medium uppercase ls-wide">Viajes y Turismo</span>
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            <div className="relative" onMouseEnter={() => setServiciosOpen(true)} onMouseLeave={() => setServiciosOpen(false)}>
              <button className="t1 flex items-center gap-1 text-[0.82rem] font-medium tracking-wide">
                Servicios
                <Icon name="arrowDown" className="h-3.5 w-3.5" />
              </button>
              <div
                className="card-base absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 rounded-xl border-base p-2 shadow-xl transition-all"
                style={{
                  border: "1px solid var(--line)",
                  opacity: serviciosOpen ? 1 : 0,
                  visibility: serviciosOpen ? "visible" : "hidden",
                  transform: `translateX(-50%) translateY(${serviciosOpen ? "0" : "8px"})`,
                }}
              >
                {SERVICIOS.map((s) => (
                  <Link key={s.to} to={s.to}
                    className="t-soft block rounded-lg px-3 py-2 text-sm transition-colors hover:text-[var(--terra)]">
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>

            {ANCHORS.map((l) => (
              <a key={l.label} href={l.href}
                onClick={(e) => { e.preventDefault(); smoothTo(l.href); }}
                className="t1 group relative text-[0.82rem] font-medium tracking-wide">
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" style={{ background: "var(--terra)" }} />
              </a>
            ))}

            <button onClick={() => setDarkMode(!darkMode)} aria-label="Cambiar modo claro u oscuro"
              className="t1 grid h-11 w-11 place-items-center rounded-full transition-transform hover:scale-110">
              <Icon name={darkMode ? "sun" : "moon"} className="h-5 w-5" />
            </button>
            <button onClick={() => openLead({ context: "nav" })}
              className="rounded-full px-6 py-2.5 text-[0.82rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "var(--terra)", boxShadow: "0 8px 22px -10px rgba(217,78,63,.9)" }}>
              Ofertas
            </button>
          </nav>

          {/* Mobile triggers */}
          <div className="flex items-center gap-1 md:hidden">
            <button onClick={() => setDarkMode(!darkMode)} aria-label="Cambiar modo" className="t1 grid h-11 w-11 place-items-center rounded-full">
              <Icon name={darkMode ? "sun" : "moon"} className="h-5 w-5" />
            </button>
            <button onClick={() => setOpen(true)} aria-label="Abrir menú" className="t1 -mr-2 grid h-11 w-11 place-items-center">
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
          <span className="font-display text-[1.5rem] font-semibold ls-mid text-white">ANTARES</span>
          <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="-mr-2 grid h-11 w-11 place-items-center text-white">
            <Icon name="close" className="h-7 w-7" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-1 px-7">
          {SERVICIOS.map((s) => (
            <Link key={s.to} to={s.to} onClick={() => setOpen(false)} className="font-display text-[1.8rem] leading-[1.5] text-white/90">{s.label}</Link>
          ))}
          {ANCHORS.map((l) => (
            <a key={l.label} href={l.href} onClick={(e) => { e.preventDefault(); setOpen(false); setTimeout(() => smoothTo(l.href), 380); }}
              className="font-display text-[2rem] leading-[1.4] text-white">{l.label}</a>
          ))}
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
