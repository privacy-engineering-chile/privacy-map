import { useEffect, useState } from "react";
import { Jurisdiction, LawStatus, STATUS_COLOR, STATUS_LABEL } from "@/data/jurisdictions";
import { KPI_SUMMARY, KpiSummaryEntry } from "@/data/kpiSummary";
import { ISO2_TO_ISO3, isoToFlag } from "@/lib/iso2to3";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MapPin } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

interface Props {
  onSelect: (j: Jurisdiction) => void;
}

const SESSION_KEY = "privacy-atlas-yourcountry-dismissed";

interface Detected {
  iso3: string;
  iso2: string;
  entry: KpiSummaryEntry;
}

export const YourCountryCard = ({ onSelect }: Props) => {
  const { t } = useT();
  const [detected, setDetected] = useState<Detected | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(() =>
    typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1",
  );

  useEffect(() => {
    if (dismissed) return;
    let cancelled = false;
    const controller = new AbortController();
    const run = () => {
      if (cancelled) return;
      fetch("https://ipapi.co/json/", { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (cancelled || !d) return;
          const code2 = d.country_code as string | undefined;
          const code3 = d.country_code_iso3 as string | undefined;
          const iso3 = code3 || (code2 ? ISO2_TO_ISO3[code2] : undefined);
          if (!iso3) return;
          const entry = KPI_SUMMARY.byIso3[iso3];
          if (entry) {
            setDetected({ iso3, iso2: code2 ?? "", entry });
          }
        })
        .catch(() => {});
    };
    const ric = (window as any).requestIdleCallback as
      | undefined
      | ((cb: () => void, opts?: { timeout: number }) => number);
    const handle = ric ? ric(run, { timeout: 2500 }) : window.setTimeout(run, 1500);
    return () => {
      cancelled = true;
      controller.abort();
      const cic = (window as any).cancelIdleCallback as undefined | ((h: number) => void);
      if (ric && cic) cic(handle as number);
      else window.clearTimeout(handle as number);
    };
  }, [dismissed]);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setDismissed(true);
  };

  const open = async () => {
    if (!detected) return;
    // Lazy-load the full dataset only when the user explicitly opens the drawer
    const { JURISDICTIONS } = await import("@/data/jurisdictions.data");
    const full = JURISDICTIONS.find((j) => j.iso3 === detected.iso3);
    if (full) onSelect(full);
  };

  if (dismissed || !detected) return null;

  const { entry, iso2 } = detected;
  const lawStatus = entry.lawStatus as LawStatus;

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
          <div className="font-display text-2xl font-bold leading-tight">{entry.jurisdiction}</div>
          <div
            className="inline-block text-xs px-2 py-0.5 rounded text-white font-medium mt-1"
            style={{ background: STATUS_COLOR[lawStatus] }}
          >
            {STATUS_LABEL[lawStatus]}
          </div>
        </div>
      </div>
      {entry.keyLawName && (
        <div className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {entry.keyLawName} {entry.keyLawYear && `· ${entry.keyLawYear}`}
        </div>
      )}
      <Button size="default" className="w-full mt-4" onClick={open}>
        {t("you.viewDetail")}
      </Button>
    </Card>
  );
};
