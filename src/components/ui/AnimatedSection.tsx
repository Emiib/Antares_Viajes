import React from "react";
import { useInView } from "../../hooks/useInView";

export function AnimatedSection({
  children,
  className = "",
  threshold = 0.15,
  ...props
}: React.ComponentProps<"section"> & { threshold?: number }) {
  const { ref, inView } = useInView(threshold);
  return (
    <section
      ref={ref}
      {...props}
      className={`transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className}`}
    >
      {children}
    </section>
  );
}