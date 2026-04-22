import { JURISDICTIONS } from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";
import { useParallaxTilt } from "@/hooks/useParallaxTilt";
import { useT } from "@/i18n/LanguageContext";

const TiltCard = ({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) => {
  const { ref, style } = useParallaxTilt<HTMLDivElement>({ max: 6 });
  return (
    <div ref={ref} style={style} className="animate-fade-up" data-delay={delay}>
      <Card className="p-5 shadow-soft h-full" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </Card>
    </div>
  );
};

export const KPICards = () => {
  const { t } = useT();
  const total = JURISDICTIONS.length;
  const comprehensive = JURISDICTIONS.filter((j) => j.lawStatus === "comprehensive").length;
  const none = JURISDICTIONS.filter((j) => j.lawStatus === "none").length;
  const oldest = JURISDICTIONS.filter((j) => j.firstLawYear).sort(
    (a, b) => (a.firstLawYear ?? 9999) - (b.firstLawYear ?? 9999),
  )[0];

  const items = [
    { label: t("kpi.jurisdictions"), value: total, sub: "", color: "text-primary" },
    {
      label: t("kpi.comprehensive"),
      value: `${Math.round((comprehensive / total) * 100)}%`,
      sub: `${comprehensive} / ${total}`,
      color: "text-status-comprehensive",
    },
    {
      label: t("kpi.none"),
      value: none,
      sub: `${Math.round((none / total) * 100)}%`,
      color: "text-status-none",
    },
    {
      label: t("kpi.pioneer"),
      value: oldest?.firstLawYear ?? "—",
      sub: oldest?.jurisdiction ?? "",
      color: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {items.map((it, i) => (
        <TiltCard key={it.label} delay={i * 80}>
          <div className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">{it.label}</div>
          <div className={`font-display text-3xl md:text-5xl font-black mt-2 ${it.color}`}>
            {it.value}
          </div>
          {it.sub && <div className="text-[10px] md:text-xs text-muted-foreground mt-1 truncate">{it.sub}</div>}
        </TiltCard>
      ))}
    </div>
  );
};
