export type RouteKey =
  | "home"
  | "ofertas"
  | "argentina"
  | "quinceaneras"
  | "experiencias"
  | "cruceros"
  | "blog"
  | "infoUtil"
  | "legales"
  | "grupales"
  | "circuitos"
  | "package-detail"
  | "admin";

export type Accent = "red" | "amber" | "gold" | "rose";

export type TravelCard = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: string;
  image: string;
  badge?: string;
  departure?: string;
  people?: string;
  includes?: string[];
  highlights?: string[];
};