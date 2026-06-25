import { CategoryLanding } from "../components/catalog/CategoryLanding";

/**
 * Eventos: paquetes alrededor de grandes eventos (Fórmula 1, mundiales,
 * recitales, shows). Entrada + hotel + traslados resueltos.
 */
export function EventosPage() {
  return (
    <CategoryLanding
      eyebrow="Vivilo en vivo"
      title="Eventos"
      intro="Fórmula 1, mundiales, recitales y los grandes eventos del mundo, con entradas, hotel y traslados resueltos. Vos al evento; la logística, nuestra."
      color="#8A4FC9"
      leadContext="eventos"
      packagesNoun="eventos"
    />
  );
}
