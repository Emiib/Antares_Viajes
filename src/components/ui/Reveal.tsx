import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** dirección de entrada */
  variant?: "up" | "left" | "right";
  /** retardo en segundos */
  delay?: number;
  as?: "div" | "section" | "article" | "span";
  id?: string;
}

/** Envuelve contenido y le agrega la clase `.in` cuando entra en viewport (una vez). */
export function Reveal({ children, className = "", variant = "up", delay = 0, as = "div", id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variantCls = variant === "left" ? "reveal reveal-l" : variant === "right" ? "reveal reveal-r" : "reveal";
  const Tag = as as "div";
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} id={id}
      className={`${variantCls} ${className}`} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </Tag>
  );
}
