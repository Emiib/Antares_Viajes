import { useEffect, useState } from "react";
import { heroSlides } from "../config/site";

const SLIDE_INTERVAL_MS = 10_000;

export function useHeroSlide() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return currentSlide;
}