import { CategoryLanding } from "../components/catalog/CategoryLanding";

/**
 * Experiencias temáticas: viajes en torno a algo puntual (gastronomía, vino,
 * deporte, música, naturaleza), no a un destino. El cliente va a precisar más
 * el alcance; por ahora la página queda con el template y CTA.
 */
export function ExperienciasPage() {
  return (
    <CategoryLanding
      eyebrow="Experiencias temáticas"
      title="Experiencias"
      intro="Viajes alrededor de una pasión: gastronomía, vino, deporte, música o naturaleza. Propuestas pensadas en torno a algo puntual, no a un destino."
      color="#8E4F57"
      leadContext="experiencias"
      packagesNoun="experiencias"
    />
  );
}
