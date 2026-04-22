import { useMemo } from "react";
import { CORE_TREATIES, Jurisdiction, TREATY_LABELS } from "@/data/jurisdictions";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useT } from "@/i18n/LanguageContext";

const TREATY_COLORS: Record<string, string> = {
  conv108: "hsl(var(--treaty-conv108))",
  conv108plus: "hsl(var(--treaty-conv108plus))",
  malaboRatified: "hsl(var(--treaty-malabo))",
  gpa: "hsl(var(--treaty-gpa))",
  gpen: "hsl(var(--treaty-gpen))",
  oecd: "hsl(var(--treaty-oecd))",
};

export const TreatyRegionStacks = ({ data }: { data: Jurisdiction[] }) => {
  const { t } = useT();
  const rows = useMemo(() => {
    const regs = Array.from(new Set(data.map((d) => d.region)));
    return regs.map((r) => {
      const row: any = { region: r === "Latin America and the Caribbean" ? "LatAm" : r };
      CORE_TREATIES.forEach((tk) => {
        row[tk] = data.filter((d) => d.region === r && d.treaties[tk]).length;
      });
      return row;
    });
  }, [data]);

  return (
    <Card className="p-5 shadow-soft">
      <h3 className="font-display text-2xl">{t("trs.title")}</h3>
      <p className="text-xs text-muted-foreground mb-3">{t("trs.lead")}</p>
      <div className="h-72 md:h-80">
        <ResponsiveContainer>
          <BarChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="region" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {CORE_TREATIES.map((tk) => (
              <Bar key={tk} dataKey={tk} stackId="t" name={TREATY_LABELS[tk]} fill={TREATY_COLORS[tk]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
