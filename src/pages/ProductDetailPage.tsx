import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PRODUCTS, type Product } from '../data/products';

const TOOLBAR_TOOLS = [
  {
    id: 'crop',
    icon: 'crop',
    title: 'Transform & Crop',
    modeLabel: 'Geometry: 16:9 Freeform',
    filterClass: 'contrast-105 brightness-95',
    histogramPath: 'M 0,28 Q 18,22 32,16 T 55,14 T 78,18 T 100,28',
    statusLeft: 'CANVAS: 3840 x 2160 (16:9) | CROP: ACTIVE',
    statusRight: 'GEOMETRY_GRID: RULE OF THIRDS OK',
  },
  {
    id: 'tune',
    icon: 'tune',
    title: 'Curves & Tone',
    modeLabel: 'Tone Curve: S-Log Matrix',
    filterClass: 'contrast-125 brightness-105',
    histogramPath: 'M 0,28 Q 15,25 25,12 T 45,18 T 65,8 T 85,22 T 100,28',
    statusLeft: 'CANVAS: 3840 x 2160 (4K UHD) | COLOR: sRGB',
    statusRight: 'TONE_MATRIX: S-LOG CURVE ACTIVE',
  },
  {
    id: 'brush',
    icon: 'brush',
    title: 'Selective Masking',
    modeLabel: 'Mask: Radial Feather 24px',
    filterClass: 'contrast-115 saturate-110 brightness-95',
    histogramPath: 'M 0,28 Q 22,18 38,10 T 60,16 T 82,14 T 100,28',
    statusLeft: 'MASK: RADIAL FEATHER 24PX | OPACITY: 85%',
    statusRight: 'MASK_BUFFER: ALPHA CHANNEL OK',
  },
  {
    id: 'palette',
    icon: 'palette',
    title: 'HSL Grader',
    modeLabel: 'Color: Crimson Noir LUT',
    filterClass: 'saturate-150 contrast-115 hue-rotate-[-8deg]',
    histogramPath: 'M 0,28 Q 14,20 28,8 T 52,14 T 76,6 T 100,28',
    statusLeft: 'LUT: CRIMSON NOIR | GAMUT: DCI-P3',
    statusRight: 'COLOR_PIPELINE: 10-BIT LUT OK',
  },
  {
    id: 'auto_fix_high',
    icon: 'auto_fix_high',
    title: 'Sharpen Filter',
    modeLabel: 'Detail: Unsharp Mask 1.4x',
    filterClass: 'contrast-130 brightness-105 saturate-110',
    histogramPath: 'M 0,28 Q 20,20 35,6 T 55,14 T 75,10 T 95,20',
    statusLeft: 'CANVAS: 3840 x 2160 (4K UHD) | COLOR: sRGB',
    statusRight: 'GL_RENDER_PIPELINE: BUFFER 24.8MB OK',
  },
] as const;

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const fallbackProduct = PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0];
  const [product, setProduct] = useState<Product>(fallbackProduct);

  const [activeTool, setActiveTool] = useState<string>('tune');
  const [splitPos, setSplitPos] = useState<number>(50);

  useEffect(() => {
    setProduct(PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0]);
    if (!slug) return;
    let active = true;
    fetch(`/api/products/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.product) setProduct(data.product);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [slug]);

  const handleLaunchClick = () => {
    fetch(`/api/products/${product.slug}/launch`, { method: 'POST' }).catch(() => {});
  };

  const activeToolObj = TOOLBAR_TOOLS.find((t) => t.id === activeTool) ?? TOOLBAR_TOOLS[1];
  const currentIdx = PRODUCTS.findIndex((p) => p.slug === product.slug);
  const prevProduct = PRODUCTS[(currentIdx - 1 + PRODUCTS.length) % PRODUCTS.length];
  const nextProduct = PRODUCTS[(currentIdx + 1) % PRODUCTS.length];
  const relatedProducts = PRODUCTS.filter((p) => p.slug !== product.slug);

  return (
    <div className="pb-16">
      {/* HERO & WORKSTATION MOCKUP VIEWPORT */}
      <section id="ringkasan" className="max-w-7xl mx-auto px-5 sm:px-8 pt-6 pb-10 w-full scroll-mt-24">
        {/* Breadcrumb & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-neutral-400 tracking-wider">
            <Link to="/" className="hover:text-white transition-colors">
              EKOSISTEM
            </Link>
            <span className="text-neutral-700">/</span>
            <Link to="/products" className="hover:text-white transition-colors">
              PRODUCTS
            </Link>
            <span className="text-neutral-700">/</span>
            <span className="text-[#ff3030] font-semibold uppercase">{product.name}</span>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#171717] border border-[#242424] hover:border-[#FF3030]/50 text-xs font-mono text-neutral-300 hover:text-white transition-all"
          >
            <span>← Semua Produk</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#171111] border border-[#ff3030]/30 font-mono text-[11px] text-[#ff3030] font-semibold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3030] animate-pulse" />
              <span>
                {product.versionBadge} // {product.engineTag}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.06]">
              {product.name}
            </h1>

            <p className="font-body text-base sm:text-lg text-neutral-400 leading-relaxed">
              {product.longDescription}
            </p>

            {/* Product Switcher Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {PRODUCTS.map((item) => (
                <Link
                  key={item.id}
                  to={`/products/${item.slug}`}
                  className={`px-3 py-1.5 rounded-full font-mono text-[11px] border transition-all ${
                    item.id === product.id
                      ? 'bg-[#E5142A]/15 border-[#E5142A] text-white font-semibold shadow-[0_0_16px_rgba(255,48,48,0.28)]'
                      : 'bg-[#0B0B0E] border-[#242424] text-neutral-400 hover:text-white hover:border-[#FF3030]/45'
                  }`}
                >
                  {item.number} · {item.shortTitle}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E5142A] to-[#B80D1F] text-white text-base font-semibold tracking-wide hover:shadow-[0_0_32px_rgba(229,20,42,0.5)] transition-all shadow-[0_0_20px_rgba(229,20,42,0.35)]"
                href={product.liveUrl}
                rel="noopener noreferrer"
                target="_blank"
                onClick={handleLaunchClick}
              >
                Buka Aplikasi di Browser ↗
              </a>
              <a
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#0B0B0E] text-neutral-200 font-mono text-xs uppercase tracking-wider hover:bg-[#171114] hover:text-white transition-colors border border-white/10 hover:border-[#E5142A]/45"
                href="#spesifikasi"
              >
                Dokumentasi WebGL //
              </a>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 pt-1">
              <span className="material-symbols-outlined text-[18px] text-[#ff3030]">
                verified_user
              </span>
              <span>
                Privasi Mutlak — Seluruh proses manipulasi dijalankan murni di RAM perangkat lokal
                Anda.
              </span>
            </div>
          </div>

          {/* Hero Right Column: Interactive Workstation Mockup Viewport */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-[#ff3030]/15 rounded-3xl blur-3xl -z-10" />
            <div className="rounded-2xl bg-[#0e0e0e] border border-white/15 shadow-2xl overflow-hidden flex flex-col">
              {/* App Window Bar */}
              <div className="px-3 sm:px-4 py-2.5 bg-[#080808] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff3030] shrink-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 shrink-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 shrink-0" />
                  <span className="ml-1 font-mono text-[10px] sm:text-[11px] text-neutral-400 truncate">
                    JEVALLENE CORE // ENGINE
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-[#141414] border border-white/10 text-[#ff3030] font-semibold">
                    {product.versionBadge} // {product.engineTag}
                  </span>
                  <span className="hidden sm:inline text-neutral-400">60 FPS</span>
                </div>
              </div>

              {/* Interactive Toolbar */}
              <div className="px-4 py-2 bg-[#141414] border-b border-white/10 flex items-center justify-between overflow-x-auto">
                <div className="flex items-center gap-2 text-neutral-400">
                  {TOOLBAR_TOOLS.map((tool) => {
                    const isActive = tool.id === activeTool;
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => setActiveTool(tool.id)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#1f1f1f] text-[#ff3030]'
                            : 'hover:bg-[#1f1f1f] hover:text-white'
                        }`}
                        title={tool.title}
                      >
                        <span className="material-symbols-outlined text-[18px]">{tool.icon}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-neutral-400">SPLIT: {splitPos}%</span>
                  <a
                    href={product.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-full bg-[#ff3030] text-white font-mono text-xs font-semibold shadow-[0_0_12px_rgba(255,48,48,0.4)] hover:bg-[#e0190f] transition-colors"
                  >
                    LAUNCH APP
                  </a>
                </div>
              </div>

              {/* Main Interactive Canvas Viewport with Split Slider */}
              <div className="relative w-full h-80 md:h-96 bg-[#050505] overflow-hidden select-none">
                {/* Base (Graded) Image synced with active tool */}
                <img
                  alt={product.name}
                  className={`w-full h-full object-cover opacity-95 transition-all duration-300 ${activeToolObj.filterClass}`}
                  src={product.detailHeroImage}
                />
                {/* Clipped (Raw/Original) Image on Left without squishing */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
                >
                  <img
                    alt={`${product.name} Original`}
                    className="w-full h-full object-cover grayscale contrast-90 brightness-75"
                    src={product.detailHeroImage}
                  />
                </div>

                {/* Crop Grid Overlay when 'crop' tab is active */}
                {activeTool === 'crop' && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-4 border border-[#FF3030]/60 grid grid-cols-3 grid-rows-3"
                  >
                    {Array.from({ length: 9 }).map((_, idx) => (
                      <div key={idx} className="border border-white/15" />
                    ))}
                  </div>
                )}

                {/* Radial Mask Overlay when 'brush' tab is active */}
                {activeTool === 'brush' && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_32%,rgba(255,48,48,0.22)_100%)]"
                  />
                )}

                {/* Split Screen Slider Line */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-[#ff3030] shadow-[0_0_12px_#ff3030] flex items-center justify-center pointer-events-none"
                  style={{ left: `${splitPos}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-[#0e0e0e] border border-[#ff3030] flex items-center justify-center text-[#ff3030] text-[10px] shadow-[0_0_10px_rgba(255,48,48,0.5)]">
                    ◀▶
                  </div>
                </div>

                {/* Invisible Range Input for Smooth Dragging */}
                <input
                  aria-label="Before and after split comparison"
                  type="range"
                  min={5}
                  max={95}
                  value={splitPos}
                  onChange={(e) => setSplitPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />

                {/* Top Left Canvas Pill */}
                <div className="absolute top-3 left-3 bg-[#080808]/90 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 flex items-center gap-2 text-white pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff3030] animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-wider">
                    {activeToolObj.modeLabel}
                  </span>
                </div>

                {/* Live Curves / Histogram Graphic */}
                <div className="absolute bottom-3 right-3 w-36 sm:w-48 p-2 sm:p-2.5 rounded-xl bg-[#080808]/90 backdrop-blur-md border border-white/10 flex flex-col gap-1.5 shadow-xl pointer-events-none">
                  <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px]">
                    <span>HISTOGRAM (RGB)</span>
                    <span className="text-[#ff3030] font-semibold">sRGB</span>
                  </div>
                  <svg className="w-full h-8 stroke-current" viewBox="0 0 100 30">
                    <path
                      className="text-[#ff3030] transition-all duration-300"
                      d={`${activeToolObj.histogramPath} L 100,30 L 0,30 Z`}
                      fill="rgba(255,48,48,0.25)"
                    />
                    <path
                      className="text-[#ff3030] transition-all duration-300"
                      d={`${activeToolObj.histogramPath} L 100,30 L 0,30 Z`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                  <div className="flex justify-between font-mono text-[9px] text-neutral-400">
                    <span>SHADOWS</span>
                    <span>MIDTONES</span>
                    <span>HIGHLIGHTS</span>
                  </div>
                </div>
              </div>

              {/* Editor Status Footer */}
              <div className="px-4 py-2 bg-[#080808] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-neutral-400 font-mono text-[11px]">
                <span>{activeToolObj.statusLeft}</span>
                <div className="text-[#ff3030] font-semibold">{activeToolObj.statusRight}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IN-PAGE SECTION NAVIGATION */}
      <nav
        aria-label="Navigasi bagian produk"
        className="max-w-7xl mx-auto px-5 sm:px-8 pb-6 w-full"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#14141a]/80 border border-[#242424] backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { href: '#ringkasan', label: '01 · Preview & Ringkasan' },
              { href: '#spesifikasi', label: '02 · Spesifikasi Mesin' },
              { href: '#alur-kerja', label: '03 · Alur Kerja' },
              { href: '#produk-terkait', label: '04 · Produk Lainnya' },
            ].map((sec) => (
              <a
                key={sec.href}
                href={sec.href}
                className="px-3.5 py-1.5 rounded-full text-xs font-mono text-neutral-300 hover:text-white bg-[#090909] hover:bg-[#1c1c22] border border-[#242424] hover:border-[#FF3030]/50 transition-all"
              >
                {sec.label}
              </a>
            ))}
          </div>
          <a
            href={product.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLaunchClick}
            className="px-4 py-1.5 rounded-full bg-[#FF3030] hover:bg-[#D41414] text-white text-xs font-mono font-semibold transition-all shadow-[0_0_18px_rgba(255,48,48,0.35)]"
          >
            Buka {product.shortTitle} ↗
          </a>
        </div>
      </nav>

      {/* SECTION 01: REKAYASA & ARSITEKTUR MESIN */}
      <section id="spesifikasi" className="max-w-7xl mx-auto px-5 sm:px-8 py-14 w-full scroll-mt-24">
        <div className="flex flex-col gap-2 mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#ff3030] font-semibold">
            01 —— REKAYASA &amp; ARSITEKTUR MESIN
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
            Dibangun Tanpa Kompromi untuk Kecepatan &amp; Kedaulatan Data.
          </h2>
          <p className="font-body text-neutral-400 max-w-2xl">
            Setiap fungsi manipulasi dibangun menggunakan shader fragment WebGL &amp; WebAssembly
            yang dikompilasi secara real-time langsung ke prosesor lokal peramban Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: 'speed',
              tag: 'MODUL 01 // GPU COMPILATION',
              title: 'Akselerasi WebGL 2.0 & Canvas API',
              desc: 'Render shader GPU lokal untuk kurva warna, saturasi, eksposur, dan tone-mapping instan tanpa delay komputasi CPU konvensional.',
              footer: '60 FPS UNBOUNDED →',
            },
            {
              icon: 'lock',
              tag: 'MODUL 02 // ZERO TRANSMISSION',
              title: '100% Client-Side & Zero-Cloud',
              desc: 'Berkas gambar tidak pernah dikirim ke cloud atau backend manapun. Sepenuhnya aman dan privat untuk manipulasi dokumen krusial.',
              footer: 'ZERO TRANSMISSION →',
            },
            {
              icon: 'layers',
              tag: 'MODUL 03 // STATE ENGINE',
              title: 'Lapisan Non-Destruktif',
              desc: 'Riwayat undo/redo mendalam dengan sistem state in-memory hemat memori. Eksperimen bebas tanpa kehilangan piksel asli foto mentah.',
              footer: 'STATE-HISTORY ENGINE →',
            },
            {
              icon: 'output',
              tag: 'MODUL 04 // PIPELINE EXPORT',
              title: 'Ekspor Multi-Format Presisi',
              desc: 'Konversi instan ke PNG lossless, WebP modern terkompresi, hingga JPEG 100% dengan retensi metadata EXIF lengkap untuk arsip profesional.',
              footer: 'EXPORT PIPELINE →',
            },
          ].map((item) => (
            <div
              key={item.tag}
              className="p-6 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#ff3030]/50 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center text-[#ff3030] group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-400 tracking-wider">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="font-body text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
              <div className="pt-6 font-mono text-xs text-[#ff3030] tracking-wider uppercase font-semibold flex items-center gap-1">
                {item.footer}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 02: ALUR KERJA PRESISI BERBASIS BROWSER */}
      <section id="alur-kerja" className="max-w-7xl mx-auto px-5 sm:px-8 py-14 w-full scroll-mt-24">
        <div className="p-8 md:p-12 rounded-2xl bg-[#0e0e0e] border border-white/10">
          <div className="flex flex-col gap-2 mb-10 text-center items-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff3030] font-semibold">
              02 —— ALUR KERJA PRESISI BERBASIS BROWSER
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
              Dari Berkas Mentah ke Hasil Akhir dalam 4 Detak.
            </h2>
            <p className="font-body text-neutral-400 max-w-xl">
              Tanpa splash screen berat, tanpa proses login yang memakan waktu, dan tanpa lisensi
              berbayar bulanan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              {
                num: '01 //',
                title: 'Drag & Drop Berkas',
                desc: 'Tarik gambar format apapun hingga resolusi 8K. Diterjemahkan instan ke buffer canvas tanpa loading server.',
              },
              {
                num: '02 //',
                title: 'Grading Parametrik',
                desc: 'Sesuaikan kurva RGB, kontras mikro, highlight rolloff, serta penajaman spasial dengan presisi floating point.',
              },
              {
                num: '03 //',
                title: 'Split-View Banding',
                desc: 'Bandingkan perubahan Before vs After dengan slider interaktif untuk memastikan keseimbangan saturasi visual terjaga.',
              },
              {
                num: '04 //',
                title: 'Unduh Seketika',
                desc: 'Pilih format target, set rasio kompresi, lalu unduh secara langsung melalui stream blob lokal browser Anda.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="flex flex-col gap-2 p-5 rounded-xl bg-[#141414] border border-white/10 hover:border-[#ff3030]/40 transition-colors"
              >
                <div className="font-mono text-xl font-bold text-[#ff3030]">{step.num}</div>
                <div className="text-base font-semibold text-white">{step.title}</div>
                <p className="font-body text-neutral-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 03: PREV / NEXT & RELATED PRODUCTS NAVIGATION */}
      <section id="produk-terkait" className="max-w-7xl mx-auto px-5 sm:px-8 pt-6 pb-8 w-full space-y-8 scroll-mt-24">
        {/* Prev / Next Product Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to={`/products/${prevProduct.slug}`}
            className="p-5 rounded-2xl bg-[#14141a]/80 border border-[#242424] hover:border-[#FF3030]/60 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[11px] font-mono text-neutral-400">← PRODUK SEBELUMNYA</span>
              <p className="text-base font-bold text-white group-hover:text-[#FF3030] transition-colors mt-1">
                {prevProduct.number} · {prevProduct.name}
              </p>
            </div>
          </Link>
          <Link
            to={`/products/${nextProduct.slug}`}
            className="p-5 rounded-2xl bg-[#14141a]/80 border border-[#242424] hover:border-[#FF3030]/60 transition-all flex items-center justify-end text-right group"
          >
            <div>
              <span className="text-[11px] font-mono text-neutral-400">PRODUK BERIKUTNYA →</span>
              <p className="text-base font-bold text-white group-hover:text-[#FF3030] transition-colors mt-1">
                {nextProduct.number} · {nextProduct.name}
              </p>
            </div>
          </Link>
        </div>

        {/* Related Products Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Produk Lainnya di Ekosistem Jevallene</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="p-5 rounded-2xl bg-[#0e0e0e] border border-[#242424] hover:border-[#FF3030]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-[#FF3030]">{rel.categoryLabel}</span>
                  <h4 className="text-base font-bold text-white">{rel.name}</h4>
                  <p className="text-xs text-neutral-400 line-clamp-2">{rel.summary}</p>
                </div>
                <Link
                  to={`/products/${rel.slug}`}
                  className="px-4 py-2 rounded-full bg-[#171717] hover:bg-[#FF3030] border border-[#242424] hover:border-[#FF3030] text-xs font-semibold text-white whitespace-nowrap transition-all shrink-0"
                >
                  Lihat Produk →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
