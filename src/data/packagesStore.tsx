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
import { blogPosts as staticBlogPosts } from "./blog";

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
  logo_footer_path?: string;
  legal_pdf_url?: string;
  legal_text?: string;
  service_paquetes_img?: string;
  service_grupales_img?: string;
  service_circuitos_img?: string;
  historia_img?: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  continent: string;
  country: string;
  image: string;
  date: string;
  readTime: string;
};

type BackendBlogPost = {
  id: string;
  slug?: string;
  title: string;
  excerpt?: string;
  body?: string;
  image_url?: string;
  continent?: string;
  country?: string;
  read_time?: string;
  published_at?: string;
  created_at?: string;
};

const STATIC_BLOG: BlogPost[] = staticBlogPosts.map((p) => ({
  id: String(p.id),
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  continent: p.continent,
  country: p.country,
  image: p.image,
  date: p.date,
  readTime: p.readTime,
}));

function toBlogPost(p: BackendBlogPost): BlogPost {
  return {
    id: p.id,
    slug: p.slug || p.id,
    title: p.title,
    excerpt: p.excerpt ?? "",
    body: p.body || undefined,
    continent: p.continent ?? "",
    country: p.country ?? "",
    image: p.image_url ?? "",
    date: (p.published_at || p.created_at || "").slice(0, 10),
    readTime: p.read_time ?? "",
  };
}

export type Testimonial = { text: string; name: string; city: string };

const STATIC_TESTIMONIALS: Testimonial[] = [
  { text: "Volvimos enamorados de la Patagonia. Cada traslado, cada hotel, cada detalle estaba pensado antes de que lo pidiéramos.", name: "María Elena R.", city: "Concepción del Uruguay" },
  { text: "Organizaron nuestra luna de miel en la Toscana de principio a fin. No tuvimos que ocuparnos de nada más que disfrutar.", name: "Lucas y Paula", city: "Gualeguaychú" },
  { text: "Viajamos treinta personas a Brasil y todo salió impecable. Es la tranquilidad de viajar con gente que conoce su oficio.", name: "Club de Jubilados", city: "Urdinarrain" },
  { text: "Hace quince años que viajo solo con ellos. Ya no me imagino planear unas vacaciones de otra manera.", name: "Jorge B.", city: "Larroque" },
];

type BackendTestimonial = { id: string; quote: string; name?: string; city?: string };
function toTestimonial(t: BackendTestimonial): Testimonial {
  return { text: t.quote, name: t.name ?? "", city: t.city ?? "" };
}

export type TeamMember = { name: string; role: string; photo: string };

type BackendTeamMember = { id: string; name: string; role?: string; photo_url?: string };
function toTeamMember(m: BackendTeamMember): TeamMember {
  return { name: m.name, role: m.role ?? "", photo: m.photo_url ?? "" };
}

type Store = {
  byType: Record<PackageType, TravelCard[]>;
  all: TravelCard[];
  getById: (id: string) => TravelCard | undefined;
  config: SiteConfig;
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  team: TeamMember[];
  source: "static" | "live";
};

const PackagesContext = createContext<Store | null>(null);

export function PackagesProvider({ children }: { children: ReactNode }) {
  const [byType, setByType] = useState<Record<PackageType, TravelCard[]>>(STATIC_BY_TYPE);
  const [config, setConfig] = useState<SiteConfig>({});
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(STATIC_BLOG);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(STATIC_TESTIMONIALS);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [source, setSource] = useState<"static" | "live">("static");

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URL}/api/data`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (cancelled) return;
        if (data?.config && typeof data.config === "object") setConfig(data.config);
        if (Array.isArray(data?.blogPosts) && data.blogPosts.length > 0) {
          setBlogPosts(data.blogPosts.map(toBlogPost));
        }
        if (Array.isArray(data?.testimonials) && data.testimonials.length > 0) {
          setTestimonials(data.testimonials.map(toTestimonial));
        }
        if (Array.isArray(data?.team)) {
          setTeam(data.team.map(toTeamMember));
        }
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
    return { byType, all, getById: (id) => map.get(id), config, blogPosts, testimonials, team, source };
  }, [byType, config, blogPosts, testimonials, team, source]);

  return <PackagesContext.Provider value={value}>{children}</PackagesContext.Provider>;
}

export function usePackages(): Store {
  const ctx = useContext(PackagesContext);
  if (!ctx) {
    throw new Error("usePackages debe usarse dentro de <PackagesProvider>");
  }
  return ctx;
}
