import { useMemo, useState } from "react";
import { BLOCS, Jurisdiction, STATUS_COLOR, STATUS_LABEL } from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";
import { useT } from "@/i18n/LanguageContext";

export const BlocExplorer = ({
  data,
  onSelect,
}: {
  data: Jurisdiction[];
  onSelect: (j: Jurisdiction) => void;
}) => {
  const { t } = useT();
  const [active, setActive] = useState<string>(BLOCS[0].key);

  const members = useMemo(() => {
    const bloc = BLOCS.find((b) => b.key === active)!;
    return data
      .filter((d) => d.treaties[bloc.key])
      .sort((a, b) => a.jurisdiction.localeCompare(b.jurisdiction));
  }, [data, active]);

  const stats = useMemo(() => {
    const total = members.length;
    const comp = members.filter((m) => m.lawStatus === "comprehensive").length;
    const dpa = members.filter((m) => m.hasDPA).length;
    const years = members.map((m) => m.keyLawYear).filter((y): y is number => !!y);
    const avgYear = years.length ? Math.round(years.reduce((a, b) => a + b, 0) / years.length) : null;
    return { total, comp, dpa, avgYear };
  }, [members]);

  return (
    <Card className="p-5 shadow-soft">
      <h3 className="font-display text-2xl">{t("bloc.title")}</h3>
      <p className="text-xs text-muted-foreground mb-3">{t("bloc.lead")}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {BLOCS.map((b) => (
          <button
            key={b.key}
            onClick={() => setActive(b.key)}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${
              active === b.key
                ? "bg-foreground text-background border-foreground"
                : "border-border opacity-70"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Stat label={t("bloc.members")} value={stats.total} />
        <Stat
          label={t("bloc.lawpct")}
          value={stats.total ? `${Math.round((stats.comp / stats.total) * 100)}%` : "—"}
          accent="text-status-comprehensive"
        />
        <Stat label={t("bloc.avgyear")} value={stats.avgYear ?? "—"} accent="text-accent" />
      </div>

      <div className="max-h-[260px] overflow-auto border border-border rounded-lg divide-y divide-border">
        {members.length === 0 && (
          <div className="p-3 text-xs text-muted-foreground italic">{t("bloc.empty")}</div>
        )}
        {members.map((m) => (
          <button
            key={m.jurisdiction}
            onClick={() => onSelect(m)}
            className="w-full text-left flex items-center justify-between px-3 py-2 hover:bg-secondary/60 text-sm"
          >
            <span className="truncate">{m.jurisdiction}</span>
            <span className="flex items-center gap-2 shrink-0">
              <span className="text-xs tabular-nums text-muted-foreground">
                {m.keyLawYear ?? "—"}
              </span>
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: STATUS_COLOR[m.lawStatus] }}
                title={STATUS_LABEL[m.lawStatus]}
              />
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
};

const Stat = ({
  label,
  value,
  accent = "text-foreground",
}: {
  label: string;
  value: number | string;
  accent?: string;
}) => (
  <div className="rounded-lg bg-secondary p-2.5">
    <div className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">{label}</div>
    <div className={`font-display text-xl font-black ${accent}`}>{value}</div>
  </div>
);
