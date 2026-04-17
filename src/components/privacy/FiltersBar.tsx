import { ALL_ERAS, ALL_REGIONS, REGION_COLORS, YEAR_MAX, YEAR_MIN } from "@/data/jurisdictions";
import { Filters } from "@/hooks/useFilters";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, Palette } from "lucide-react";

interface Props {
  filters: Filters;
  setFilters: (f: Filters | ((p: Filters) => Filters)) => void;
  reset: () => void;
}

export const FiltersBar = ({ filters, setFilters, reset }: Props) => {
  const toggle = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <div className="sticky top-0 z-30 -mx-4 px-4 py-3 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            placeholder="Buscar país…"
            className="pl-9 bg-card"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ALL_REGIONS.map((r) => {
            const active = filters.regions.includes(r);
            return (
              <button
                key={r}
                onClick={() => setFilters((p) => ({ ...p, regions: toggle(p.regions, r) }))}
                className="text-xs px-2.5 py-1 rounded-full border transition-all"
                style={{
                  background: active ? REGION_COLORS[r] : "transparent",
                  color: active ? "white" : "hsl(var(--foreground))",
                  borderColor: REGION_COLORS[r],
                  opacity: active ? 1 : 0.55,
                }}
              >
                {r === "Latin America and the Caribbean" ? "LatAm & Caribe" : r}
              </button>
            );
          })}
        </div>

        <div className="flex gap-1.5">
          {ALL_ERAS.map((e) => {
            const active = filters.eras.includes(e);
            const isPost = e === "Post-GDPR";
            return (
              <button
                key={e}
                onClick={() => setFilters((p) => ({ ...p, eras: toggle(p.eras, e) }))}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  active
                    ? isPost
                      ? "bg-accent text-accent-foreground border-accent shadow-pop"
                      : "bg-era-pre text-white border-era-pre"
                    : "border-border opacity-55"
                }`}
              >
                {e}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 min-w-[200px] flex-1 max-w-xs">
          <span className="text-xs text-muted-foreground tabular-nums">{filters.yearRange[0]}</span>
          <Slider
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={1}
            value={filters.yearRange}
            onValueChange={(v) => setFilters((p) => ({ ...p, yearRange: [v[0], v[1]] as [number, number] }))}
          />
          <span className="text-xs text-muted-foreground tabular-nums">{filters.yearRange[1]}</span>
        </div>

        <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
          <Palette className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
          {(["era", "region", "year"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setFilters((p) => ({ ...p, colorMode: m }))}
              className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                filters.colorMode === m ? "bg-card shadow-sm" : "text-muted-foreground"
              }`}
            >
              {m === "era" ? "Era" : m === "region" ? "Región" : "Año"}
            </button>
          ))}
        </div>

        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>
    </div>
  );
};
