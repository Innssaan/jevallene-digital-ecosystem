import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type LangCode = 'ID' | 'EN';

interface LangContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (idText: string, enText: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: 'ID',
  setLang: () => {},
  t: (idText) => idText,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    try {
      const saved = localStorage.getItem('jevallene_lang');
      return saved === 'EN' ? 'EN' : 'ID';
    } catch {
      return 'ID';
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang === 'EN' ? 'en' : 'id';
    try {
      localStorage.setItem('jevallene_lang', lang);
    } catch {
      // ignore storage errors
    }
  }, [lang]);

  const setLang = useCallback((next: LangCode) => {
    setLangState(next);
  }, []);

  const t = useCallback(
    (idText: string, enText: string) => (lang === 'EN' ? enText : idText),
    [lang],
  );

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
