import { useMemo } from "react";
import { Jurisdiction } from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";

const FLAGS: { key: "ldc" | "lldc" | "sids"; label: string; desc: string }[] = [
  { key: "ldc", label: "Países menos adelantados (LDC)", desc: "Naciones con menor IDH" },
  { key: "lldc", label: "Países en desarrollo sin litoral (LLDC)", desc: "Sin acceso al mar" },
  { key: "sids", label: "Pequeños estados insulares (SIDS)", desc: "Pequeñas islas en desarrollo" },
];

export const DevelopmentEquity = ({ data }: { data: Jurisdiction[] }) => {
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

  // Reference: global
  const globalComp = Math.round(
    (data.filter((d) => d.lawStatus === "comprehensive").length / Math.max(data.length, 1)) * 100,
  );

  return (
    <Card className="p-5 shadow-soft">
      <h3 className="font-display text-2xl">Equidad en la protección</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Cobertura por clasificación de desarrollo · global: {globalComp}% con ley integral
      </p>

      <div className="space-y-4">
        {rows.map((r) => {
          const compPct = r.total ? Math.round((r.comp / r.total) * 100) : 0;
          const partPct = r.total ? Math.round((r.part / r.total) * 100) : 0;
          const nonePct = r.total ? 100 - compPct - partPct : 0;
          return (
            <div key={r.key}>
              <div className="flex items-baseline justify-between mb-1.5">
                <div>
                  <div className="text-sm font-semibold">{r.label}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {r.desc} · {r.total} países
                  </div>
                </div>
                <div className="font-display text-2xl font-black text-status-comprehensive">
                  {compPct}%
                </div>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex bg-muted">
                <div
                  className="h-full"
                  style={{ width: `${compPct}%`, background: "hsl(var(--status-comprehensive))" }}
                  title={`Integral: ${r.comp}`}
                />
                <div
                  className="h-full"
                  style={{ width: `${partPct}%`, background: "hsl(var(--status-partial))" }}
                  title={`Parcial: ${r.part}`}
                />
                <div
                  className="h-full"
                  style={{ width: `${nonePct}%`, background: "hsl(var(--status-none))" }}
                  title={`Sin ley: ${r.none}`}
                />
              </div>
              <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
                <span>Integral {r.comp}</span>
                <span>Parcial {r.part}</span>
                <span>Sin ley {r.none}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
