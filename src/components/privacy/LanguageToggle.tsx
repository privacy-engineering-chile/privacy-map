import { useT } from "@/i18n/LanguageContext";
import { Languages } from "lucide-react";

export const LanguageToggle = () => {
  const { lang, setLang, t } = useT();
  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card h-10 px-1.5"
    >
      <Languages className="h-3.5 w-3.5 text-muted-foreground ml-1" />
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full transition-colors ${
            lang === l
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
};
