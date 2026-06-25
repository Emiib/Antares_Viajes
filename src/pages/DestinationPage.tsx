import { Link } from "react-router-dom";
import { destinationsStack } from "../data/destinationsStack";
import { CategoryLanding } from "../components/catalog/CategoryLanding";

/**
 * Subpágina de un destino (Argentina, Caribe & Centroamérica, Exóticos, etc.).
 * Aplica el COLOR de identidad del destino vía el template CategoryLanding.
 */
export function DestinationPage({ slug }: { slug: string }) {
  const dest = destinationsStack.find((d) => d.slug === slug);

  if (!dest) {
    return (
      <main className="bg-base grid min-h-[60vh] place-items-center px-5 text-center">
        <p className="t-mut text-lg">Destino no encontrado. <Link to="/" className="terra font-semibold">Volver al inicio</Link></p>
      </main>
    );
  }

  return (
    <CategoryLanding
      eyebrow={dest.tagline}
      title={dest.name}
      intro={dest.intro}
      color={dest.color}
      image={dest.image}
      leadContext={`destino-${dest.slug}`}
      packagesNoun={`paquetes a ${dest.name}`}
    />
  );
}
