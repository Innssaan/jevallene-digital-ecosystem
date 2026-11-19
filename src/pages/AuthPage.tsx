import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { Button, SurfaceCard } from '../components/ui';

type OAuthProvider = 'google' | 'github';

export function AuthPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);
  const oauthError = searchParams.get('error');

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.authenticated) {
          navigate('/dashboard', { replace: true });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleOAuthLogin = (provider: OAuthProvider) => {
    setLoadingProvider(provider);
    window.location.href = `/api/auth/oauth/${provider}`;
  };

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <SurfaceCard className="p-7 sm:p-9 space-y-7">
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <img
              src="/jevallene-logo.svg"
              alt="JEVALLENE"
              className="w-12 h-12 rounded-full shadow-[0_0_20px_rgba(255,48,48,0.4)]"
            />
          </div>
          <span className="inline-block text-[11px] font-mono px-3 py-1 rounded-full bg-[#FF3030]/10 border border-[#FF3030]/30 text-[#FF3030]">
            OAUTH 2.0 // JEVALLENE ACCESS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('Masuk ke Jevallene', 'Sign in to Jevallene')}
          </h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t(
              'Akses ekosistem Jevallene secara aman melalui autentikasi OAuth backend.',
              'Access the Jevallene ecosystem securely via backend OAuth authentication.',
            )}
          </p>
        </div>

        {oauthError && (
          <p className="text-xs text-center text-[#FF3030] bg-[#FF3030]/10 border border-[#FF3030]/30 rounded-xl px-3 py-2">
            {t(
              'Proses OAuth dibatalkan atau gagal. Silakan coba lagi.',
              'OAuth sign-in was cancelled or failed. Please try again.',
            )}
          </p>
        )}

        <div className="space-y-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full justify-center"
            loading={loadingProvider === 'google'}
            disabled={loadingProvider !== null}
            onClick={() => handleOAuthLogin('google')}
          >
            {loadingProvider !== 'google' && (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.5c-.24 1.25-.96 2.31-2.04 3.02l3.3 2.56c1.92-1.77 3.04-4.38 3.04-7.48 0-.72-.06-1.41-.19-2.08H12Z"
                />
                <path
                  fill="#34A853"
                  d="M12 22c2.7 0 4.96-.9 6.61-2.42l-3.3-2.56c-.91.61-2.07.98-3.31.98-2.54 0-4.7-1.72-5.47-4.03H3.12v2.64A10 10 0 0 0 12 22Z"
                />
                <path
                  fill="#4A90E2"
                  d="M6.53 13.97A5.99 5.99 0 0 1 6.2 12c0-.68.12-1.35.33-1.97V7.39H3.12A10 10 0 0 0 2 12c0 1.61.39 3.14 1.12 4.61l3.41-2.64Z"
                />
                <path
                  fill="#FBBC05"
                  d="M12 6c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 3.01 14.7 2 12 2A10 10 0 0 0 3.12 7.39l3.41 2.64C7.3 7.72 9.46 6 12 6Z"
                />
              </svg>
            )}
            <span>
              {loadingProvider === 'google'
                ? t('Menghubungkan Google...', 'Connecting Google...')
                : t('Lanjutkan dengan Google', 'Continue with Google')}
            </span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full justify-center"
            loading={loadingProvider === 'github'}
            disabled={loadingProvider !== null}
            onClick={() => handleOAuthLogin('github')}
          >
            {loadingProvider !== 'github' && (
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.07.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            )}
            <span>
              {loadingProvider === 'github'
                ? t('Menghubungkan GitHub...', 'Connecting GitHub...')
                : t('Lanjutkan dengan GitHub', 'Continue with GitHub')}
            </span>
          </Button>
        </div>

        <p className="text-[11px] text-center text-neutral-500 pt-2 border-t border-[#242424] leading-relaxed">
          {t(
            'Terhubung ke endpoint backend /api/auth/oauth untuk membuat sesi pengguna.',
            'Connected to backend /api/auth/oauth endpoints to establish your user session.',
          )}
        </p>
      </SurfaceCard>
    </div>
  );
}
