import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { SERVICES, WORKFLOW_STEPS } from '../data/ecosystem';
import { Accordion, SurfaceCard } from '../components/ui';

const SERVICE_FAQS = [
  {
    question: 'Bagaimana proses awal memulai proyek bersama Jevallene?',
    answer:
      'Anda dapat mengirimkan ringkasan kebutuhan melalui halaman Contact. Tim kami akan menjadwalkan sesi Discovery untuk memahami tujuan dan ruang lingkup proyek.',
  },
  {
    question: 'Apakah layanan tersedia untuk UMKM maupun perusahaan?',
    answer:
      'Ya. Ruang lingkup dan arsitektur dapat disesuaikan mulai dari landing page bisnis, sistem desain, hingga pengembangan perangkat lunak kustom.',
  },
  {
    question: 'Bagaimana sistem penawaran harga untuk layanan profesional?',
    answer:
      'Setiap proyek layanan dihitung berdasarkan kebutuhan dan kompleksitas melalui mekanisme Request Quotation setelah tahap Discovery.',
  },
];

export function ServicesPage() {
  const { t } = useLang();
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-16 space-y-20">
      {/* Hero */}
      <section className="space-y-5 max-w-3xl animate-fade-up">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#242424] text-xs font-mono text-[#FF3030]">
          JEVALLENE SERVICES
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          {t('Layanan Teknologi & Kreatif Terintegrasi.', 'Integrated Technology & Creative Services.')}
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
          {t(
            'Dari perancangan antarmuka hingga pengembangan aplikasi produksi, kami membantu ide dan bisnis tampil lebih kuat di ekosistem digital.',
            'From interface design to production app development, we help ideas and businesses stand out in the digital ecosystem.',
          )}
        </p>
      </section>

      {/* Services Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SERVICES.map((service) => (
          <SurfaceCard key={service.id} className="p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF3030]/10 text-[#FF3030] border border-[#FF3030]/25">
                {service.category}
              </span>
              <h2 className="text-xl font-bold text-white">{service.title}</h2>
              <p className="text-sm text-neutral-400 leading-relaxed">{service.description}</p>
            </div>
            <ul className="space-y-1.5 pt-3 border-t border-[#242424]">
              {service.deliverables.map((d) => (
                <li key={d} className="flex items-center gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3030] shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </SurfaceCard>
        ))}
      </section>

      {/* Workflow */}
      <section className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">Workflow</p>
          <h2 className="text-3xl font-bold text-white">
            Discovery → Planning → Design → Development → Delivery
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {WORKFLOW_STEPS.map((w) => (
            <SurfaceCard key={w.step} className="p-5 space-y-2.5">
              <span className="font-mono text-xs font-bold text-[#FF3030]">{w.step}</span>
              <h3 className="text-lg font-bold text-white">{w.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{w.desc}</p>
            </SurfaceCard>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4 space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-[#FF3030]">FAQ</p>
          <h2 className="text-3xl font-bold text-white">Pertanyaan Umum Layanan</h2>
          <p className="text-sm text-neutral-400">
            Informasi ringkas seputar kolaborasi dan alur pengerjaan proyek di Jevallene.
          </p>
        </div>
        <div className="lg:col-span-8">
          <Accordion items={SERVICE_FAQS} />
        </div>
      </section>

      {/* CTA Consultation */}
      <section className="primary-gradient rounded-3xl p-8 sm:p-12 border border-[#FF3030]/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl sm:text-4xl font-bold text-white">
            Siap Mengonsultasikan Proyek Anda?
          </h2>
          <p className="text-sm text-white/85">
            Ajukan diskusi atau Request Quotation melalui formulir kontak resmi kami.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#090909] font-bold text-sm hover:bg-[#F5F5F5] hover:shadow-[0_0_28px_rgba(255,255,255,0.45)] hover:-translate-y-0.5 transition-all shrink-0 self-start md:self-auto"
        >
          <span>{t('Konsultasi Sekarang', 'Consult Now')}</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
