import { useMemo, useState } from "react";
import {
  CORE_TREATIES,
  Jurisdiction,
  REGION_COLORS,
  TREATY_LABELS,
} from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";
import { useT } from "@/i18n/LanguageContext";

export const TreatyMatrix = ({
  data,
  onSelect,
}: {
  data: Jurisdiction[];
  onSelect: (j: Jurisdiction) => void;
}) => {
  const { t, lang } = useT();
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

  const latamShort = lang === "es" ? "LatAm & Caribe" : "LatAm & Caribbean";

  return (
    <Card className="p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div>
          <h3 className="font-display text-2xl">{t("tm.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("tm.lead")}</p>
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="text-xs bg-secondary rounded-full px-3 py-1.5 border border-border"
        >
          <option value="all">{t("tm.allRegions")}</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r === "Latin America and the Caribbean" ? latamShort : r}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto max-h-[560px]">
        <table className="text-sm border-separate border-spacing-0" style={{ width: "auto" }}>
          <thead className="sticky top-0 bg-card z-10">
            <tr className="h-32 align-bottom">
              <th className="text-left py-2 pl-2 pr-3 font-medium text-muted-foreground align-bottom w-[180px]">
                {t("tm.country")}
              </th>
              {CORE_TREATIES.map((tk) => (
                <th
                  key={tk}
                  className="px-0 pb-2 font-medium text-muted-foreground align-bottom"
                  style={{ height: "120px", width: "38px" }}
                >
                  <div className="flex justify-center items-end h-full">
                    <span
                      className="inline-block whitespace-nowrap text-[12px] leading-none"
                      style={{
                        transform: "rotate(-55deg)",
                        transformOrigin: "left bottom",
                        translate: "12px 0",
                      }}
                    >
                      {TREATY_LABELS[tk]}
                    </span>
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
                <td className="py-2 pl-2 pr-3 border-t border-border w-[180px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ background: REGION_COLORS[j.region] }}
                    />
                    <span className="truncate text-sm">{j.jurisdiction}</span>
                  </div>
                </td>
                {CORE_TREATIES.map((tk) => (
                  <td key={tk} className="text-center px-0 border-t border-border" style={{ width: "38px" }}>
                    {j.treaties[tk] ? (
                      <span
                        className="inline-block h-4 w-4 rounded-sm"
                        style={{ background: "hsl(var(--status-treaty))" }}
                      />
                    ) : (
                      <span className="inline-block h-4 w-4 rounded-sm bg-muted opacity-40" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{t("tm.footer")}</p>
    </Card>
  );
};
