import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { SERVICES } from '../data/ecosystem';
import { Button, InputField, SelectField, SurfaceCard } from '../components/ui';

export function ContactPage() {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceCategory, setServiceCategory] = useState(SERVICES[0].title);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          projectType: serviceCategory,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: 'error', text: data.error || 'Gagal mengirim pesan.' });
      } else {
        setStatus({
          type: 'success',
          text: data.message || 'Pesan Anda berhasil dikirim. Tim Jevallene akan segera merespons.',
        });
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch {
      setStatus({ type: 'error', text: 'Tidak dapat terhubung ke server backend.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 pb-16 space-y-12">
      <section className="space-y-4 max-w-2xl animate-fade-up">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#242424] text-xs font-mono text-[#FF3030]">
          CONTACT &amp; COLLABORATION
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          {t('Mulai Bersama Jevallene.', 'Start Building with Jevallene.')}
        </h1>
        <p className="text-base text-neutral-300 leading-relaxed">
          {t(
            'Kirimkan detail kebutuhan proyek, permintaan quotation, atau pertanyaan seputar produk digital kami melalui formulir di bawah ini.',
            'Send your project details, quotation request, or questions about our digital products using the form below.',
          )}
        </p>
      </section>

      <SurfaceCard className="p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              id="contact-name"
              label="Nama"
              required
              placeholder="Nama lengkap atau organisasi"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              id="contact-email"
              label="Email"
              type="email"
              required
              placeholder="nama@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <SelectField
            id="contact-service"
            label="Kategori Layanan"
            value={serviceCategory}
            onChange={(e) => setServiceCategory(e.target.value)}
            options={[
              ...SERVICES.map((s) => ({ value: s.title, label: s.title })),
              { value: 'Product Inquiry', label: 'Pertanyaan Produk Digital' },
            ]}
          />

          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="block text-xs font-medium text-[#F5F5F5]/80">
              Pesan
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              placeholder="Ceritakan kebutuhan atau tujuan proyek Anda..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#090909] border border-[#242424] hover:border-white/20 focus:border-[#FF3030] focus:outline-none focus:ring-1 focus:ring-[#FF3030] text-sm text-white placeholder:text-neutral-500 transition-colors"
            />
          </div>

          {status && (
            <div
              role="status"
              className={`flex items-start gap-2.5 p-4 rounded-xl border text-sm ${
                status.type === 'success'
                  ? 'bg-[#4ae176]/10 border-[#4ae176]/40 text-[#4ae176]'
                  : 'bg-[#FF3030]/10 border-[#FF3030]/40 text-[#FF3030]'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{status.text}</span>
            </div>
          )}

          <Button type="submit" size="lg" loading={loading}>
            {loading ? 'Mengirim Pesan...' : 'Kirim Pesan'}
          </Button>
        </form>
      </SurfaceCard>
    </div>
  );
}
