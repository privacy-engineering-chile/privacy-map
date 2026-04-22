import {
  ALL_REGIONS,
  ALL_STATUSES,
  CORE_TREATIES,
  REGION_COLORS,
  STATUS_COLOR,
  STATUS_LABEL,
  TREATY_LABELS,
  Treaties,
  YEAR_MAX,
  YEAR_MIN,
} from "@/data/jurisdictions";
import { ColorMode, DevFlag, Filters } from "@/hooks/useFilters";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, Palette, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  filters: Filters;
  setFilters: (f: Filters | ((p: Filters) => Filters)) => void;
  reset: () => void;
}

const COLOR_MODES: { id: ColorMode; label: string }[] = [
  { id: "status", label: "Estatus" },
  { id: "region", label: "Región" },
  { id: "year", label: "Año" },
  { id: "dpa", label: "DPA" },
];

const DEV_FLAGS: { id: DevFlag; label: string }[] = [
  { id: "ldc", label: "LDC" },
  { id: "lldc", label: "LLDC" },
  { id: "sids", label: "SIDS" },
];

export const FiltersBar = ({ filters, setFilters, reset }: Props) => {
  const toggle = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <div className="-mx-4 px-4 py-3 bg-background/85 border-b border-border">
      <div className="container mx-auto flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[170px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            placeholder="Buscar país…"
            className="pl-9 bg-card"
          />
        </div>

        {/* Status chips */}
        <div className="flex gap-1.5">
          {ALL_STATUSES.map((s) => {
            const active = filters.statuses.includes(s);
            return (
              <button
                key={s}
                onClick={() => setFilters((p) => ({ ...p, statuses: toggle(p.statuses, s) }))}
                className="text-xs px-2.5 py-1 rounded-full border transition-all"
                style={{
                  background: active ? STATUS_COLOR[s] : "transparent",
                  color: active ? "white" : "hsl(var(--foreground))",
                  borderColor: STATUS_COLOR[s],
                  opacity: active ? 1 : 0.55,
                }}
              >
                {STATUS_LABEL[s]}
              </button>
            );
          })}
        </div>

        {/* Region chips (collapsed in popover) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              Regiones ({filters.regions.length}) <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
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
          </PopoverContent>
        </Popover>

        {/* Year slider */}
        <div className="flex items-center gap-2 min-w-[180px] flex-1 max-w-[220px]">
          <span className="text-xs text-muted-foreground tabular-nums">{filters.yearRange[0]}</span>
          <Slider
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={1}
            value={filters.yearRange}
            onValueChange={(v) =>
              setFilters((p) => ({ ...p, yearRange: [v[0], v[1]] as [number, number] }))
            }
          />
          <span className="text-xs text-muted-foreground tabular-nums">{filters.yearRange[1]}</span>
        </div>

        {/* Advanced */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              Avanzado <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 space-y-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Autoridad de Protección de Datos
              </div>
              <div className="flex gap-1.5">
                {(["any", "yes", "no"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setFilters((p) => ({ ...p, hasDPA: v }))}
                    className={`text-xs px-2.5 py-1 rounded-full border ${
                      filters.hasDPA === v
                        ? "bg-foreground text-background border-foreground"
                        : "border-border opacity-70"
                    }`}
                  >
                    {v === "any" ? "Cualquiera" : v === "yes" ? "Con DPA" : "Sin DPA"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Clasificación de desarrollo
              </div>
              <div className="flex gap-1.5">
                {DEV_FLAGS.map((d) => {
                  const active = filters.devFlags.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      onClick={() =>
                        setFilters((p) => ({ ...p, devFlags: toggle(p.devFlags, d.id) }))
                      }
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        active
                          ? "bg-region-africa text-white border-region-africa"
                          : "border-border opacity-70"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Tratados (todos requeridos)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CORE_TREATIES.map((t) => {
                  const active = filters.treaties.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() =>
                        setFilters((p) => ({
                          ...p,
                          treaties: toggle(p.treaties, t) as (keyof Treaties)[],
                        }))
                      }
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        active
                          ? "bg-status-treaty text-white border-status-treaty"
                          : "border-border opacity-70"
                      }`}
                    >
                      {TREATY_LABELS[t]}
                    </button>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Color mode */}
        <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
          <Palette className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
          {COLOR_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setFilters((p) => ({ ...p, colorMode: m.id }))}
              className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                filters.colorMode === m.id ? "bg-card shadow-sm" : "text-muted-foreground"
              }`}
            >
              {m.label}
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
