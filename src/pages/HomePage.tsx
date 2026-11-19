import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers, Cpu, Briefcase, Sparkles, ShieldCheck, Headphones, Globe, X, CheckCircle2 } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { PRODUCTS, type Product } from '../data/products';
import { SERVICES, SOLUTIONS, WHY_JEVALLENE } from '../data/ecosystem';
import { SurfaceCard } from '../components/ui';
import { LiveProductPreview } from '../components/LiveProductPreview';
import { EcosystemCharts } from '../components/EcosystemCharts';

const ROTATING_AUDIENCES_ID = [
  'Kreator & Fotografer.',
  'Mahasiswa & Pelajar.',
  'Freelancer & Desainer.',
  'UMKM & Bisnis Modern.',
];

const ROTATING_AUDIENCES_EN = [
  'Creators & Photographers.',
  'Students & Learners.',
  'Freelancers & Designers.',
  'MSMEs & Modern Business.',
];

export function HomePage() {
  const { lang, t } = useLang();
  const homeSolutions = SOLUTIONS.filter((s) => s.id !== 'umkm');
  const [wordIdx, setWordIdx] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % ROTATING_AUDIENCES_ID.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const rotatingWord =
    lang === 'EN' ? ROTATING_AUDIENCES_EN[wordIdx] : ROTATING_AUDIENCES_ID[wordIdx];

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="pt-8 lg:pt-14 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171717] border border-[#242424] text-xs font-mono text-[#F5F5F5]/80">
            <span className="w-2 h-2 rounded-full bg-[#FF3030] animate-pulse" />
            <span>JEVALLENE // RED &amp; BLACK DIGITAL ECOSYSTEM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-white tracking-tight leading-[1.06]">
            {t('Teknologi untuk ', 'Technology for ')}
            <span className="animate-gradient-text">
              {t('Ide yang Lebih Besar.', 'Bigger Ideas.')}
            </span>
          </h1>

          <div className="flex items-center gap-2 text-sm sm:text-base font-mono text-neutral-300">
            <span className="text-neutral-500">{t('Dirancang untuk', 'Built for')}</span>
            <span
              key={`${lang}-${wordIdx}`}
              className="animate-word-in text-[#FF3030] font-semibold inline-block"
            >
              {rotatingWord}
            </span>
          </div>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
            {t(
              'Temukan tools digital dan solusi kreatif yang dirancang dengan presisi untuk mengakselerasi karya, produk, dan pertumbuhan bisnis Anda.',
              'Discover precision-engineered digital tools and creative solutions designed to accelerate your craft, products, and business growth.',
            )}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#FF3030] to-[#ae0f20] hover:from-[#D41414] hover:to-[#FF3030] border border-[#FF3030] text-[#f5f5f7] font-semibold text-sm sm:text-base transition-all shadow-[0_0_28px_rgba(255,48,48,0.35)] hover:shadow-[0_0_40px_rgba(255,48,48,0.5)]"
            >
              <span>{t('Jelajahi Produk', 'Explore Products')}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#14141a]/55 backdrop-blur-md hover:bg-white/[0.05] text-[#fafafa] border border-white/[0.12] hover:border-[#FF3030]/40 shadow-[inset_0_1px_rgba(255,255,255,0.12),0_4px_14px_rgba(0,0,0,0.28)] hover:shadow-[inset_0_1px_rgba(255,255,255,0.16),0_6px_22px_rgba(255,48,48,0.28)] font-medium text-sm sm:text-base transition-all"
            >
              <span>{t('Lihat Layanan', 'View Services')}</span>
            </Link>
          </div>
        </div>

        {/* Hero Right: Abstract 3D & Floating Windows */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-4 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(255,48,48,0.28),transparent_65%)] blur-2xl pointer-events-none" />
          <div className="relative rounded-3xl bg-[#171717]/90 border border-[#242424] p-6 shadow-2xl space-y-4 overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3030]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#242424]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#242424]" />
              </div>
              <span className="text-[11px] font-mono text-neutral-400">JEVALLENE WORKSPACE</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#090909] border border-[#242424] p-4 space-y-2 animate-float-slow">
                <div className="w-8 h-8 rounded-xl primary-gradient flex items-center justify-center text-white text-xs font-bold">
                  01
                </div>
                <p className="text-xs font-semibold text-white">Photo Editor</p>
                <p className="text-[11px] text-neutral-400">Web Browser Utility</p>
              </div>
              <div
                className="rounded-2xl bg-[#090909] border border-[#242424] p-4 space-y-2 animate-float-slow"
                style={{ animationDelay: '1.2s' }}
              >
                <div className="w-8 h-8 rounded-xl bg-[#242424] border border-[#FF3030]/40 flex items-center justify-center text-[#FF3030] text-xs font-bold">
                  02
                </div>
                <p className="text-xs font-semibold text-white">Converter</p>
                <p className="text-[11px] text-neutral-400">Fast File Pipeline</p>
              </div>
            </div>

            <div className="rounded-2xl primary-gradient p-5 border border-[#FF3030]/30 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono text-white/80 uppercase">Creative Engine</p>
                <p className="text-base font-bold text-white mt-0.5">Jevallene PhotoStudio</p>
              </div>
              <Link
                to="/products/photostudio"
                className="px-3.5 py-1.5 rounded-full bg-[#090909]/80 text-white text-xs font-medium hover:bg-[#090909] hover:shadow-[0_0_18px_rgba(255,48,48,0.45)] transition-all"
              >
                {t('Buka ↗', 'Open ↗')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">
              Featured Products
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              {t('Ekosistem Produk Aktif', 'Active Product Ecosystem')}
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium text-[#FF3030] hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>{t('Lihat Semua Produk', 'View All Products')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <SurfaceCard key={product.id} className="overflow-hidden flex flex-col group">
              <LiveProductPreview
                url={product.liveUrl}
                title={product.name}
                fallbackImage={product.image}
                badge={product.categoryLabel}
              />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{product.summary}</p>
                </div>
                <div className="flex items-center gap-2.5 pt-2">
                  <a
                    href={product.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      fetch(`/api/products/${product.slug}/launch`, { method: 'POST' }).catch(
                        () => {},
                      );
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FF3030] hover:bg-[#D41414] hover:shadow-[0_0_24px_rgba(255,48,48,0.5)] hover:-translate-y-0.5 text-white text-xs font-semibold transition-all"
                  >
                    <span>Open Product</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="px-4 py-2.5 rounded-full bg-[#090909] hover:bg-[#242424] border border-[#242424] hover:border-[#FF3030]/50 hover:shadow-[0_0_18px_rgba(255,48,48,0.28)] hover:-translate-y-0.5 text-xs font-medium text-neutral-200 transition-all cursor-pointer"
                  >
                    {t('Detail', 'Details')}
                  </button>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </section>

      {/* 3. ECOSYSTEM INTRODUCTION */}
      <section className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">
            {t('Arsitektur Ekosistem', 'Ecosystem Architecture')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {t(
              'Fondasi Arsitektur Produk & Layanan Terintegrasi.',
              'Integrated Product & Service Architecture.',
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Layers,
              title: 'Digital Products',
              desc: t(
                'Aplikasi dan utilitas produktivitas berbasis web yang siap digunakan langsung oleh individu maupun tim.',
                'Web-based productivity apps and utilities ready to use for individuals and teams.',
              ),
            },
            {
              icon: Cpu,
              title: 'Creative Technology',
              desc: t(
                'Eksplorasi rekayasa antarmuka modern, pemrosesan visual, dan pengalaman digital yang responsif.',
                'Modern interface engineering, visual processing, and responsive digital experiences.',
              ),
            },
            {
              icon: Briefcase,
              title: 'Professional Services',
              desc: t(
                'Layanan pengembangan website, aplikasi, UI/UX design, hingga strategi konten untuk pertumbuhan bisnis.',
                'Website, app development, UI/UX design, and content strategy services for business growth.',
              ),
            },
          ].map((pillar) => (
            <SurfaceCard key={pillar.title} className="p-7 space-y-4 hover:-translate-y-1">
              <div className="w-11 h-11 rounded-2xl bg-[#FF3030]/15 border border-[#FF3030]/35 flex items-center justify-center text-[#FF3030]">
                <pillar.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{pillar.desc}</p>
            </SurfaceCard>
          ))}
        </div>
      </section>

      {/* 3B. REAL-DATA ECOSYSTEM CHARTS */}
      <EcosystemCharts />

      {/* 4. SERVICES SECTION */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">
              Professional Services
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              {t('Layanan Studio & Teknologi', 'Studio & Technology Services')}
            </h2>
          </div>
          <Link
            to="/services"
            className="text-sm font-medium text-[#FF3030] hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>{t('Eksplorasi Layanan', 'Explore Services')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service) => (
            <SurfaceCard key={service.id} className="p-6 space-y-3 hover:-translate-y-1">
              <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF3030]/10 text-[#FF3030] border border-[#FF3030]/25">
                {service.category}
              </span>
              <h3 className="text-lg font-bold text-white">{service.title}</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {service.description}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </section>

      {/* 5. WHY JEVALLENE */}
      <section className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">Why Jevallene</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {t('Dirancang untuk Aksesibilitas dan Kualitas.', 'Built for Accessibility and Quality.')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_JEVALLENE.map((item, idx) => {
            const icons = [Sparkles, ShieldCheck, Headphones, Globe];
            const Icon = icons[idx % icons.length];
            return (
              <SurfaceCard key={item.title} className="p-6 space-y-3">
                <Icon className="w-5 h-5 text-[#FF3030]" />
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </SurfaceCard>
            );
          })}
        </div>
      </section>

      {/* 6. SOLUTIONS SECTION */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">Solutions</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              {t('Solusi untuk Setiap Peran', 'Solutions for Every Role')}
            </h2>
          </div>
          <Link
            to="/solutions"
            className="text-sm font-medium text-[#FF3030] hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>{t('Lihat Semua Solusi', 'View All Solutions')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {homeSolutions.map((sol) => (
            <SurfaceCard key={sol.id} className="p-5 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">{sol.title}</h3>
                <p className="text-[11px] font-mono text-[#FF3030]">{sol.subtitle}</p>
                <p className="text-xs text-neutral-400 leading-relaxed">{sol.description}</p>
              </div>
              <Link
                to="/solutions"
                className="text-xs font-medium text-white/80 hover:text-[#FF3030] pt-2 inline-flex items-center gap-1"
              >
                <span>{t('Pelajari', 'Learn more')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </SurfaceCard>
          ))}
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section>
        <div className="primary-gradient rounded-3xl p-8 sm:p-14 lg:p-16 border border-[#FF3030]/40 shadow-[0_24px_80px_rgba(255,48,48,0.22)] relative overflow-hidden">
          <div className="max-w-2xl space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Let&apos;s Build Something Meaningful.
            </h2>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed">
              {t(
                'Rancang produk digital, sistem antarmuka, atau infrastruktur web berstandar studio bersama tim rekayasa Jevallene.',
                'Architect studio-grade digital products, interface systems, and web infrastructure with the Jevallene engineering team.',
              )}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#090909] font-bold text-sm hover:bg-[#F5F5F5] hover:shadow-[0_0_28px_rgba(255,255,255,0.45)] hover:-translate-y-0.5 transition-all shadow-xl"
            >
              <span>{t('Mulai Bersama Jevallene', 'Start with Jevallene')}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCT DETAIL POPUP MODAL */}
      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedProduct.name}
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0e0e12] border border-[#242424] shadow-[0_24px_80px_rgba(0,0,0,0.95)] animate-fade-up"
          >
            <LiveProductPreview
              url={selectedProduct.liveUrl}
              title={selectedProduct.name}
              fallbackImage={selectedProduct.image}
              badge={`${selectedProduct.versionBadge} // ${selectedProduct.categoryLabel}`}
            />

            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono text-[#FF3030] uppercase tracking-wider">
                    {selectedProduct.techStackLabel}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">{selectedProduct.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  aria-label={t('Tutup popup', 'Close popup')}
                  className="p-2 rounded-full bg-[#171717] border border-[#242424] text-neutral-400 hover:text-white hover:border-[#FF3030]/60 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {selectedProduct.longDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedProduct.bentoSpecs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#242424] text-xs text-neutral-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3030] shrink-0" />
                    <span>{spec.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-5 py-2.5 rounded-full bg-[#171717] hover:bg-[#242424] border border-[#242424] text-xs font-medium text-neutral-200 transition-all cursor-pointer"
                >
                  {t('Tutup', 'Close')}
                </button>
                <a
                  href={selectedProduct.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    fetch(`/api/products/${selectedProduct.slug}/launch`, { method: 'POST' }).catch(
                      () => {},
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF3030] to-[#ae0f20] hover:from-[#D41414] hover:to-[#FF3030] text-white text-xs font-semibold shadow-[0_0_24px_rgba(255,48,48,0.4)] hover:shadow-[0_0_36px_rgba(255,48,48,0.6)] transition-all"
                >
                  <span>Open Product</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
