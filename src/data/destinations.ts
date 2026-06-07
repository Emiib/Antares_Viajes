export const popularDestinations = [
  {
    name: "Caribe",
    count: "120+ paquetes",
    icon: "🏝️",
    subtitle: "Playas, all inclusive y relax",
  },
  {
    name: "Brasil",
    count: "85+ paquetes",
    icon: "⛪",
    subtitle: "Cercanía, playa y diversión",
  },
  {
    name: "Europa",
    count: "200+ paquetes",
    icon: "🗼",
    subtitle: "Ciudades icónicas y circuitos",
  },
  {
    name: "México",
    count: "95+ paquetes",
    icon: "🗿",
    subtitle: "Caribe, cultura y gastronomía",
  },
  {
    name: "Argentina",
    count: "150+ paquetes",
    icon: "🧉",
    subtitle: "Conoce nuestro país",
  },
  {
    name: "Estados Unidos",
    count: "110+ paquetes",
    icon: "🗽",
    subtitle: "Compras, parques y estados",
  },
] as const;

export const destinationImages: Record<string, string> = {
  Caribe: "/videos/destinospop/caribe.jpg",
  Brasil: "/videos/destinospop/brasil.jpg",
  Europa: "/videos/destinospop/europa.jpg",
  México: "/videos/destinospop/mexico.jpg",
  Argentina: "/videos/destinospop/argentina.jpg",
  "Estados Unidos": "/videos/destinospop/estados-unidos.jpg",
};