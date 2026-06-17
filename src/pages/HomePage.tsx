import { heroSlides } from "../config/site";
import { usePackages } from "../data/packagesStore";
import { useHeroSlide } from "../hooks/useHeroSlide";
import { useMobileViewport } from "../hooks/useMobileViewport";
import { ServicesEditorial } from "../components/home/ServicesEditorial";
import { DestinationsStrip } from "../components/home/DestinationsStrip";
import { WhyUs } from "../components/home/WhyUs";
import { LuxurySection } from "../components/home/LuxurySection";
import { Testimonials } from "../components/home/Testimonials";
import { FooterCTA } from "../components/home/FooterCTA";

interface HomePageProps {
  darkMode: boolean;
  wa: (text?: string) => string;
}

export function HomePage(_props: HomePageProps) {
  const { currentSlide, advance } = useHeroSlide();
  const isMobileViewport = useMobileViewport();
  const { byType } = usePackages();

  const slide = heroSlides[currentSlide];
  const webm = isMobileViewport ? slide.sources.mobileWebm : slide.sources.desktopWebm;
  const mp4  = isMobileViewport ? slide.sources.mobileMp4  : slide.sources.desktopMp4;

  return (
    <main>
      {/* ── HERO (video, editorial) ── */}
      <section id="hero" data-track-section="hero" className="relative flex min-h-screen items-center overflow-hidden md:min-h-[105vh]">
        <div className="absolute inset-0 z-0">
          <video
            key={`${slide.label}-${isMobileViewport ? "m" : "d"}`}
            className="animate-hero-video absolute inset-0 h-full w-full object-cover"
            poster={slide.poster}
            onEnded={advance}
            autoPlay muted playsInline preload="auto"
          >
            <source src={webm} type="video/webm" />
            <source src={mp4} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1340px] px-5 py-16 sm:px-8">
          <div className="max-w-2xl">
            <h1 className="font-display max-w-3xl font-medium leading-[0.98] text-white text-balance" style={{ fontSize: "clamp(2.6rem,7vw,5.4rem)" }}>
              Tu viaje soñado,
              <span className="block italic" style={{ color: "#F1E4DC" }}>armado a tu medida.</span>
            </h1>
          </div>
        </div>
      </section>

      <ServicesEditorial />
      <DestinationsStrip />
      <WhyUs />
      <LuxurySection cards={byType.experiencias} />
      <Testimonials />
      <FooterCTA />
    </main>
  );
}
