import { useMemo, useState } from "react";
import { sankey, sankeyLinkHorizontal, SankeyGraph } from "d3-sankey";
import {
  CORE_TREATIES,
  Jurisdiction,
  REGION_COLORS,
  TREATY_LABELS,
  Treaties,
} from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";

interface SNode {
  name: string;
  kind: "region" | "treaty";
  color: string;
}
interface SLink {
  source: number;
  target: number;
  value: number;
}

const TREATY_COLORS: Record<string, string> = {
  conv108: "hsl(var(--treaty-conv108))",
  conv108plus: "hsl(var(--treaty-conv108plus))",
  malaboRatified: "hsl(var(--treaty-malabo))",
  gpa: "hsl(var(--treaty-gpa))",
  gpen: "hsl(var(--treaty-gpen))",
  oecd: "hsl(var(--treaty-oecd))",
};

const W = 720;
const H = 420;

export const RegionTreatySankey = ({ data }: { data: Jurisdiction[] }) => {
  const [hover, setHover] = useState<{ idx: number; kind: "link" | "node" } | null>(null);

  const graph = useMemo(() => {
    const regions = Array.from(new Set(data.map((d) => d.region))).sort();
    const nodes: SNode[] = [
      ...regions.map<SNode>((r) => ({
        name: r,
        kind: "region",
        color: REGION_COLORS[r] ?? "hsl(var(--muted))",
      })),
      ...CORE_TREATIES.map<SNode>((t) => ({
        name: TREATY_LABELS[t],
        kind: "treaty",
        color: TREATY_COLORS[t],
      })),
    ];
    const links: SLink[] = [];
    regions.forEach((r, ri) => {
      CORE_TREATIES.forEach((t, ti) => {
        const v = data.filter(
          (d) => d.region === r && d.treaties[t as keyof Treaties],
        ).length;
        if (v > 0)
          links.push({ source: ri, target: regions.length + ti, value: v });
      });
    });

    const layout = sankey<SNode, SLink>()
      .nodeWidth(14)
      .nodePadding(10)
      .extent([
        [4, 8],
        [W - 4, H - 8],
      ]);

    return layout({
      nodes: nodes.map((d) => ({ ...d })),
      links: links.map((d) => ({ ...d })),
    } as SankeyGraph<SNode, SLink>);
  }, [data]);

  return (
    <Card className="p-5 shadow-soft">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-display text-2xl">Flujo Región → Tratado</h3>
          <p className="text-xs text-muted-foreground">
            Cada hilo representa la cantidad de jurisdicciones de una región dentro de un tratado.
          </p>
        </div>
      </div>
      <div className="mt-3 -mx-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-[420px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <g>
            {graph.links.map((l, i) => {
              const path = sankeyLinkHorizontal()(l as any) ?? "";
              const src = l.source as unknown as SNode;
              const isHover = hover?.kind === "link" && hover.idx === i;
              const dim = hover && !isHover;
              return (
                <path
                  key={i}
                  d={path}
                  fill="none"
                  stroke={src.color}
                  strokeOpacity={isHover ? 0.85 : dim ? 0.08 : 0.35}
                  strokeWidth={Math.max(1, (l as any).width)}
                  style={{ transition: "stroke-opacity 200ms" }}
                  onMouseEnter={() => setHover({ idx: i, kind: "link" })}
                  onMouseLeave={() => setHover(null)}
                >
                  <title>
                    {(l.source as unknown as SNode).name} → {(l.target as unknown as SNode).name}: {l.value} jurisdicciones
                  </title>
                </path>
              );
            })}
          </g>
          <g>
            {graph.nodes.map((n, i) => {
              const node = n as any;
              const label =
                n.name === "Latin America and the Caribbean" ? "LatAm & Caribe" : n.name;
              const isLeft = n.kind === "region";
              return (
                <g key={i}>
                  <rect
                    x={node.x0}
                    y={node.y0}
                    width={node.x1 - node.x0}
                    height={Math.max(2, node.y1 - node.y0)}
                    fill={n.color}
                    rx={2}
                  >
                    <title>
                      {n.name}: {node.value} jurisdicciones
                    </title>
                  </rect>
                  <text
                    x={isLeft ? node.x1 + 6 : node.x0 - 6}
                    y={(node.y0 + node.y1) / 2}
                    dy="0.35em"
                    textAnchor={isLeft ? "start" : "end"}
                    fontSize={11}
                    fill="hsl(var(--foreground))"
                    style={{ pointerEvents: "none" }}
                  >
                    {label}
                    <tspan fill="hsl(var(--muted-foreground))" dx={4}>
                      {node.value}
                    </tspan>
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </Card>
  );
};
