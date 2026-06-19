import { Link } from "react-router-dom";
import type { TravelCard } from "../../types";

export function LuxuryCard({ pkg }: { pkg: TravelCard }) {
  return (
    <Link to={`/paquete/${encodeURIComponent(pkg.id)}`} className="group relative block overflow-hidden rounded-2xl">
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img src={pkg.image} alt={pkg.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.1) 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[3px]" style={{ color: "var(--gold)" }}>{pkg.destination}</p>
        <h3 className="font-display mb-3 text-2xl leading-snug" style={{ color: "#F4EDE2" }}>{pkg.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "rgba(244,237,226,.7)" }}>{pkg.duration}</span>
          <span className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{pkg.price}</span>
        </div>
      </div>
    </Link>
  );
}
