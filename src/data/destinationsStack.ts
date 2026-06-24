/**
 * Los 6 destinos del navbar (menú "Destinos"), usados en la sección apilada del home
 * y, más adelante, como acento de cada subpágina.
 *
 * `color` es el color de identidad de cada destino: tonos de BAJA saturación,
 * pensados para usarse de forma sutil (aura/halo + acentos), no como fondo pleno.
 * El mismo color se reutilizará como acento de la subpágina correspondiente.
 */
export type StackDestination = {
  slug: string;
  name: string;
  /** Bajada corta (eyebrow sobre el título). */
  tagline: string;
  /** Una línea descriptiva. */
  blurb: string;
  image: string;
  to: string;
  color: string;
};

export const destinationsStack: StackDestination[] = [
  {
    slug: "argentina",
    name: "Argentina",
    tagline: "Nuestra tierra",
    blurb: "Del norte al fin del mundo, sin salir del país.",
    image: "/img/destinos/argentina.webp",
    to: "/argentina",
    color: "#6B9BB8", // celeste sereno
  },
  {
    slug: "caribe-centroamerica",
    name: "Caribe & Centroamérica",
    tagline: "Playa y all inclusive",
    blurb: "Aguas turquesa, resorts y descanso total.",
    image: "/img/destinos/caribe.webp",
    to: "/caribe-centroamerica",
    color: "#3FA597", // turquesa apagado
  },
  {
    slug: "exoticos",
    name: "Exóticos",
    tagline: "Lo lejano y distinto",
    blurb: "Asia, África y Medio Oriente para quienes buscan más.",
    // TODO: reemplazar por una imagen realmente exótica (Asia/África). Placeholder por ahora.
    image: "/img/destinos/mexico.webp",
    to: "/exoticos",
    color: "#C79248", // ámbar / especias
  },
  {
    slug: "europa",
    name: "Europa",
    tagline: "El gran tour",
    blurb: "Ciudades icónicas y circuitos clásicos del viejo continente.",
    image: "/img/destinos/europa.webp",
    to: "/europa",
    color: "#A66B7D", // vino sobrio
  },
  {
    slug: "eeuu-canada",
    name: "EEUU & Canadá",
    tagline: "Norteamérica",
    blurb: "Compras, parques y las grandes ciudades del norte.",
    image: "/img/destinos/estados-unidos.webp",
    to: "/eeuu-canada",
    color: "#6275B2", // índigo
  },
  {
    slug: "sudamerica",
    name: "Sudamérica",
    tagline: "Cerca y diverso",
    blurb: "Brasil, los Andes y los paisajes del continente.",
    image: "/img/destinos/brasil.webp",
    to: "/sudamerica",
    color: "#4F9E78", // verde selva
  },
];
