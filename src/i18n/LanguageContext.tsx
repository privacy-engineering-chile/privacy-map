import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { dict, Lang, tFormat } from "./dictionary";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "pa.lang";

const detect = (): Lang => {
  if (typeof window === "undefined") return "es";
  const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (stored === "es" || stored === "en") return stored;
  const nav = navigator.language?.toLowerCase() ?? "";
  return nav.startsWith("en") ? "en" : "es";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(detect);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  };

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => {
        const entry = dict[key];
        if (!entry) return key;
        return tFormat(entry[lang], vars);
      },
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useT = (): Ctx => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT must be used within LanguageProvider");
  return ctx;
};
