import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SurfaceCard } from '../components/ui';

const CORE_VALUES = [
  {
    title: 'Clarity & Precision',
    desc: 'Mengutamakan antarmuka yang bersih, terstruktur, dan mudah dipahami oleh pengguna.',
  },
  {
    title: 'Accessible Technology',
    desc: 'Menghadirkan tools kreatif yang dapat langsung diakses melalui browser tanpa hambatan.',
  },
  {
    title: 'Continuous Craft',
    desc: 'Terus menyempurnakan kualitas produk, performa, dan pengalaman desain dari waktu ke waktu.',
  },
];

const JOURNEY = [
  {
    phase: 'Phase 01',
    title: 'Inisiasi Produk Web Mandiri',
    desc: 'Peluncuran tools kreatif berbasis browser: Photo Editor, Converter, dan PhotoStudio.',
  },
  {
    phase: 'Phase 02',
    title: 'Ekosistem Terpadu & Layanan Studio',
    desc: 'Menyatukan produk digital, layanan pengembangan web/aplikasi, UI/UX design, dan solusi bisnis.',
  },
  {
    phase: 'Phase 03',
    title: 'Platform Akun & Kolaborasi',
    desc: 'Pengembangan sistem akun, dashboard pengguna, dan integrasi workspace terpusat.',
  },
];

export function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-16 space-y-20">
      {/* Brand Story */}
      <section className="space-y-5 max-w-3xl animate-fade-up">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#242424] text-xs font-mono text-[#FF3030]">
          ABOUT JEVALLENE
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Ekosistem Produk Digital &amp; Creative Technology dari Indonesia.
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
          JEVALLENE lahir sebagai parent brand yang memadukan pengembangan produk digital mandiri
          dengan layanan teknologi dan desain kreatif untuk membantu individu, kreator, UMKM, dan
          organisasi berkembang di era digital.
        </p>
      </section>

      {/* Vision & Mission */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SurfaceCard className="p-8 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">Vision</span>
          <h2 className="text-2xl font-bold text-white">
            Menjadikan teknologi kreatif dan tools digital yang elegan mudah diakses oleh siapa saja.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Membangun ekosistem teknologi lokal dengan standar desain dan keandalan global.
          </p>
        </SurfaceCard>
        <SurfaceCard className="p-8 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">Mission</span>
          <h2 className="text-2xl font-bold text-white">
            Menghadirkan tools produktivitas gratis dan layanan digital berkualitas tinggi.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Mendukung produktivitas harian kreator sekaligus membantu bisnis membangun fondasi
            digital yang kuat.
          </p>
        </SurfaceCard>
      </section>

      {/* Core Values */}
      <section className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">Core Values</p>
          <h2 className="text-3xl font-bold text-white">Prinsip yang Membentuk Setiap Karya</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CORE_VALUES.map((v) => (
            <SurfaceCard key={v.title} className="p-6 space-y-2.5">
              <h3 className="text-xl font-bold text-white">{v.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{v.desc}</p>
            </SurfaceCard>
          ))}
        </div>
      </section>

      {/* Brand Journey */}
      <section className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">Brand Journey</p>
          <h2 className="text-3xl font-bold text-white">Peta Perjalanan Ekosistem</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {JOURNEY.map((j) => (
            <SurfaceCard key={j.phase} className="p-6 space-y-2.5">
              <span className="text-xs font-mono text-[#FF3030]">{j.phase}</span>
              <h3 className="text-lg font-bold text-white">{j.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{j.desc}</p>
            </SurfaceCard>
          ))}
        </div>
      </section>

      {/* Team Section Placeholder */}
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">Team</p>
          <h2 className="text-3xl font-bold text-white">Struktur Tim &amp; Kontributor</h2>
          <p className="text-sm text-neutral-400">
            Profil lengkap anggota tim akan ditampilkan pada pembaruan berikutnya.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {['Product & Design Architecture', 'Creative Technology Engineering', 'Digital Strategy & Operations'].map(
            (role) => (
              <SurfaceCard key={role} className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#090909] border border-[#242424] flex items-center justify-center text-[#FF3030] font-mono text-xs">
                  JV
                </div>
                <h3 className="text-base font-bold text-white">{role}</h3>
                <p className="text-xs text-neutral-500 font-mono">Team Profile Placeholder</p>
              </SurfaceCard>
            ),
          )}
        </div>
      </section>

      <div className="pt-2 flex flex-wrap items-center gap-4">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#FF3030] to-[#ae0f20] hover:from-[#D41414] hover:to-[#FF3030] hover:shadow-[0_0_40px_rgba(255,48,48,0.5)] text-white font-semibold text-sm transition-all"
        >
          <span>Terhubung dengan Jevallene</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
        <a
          href="https://innssaan.my.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#14141a]/55 backdrop-blur-md hover:bg-white/[0.05] text-[#fafafa] border border-white/[0.12] hover:border-[#FF3030]/50 shadow-[inset_0_1px_rgba(255,255,255,0.12),0_4px_14px_rgba(0,0,0,0.28)] font-semibold text-sm transition-all"
        >
          <span>About Innssaan (innssaan.my.id)</span>
          <ArrowUpRight className="w-4 h-4 text-[#FF3030]" />
        </a>
      </div>
    </div>
  );
}
