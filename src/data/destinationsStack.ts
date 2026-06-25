/**
 * Los 6 destinos del navbar (menú "Destinos"), usados en la sección apilada del home
 * y en cada subpágina de destino.
 *
 * `color` = color de identidad de cada destino. Tomados de la guía del cliente
 * (Caribe amarillo, Brasil/Sudamérica verde, Argentina azul, Disney/USA rojo,
 * Europa púrpura, Exóticos naranja) pero ADAPTADOS a baja saturación para usarse
 * de forma sutil (aura/halo + acentos), nunca como fondo pleno. El mismo color es
 * el acento de la subpágina correspondiente.
 */
export type StackDestination = {
  slug: string;
  name: string;
  /** Bajada corta (eyebrow sobre el título). */
  tagline: string;
  /** Una línea descriptiva (home). */
  blurb: string;
  /** Párrafo de intro de la subpágina. */
  intro: string;
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
    intro:
      "Desde las cataratas y los viñedos hasta los glaciares del sur. Te armamos el recorrido por nuestro país con todo resuelto: vuelos, hoteles y traslados.",
    image: "/img/destinos/argentina.webp",
    to: "/argentina",
    color: "#5688BC", // azul (guía: Argentina)
  },
  {
    slug: "caribe-centroamerica",
    name: "Caribe & Centroamérica",
    tagline: "Playa y all inclusive",
    blurb: "Aguas turquesa, resorts y descanso total.",
    intro:
      "Playas de arena blanca, resorts all inclusive y el mar más turquesa. La escapada de descanso que estás necesitando, sin que te ocupes de nada.",
    image: "/img/destinos/caribe.webp",
    to: "/caribe-centroamerica",
    color: "#C7A24A", // ámbar/dorado (guía: Caribe amarillo)
  },
  {
    slug: "exoticos",
    name: "Exóticos",
    tagline: "Lo lejano y distinto",
    blurb: "Asia, África y Medio Oriente para quienes buscan más.",
    intro:
      "Asia, África y Medio Oriente: cultura, paisajes y experiencias que no se parecen a nada. Para viajeros que quieren ir más lejos, con la logística cuidada de punta a punta.",
    // TODO: reemplazar por una imagen realmente exótica (Asia/África). Placeholder por ahora.
    image: "/img/destinos/mexico.webp",
    to: "/exoticos",
    color: "#CD7A3C", // naranja especiado (guía: Exóticos)
  },
  {
    slug: "europa",
    name: "Europa",
    tagline: "El gran tour",
    blurb: "Ciudades icónicas y circuitos clásicos del viejo continente.",
    intro:
      "El gran tour: ciudades icónicas, historia y los circuitos clásicos del viejo continente. Te movés liviano mientras nosotros coordinamos cada tramo.",
    image: "/img/destinos/europa.webp",
    to: "/europa",
    color: "#97619F", // púrpura sobrio (guía: Europa)
  },
  {
    slug: "eeuu-canada",
    name: "EEUU & Canadá",
    tagline: "Norteamérica",
    blurb: "Compras, parques y las grandes ciudades del norte.",
    intro:
      "Compras, parques temáticos y las grandes ciudades del norte. Desde Nueva York y Miami hasta Disney, con todo organizado para que solo disfrutes.",
    image: "/img/destinos/estados-unidos.webp",
    to: "/eeuu-canada",
    color: "#C2564F", // rojo ladrillo (guía: Disney/USA)
  },
  {
    slug: "sudamerica",
    name: "Sudamérica",
    tagline: "Cerca y diverso",
    blurb: "Brasil, los Andes y los paisajes del continente.",
    intro:
      "Brasil, los Andes y los paisajes del continente, a un paso de casa. Escapadas de playa o aventura con la cercanía y el precio que buscás.",
    image: "/img/destinos/brasil.webp",
    to: "/sudamerica",
    color: "#4F9A66", // verde (guía: Brasil)
  },
];
