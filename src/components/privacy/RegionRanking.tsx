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

export const RegionRanking = ({ data }: { data: Jurisdiction[] }) => {
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

  return (
    <Card className="p-5 shadow-soft">
      <h3 className="font-display text-2xl">Velocidad de adopción</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Año promedio de regulación (más bajo = adoptó antes)
      </p>
      <div className="h-72">
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
              tickFormatter={(v) =>
                v === "Latin America and the Caribbean" ? "LatAm & Caribe" : v
              }
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
