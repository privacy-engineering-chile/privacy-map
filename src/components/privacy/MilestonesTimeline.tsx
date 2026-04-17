import { Jurisdiction, MILESTONES, REGION_COLORS, YEAR_MAX, YEAR_MIN } from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";

export const MilestonesTimeline = ({ data, onSelect }: { data: Jurisdiction[]; onSelect: (j: Jurisdiction) => void }) => {
  const span = YEAR_MAX - YEAR_MIN;
  const grouped = new Map<number, Jurisdiction[]>();
  data.forEach((d) => {
    const arr = grouped.get(d.year) ?? [];
    arr.push(d);
    grouped.set(d.year, arr);
  });

  return (
    <Card className="p-5 shadow-soft">
      <h3 className="font-display text-2xl mb-1">Línea del tiempo</h3>
      <p className="text-xs text-muted-foreground mb-6">{YEAR_MIN}–{YEAR_MAX} · cada punto = una jurisdicción · color por región</p>

      <div className="relative h-48">
        {/* base axis */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border" />

        {/* milestones */}
        {MILESTONES.map((m) => {
          const x = ((m.year - YEAR_MIN) / span) * 100;
          return (
            <div key={m.year} className="absolute top-0 bottom-0" style={{ left: `${x}%` }}>
              <div className="absolute top-0 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap font-medium">
                {m.label}
              </div>
              <div className="absolute top-4 bottom-4 w-px border-l border-dashed border-accent/60 -translate-x-1/2" />
              <div className="absolute bottom-0 -translate-x-1/2 text-[10px] tabular-nums text-accent font-bold">{m.year}</div>
            </div>
          );
        })}

        {/* points */}
        {Array.from(grouped.entries()).map(([year, list]) => {
          const x = ((year - YEAR_MIN) / span) * 100;
          return list.map((j, idx) => {
            const offset = (idx - (list.length - 1) / 2) * 9;
            return (
              <button
                key={j.jurisdiction}
                onClick={() => onSelect(j)}
                title={`${j.jurisdiction} (${year})`}
                className="absolute h-2.5 w-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform"
                style={{
                  left: `${x}%`,
                  top: `calc(50% + ${offset}px)`,
                  background: REGION_COLORS[j.region],
                  boxShadow: "0 0 0 1.5px hsl(var(--background))",
                }}
              />
            );
          });
        })}
      </div>
    </Card>
  );
};
