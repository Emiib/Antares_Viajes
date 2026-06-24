import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { destinationsStack, type StackDestination } from "../../data/destinationsStack";
import { Icon } from "../ui/Icon";

/**
 * Sección "Destinos" del home con efecto de tarjetas apiladas (sticky stacking).
 *
 * Cada tarjeta queda fija (sticky) y la siguiente se desliza por encima, apilándose:
 * así se recorren 6 destinos sin que se sienta que "se baja mucho". A medida que una
 * tarjeta queda tapada, se encoge y se oscurece levemente (sensación de profundidad 3D).
 * Cada destino aporta su color de identidad de forma sutil (aura + acentos).
 *
 * Respeta prefers-reduced-motion: sin scale/zoom/tilt, solo el apilado por CSS.
 */
export function DestinationsStack() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section id="destinos" data-track-section="destinos" className="bg-base relative">
      {/* Encabezado */}
      <div className="mx-auto max-w-[1340px] px-5 pt-[clamp(4rem,9vw,7rem)] sm:px-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-9" style={{ background: "var(--terra)" }} />
          <span className="terra text-[0.7rem] font-semibold uppercase ls-wide">Destinos</span>
        </div>
        <h2 className="font-display t1 leading-[1.03] text-balance" style={{ fontSize: "clamp(2.2rem,5vw,4rem)" }}>
          Elegí tu próximo<br /><span className="italic">destino.</span>
        </h2>
        <p className="t-mut mt-4 max-w-[34rem] text-[0.98rem] leading-relaxed">
          Seis mundos, una misma agencia que se ocupa de todo. Deslizá y descubrí cada uno.
        </p>
      </div>

      {/* Pila de tarjetas */}
      <div ref={container} className="relative mt-[clamp(2rem,5vw,4rem)]">
        {destinationsStack.map((dest, i) => {
          // Las tarjetas anteriores se encogen un poco más a medida que quedan tapadas.
          const targetScale = 1 - (destinationsStack.length - i) * 0.04;
          return (
            <StackCard
              key={dest.slug}
              dest={dest}
              index={i}
              total={destinationsStack.length}
              progress={scrollYProgress}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}

function StackCard({
  dest,
  index,
  total,
  progress,
  targetScale,
}: {
  dest: StackDestination;
  index: number;
  total: number;
  progress: MotionValue<number>;
  targetScale: number;
}) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll local de la tarjeta: para el zoom de la imagen y el tilt 3D de entrada.
  const { scrollYProgress: local } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  // Encogido global: arranca cuando empieza el tramo de esta tarjeta y llega a targetScale.
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  // Zoom muy leve de la imagen mientras la tarjeta entra.
  const imageScale = useTransform(local, [0, 1], [1.16, 1]);
  // Tilt 3D sutil de entrada (se apoya en la perspectiva del contenedor).
  const rotateX = useTransform(local, [0, 1], [6, 0]);

  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={cardRef}
      className="sticky top-0 flex min-h-[92vh] items-center justify-center px-4 sm:px-6"
      style={{ perspective: 1200 }}
    >
      <Link
        to={dest.to}
        aria-label={`Ver viajes a ${dest.name}`}
        className="group block w-full max-w-[1080px] focus:outline-none"
      >
        <motion.article
          style={{
            scale: reduce ? 1 : scale,
            rotateX: reduce ? 0 : rotateX,
            top: `calc(-4vh + ${index * 16}px)`, // cada tarjeta asoma un poco más abajo
            transformOrigin: "top center",
            boxShadow: `0 40px 90px -50px ${dest.color}, 0 20px 50px -40px rgba(0,0,0,.6)`,
          }}
          className="relative h-[clamp(420px,72vh,600px)] w-full overflow-hidden rounded-[1.6rem]"
        >
          {/* Imagen */}
          <motion.img
            src={dest.image}
            alt={`Viajes a ${dest.name}`}
            loading="lazy"
            decoding="async"
            style={{ scale: reduce ? 1 : imageScale }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Velo oscuro para legibilidad del texto */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(10,9,8,.08) 30%, rgba(10,9,8,.55) 70%, rgba(10,9,8,.92) 100%)" }}
          />
          {/* Aura de color del destino (sutil, arriba) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(120% 70% at 50% 0%, ${dest.color}33 0%, transparent 55%)` }}
          />
          {/* Ribete interno tenue en el color */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[1.6rem]"
            style={{ boxShadow: `inset 0 0 0 1px ${dest.color}40` }}
          />

          {/* Contenido */}
          <div className="relative flex h-full flex-col justify-between p-6 sm:p-9">
            <div className="flex items-start justify-between">
              <span className="font-display text-[1.6rem] leading-none" style={{ color: `${dest.color}cc` }}>
                {num}<span className="text-white/30"> / {String(total).padStart(2, "0")}</span>
              </span>
              <span
                className="grid h-10 w-10 place-items-center rounded-full text-white/90 backdrop-blur-md transition-all duration-300 group-hover:scale-110"
                style={{ background: `${dest.color}33`, border: `1px solid ${dest.color}66` }}
              >
                <Icon name="arrowR" className="h-4 w-4" />
              </span>
            </div>

            <div>
              <span
                className="text-[0.68rem] font-semibold uppercase ls-wide"
                style={{ color: dest.color }}
              >
                {dest.tagline}
              </span>
              <h3 className="font-display mt-1.5 text-[2rem] leading-[1.02] text-white sm:text-[2.7rem]">
                {dest.name}
              </h3>
              <p className="mt-2 max-w-[30rem] text-[0.92rem] leading-relaxed text-white/75">
                {dest.blurb}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-white transition-all duration-300 group-hover:gap-2.5">
                Ver destino
                <Icon name="arrowR" className="h-4 w-4" />
              </span>
            </div>
          </div>
        </motion.article>
      </Link>
    </div>
  );
}
