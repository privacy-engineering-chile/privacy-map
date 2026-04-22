import { useEffect, useState } from "react";
import { JURISDICTIONS, Jurisdiction, STATUS_COLOR, STATUS_LABEL } from "@/data/jurisdictions";
import { ISO2_TO_ISO3, isoToFlag } from "@/lib/iso2to3";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MapPin } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

interface Props {
  onSelect: (j: Jurisdiction) => void;
}

const SESSION_KEY = "privacy-atlas-yourcountry-dismissed";

export const YourCountryCard = ({ onSelect }: Props) => {
  const { t } = useT();
  const [country, setCountry] = useState<Jurisdiction | null>(null);
  const [iso2, setIso2] = useState<string>("");
  const [dismissed, setDismissed] = useState<boolean>(() =>
    typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1",
  );

  useEffect(() => {
    if (dismissed) return;
    let cancelled = false;
    fetch("https://ipapi.co/json/")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return;
        const code2 = d.country_code as string | undefined;
        const code3 = d.country_code_iso3 as string | undefined;
        const iso3 = code3 || (code2 ? ISO2_TO_ISO3[code2] : undefined);
        if (!iso3) return;
        const found = JURISDICTIONS.find((j) => j.iso3 === iso3);
        if (found) {
          setCountry(found);
          setIso2(code2 ?? "");
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [dismissed]);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setDismissed(true);
  };

  if (dismissed || !country) return null;

  return (
    <Card className="w-full p-6 shadow-pop border-accent/30 bg-card/95 backdrop-blur animate-fade-up relative">
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        aria-label={t("you.close")}
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent font-bold">
        <MapPin className="h-4 w-4" /> {t("you.location")}
      </div>
      <div className="flex items-center gap-3 mt-3">
        <span className="text-5xl">{isoToFlag(iso2)}</span>
        <div>
          <div className="font-display text-2xl font-bold leading-tight">{country.jurisdiction}</div>
          <div
            className="inline-block text-xs px-2 py-0.5 rounded text-white font-medium mt-1"
            style={{ background: STATUS_COLOR[country.lawStatus] }}
          >
            {STATUS_LABEL[country.lawStatus]}
          </div>
        </div>
      </div>
      {country.keyLawName && (
        <div className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {country.keyLawName} {country.keyLawYear && `· ${country.keyLawYear}`}
        </div>
      )}
      <Button
        size="default"
        className="w-full mt-4"
        onClick={() => onSelect(country)}
      >
        {t("you.viewDetail")}
      </Button>
    </Card>
  );
};
