import React, { useState, useEffect } from "react";
import { popularDestinations, destinationImages } from "../../data/destinations";

export function PopularDestinationsCarousel({
  darkMode,
  whatsappLink,
}: {
  darkMode: boolean;
  whatsappLink: (msg: string) => string;
}) {
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
    const configs: Record<number, { tx: number; ry: number; scale: number; opacity: number; z: number; brightness: number }> = {
      0: { tx: 0,  ry: 0,   scale: 1,    opacity: 1,    z: 20, brightness: 1    },
      1: { tx: 52, ry: -46, scale: 0.76, opacity: 0.45, z: 5,  brightness: 0.48 },
      2: { tx: 80, ry: -58, scale: 0.58, opacity: 0.15, z: 1,  brightness: 0.3  },
    };
    if (abs > 2) return { opacity: 0, pointerEvents: "none", zIndex: 0 };
    const c = configs[abs];
    return {
      transform: `translateX(${sign * c.tx}%) rotateY(${-sign * c.ry}deg) scale(${c.scale})`,
      opacity: c.opacity,
      zIndex: c.z,
      filter: `brightness(${c.brightness})`,
      cursor: abs > 0 ? "pointer" : "default",
      transformOrigin: offset > 0 ? "left center" : offset < 0 ? "right center" : "center center",
      transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.65s ease, filter 0.65s ease",
      willChange: "transform",
    };
  };

  return (
    <section className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} py-16 md:py-24`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className={`text-4xl md:text-6xl font-black mb-3 ${darkMode ? "text-white" : "text-stone-900"}`}>
            Destinos <span style={{ color: "var(--antares-red)" }}>Populares</span>
          </h2>
          <p className={`text-base md:text-lg ${darkMode ? "text-stone-400" : "text-stone-500"}`}>
            Los más elegidos por nuestros viajeros
          </p>
        </div>

        <div style={{ perspective: "1300px", perspectiveOrigin: "50% 45%" }} className="overflow-hidden">
          <div className="relative flex items-center justify-center mx-auto" style={{ height: "500px", maxWidth: "1000px" }}>
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
                    width: "320px", height: "420px", borderRadius: "20px", overflow: "hidden",
                    boxShadow: offset === 0 ? "0 32px 80px rgba(0,0,0,0.40)" : "0 8px 24px rgba(0,0,0,0.18)",
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
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)" }}
                  />
                  {offset === 0 ? (
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-[10px] font-bold uppercase tracking-[3px] mb-1.5" style={{ color: "#C4A882" }}>
                        Antares Selection
                      </p>
                      <h3 className="text-3xl font-black text-white mb-1 leading-tight">{dest.name}</h3>
                      <p className="text-white/55 text-xs mb-4 leading-snug">{dest.count} · {dest.subtitle}</p>
                      <a
                        href={whatsappLink(`Hola! Quiero ver paquetes para ${dest.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-full transition-all hover:opacity-90 hover:shadow-lg"
                        style={{ background: "linear-gradient(135deg, var(--antares-red), var(--antares-red-dark))" }}
                      >
                        Ver paquetes
                      </a>
                    </div>
                  ) : (
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold text-sm drop-shadow">{dest.name}</p>
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
                  background: i === active ? "var(--antares-red)" : darkMode ? "#44403c" : "#d6d3d1",
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
                darkMode ? "border-stone-700 text-stone-300 hover:bg-stone-800" : "border-stone-200 text-stone-600 hover:bg-white shadow-sm"
              }`}
            >‹</button>
            <button
              onClick={() => setActive((p) => (p + 1) % total)}
              aria-label="Destino siguiente"
              className={`w-11 h-11 rounded-full border text-lg font-bold transition-all hover:scale-110 flex items-center justify-center ${
                darkMode ? "border-stone-700 text-stone-300 hover:bg-stone-800" : "border-stone-200 text-stone-600 hover:bg-white shadow-sm"
              }`}
            >›</button>
          </div>
        </div>
      </div>
    </section>
  );
}