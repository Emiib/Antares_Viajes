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
