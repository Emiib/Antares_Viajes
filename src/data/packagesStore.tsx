import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { TravelCard } from "../types";
import { API_URL } from "../config/api";
import {
  offersPackages,
  featuredPackages,
  argentinaPackages,
  circuitPackages,
  groupPackages,
  quincePackages,
  luxuryExperiences,
  cruisePackages,
} from "./packages";

export type PackageType =
  | "ofertas"
  | "featured"
  | "argentina"
  | "circuitos"
  | "grupales"
  | "quinceaneras"
  | "experiencias"
  | "cruceros";

// Fallback estático: lo que se muestra al instante y si el backend no responde.
const STATIC_BY_TYPE: Record<PackageType, TravelCard[]> = {
  ofertas: offersPackages,
  featured: featuredPackages,
  argentina: argentinaPackages,
  circuitos: circuitPackages,
  grupales: groupPackages,
  quinceaneras: quincePackages,
  experiencias: luxuryExperiences,
  cruceros: cruisePackages,
};

type BackendPackage = {
  id: string;
  type?: string;
  featured?: number;
  title: string;
  destination: string;
  duration?: string;
  price: string;
  image_url?: string;
  badge?: string;
  departure?: string;
  people?: string;
  includes?: string[];
};

function toTravelCard(p: BackendPackage): TravelCard {
  return {
    id: p.id,
    title: p.title,
    destination: p.destination,
    duration: p.duration ?? "",
    price: p.price,
    image: p.image_url ?? "",
    badge: p.badge || undefined,
    departure: p.departure || undefined,
    people: p.people || undefined,
    includes: p.includes && p.includes.length ? p.includes : undefined,
  };
}

export type SiteConfig = {
  whatsapp?: string;
  sales_email?: string;
  slogan?: string;
  logo_header_path?: string;
  logo_dark_path?: string;
  legal_pdf_url?: string;
  legal_text?: string;
};

type Store = {
  byType: Record<PackageType, TravelCard[]>;
  all: TravelCard[];
  getById: (id: string) => TravelCard | undefined;
  config: SiteConfig;
  source: "static" | "live";
};

const PackagesContext = createContext<Store | null>(null);

export function PackagesProvider({ children }: { children: ReactNode }) {
  const [byType, setByType] = useState<Record<PackageType, TravelCard[]>>(STATIC_BY_TYPE);
  const [config, setConfig] = useState<SiteConfig>({});
  const [source, setSource] = useState<"static" | "live">("static");

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URL}/api/data`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (cancelled) return;
        if (data?.config && typeof data.config === "object") setConfig(data.config);
        const packages: BackendPackage[] = Array.isArray(data?.packages) ? data.packages : [];
        if (packages.length === 0) return;

        // Agrupamos los paquetes del backend por categoría. "featured" no es una
        // categoría sino un flag: un paquete destacado aparece en su página de
        // categoría Y en los "Favoritos" del home.
        const live: Partial<Record<PackageType, TravelCard[]>> = {};
        const liveFeatured: TravelCard[] = [];
        for (const p of packages) {
          const type = (p.type as PackageType) || "ofertas";
          const card = toTravelCard(p);
          if (!live[type]) live[type] = [];
          live[type]!.push(card);
          if (p.featured) liveFeatured.push(card);
        }
        if (liveFeatured.length > 0) live.featured = liveFeatured;

        // Merge por tipo: usamos los del backend donde existan, estáticos en el resto.
        setByType((prev) => {
          const merged = { ...prev };
          (Object.keys(live) as PackageType[]).forEach((t) => {
            merged[t] = live[t]!;
          });
          return merged;
        });
        setSource("live");
      })
      .catch(() => {
        // Backend dormido o caído: nos quedamos con el fallback estático.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<Store>(() => {
    const all = Object.values(byType).flat();
    const map = new Map(all.map((p) => [p.id, p]));
    return { byType, all, getById: (id) => map.get(id), config, source };
  }, [byType, config, source]);

  return <PackagesContext.Provider value={value}>{children}</PackagesContext.Provider>;
}

export function usePackages(): Store {
  const ctx = useContext(PackagesContext);
  if (!ctx) {
    throw new Error("usePackages debe usarse dentro de <PackagesProvider>");
  }
  return ctx;
}
