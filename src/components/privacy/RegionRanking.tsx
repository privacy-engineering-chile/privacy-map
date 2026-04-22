import { useMemo } from "react";
import { Jurisdiction, REGION_COLORS } from "@/data/jurisdictions";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useT } from "@/i18n/LanguageContext";

export const RegionRanking = ({ data }: { data: Jurisdiction[] }) => {
  const { t, lang } = useT();
  const rows = useMemo(() => {
    const map = new Map<string, { region: string; count: number; sum: number }>();
    data.forEach((d) => {
      if (d.year == null) return;
      const r = map.get(d.region) ?? { region: d.region, count: 0, sum: 0 };
      r.count++;
      r.sum += d.year;
      map.set(d.region, r);
    });
    return Array.from(map.values())
      .map((r) => ({ ...r, avg: Math.round(r.sum / r.count) }))
      .sort((a, b) => a.avg - b.avg);
  }, [data]);

  const latamShort = lang === "es" ? "LatAm & Caribe" : "LatAm & Caribbean";

  return (
    <Card className="p-5 shadow-soft">
      <h3 className="font-display text-2xl">{t("rr.title")}</h3>
      <p className="text-xs text-muted-foreground mb-3">{t("rr.lead")}</p>
      <div className="h-72 md:h-80">
        <ResponsiveContainer>
          <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={[1990, 2024]}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              type="category"
              dataKey="region"
              width={140}
              tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
              tickFormatter={(v) => (v === "Latin America and the Caribbean" ? latamShort : v)}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
              }}
            />
            <Bar dataKey="avg" radius={[0, 8, 8, 0]}>
              {rows.map((r) => (
                <Cell key={r.region} fill={REGION_COLORS[r.region]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
