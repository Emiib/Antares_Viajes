import type { TravelCard, Accent } from "../../types";
import { PackageCard } from "../ui/PackageCard";

export function PageLayout({
  title,
  subtitle,
  accent = "red",
  cards,
  darkMode,
}: {
  title: string;
  subtitle: string;
  accent?: Accent;
  cards: TravelCard[];
  darkMode: boolean;
}) {
  return (
    <main
      className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-[calc(100vh-80px)]`}
    >
      <section
        className={`pt-32 md:pt-40 pb-12 md:pb-16 ${darkMode ? "bg-stone-900" : "bg-stone-50"} border-b ${darkMode ? "border-stone-800" : "border-stone-100"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="#" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600">
            ← Volver al inicio
          </a>
          <h1 className={`text-3xl md:text-5xl font-black ${darkMode ? "text-white" : "text-stone-900"} mb-3`}>
            {title}
          </h1>
          <p className={`${darkMode ? "text-stone-400" : "text-stone-600"} max-w-2xl text-base md:text-lg`}>
            {subtitle}
          </p>
        </div>
      </section>
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {cards.map((pkg, i) => (
              <div
                key={pkg.id}
                style={{ transitionDelay: `${i * 90}ms` }}
                className="transition-all duration-500 opacity-100 translate-y-0 h-full"
              >
                <PackageCard pkg={pkg} accent={accent} darkMode={darkMode} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}