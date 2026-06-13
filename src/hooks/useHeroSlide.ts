import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "../config/site";

/**
 * Tiempo máximo por slide si el video no dispara `ended`
 * (red lenta, video pausado por el navegador, reduced-motion con poster, etc.)
 */
const FALLBACK_MS = 20_000;

/** ¿El usuario prefiere reducir movimiento? (accesibilidad) */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Rotación del hero: cada video se reproduce UNA vez y al terminar
 * (evento `ended`) avanza al siguiente. El timer de fallback solo actúa
 * si el video nunca termina.
 */
export function useHeroSlide() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fallbackRef = useRef<number | null>(null);

  const advance = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    fallbackRef.current = window.setTimeout(advance, FALLBACK_MS);
    return () => {
      if (fallbackRef.current) window.clearTimeout(fallbackRef.current);
    };
  }, [currentSlide, advance]);

  return { currentSlide, advance };
}
