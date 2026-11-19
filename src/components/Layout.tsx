import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, ArrowUp, ChevronDown } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { RocketLaunchOverlay } from './RocketLaunchOverlay';

const PRIMARY_LINKS = [
  { to: '/', idLabel: 'Beranda', enLabel: 'Home' },
  { to: '/products', idLabel: 'Produk', enLabel: 'Products' },
] as const;

const STUDIO_DROPDOWN = [
  { to: '/about', idLabel: 'Tentang Kami', enLabel: 'About Us' },
  { to: '/blog', idLabel: 'Blog & Journal', enLabel: 'Blog & Journal' },
  { to: '/pricing', idLabel: 'Pricing', enLabel: 'Pricing' },
] as const;

const SERVICES_DROPDOWN = [
  { to: '/services', idLabel: 'Semua Layanan', enLabel: 'All Services' },
  { to: '/solutions', idLabel: 'Solusi Industri', enLabel: 'Solutions' },
] as const;

export function Layout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [rocketLaunching, setRocketLaunching] = useState(false);
  const [showFloatingRocket, setShowFloatingRocket] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setShowFloatingRocket(window.scrollY > 240);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBackToTop = useCallback(() => {
    if (rocketLaunching) return;
    setRocketLaunching(true);
  }, [rocketLaunching]);

  const handleLaunchMidpoint = useCallback(() => {
    navigate('/');
    setRefreshKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [navigate]);

  const handleLaunchComplete = useCallback(() => {
    setRocketLaunching(false);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let active = true;
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (active) setApiOnline(res.ok);
      } catch {
        if (active) setApiOnline(false);
      }
    };
    checkHealth();
    const id = setInterval(checkHealth, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/products') {
      return (
        location.pathname.startsWith('/products') ||
        location.pathname.startsWith('/katalog') ||
        location.pathname.startsWith('/produk')
      );
    }
    return location.pathname.startsWith(path);
  };

  const navPillClass = (active: boolean) =>
    `px-3.5 py-1.5 text-[13px] font-medium rounded-full tracking-wide flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
      active
        ? 'text-white bg-[#171717] border border-[#FF3030]/60 shadow-[0_0_16px_rgba(255,48,48,0.28)] hover:shadow-[0_0_24px_rgba(255,48,48,0.45)]'
        : 'text-[#F5F5F5]/75 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-[#FF3030]/35 hover:shadow-[0_0_18px_rgba(255,48,48,0.25)]'
    }`;

  return (
    <div className="min-h-screen bg-[#090909] text-[#F5F5F5] antialiased relative flex flex-col">
      {/* Ambient Red-to-Black Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 grid-matrix-bg opacity-40" />
        <div className="absolute -top-40 left-1/4 w-[680px] h-[580px] bg-[#FF3030]/16 blur-[180px] rounded-full animate-pulse-slow" />
        <div
          className="absolute top-[35%] -right-28 w-[560px] h-[520px] bg-[#850909]/20 blur-[180px] rounded-full animate-pulse-slow"
          style={{ animationDelay: '2.5s' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,9,0.8)_90%)]" />
      </div>

      {/* ALWAYS-STICKY FLOATING NAVBAR */}
      <header className="sticky top-3 z-50 w-full px-4 sm:px-6 lg:px-8 mt-3 mb-2 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-center">
          <nav
            aria-label="Primary Navigation"
            className="pointer-events-auto w-full lg:w-auto flex items-center justify-between gap-2 lg:gap-3 px-3.5 sm:px-4 py-2 rounded-full bg-[#090909]/90 backdrop-blur-2xl border border-[#242424] shadow-[0_16px_44px_rgba(0,0,0,0.9)] hover:border-[#FF3030]/40 transition-all"
          >
            {/* Brand Wordmark */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0 pr-1 group focus-visible:outline-2 focus-visible:outline-[#FF3030] rounded-full"
            >
              <img
                src="/jevallene-logo.svg"
                alt="JEVALLENE Logo"
                className="w-8 h-8 rounded-full shadow-[0_0_12px_rgba(255,48,48,0.35)] group-hover:scale-105 transition-transform"
              />
              <span className="font-display font-bold tracking-[0.14em] text-sm text-white">
                JEVALLENE
              </span>
            </Link>

            {/* Desktop Nav Links (4 clean tabs) */}
            <div className="hidden lg:flex items-center gap-1">
              {PRIMARY_LINKS.map((item) => {
                const active = isActivePath(item.to);
                return (
                  <Link key={item.to} to={item.to} className={navPillClass(active)}>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#FF3030]" />}
                    <span>{lang === 'ID' ? item.idLabel : item.enLabel}</span>
                  </Link>
                );
              })}

              {/* Layanan & Solusi grouped tab */}
              <div className="relative group">
                <Link
                  to="/services"
                  className={navPillClass(
                    isActivePath('/services') || isActivePath('/solutions'),
                  )}
                >
                  {(isActivePath('/services') || isActivePath('/solutions')) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3030]" />
                  )}
                  <span>{t('Layanan', 'Services')}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
                </Link>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute left-0 top-full pt-2 w-44">
                  <div className="rounded-2xl bg-[#0B0B0E]/95 backdrop-blur-xl border border-[#242424] p-1.5 shadow-2xl space-y-1">
                    {SERVICES_DROPDOWN.map((sub) => (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        className={`block px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isActivePath(sub.to)
                            ? 'bg-[#FF3030]/15 text-white'
                            : 'text-neutral-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        {lang === 'ID' ? sub.idLabel : sub.enLabel}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Studio (About, Blog, Pricing) grouped tab */}
              <div className="relative group">
                <Link
                  to="/about"
                  className={navPillClass(
                    isActivePath('/about') || isActivePath('/blog') || isActivePath('/pricing'),
                  )}
                >
                  {(isActivePath('/about') || isActivePath('/blog') || isActivePath('/pricing')) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3030]" />
                  )}
                  <span>Studio</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
                </Link>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute left-0 top-full pt-2 w-44">
                  <div className="rounded-2xl bg-[#0B0B0E]/95 backdrop-blur-xl border border-[#242424] p-1.5 shadow-2xl space-y-1">
                    {STUDIO_DROPDOWN.map((sub) => (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        className={`block px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isActivePath(sub.to)
                            ? 'bg-[#FF3030]/15 text-white'
                            : 'text-neutral-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        {lang === 'ID' ? sub.idLabel : sub.enLabel}
                      </Link>
                    ))}
                    <a
                      href="https://innssaan.my.id/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-[#FF3030] hover:bg-[#FF3030]/15 hover:text-white transition-colors border-t border-[#242424] mt-1 pt-2"
                    >
                      {t('Tentang Innssaan ↗', 'About Innssaan ↗')}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Controls: Language, Login, Get Started */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#242424]">
              <div className="flex items-center gap-0.5 bg-[#171717] p-0.5 rounded-full border border-[#242424]">
                {(['ID', 'EN'] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                      lang === code
                        ? 'bg-[#FF3030] text-white font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>

              <Link
                to="/login"
                className={navPillClass(location.pathname === '/login' || location.pathname === '/register')}
              >
                {t('Masuk', 'Login')}
              </Link>

              <Link
                to="/contact"
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  location.pathname === '/contact'
                    ? 'bg-[#171717] text-white border border-[#FF3030] shadow-[0_0_28px_rgba(255,48,48,0.35)] hover:shadow-[0_0_40px_rgba(255,48,48,0.5)]'
                    : 'bg-gradient-to-r from-[#FF3030] to-[#ae0f20] hover:from-[#D41414] hover:to-[#FF3030] text-[#f5f5f7] border border-[#FF3030] shadow-[0_0_28px_rgba(255,48,48,0.35)] hover:shadow-[0_0_40px_rgba(255,48,48,0.5)]'
                }`}
              >
                <span>{t('Mulai', 'Get Started')}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="flex items-center gap-0.5 bg-[#171717] p-0.5 rounded-full border border-[#242424]">
                {(['ID', 'EN'] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    className={`text-[10px] font-mono px-2 py-1 rounded-full transition-all cursor-pointer ${
                      lang === code ? 'bg-[#FF3030] text-white font-bold' : 'text-neutral-400'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                aria-expanded={mobileOpen}
                className="p-2 rounded-full bg-[#171717] border border-[#242424] text-white hover:border-[#FF3030]/60 transition-colors cursor-pointer"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileOpen && (
          <div className="lg:hidden pointer-events-auto max-w-7xl mx-auto mt-2 rounded-2xl bg-[#090909]/95 backdrop-blur-2xl border border-[#242424] p-3.5 shadow-2xl space-y-2.5 animate-fade-up max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {[...PRIMARY_LINKS, ...SERVICES_DROPDOWN, ...STUDIO_DROPDOWN].map((item) => {
                const active = isActivePath(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`min-w-0 px-3 py-2 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all ${
                      active
                        ? 'text-white bg-[#171717] border border-[#FF3030]/60'
                        : 'text-[#F5F5F5]/80 hover:text-white bg-[#171717]/40 border border-[#242424]'
                    }`}
                  >
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#FF3030] shrink-0" />}
                    <span className="truncate">{lang === 'ID' ? item.idLabel : item.enLabel}</span>
                  </Link>
                );
              })}
              <Link
                to="/dashboard"
                className={`min-w-0 px-3 py-2 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all ${
                  location.pathname === '/dashboard'
                    ? 'text-white bg-[#171717] border border-[#FF3030]/60'
                    : 'text-[#F5F5F5]/80 hover:text-white bg-[#171717]/40 border border-[#242424]'
                }`}
              >
                <span className="truncate">Dashboard</span>
              </Link>
              <a
                href="https://innssaan.my.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 px-3 py-2 text-xs font-medium rounded-xl flex items-center gap-1.5 text-[#FF3030] bg-[#171717]/40 border border-[#242424] hover:border-[#FF3030]/50 transition-all"
              >
                <span className="truncate">{t('Tentang Innssaan ↗', 'About Innssaan ↗')}</span>
              </a>
            </div>
            <div className="pt-2 border-t border-[#242424] flex items-center gap-2">
              <Link
                to="/login"
                className="flex-1 text-center py-2.5 rounded-full bg-[#171717] border border-[#242424] hover:border-[#FF3030]/50 hover:shadow-[0_0_18px_rgba(255,48,48,0.28)] text-xs font-medium text-white transition-all"
              >
                {t('Masuk', 'Login')}
              </Link>
              <Link
                to="/contact"
                className="flex-1 text-center py-2.5 rounded-full bg-[#FF3030] hover:bg-[#D41414] hover:shadow-[0_0_24px_rgba(255,48,48,0.5)] text-xs font-semibold text-white transition-all"
              >
                {t('Mulai ↗', 'Get Started ↗')}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* PAGE CONTENT */}
      <main key={refreshKey} className="flex-1 relative z-10">
        {children}
      </main>

      {/* 7-COLUMN FOOTER */}
      <footer className="w-full border-t border-white/[0.08] bg-[#090909] pt-12 pb-10 mt-20 relative z-10 overflow-hidden">
        {/* Subtle crimson shooting star accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-24 bottom-20 w-24 h-[1px] rotate-[-38deg] bg-gradient-to-r from-[#FF3030] to-transparent opacity-60"
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {/* Top Tagline Bar */}
          <div className="pb-8 mb-10 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-neutral-400 leading-relaxed">
              <span className="text-white font-semibold">JEVALLENE</span> —{' '}
              {t(
                'Creative Technology & Digital Product Ecosystem. Rekayasa produk web, UI/UX design system, serta pengembangan aplikasi berstandar studio.',
                'Creative Technology & Digital Product Ecosystem. Engineering web products, UI/UX design systems, and studio-grade digital applications.',
              )}
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#171717] border border-[#242424] text-[10px] font-mono shrink-0 self-start sm:self-auto">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  apiOnline === false ? 'bg-[#FF3030]' : 'bg-[#4ae176]'
                }`}
              />
              <span className="text-neutral-300">
                {apiOnline === false ? 'API OFFLINE' : 'API OPERATIONAL'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-8 pb-12 border-b border-white/[0.08]">
            {/* 1. Brand */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 space-y-3">
              <Link to="/" className="inline-flex items-center gap-2">
                <img src="/jevallene-logo.svg" alt="JEVALLENE" className="w-6 h-6 rounded-full" />
                <span className="font-display font-bold tracking-wider text-white text-sm">
                  JEVALLENE
                </span>
              </Link>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {t(
                  'Ekosistem produk digital & creative technology asal Indonesia.',
                  'Digital product & creative technology ecosystem from Indonesia.',
                )}
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#171717] border border-[#242424] text-[10px] font-mono">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    apiOnline === false ? 'bg-[#FF3030]' : 'bg-[#4ae176]'
                  }`}
                />
                <span className="text-neutral-300">
                  {apiOnline === false ? 'API OFFLINE' : 'API OPERATIONAL'}
                </span>
              </div>
            </div>

            {/* 2. Products */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Products</h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <Link to="/products/photo-editor" className="hover:text-[#FF3030] transition-colors">
                    Photo Editor
                  </Link>
                </li>
                <li>
                  <Link to="/products/converter" className="hover:text-[#FF3030] transition-colors">
                    Converter
                  </Link>
                </li>
                <li>
                  <Link to="/products/photostudio" className="hover:text-[#FF3030] transition-colors">
                    PhotoStudio
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-[#FF3030] transition-colors">
                    All Products
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3. Services */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Services</h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <Link to="/services" className="hover:text-[#FF3030] transition-colors">
                    Website Development
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-[#FF3030] transition-colors">
                    Mobile App
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-[#FF3030] transition-colors">
                    UI/UX Design
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-[#FF3030] transition-colors">
                    Digital Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* 4. Company */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Company</h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <Link to="/about" className="hover:text-[#FF3030] transition-colors">
                    About Jevallene
                  </Link>
                </li>
                <li>
                  <a
                    href="https://innssaan.my.id/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF3030] transition-colors"
                  >
                    About Innssaan ↗
                  </a>
                </li>
                <li>
                  <Link to="/solutions" className="hover:text-[#FF3030] transition-colors">
                    Solutions
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-[#FF3030] transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#FF3030] transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* 5. Resources */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Resources</h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <Link to="/blog" className="hover:text-[#FF3030] transition-colors">
                    Blog &amp; Editorial
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-[#FF3030] transition-colors">
                    User Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#FF3030] transition-colors">
                    Account Access
                  </Link>
                </li>
              </ul>
            </div>

            {/* 6. Legal */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Legal</h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <Link to="/about" className="hover:text-[#FF3030] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#FF3030] transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* 7. Social Media */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                Social Media
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF3030] transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF3030] transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF3030] transition-colors"
                  >
                    TikTok
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF3030] transition-colors"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Collaboration Prompt Line */}
          <div className="py-6 border-b border-white/[0.08] text-xs text-neutral-400">
            {t(
              'Tertarik mendiskusikan proyek atau peluang kolaborasi? ',
              'Interested in discussing a project or collaboration opportunity? ',
            )}
            <Link
              to="/contact"
              className="text-[#FF3030] hover:underline font-medium transition-colors"
            >
              {t('Kirimkan detail kebutuhan melalui formulir kontak.', 'Send your project details via the contact form.')}
            </Link>
          </div>

          {/* Bottom Copyright & Back-to-Top Bar */}
          <div className="pt-7 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
              <span>
                © {new Date().getFullYear()} Jevallene by Innssaan.{' '}
                {t('Seluruh hak cipta dilindungi.', 'All rights reserved.')}
              </span>
              <div className="flex items-center gap-3 text-neutral-400">
                <Link to="/about" className="hover:text-white transition-colors">
                  {t('Tentang', 'About')}
                </Link>
                <span className="text-neutral-700">|</span>
                <Link to="/products" className="hover:text-white transition-colors">
                  {t('Produk', 'Products')}
                </Link>
                <span className="text-neutral-700">|</span>
                <Link to="/services" className="hover:text-white transition-colors">
                  {t('Layanan', 'Services')}
                </Link>
                <span className="text-neutral-700">|</span>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {t('Kontak', 'Contact')}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-neutral-400">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.07.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-[#FF3030] transition-colors"
                >
                  <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16Z" />
                  </svg>
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                  className="hover:text-[#FF3030] transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
                  </svg>
                </a>
              </div>

              <span className="text-neutral-400 hidden sm:inline">Indonesia</span>

              <button
                type="button"
                onClick={handleBackToTop}
                className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#14141a]/80 border border-white/[0.12] hover:border-[#FF3030]/60 text-xs font-medium text-neutral-200 hover:text-white transition-all cursor-pointer"
              >
                <Rocket
                  className={`w-3.5 h-3.5 text-[#FF3030] transition-transform duration-300 ${
                    rocketLaunching ? 'animate-rocket-launch' : 'animate-rocket-idle'
                  }`}
                />
                <span>{t('Kembali ke atas', 'Back to top')}</span>
                <ArrowUp className="w-3 h-3 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* CINEMATIC ROCKET LAUNCH OVERLAY */}
      <RocketLaunchOverlay
        active={rocketLaunching}
        onMidpoint={handleLaunchMidpoint}
        onComplete={handleLaunchComplete}
      />

      {/* FLOATING ROCKET BACK-TO-TOP BUTTON */}
      {showFloatingRocket && !rocketLaunching && (
        <button
          type="button"
          onClick={handleBackToTop}
          aria-label={t('Luncurkan roket kembali ke atas', 'Launch rocket back to top')}
          title={t('Kembali ke atas', 'Back to top')}
          className="animate-rocket-btn-in group fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[90] flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#FF3030]/60 bg-[#0B0B0F]/90 text-white shadow-[0_0_28px_rgba(255,48,48,0.45)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-[#FF7A59] hover:bg-[#FF3030] hover:shadow-[0_0_40px_rgba(255,48,48,0.7)] active:scale-95"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border border-[#FF3030]/40 animate-ping opacity-30"
          />
          <Rocket className="animate-rocket-idle w-5 h-5 relative z-10 text-[#FF3030] transition-colors duration-200 group-hover:text-white" />
          <span
            aria-hidden="true"
            className="animate-exhaust pointer-events-none absolute bottom-1 w-1.5 h-3 rounded-full bg-gradient-to-b from-[#FF7A59] to-transparent blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        </button>
      )}
    </div>
  );
}
