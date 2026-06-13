import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePackages } from "../data/packagesStore";

const CONTINENTS = ["América", "Europa", "Asia", "Caribe", "África", "Oceanía"];

export function BlogPage({ darkMode }: { darkMode: boolean }) {
  const { blogPosts } = usePackages();
  const [activeCont, setActiveCont] = useState("América");

  // Solo mostramos pestañas de continentes que tengan al menos una nota.
  const continents = useMemo(() => {
    const present = new Set(blogPosts.map((p) => p.continent));
    return CONTINENTS.filter((c) => present.has(c));
  }, [blogPosts]);

  const filteredPosts = useMemo(
    () => blogPosts.filter((post) => post.continent === activeCont),
    [blogPosts, activeCont],
  );

  return (
    <main className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-screen`}>
      <section className={`pt-32 md:pt-40 pb-12 md:pb-16 ${darkMode ? "bg-stone-900" : "bg-stone-50"} border-b ${darkMode ? "border-stone-800" : "border-stone-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600">
            ← Volver al inicio
          </Link>
          <h1 className={`text-3xl md:text-5xl font-black ${darkMode ? "text-white" : "text-stone-900"} mb-3`}>
            Blog de Viajes
          </h1>
          <p className={`${darkMode ? "text-stone-400" : "text-stone-600"} max-w-2xl text-base md:text-lg`}>
            Notas, ideas y consejos para planificar mejor cada viaje.
          </p>
        </div>
      </section>
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {continents.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCont(c)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  activeCont === c
                    ? "bg-[var(--antares-red)] text-white"
                    : `${darkMode ? "bg-stone-900 text-stone-300 border-stone-700" : "bg-white text-stone-600 border-stone-200"} border hover:border-red-300`
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          {filteredPosts.length === 0 ? (
            <p className={`${darkMode ? "text-stone-400" : "text-stone-600"}`}>
              Todavía no hay notas en esta región. Pronto sumamos más.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map((post) => (
                <Link
                  to={`/blog/${post.slug}`}
                  key={post.id}
                  className={`${darkMode ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"} group block overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >
                  {post.image && (
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="space-y-3 p-5">
                    <div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider ${darkMode ? "text-stone-400" : "text-stone-500"}`}>
                      <span>{post.continent}</span>
                      {post.country && (
                        <>
                          <span>•</span>
                          <span>{post.country}</span>
                        </>
                      )}
                    </div>
                    <h3 className={`text-lg font-bold leading-tight ${darkMode ? "text-white" : "text-stone-900"}`}>
                      {post.title}
                    </h3>
                    <p className={`${darkMode ? "text-stone-400" : "text-stone-600"} text-sm leading-relaxed`}>
                      {post.excerpt}
                    </p>
                    <div className={`flex items-center justify-between border-t pt-3 text-xs ${darkMode ? "border-stone-800 text-stone-500" : "border-stone-100 text-stone-400"}`}>
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
