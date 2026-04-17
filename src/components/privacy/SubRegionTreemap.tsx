import { useMemo } from "react";
import { Jurisdiction, REGION_COLORS } from "@/data/jurisdictions";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

export const SubRegionTreemap = ({ data }: { data: Jurisdiction[] }) => {
  const tree = useMemo(() => {
    const groups = new Map<string, { region: string; count: number; post: number; sub: string }>();
    data.forEach((d) => {
      const key = d.subRegion;
      const g = groups.get(key) ?? { region: d.region, count: 0, post: 0, sub: key };
      g.count++;
      if (d.era === "Post-GDPR") g.post++;
      groups.set(key, g);
    });
    return Array.from(groups.values()).map((g) => ({
      name: g.sub,
      size: g.count,
      region: g.region,
      pct: Math.round((g.post / g.count) * 100),
    }));
  }, [data]);

  return (
    <Card className="p-5 shadow-soft">
      <h3 className="font-display text-2xl">Sub-regiones</h3>
      <p className="text-xs text-muted-foreground mb-3">Tamaño = nº de jurisdicciones · color = región</p>
      <div className="h-72">
        <ResponsiveContainer>
          <Treemap
            data={tree}
            dataKey="size"
            stroke="hsl(var(--background))"
            content={<CustomCell />}
          >
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
              formatter={(v: any, _n, p: any) => [`${v} países · ${p.payload.pct}% Post-GDPR`, p.payload.name]}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const CustomCell = (props: any) => {
  const { x, y, width, height, name, region, pct } = props;
  const fill = REGION_COLORS[region] ?? "hsl(var(--muted))";
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} style={{ fill, stroke: "hsl(var(--background))", strokeWidth: 2, opacity: 0.85 }} />
      {width > 70 && height > 36 && (
        <>
          <text x={x + 8} y={y + 18} fill="white" fontSize={12} fontWeight={600}>{name}</text>
          <text x={x + 8} y={y + 34} fill="white" fontSize={10} opacity={0.85}>{pct}% Post-GDPR</text>
        </>
      )}
    </g>
  );
};
