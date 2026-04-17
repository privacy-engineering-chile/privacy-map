import { JURISDICTIONS } from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";

export const KPICards = () => {
  const total = JURISDICTIONS.length;
  const comprehensive = JURISDICTIONS.filter((j) => j.lawStatus === "comprehensive").length;
  const none = JURISDICTIONS.filter((j) => j.lawStatus === "none").length;
  const noDPA = JURISDICTIONS.filter((j) => j.lawStatus === "comprehensive" && !j.hasDPA).length;
  const oldest = JURISDICTIONS.filter((j) => j.firstLawYear).sort(
    (a, b) => (a.firstLawYear ?? 9999) - (b.firstLawYear ?? 9999),
  )[0];

  const items = [
    {
      label: "Jurisdicciones",
      value: total,
      sub: "cubiertas en el atlas",
      color: "text-primary",
    },
    {
      label: "Con ley integral",
      value: `${Math.round((comprehensive / total) * 100)}%`,
      sub: `${comprehensive} de ${total}`,
      color: "text-status-comprehensive",
    },
    {
      label: "Sin ley alguna",
      value: none,
      sub: `${Math.round((none / total) * 100)}% del mundo`,
      color: "text-status-none",
    },
    {
      label: "Pionero",
      value: oldest?.firstLawYear ?? "—",
      sub: oldest?.jurisdiction ?? "",
      color: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((it, i) => (
        <Card
          key={it.label}
          className="p-5 shadow-soft animate-fade-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{it.label}</div>
          <div className={`font-display text-4xl md:text-5xl font-black mt-2 ${it.color}`}>{it.value}</div>
          {it.sub && <div className="text-xs text-muted-foreground mt-1 truncate">{it.sub}</div>}
        </Card>
      ))}
    </div>
  );
};
