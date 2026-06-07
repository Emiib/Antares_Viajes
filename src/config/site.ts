export const SITE_CONFIG = {
  whatsapp: "5493446528749",
  salesEmail: "ventas@antaresviajes.com.ar",
  slogan: "El mejor de los viajes es el próximo",
  branding: {
    logo: "/branding/logo-header.png",
    logoAlt: "Antares Viajes",
    footerShowcase: {
      type: "gradient" as "gradient" | "image" | "video",
      image: "/branding/footer-media.jpg",
      videoWebm: "/branding/footer-media.webm",
      videoMp4: "/branding/footer-media.mp4",
      poster: "/branding/footer-media-poster.jpg",
    },
  },
} as const;

export const heroSlides = [
  {
    label: "París",
    poster: "/videos/hero/paris-poster.jpg",
    sources: {
      mobileWebm: "/videos/hero/paris-mobile.webm",
      mobileMp4:  "/videos/hero/paris-mobile.mp4",
      desktopWebm: "/videos/hero/paris-desktop.webm",
      desktopMp4:  "/videos/hero/paris-desktop.mp4",
    },
  },
  {
    label: "Playa del Carmen",
    poster: "/videos/hero/pcarmen-poster.jpg",
    sources: {
      mobileWebm: "/videos/hero/pcarmen-mobile.webm",
      mobileMp4:  "/videos/hero/pcarmen-mobile.mp4",
      desktopWebm: "/videos/hero/pcarmen-desktop.webm",
      desktopMp4:  "/videos/hero/pcarmen-desktop.mp4",
    },
  },
  {
    label: "Turquía",
    poster: "/videos/hero/turquia-poster.jpg",
    sources: {
      mobileWebm: "/videos/hero/turquia-mobile.webm",
      mobileMp4:  "/videos/hero/turquia-mobile.mp4",
      desktopWebm: "/videos/hero/turquia-desktop.webm",
      desktopMp4:  "/videos/hero/turquia-desktop.mp4",
    },
  },
] as const;