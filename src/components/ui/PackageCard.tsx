import type { TravelCard, Accent } from "../../types";

export function PackageCard({
  pkg,
  accent = "red",
  darkMode,
}: {
  pkg: TravelCard;
  accent?: Accent;
  darkMode: boolean;
}) {
  const badgeClass =
    accent === "gold" || pkg.badge === "Luxury"
      ? "bg-gradient-to-r from-[var(--antares-gold)] to-[#b89060]"
      : accent === "amber"
        ? "bg-gradient-to-r from-amber-600 to-amber-500"
        : accent === "rose"
          ? "bg-gradient-to-r from-rose-500 to-pink-500"
          : "bg-gradient-to-r from-red-600 to-red-500";

  const priceClass =
    accent === "gold" || pkg.badge === "Luxury"
      ? "text-[var(--antares-gold)]"
      : accent === "amber"
        ? "text-amber-600"
        : accent === "rose"
          ? "text-rose-600"
          : "text-red-600";

  const buttonClass =
    accent === "gold" || pkg.badge === "Luxury"
      ? "from-[#C4A882] to-[#b89060] hover:from-[#b89972] hover:to-[#a17f57]"
      : accent === "amber"
        ? "from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600"
        : accent === "rose"
          ? "from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          : "from-red-600 to-red-500 hover:from-red-700 hover:to-red-600";

  const ringClass =
    accent === "gold" || pkg.badge === "Luxury"
      ? "hover:ring-amber-200"
      : accent === "amber"
        ? "hover:ring-amber-200"
        : accent === "rose"
          ? "hover:ring-rose-200"
          : "hover:ring-red-200";

  return (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"} ${ringClass}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {pkg.badge && (
          <div className="absolute left-3 top-3">
            <span
              className={`${badgeClass} rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md`}
            >
              {pkg.badge}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="space-y-2">
          <h3
            className={`min-h-[2.75rem] text-base font-bold leading-tight ${darkMode ? "text-white" : "text-stone-800"}`}
          >
            {pkg.title}
          </h3>
          <div
            className={`flex flex-wrap items-center gap-2 text-xs ${darkMode ? "text-stone-400" : "text-stone-500"}`}
          >
            <span>📍 {pkg.destination}</span>
            <span>•</span>
            <span>🕐 {pkg.duration}</span>
            {pkg.departure && (
              <>
                <span>•</span>
                <span>✈️ {pkg.departure}</span>
              </>
            )}
            {pkg.people && (
              <>
                <span>•</span>
                <span>👥 {pkg.people}</span>
              </>
            )}
          </div>
          <div className="min-h-[4.5rem] space-y-1 pt-1">
            {pkg.includes &&
              pkg.includes.slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 text-xs ${darkMode ? "text-stone-400" : "text-stone-600"}`}
                >
                  <span className="text-red-500">✔</span>
                  <span>{item}</span>
                </div>
              ))}
            {pkg.highlights &&
              pkg.highlights.slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 text-xs ${darkMode ? "text-stone-400" : "text-stone-600"}`}
                >
                  <span className="text-red-500">📍</span>
                  <span>{item}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="mt-auto pt-4">
          <div className="min-h-[2.25rem] flex items-end">
            <span
              className={`origin-left text-2xl font-black transition-all group-hover:scale-110 ${priceClass}`}
            >
              {pkg.price}
            </span>
          </div>
          <a
            href={`#package-detail/${pkg.id}`}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg ${buttonClass}`}
          >
            Consultar
          </a>
        </div>
      </div>
    </div>
  );
}