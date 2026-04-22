import { useEffect, useMemo, useState } from "react";
import { CORE_TREATIES, JURISDICTIONS, Jurisdiction, TREATY_LABELS } from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeftRight,
  Plane,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Info,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const scoreOf = (j: Jurisdiction): number => {
  const base = j.lawStatus === "comprehensive" ? 80 : j.lawStatus === "partial" ? 40 : 0;
  const dpa = j.hasDPA ? 10 : 0;
  const treaties = CORE_TREATIES.some((t) => j.treaties[t]) ? 10 : 0;
  return base + dpa + treaties;
};

interface ComboProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  options: Jurisdiction[];
  noResults: string;
}

const CountryCombo = ({
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  options,
  noResults,
}: ComboProps) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.iso3 === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between h-11 text-base font-normal"
        >
          <span className="truncate">{selected?.jurisdiction ?? placeholder}</span>
          <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{noResults}</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.iso3}
                  value={`${o.jurisdiction} ${o.iso3}`}
                  onSelect={() => {
                    onChange(o.iso3!);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === o.iso3 ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {o.jurisdiction}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const TravelRiskTool = () => {
  const { t } = useT();
  const sorted = useMemo(
    () =>
      [...JURISDICTIONS]
        .filter((j) => j.iso3)
        .sort((a, b) => a.jurisdiction.localeCompare(b.jurisdiction)),
    [],
  );

  const initialFromUrl = () => {
    if (typeof window === "undefined") return { from: "DEU", to: "USA" };
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
  const rawDelta = toScore - fromScore; // positive = upgrade, negative = drop
  const drop = Math.max(0, -rawDelta);
  const upgrade = Math.max(0, rawDelta);

  const verdict =
    drop >= 50
      ? { label: t("trv.high"), color: "hsl(var(--status-none))", Icon: ShieldAlert }
      : drop >= 20
        ? { label: t("trv.caution"), color: "hsl(var(--status-partial))", Icon: Shield }
        : { label: t("trv.safe"), color: "hsl(var(--status-comprehensive))", Icon: ShieldCheck };

  const overlap = fromJ && toJ ? CORE_TREATIES.filter((tk) => fromJ.treaties[tk] && toJ.treaties[tk]) : [];

  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-1">
        <Plane className="h-5 w-5 text-accent" />
        <h3 className="font-display text-2xl">{t("trv.title")}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">{t("trv.lead")}</p>

      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
            {t("trv.from")}
          </div>
          <CountryCombo
            value={from}
            onChange={(v) => setPair({ from: v, to })}
            placeholder={t("trv.from")}
            searchPlaceholder={t("trv.search")}
            options={sorted}
            noResults={t("cc.noresults")}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 self-end"
          onClick={() => setPair({ from: to, to: from })}
          aria-label={t("trv.swap")}
          title={t("trv.swap")}
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
            {t("trv.to")}
          </div>
          <CountryCombo
            value={to}
            onChange={(v) => setPair({ from, to: v })}
            placeholder={t("trv.to")}
            searchPlaceholder={t("trv.search")}
            options={sorted}
            noResults={t("cc.noresults")}
          />
        </div>
      </div>

      {fromJ && toJ && (
        <div className="mt-6 grid sm:grid-cols-[1fr_auto] gap-4 items-stretch">
          <div className="rounded-xl border border-border p-5 bg-secondary/30">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {drop > 0 ? t("trv.drop") : upgrade > 0 ? t("trv.improvement") : t("trv.drop")}
              </span>
              <span
                className="font-display text-4xl font-black tabular-nums"
                style={{ color: verdict.color }}
              >
                {drop > 0 ? `−${drop}` : upgrade > 0 ? `+${upgrade}` : "0"}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(drop, upgrade))}%`,
                  background: verdict.color,
                }}
              />
            </div>
            <div className="flex items-baseline justify-between mt-3 text-sm text-muted-foreground">
              <span>
                {fromJ.jurisdiction}: <strong className="text-foreground tabular-nums">{fromScore}</strong>
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
              <span>
                {toJ.jurisdiction}: <strong className="text-foreground tabular-nums">{toScore}</strong>
              </span>
            </div>
            {overlap.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                  {t("trv.shared")}
                </div>
                <div className="flex flex-wrap gap-1">
                  {overlap.map((tk) => (
                    <Badge key={tk} variant="outline" className="text-xs">
                      {TREATY_LABELS[tk]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div
            className="rounded-xl p-5 flex flex-col items-center justify-center text-white min-w-[160px]"
            style={{ background: verdict.color }}
          >
            <verdict.Icon className="h-10 w-10 mb-2" />
            <div className="text-[10px] uppercase tracking-widest opacity-80">
              {t("trv.verdict.label")}
            </div>
            <div className="font-display text-xl font-bold text-center leading-tight mt-1">
              {verdict.label}
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold">{t("trv.howtitle")}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{t("trv.how1")}</p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside marker:text-accent">
          <li>{t("trv.how.law")}</li>
          <li>{t("trv.how.dpa")}</li>
          <li>{t("trv.how.treaty")}</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-2">{t("trv.how.drop")}</p>
      </div>
    </Card>
  );
};
