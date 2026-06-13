import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAllPackages } from "../data/packages";
import { blogPosts } from "../data/blog";

const SITE_NAME = "Antares Viajes y Turismo";
const BASE_URL = "https://www.antaresviajes.tur.ar";
const DEFAULT_DESC =
  "Agencia de viajes con más de 30 años de experiencia. Paquetes turísticos, circuitos internacionales, viajes grupales y experiencias de lujo armados a tu medida.";

type Meta = { title: string; description: string };

const META_BY_PATH: Record<string, Meta> = {
  "/": {
    title: `${SITE_NAME} | Viajes y paquetes turísticos a tu medida`,
    description: DEFAULT_DESC,
  },
  "/ofertas": {
    title: `Ofertas Flash | ${SITE_NAME}`,
    description:
      "Ofertas flash y promociones en viajes con vigencia limitada. Tarifas especiales en paquetes nacionales e internacionales. Consultá disponibilidad por WhatsApp.",
  },
  "/argentina": {
    title: `Viajes por Argentina | ${SITE_NAME}`,
    description:
      "Escapadas y viajes nacionales a los mejores destinos de Argentina, con salidas y tarifas pensadas para vos.",
  },
  "/quinceaneras": {
    title: `Viajes de Quinceañeras | ${SITE_NAME}`,
    description:
      "Programas grupales pensados para festejar los 15 con una experiencia de viaje inolvidable.",
  },
  "/experiencias": {
    title: `Experiencias de Lujo | ${SITE_NAME}`,
    description:
      "Viajes premium con servicio exclusivo y atención de primer nivel para quienes buscan otra categoría.",
  },
  "/cruceros": {
    title: `Cruceros | ${SITE_NAME}`,
    description:
      "Cruceros con próximas conexiones a las principales navieras. Consultanos por las próximas salidas y tarifas.",
  },
  "/grupales": {
    title: `Viajes Grupales | ${SITE_NAME}`,
    description:
      "Viajes grupales para empresas, amigos y familias, con tarifas y coordinación pensadas para grupos.",
  },
  "/circuitos": {
    title: `Circuitos Internacionales | ${SITE_NAME}`,
    description:
      "Circuitos internacionales con itinerarios completos para descubrir los grandes destinos del mundo.",
  },
  "/blog": {
    title: `Blog de Viajes | ${SITE_NAME}`,
    description:
      "Guías, consejos y destinos para inspirar y planificar tu próximo viaje.",
  },
  "/info-util": {
    title: `Información Útil para Viajeros | ${SITE_NAME}`,
    description:
      "Visas, web check-in y todo lo que necesitás saber antes de viajar.",
  },
  "/legales": {
    title: `Legales | ${SITE_NAME}`,
    description:
      "Condiciones de contratación y botón de arrepentimiento de Antares Viajes y Turismo.",
  },
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function resolveMeta(pathname: string): Meta {
  if (META_BY_PATH[pathname]) return META_BY_PATH[pathname];

  if (pathname.startsWith("/paquete/")) {
    const id = pathname.split("/")[2];
    const pkg = getAllPackages().find((p) => p.id === id);
    if (pkg) {
      return {
        title: `${pkg.title} | ${SITE_NAME}`,
        description: `${pkg.title} — ${pkg.destination}, ${pkg.duration}. Consultá disponibilidad y precios por WhatsApp con Antares Viajes.`,
      };
    }
  }

  if (pathname.startsWith("/blog/")) {
    const slug = decodeURIComponent(pathname.split("/")[2] || "");
    // Las notas estáticas se resuelven acá; las creadas en el panel ajustan su
    // propio título desde BlogPostPage al cargar los datos del backend.
    const post = blogPosts.find((p) => p.slug === slug);
    if (post) {
      return { title: `${post.title} | ${SITE_NAME}`, description: post.excerpt };
    }
    return META_BY_PATH["/blog"];
  }

  return META_BY_PATH["/"];
}

/** Actualiza title, description, canonical y Open Graph según la ruta activa. */
export function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description } = resolveMeta(pathname);
    const url = `${BASE_URL}${pathname}`;

    document.title = title;
    upsertMeta("name", "description", description);
    upsertCanonical(url);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
  }, [pathname]);

  return null;
}
