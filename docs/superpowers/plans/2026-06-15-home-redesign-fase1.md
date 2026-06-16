# Rediseño del Home — Fase 1 (visual) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir el Home con la estética editorial del diseño de Claude Design (terracota + dorado, Playfair + Plus Jakarta Sans), cableado a los datos y la captura de leads ya existentes, conservando el hero de video y el toggle dark/light.

**Architecture:** Componentes TSX nuevos bajo `src/components/home/` portados del diseño (`opener/services/destinations/premium/social/modal.jsx`). El tema se maneja con CSS variables sobre el mecanismo dark existente (clase `.antares-dark`), sin tocar `useDarkMode`. Animación solo con IntersectionObserver (reveal-once) + contadores; **sin GSAP**. Un contexto liviano expone `openLead(prefill)` para que los CTAs abran un modal único de captura.

**Tech Stack:** React 19, Vite 7, TypeScript 5.9 (strict), Tailwind v4, react-router-dom 7. Sin framework de tests de UI → verificación por `npx tsc --noEmit` + `npm run build` + revisión en navegador.

**Notas de ejecución:**
- El usuario suele tener corriendo `npm run dev` (puerto propio). No matar ese proceso; para verificar en navegador, usar el dev server activo o `npm run preview` tras el build.
- Trabajamos sobre `main` (preferencia del usuario en este repo).
- Diseño de origen (referencia): proyecto Claude Design "Antares", archivos `js/*.jsx`. El código a escribir está completo en este plan; no hace falta abrir el diseño.

---

## File Structure

**Crear:**
- `src/components/ui/Icon.tsx` — set de iconos stroke (sin emoji).
- `src/components/ui/Reveal.tsx` — wrapper reveal-on-enter (IntersectionObserver, once).
- `src/hooks/useCountUp.ts` — contador animado on-view.
- `src/context/LeadModalContext.tsx` — provider + `useLeadModal()` (`openLead`).
- `src/components/modals/LeadModal.tsx` — modal único de captura de leads.
- `src/components/home/ServicesEditorial.tsx`
- `src/components/home/DestinationsStrip.tsx`
- `src/components/home/WhyUs.tsx`
- `src/components/home/Testimonials.tsx`
- `src/components/home/FooterCTA.tsx`

**Modificar:**
- `index.html` — sumar fuentes Playfair Display + Plus Jakarta Sans.
- `src/index.css` — tokens del tema (`:root` + `.antares-dark`), clases theme-aware, clases reveal.
- `src/components/layout/Navbar.tsx` — wordmark, dropdown Servicios, Luxury, sacar Notas, Ofertas→openLead.
- `src/components/layout/Footer.tsx` — footer editorial con datos reales.
- `src/components/home/LuxurySection.tsx` — reescribir (Atlantis + dorado + textos + gap).
- `src/components/home/LeadQualifier.tsx` — restyle a la paleta nueva.
- `src/data/destinations.ts` — sumar `country` y `priceFrom` opcionales.
- `src/pages/HomePage.tsx` — hero restyle + fix video; ensamblar secciones nuevas; ids de ancla.
- `src/App.tsx` — envolver con `LeadModalProvider`; quitar `FooterShowcase`, `ScrollPlane`, `TripFormModal`; render `Footer` nuevo.

**Eliminar del Home (no borrar archivos aún):** `FooterShowcase` y `ScrollPlane` dejan de renderizarse.

---

## Task 1: Tokens del tema + fuentes

**Files:**
- Modify: `index.html` (línea 35, link de fuentes)
- Modify: `src/index.css` (agregar al final + tokens en `:root`)

- [ ] **Step 1: Agregar fuentes en `index.html`**

Reemplazar la línea 35 (el `<link>` de Google Fonts) por:

```html
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Agregar tokens y utilidades en `src/index.css`**

Agregar dentro del `:root` existente (después de `--antares-brown: #6B4E31;`):

```css
  /* ── Tokens rediseño Home (light por defecto) ── */
  --terra: #D94E3F;
  --terra-dk: #B83C2F;
  --terra-soft: #E8836F;
  --gold: #C6A461;
  --gold-soft: #E2C893;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);

  --bg: #F4EFE7;
  --text: #1B1610;
  --text-70: rgba(27,22,16,.72);
  --text-55: rgba(27,22,16,.55);
  --text-40: rgba(27,22,16,.40);
  --line: rgba(27,22,16,.13);
  --card: #ffffff;
  --nav-solid: rgba(244,239,231,0.82);
  --nav-border: rgba(27,22,16,.08);
```

Agregar al final del archivo:

```css
/* ── Tokens rediseño Home (dark) ── */
.antares-dark {
  --bg: #0E0C0B;
  --text: #F4EDE2;
  --text-70: rgba(244,237,226,.72);
  --text-55: rgba(244,237,226,.55);
  --text-40: rgba(244,237,226,.40);
  --line: rgba(244,237,226,.13);
  --card: #181410;
  --nav-solid: rgba(14,12,11,0.72);
  --nav-border: rgba(244,237,226,.08);
}

/* Clases theme-aware del Home */
.bg-base { background-color: var(--bg); }
.card-base { background-color: var(--card); }
.t1 { color: var(--text); }
.t-soft { color: var(--text-70); }
.t-mut { color: var(--text-55); }
.t-faint { color: var(--text-40); }
.border-base { border-color: var(--line) !important; }
.terra { color: var(--terra); }
.text-terrasoft { color: var(--terra-soft); }

.font-display { font-family: "Playfair Display", Georgia, serif; }
.font-ui { font-family: "Plus Jakarta Sans", system-ui, sans-serif; }
.ls-wide { letter-spacing: 0.42em; }
.ls-mid { letter-spacing: 0.22em; }
.text-balance { text-wrap: balance; }
.text-pretty { text-wrap: pretty; }
.no-bar { scrollbar-width: none; }
.no-bar::-webkit-scrollbar { display: none; }

/* Premium (dorado, confinado a #premium) */
.gold-line { background: linear-gradient(90deg, transparent, var(--gold) 22%, var(--gold) 78%, transparent); }
.gold-text { background: linear-gradient(100deg, var(--gold-soft), var(--gold) 55%, #9e7e44);
  -webkit-background-clip: text; background-clip: text; color: transparent; }

/* Reveal-on-enter (la clase .in la agrega el componente Reveal) */
.reveal { opacity: 0; transform: translateY(28px);
  transition: opacity .8s var(--ease), transform .8s var(--ease); will-change: opacity, transform; }
.reveal.in { opacity: 1; transform: none; }
.reveal-l { transform: translateX(-28px); }
.reveal-r { transform: translateX(28px); }
.reveal-l.in, .reveal-r.in { transform: none; }

@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal-l, .reveal-r { opacity: 1 !important; transform: none !important; }
}
```

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: build OK sin errores de CSS.

- [ ] **Step 4: Commit**

```bash
git add index.html src/index.css
git commit -m "feat(home): tokens de tema + fuentes editoriales para el rediseño"
```

---

## Task 2: Componente Icon

**Files:**
- Create: `src/components/ui/Icon.tsx`

- [ ] **Step 1: Crear `src/components/ui/Icon.tsx`**

```tsx
import type { ReactElement } from "react";

export type IconName =
  | "globe" | "plane" | "diamond" | "map" | "compass" | "shield" | "concierge"
  | "sparkle" | "key" | "arrowR" | "arrowL" | "arrowDown" | "pin" | "phone"
  | "mail" | "whatsapp" | "instagram" | "facebook" | "menu" | "close" | "check"
  | "sun" | "moon";

interface IconProps {
  name: IconName;
  className?: string;
  stroke?: number;
}

export function Icon({ name, className = "", stroke = 1.5 }: IconProps) {
  const p = {
    fill: "none", stroke: "currentColor", strokeWidth: stroke,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
  const paths: Record<IconName, ReactElement> = {
    globe: (<g {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" /></g>),
    plane: (<g {...p}><path d="M10.5 3.5 13 3l-.4 6.2 7.9 4.3-.3 1.8-7.9-2.2-1.1 4.6 2.4 1.6-.2 1.4-3.6-1-3.6 1-.2-1.4 2.4-1.6-1.1-4.6L4 16.3l-.3-1.8 7.9-4.3L11.2 4z" /></g>),
    diamond: (<g {...p}><path d="M6 3h12l3 5-9 13L3 8z" /><path d="M3 8h18M9 3 7.5 8 12 21 16.5 8 15 3M9 8l3 13 3-13" /></g>),
    map: (<g {...p}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14M15 6v14" /></g>),
    compass: (<g {...p}><circle cx="12" cy="12" r="9" /><path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1z" /></g>),
    shield: (<g {...p}><path d="M12 3 5 6v5.5c0 4.3 3 7.4 7 9.5 4-2.1 7-5.2 7-9.5V6z" /><path d="m9 12 2 2 4-4" /></g>),
    concierge: (<g {...p}><path d="M4 16a8 8 0 0 1 16 0" /><path d="M2 16h20" /><path d="M7 16v-2a5 5 0 0 1 10 0v2" /><circle cx="12" cy="6" r="1.4" /></g>),
    sparkle: (<g {...p}><path d="M12 3c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7Z" /><path d="M18.5 4.5c.2 1.4.8 2 2.2 2.2-1.4.2-2 .8-2.2 2.2-.2-1.4-.8-2-2.2-2.2 1.4-.2 2-.8 2.2-2.2Z" /></g>),
    key: (<g {...p}><circle cx="8" cy="8" r="4" /><path d="m11 11 8 8M16 16l2-2M19 19l2-2" /></g>),
    arrowR: (<g {...p}><path d="M5 12h14M13 6l6 6-6 6" /></g>),
    arrowL: (<g {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></g>),
    arrowDown: (<g {...p}><path d="M12 5v14M6 13l6 6 6-6" /></g>),
    pin: (<g {...p}><path d="M12 21c4-4.5 7-8 7-11a7 7 0 1 0-14 0c0 3 3 6.5 7 11Z" /><circle cx="12" cy="10" r="2.5" /></g>),
    phone: (<g {...p}><path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L17 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2Z" /></g>),
    mail: (<g {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></g>),
    whatsapp: (<g fill="currentColor" stroke="none"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.96.51 3.78 1.4 5.37L2 22l4.86-1.27a9.9 9.9 0 0 0 5.18 1.44h.01c5.46 0 9.9-4.45 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.2c-.25.69-1.44 1.32-1.98 1.36-.53.05-1.02.24-3.45-.72-2.9-1.14-4.74-4.1-4.89-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.08 1-2.37.24-.26.53-.33.71-.33.18 0 .35.002.51.01.16.007.39-.06.6.46.25.6.81 2.07.88 2.22.07.15.12.32.02.51-.1.19-.14.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.17.29.74 1.22 1.59 1.98 1.1.98 2.02 1.28 2.31 1.42.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.14.26.09 1.66.78 1.95.93.29.14.48.21.55.33.07.12.07.69-.18 1.38Z" /></g>),
    instagram: (<g {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></g>),
    facebook: (<g {...p}><path d="M14.5 8.5H17V5h-2.5C12.6 5 11 6.6 11 8.5V11H8.5v3.5H11V21h3.5v-6.5H17l.5-3.5h-3V8.9c0-.3.2-.4.5-.4Z" /></g>),
    menu: (<g {...p}><path d="M4 7h16M4 12h16M4 17h16" /></g>),
    close: (<g {...p}><path d="M6 6l12 12M18 6 6 18" /></g>),
    check: (<g {...p}><path d="M4 12.5 9 17.5 20 6.5" /></g>),
    sun: (<g {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></g>),
    moon: (<g {...p}><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z" /></g>),
  };
  return (<svg viewBox="0 0 24 24" className={className} aria-hidden="true">{paths[name]}</svg>);
}
```

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Icon.tsx
git commit -m "feat(home): componente Icon (set stroke, sin emoji)"
```

---

## Task 3: Reveal + contador

**Files:**
- Create: `src/components/ui/Reveal.tsx`
- Create: `src/hooks/useCountUp.ts`

- [ ] **Step 1: Crear `src/hooks/useCountUp.ts`**

```ts
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
```

- [ ] **Step 2: Crear `src/components/ui/Reveal.tsx`**

```tsx
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
```

- [ ] **Step 3: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Reveal.tsx src/hooks/useCountUp.ts
git commit -m "feat(home): Reveal (IO once) + useCountUp"
```

---

## Task 4: Contexto + Modal de leads

**Files:**
- Create: `src/context/LeadModalContext.tsx`
- Create: `src/components/modals/LeadModal.tsx`

- [ ] **Step 1: Crear `src/context/LeadModalContext.tsx`**

```tsx
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type LeadPrefill = { destino?: string; context?: string };

type LeadModalValue = {
  open: boolean;
  prefill: LeadPrefill | null;
  openLead: (prefill?: LeadPrefill) => void;
  closeLead: () => void;
};

const Ctx = createContext<LeadModalValue | null>(null);

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<LeadPrefill | null>(null);

  const openLead = useCallback((p?: LeadPrefill) => { setPrefill(p ?? null); setOpen(true); }, []);
  const closeLead = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, prefill, openLead, closeLead }), [open, prefill, openLead, closeLead]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLeadModal(): LeadModalValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLeadModal debe usarse dentro de <LeadModalProvider>");
  return ctx;
}
```

- [ ] **Step 2: Crear `src/components/modals/LeadModal.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Icon } from "../ui/Icon";
import { captureLead } from "../../lib/leads";
import { useLeadModal } from "../../context/LeadModalContext";

interface LeadModalProps {
  wa: (text?: string) => string;
}

/** Modal único de captura. Persiste el lead (fire-and-forget) y ofrece seguir por WhatsApp. */
export function LeadModal({ wa }: LeadModalProps) {
  const { open, prefill, closeLead } = useLeadModal();
  const [data, setData] = useState({ nombre: "", contacto: "", destino: "", mensaje: "" });
  const [sent, setSent] = useState(false);
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setData((d) => ({ ...d, destino: prefill?.destino || "" }));
    setSent(false);
    const t = setTimeout(() => firstRef.current?.focus(), 360);
    return () => clearTimeout(t);
  }, [open, prefill]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeLead();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeLead]);

  const set = (key: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [key]: e.target.value }));

  const waMsg = () =>
    `Hola Antares, soy ${data.nombre || "—"}. Quiero consultar por ${data.destino || "un viaje"}.` +
    (data.mensaje ? ` ${data.mensaje}` : "");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    captureLead({
      source: prefill?.context || "lead_modal",
      name: data.nombre,
      contact: data.contacto,
      destination: data.destino,
      message: data.mensaje,
    });
    setSent(true);
  };

  return (
    <div
      className="modal-scrim fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      style={{
        background: "rgba(8,7,6,.66)", backdropFilter: "blur(8px)",
        opacity: open ? 1 : 0, visibility: open ? "visible" : "hidden",
        pointerEvents: open ? "auto" : "none", transition: "opacity .4s var(--ease), visibility .4s",
      }}
      onMouseDown={(e) => e.target === e.currentTarget && closeLead()}
    >
      <div
        className="card-base font-ui relative w-full rounded-t-2xl p-7 sm:max-w-[460px] sm:rounded-md sm:p-9"
        style={{
          boxShadow: "0 40px 90px -30px rgba(0,0,0,.8)",
          opacity: open ? 1 : 0, transform: open ? "none" : "translateY(28px)",
          transition: "opacity .55s var(--ease), transform .55s var(--ease)",
        }}
      >
        <button onClick={closeLead} aria-label="Cerrar"
          className="t-soft absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full transition-colors hover:text-[var(--terra)]"
          style={{ border: "1px solid var(--line)" }}>
          <Icon name="close" className="h-4 w-4" />
        </button>

        {!sent ? (
          <>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8" style={{ background: "var(--terra)" }} />
              <span className="terra text-[0.66rem] font-semibold uppercase ls-wide">Consulta sin compromiso</span>
            </div>
            <h3 className="font-display t1 leading-[1.05]" style={{ fontSize: "clamp(1.8rem,5vw,2.3rem)" }}>
              Armemos tu<span className="italic"> viaje.</span>
            </h3>
            <p className="t-mut mt-3 text-[0.92rem] leading-relaxed">
              Dejanos tus datos y te respondemos con una propuesta hecha a tu medida.
            </p>
            <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-5">
              <input ref={firstRef} className="lead-input" placeholder="Tu nombre" required value={data.nombre} onChange={set("nombre")} />
              <input className="lead-input" placeholder="Teléfono o email" required value={data.contacto} onChange={set("contacto")} />
              <input className="lead-input" placeholder="¿A dónde querés ir?" value={data.destino} onChange={set("destino")} />
              <textarea className="lead-input" rows={2} placeholder="Contanos más (opcional)" value={data.mensaje} onChange={set("mensaje")} />
              <button type="submit"
                className="group mt-2 inline-flex items-center justify-center gap-2.5 rounded-full py-3.5 text-[0.92rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "var(--terra)", boxShadow: "0 16px 40px -16px rgba(217,78,63,.95)" }}>
                Enviar consulta
                <Icon name="arrowR" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </>
        ) : (
          <div className="py-4 text-center sm:text-left">
            <span className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full sm:mx-0"
              style={{ background: "rgba(217,78,63,.14)", color: "var(--terra)" }}>
              <Icon name="check" className="h-7 w-7" stroke={1.8} />
            </span>
            <h3 className="font-display t1 leading-[1.08]" style={{ fontSize: "clamp(1.7rem,4.6vw,2.2rem)" }}>
              ¡Gracias, {data.nombre ? data.nombre.split(" ")[0] : "viajero"}!
            </h3>
            <p className="t-mut mx-auto mt-3 max-w-[24rem] text-[0.95rem] leading-relaxed sm:mx-0">
              Recibimos tu consulta. Seguí la conversación por WhatsApp y empezamos a diseñar tu itinerario ahora mismo.
            </p>
            <a href={wa(waMsg())} target="_blank" rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2.5 rounded-full py-3.5 pl-7 pr-6 text-[0.92rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "#25D366", boxShadow: "0 16px 40px -16px rgba(37,211,102,.8)" }}>
              <Icon name="whatsapp" className="h-5 w-5" />
              Continuar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Agregar estilos `.lead-input` en `src/index.css`** (al final)

```css
.lead-input { width: 100%; background: transparent; border: 0; border-bottom: 1px solid var(--line);
  padding: .7rem 0; font-size: 1rem; color: var(--text); outline: none; transition: border-color .3s var(--ease); }
.lead-input::placeholder { color: var(--text-40); }
.lead-input:focus { border-color: var(--terra); }
textarea.lead-input { resize: none; }
```

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores. (Nota: `LeadModal` aún no se renderiza; se conecta en Task 14.)

- [ ] **Step 5: Commit**

```bash
git add src/context/LeadModalContext.tsx src/components/modals/LeadModal.tsx src/index.css
git commit -m "feat(home): contexto + modal único de captura de leads"
```

---

## Task 5: Navbar

**Files:**
- Modify: `src/components/layout/Navbar.tsx` (reescribir)

- [ ] **Step 1: Reescribir `src/components/layout/Navbar.tsx`**

```tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { useLeadModal } from "../../context/LeadModalContext";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  navbarVisible: boolean;
}

const SERVICIOS = [
  { label: "Argentina", to: "/argentina" },
  { label: "Circuitos", to: "/circuitos" },
  { label: "Cruceros", to: "/cruceros" },
  { label: "Quinceañeras", to: "/quinceaneras" },
];

const ANCHORS = [
  { label: "Destinos", href: "#destinos" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Luxury", href: "#premium" },
  { label: "Contacto", href: "#contacto" },
];

function smoothTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar({ darkMode, setDarkMode, navbarVisible }: NavbarProps) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [serviciosOpen, setServiciosOpen] = useState(false);
  const { openLead } = useLeadModal();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  if (!navbarVisible) {
    // se mantiene el comportamiento de ocultar al bajar; cuando vuelve, aparece.
  }

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 transition-all duration-500"
        style={{
          transform: navbarVisible ? "translateY(0)" : "translateY(-110%)",
          background: solid ? "var(--nav-solid)" : "transparent",
          backdropFilter: solid ? "blur(16px) saturate(1.2)" : "none",
          borderBottom: solid ? "1px solid var(--nav-border)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex h-[76px] max-w-[1340px] items-center justify-between px-5 sm:px-8">
          {/* Wordmark */}
          <Link to="/" className="flex select-none flex-col leading-none">
            <span className="font-display t1 text-[1.5rem] font-semibold ls-mid sm:text-[1.7rem]">ANTARES</span>
            <span className="t-mut mt-[3px] text-[0.55rem] font-medium uppercase ls-wide">Viajes y Turismo</span>
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            {/* Servicios dropdown */}
            <div className="relative" onMouseEnter={() => setServiciosOpen(true)} onMouseLeave={() => setServiciosOpen(false)}>
              <button className="t1 flex items-center gap-1 text-[0.82rem] font-medium tracking-wide">
                Servicios
                <Icon name="arrowDown" className="h-3.5 w-3.5" />
              </button>
              <div
                className="card-base absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 rounded-xl border-base p-2 shadow-xl transition-all"
                style={{
                  border: "1px solid var(--line)",
                  opacity: serviciosOpen ? 1 : 0,
                  visibility: serviciosOpen ? "visible" : "hidden",
                  transform: `translateX(-50%) translateY(${serviciosOpen ? "0" : "8px"})`,
                }}
              >
                {SERVICIOS.map((s) => (
                  <Link key={s.to} to={s.to}
                    className="t-soft block rounded-lg px-3 py-2 text-sm transition-colors hover:text-[var(--terra)]">
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>

            {ANCHORS.map((l) => (
              <a key={l.label} href={l.href}
                onClick={(e) => { e.preventDefault(); smoothTo(l.href); }}
                className="t1 group relative text-[0.82rem] font-medium tracking-wide">
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" style={{ background: "var(--terra)" }} />
              </a>
            ))}

            <button onClick={() => setDarkMode(!darkMode)} aria-label="Cambiar modo claro u oscuro"
              className="t1 grid h-11 w-11 place-items-center rounded-full transition-transform hover:scale-110">
              <Icon name={darkMode ? "sun" : "moon"} className="h-5 w-5" />
            </button>
            <button onClick={() => openLead({ context: "nav" })}
              className="rounded-full px-6 py-2.5 text-[0.82rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "var(--terra)", boxShadow: "0 8px 22px -10px rgba(217,78,63,.9)" }}>
              Ofertas
            </button>
          </nav>

          {/* Mobile triggers */}
          <div className="flex items-center gap-1 md:hidden">
            <button onClick={() => setDarkMode(!darkMode)} aria-label="Cambiar modo" className="t1 grid h-11 w-11 place-items-center rounded-full">
              <Icon name={darkMode ? "sun" : "moon"} className="h-5 w-5" />
            </button>
            <button onClick={() => setOpen(true)} aria-label="Abrir menú" className="t1 -mr-2 grid h-11 w-11 place-items-center">
              <Icon name="menu" className="h-7 w-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className="fixed inset-0 z-[60] flex flex-col md:hidden"
        style={{
          background: "#100D0B",
          transition: "opacity .5s var(--ease), visibility .5s",
          opacity: open ? 1 : 0, visibility: open ? "visible" : "hidden", pointerEvents: open ? "auto" : "none",
        }}>
        <div className="flex h-[76px] items-center justify-between px-5">
          <span className="font-display text-[1.5rem] font-semibold ls-mid text-white">ANTARES</span>
          <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="-mr-2 grid h-11 w-11 place-items-center text-white">
            <Icon name="close" className="h-7 w-7" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-1 px-7">
          {SERVICIOS.map((s) => (
            <Link key={s.to} to={s.to} onClick={() => setOpen(false)} className="font-display text-[1.8rem] leading-[1.5] text-white/90">{s.label}</Link>
          ))}
          {ANCHORS.map((l) => (
            <a key={l.label} href={l.href} onClick={(e) => { e.preventDefault(); setOpen(false); setTimeout(() => smoothTo(l.href), 380); }}
              className="font-display text-[2rem] leading-[1.4] text-white">{l.label}</a>
          ))}
        </nav>
        <div className="px-7 pb-12">
          <button onClick={() => { setOpen(false); openLead({ context: "nav-mobile" }); }}
            className="block w-full rounded-full py-4 text-center text-base font-semibold text-white" style={{ background: "var(--terra)" }}>
            Consultar
          </button>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores. (Navbar usa `useLeadModal`, que estará disponible una vez que App envuelva con el provider en Task 14. El typecheck pasa igual; en runtime se valida en Task 14.)

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat(home): navbar editorial con dropdown Servicios y Luxury"
```

---

## Task 6: Hero (restyle + fix de video)

**Files:**
- Modify: `src/pages/HomePage.tsx` (sección hero) — la sección hero se reescribe; el ensamblado final del resto del Home es Task 14.

**Diagnóstico del video (hacer primero):**

- [ ] **Step 1: Confirmar la causa en el navegador**

Abrir la app (dev server activo) y en consola ejecutar:
`window.matchMedia("(prefers-reduced-motion: reduce)").matches`
- Si devuelve `true` → la causa es el fallback de reduced-motion (HomePage muestra `<img poster>`). Confirmado.
- Revisar también la pestaña Network: que `paris-desktop.webm/.mp4` respondan 200.

- [ ] **Step 2: Reescribir SOLO la sección hero dentro de `HomePage.tsx`**

Reemplazar el bloque `<section id="hero" …>…</section>` (líneas ~54-153) por el siguiente. Cambios: el `<video>` se renderiza **siempre** (autoplay muted), independientemente de reduced-motion, con el poster como fallback de carga; título en Playfair; paleta terra. El form de búsqueda y los badges se conservan.

```tsx
      {/* ── HERO (video, editorial) ── */}
      <section id="hero" data-track-section="hero" className="relative flex min-h-screen items-center overflow-hidden md:min-h-[105vh]">
        <div className="absolute inset-0 z-0">
          <video
            key={`${slide.label}-${isMobileViewport ? "m" : "d"}`}
            className="animate-hero-video absolute inset-0 h-full w-full object-cover"
            poster={slide.poster}
            onEnded={advance}
            autoPlay muted playsInline preload="auto"
          >
            <source src={webm} type="video/webm" />
            <source src={mp4} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1340px] px-5 py-16 sm:px-8">
          <div className="max-w-2xl">
            <h1 className="font-display mb-5 max-w-3xl font-medium leading-[0.98] text-white text-balance" style={{ fontSize: "clamp(2.6rem,7vw,5.4rem)" }}>
              Tu viaje soñado,
              <span className="block italic" style={{ color: "#F1E4DC" }}>armado a tu medida.</span>
            </h1>
            <p className="mb-7 max-w-xl text-base font-medium text-white/90 sm:text-lg">
              Hace más de 30 años convertimos ideas en viajes inolvidables. Vos elegís el destino;
              nosotros nos ocupamos de todo — con asesoría personalizada y guardia 24 hs durante todo el viaje.
            </p>
            <form onSubmit={handleSearch} className="card-base rounded-2xl p-4 shadow-2xl md:p-5">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="hero-destination" className="t-mut mb-1.5 block text-[10px] font-semibold uppercase tracking-wider">Destino</label>
                  <input id="hero-destination" type="text" placeholder="¿A dónde?"
                    value={searchData.destination} onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--terra)]"
                    style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--text)" }} />
                </div>
                <div>
                  <label htmlFor="hero-departure" className="t-mut mb-1.5 block text-[10px] font-semibold uppercase tracking-wider">Fecha</label>
                  <select id="hero-departure" value={searchData.departure} onChange={(e) => setSearchData({ ...searchData, departure: e.target.value })}
                    className="w-full appearance-none rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--terra)]"
                    style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--text)" }}>
                    <option value="">¿Cuándo?</option>
                    {departureMonthOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor="hero-passengers" className="t-mut mb-1.5 block text-[10px] font-semibold uppercase tracking-wider">Pasajeros</label>
                  <select id="hero-passengers" value={searchData.passengers} onChange={(e) => setSearchData({ ...searchData, passengers: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--terra)]"
                    style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--text)" }}>
                    {["1","2","3","4","5+"].map((n) => (<option key={n} value={n}>{n}</option>))}
                  </select>
                </div>
                <div className="col-span-2 flex items-end md:col-span-1">
                  <button type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: "var(--terra)" }}>
                    Buscar mi viaje →
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-white/90 sm:text-sm">
              <span>✓ +30 años de experiencia</span>
              <span>✓ Atención personalizada</span>
              <span>✓ Guardia 24 hs en viaje</span>
            </div>
          </div>
        </div>
      </section>
```

- [ ] **Step 3: Quitar el import y uso de `usePrefersReducedMotion` del hero**

En `HomePage.tsx`, la línea `const prefersReducedMotion = usePrefersReducedMotion();` queda sin uso tras el cambio. Quitarla y quitar `usePrefersReducedMotion` del import de `../hooks/useHeroSlide` (dejar `useHeroSlide`).

- [ ] **Step 4: Verificar build + video**

Run: `npx tsc --noEmit && npm run build`
Expected: sin errores.
Navegador: el hero ahora reproduce el video aunque reduced-motion esté activo. (El `<source>` correcto se elige por `isMobileViewport`.)

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "fix(home): el hero reproduce el video siempre (ya no cae al poster por reduced-motion) + restyle editorial"
```

---

## Task 7: ServicesEditorial

**Files:**
- Create: `src/components/home/ServicesEditorial.tsx`

- [ ] **Step 1: Crear `src/components/home/ServicesEditorial.tsx`**

```tsx
import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import { useLeadModal } from "../../context/LeadModalContext";

type Service = { key: string; num: string; name: string; line: string; tail: string; desc: string; img: string; to: string };

const SERVICES: Service[] = [
  { key: "paquetes", num: "01", name: "Paquetes Turísticos", line: "Paquetes", tail: "a tu medida.", to: "/ofertas",
    desc: "Vuelos, hotelería y traslados resueltos en una sola conversación. Elegís el destino; nosotros armamos cada pieza alrededor de cómo querés viajar.",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1300" },
  { key: "grupales", num: "02", name: "Viajes Grupales", line: "Viajes", tail: "en grupo.", to: "/grupales",
    desc: "Salidas acompañadas, contingentes y delegaciones con coordinación propia. Treinta personas, un solo equipo atrás resolviendo todo en tiempo real.",
    img: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=1300" },
  { key: "circuitos", num: "03", name: "Circuitos Internacionales", line: "Circuitos", tail: "sin sorpresas.", to: "/circuitos",
    desc: "Recorridos guiados por varios países con cada traslado, hotel y excursión anticipados. Te movés liviano: la logística ya está pensada de punta a punta.",
    img: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1300" },
];

function ServiceRow({ s, i }: { s: Service; i: number }) {
  const { openLead } = useLeadModal();
  const flip = i % 2 === 1;
  return (
    <article className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-10">
      <Reveal variant={flip ? "right" : "left"} className={flip ? "md:order-2 md:col-span-6" : "md:col-span-6"}>
        <button onClick={() => openLead({ destino: s.name, context: "service:" + s.key })}
          className="group relative block w-full overflow-hidden rounded" style={{ aspectRatio: "16/10" }}>
          <img src={s.img} alt={s.name} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105" style={{ transitionTimingFunction: "var(--ease)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(10,9,8,.5) 100%)" }} />
        </button>
      </Reveal>
      <Reveal delay={0.08} className={flip ? "md:order-1 md:col-span-5 md:col-start-1" : "md:col-span-5 md:col-start-8"}>
        <span className="font-display t-faint mb-3 block text-[1.3rem]">{s.num} — 03</span>
        <h3 className="font-display t1 leading-[0.98]" style={{ fontSize: "clamp(2.4rem,4.6vw,3.8rem)" }}>
          {s.line}<br /><span className="terra italic">{s.tail}</span>
        </h3>
        <p className="t-mut mt-5 max-w-[30rem] text-[1rem] leading-relaxed text-pretty">{s.desc}</p>
        <button onClick={() => openLead({ destino: s.name, context: "service:" + s.key })}
          className="terra group mt-6 inline-flex items-center gap-2.5 text-[0.9rem] font-semibold">
          Quiero ver paquetes
          <Icon name="arrowR" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </Reveal>
    </article>
  );
}

export function ServicesEditorial() {
  return (
    <section id="servicios" className="bg-base relative" style={{ padding: "clamp(5.5rem,12vw,9.5rem) 0" }}>
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        <Reveal className="mb-16 max-w-[42rem] sm:mb-24">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-9" style={{ background: "var(--terra)" }} />
            <span className="terra text-[0.7rem] font-semibold uppercase ls-wide">Lo que hacemos</span>
          </div>
          <h2 className="font-display t1 leading-[1.02] text-balance" style={{ fontSize: "clamp(2.3rem,5.6vw,4.4rem)" }}>
            Tres formas de salir<br /><span className="italic">al mundo</span> — y una más, <span className="italic">exclusiva.</span>
          </h2>
          <p className="t-mut mt-6 max-w-[34rem] text-[1.02rem] leading-relaxed text-pretty">
            No vendemos paquetes de catálogo. Escuchamos cómo querés viajar y construimos el itinerario alrededor de esa idea.
          </p>
        </Reveal>
        <div className="flex flex-col gap-16 sm:gap-24">
          {SERVICES.map((s, i) => <ServiceRow key={s.key} s={s} i={i} />)}
        </div>
      </div>
    </section>
  );
}
```

> Nota: las imágenes son Unsplash temporales. En Fase 2 pasan a `config` (editables desde el panel) con estas como fallback.

- [ ] **Step 2: Verificar tipos** — `npx tsc --noEmit` → sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ServicesEditorial.tsx
git commit -m "feat(home): sección Servicios editorial (3 filas)"
```

---

## Task 8: DestinationsStrip

**Files:**
- Modify: `src/data/destinations.ts` (sumar campos opcionales)
- Create: `src/components/home/DestinationsStrip.tsx`

- [ ] **Step 1: Extender `src/data/destinations.ts`**

Agregar `country` y `priceFrom` opcionales a los **3 primeros** destinos (los que se muestran). Reemplazar los 3 primeros objetos por:

```ts
  {
    name: "Caribe",
    subtitle: "Playas, all inclusive y relax",
    country: "Todo incluido",
    priceFrom: "2.100",
    image: "/img/destinos/caribe.webp",
    to: "/ofertas",
  },
  {
    name: "Brasil",
    subtitle: "Cercanía, playa y diversión",
    country: "Nordeste",
    priceFrom: "1.420",
    image: "/img/destinos/brasil.webp",
    to: "/ofertas",
  },
  {
    name: "Europa",
    subtitle: "Ciudades icónicas y circuitos",
    country: "Gran Tour",
    priceFrom: "3.650",
    image: "/img/destinos/europa.webp",
    to: "/circuitos",
  },
```

(Los demás quedan igual. Como el `as const` infiere los tipos, `country`/`priceFrom` quedan opcionales solo donde existen — el componente los lee con optional chaining.)

- [ ] **Step 2: Crear `src/components/home/DestinationsStrip.tsx`**

```tsx
import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import { useLeadModal } from "../../context/LeadModalContext";
import { popularDestinations } from "../../data/destinations";

type Dest = { name: string; subtitle: string; image: string; to: string; country?: string; priceFrom?: string };

export function DestinationsStrip() {
  const { openLead } = useLeadModal();
  const dests = (popularDestinations as readonly Dest[]).slice(0, 3);

  return (
    <section id="destinos" className="bg-base relative overflow-hidden" style={{ padding: "clamp(5rem,11vw,8.5rem) 0" }}>
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        <Reveal className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[34rem]">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9" style={{ background: "var(--terra)" }} />
              <span className="terra text-[0.7rem] font-semibold uppercase ls-wide">Destinos</span>
            </div>
            <h2 className="font-display t1 leading-[1.03] text-balance" style={{ fontSize: "clamp(2.2rem,5vw,4rem)" }}>
              Destinos que son<br /><span className="italic">tendencia.</span>
            </h2>
          </div>
          <div className="t-faint hidden shrink-0 items-center gap-2 pb-2 text-[0.78rem] font-medium sm:flex">
            <span>Deslizá para explorar</span><Icon name="arrowR" className="terra h-5 w-5" />
          </div>
        </Reveal>
      </div>

      <Reveal className="no-bar snap-x snap-mandatory overflow-x-auto">
        <div className="flex gap-4 px-5 sm:gap-5 sm:px-8 md:px-[max(2rem,calc((100vw-1340px)/2+2rem))]">
          {dests.map((d, i) => (
            <Link key={d.name} to={d.to}
              className="group relative shrink-0 snap-start overflow-hidden rounded"
              style={{ width: "clamp(265px,78vw,400px)", height: "clamp(400px,60vh,540px)", background: "#1a1611" }}>
              <div className="absolute inset-0 overflow-hidden">
                <img src={d.image} alt={d.name} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-105" style={{ transitionTimingFunction: "var(--ease)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,9,8,.05) 35%, rgba(10,9,8,.88) 100%)" }} />
              </div>
              <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
                <div className="flex items-start justify-between">
                  <span className="font-display text-xl text-white/40">0{i + 1}</span>
                  {d.priceFrom && (
                    <span className="rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold text-white backdrop-blur-md"
                      style={{ background: "rgba(244,237,226,.13)", border: "1px solid rgba(244,237,226,.2)" }}>
                      desde USD {d.priceFrom}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[0.68rem] font-semibold uppercase ls-wide text-white/65">{d.country ?? d.subtitle}</span>
                  <h3 className="font-display mt-1 text-[1.9rem] leading-[1.02] text-white sm:text-[2.3rem]">{d.name}</h3>
                  <span className="text-terrasoft mt-3 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold transition-all duration-300 group-hover:translate-x-0.5">
                    Ver paquetes <Icon name="arrowR" className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
          <div className="flex w-[78vw] shrink-0 items-center sm:w-[300px]">
            <button onClick={() => openLead({ context: "destino:otro" })} className="t1 group inline-flex items-center gap-3 text-left">
              <span className="font-display text-[1.8rem] italic leading-tight">¿Tu destino<br />no está acá?</span>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1" style={{ background: "var(--terra)" }}>
                <Icon name="arrowR" className="h-5 w-5 text-white" />
              </span>
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 3: Verificar tipos** — `npx tsc --noEmit` → sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/data/destinations.ts src/components/home/DestinationsStrip.tsx
git commit -m "feat(home): strip de Destinos (3 cards → catálogo)"
```

---

## Task 9: WhyUs

**Files:**
- Create: `src/components/home/WhyUs.tsx`

- [ ] **Step 1: Crear `src/components/home/WhyUs.tsx`**

```tsx
import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";
import { useCountUp } from "../../hooks/useCountUp";

const STATS = [
  { target: 30, prefix: "+", label: "Años de trayectoria", note: "Operando sin interrupciones desde 1994." },
  { target: 5000, prefix: "+", label: "Viajeros acompañados", note: "Familias, parejas y contingentes." },
  { target: 80, prefix: "+", label: "Destinos coordinados", note: "En los cinco continentes." },
];

const FEATURES: { icon: IconName; title: string; copy: string }[] = [
  { icon: "compass", title: "Asesoramiento real", copy: "Diseñamos cada itinerario con vos. Sin plantillas, sin paquetes genéricos." },
  { icon: "shield", title: "Respaldo de tres décadas", copy: "Treinta años operando en Entre Ríos nos avalan ante cada cliente." },
  { icon: "concierge", title: "De principio a fin", copy: "Te acompañamos antes, durante y después del viaje, estés donde estés." },
];

function Stat({ s }: { s: (typeof STATS)[number] }) {
  const { ref, value } = useCountUp(s.target);
  return (
    <Reveal>
      <div className="flex items-baseline">
        <span className="font-display t1 leading-none" style={{ fontSize: "clamp(3.4rem,8vw,6rem)" }}>
          <span className="terra">{s.prefix}</span>
          <span ref={ref}>{value.toLocaleString("es-AR")}</span>
        </span>
      </div>
      <div className="mt-3 h-px w-12" style={{ background: "var(--terra)" }} />
      <p className="font-display t1 mt-4 text-[1.25rem]">{s.label}</p>
      <p className="t-mut mt-1.5 max-w-[16rem] text-[0.92rem] leading-relaxed text-pretty">{s.note}</p>
    </Reveal>
  );
}

export function WhyUs() {
  return (
    <section id="nosotros" className="bg-base relative overflow-hidden" style={{ padding: "clamp(5.5rem,12vw,9.5rem) 0" }}>
      <div className="relative mx-auto max-w-[1340px] px-5 sm:px-8">
        <Reveal className="max-w-[44rem]">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-9" style={{ background: "var(--terra)" }} />
            <span className="terra text-[0.7rem] font-semibold uppercase ls-wide">Por qué elegirnos</span>
          </div>
          <h2 className="font-display t1 leading-[1.04] text-balance" style={{ fontSize: "clamp(2.3rem,5.6vw,4.4rem)" }}>
            La experiencia<br /><span className="italic">no se improvisa.</span>
          </h2>
          <p className="t-mut mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-pretty">
            No somos un buscador de vuelos. Somos las mismas personas que te atienden, arman tu viaje y te responden el mensaje
            a las cuatro de la madrugada cuando perdés una conexión del otro lado del mundo.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:mt-20 sm:grid-cols-3">
          {STATS.map((s) => <Stat key={s.label} s={s} />)}
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 border-t border-base pt-14 sm:mt-24 sm:grid-cols-3 sm:gap-10">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <span className="mb-5 grid h-12 w-12 place-items-center rounded-full" style={{ border: "1px solid rgba(217,78,63,.4)", color: "var(--terra)" }}>
                <Icon name={f.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-display t1 text-[1.4rem]">{f.title}</h3>
              <p className="t-mut mt-2.5 text-[0.95rem] leading-relaxed text-pretty">{f.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar tipos** — `npx tsc --noEmit` → sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/WhyUs.tsx
git commit -m "feat(home): sección Por qué elegirnos (contadores + features)"
```

---

## Task 10: LuxurySection (reescribir)

**Files:**
- Modify: `src/components/home/LuxurySection.tsx` (reescribir completo)

Cambios respecto del diseño: eyebrow "Antares Luxury · Experiencias de autor"; sin "por pedido, y a medida"; fondo `public/luxury/fondo_luxury.webp`; gap corregido (usar `gap` real con borde, no `gap-px`); las 3 cards de hallmarks + las cards de paquetes de lujo (`byType.experiencias`).

- [ ] **Step 1: Reescribir `src/components/home/LuxurySection.tsx`**

```tsx
import { Link } from "react-router-dom";
import type { TravelCard } from "../../types";
import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";
import { useLeadModal } from "../../context/LeadModalContext";

const HALLMARKS: { icon: IconName; title: string; copy: string }[] = [
  { icon: "key", title: "Acceso, no catálogo", copy: "Suites que no se reservan online, mesas sin disponibilidad pública, guías privados que solo trabajan con nosotros." },
  { icon: "concierge", title: "Concierge dedicado", copy: "Una sola persona, disponible 24/7, que conoce tu viaje de memoria desde antes de que despegues." },
  { icon: "sparkle", title: "Diseñado a cuatro manos", copy: "Nos sentamos con vos. El itinerario se escribe en borrador, se corrige y se vuelve a escribir hasta que es tuyo." },
];

export function LuxurySection({ cards }: { cards: TravelCard[] }) {
  const { openLead } = useLeadModal();
  const featured = cards.slice(0, 3);

  return (
    <section id="premium" className="relative overflow-hidden" style={{ background: "#080706" }}>
      {/* Fondo cinematográfico: Atlantis The Royal */}
      <div className="absolute inset-0 z-0">
        <img src="/luxury/fondo_luxury.webp" alt="" aria-hidden className="h-full w-full object-cover" style={{ transform: "scale(1.08)", opacity: 0.5 }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 70% 30%, transparent 0%, rgba(8,7,6,.7) 55%, rgba(8,7,6,.97) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,7,6,.85) 0%, transparent 22%, transparent 70%, rgba(8,7,6,.95) 100%)" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-[1340px] px-5 sm:px-8" style={{ padding: "clamp(6rem,14vw,11rem) 0" }}>
        <Reveal className="max-w-[46rem]">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-12 gold-line" />
            <span className="gold-text text-[0.7rem] font-semibold uppercase ls-wide">Antares Luxury · Experiencias de autor</span>
          </div>
          <h2 className="font-display leading-[0.98] text-balance" style={{ fontSize: "clamp(2.6rem,7vw,6rem)", color: "#F4EDE2" }}>
            El viaje,<br /><span className="gold-text italic">premium.</span>
          </h2>
          <p className="mt-8 max-w-[40rem] text-[1.08rem] leading-relaxed text-pretty sm:text-[1.18rem]" style={{ color: "rgba(244,237,226,.7)" }}>
            No es un paquete más caro. Es el lujo de viajar de una manera: discreta, sin fricción, pensada para quien valora
            el detalle y la exclusividad. Una franja reservada de lo que hacemos.
          </p>
        </Reveal>

        {/* Hallmarks — gap real corregido (antes gap-px se veía mal en breakpoints) */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 md:grid-cols-3 md:gap-5">
          {HALLMARKS.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.09} className="rounded-xl px-7 py-10 sm:py-12"
              >
              <div style={{ background: "rgba(10,9,8,.72)", border: "1px solid rgba(198,164,97,.18)", backdropFilter: "blur(4px)" }} className="rounded-xl px-7 py-10 sm:py-12 -mx-7 -my-10 sm:-my-12">
                <span className="mb-7 grid h-12 w-12 place-items-center rounded-full" style={{ border: "1px solid rgba(198,164,97,.5)", color: "var(--gold-soft)" }}>
                  <Icon name={h.icon} className="h-[1.4rem] w-[1.4rem]" />
                </span>
                <h3 className="font-display text-[1.5rem] leading-[1.1]" style={{ color: "#F4EDE2" }}>{h.title}</h3>
                <p className="mt-3.5 text-[0.95rem] leading-relaxed text-pretty" style={{ color: "rgba(244,237,226,.55)" }}>{h.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Paquetes de lujo */}
        {featured.length > 0 && (
          <div className="mt-16 grid gap-5 sm:mt-20 md:grid-cols-3 md:gap-6">
            {featured.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 0.08}>
                <Link to={`/paquete/${encodeURIComponent(pkg.id)}`} className="group relative block overflow-hidden rounded-2xl">
                  <div className="aspect-[3/4] w-full overflow-hidden">
                    <img src={pkg.image} alt={pkg.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.1) 100%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[3px]" style={{ color: "var(--gold)" }}>{pkg.destination}</p>
                    <h3 className="font-display mb-3 text-2xl leading-snug" style={{ color: "#F4EDE2" }}>{pkg.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "rgba(244,237,226,.7)" }}>{pkg.duration}</span>
                      <span className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{pkg.price}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {/* CTA band */}
        <Reveal className="mt-16 flex flex-col gap-8 border-t pt-12 sm:mt-20 sm:flex-row sm:items-center sm:justify-between" >
          <p className="font-display max-w-[26rem] text-[1.6rem] italic leading-[1.15] sm:text-[2rem]" style={{ color: "rgba(244,237,226,.85)" }}>
            Contanos qué imaginás. El resto lo resolvemos nosotros.
          </p>
          <button onClick={() => openLead({ destino: "Antares Luxury", context: "premium" })}
            className="group inline-flex shrink-0 items-center gap-3 rounded-full py-4 pl-8 pr-7 text-[0.94rem] font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(100deg, var(--gold-soft), var(--gold))", color: "#2a2008", boxShadow: "0 18px 44px -18px rgba(198,164,97,.7)" }}>
            Solicitar propuesta privada
            <Icon name="arrowR" className="h-[1.05rem] w-[1.05rem] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
```

> Sobre el "gap corregido": el diseño original usaba `gap-px` con un fondo dorado que se filtraba como líneas finas, y se veía mal entre "Concierge dedicado" y "Diseñado a cuatro manos" en ciertos anchos. Acá cada card es una tarjeta independiente con `gap` real y su propio borde dorado sutil — separación pareja en todos los breakpoints.

- [ ] **Step 2: Verificar build** — `npm run build` → OK. En navegador, confirmar que `public/luxury/fondo_luxury.webp` carga como fondo.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/LuxurySection.tsx
git commit -m "feat(home): Luxury reescrita (Atlantis + dorado, textos, gap parejo)"
```

---

## Task 11: Testimonials

**Files:**
- Create: `src/components/home/Testimonials.tsx`

- [ ] **Step 1: Crear `src/components/home/Testimonials.tsx`**

```tsx
import { useEffect, useState } from "react";
import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";

type Quote = { text: string; name: string; city: string };

// Fallback hardcode. En Fase 2 estos llegan desde la DB (admin).
const QUOTES: Quote[] = [
  { text: "Volvimos enamorados de la Patagonia. Cada traslado, cada hotel, cada detalle estaba pensado antes de que lo pidiéramos.", name: "María Elena R.", city: "Concepción del Uruguay" },
  { text: "Organizaron nuestra luna de miel en la Toscana de principio a fin. No tuvimos que ocuparnos de nada más que disfrutar.", name: "Lucas y Paula", city: "Gualeguaychú" },
  { text: "Viajamos treinta personas a Brasil y todo salió impecable. Es la tranquilidad de viajar con gente que conoce su oficio.", name: "Club de Jubilados", city: "Urdinarrain" },
  { text: "Hace quince años que viajo solo con ellos. Ya no me imagino planear unas vacaciones de otra manera.", name: "Jorge B.", city: "Larroque" },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const go = (dir: number) => setI((p) => (p + dir + QUOTES.length) % QUOTES.length);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % QUOTES.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-base relative overflow-hidden" style={{ padding: "clamp(5.5rem,12vw,10rem) 0" }}>
      <div className="mx-auto max-w-[980px] px-5 text-center sm:px-8">
        <Reveal>
          <span className="font-display terra block text-[5rem] leading-none" style={{ opacity: 0.9 }}>“</span>
        </Reveal>
        <div className="relative mt-1" style={{ minHeight: "clamp(220px,32vw,300px)" }}>
          {QUOTES.map((q, k) => (
            <figure key={k} className="absolute inset-0 flex flex-col items-center justify-start"
              style={{ transition: "opacity .8s var(--ease), transform .8s var(--ease)", opacity: k === i ? 1 : 0, transform: k === i ? "none" : "translateY(16px)", pointerEvents: k === i ? "auto" : "none" }}>
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
            {QUOTES.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Testimonio ${k + 1}`} className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: k === i ? 26 : 8, background: k === i ? "var(--terra)" : "var(--text-40)" }} />
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
```

- [ ] **Step 2: Verificar tipos** — `npx tsc --noEmit` → sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/Testimonials.tsx
git commit -m "feat(home): testimonios (carrusel crossfade, fallback hardcode)"
```

---

## Task 12: LeadQualifier (restyle)

**Files:**
- Modify: `src/components/home/LeadQualifier.tsx` (solo estilos/markup; la lógica de submit queda igual)

- [ ] **Step 1: Restyle del wrapper y campos**

En `LeadQualifier.tsx`, reemplazar:
- `labelCls` por: `"mb-1.5 block text-[10px] font-semibold uppercase tracking-wider t-faint"`
- `fieldCls` por: `"w-full rounded-xl px-3 py-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--terra)]"` con `style` inline en cada campo `{ border: "1px solid var(--line)", background: "var(--card)", color: "var(--text)" }`. Para no repetir, definir una constante `fieldStyle`:

```tsx
  const labelCls = "mb-1.5 block text-[10px] font-semibold uppercase tracking-wider t-faint";
  const fieldCls = "w-full rounded-xl px-3 py-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--terra)]";
  const fieldStyle = { border: "1px solid var(--line)", background: "var(--card)", color: "var(--text)" } as const;
```

Aplicar `style={fieldStyle}` a cada `<input>`/`<select>`.

- [ ] **Step 2: Reemplazar el `<AnimatedSection>` wrapper, título y botón**

- Wrapper: cambiar la clase a `className="bg-base py-16 md:py-24"` y mantener `id="contanos-tu-viaje"`.
- Título: `<h2 className="font-display t1 mb-3 leading-tight" style={{ fontSize: "clamp(2rem,5vw,3.2rem)" }}>Contanos tu viaje, <span className="terra">lo armamos por vos</span></h2>`
- Subtítulo: clase `t-mut`.
- Form contenedor: `className="card-base rounded-3xl border-base p-5 md:p-8"` con `style={{ border: "1px solid var(--line)" }}`.
- Botón submit: `style={{ background: "var(--terra)" }}` y clase sin los `from-red-*`.
- Texto inferior: clase `t-faint`.

- [ ] **Step 3: Verificar build** — `npm run build` → OK. En navegador, el form se ve en paleta terra y respeta dark/light.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/LeadQualifier.tsx
git commit -m "feat(home): restyle del form inline (LeadQualifier) a la paleta editorial"
```

---

## Task 13: Footer (CTA + footer editorial)

**Files:**
- Create: `src/components/home/FooterCTA.tsx`
- Modify: `src/components/layout/Footer.tsx` (reescribir como footer editorial)

> El `FooterCTA` (banda "¿Listo para tu próximo viaje?") va al final del Home; el `Footer` editorial reemplaza el footer global actual.

- [ ] **Step 1: Crear `src/components/home/FooterCTA.tsx`**

```tsx
import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import { useLeadModal } from "../../context/LeadModalContext";

export function FooterCTA() {
  const { openLead } = useLeadModal();
  return (
    <section className="relative" style={{ background: "#100D0B", padding: "clamp(5rem,11vw,8.5rem) 0" }}>
      <Reveal className="mx-auto max-w-[1100px] px-5 text-center sm:px-8">
        <h2 className="font-display leading-[1.02] text-balance" style={{ fontSize: "clamp(2.4rem,6.5vw,5.2rem)", color: "#F4EDE2" }}>
          ¿Listo para tu<br /><span className="italic">próximo viaje?</span>
        </h2>
        <p className="mx-auto mt-7 max-w-[34rem] text-[1.05rem] leading-relaxed text-pretty" style={{ color: "rgba(244,237,226,.6)" }}>
          Contanos a dónde querés ir. Te respondemos con una propuesta hecha a tu medida, sin compromiso.
        </p>
        <button onClick={() => openLead({ context: "footer-cta" })}
          className="group mt-10 inline-flex items-center gap-3 rounded-full py-4 pl-8 pr-7 text-[0.98rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: "var(--terra)", boxShadow: "0 20px 50px -18px rgba(217,78,63,.95)" }}>
          Empezar mi consulta
          <Icon name="arrowR" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Reescribir `src/components/layout/Footer.tsx`**

```tsx
import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { SITE_CONFIG } from "../../config/site";

const EXPLORAR = [
  { label: "Servicios", href: "#servicios" },
  { label: "Destinos", href: "#destinos" },
  { label: "Experiencias Luxury", href: "#premium" },
  { label: "Notas de viaje", to: "/blog" },
];
const EMPRESA = [
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
                  {"to" in l && l.to ? (
                    <Link to={l.to} className="text-[0.9rem] transition-colors hover:text-[var(--terra-soft)]" style={{ color: "rgba(244,237,226,.7)" }}>{l.label}</Link>
                  ) : (
                    <a href={(l as { href: string }).href} className="text-[0.9rem] transition-colors hover:text-[var(--terra-soft)]" style={{ color: "rgba(244,237,226,.7)" }}>{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-3">
          <h4 className="text-[0.68rem] font-semibold uppercase ls-wide" style={{ color: "rgba(244,237,226,.4)" }}>Contacto</h4>
          <ul className="mt-4 space-y-3.5" style={{ color: "rgba(244,237,226,.7)" }}>
            <li className="flex items-start gap-3 text-[0.9rem]"><Icon name="pin" className="mt-0.5 h-[1.15rem] w-[1.15rem] shrink-0" style={undefined} />Gualeguaychú, Entre Ríos</li>
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
```

> Nota: el `Icon` recibe `className`; el prop `style={undefined}` del primer item es inocuo — quitarlo si molesta al linter. Datos de contacto tomados de `SITE_CONFIG` (whatsapp/email) + dirección de Gualeguaychú. Confirmar dirección/teléfono exactos con el usuario antes de publicar.

- [ ] **Step 3: Verificar tipos** — `npx tsc --noEmit`. Si `style={undefined}` da error de tipo en `Icon`, quitarlo (el `Icon` no acepta `style`); dejar solo `className`.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/FooterCTA.tsx src/components/layout/Footer.tsx
git commit -m "feat(home): footer editorial + banda CTA final"
```

---

## Task 14: Ensamblado (HomePage + App)

**Files:**
- Modify: `src/pages/HomePage.tsx` (cuerpo del `<main>` debajo del hero)
- Modify: `src/App.tsx`

- [ ] **Step 1: Reemplazar el cuerpo del Home debajo del hero en `HomePage.tsx`**

Quitar los imports no usados (`Differentiators`, `DestinationsGrid` viejo, `AnimatedSection`, `PackageCard`, `Link` si no se usa) y dejar:

```tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { heroSlides } from "../config/site";
import { departureMonthOptions } from "../data/dates";
import { usePackages } from "../data/packagesStore";
import { useHeroSlide } from "../hooks/useHeroSlide";
import { useMobileViewport } from "../hooks/useMobileViewport";
import { trackEvent, trackStandard } from "../lib/tracking";
import { captureLead } from "../lib/leads";
import { ServicesEditorial } from "../components/home/ServicesEditorial";
import { DestinationsStrip } from "../components/home/DestinationsStrip";
import { WhyUs } from "../components/home/WhyUs";
import { LuxurySection } from "../components/home/LuxurySection";
import { Testimonials } from "../components/home/Testimonials";
import { LeadQualifier } from "../components/home/LeadQualifier";
import { FooterCTA } from "../components/home/FooterCTA";
```

Y el cuerpo del `<main>` (después de cerrar el `<section id="hero">`) queda:

```tsx
      <ServicesEditorial />
      <DestinationsStrip />
      <WhyUs />
      <LuxurySection cards={byType.experiencias} />
      <Testimonials />
      <LeadQualifier wa={wa} />
      <FooterCTA />
```

(`HomePage` ya recibe `wa` por props y usa `byType` de `usePackages`. El handler `handleSearch` y los hooks del hero se conservan.)

- [ ] **Step 2: Actualizar `src/App.tsx`**

1. Imports: quitar `FooterShowcase`, `ScrollPlane`, `TripFormModal`. Agregar:

```tsx
import { LeadModalProvider } from "./context/LeadModalContext";
import { LeadModal } from "./components/modals/LeadModal";
```

2. En `AppShell`, quitar el estado `showTripForm` y el render de `FooterShowcase`, `ScrollPlane` y `TripFormModal`. El `Footer` nuevo ya trae su propio CTA — se renderiza igual al final.

3. Envolver el árbol con el provider. Reemplazar el `return (<div …>… </div>)` de `AppShell` para incluir `<LeadModal wa={wa} />` antes del cierre, y envolver en `App`:

```tsx
export default function App() {
  return (
    <BrowserRouter>
      <PackagesProvider>
        <LeadModalProvider>
          <AppShell />
        </LeadModalProvider>
      </PackagesProvider>
    </BrowserRouter>
  );
}
```

4. Dentro de `AppShell`, antes del botón flotante de WhatsApp, agregar:

```tsx
      <LeadModal wa={wa} />
```

5. Quitar de `AppShell` las líneas:
- `const [showTripForm, setShowTripForm] = useState(false);`
- `{isHome && (<FooterShowcase … />)}`
- `{isHome && <ScrollPlane darkMode={darkMode} />}`
- `{showTripForm && (<TripFormModal … />)}`
- el import de `useState` si queda sin uso.

- [ ] **Step 3: Verificar build completo**

Run: `npx tsc --noEmit && npm run build`
Expected: sin errores de tipos ni de build.

- [ ] **Step 4: Verificación en navegador**

Abrir la app y comprobar:
- Hero reproduce video; navbar con Servicios dropdown, Luxury, sin Notas, Ofertas abre el modal.
- Scroll: Servicios → Destinos (3 cards, linkean a catálogo) → Nosotros (contadores animan) → Luxury (fondo Atlantis, dorado) → Testimonios → form inline → CTA → footer.
- Botón Ofertas y CTAs abren el `LeadModal`; enviar → estado "Gracias" → "Continuar por WhatsApp".
- Toggle dark/light cambia toda la paleta del Home.

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.tsx src/App.tsx
git commit -m "feat(home): ensamblar Home rediseñado + LeadModalProvider; quitar FooterShowcase/ScrollPlane/TripFormModal"
```

---

## Task 15: Verificación final y limpieza

**Files:**
- (verificación; posible Modify menor)

- [ ] **Step 1: Typecheck + build limpios**

Run: `npx tsc --noEmit && npm run build`
Expected: sin errores. Confirmar en el output que **no aparece GSAP** en el bundle.

- [ ] **Step 2: Responsive a 375px**

En el navegador (DevTools, 375px): navbar mobile (overlay con Servicios + anclas), hero legible, strip de destinos con scroll horizontal por touch, secciones en una columna, modal full-width abajo.

- [ ] **Step 3: prefers-reduced-motion**

Activar "reduce motion" (DevTools › Rendering › Emulate CSS prefers-reduced-motion) y confirmar: el video del hero **igual reproduce**, los `.reveal` aparecen sin desplazamiento, los contadores muestran el número final.

- [ ] **Step 4: Confirmar que no quedan referencias muertas**

Run: `git grep -n "FooterShowcase\|ScrollPlane\|TripFormModal\|usePrefersReducedMotion" -- src/`
Expected: solo las definiciones de los archivos (no usados en el Home). Si `usePrefersReducedMotion` no se usa en ningún lado, puede quedar exportado sin problema (no romper otros usos).

- [ ] **Step 5: Commit final (si hubo ajustes)**

```bash
git add -A
git commit -m "chore(home): verificación final del rediseño (Fase 1)"
```

---

## Self-Review (cobertura del spec)

- §5.1 Navbar → Task 5 ✅ · §5.2 Hero + video → Task 6 ✅ · §5.3 Servicios → Task 7 ✅
- §5.4 Destinos (3 → catálogo) → Task 8 ✅ · §5.5 Nosotros → Task 9 ✅
- §5.6 Luxury (rename, sin frase, Atlantis, gap) → Task 10 ✅ · §5.7 Testimonios → Task 11 ✅
- §5.8 Form inline + quitar slogan → Task 12 + Task 14 (quita FooterShowcase) ✅
- §5.9 Footer → Task 13 ✅ · §4.2 Lead modal/captura → Task 4 + Task 14 ✅
- §4.3 Tema → Task 1 ✅ · §7 Animación/sin GSAP → Tasks 3,15 ✅ · §8 video/Atlantis → Tasks 6,10 ✅
- Fase 2 (imágenes de servicios + Opiniones editables) → **plan aparte** (no cubierto acá; los componentes usan fallback hardcode).

**Placeholders:** ninguno (todo el código está completo).
**Consistencia de tipos:** `useLeadModal()/openLead(prefill)`, `LeadPrefill {destino?, context?}`, `Reveal {variant,delay}`, `useCountUp(target)→{ref,value}`, `Icon name: IconName` — usados igual en todas las tasks.
