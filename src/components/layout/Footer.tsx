import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { SITE_CONFIG } from "../../config/site";
import { usePackages } from "../../data/packagesStore";

const NAVEGACION = [
  { label: "Argentina", to: "/argentina" },
  { label: "Grupales", to: "/grupales" },
  { label: "Circuitos", to: "/circuitos" },
  { label: "Quinceañeras", to: "/quinceaneras" },
  { label: "Experiencias de Lujo", to: "/experiencias" },
  { label: "Cruceros", to: "/cruceros" },
];

const INFO_UTIL = [
  { label: "Blog de Viajes", to: "/blog" },
  { label: "Visas", to: "/info-util" },
  { label: "Web Check-in", to: "/info-util" },
];

const LEGALES = [
  { label: "Condiciones de Contratación", to: "/legales" },
  { label: "Botón de Arrepentimiento", to: "/legales" },
];

const linkCls = "text-[0.9rem] transition-colors hover:text-[var(--terra-soft)]";
const linkStyle = { color: "rgba(244,237,226,.7)" } as const;
const headCls = "text-[0.68rem] font-semibold uppercase ls-wide";
const headStyle = { color: "rgba(244,237,226,.4)" } as const;

function LinkColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className={headCls} style={headStyle}>{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className={linkCls} style={linkStyle}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { config } = usePackages();
  return (
    <footer id="contacto" style={{ background: "#090807", color: "#F4EDE2" }}>
      <div className="mx-auto max-w-[1340px] px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Marca */}
          <div className="md:col-span-3">
            <Link to="/" className="inline-flex">
              <img src={config.logo_footer_path || "/branding/Logo-footer.webp"} alt="Antares Viajes y Turismo" className="h-16 w-auto sm:h-20" />
            </Link>
            <p className="mt-5 max-w-[20rem] text-[0.9rem] leading-relaxed text-pretty" style={{ color: "rgba(244,237,226,.45)" }}>
              Más de 25 años en Gualeguaychú, Entre Ríos. Legajo EVT habilitado.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {([
                ["whatsapp", `https://wa.me/${SITE_CONFIG.whatsapp}`],
                ["instagram", "https://www.instagram.com/antares_viajes/"],
                ["facebook", "https://www.facebook.com/antaresviajes"],
              ] as const).map(([ic, href]) => (
                <a key={ic} href={href} target="_blank" rel="noopener noreferrer" aria-label={ic}
                  className="grid h-11 w-11 place-items-center rounded-full transition-all duration-300 hover:-translate-y-0.5"
                  style={{ border: "1px solid rgba(244,237,226,.16)", color: "rgba(244,237,226,.8)" }}>
                  <Icon name={ic} className="h-[1.15rem] w-[1.15rem]" />
                </a>
              ))}
            </div>
          </div>

          {/* Columnas */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-9 lg:gap-6">
            <LinkColumn title="Navegación" links={NAVEGACION} />

            <div className="min-w-0">
              <h4 className={headCls} style={headStyle}>Antares</h4>
              <ul className="mt-4 space-y-2.5">
                <li><Link to="/nosotros" className={linkCls} style={linkStyle}>Quiénes Somos</Link></li>
                <li><a href="tel:+543446429808" className={linkCls} style={linkStyle}>+54 3446 42-9808</a></li>
                <li><a href="tel:+5493446528749" className={linkCls} style={linkStyle}>+54 9 3446 52-8749</a></li>
                <li><a href={`mailto:${SITE_CONFIG.salesEmail}`} className={`${linkCls} break-words`} style={linkStyle}>{SITE_CONFIG.salesEmail}</a></li>
              </ul>
            </div>

            <div>
              <h4 className={headCls} style={headStyle}>Horarios</h4>
              <ul className="mt-4 space-y-2.5 text-[0.9rem]" style={linkStyle}>
                <li>Lun a Vie: 9:00–13:00 y 15:00–19:00</li>
                <li>Sábados: 9:00–13:00</li>
                <li>
                  <a href="https://www.google.com/maps/search/?api=1&query=Churruar%C3%ADn+248+Gualeguaych%C3%BA"
                    target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-[var(--terra-soft)]">
                    <Icon name="pin" className="h-[1.05rem] w-[1.05rem] shrink-0" />Churruarín 248
                  </a>
                </li>
              </ul>
            </div>

            <LinkColumn title="Info útil" links={INFO_UTIL} />

            <div className="sm:col-span-2 md:col-span-1">
              <LinkColumn title="Legales" links={LEGALES} />
            </div>
          </div>
        </div>

        {/* Slogan */}
        <p className="font-display mt-14 text-center text-[1.05rem] italic" style={{ color: "rgba(244,237,226,.55)" }}>
          “{SITE_CONFIG.slogan}”
        </p>
      </div>

      <div style={{ borderTop: "1px solid rgba(244,237,226,.08)" }}>
        <div className="mx-auto flex max-w-[1340px] flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row sm:px-8">
          <p className="text-[0.8rem]" style={{ color: "rgba(244,237,226,.35)" }}>© 2026 Antares Viajes y Turismo. Todos los derechos reservados.</p>
          <p className="text-[0.8rem]" style={{ color: "rgba(244,237,226,.35)" }}>Gualeguaychú · Argentina</p>
        </div>
      </div>
    </footer>
  );
}
