import { useState, useEffect, useRef } from "react";

export function ScrollPlane({ darkMode }: { darkMode: boolean }) {
  const [progress, setProgress] = useState(0);
  const [scrollDir, setScrollDir] = useState<"up" | "down">("down");
  const [activeIdx, setActiveIdx] = useState(0);
  const [tooltipIdx, setTooltipIdx] = useState<number | null>(null);
  const prevY = useRef(0);

  const sections = [
    { id: "hero",            label: "Inicio",   icon: "🏠" },
    { id: "paquetes",        label: "Paquetes", icon: "✈️" },
    { id: "circuitos",       label: "Circuitos",icon: "🌍" },
    { id: "grupales",        label: "Grupales", icon: "👥" },
    { id: "experiencias-home", label: "Lujo",   icon: "⭐" },
  ];

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(Math.max(scrollTop / docH, 0), 1);
      if (Math.abs(scrollTop - prevY.current) > 2) {
        setScrollDir(scrollTop > prevY.current ? "down" : "up");
        prevY.current = scrollTop;
      }
      setProgress(p);
      let cur = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.6) cur = i;
      });
      setActiveIdx(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const planeTop = progress * 100;
  const planeRotate = scrollDir === "down" ? 180 : 0;

  return (
    <div
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center select-none"
      style={{ height: "58vh", width: "40px" }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
        style={{ background: darkMode ? "#292524" : "#e2e2e2" }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5"
        style={{ height: `${planeTop}%`, background: "var(--antares-red)", transition: "height 0.08s linear" }}
      />

      {sections.map((section, i) => {
        const topPct = (i / (sections.length - 1)) * 100;
        const isVisited = i <= activeIdx;
        const isCurrent = i === activeIdx;
        return (
          <div
            key={section.id}
            className="absolute"
            style={{ top: `${topPct}%`, left: "50%", transform: "translate(-50%, -50%)" }}
          >
            {isCurrent && (
              <div
                className="absolute rounded-full animate-ping"
                style={{ width: "14px", height: "14px", marginLeft: "-1px", background: "var(--antares-red)", opacity: 0.3 }}
              />
            )}
            <button
              onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })}
              onMouseEnter={() => setTooltipIdx(i)}
              onMouseLeave={() => setTooltipIdx(null)}
              aria-label={`Ir a ${section.label}`}
              className="relative z-10 rounded-full transition-all duration-300"
              style={{
                width: isCurrent ? "14px" : "10px",
                height: isCurrent ? "14px" : "10px",
                background: isVisited ? "var(--antares-red)" : darkMode ? "#44403c" : "#d6d3d1",
                boxShadow: isCurrent ? "0 0 0 3px rgba(217,78,63,0.25)" : "none",
              }}
            />
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

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Volver al inicio"
        className="absolute z-20 transition-all duration-100 hover:scale-110"
        style={{ top: `${planeTop}%`, left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--antares-red), var(--antares-red-dark))" }}
        >
          <svg
            viewBox="0 0 24 24" fill="white" className="w-5 h-5"
            style={{ transform: `rotate(${planeRotate}deg)`, transition: "transform 0.4s ease" }}
          >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </div>
        {progress > 0.85 && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-white text-stone-900 rounded-xl shadow-xl px-3 py-1.5 border border-stone-100 whitespace-nowrap text-xs font-bold pointer-events-none">
            ↑ Volver arriba
            <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-r border-t border-stone-100 rotate-45" />
          </div>
        )}
      </button>
    </div>
  );
}