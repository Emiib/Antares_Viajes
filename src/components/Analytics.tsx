import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// IDs de analítica. Si están vacíos (sitio sin publicar), no se carga nada.
const GA_ID = import.meta.env.VITE_GA_ID;
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function loadGA(id: string) {
  if (window.gtag) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  // Desactivamos el page_view automático: lo enviamos manualmente por ruta.
  window.gtag("config", id, { send_page_view: false });
}

function loadPixel(id: string) {
  if (window.fbq) return;
  const queue: unknown[] = [];
  const fbq: Window["fbq"] & { queue?: unknown[]; loaded?: boolean; version?: string } =
    (...args: unknown[]) => {
      queue.push(args);
    };
  fbq.queue = queue;
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", id);
}

/** Carga GA4 y Meta Pixel (si hay IDs) y registra page_view en cada cambio de ruta. */
export function Analytics() {
  const { pathname } = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (GA_ID) loadGA(GA_ID);
    if (PIXEL_ID) loadPixel(PIXEL_ID);
  }, []);

  useEffect(() => {
    if (GA_ID && window.gtag) {
      window.gtag("event", "page_view", { page_path: pathname });
    }
    if (PIXEL_ID && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}
