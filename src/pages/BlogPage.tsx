import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import { BLOG_ARTICLES } from '../data/ecosystem';
import { EmptyState, SurfaceCard } from '../components/ui';

const CATEGORIES = ['All', 'Ecosystem', 'Design', 'Technology', 'Productivity'] as const;

export function BlogPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');

  const activeArticle = slug ? BLOG_ARTICLES.find((a) => a.slug === slug) : undefined;

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return BLOG_ARTICLES.filter((article) => {
      const matchCat = category === 'All' || article.category === category;
      const matchQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [search, category]);

  if (activeArticle) {
    return (
      <article className="max-w-4xl mx-auto px-5 sm:px-8 pt-8 pb-16 space-y-8 animate-fade-up">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF3030]" />
          <span>Kembali ke Blog</span>
        </Link>

        <header className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-[#FF3030]/15 text-[#FF3030] border border-[#FF3030]/30">
              {activeArticle.category}
            </span>
            <span className="text-neutral-400">{activeArticle.readTime}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
            {activeArticle.title}
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            {activeArticle.excerpt}
          </p>
        </header>

        <div className="border-t border-[#242424] pt-8 space-y-5 text-neutral-300 leading-relaxed text-base">
          {activeArticle.content.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </article>
    );
  }

  const featured = BLOG_ARTICLES.find((a) => a.featured) ?? BLOG_ARTICLES[0];

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-16 space-y-14">
      <section className="space-y-5 max-w-3xl animate-fade-up">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#242424] text-xs font-mono text-[#FF3030]">
          EDITORIAL &amp; INSIGHTS
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Jevallene Journal
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
          Catatan seputar desain sistem, rekayasa teknologi web, dan produktivitas kreator.
        </p>
      </section>

      {/* Featured Article */}
      <SurfaceCard className="p-7 sm:p-10 primary-gradient border-[#FF3030]/40 space-y-4">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-[#090909]/80 text-[#FF3030]">FEATURED</span>
          <span className="text-white/80">{featured.category}</span>
          <span className="text-white/60">· {featured.readTime}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white max-w-3xl">{featured.title}</h2>
        <p className="text-sm sm:text-base text-white/85 max-w-2xl leading-relaxed">
          {featured.excerpt}
        </p>
        <Link
          to={`/blog/${featured.slug}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#090909] font-semibold text-xs hover:bg-[#F5F5F5] transition-colors"
        >
          <span>Baca Artikel</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </SurfaceCard>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                category === cat
                  ? 'bg-[#FF3030] text-white'
                  : 'bg-[#171717] border border-[#242424] text-neutral-300 hover:border-[#FF3030]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari artikel..."
            aria-label="Cari artikel"
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#171717] border border-[#242424] text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF3030]"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <EmptyState
          title="Artikel tidak ditemukan"
          description="Coba ubah kata kunci pencarian atau pilih kategori lain."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <SurfaceCard key={article.slug} className="p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#FF3030]">{article.category}</span>
                  <span className="text-neutral-500">{article.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white leading-snug">{article.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{article.excerpt}</p>
              </div>
              <Link
                to={`/blog/${article.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#FF3030] transition-colors"
              >
                <span>Baca Selengkapnya</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </SurfaceCard>
          ))}
        </div>
      )}
    </div>
  );
}
