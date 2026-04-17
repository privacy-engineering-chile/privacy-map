import { JURISDICTIONS } from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";

export const KPICards = () => {
  const total = JURISDICTIONS.length;
  const post = JURISDICTIONS.filter((j) => j.era === "Post-GDPR").length;
  const postPct = Math.round((post / total) * 100);
  const yearCounts = JURISDICTIONS.reduce<Record<number, number>>((a, j) => {
    a[j.year] = (a[j.year] || 0) + 1;
    return a;
  }, {});
  const peakYear = Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0];
  const regions = new Set(JURISDICTIONS.map((j) => j.region)).size;

  const items = [
    { label: "Jurisdicciones", value: total, color: "text-region-americas" },
    { label: "% Post-GDPR", value: `${postPct}%`, color: "text-accent" },
    { label: "Año pico", value: `${peakYear[0]}`, sub: `${peakYear[1]} leyes`, color: "text-region-asia" },
    { label: "Regiones", value: regions, color: "text-region-africa" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((it, i) => (
        <Card key={it.label} className="p-5 shadow-soft animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{it.label}</div>
          <div className={`font-display text-4xl md:text-5xl font-black mt-2 ${it.color}`}>{it.value}</div>
          {it.sub && <div className="text-xs text-muted-foreground mt-1">{it.sub}</div>}
        </Card>
      ))}
    </div>
  );
};
