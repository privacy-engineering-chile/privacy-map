import { useMemo, useState } from "react";
import { Jurisdiction, REGION_COLORS, YEAR_MAX, YEAR_MIN } from "@/data/jurisdictions";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

export const RegionComparator = ({ data }: { data: Jurisdiction[] }) => {
  const [mode, setMode] = useState<"cum" | "new">("cum");
  const regions = useMemo(() => Array.from(new Set(data.map((d) => d.region))), [data]);

  const series = useMemo(() => {
    const years: number[] = [];
    for (let y = YEAR_MIN; y <= YEAR_MAX; y++) years.push(y);
    return years.map((y) => {
      const row: any = { year: y };
      regions.forEach((r) => {
        const count = data.filter((d) => d.region === r && (mode === "cum" ? d.year <= y : d.year === y)).length;
        row[r] = count;
      });
      return row;
    });
  }, [data, regions, mode]);

  return (
    <Card className="p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display text-2xl">Adopción por región</h3>
          <p className="text-xs text-muted-foreground">Cómo cada región adoptó leyes de privacidad en el tiempo</p>
        </div>
        <div className="flex bg-secondary rounded-full p-1 text-xs">
          <button onClick={() => setMode("cum")} className={`px-3 py-1 rounded-full ${mode === "cum" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            Acumulado
          </button>
          <button onClick={() => setMode("new")} className={`px-3 py-1 rounded-full ${mode === "new" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            Nuevas/año
          </button>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer>
          <AreaChart data={series} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {regions.map((r) => (
              <Area
                key={r}
                type="monotone"
                dataKey={r}
                stackId="1"
                stroke={REGION_COLORS[r]}
                fill={REGION_COLORS[r]}
                fillOpacity={0.75}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
