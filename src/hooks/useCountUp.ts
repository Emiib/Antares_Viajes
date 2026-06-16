import { useEffect, useRef, useState } from "react";

/** Cuenta de 0 a `target` cuando el elemento entra en viewport (una vez). */
export function useCountUp(target: number, durationMs = 1600) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting || done.current) return;
        done.current = true;
        io.unobserve(en.target);
        if (reduce) { setValue(target); return; }
        const t0 = performance.now();
        const ease = (x: number) => 1 - Math.pow(1 - x, 4);
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / durationMs);
          setValue(Math.round(target * ease(p)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, durationMs]);

  return { ref, value };
}
