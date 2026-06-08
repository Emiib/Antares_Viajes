import { SITE_CONFIG } from "../../config/site";

export function FooterShowcase({
  darkMode,
  onOpenForm,
}: {
  darkMode: boolean;
  onOpenForm: () => void;
}) {
  const media = SITE_CONFIG.branding.footerShowcase;
  return (
    <section className="relative overflow-hidden py-14 md:py-20 text-white">
      <div className="absolute inset-0">
        {media.type === "image" && (
          <img src={media.image} alt="Antares showcase" className="h-full w-full object-cover" />
        )}
        {media.type === "video" && (
          <video className="h-full w-full object-cover" poster={media.poster} autoPlay muted loop playsInline preload="metadata">
            <source src={media.videoWebm} type="video/webm" />
            <source src={media.videoMp4} type="video/mp4" />
          </video>
        )}
        {media.type === "gradient" && (
          <div className={`h-full w-full ${darkMode ? "bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950" : "bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900"}`} />
        )}
        <div className="absolute inset-0 bg-black/45" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="mb-4 text-3xl font-black italic leading-tight md:text-5xl">
          "{SITE_CONFIG.slogan}"
        </h2>
        <p className="mb-8 text-lg text-stone-200">Armemos tu viaje totalmente a medida</p>
        <button
          type="button"
          onClick={onOpenForm}
          className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-10 py-4 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-2xl"
        >
          Completar formulario
        </button>
      </div>
    </section>
  );
}