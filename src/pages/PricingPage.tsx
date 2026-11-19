import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { SurfaceCard } from '../components/ui';

const TIERS = [
  {
    name: 'Free',
    badge: 'Tersedia Sekarang',
    priceLabel: 'Gratis',
    description: 'Akses langsung ke tools digital publik Jevallene di peramban.',
    features: [
      'Akses Jevallene Photo Editor',
      'Akses Jevallene Converter',
      'Akses Jevallene PhotoStudio',
      'Tanpa instalasi aplikasi tambahan',
    ],
    ctaLabel: 'Jelajahi Produk',
    ctaTo: '/products',
    highlighted: false,
  },
  {
    name: 'Premium',
    badge: 'Segera Hadir',
    priceLabel: 'Segera Hadir',
    description: 'Paket fitur lanjutan untuk kreator dan freelancer pada fase berikutnya.',
    features: [
      'Workspace tersinkronisasi (Next Phase)',
      'Manajemen proyek & preset tersimpan',
      'Dukungan prioritas untuk kreator',
    ],
    ctaLabel: 'Segera Hadir',
    ctaTo: '/contact',
    highlighted: true,
  },
  {
    name: 'Business',
    badge: 'Segera Hadir',
    priceLabel: 'Segera Hadir',
    description: 'Kolaborasi tim dan integrasi ekosistem untuk bisnis dan organisasi.',
    features: [
      'Manajemen anggota tim (Next Phase)',
      'Alur kerja kolaboratif terpusat',
      'Dukungan teknis terdedikasi',
    ],
    ctaLabel: 'Hubungi Tim',
    ctaTo: '/contact',
    highlighted: false,
  },
];

export function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-16 space-y-16">
      <section className="space-y-5 max-w-3xl animate-fade-up">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#242424] text-xs font-mono text-[#FF3030]">
          PRICING &amp; QUOTATION
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Struktur Paket &amp; Layanan Kustom.
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
          Tools web Jevallene saat ini dapat diakses secara gratis. Paket berlangganan lanjutan
          akan dirilis pada fase berikutnya, sementara layanan profesional tersedia melalui Request
          Quotation.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => (
          <SurfaceCard
            key={tier.name}
            className={`p-7 flex flex-col justify-between space-y-6 ${
              tier.highlighted ? 'border-[#FF3030]/60 red-glow-subtle' : ''
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{tier.name}</h2>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#090909] border border-[#242424] text-[#FF3030]">
                  {tier.badge}
                </span>
              </div>
              <div className="text-3xl font-bold text-white font-display">{tier.priceLabel}</div>
              <p className="text-sm text-neutral-400 leading-relaxed">{tier.description}</p>
              <ul className="space-y-2.5 pt-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300">
                    <Check className="w-4 h-4 text-[#FF3030] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to={tier.ctaTo}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                tier.highlighted
                  ? 'bg-[#FF3030] hover:bg-[#D41414] hover:shadow-[0_0_26px_rgba(255,48,48,0.55)] text-white'
                  : 'bg-[#090909] hover:bg-[#242424] border border-[#242424] hover:border-[#FF3030]/50 hover:shadow-[0_0_20px_rgba(255,48,48,0.28)] text-white'
              }`}
            >
              <span>{tier.ctaLabel}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </SurfaceCard>
        ))}
      </section>

      {/* Professional Services Request Quotation */}
      <section className="primary-gradient rounded-3xl p-8 sm:p-12 border border-[#FF3030]/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-white/80">
            Professional Services
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">Request Quotation</h2>
          <p className="text-sm text-white/85">
            Untuk Website Development, Mobile App, UI/UX Design, Custom Software, dan Digital
            Services, penawaran disusun sesuai ruang lingkup proyek Anda.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#090909] font-bold text-sm hover:bg-[#F5F5F5] transition-all shrink-0 self-start md:self-auto"
        >
          <span>Request Quotation</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
