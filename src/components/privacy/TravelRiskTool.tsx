import { useEffect, useMemo, useState } from "react";
import { CORE_TREATIES, JURISDICTIONS, Jurisdiction, TREATY_LABELS } from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Plane, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const scoreOf = (j: Jurisdiction): number => {
  const base =
    j.lawStatus === "comprehensive" ? 80 : j.lawStatus === "partial" ? 40 : 0;
  const dpa = j.hasDPA ? 10 : 0;
  const treaties = CORE_TREATIES.some((t) => j.treaties[t]) ? 10 : 0;
  return base + dpa + treaties;
};

export const TravelRiskTool = () => {
  const sorted = useMemo(
    () => [...JURISDICTIONS].sort((a, b) => a.jurisdiction.localeCompare(b.jurisdiction)),
    [],
  );

  const initialFromUrl = () => {
    if (typeof window === "undefined") return { from: "", to: "" };
    const p = new URLSearchParams(window.location.search);
    return { from: p.get("from") ?? "DEU", to: p.get("to") ?? "USA" };
  };

  const [{ from, to }, setPair] = useState(initialFromUrl);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (from) p.set("from", from);
    else p.delete("from");
    if (to) p.set("to", to);
    else p.delete("to");
    const qs = p.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? "?" + qs : ""}`);
  }, [from, to]);

  const fromJ = sorted.find((j) => j.iso3 === from);
  const toJ = sorted.find((j) => j.iso3 === to);

  const fromScore = fromJ ? scoreOf(fromJ) : 0;
  const toScore = toJ ? scoreOf(toJ) : 0;
  const drop = Math.max(0, fromScore - toScore);

  const verdict =
    drop >= 50
      ? { label: "Riesgo alto", color: "hsl(var(--status-none))", Icon: ShieldAlert }
      : drop >= 20
        ? { label: "Precaución", color: "hsl(var(--status-partial))", Icon: Shield }
        : { label: "Datos a salvo", color: "hsl(var(--status-comprehensive))", Icon: ShieldCheck };

  const overlap = fromJ && toJ
    ? CORE_TREATIES.filter((t) => fromJ.treaties[t] && toJ.treaties[t])
    : [];

  return (
    <Card className="p-5 shadow-soft">
      <div className="flex items-center gap-2 mb-1">
        <Plane className="h-4 w-4 text-accent" />
        <h3 className="font-display text-2xl">¿Tus datos viajan seguros?</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Compara dos países y mide la caída en protección de datos cuando tu información cruza la frontera.
      </p>

      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Origen</div>
          <Select value={from} onValueChange={(v) => setPair({ from: v, to })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {sorted.filter((j) => j.iso3).map((j) => (
                <SelectItem key={j.iso3!} value={j.iso3!}>{j.jurisdiction}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ArrowRight className="hidden sm:block h-5 w-5 text-muted-foreground self-end mb-2" />
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Destino</div>
          <Select value={to} onValueChange={(v) => setPair({ from, to: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {sorted.filter((j) => j.iso3).map((j) => (
                <SelectItem key={j.iso3!} value={j.iso3!}>{j.jurisdiction}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {fromJ && toJ && (
        <div className="mt-5 grid sm:grid-cols-[1fr_auto] gap-4 items-stretch">
          <div className="rounded-xl border border-border p-4 bg-secondary/30">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs text-muted-foreground">Caída de protección</span>
              <span className="font-display text-3xl font-black tabular-nums" style={{ color: verdict.color }}>
                −{drop}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${Math.min(100, drop)}%`, background: verdict.color }}
              />
            </div>
            <div className="flex items-baseline justify-between mt-3 text-xs text-muted-foreground">
              <span>{fromJ.jurisdiction}: <strong className="text-foreground">{fromScore}</strong></span>
              <span>{toJ.jurisdiction}: <strong className="text-foreground">{toScore}</strong></span>
            </div>
            {overlap.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                  Tratados en común
                </div>
                <div className="flex flex-wrap gap-1">
                  {overlap.map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px]">
                      {TREATY_LABELS[t]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div
            className="rounded-xl p-4 flex flex-col items-center justify-center text-white min-w-[140px]"
            style={{ background: verdict.color }}
          >
            <verdict.Icon className="h-8 w-8 mb-1" />
            <div className="font-display text-lg font-bold text-center leading-tight">
              {verdict.label}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
