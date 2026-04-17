import { useEffect, useMemo, useState } from "react";
import {
  CORE_TREATIES,
  Jurisdiction,
  JURISDICTIONS,
  REGION_COLORS,
  STATUS_COLOR,
  STATUS_LABEL,
  TREATY_LABELS,
} from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, X, Check } from "lucide-react";

const ISO_TO_FLAG = (iso3?: string | null) => {
  if (!iso3) return "🌐";
  const map: Record<string, string> = {
    AFG:"AF",ALB:"AL",DZA:"DZ",AND:"AD",AGO:"AO",ATG:"AG",ARG:"AR",ARM:"AM",AUS:"AU",AUT:"AT",AZE:"AZ",BHS:"BS",BHR:"BH",BGD:"BD",BRB:"BB",BLR:"BY",BEL:"BE",BLZ:"BZ",BEN:"BJ",BTN:"BT",BIH:"BA",BWA:"BW",BRA:"BR",BGR:"BG",BFA:"BF",BDI:"BI",CPV:"CV",KHM:"KH",CMR:"CM",CAN:"CA",CAF:"CF",TCD:"TD",CHL:"CL",CHN:"CN",COL:"CO",COM:"KM",COG:"CG",CRI:"CR",CIV:"CI",HRV:"HR",CUB:"CU",CYP:"CY",CZE:"CZ",COD:"CD",DNK:"DK",DJI:"DJ",DMA:"DM",DOM:"DO",ECU:"EC",EGY:"EG",SLV:"SV",GNQ:"GQ",ERI:"ER",EST:"EE",SWZ:"SZ",ETH:"ET",FJI:"FJ",FIN:"FI",FRA:"FR",GAB:"GA",GMB:"GM",GEO:"GE",DEU:"DE",GHA:"GH",GRC:"GR",GRD:"GD",GTM:"GT",GIN:"GN",GNB:"GW",GUY:"GY",HTI:"HT",HND:"HN",HUN:"HU",ISL:"IS",IND:"IN",IDN:"ID",IRN:"IR",IRQ:"IQ",IRL:"IE",ISR:"IL",ITA:"IT",JAM:"JM",JPN:"JP",JOR:"JO",KAZ:"KZ",KEN:"KE",KIR:"KI",PRK:"KP",KOR:"KR",KWT:"KW",KGZ:"KG",LAO:"LA",LVA:"LV",LBN:"LB",LSO:"LS",LBR:"LR",LBY:"LY",LIE:"LI",LTU:"LT",LUX:"LU",MDG:"MG",MWI:"MW",MYS:"MY",MDV:"MV",MLI:"ML",MLT:"MT",MHL:"MH",MRT:"MR",MUS:"MU",MEX:"MX",FSM:"FM",MDA:"MD",MCO:"MC",MNG:"MN",MNE:"ME",MAR:"MA",MOZ:"MZ",MMR:"MM",NAM:"NA",NRU:"NR",NPL:"NP",NLD:"NL",NZL:"NZ",NIC:"NI",NER:"NE",NGA:"NG",MKD:"MK",NOR:"NO",OMN:"OM",PAK:"PK",PLW:"PW",PAN:"PA",PNG:"PG",PRY:"PY",PER:"PE",PHL:"PH",POL:"PL",PRT:"PT",QAT:"QA",ROU:"RO",RUS:"RU",RWA:"RW",KNA:"KN",LCA:"LC",VCT:"VC",WSM:"WS",SMR:"SM",STP:"ST",SAU:"SA",SEN:"SN",SRB:"RS",SYC:"SC",SLE:"SL",SGP:"SG",SVK:"SK",SVN:"SI",SLB:"SB",SOM:"SO",ZAF:"ZA",SSD:"SS",ESP:"ES",LKA:"LK",SDN:"SD",SUR:"SR",SWE:"SE",CHE:"CH",SYR:"SY",TJK:"TJ",TZA:"TZ",THA:"TH",TLS:"TL",TGO:"TG",TON:"TO",TTO:"TT",TUN:"TN",TUR:"TR",TKM:"TM",TUV:"TV",UGA:"UG",UKR:"UA",ARE:"AE",GBR:"GB",USA:"US",URY:"UY",UZB:"UZ",VUT:"VU",VEN:"VE",VNM:"VN",YEM:"YE",ZMB:"ZM",ZWE:"ZW",
  };
  const c = map[iso3];
  if (!c) return "🌐";
  return String.fromCodePoint(...c.split("").map((x) => 0x1f1e6 + x.charCodeAt(0) - 65));
};

const MAX = 4;
const DEFAULTS = ["USA", "BRA", "DEU", "JPN"];

const decode = (): string[] => {
  if (typeof window === "undefined") return DEFAULTS;
  const p = new URLSearchParams(window.location.search).get("cmp");
  if (!p) return DEFAULTS;
  return p.split(",").filter(Boolean).slice(0, MAX);
};

export const CountryComparator = ({ onSelect }: { onSelect: (j: Jurisdiction) => void }) => {
  const [iso3s, setIso3s] = useState<string[]>(decode);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (iso3s.length && !(iso3s.length === DEFAULTS.length && iso3s.every((v, i) => v === DEFAULTS[i]))) {
      url.searchParams.set("cmp", iso3s.join(","));
    } else {
      url.searchParams.delete("cmp");
    }
    window.history.replaceState(null, "", url.pathname + (url.search || ""));
  }, [iso3s]);

  const selected = useMemo(
    () =>
      iso3s
        .map((iso) => JURISDICTIONS.find((j) => j.iso3 === iso))
        .filter(Boolean) as Jurisdiction[],
    [iso3s],
  );

  const maxAge = useMemo(() => {
    const ages = selected.map((j) =>
      j.keyLawYear ? new Date().getFullYear() - j.keyLawYear : 0,
    );
    return Math.max(1, ...ages);
  }, [selected]);

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return JURISDICTIONS.filter(
      (j) => j.iso3 && !iso3s.includes(j.iso3) && (!q || j.jurisdiction.toLowerCase().includes(q)),
    ).slice(0, 80);
  }, [query, iso3s]);

  const add = (iso: string) => {
    if (iso3s.length >= MAX) return;
    setIso3s([...iso3s, iso]);
    setQuery("");
    setOpen(false);
  };

  const remove = (iso: string) => setIso3s(iso3s.filter((x) => x !== iso));

  return (
    <Card className="p-5 shadow-soft">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-display text-2xl">Compara hasta {MAX} países</h3>
          <p className="text-xs text-muted-foreground">
            Leyes, autoridad, tratados y antigüedad — lado a lado.
          </p>
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={iso3s.length >= MAX}
              className="gap-1"
            >
              <Plus className="h-4 w-4" /> Añadir país
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="end">
            <Input
              autoFocus
              placeholder="Buscar país…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 text-sm"
            />
            <div className="mt-2 max-h-72 overflow-y-auto">
              {candidates.length === 0 && (
                <div className="text-xs text-muted-foreground p-2">Sin resultados.</div>
              )}
              {candidates.map((j) => (
                <button
                  key={j.iso3}
                  onClick={() => add(j.iso3!)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted text-left"
                >
                  <span>{ISO_TO_FLAG(j.iso3)}</span>
                  <span className="flex-1 truncate">{j.jurisdiction}</span>
                  <span className="text-[10px] text-muted-foreground">{j.iso3}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {selected.length === 0 ? (
        <div className="mt-6 text-sm text-muted-foreground text-center py-12 border border-dashed border-border rounded-xl">
          Añade países para comenzar la comparación.
        </div>
      ) : (
        <div
          className="mt-5 grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${selected.length}, minmax(0, 1fr))`,
          }}
        >
          {selected.map((j) => {
            const age = j.keyLawYear ? new Date().getFullYear() - j.keyLawYear : 0;
            const pct = (age / maxAge) * 100;
            return (
              <div
                key={j.iso3}
                className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 relative"
                style={{ borderTopColor: REGION_COLORS[j.region], borderTopWidth: 3 }}
              >
                <button
                  onClick={() => remove(j.iso3!)}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
                  aria-label="Quitar"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => onSelect(j)} className="text-left">
                  <div className="text-4xl leading-none">{ISO_TO_FLAG(j.iso3)}</div>
                  <div className="font-display text-lg font-bold mt-1 truncate">
                    {j.jurisdiction}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {j.subRegion}
                  </div>
                </button>

                <div>
                  <Badge
                    style={{
                      background: STATUS_COLOR[j.lawStatus],
                      color: "hsl(var(--background))",
                    }}
                    className="text-[10px]"
                  >
                    {STATUS_LABEL[j.lawStatus]}
                  </Badge>
                </div>

                <div className="text-xs space-y-1">
                  <div className="text-muted-foreground uppercase tracking-wider text-[9px]">
                    Ley vigente
                  </div>
                  <div className="line-clamp-2 font-medium">
                    {j.keyLawName ?? "—"}
                  </div>
                  {j.keyLawYear && (
                    <div className="text-muted-foreground">{j.keyLawYear}</div>
                  )}
                </div>

                {j.firstLawYear && j.firstLawYear !== j.keyLawYear && (
                  <div className="text-xs">
                    <div className="text-muted-foreground uppercase tracking-wider text-[9px]">
                      Primera ley
                    </div>
                    <div className="text-muted-foreground">{j.firstLawYear}</div>
                  </div>
                )}

                <div className="text-xs">
                  <div className="text-muted-foreground uppercase tracking-wider text-[9px]">
                    Antigüedad ley vigente
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="tabular-nums font-semibold">{age}a</span>
                  </div>
                </div>

                <div className="text-xs">
                  <div className="text-muted-foreground uppercase tracking-wider text-[9px] mb-1">
                    Autoridad (DPA)
                  </div>
                  <div className={j.hasDPA ? "" : "text-muted-foreground italic"}>
                    {j.hasDPA ? j.dpa ?? "Sí" : "Sin autoridad"}
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground uppercase tracking-wider text-[9px] mb-1.5">
                    Tratados
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {CORE_TREATIES.map((t) => {
                      const has = j.treaties[t];
                      return (
                        <div
                          key={t}
                          className="flex items-center gap-1 text-[10px]"
                          title={TREATY_LABELS[t]}
                        >
                          <span
                            className={`h-3 w-3 rounded-full flex items-center justify-center ${
                              has ? "" : "opacity-20"
                            }`}
                            style={{ background: `hsl(var(--treaty-${
                              t === "malaboRatified" ? "malabo" :
                              t === "conv108plus" ? "conv108plus" : t
                            }))` }}
                          >
                            {has && <Check className="h-2 w-2 text-background" strokeWidth={4} />}
                          </span>
                          <span className="truncate">{TREATY_LABELS[t]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {(j.ldc || j.lldc || j.sids) && (
                  <div className="flex flex-wrap gap-1">
                    {j.ldc && <Badge variant="outline" className="text-[9px]">LDC</Badge>}
                    {j.lldc && <Badge variant="outline" className="text-[9px]">LLDC</Badge>}
                    {j.sids && <Badge variant="outline" className="text-[9px]">SIDS</Badge>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
