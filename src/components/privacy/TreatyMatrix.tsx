import { useMemo, useState } from "react";
import {
  CORE_TREATIES,
  Jurisdiction,
  REGION_COLORS,
  TREATY_LABELS,
} from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";

export const TreatyMatrix = ({
  data,
  onSelect,
}: {
  data: Jurisdiction[];
  onSelect: (j: Jurisdiction) => void;
}) => {
  const [region, setRegion] = useState<string>("all");
  const filtered = useMemo(() => {
    const arr = data.filter((d) => region === "all" || d.region === region);
    return arr
      .filter((d) => CORE_TREATIES.some((t) => d.treaties[t]))
      .sort((a, b) => {
        const ac = CORE_TREATIES.filter((t) => a.treaties[t]).length;
        const bc = CORE_TREATIES.filter((t) => b.treaties[t]).length;
        if (bc !== ac) return bc - ac;
        return a.jurisdiction.localeCompare(b.jurisdiction);
      })
      .slice(0, 60);
  }, [data, region]);

  const regions = useMemo(
    () => Array.from(new Set(data.map((d) => d.region))).sort(),
    [data],
  );

  return (
    <Card className="p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display text-2xl">Red de tratados</h3>
          <p className="text-xs text-muted-foreground">
            ¿Qué países están conectados a marcos internacionales de privacidad?
          </p>
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="text-xs bg-secondary rounded-full px-3 py-1.5 border border-border"
        >
          <option value="all">Todas las regiones</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r === "Latin America and the Caribbean" ? "LatAm & Caribe" : r}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto max-h-[480px]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card z-10">
            <tr>
              <th className="text-left py-2 px-2 font-medium text-muted-foreground">País</th>
              {CORE_TREATIES.map((t) => (
                <th key={t} className="px-1 py-2 font-medium text-muted-foreground text-center">
                  <div className="rotate-[-30deg] origin-bottom-left inline-block whitespace-nowrap">
                    {TREATY_LABELS[t]}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => (
              <tr
                key={j.jurisdiction}
                onClick={() => onSelect(j)}
                className="cursor-pointer hover:bg-secondary/60 border-t border-border"
              >
                <td className="py-1.5 px-2 flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: REGION_COLORS[j.region] }}
                  />
                  <span className="truncate">{j.jurisdiction}</span>
                </td>
                {CORE_TREATIES.map((t) => (
                  <td key={t} className="text-center px-1">
                    {j.treaties[t] ? (
                      <span
                        className="inline-block h-3.5 w-3.5 rounded-sm"
                        style={{ background: "hsl(var(--status-treaty))" }}
                      />
                    ) : (
                      <span className="inline-block h-3.5 w-3.5 rounded-sm bg-muted opacity-40" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">
        Mostrando hasta 60 países con al menos un tratado.
      </p>
    </Card>
  );
};
