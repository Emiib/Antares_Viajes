import { useEffect, useState } from "react";
import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import { usePackages } from "../../data/packagesStore";

export function Testimonials() {
  const { testimonials } = usePackages();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % testimonials.length), 7000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const idx = i % testimonials.length;
  const go = (dir: number) => setI((p) => (p + dir + testimonials.length) % testimonials.length);

  return (
    <section className="bg-base relative overflow-hidden" style={{ padding: "clamp(5.5rem,12vw,10rem) 0" }}>
      <div className="mx-auto max-w-[980px] px-5 text-center sm:px-8">
        <Reveal>
          <span className="font-display terra block text-[5rem] leading-none" style={{ opacity: 0.9 }}>“</span>
        </Reveal>
        <div className="relative mt-1" style={{ minHeight: "clamp(220px,32vw,300px)" }}>
          {testimonials.map((q, k) => (
            <figure key={k} className="absolute inset-0 flex flex-col items-center justify-start"
              style={{ transition: "opacity .8s var(--ease), transform .8s var(--ease)", opacity: k === idx ? 1 : 0, transform: k === idx ? "none" : "translateY(16px)", pointerEvents: k === idx ? "auto" : "none" }}>
              <blockquote className="font-display t1 italic leading-[1.28] text-balance" style={{ fontSize: "clamp(1.5rem,3.6vw,2.65rem)" }}>{q.text}</blockquote>
              <figcaption className="mt-8">
                <p className="t1 text-[0.98rem] font-semibold">{q.name}</p>
                <p className="t-faint mt-0.5 text-[0.85rem]">{q.city}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-center gap-5">
          <button onClick={() => go(-1)} aria-label="Anterior" className="grid h-12 w-12 place-items-center rounded-full t1" style={{ border: "1px solid var(--line)" }}>
            <Icon name="arrowL" className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Testimonio ${k + 1}`} className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: k === idx ? 26 : 8, background: k === idx ? "var(--terra)" : "var(--text-40)" }} />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Siguiente" className="grid h-12 w-12 place-items-center rounded-full t1" style={{ border: "1px solid var(--line)" }}>
            <Icon name="arrowR" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
