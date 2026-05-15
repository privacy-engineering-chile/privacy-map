import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useT } from "@/i18n/LanguageContext";

export const PrivacyBadge = () => {
  const { t } = useT();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full border border-status-comprehensive/40 bg-status-comprehensive/10 text-status-comprehensive text-[11px] font-semibold uppercase tracking-wider hover:bg-status-comprehensive/15 transition-colors"
          aria-label={t("privacy.short")}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("privacy.short")}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 text-xs leading-relaxed space-y-2">
        <p>{t("privacy.long")}</p>
        <Link
          to="/cookies"
          className="inline-block font-semibold text-accent hover:underline"
        >
          {t("privacy.viewCookies")}
        </Link>
      </PopoverContent>
    </Popover>
  );
};

