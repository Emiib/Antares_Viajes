import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { usePackages } from "../data/packagesStore";

const SITE_NAME = "Antares Viajes y Turismo";

export function BlogPostPage({ darkMode }: { darkMode: boolean }) {
  const { slug } = useParams();
  const { blogPosts } = usePackages();
  const post = useMemo(
    () => blogPosts.find((p) => p.slug === slug || p.id === slug),
    [blogPosts, slug],
  );

  // SEO: título y descripción propios del artículo (clave para que Google lo indexe).
  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | ${SITE_NAME}`;
    const desc = post.excerpt || post.title;
    let tag = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", desc);
  }, [post]);

  const paragraphs = useMemo(
    () =>
      (post?.body || post?.excerpt || "")
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
    [post],
  );

  if (!post) {
    return (
      <main className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-[calc(100vh-80px)]`}>
        <section className={`pt-28 pb-12 md:pt-32 md:pb-16`}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/blog" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600">
              ← Volver al blog
            </Link>
            <h1 className={`text-3xl md:text-4xl font-black ${darkMode ? "text-white" : "text-stone-900"}`}>
              Nota no encontrada
            </h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} min-h-[calc(100vh-80px)]`}>
      <article className="pt-28 pb-16 md:pt-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
            ← Volver al blog
          </Link>

          <div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-stone-400" : "text-stone-500"}`}>
            <span>{post.continent}</span>
            {post.country && (
              <>
                <span>•</span>
                <span>{post.country}</span>
              </>
            )}
          </div>

          <h1 className={`text-3xl md:text-5xl font-black leading-tight mb-4 ${darkMode ? "text-white" : "text-stone-900"}`}>
            {post.title}
          </h1>

          <div className={`flex items-center gap-3 text-sm mb-8 ${darkMode ? "text-stone-500" : "text-stone-400"}`}>
            {post.date && <span>{post.date}</span>}
            {post.date && post.readTime && <span>·</span>}
            {post.readTime && <span>{post.readTime} de lectura</span>}
          </div>

          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="mb-8 h-64 md:h-96 w-full rounded-2xl object-cover"
            />
          )}

          {post.excerpt && (
            <p className={`text-lg md:text-xl font-medium leading-relaxed mb-8 ${darkMode ? "text-stone-300" : "text-stone-700"}`}>
              {post.excerpt}
            </p>
          )}

          <div className={`space-y-4 text-base leading-relaxed ${darkMode ? "text-stone-300" : "text-stone-700"}`}>
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-line">{p}</p>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
