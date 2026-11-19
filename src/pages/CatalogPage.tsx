import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LiveProductPreview } from '../components/LiveProductPreview';
import { PRODUCTS, UPCOMING_MODULES, type Product } from '../data/products';

const CATEGORIES = [
  { id: 'all', label: 'Semua Kategori (3)' },
  { id: 'editor', label: 'Editor Grafis & Foto (1)' },
  { id: 'utilitas', label: 'Utilitas Berkas & Media (1)' },
  { id: 'studio', label: 'Fotografi & Studio (1)' },
] as const;

const SPEC_CHIPS = [
  { id: 'client-side', icon: 'check_circle', label: 'Hanya Client-Side' },
  { id: 'gpu', icon: 'bolt', label: 'Akselerasi GPU' },
  { id: 'raw', icon: 'raw_on', label: 'Dukungan RAW' },
  { id: 'batch', icon: 'layers', label: 'Format Massal' },
] as const;

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [upcomingModules, setUpcomingModules] = useState(UPCOMING_MODULES);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'populer' | 'terbaru' | 'status'>('populer');
  const [activeAttrs, setActiveAttrs] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.products) {
          setProducts(data.products);
          if (data.upcomingModules) setUpcomingModules(data.upcomingModules);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleAttr = (attrId: string) => {
    setActiveAttrs((prev) =>
      prev.includes(attrId) ? prev.filter((item) => item !== attrId) : [...prev, attrId]
    );
  };

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = products.filter((p) => {
      const matchCat = category === 'all' || p.category === category;
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.longDescription.toLowerCase().includes(q) ||
        p.searchKeywords.includes(q);
      const matchAttrs =
        activeAttrs.length === 0 || activeAttrs.every((attr) => p.attributes.includes(attr));
      return matchCat && matchSearch && matchAttrs;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'populer') return b.popularity - a.popularity;
      if (sortBy === 'terbaru') return b.releaseOrder - a.releaseOrder;
      return a.number.localeCompare(b.number);
    });
  }, [products, search, category, sortBy, activeAttrs]);

  return (
    <div>
      {/* SECTION 1: HERO & TELEMETRY SUMMARY */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-6 pb-10 w-full">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#909090] mb-6 tracking-wider">
          <span className="flex items-center gap-1.5 bg-[#171111] border border-[#ff3030]/25 text-[#ff3030] px-3 py-1 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3030] animate-pulse" />
            SYSTEM V2.5 ONLINE | BANDUNG, INDONESIA // CATALOG DIRECTORY
          </span>
          <span className="text-[#262626]">/</span>
          <span className="text-white font-medium">KATALOG EKOSISTEM</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8">
            <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.04]">
              Katalog Produk <br />
              <span className="bg-gradient-to-r from-[#ff3030] via-[#ff6b6b] to-white bg-clip-text text-transparent">
                &amp; Utilitas Digital.
              </span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="font-body text-sm sm:text-base text-[#909090] leading-relaxed border-l-2 border-[#ff3030]/40 pl-4">
              Rangkaian aplikasi mandiri berbasis peramban berkinerja tinggi. Direkayasa untuk
              manipulasi visual presisi, akselerasi GPU lokal, dan proteksi privasi mutlak tanpa
              ketergantungan awan eksternal.
            </p>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Ketersediaan', icon: 'verified', val: '3 Aplikasi', sub: 'Siap Pakai Langsung', accent: true },
            { label: 'Arsitektur Data', icon: 'cloud_off', val: '0 KiB Data', sub: 'Pengiriman Server', accent: false },
            { label: 'Akselerasi', icon: 'memory', val: '100% Client-Side', sub: 'WebAssembly & GPU', accent: true },
            { label: 'Lisensi', icon: 'lock_open', val: 'Open Access', sub: 'Tanpa Langganan', accent: false },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-[#111111]/90 border border-[#241c1c] hover:border-[#ff3030]/40 p-4 sm:p-5 rounded-2xl flex flex-col justify-between transition-all group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between text-[#909090] group-hover:text-[#ff3030] transition-colors">
                <span className="font-mono text-[11px] uppercase tracking-wider">{m.label}</span>
                <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
              </div>
              <div className="mt-4">
                <div className="font-display font-bold text-2xl text-white tracking-tight">
                  {m.val}
                </div>
                <div
                  className={`font-mono text-xs font-medium mt-0.5 ${
                    m.accent ? 'text-[#ff3030]' : 'text-[#909090]'
                  }`}
                >
                  {m.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: SEARCH & FILTER CONTROL BAR */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-4 w-full">
        <div className="bg-[#111111]/90 border border-[#292222] p-4 sm:p-5 rounded-3xl flex flex-col gap-4 shadow-[0_16px_36px_rgba(0,0,0,0.7)] backdrop-blur-md">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#909090]">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#080808] border border-[#282020] text-white placeholder:text-[#909090]/60 pl-11 pr-14 py-2.5 rounded-full font-body text-sm focus:outline-none focus:border-[#ff3030] focus:ring-1 focus:ring-[#ff3030] transition-all"
                placeholder="Cari utilitas, converter, WebGL editor, format berkas..."
                type="text"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <kbd className="bg-[#1b1b1b] border border-[#303030] px-2 py-0.5 rounded-md text-[#909090] font-mono text-[10px]">
                  [ / ]
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <span className="font-mono text-[11px] text-[#909090] uppercase tracking-wider hidden sm:inline">
                Urutan:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'populer' | 'terbaru' | 'status')}
                  className="bg-[#080808] border border-[#282020] text-white py-2 pl-3.5 pr-8 rounded-full font-mono text-xs appearance-none cursor-pointer focus:outline-none focus:border-[#ff3030] transition-colors"
                >
                  <option value="populer">Terpopuler</option>
                  <option value="terbaru">Terbaru Ditambahkan</option>
                  <option value="status">Status Rilis</option>
                </select>
                <span className="material-symbols-outlined text-[#909090] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[16px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full font-mono text-xs whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#d61818] text-white font-bold shadow-[0_0_18px_rgba(255,48,48,0.5)]'
                      : 'bg-[#171717] border border-[#2a2a2a] text-[#909090] hover:text-white hover:border-[#ff3030]/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
            <button
              type="button"
              disabled
              className="px-4 py-1.5 rounded-full font-mono text-xs bg-[#141414] border border-[#202020] text-[#909090]/40 cursor-not-allowed whitespace-nowrap"
            >
              Eksperimen AI (Segera Hadir)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#1e1e1e]">
            <span className="font-mono text-[10px] text-[#909090] uppercase tracking-wider mr-1">
              Spesifikasi:
            </span>
            {SPEC_CHIPS.map((chip) => {
              const active = activeAttrs.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => toggleAttr(chip.id)}
                  className={`px-3 py-1 rounded-full font-mono text-[11px] flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#2a1212] border-[#ff3030] text-white'
                      : 'bg-[#151515] border-[#262626] text-[#909090] hover:text-white hover:border-[#ff3030]/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] text-[#ff3030]">
                    {chip.icon}
                  </span>
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE PRODUCTS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-7 bg-[#ff3030] rounded-full shadow-[0_0_12px_rgba(255,48,48,0.7)]" />
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Produk Unggulan Siap Pakai
            </h2>
          </div>
          <span className="font-mono text-xs text-[#ff3030] font-semibold tracking-widest uppercase">
            PRODUCTION READY V2.0
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-[#111111]/90 border border-[#281e1e] rounded-3xl p-12 text-center">
            <p className="font-mono text-sm text-[#909090] mb-4">
              Tidak ada aplikasi yang cocok dengan kriteria pencarian atau filter saat ini.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('all');
                setActiveAttrs([]);
              }}
              className="px-5 py-2 rounded-full bg-[#ff3030] text-white font-mono text-xs font-bold cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="bg-[#111111]/95 border border-[#281e1e] hover:border-[#ff3030]/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-5 relative bg-[#060606] min-h-[300px] lg:min-h-[420px] overflow-hidden">
                    <LiveProductPreview
                      url={product.liveUrl}
                      title={product.name}
                      fallbackImage={product.image}
                      badge={`${product.versionBadge} // ${product.engineTag}`}
                      className="w-full h-full min-h-[300px] lg:min-h-[420px] border-b-0"
                    />
                  </div>

                  <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs text-[#ff3030] font-bold tracking-wider uppercase">
                          {product.categoryLabel}
                        </span>
                        <span className="bg-[#1c1515] border border-[#ff3030]/30 px-2.5 py-0.5 rounded-full text-[#ff3030] font-mono text-[10px]">
                          {product.techStackLabel}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mb-3">
                        <Link
                          to={`/produk/${product.slug}`}
                          className="hover:text-[#ff3030] transition-colors"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      <p className="font-body text-sm sm:text-base text-[#909090] leading-relaxed mb-6">
                        {product.longDescription}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {product.bentoSpecs.map((spec) => (
                          <div
                            key={spec.label}
                            className="bg-[#171717]/80 border border-[#242424] p-3 rounded-xl flex items-center gap-3"
                          >
                            <span className="material-symbols-outlined text-[#ff3030] text-[20px]">
                              {spec.icon}
                            </span>
                            <span className="font-body text-xs sm:text-sm text-white font-medium">
                              {spec.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#1d1d1d]">
                      <a
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d61818] to-[#b81212] hover:from-[#ff4d4d] hover:to-[#d61818] text-white px-6 py-2.5 rounded-full font-mono text-xs font-bold shadow-[0_0_22px_rgba(255,48,48,0.4)] hover:shadow-[0_0_30px_rgba(255,48,48,0.6)] transition-all"
                        href={product.liveUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span>Buka Aplikasi di Browser</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                      </a>
                      <Link
                        to={`/produk/${product.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 bg-[#171717] hover:bg-[#222222] text-[#f2f2f2] border border-[#2b2b2b] px-4 py-2.5 rounded-full font-mono text-xs transition-colors"
                      >
                        <span className="material-symbols-outlined text-[15px]">menu_book</span>
                        <span>Arsitektur &amp; Detail</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4: FUTURE PIPELINE MODULES */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-xs text-[#ff3030] tracking-widest uppercase font-semibold">
              PIPELINE &amp; SCALABILITY
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mt-1">
              Modul Dalam Pengembangan
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-[#171111] border border-[#ff3030]/20 text-[#909090] font-mono text-xs px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#ff3030] animate-pulse" />
            <span>LAB EXPERIMENTS // Q3-Q4 2025</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {upcomingModules.map((mod) => (
            <div
              key={mod.title}
              className="bg-[#111111]/90 border border-[#262020] hover:border-[#ff3030]/40 p-6 rounded-3xl flex flex-col justify-between group transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-[#1c1515] border border-[#ff3030]/25 px-2.5 py-0.5 rounded-full text-[#ff3030] font-mono text-[10px] font-bold">
                    {mod.status}
                  </span>
                  <span className="material-symbols-outlined text-[#909090] group-hover:text-[#ff3030] transition-colors text-[24px]">
                    {mod.icon}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{mod.title}</h3>
                <p className="font-body text-xs sm:text-sm text-[#909090] leading-relaxed mb-6">
                  {mod.description}
                </p>
              </div>
              <div className="pt-4 border-t border-[#1f1f1f] flex items-center justify-between text-[#909090] font-mono text-xs">
                <span>{mod.platform}</span>
                <span className="text-[#ff3030] font-semibold">{mod.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
