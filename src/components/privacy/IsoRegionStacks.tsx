import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { CORE_TREATIES, Jurisdiction, TREATY_LABELS } from "@/data/jurisdictions";

const TREATY_COLORS: Record<string, string> = {
  conv108: "hsl(var(--treaty-conv108))",
  conv108plus: "hsl(var(--treaty-conv108plus))",
  malaboRatified: "hsl(var(--treaty-malabo))",
  gpa: "hsl(var(--treaty-gpa))",
  gpen: "hsl(var(--treaty-gpen))",
  oecd: "hsl(var(--treaty-oecd))",
};

interface Props {
  data: Jurisdiction[];
}

interface Tower {
  region: string;
  total: number;
  layers: { key: string; label: string; count: number; pct: number }[];
}

const REGION_SHORT: Record<string, string> = {
  "Latin America and the Caribbean": "LatAm",
  "Northern America": "N. America",
};

export const IsoRegionStacks = ({ data }: Props) => {
  const [hover, setHover] = useState<{ region: string; layer: string; count: number; total: number } | null>(null);

  const towers = useMemo<Tower[]>(() => {
    const regions = Array.from(new Set(data.map((d) => d.region)));
    return regions
      .map((r) => {
        const inR = data.filter((d) => d.region === r);
        const total = inR.length;
        const layers = CORE_TREATIES.map((t) => {
          const count = inR.filter((d) => d.treaties[t]).length;
          return { key: t, label: TREATY_LABELS[t], count, pct: total ? count / total : 0 };
        });
        return { region: r, total, layers };
      })
      .sort((a, b) => b.total - a.total);
  }, [data]);

  // Isometric constants
  const TILE_W = 70; // base half-width of a cube footprint
  const LAYER_H = 22;
  const TOWER_GAP = 30;
  const PAD = 60;

  const towerWidth = TILE_W * 2 + 30;
  const towerHeight = LAYER_H * (CORE_TREATIES.length + 2);
  const totalW = towers.length * (towerWidth + TOWER_GAP) + PAD * 2;
  const totalH = towerHeight + 140;

  // iso projection helpers
  const iso = (x: number, y: number, z: number) => {
    const isoX = (x - y) * Math.cos(Math.PI / 6);
    const isoY = (x + y) * Math.sin(Math.PI / 6) - z;
    return { x: isoX, y: isoY };
  };

  const renderCube = (
    cx: number,
    baseY: number,
    layerIdx: number,
    pct: number,
    color: string,
    onEnter: () => void,
    onLeave: () => void,
  ) => {
    const half = TILE_W * Math.max(0.18, pct);
    const z0 = baseY - layerIdx * LAYER_H;
    const z1 = z0 - LAYER_H;

    // 4 corners (top + bottom)
    const tNE = iso(half, -half, z0);
    const tNW = iso(-half, -half, z0);
    const tSW = iso(-half, half, z0);
    const tSE = iso(half, half, z0);

    const bNE = iso(half, -half, z1);
    const bSE = iso(half, half, z1);
    const bSW = iso(-half, half, z1);

    const offset = (px: { x: number; y: number }) => `${cx + px.x},${baseY + (px.y - baseY) * 0 + px.y}`;
    // We'll just translate group by cx and use raw iso coords
    const pt = (p: { x: number; y: number }) => `${p.x},${p.y}`;

    return (
      <g
        key={layerIdx}
        transform={`translate(${cx}, 0)`}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{ cursor: "default" }}
      >
        {/* Top face */}
        <polygon
          points={`${pt(tNE)} ${pt(tNW)} ${pt(tSW)} ${pt(tSE)}`}
          fill={color}
          stroke="hsl(var(--background))"
          strokeWidth={1}
          opacity={0.95}
        />
        {/* Right face */}
        <polygon
          points={`${pt(tSE)} ${pt(tSW)} ${pt(bSW)} ${pt(bSE)}`}
          fill={color}
          stroke="hsl(var(--background))"
          strokeWidth={1}
          opacity={0.65}
        />
        {/* Left face */}
        <polygon
          points={`${pt(tNE)} ${pt(tSE)} ${pt(bSE)} ${pt(bNE)}`}
          fill={color}
          stroke="hsl(var(--background))"
          strokeWidth={1}
          opacity={0.8}
        />
      </g>
    );
  };

  return (
    <Card className="p-5 shadow-soft relative overflow-hidden">
      <h3 className="font-display text-2xl">Torres de tratados por región</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Cada cubo = % de países en la región adheridos a un tratado. Más ancho, mayor cobertura.
      </p>

      <div className="relative w-full overflow-x-auto">
        <svg
          width={totalW}
          height={totalH}
          viewBox={`0 0 ${totalW} ${totalH}`}
          style={{ width: "100%", height: "auto", minWidth: 600 }}
        >
          {towers.map((tower, ti) => {
            const cx = PAD + ti * (towerWidth + TOWER_GAP) + towerWidth / 2;
            const baseY = totalH - 80;

            // Floor diamond
            const floor = [
              iso(TILE_W * 1.05, -TILE_W * 1.05, 0),
              iso(-TILE_W * 1.05, -TILE_W * 1.05, 0),
              iso(-TILE_W * 1.05, TILE_W * 1.05, 0),
              iso(TILE_W * 1.05, TILE_W * 1.05, 0),
            ];

            return (
              <g key={tower.region}>
                {/* shadow */}
                <ellipse
                  cx={cx}
                  cy={baseY + 8}
                  rx={TILE_W * 1.2}
                  ry={TILE_W * 0.45}
                  fill="hsl(var(--foreground))"
                  opacity={0.08}
                />
                {/* Floor */}
                <g transform={`translate(${cx}, ${baseY})`}>
                  <polygon
                    points={floor.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="hsl(var(--muted))"
                    opacity={0.35}
                    stroke="hsl(var(--border))"
                    strokeWidth={1}
                  />
                </g>

                {/* Cubes */}
                {tower.layers.map((layer, li) =>
                  renderCube(
                    cx,
                    baseY,
                    li,
                    layer.pct,
                    TREATY_COLORS[layer.key] ?? "hsl(var(--accent))",
                    () => setHover({ region: tower.region, layer: layer.label, count: layer.count, total: tower.total }),
                    () => setHover((h) => (h && h.region === tower.region && h.layer === layer.label ? null : h)),
                  ),
                )}

                {/* Region label */}
                <text
                  x={cx}
                  y={baseY + 50}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  {REGION_SHORT[tower.region] ?? tower.region}
                </text>
                <text
                  x={cx}
                  y={baseY + 66}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: 10 }}
                >
                  {tower.total} países
                </text>
              </g>
            );
          })}
        </svg>

        {hover && (
          <div className="absolute top-2 right-2 bg-popover/95 backdrop-blur border border-border rounded-lg px-3 py-2 text-xs shadow-lg pointer-events-none">
            <div className="font-semibold">{hover.region}</div>
            <div className="text-muted-foreground">
              <span className="text-foreground font-medium">{hover.layer}</span> ·{" "}
              {hover.count} / {hover.total} países (
              {Math.round((hover.count / Math.max(1, hover.total)) * 100)}%)
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 text-[11px]">
        {CORE_TREATIES.map((t) => (
          <div key={t} className="inline-flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ background: TREATY_COLORS[t], boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.25)" }}
            />
            <span className="text-muted-foreground">{TREATY_LABELS[t]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
