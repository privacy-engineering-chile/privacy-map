import { useMemo } from "react";
import { Jurisdiction } from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";
import { useT } from "@/i18n/LanguageContext";

export const DevelopmentEquity = ({ data }: { data: Jurisdiction[] }) => {
  const { t } = useT();

  const FLAGS: { key: "ldc" | "lldc" | "sids"; labelKey: string; descKey: string }[] = [
    { key: "ldc", labelKey: "de.ldc", descKey: "de.ldc.desc" },
    { key: "lldc", labelKey: "de.lldc", descKey: "de.lldc.desc" },
    { key: "sids", labelKey: "de.sids", descKey: "de.sids.desc" },
  ];

  const rows = useMemo(
    () =>
      FLAGS.map((f) => {
        const subset = data.filter((d) => d[f.key]);
        const total = subset.length;
        const comp = subset.filter((d) => d.lawStatus === "comprehensive").length;
        const part = subset.filter((d) => d.lawStatus === "partial").length;
        const none = subset.filter((d) => d.lawStatus === "none").length;
        return { ...f, total, comp, part, none };
      }),
    [data],
  );

  const globalComp = Math.round(
    (data.filter((d) => d.lawStatus === "comprehensive").length / Math.max(data.length, 1)) * 100,
  );

  return (
    <Card className="p-5 shadow-soft">
      <h3 className="font-display text-2xl">{t("de.title")}</h3>
      <p className="text-xs text-muted-foreground mb-4">{t("de.lead", { pct: globalComp })}</p>

      <div className="space-y-4">
        {rows.map((r) => {
          const compPct = r.total ? Math.round((r.comp / r.total) * 100) : 0;
          const partPct = r.total ? Math.round((r.part / r.total) * 100) : 0;
          const nonePct = r.total ? 100 - compPct - partPct : 0;
          return (
            <div key={r.key}>
              <div className="flex items-baseline justify-between mb-1.5 gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{t(r.labelKey)}</div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {t(r.descKey)} · {t("de.countries", { n: r.total })}
                  </div>
                </div>
                <div className="font-display text-2xl font-black text-status-comprehensive shrink-0">
                  {compPct}%
                </div>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex bg-muted">
                <div className="h-full" style={{ width: `${compPct}%`, background: "hsl(var(--status-comprehensive))" }} />
                <div className="h-full" style={{ width: `${partPct}%`, background: "hsl(var(--status-partial))" }} />
                <div className="h-full" style={{ width: `${nonePct}%`, background: "hsl(var(--status-none))" }} />
              </div>
              <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
                <span>{t("de.legend.comp")} {r.comp}</span>
                <span>{t("de.legend.part")} {r.part}</span>
                <span>{t("de.legend.none")} {r.none}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
