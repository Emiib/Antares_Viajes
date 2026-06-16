import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { SITE_CONFIG } from "../../config/site";

type FootLink = { label: string; href?: string; to?: string };

const EXPLORAR: FootLink[] = [
  { label: "Servicios", href: "#servicios" },
  { label: "Destinos", href: "#destinos" },
  { label: "Experiencias Luxury", href: "#premium" },
  { label: "Notas de viaje", to: "/blog" },
];
const EMPRESA: FootLink[] = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
  { label: "Legales", to: "/legales" },
];

export function Footer() {
  const wa = `https://wa.me/${SITE_CONFIG.whatsapp}`;
  return (
    <footer id="contacto" style={{ background: "#090807", color: "#F4EDE2" }}>
      <div className="mx-auto grid max-w-[1340px] grid-cols-2 gap-10 px-5 py-16 sm:px-8 md:grid-cols-12">
        <div className="col-span-2 md:col-span-5">
          <span className="font-display block text-2xl font-semibold ls-mid">ANTARES</span>
          <span className="text-[0.56rem] font-medium uppercase ls-wide" style={{ color: "rgba(244,237,226,.45)" }}>Viajes y Turismo</span>
          <p className="mt-5 max-w-[22rem] text-[0.92rem] leading-relaxed text-pretty" style={{ color: "rgba(244,237,226,.45)" }}>
            Agencia de viajes con más de 30 años en Gualeguaychú, Entre Ríos. Legajo EVT habilitado.
          </p>
          <div className="mt-7 flex items-center gap-3">
            {([["whatsapp", wa], ["instagram", "https://www.instagram.com/antares_viajes/"], ["facebook", "https://www.facebook.com/antaresviajes"]] as const).map(([ic, href]) => (
              <a key={ic} href={href} target="_blank" rel="noopener noreferrer" aria-label={ic}
                className="grid h-11 w-11 place-items-center rounded-full transition-all duration-300 hover:-translate-y-0.5"
                style={{ border: "1px solid rgba(244,237,226,.16)", color: "rgba(244,237,226,.8)" }}>
                <Icon name={ic} className="h-[1.15rem] w-[1.15rem]" />
              </a>
            ))}
          </div>
        </div>

        {[{ title: "Explorar", links: EXPLORAR }, { title: "Empresa", links: EMPRESA }].map((col) => (
          <div key={col.title} className="md:col-span-2">
            <h4 className="text-[0.68rem] font-semibold uppercase ls-wide" style={{ color: "rgba(244,237,226,.4)" }}>{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link to={l.to} className="text-[0.9rem] transition-colors hover:text-[var(--terra-soft)]" style={{ color: "rgba(244,237,226,.7)" }}>{l.label}</Link>
                  ) : (
                    <a href={l.href} className="text-[0.9rem] transition-colors hover:text-[var(--terra-soft)]" style={{ color: "rgba(244,237,226,.7)" }}>{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-3">
          <h4 className="text-[0.68rem] font-semibold uppercase ls-wide" style={{ color: "rgba(244,237,226,.4)" }}>Contacto</h4>
          <ul className="mt-4 space-y-3.5" style={{ color: "rgba(244,237,226,.7)" }}>
            <li className="flex items-start gap-3 text-[0.9rem]"><Icon name="pin" className="mt-0.5 h-[1.15rem] w-[1.15rem] shrink-0" />Gualeguaychú, Entre Ríos</li>
            <li className="flex items-center gap-3 text-[0.9rem]"><Icon name="phone" className="h-[1.15rem] w-[1.15rem] shrink-0" />+54 9 3446 52-8749</li>
            <li className="flex items-center gap-3 text-[0.9rem]"><Icon name="mail" className="h-[1.15rem] w-[1.15rem] shrink-0" />{SITE_CONFIG.salesEmail}</li>
          </ul>
        </div>
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
