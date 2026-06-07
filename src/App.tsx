import React, { useEffect, useMemo, useRef, useState } from "react";
import { blogPosts, continents } from "./data/blog";
import { useInView } from "./hooks/useInView";
import type { RouteKey, Accent, TravelCard } from "./types";
import { SITE_CONFIG, heroSlides } from "./config/site";
import { departureMonthOptions } from "./data/dates";
import {
  offersPackages,
  featuredPackages,
  argentinaPackages,
  circuitPackages,
  groupPackages,
  quincePackages,
  luxuryExperiences,
  cruisePackages,
  getAllPackages,
} from "./data/packages";
import { popularDestinations, destinationImages } from "./data/destinations";
import { AdminPanel } from "./components/AdminPanel";

function getRouteFromHash(hash: string): RouteKey {
  const cleaned = hash.replace("#", "").split("/")[0];
  if (cleaned === "ofertas") return "ofertas";
  if (cleaned === "argentina") return "argentina";
  if (cleaned === "quinceaneras") return "quinceaneras";
  if (cleaned === "experiencias") return "experiencias";
  if (cleaned === "cruceros") return "cruceros";
  if (cleaned === "blog") return "blog";
  if (cleaned === "infoUtil") return "infoUtil";
  if (cleaned === "legales") return "legales";
  if (cleaned === "grupales") return "grupales";
  if (cleaned === "circuitos") return "circuitos";
  if (cleaned === "package-detail") return "package-detail";
  if (cleaned === "admin") return "admin";
  return "home";
}

function useHashRoute() {
  const [route, setRoute] = useState<RouteKey>(() =>
    getRouteFromHash(window.location.hash),
  );
  const [packageId, setPackageId] = useState<string | null>(() => {
    const hash = window.location.hash.replace("#", "");
    const parts = hash.split("/");
    return parts[0] === "package-detail" ? parts[1] || null : null;
  });

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace("#", "");
      setRoute(getRouteFromHash(window.location.hash));
      const parts = hash.split("/");
      setPackageId(parts[0] === "package-detail" ? parts[1] || null : null);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return { route, packageId };
}

function PackageCard({
  pkg,
  accent = "red",
  darkMode,
}: {
  pkg: TravelCard;
  accent?: Accent;
  darkMode: boolean;
}) {
  const badgeClass =
    accent === "gold" || pkg.badge === "Luxury"
      ? "bg-gradient-to-r from-[var(--antares-gold)] to-[#b89060]"
      : accent === "amber"
        ? "bg-gradient-to-r from-amber-600 to-amber-500"
        : accent === "rose"
          ? "bg-gradient-to-r from-rose-500 to-pink-500"
          : "bg-gradient-to-r from-red-600 to-red-500";

  const priceClass =
    accent === "gold" || pkg.badge === "Luxury"
      ? "text-[var(--antares-gold)]"
      : accent === "amber"
        ? "text-amber-600"
        : accent === "rose"
          ? "text-rose-600"
          : "text-red-600";

  const buttonClass =
    accent === "gold" || pkg.badge === "Luxury"
      ? "from-[#C4A882] to-[#b89060] hover:from-[#b89972] hover:to-[#a17f57]"
      : accent === "amber"
        ? "from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600"
        : accent === "rose"
          ? "from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          : "from-red-600 to-red-500 hover:from-red-700 hover:to-red-600";

  const ringClass =
    accent === "gold" || pkg.badge === "Luxury"
      ? "hover:ring-amber-200"
      : accent === "amber"
        ? "hover:ring-amber-200"
        : accent === "rose"
          ? "hover:ring-rose-200"
          : "hover:ring-red-200";

  return (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"} ${ringClass}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {pkg.badge && (
          <div className="absolute left-3 top-3">
            <span
              className={`${badgeClass} rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md`}
            >
              {pkg.badge}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="space-y-2">
          <h3
            className={`min-h-[2.75rem] text-base font-bold leading-tight ${darkMode ? "text-white" : "text-stone-800"}`}
          >
            {pkg.title}
          </h3>
          <div
            className={`flex flex-wrap items-center gap-2 text-xs ${darkMode ? "text-stone-400" : "text-stone-500"}`}
          >
            <span>📍 {pkg.destination}</span>
            <span>•</span>
            <span>🕐 {pkg.duration}</span>
            {pkg.departure && (
              <>
                <span>•</span>
                <span>✈️ {pkg.departure}</span>
              </>
            )}
            {pkg.people && (
              <>
                <span>•</span>
                <span>👥 {pkg.people}</span>
              </>
            )}
          </div>
          <div className="min-h-[4.5rem] space-y-1 pt-1">
            {pkg.includes &&
              pkg.includes.slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 text-xs ${darkMode ? "text-stone-400" : "text-stone-600"}`}
                >
                  <span className="text-red-500">✔</span>
                  <span>{item}</span>
                </div>
              ))}
            {pkg.highlights &&
              pkg.highlights.slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 text-xs ${darkMode ? "text-stone-400" : "text-stone-600"}`}
                >
                  <span className="text-red-500">📍</span>
                  <span>{item}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="min-h-[2.25rem] flex items-end">
            <span
              className={`origin-left text-2xl font-black transition-all group-hover:scale-110 ${priceClass}`}
            >
              {pkg.price}
            </span>
          </div>
          <a
            href={`#package-detail/${pkg.id}`}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg ${buttonClass}`}
          >
            Consultar
          </a>
        </div>
      </div>
    </div>
  );
}

function AnimatedSection({
  children,
  className = "",
  threshold = 0.15,
  ...props
}: React.ComponentProps<"section"> & { threshold?: number }) {
  const { ref, inView } = useInView(threshold);
  return (
    <section
      ref={ref}
      {...props}
      className={`transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className}`}
    >
      {children}
    </section>
  );
}

function PopularDestinationsCarousel(props: {
  darkMode: boolean;
  whatsappLink: (msg: string) => string;
}) {
  const { darkMode, whatsappLink } = props;

  const [active, setActive] = useState(0);
  const total = popularDestinations.length;

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % total), 5800);
    return () => clearInterval(t);
  }, [total]);

  const getOffset = (i: number) => {
    let off = i - active;
    if (off > total / 2) off -= total;
    if (off < -total / 2) off += total;
    return off;
  };

  const getStyle = (offset: number): React.CSSProperties => {
    const abs = Math.abs(offset);
    const sign = offset >= 0 ? 1 : -1;

const configs: Record<
      number,
      {
        tx: number;
        ry: number;
        scale: number;
        opacity: number;
        z: number;
        brightness: number;
      }
    > = {
      0: { tx: 0, ry: 0, scale: 1, opacity: 1, z: 20, brightness: 1 },
      1: {
        tx: 52,
        ry: -46,
        scale: 0.76,
        opacity: 0.45,
        z: 5,
        brightness: 0.48,
      },
      2: {
        tx: 80,
        ry: -58,
        scale: 0.58,
        opacity: 0.15,
        z: 1,
        brightness: 0.3,
      },
    };

    if (abs > 2) return { opacity: 0, pointerEvents: "none", zIndex: 0 };

    const c = configs[abs];
    return {
      transform: `translateX(${sign * c.tx}%) rotateY(${-sign * c.ry}deg) scale(${c.scale})`,
      opacity: c.opacity,
      zIndex: c.z,
      filter: `brightness(${c.brightness})`,
      cursor: abs > 0 ? "pointer" : "default",
      transformOrigin:
        offset > 0
          ? "left center"
          : offset < 0
            ? "right center"
            : "center center",
      transition:
        "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.65s ease, filter 0.65s ease",
      willChange: "transform",
    };
  };

  return (
    <section
      className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} py-16 md:py-24`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2
            className={`text-4xl md:text-6xl font-black mb-3 ${darkMode ? "text-white" : "text-stone-900"}`}
          >
            Destinos{" "}
            <span style={{ color: "var(--antares-red)" }}>Populares</span>
          </h2>
          <p
            className={`text-base md:text-lg ${darkMode ? "text-stone-400" : "text-stone-500"}`}
          >
            Los más elegidos por nuestros viajeros
          </p>
        </div>

        <div
          style={{ perspective: "1300px", perspectiveOrigin: "50% 45%" }}
          className="overflow-hidden"
        >
          <div
            className="relative flex items-center justify-center mx-auto"
            style={{
              height: "500px",
              maxWidth: "1000px",
              //transformStyle: "preserve-3d",
            }}
          >
            {popularDestinations.map((dest, i) => {
              const offset = getOffset(i);
              if (Math.abs(offset) > 2) return null;

              return (
                <div
                  key={dest.name}
                  onClick={() => offset !== 0 && setActive(i)}
                  role="button"
                  tabIndex={offset !== 0 ? 0 : -1}
                  aria-label={`Ver detalles de ${dest.name}`}
                  className="absolute cursor-pointer"
                  style={{
                    width: "320px",
                    height: "420px",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow:
                      offset === 0
                        ? "0 32px 80px rgba(0,0,0,0.40)"
                        : "0 8px 24px rgba(0,0,0,0.18)",
                    ...getStyle(offset),
                  }}
                >
                  <img
                    src={destinationImages[dest.name]}
                    alt={dest.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
                    }}
                  />

                  {offset === 0 ? (
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p
                        className="text-[10px] font-bold uppercase tracking-[3px] mb-1.5"
                        style={{ color: "#C4A882" }}
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
                        href={whatsappLink(
                          `Hola! Quiero ver paquetes para ${dest.name}`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-full transition-all hover:opacity-90 hover:shadow-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--antares-red), var(--antares-red-dark))",
                        }}
                      >
                        Ver paquetes
                      </a>
                    </div>
                  ) : (
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold text-sm drop-shadow">
                        {dest.name}
                      </p>
                      <p className="text-white/50 text-xs">{dest.count}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 mt-10">
          <div className="flex items-center gap-2">
            {popularDestinations.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? "28px" : "7px",
                  height: "7px",
                  background:
                    i === active
                      ? "var(--antares-red)"
                      : darkMode
                        ? "#44403c"
                        : "#d6d3d1",
                }}
                aria-label={`Ir a ${popularDestinations[i].name}`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActive((p) => (p - 1 + total) % total)}
              aria-label="Destino anterior"
              className={`w-11 h-11 rounded-full border text-lg font-bold transition-all hover:scale-110 flex items-center justify-center ${
                darkMode
                  ? "border-stone-700 text-stone-300 hover:bg-stone-800"
                  : "border-stone-200 text-stone-600 hover:bg-white shadow-sm"
              }`}
            >
              ‹
            </button>
            <button
              onClick={() => setActive((p) => (p + 1) % total)}
              aria-label="Destino siguiente"
              className={`w-11 h-11 rounded-full border text-lg font-bold transition-all hover:scale-110 flex items-center justify-center ${
                darkMode
                  ? "border-stone-700 text-stone-300 hover:bg-stone-800"
                  : "border-stone-200 text-stone-600 hover:bg-white shadow-sm"
              }`}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
function ScrollPlane({ darkMode }: { darkMode: boolean }) {
  const [progress, setProgress] = useState(0);
  const [scrollDir, setScrollDir] = useState<"up" | "down">("down");
  const [activeIdx, setActiveIdx] = useState(0);
  const [tooltipIdx, setTooltipIdx] = useState<number | null>(null);
  const prevY = useRef(0);

  const sections = [
    { id: "hero", label: "Inicio", icon: "🏠" },
    { id: "paquetes", label: "Paquetes", icon: "✈️" },
    { id: "circuitos", label: "Circuitos", icon: "🌍" },
    { id: "grupales", label: "Grupales", icon: "👥" },
    { id: "experiencias-home", label: "Lujo", icon: "⭐" },
  ];

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docH =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(Math.max(scrollTop / docH, 0), 1);

      if (Math.abs(scrollTop - prevY.current) > 2) {
        setScrollDir(scrollTop > prevY.current ? "down" : "up");
        prevY.current = scrollTop;
      }
      setProgress(p);

      let cur = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (
          el &&
          el.getBoundingClientRect().top <= window.innerHeight * 0.6
        )
          cur = i;
      });
      setActiveIdx(cur);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const planeTop = progress * 100;
  // 0° = apunta arriba (scroll hacia arriba)
  // 180° = apunta abajo (scroll hacia abajo)
  const planeRotate = scrollDir === "down" ? 180 : 0;

  return (
    <div
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center select-none"
      style={{ height: "58vh", width: "40px" }}
    >
      {/* Línea recta del track */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
        style={{ background: darkMode ? "#292524" : "#e2e2e2" }}
      />

      {/* Progreso (línea roja) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5"
        style={{
          height: `${planeTop}%`,
          background: "var(--antares-red)",
          transition: "height 0.08s linear",
        }}
      />

      {/* Waypoints */}
      {sections.map((section, i) => {
        const topPct = (i / (sections.length - 1)) * 100;
        const isVisited = i <= activeIdx;
        const isCurrent = i === activeIdx;

        return (
          <div
            key={section.id}
            className="absolute"
            style={{
              top: `${topPct}%`,
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Anillo pulsante */}
            {isCurrent && (
              <div
                className="absolute rounded-full animate-ping"
                style={{
                  width: "14px",
                  height: "14px",
                  marginLeft: "-1px",
                  background: "var(--antares-red)",
                  opacity: 0.3,
                }}
              />
            )}

            {/* Dot */}
            <button
              onClick={() =>
                document
                  .getElementById(section.id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              onMouseEnter={() => setTooltipIdx(i)}
              onMouseLeave={() => setTooltipIdx(null)}
              aria-label={`Ir a ${section.label}`}
              className="relative z-10 rounded-full transition-all duration-300"
              style={{
                width: isCurrent ? "14px" : "10px",
                height: isCurrent ? "14px" : "10px",
                background: isVisited
                  ? "var(--antares-red)"
                  : darkMode
                    ? "#44403c"
                    : "#d6d3d1",
                boxShadow: isCurrent
                  ? "0 0 0 3px rgba(217,78,63,0.25)"
                  : "none",
              }}
            />

            {/* Tooltip */}
            {tooltipIdx === i && (
              <div
                className="absolute pointer-events-none z-50 bg-white text-stone-900 rounded-xl shadow-xl px-3 py-2 border border-stone-100 whitespace-nowrap text-xs font-bold"
                style={{ right: "22px", top: "50%", transform: "translateY(-50%)" }}
              >
                {section.icon} {section.label}
                <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-r border-t border-stone-100 rotate-45" />
              </div>
            )}
          </div>
        );
      })}

      {/* Avión — click = volver al inicio */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Volver al inicio"
        className="absolute z-20 transition-all duration-100 hover:scale-110"
        style={{
          top: `${planeTop}%`,
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, var(--antares-red), var(--antares-red-dark))",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-5 h-5"
            style={{
              transform: `rotate(${planeRotate}deg)`,
              transition: "transform 0.4s ease",
            }}
          >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </div>
        {progress > 0.85 && (
          <div
            className="absolute right-12 top-1/2 -translate-y-1/2 bg-white text-stone-900 rounded-xl shadow-xl px-3 py-1.5 border border-stone-100 whitespace-nowrap text-xs font-bold pointer-events-none"
          >
            ↑ Volver arriba
            <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-r border-t border-stone-100 rotate-45" />
          </div>
        )}
      </button>
    </div>
  );
}
function FooterShowcase({
  darkMode,
  onOpenForm,
}: {
  darkMode: boolean;
  onOpenForm: () => void;
}) {
  const media = SITE_CONFIG.branding.footerShowcase;

  return (
    <section className="relative overflow-hidden py-14 md:py-20 text-white">
      <div className="absolute inset-0">
        {media.type === "image" && (
          <img
            src={media.image}
            alt="Antares showcase"
            className="h-full w-full object-cover"
          />
        )}
        {media.type === "video" && (
          <video
            className="h-full w-full object-cover"
            poster={media.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={media.videoWebm} type="video/webm" />
            <source src={media.videoMp4} type="video/mp4" />
          </video>
        )}
        {media.type === "gradient" && (
          <div
            className={`h-full w-full ${darkMode ? "bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950" : "bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900"}`}
          />
        )}
        <div className="absolute inset-0 bg-black/45" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="mb-4 text-3xl font-black italic leading-tight md:text-5xl">
          “{SITE_CONFIG.slogan}”
        </h2>
        <p className="mb-8 text-lg text-stone-200">
          Armemos tu viaje totalmente a medida
        </p>
        <button
          type="button"
          onClick={onOpenForm}
          className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-10 py-4 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-2xl"
        >
          Completar formulario
        </button>
      </div>
    </section>
  );
}

function InfoUtilPage({ darkMode }: { darkMode: boolean }) {
  const sections = [
    {
      id: "visas",
      title: "Requisitos de Visas",
      icon: "🛂",
      content: [
        {
          country: "Schengen (Europa)",
          info: "Los ciudadanos argentinos pueden viajar sin visa por 90 días. Requiere pasaporte vigente.",
        },
        {
          country: "Estados Unidos",
          info: "Requiere visa ESTA o visa de turista. Tramitar con anticipación en la embajada.",
        },
        {
          country: "Brasil",
          info: "Ciudadanos argentinos no requieren visa. Solo pasaporte vigente.",
        },
        {
          country: "Caribe (RD, Turquía)",
          info: "Generalmente sin visa. Verificar según nacionalidad y destino específico.",
        },
      ],
    },
    {
      id: "check-in",
      title: "Web Check-In",
      icon: "✈️",
      content: [
        {
          country: "Aeroméxico",
          info: "Check-in online desde 24 horas antes del vuelo en aeromexico.com",
        },
        {
          country: "LATAM",
          info: "Web check-in disponible 24 horas antes. Acceso desde latam.com",
        },
        {
          country: "Aerolíneas Argentinas",
          info: "Check-in digital en aerolineas.com.ar desde 24 horas antes",
        },
        {
          country: "Consejo General",
          info: "Recomendamos hacer check-in online para ahorrar tiempo en aeropuerto",
        },
      ],
    },
  ];

  return (
    <main
      className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-[calc(100vh-80px)]`}
    >
      <section
        className={`py-12 md:py-16 ${darkMode ? "bg-stone-900" : "bg-stone-50"} border-b ${darkMode ? "border-stone-800" : "border-stone-100"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="#"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
          >
            ← Volver al inicio
          </a>
          <h1
            className={`text-3xl md:text-5xl font-black ${darkMode ? "text-white" : "text-stone-900"} mb-3`}
          >
            Información Útil
          </h1>
          <p
            className={`${darkMode ? "text-stone-400" : "text-stone-600"} max-w-2xl text-base md:text-lg`}
          >
            Todo lo que necesitas saber antes de viajar: visas, trámites y recomendaciones.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {sections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-4xl">{section.icon}</div>
                  <h2
                    className={`text-2xl font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                  >
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((item, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl p-4 border ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}
                    >
                      <h3
                        className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}
                      >
                        {item.country}
                      </h3>
                      <p
                        className={`text-sm ${darkMode ? "text-stone-400" : "text-stone-600"}`}
                      >
                        {item.info}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            className={`rounded-2xl border p-6 md:p-8 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}
          >
            <h3
              className={`text-lg font-bold mb-3 ${darkMode ? "text-white" : "text-stone-900"}`}
            >
              ¿Tenés dudas? Contactanos
            </h3>
            <p
              className={`mb-4 ${darkMode ? "text-stone-400" : "text-stone-600"}`}
            >
              Nuestro equipo está disponible para asesorarte sobre cualquier
              requisito específico de tu destino.
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=5493446528749&text=${encodeURIComponent("Hola! Tengo dudas sobre requisitos de visa")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg"
            >
              📞 Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function LegalesPage({ darkMode }: { darkMode: boolean }) {
  const [showRepentanceForm, setShowRepentanceForm] = useState(false);
  const [repentanceForm, setRepentanceForm] = useState({
    name: "",
    email: "",
    phone: "",
    bookingRef: "",
    reason: "",
  });

  const handleRepentanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Solicitud de Botón de Arrepentimiento:\n\nNombre: ${repentanceForm.name}\nEmail: ${repentanceForm.email}\nTeléfono: ${repentanceForm.phone}\nReferencia de Reserva: ${repentanceForm.bookingRef}\nMotivo: ${repentanceForm.reason}`;
    window.location.href = `https://api.whatsapp.com/send?phone=5493446528749&text=${encodeURIComponent(msg)}`;
    setShowRepentanceForm(false);
  };

  return (
    <main
      className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-[calc(100vh-80px)]`}
    >
      <section
        className={`py-12 md:py-16 ${darkMode ? "bg-stone-900" : "bg-stone-50"} border-b ${darkMode ? "border-stone-800" : "border-stone-100"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="#"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
          >
            ← Volver al inicio
          </a>
          <h1
            className={`text-3xl md:text-5xl font-black ${darkMode ? "text-white" : "text-stone-900"} mb-3`}
          >
            Legales & Protección
          </h1>
          <p
            className={`${darkMode ? "text-stone-400" : "text-stone-600"} max-w-2xl text-base md:text-lg`}
          >
            Condiciones de contratación y derechos del consumidor.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Condiciones de Contratación */}
            <div
              className={`rounded-2xl border p-6 lg:col-span-2 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="text-3xl">📋</div>
                <h2
                  className={`text-2xl font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                >
                  Condiciones de Contratación
                </h2>
              </div>
              <div
                className={`text-sm leading-relaxed space-y-4 ${darkMode ? "text-stone-400" : "text-stone-600"}`}
              >
                <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                    A) SOLICITUDES Y PAGOS
                  </h3>
                  <p>
                    Los precios son orientativos y no revisten confirmación. Los depósitos iniciales funcionan como reserva, no confirmación. El pago total debe realizarse antes de la fecha establecida.
                  </p>
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                    B) SERVICIOS INCLUIDOS
                  </h3>
                  <p>
                    Transporte, alojamiento en categorías oficiales, comidas según se indique, excursiones, traslados aeroportuarios.
                  </p>
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                    C) SERVICIOS NO INCLUIDOS
                  </h3>
                  <p>
                    Bebidas, propinas, tasas de embarque, seguros, exceso de equipaje, gastos de visado, excursiones opcionales.
                  </p>
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                    D) VIAJES EN GRUPO
                  </h3>
                  <p>
                    Requieren mínimo 30 personas. Sin alcanzar ese número, pueden cancelar con 10 días de anticipación.
                  </p>
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                    G) CANCELACIONES
                  </h3>
                  <p>
                    Políticas específicas según servicios contratados. Para charter: se perderá la totalidad de lo abonado en transporte no regular.
                  </p>
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                    J) RESPONSABILIDAD
                  </h3>
                  <p>
                    La agencia actúa como intermediaria. Declina responsabilidad por deficiencias de terceros prestadores.
                  </p>
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>
                    O) JURISDICCIÓN
                  </h3>
                  <p>
                    Tribunales provinciales de Gualeguaychú, Entre Ríos.
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de Arrepentimiento */}
            <div
              className={`rounded-2xl border p-6 lg:col-span-2 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="text-3xl">🔄</div>
                <h2
                  className={`text-2xl font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                >
                  Botón de Arrepentimiento
                </h2>
              </div>
              <p
                className={`text-sm leading-relaxed mb-6 ${darkMode ? "text-stone-400" : "text-stone-600"}`}
              >
                De conformidad con la legislación de protección al consumidor argentina, tienes derecho a arrepentirte de tu compra dentro de los 10 días hábiles posteriores a la confirmación del viaje, sin necesidad de justificación. El reembolso se procesará según la política de cancelación aplicable a tu reserva.
              </p>
              <button
                onClick={() => setShowRepentanceForm(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg"
              >
                🔗 Ejercer derecho de arrepentimiento
              </button>
            </div>
          </div>
        </div>
      </section>

      {showRepentanceForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowRepentanceForm(false)}
        >
          <div
            className={`${darkMode ? "border-stone-700 bg-stone-900" : "border-stone-200 bg-white"} w-full max-w-md rounded-2xl border p-6 shadow-2xl md:p-8`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-xl font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
              >
                Solicitar Arrepentimiento
              </h3>
              <button
                onClick={() => setShowRepentanceForm(false)}
                className="text-stone-400 transition-colors hover:text-red-500"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mb-5 text-sm text-stone-500">
              Completa el formulario y te responderemos dentro de 48 horas.
            </p>
            <form onSubmit={handleRepentanceSubmit} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Nombre completo"
                value={repentanceForm.name}
                onChange={(e) =>
                  setRepentanceForm({
                    ...repentanceForm,
                    name: e.target.value,
                  })
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={repentanceForm.email}
                onChange={(e) =>
                  setRepentanceForm({
                    ...repentanceForm,
                    email: e.target.value,
                  })
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
              />
              <input
                required
                type="tel"
                placeholder="Teléfono"
                value={repentanceForm.phone}
                onChange={(e) =>
                  setRepentanceForm({
                    ...repentanceForm,
                    phone: e.target.value,
                  })
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
              />
              <input
                required
                type="text"
                placeholder="Referencia de reserva"
                value={repentanceForm.bookingRef}
                onChange={(e) =>
                  setRepentanceForm({
                    ...repentanceForm,
                    bookingRef: e.target.value,
                  })
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
              />
              <textarea
                required
                rows={3}
                placeholder="Motivo de arrepentimiento"
                value={repentanceForm.reason}
                onChange={(e) =>
                  setRepentanceForm({
                    ...repentanceForm,
                    reason: e.target.value,
                  })
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 py-3 text-sm font-bold text-white transition-all hover:shadow-lg"
              >
                Enviar por WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function PageLayout({
  title,
  subtitle,
  accent = "red",
  cards,
  darkMode,
}: {
  title: string;
  subtitle: string;
  accent?: Accent;
  cards: TravelCard[];
  darkMode: boolean;
}) {
  return (
    <main
      className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-[calc(100vh-80px)]`}
    >
      <section
        className={`py-12 md:py-16 ${darkMode ? "bg-stone-900" : "bg-stone-50"} border-b ${darkMode ? "border-stone-800" : "border-stone-100"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="#"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
          >
            ← Volver al inicio
          </a>
          <h1
            className={`text-3xl md:text-5xl font-black ${darkMode ? "text-white" : "text-stone-900"} mb-3`}
          >
            {title}
          </h1>
          <p
            className={`${darkMode ? "text-stone-400" : "text-stone-600"} max-w-2xl text-base md:text-lg`}
          >
            {subtitle}
          </p>
        </div>
      </section>
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {cards.map((pkg, i) => (
              <div
                key={pkg.id}
                style={{ transitionDelay: `${i * 90}ms` }}
                className="transition-all duration-500 opacity-100 translate-y-0 h-full"
              >
                <PackageCard pkg={pkg} accent={accent} darkMode={darkMode} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function BlogPage({
  activeCont,
  setActiveCont,
  darkMode,
}: {
  activeCont: string;
  setActiveCont: (value: string) => void;
  darkMode: boolean;
}) {
  const filteredPosts = useMemo(
    () => blogPosts.filter((post) => post.continent === activeCont),
    [activeCont],
  );

  return (
    <main
      className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-[calc(100vh-80px)]`}
    >
      <section
        className={`py-12 md:py-16 ${darkMode ? "bg-stone-900" : "bg-stone-50"} border-b ${darkMode ? "border-stone-800" : "border-stone-100"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="#"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
          >
            ← Volver al inicio
          </a>
          <h1
            className={`text-3xl md:text-5xl font-black ${darkMode ? "text-white" : "text-stone-900"} mb-3`}
          >
            Blog de Viajes
          </h1>
          <p
            className={`${darkMode ? "text-stone-400" : "text-stone-600"} max-w-2xl text-base md:text-lg`}
          >
            Notas, ideas y consejos para planificar mejor cada viaje.
          </p>
        </div>
      </section>
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {continents.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCont(c)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${activeCont === c ? "bg-[var(--antares-red)] text-white" : `${darkMode ? "bg-stone-900 text-stone-300 border-stone-700" : "bg-white text-stone-600 border-stone-200"} border hover:border-red-300`}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className={`${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"} overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-48 w-full object-cover"
                />
                <div className="space-y-3 p-5">
                  <div
                    className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider ${darkMode ? "text-stone-400" : "text-stone-500"}`}
                  >
                    <span>{post.continent}</span>
                    <span>•</span>
                    <span>{post.country}</span>
                  </div>
                  <h3
                    className={`text-lg font-bold leading-tight ${darkMode ? "text-white" : "text-stone-900"}`}
                  >
                    {post.title}
                  </h3>
                  <p
                    className={`${darkMode ? "text-stone-400" : "text-stone-600"} text-sm leading-relaxed`}
                  >
                    {post.excerpt}
                  </p>
                  <div
                    className={`flex items-center justify-between border-t pt-3 text-xs ${darkMode ? "border-stone-800 text-stone-500" : "border-stone-100 text-stone-400"}`}
                  >
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

function PackageDetailPage({
  packageId,
  darkMode,
  whatsappLink,
}: {
  packageId: string | null;
  darkMode: boolean;
  whatsappLink: (msg: string) => string;
}) {
  const allPackages = getAllPackages();
  const pkg = packageId ? allPackages.find((p) => p.id === packageId) : null;

  if (!pkg) {
    return (
      <main
        className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-[calc(100vh-80px)]`}
      >
        <section
          className={`py-12 md:py-16 ${darkMode ? "bg-stone-900" : "bg-stone-50"} border-b ${darkMode ? "border-stone-800" : "border-stone-100"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <a
              href="#"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
            >
              ← Volver al inicio
            </a>
            <h1
              className={`text-3xl md:text-5xl font-black ${darkMode ? "text-white" : "text-stone-900"} mb-3`}
            >
              Paquete no encontrado
            </h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-[calc(100vh-80px)]`}
    >
      <section
        className={`py-8 md:py-12 ${darkMode ? "bg-stone-900" : "bg-stone-50"}`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="#"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            ← Volver
          </a>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Slider de imágenes */}
            <div className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden h-96 md:h-[500px] bg-stone-200">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                {pkg.badge && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {pkg.badge}
                  </div>
                )}
              </div>

              {/* Información del paquete */}
              <div
                className={`mt-8 rounded-2xl border p-6 md:p-8 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}
              >
                <h2
                  className={`text-2xl md:text-3xl font-black mb-6 ${darkMode ? "text-white" : "text-stone-900"}`}
                >
                  {pkg.title}
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-stone-500" : "text-stone-500"}`}
                      >
                        Destino
                      </p>
                      <p
                        className={`text-lg font-semibold ${darkMode ? "text-white" : "text-stone-900"}`}
                      >
                        {pkg.destination}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌙</span>
                    <div>
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-stone-500" : "text-stone-500"}`}
                      >
                        Duración
                      </p>
                      <p
                        className={`text-lg font-semibold ${darkMode ? "text-white" : "text-stone-900"}`}
                      >
                        {pkg.duration}
                      </p>
                    </div>
                  </div>

                  {pkg.departure && (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✈️</span>
                      <div>
                        <p
                          className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-stone-500" : "text-stone-500"}`}
                        >
                          Salida
                        </p>
                        <p
                          className={`text-lg font-semibold ${darkMode ? "text-white" : "text-stone-900"}`}
                        >
                          {pkg.departure}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`border-t pt-6 ${darkMode ? "border-stone-800" : "border-stone-200"}`}
                >
                  <h3
                    className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-stone-900"}`}
                  >
                    Incluye:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pkg.includes?.map((inc, i) => (
                      <span
                        key={i}
                        className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                      >
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Panel de precio y CTA */}
            <div className="lg:col-span-1">
              <div
                className={`rounded-2xl border p-6 md:p-8 sticky top-32 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"}`}
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Precio por persona
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-black text-red-600">
                    {pkg.price}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const msg = `Hola! Me interesa saber más sobre el paquete "${pkg.title}". Quiero más detalles.`;
                    window.location.href = whatsappLink(msg);
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 mb-4"
                >
                  Consultar
                </button>

                <div
                  className={`text-xs text-center ${darkMode ? "text-stone-400" : "text-stone-600"}`}
                >
                  Hablaremos directamente por WhatsApp sobre disponibilidad y detalles.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const { route, packageId } = useHashRoute();
  const [searchData, setSearchData] = useState({
    destination: "",
    departure: "",
    passengers: "2",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showTripForm, setShowTripForm] = useState(false);
  const [tripForm, setTripForm] = useState({
    name: "",
    phone: "",
    destination: "",
    date: "",
    details: "",
  });
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [activeCont, setActiveCont] = useState("América");
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false,
  );
  const [navbarVisible, setNavbarVisible] = useState(true);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobileViewport(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 100) {
        setNavbarVisible(true);
      } else if (currentScrollY > prevScrollY.current) {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.title = "Antares Viajes";
  }, []);

  const wa = (text?: string) =>
    `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsapp}${text ? `&text=${encodeURIComponent(text)}` : ""}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola! Quiero buscar viajes:${searchData.destination ? ` Destino: ${searchData.destination}` : ""}${searchData.departure ? ` Fecha: ${searchData.departure}` : ""}${searchData.passengers ? ` Pasajeros: ${searchData.passengers}` : ""}`;
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
      case "ofertas":
        return (
          <PageLayout
            title="Ofertas Flash"
            subtitle="Promociones y tarifas especiales con vigencia limitada."
            cards={offersPackages}
            accent="red"
            darkMode={darkMode}
          />
        );
      case "argentina":
        return (
          <PageLayout
            title="Descubrí Argentina"
            subtitle="Escapadas y viajes nacionales con los mejores destinos del país."
            cards={argentinaPackages}
            accent="amber"
            darkMode={darkMode}
          />
        );
      case "quinceaneras":
        return (
          <PageLayout
            title="Quinceañeras"
            subtitle="Programas pensados para viajes inolvidables de quince."
            cards={quincePackages}
            accent="rose"
            darkMode={darkMode}
          />
        );
      case "experiencias":
        return (
          <PageLayout
            title="Experiencias de Lujo"
            subtitle="Propuestas premium y viajes exclusivos de otra categoría."
            cards={luxuryExperiences}
            accent="gold"
            darkMode={darkMode}
          />
        );
      case "cruceros":
        return (
          <PageLayout
            title="Cruceros"
            subtitle="Preparado para futuras conexiones con MSC y Organfur Central de Cruceros."
            cards={cruisePackages}
            accent="amber"
            darkMode={darkMode}
          />
        );
      case "blog":
        return (
          <BlogPage
            activeCont={activeCont}
            setActiveCont={setActiveCont}
            darkMode={darkMode}
          />
        );
      case "grupales":
        return (
          <PageLayout
            title="Viajes Grupales"
            subtitle="Paquetes especiales para empresas, amigos y familias con tarifas pensadas para grupos."
            cards={groupPackages}
            accent="red"
            darkMode={darkMode}
          />
        );
      case "circuitos":
        return (
          <PageLayout
            title="Circuitos Internacionales"
            subtitle="Rutas completas para descubrir grandes destinos con itinerarios armados."
            cards={circuitPackages}
            accent="red"
            darkMode={darkMode}
          />
        );
      case "infoUtil":
        return <InfoUtilPage darkMode={darkMode} />;
      case "legales":
        return <LegalesPage darkMode={darkMode} />;
      case "package-detail":
        return <PackageDetailPage packageId={packageId} darkMode={darkMode} whatsappLink={wa} />;
      case "admin":
        return <AdminPanel darkMode={darkMode} />;
      default:
        return (
          <main>
            <section
              id="hero"
              className="relative min-h-screen overflow-hidden flex items-center md:min-h-[110vh]"
            >
              <div className="absolute inset-0 z-0">
                {/* Solo el slide activo se monta para evitar decodificar varios videos en paralelo */}
                {(() => {
                  const slide = heroSlides[currentHeroSlide];
                  const webm = isMobileViewport
                    ? slide.sources.mobileWebm
                    : slide.sources.desktopWebm;
                  const mp4 = isMobileViewport
                    ? slide.sources.mobileMp4
                    : slide.sources.desktopMp4;
                  return (
                    <video
                      key={`${slide.label}-${isMobileViewport ? "m" : "d"}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ zIndex: 1 }}
                      poster={slide.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                    >
                      <source src={webm} type="video/webm" />
                      <source src={mp4} type="video/mp4" />
                    </video>
                  );
                })()}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/12 to-transparent"
                  style={{ zIndex: 2 }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                  style={{ zIndex: 2 }}
                />
              </div>
              <div className="relative z-10 max-w-7xl mx-auto w-full px-4 py-16 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  <h1 className="mb-8 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] sm:text-5xl md:text-7xl">
                    {SITE_CONFIG.slogan}
                  </h1>
                  <form
                    onSubmit={handleSearch}
                    className="rounded-2xl bg-white p-4 shadow-2xl md:p-5"
                  >
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <div className="col-span-2 md:col-span-1">
                        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                          Destino
                        </label>
                        <input
                          type="text"
                          placeholder="¿A dónde?"
                          value={searchData.destination}
                          onChange={(e) =>
                            setSearchData({
                              ...searchData,
                              destination: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-red-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                          Fecha
                        </label>
                        <select
                          value={searchData.departure}
                          onChange={(e) =>
                            setSearchData({
                              ...searchData,
                              departure: e.target.value,
                            })
                          }
                          className={`w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-red-400 ${searchData.departure ? "text-stone-900" : "text-stone-400"}`}
                        >
                          <option value="">¿Cuándo?</option>
                          {departureMonthOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                          Pasajeros
                        </label>
                        <select
                          value={searchData.passengers}
                          onChange={(e) =>
                            setSearchData({
                              ...searchData,
                              passengers: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-red-400"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5+">5+</option>
                        </select>
                      </div>
                      <div className="col-span-2 flex items-end md:col-span-1">
                        <button
                          type="submit"
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:from-red-700 hover:to-red-600 hover:shadow-lg"
                        >
                          🔍 Buscar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </section>

            <PopularDestinationsCarousel
              darkMode={darkMode}
              whatsappLink={wa}
            />

            <AnimatedSection
              id="paquetes"
              className={`${darkMode ? "bg-stone-900" : "bg-stone-50"} py-14 md:py-20`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col items-center justify-center gap-4 text-center">
                  <h2
                    className={`mb-2 text-3xl font-black leading-tight md:text-5xl ${darkMode ? "text-white" : "text-stone-900"}`}
                  >
                    Antares <span className="text-red-600">Favoritos</span>
                  </h2>
                  <p
                    className={`${darkMode ? "text-stone-400" : "text-stone-600"} text-base md:text-lg max-w-2xl`}
                  >
                    Las propuestas más elegidas para viajar en pareja, en
                    familia o con amigos.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 mb-8">
                  {featuredPackages.map((pkg, i) => (
                    <div
                      key={pkg.id}
                      style={{ transitionDelay: `${i * 100}ms` }}
                      className="h-full"
                    >
                      <PackageCard pkg={pkg} accent="red" darkMode={darkMode} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <a
                    href="#ofertas"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    Ver más paquetes →
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection
              id="circuitos"
              className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} py-14 md:py-20`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col items-center justify-center gap-4 text-center">
                  <h2
                    className={`mb-2 text-3xl font-black leading-tight md:text-5xl ${darkMode ? "text-white" : "text-stone-900"}`}
                  >
                    Circuitos{" "}
                    <span className="text-red-600">Internacionales</span>
                  </h2>
                  <p
                    className={`${darkMode ? "text-stone-400" : "text-stone-600"} text-base md:text-lg max-w-2xl`}
                  >
                    Rutas completas para descubrir grandes destinos con
                    itinerarios armados.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 mb-8">
                  {circuitPackages.map((pkg, i) => (
                    <div
                      key={pkg.id}
                      style={{ transitionDelay: `${i * 100}ms` }}
                      className="h-full"
                    >
                      <PackageCard pkg={pkg} accent="red" darkMode={darkMode} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <a
                    href="#circuitos"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    Ver más circuitos →
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection
              id="grupales"
              className={`${darkMode ? "bg-stone-900" : "bg-stone-50"} py-14 md:py-20`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                  <h2
                    className={`mb-2 text-3xl font-black md:text-5xl ${darkMode ? "text-white" : "text-stone-900"}`}
                  >
                    Viajes <span className="text-red-600">Grupales</span>
                  </h2>
                  <p
                    className={`${darkMode ? "text-stone-400" : "text-stone-600"} mx-auto max-w-2xl text-base md:text-lg`}
                  >
                    Paquetes especiales para empresas, amigos y familias con
                    tarifas pensadas para grupos.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 mb-8">
                  {groupPackages.map((pkg, i) => (
                    <div
                      key={pkg.id}
                      style={{ transitionDelay: `${i * 100}ms` }}
                      className="h-full"
                    >
                      <PackageCard pkg={pkg} accent="red" darkMode={darkMode} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <a
                    href="#grupales"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    Ver más paquetes grupales →
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection
              id="experiencias-home"
              className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} py-14 md:py-20`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                  <h2
                    className={`mb-2 text-3xl font-black md:text-5xl ${darkMode ? "text-white" : "text-stone-900"}`}
                  >
                    Experiencias de{" "}
                    <span style={{ color: "var(--antares-gold)" }}>Lujo</span>
                  </h2>
                  <p
                    className={`${darkMode ? "text-stone-400" : "text-stone-600"} mx-auto max-w-2xl text-base md:text-lg`}
                  >
                    Una categoría premium con servicio exclusivo y atención de
                    primer nivel.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 mb-8">
                  {luxuryExperiences.map((pkg, i) => (
                    <div
                      key={pkg.id}
                      style={{ transitionDelay: `${i * 100}ms` }}
                      className="h-full"
                    >
                      <PackageCard
                        pkg={pkg}
                        accent="gold"
                        darkMode={darkMode}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <a
                    href="#experiencias"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C4A882] to-[#b89060] px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    Ver más experiencias →
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="bg-stone-900 py-14 text-white md:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                  <h2 className="mb-3 text-3xl font-black md:text-5xl">
                    ¿Por qué{" "}
                    <span style={{ color: "var(--antares-gold)" }}>
                      Antares
                    </span>
                    ?
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
                  {[
                    {
                      icon: "🚨",
                      title: "Guardia 24hs",
                      desc: "Atención 24/7 para nuestros pasajeros en viaje.",
                    },
                    {
                      icon: "🏆",
                      title: "Trayectoria",
                      desc: "Más de 30 años nos avalan en experiencias.",
                    },
                    {
                      icon: "🎯",
                      title: "Atención Personalizada",
                      desc: "Asesoramiento cercano y pensado para cada cliente.",
                    },
                    {
                      icon: "🧳",
                      title: "Viajes a medida",
                      desc: "Armamos tu idea de viaje según tus tiempos, gustos y presupuesto.",
                    },
                  ].map((item, idx) => (
                    <div
                      key={item.title}
                      style={{ transitionDelay: `${idx * 80}ms` }}
                      className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/20"
                    >
                      <div className="mb-3 text-3xl md:text-4xl">
                        {item.icon}
                      </div>
                      <h3 className="mb-1 text-base font-bold md:text-lg">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-300 md:text-sm">
                        {item.desc}
                      </p>
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
    <div
      className={`min-h-screen font-['Inter'] transition-colors duration-300 ${darkMode ? "antares-dark bg-stone-950" : "bg-stone-100"}`}
    >
      <nav
        className={`fixed top-2 left-0 right-0 z-50 backdrop-blur-md shadow-md transition-all duration-300 ${navbarVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0 pointer-events-none"} mx-2 rounded-[32px] ${darkMode ? "border border-stone-800/50 bg-stone-950/30" : "border border-stone-200/50 bg-white/20"}`}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-2 md:py-3">
          <div className="flex h-20 items-center justify-between md:h-24">
            <a href="#" className="flex shrink-0 items-center gap-2 md:gap-3">
              <img
                src={darkMode ? "/branding/logo-dark.png" : SITE_CONFIG.branding.logo}
                alt={SITE_CONFIG.branding.logoAlt}
                className="h-20 w-auto md:h-28"
              />
            </a>

            <div className="hidden items-center gap-1 xl:flex">
              <a
                href="#argentina"
                className={
                  darkMode
                    ? "rounded-lg px-3 py-2 text-sm font-medium text-stone-300 transition-all hover:bg-stone-800 hover:text-red-400"
                    : "rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-red-50 hover:text-red-600"
                }
              >
                Argentina
              </a>
              <a
                href="#grupales"
                className={
                  darkMode
                    ? "rounded-lg px-3 py-2 text-sm font-medium text-stone-300 transition-all hover:bg-stone-800 hover:text-red-400"
                    : "rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-red-50 hover:text-red-600"
                }
              >
                Grupales
              </a>
              <a
                href="#circuitos"
                className={
                  darkMode
                    ? "rounded-lg px-3 py-2 text-sm font-medium text-stone-300 transition-all hover:bg-stone-800 hover:text-red-400"
                    : "rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-red-50 hover:text-red-600"
                }
              >
                Circuitos
              </a>
              <a
                href="#quinceaneras"
                className={
                  darkMode
                    ? "rounded-lg px-3 py-2 text-sm font-medium text-stone-300 transition-all hover:bg-stone-800 hover:text-red-400"
                    : "rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-red-50 hover:text-red-600"
                }
              >
                Quinceañeras
              </a>
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
                className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition-all ${darkMode ? "bg-white text-amber-500 hover:bg-stone-100" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
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
                <svg
                  className="h-5 w-5 text-stone-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div
              className={`space-y-1 border-t pb-4 pt-3 xl:hidden ${darkMode ? "border-stone-800" : "border-stone-100"}`}
            >
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
                  className={`block rounded-lg px-4 py-2.5 font-medium transition-all ${darkMode ? "text-stone-300 hover:bg-stone-800 hover:text-red-400" : "text-stone-700 hover:bg-red-50 hover:text-red-600"}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {renderRoute()}

      {route === "home" && (
        <FooterShowcase
          darkMode={darkMode}
          onOpenForm={() => setShowTripForm(true)}
        />
      )}
    <footer className="bg-stone-900 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">

            {/* Columna 1: Logo + descripción + redes */}
            <div className="col-span-2 md:col-span-1 lg:col-span-1">
              <div className="mb-4">
                <img
                  src="/branding/Logo-footer.png"
                  alt={SITE_CONFIG.branding.logoAlt}
                  className="h-16 w-auto"
                />
              </div>
              
              <div className="flex gap-3">
                
                  <a href="https://www.instagram.com/antares_viajes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-stone-800 hover:bg-[#D94E3F] rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                
                  <a href="https://www.facebook.com/antaresviajes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-stone-800 hover:bg-[#D94E3F] rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Columna 2: Navegación */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">
                Navegación
              </h4>
              <ul className="space-y-2.5">
                <li><a href="#argentina" className="text-sm text-stone-500 transition-colors hover:text-white">Argentina</a></li>
                <li><a href="#grupales" className="text-sm text-stone-500 transition-colors hover:text-white">Grupales</a></li>
                <li><a href="#circuitos" className="text-sm text-stone-500 transition-colors hover:text-white">Circuitos</a></li>
                <li><a href="#quinceaneras" className="text-sm text-stone-500 transition-colors hover:text-white">Quinceañeras</a></li>
                <li><a href="#experiencias" className="text-sm text-stone-500 transition-colors hover:text-white">Experiencias de Lujo</a></li>
                <li><a href="#cruceros" className="text-sm text-stone-500 transition-colors hover:text-white">Cruceros</a></li>
              </ul>
            </div>

            {/* Columna 3: Antares (antes "Contacto") */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">
                Antares
              </h4>
              <ul className="space-y-2.5 mb-4">
                <li>
                  <a href="#quienes-somos" className="text-sm text-stone-500 transition-colors hover:text-white">
                    Quiénes Somos
                  </a>
                </li>
              </ul>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-stone-500">+54 3446 429808</li>
                <li className="flex items-center gap-2 text-stone-500">+549 3446 528749</li>
                <li className="flex items-center gap-2 text-stone-500">{SITE_CONFIG.salesEmail}</li>
              </ul>
            </div>

            {/* Columna 4: Horarios + Domicilio */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">
                Horarios
              </h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li>Lun a Vie: 9:00 - 13:00 y 15:00 - 19:00</li>
                <li>Sábados: 9:00 - 13:00</li>
                <li className="pt-2">
                  
                   <a href="https://maps.app.goo.gl/E8D3vAMZwhHRG8Rd7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 group"
                  >
                    <span className="text-sm underline underline-offset-2 decoration-stone-700 group-hover:text-white group-hover:decoration-white transition-colors">
                      Churruarín 248
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 5: Info Útil (NUEVA) */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">
                Info Útil
              </h4>
              <ul className="space-y-2.5">
                <li><a href="#blog" className="text-sm text-stone-500 transition-colors hover:text-white">Blog de Viajes</a></li>
                <li><a href="#infoUtil" className="text-sm text-stone-500 transition-colors hover:text-white">Visas</a></li>
                <li><a href="#infoUtil" className="text-sm text-stone-500 transition-colors hover:text-white">Web Check-in</a></li>
              </ul>
            </div>

            {/* Columna 6: Legales (NUEVA) */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">
                Legales
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#legales"
                    className="text-sm text-stone-500 transition-colors hover:text-white leading-snug"
                  >
                    Condiciones de Contratación
                  </a>
                </li>
                <li>
                  <a href="#legales"
                    className="text-sm text-stone-500 transition-colors hover:text-white leading-snug"
                  >
                    Botón de Arrepentimiento
                  </a>
                </li>
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

      {route === "home" && <ScrollPlane darkMode={darkMode} />}

      <a
        href={wa()}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-2xl transition-all hover:scale-110 hover:bg-green-600"
        aria-label="Contactar por WhatsApp"
      >
        <svg
          className="h-6 w-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.52 3.48C18.25 1.25 15.3 0 12 0 5.48 0 0.04 5.42 0 12c0 2.1.55 4.16 1.59 5.97L0 24l6.26-1.64c1.74.95 3.7 1.45 5.74 1.45 6.52 0 11.96-5.42 12-12 0-3.2-1.25-6.21-3.52-8.48zM12 21.9c-1.78 0-3.53-.48-5.05-1.38l-.36-.22-3.74.98 1-3.64-.23-.37C2.48 15.39 2 13.73 2 12c0-5.41 4.41-9.82 9.82-9.82 2.62 0 5.08 1.02 6.92 2.88 1.84 1.86 2.85 4.33 2.85 6.95 0 5.41-4.41 9.82-9.82 9.82zm5.37-7.38c-.3-.15-1.75-.87-2.03-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.68-1.62-.93-2.21-.24-.58-.49-.5-.67-.51-.18-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.08-.13-.27-.2-.57-.35z" />
        </svg>
      </a>

      {showTripForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowTripForm(false)}
        >
          <div
            className={`${darkMode ? "border-stone-700 bg-stone-900" : "border-stone-200 bg-white"} w-full max-w-md rounded-2xl border p-6 shadow-2xl md:p-8`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-xl font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
              >
                Armá tu viaje a medida
              </h3>
              <button
                onClick={() => setShowTripForm(false)}
                className="text-stone-400 transition-colors hover:text-red-500"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mb-5 text-sm text-stone-500">
              Completá el formulario y te respondemos por WhatsApp.
            </p>
            <form onSubmit={handleTripForm} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Nombre completo"
                value={tripForm.name}
                onChange={(e) =>
                  setTripForm({ ...tripForm, name: e.target.value })
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
              />
              <input
                required
                type="tel"
                placeholder="Teléfono"
                value={tripForm.phone}
                onChange={(e) =>
                  setTripForm({ ...tripForm, phone: e.target.value })
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
              />
              <input
                type="text"
                placeholder="Destino deseado"
                value={tripForm.destination}
                onChange={(e) =>
                  setTripForm({ ...tripForm, destination: e.target.value })
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
              />
              <select
                value={tripForm.date}
                onChange={(e) =>
                  setTripForm({ ...tripForm, date: e.target.value })
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-700"}`}
              >
                <option value="">¿Cuándo?</option>
                {departureMonthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <textarea
                rows={3}
                placeholder="Contanos tu idea de viaje"
                value={tripForm.details}
                onChange={(e) =>
                  setTripForm({ ...tripForm, details: e.target.value })
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-3 text-sm font-bold text-white transition-all hover:shadow-lg"
              >
                Enviar por WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
