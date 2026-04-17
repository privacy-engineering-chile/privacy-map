import { useMemo } from "react";
import { Jurisdiction, REGION_COLORS } from "@/data/jurisdictions";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/card";

export const LawMaturityScatter = ({
  data,
  onSelect,
}: {
  data: Jurisdiction[];
  onSelect: (j: Jurisdiction) => void;
}) => {
  const points = useMemo(
    () =>
      data
        .filter((d) => d.firstLawYear && d.keyLawYear)
        .map((d) => ({
          x: d.firstLawYear,
          y: d.keyLawYear,
          j: d,
          fill: REGION_COLORS[d.region],
        })),
    [data],
  );

  const grouped = useMemo(() => {
    const m = new Map<string, typeof points>();
    points.forEach((p) => {
      const arr = m.get(p.j.region) ?? [];
      arr.push(p);
      m.set(p.j.region, arr);
    });
    return Array.from(m.entries());
  }, [points]);

  return (
    <Card className="p-5 shadow-soft">
      <h3 className="font-display text-2xl">Madurez legislativa</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Primera ley vs. ley vigente · diagonal = sin actualizar · arriba = modernizada
      </p>
      <div className="h-80">
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: -8 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="Primera ley"
              domain={[1970, 2024]}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Ley vigente"
              domain={[1970, 2024]}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <ZAxis range={[60, 60]} />
            <ReferenceLine
              segment={[
                { x: 1970, y: 1970 },
                { x: 2024, y: 2024 },
              ]}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="4 4"
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
              }}
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                const j: Jurisdiction = payload[0].payload.j;
                return (
                  <div className="text-xs">
                    <div className="font-semibold">{j.jurisdiction}</div>
                    <div className="text-muted-foreground">
                      Primera: {j.firstLawYear} → Vigente: {j.keyLawYear}
                    </div>
                    <div style={{ color: REGION_COLORS[j.region] }}>{j.region}</div>
                  </div>
                );
              }}
            />
            {grouped.map(([region, pts]) => (
              <Scatter
                key={region}
                data={pts}
                fill={REGION_COLORS[region]}
                onClick={(p: any) => onSelect(p.j)}
                cursor="pointer"
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
