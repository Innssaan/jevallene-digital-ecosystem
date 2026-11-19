import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { SOLUTIONS } from '../data/ecosystem';
import { SurfaceCard } from '../components/ui';

export function SolutionsPage() {
  const { t } = useLang();
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-16 space-y-16">
      <section className="space-y-5 max-w-3xl animate-fade-up">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#242424] text-xs font-mono text-[#FF3030]">
          JEVALLENE SOLUTIONS
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          {t('Solusi Digital yang Relevan untuk Setiap Skala.', 'Relevant Digital Solutions for Every Scale.')}
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
          {t(
            'Dari pengguna individu hingga organisasi, ekosistem Jevallene menggabungkan tools gratis dan layanan profesional sesuai kebutuhan Anda.',
            'From individuals to organizations, the Jevallene ecosystem combines free tools and professional services tailored to your needs.',
          )}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SOLUTIONS.map((sol) => (
          <SurfaceCard key={sol.id} className="p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-mono text-[#FF3030] uppercase tracking-wider">
                {sol.subtitle}
              </p>
              <h2 className="text-2xl font-bold text-white">{sol.title}</h2>
              <p className="text-sm text-neutral-400 leading-relaxed">{sol.description}</p>
            </div>
            <div className="space-y-4 pt-4 border-t border-[#242424]">
              <ul className="space-y-2">
                {sol.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-xs text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-[#FF3030] shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#FF3030] transition-colors"
              >
                <span>Diskusikan Kebutuhan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </SurfaceCard>
        ))}
      </section>
    </div>
  );
}
