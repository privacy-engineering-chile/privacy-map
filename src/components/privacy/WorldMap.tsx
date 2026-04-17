import { useMemo, useState, forwardRef } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import {
  Jurisdiction,
  REGION_COLORS,
  STATUS_COLOR,
  STATUS_LABEL,
  YEAR_MAX,
  YEAR_MIN,
} from "@/data/jurisdictions";
import { Filters } from "@/hooks/useFilters";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Props {
  filtered: Jurisdiction[];
  filters: Filters;
  onSelect: (j: Jurisdiction) => void;
  selected?: Jurisdiction | null;
}

// Map world-atlas numeric ids -> ISO3
const ID_TO_ISO3: Record<string, string> = {
  "004":"AFG","008":"ALB","012":"DZA","020":"AND","024":"AGO","028":"ATG","032":"ARG","051":"ARM","036":"AUS","040":"AUT","031":"AZE","044":"BHS","048":"BHR","050":"BGD","052":"BRB","112":"BLR","056":"BEL","084":"BLZ","204":"BEN","064":"BTN","068":"BOL","070":"BIH","072":"BWA","076":"BRA","100":"BGR","854":"BFA","108":"BDI","132":"CPV","116":"KHM","120":"CMR","124":"CAN","140":"CAF","148":"TCD","152":"CHL","156":"CHN","170":"COL","174":"COM","178":"COG","188":"CRI","384":"CIV","191":"HRV","192":"CUB","196":"CYP","203":"CZE","180":"COD","208":"DNK","262":"DJI","212":"DMA","214":"DOM","218":"ECU","818":"EGY","222":"SLV","226":"GNQ","232":"ERI","233":"EST","748":"SWZ","231":"ETH","234":"FRO","242":"FJI","246":"FIN","250":"FRA","266":"GAB","270":"GMB","268":"GEO","276":"DEU","288":"GHA","300":"GRC","304":"GRL","308":"GRD","320":"GTM","324":"GIN","624":"GNB","328":"GUY","332":"HTI","340":"HND","348":"HUN","352":"ISL","356":"IND","360":"IDN","364":"IRN","368":"IRQ","372":"IRL","376":"ISR","380":"ITA","388":"JAM","392":"JPN","400":"JOR","398":"KAZ","404":"KEN","296":"KIR","408":"PRK","410":"KOR","414":"KWT","417":"KGZ","418":"LAO","428":"LVA","422":"LBN","426":"LSO","430":"LBR","434":"LBY","438":"LIE","440":"LTU","442":"LUX","450":"MDG","454":"MWI","458":"MYS","462":"MDV","466":"MLI","470":"MLT","584":"MHL","478":"MRT","480":"MUS","484":"MEX","583":"FSM","498":"MDA","492":"MCO","496":"MNG","499":"MNE","504":"MAR","508":"MOZ","104":"MMR","516":"NAM","520":"NRU","524":"NPL","528":"NLD","554":"NZL","558":"NIC","562":"NER","566":"NGA","807":"MKD","578":"NOR","512":"OMN","586":"PAK","585":"PLW","591":"PAN","598":"PNG","600":"PRY","604":"PER","608":"PHL","616":"POL","620":"PRT","634":"QAT","642":"ROU","643":"RUS","646":"RWA","659":"KNA","662":"LCA","670":"VCT","882":"WSM","674":"SMR","678":"STP","682":"SAU","686":"SEN","688":"SRB","690":"SYC","694":"SLE","702":"SGP","703":"SVK","705":"SVN","090":"SLB","706":"SOM","710":"ZAF","728":"SSD","724":"ESP","144":"LKA","729":"SDN","740":"SUR","752":"SWE","756":"CHE","760":"SYR","762":"TJK","834":"TZA","764":"THA","626":"TLS","768":"TGO","776":"TON","780":"TTO","788":"TUN","792":"TUR","795":"TKM","798":"TUV","800":"UGA","804":"UKR","784":"ARE","826":"GBR","840":"USA","858":"URY","860":"UZB","548":"VUT","862":"VEN","704":"VNM","887":"YEM","894":"ZMB","716":"ZWE",
};

export const WorldMap = forwardRef<HTMLDivElement, Props>(
  ({ filtered, filters, onSelect, selected }, ref) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; j: Jurisdiction } | null>(null);

    const byIso = useMemo(() => {
      const m = new Map<string, Jurisdiction>();
      filtered.forEach((j) => j.iso3 && m.set(j.iso3, j));
      return m;
    }, [filtered]);

    const yearScale = useMemo(
      () =>
        scaleLinear<string>()
          .domain([YEAR_MIN, YEAR_MAX])
          .range(["hsl(178 62% 75%)", "hsl(326 90% 45%)"]),
      [],
    );

    const colorFor = (j: Jurisdiction) => {
      if (filters.colorMode === "region") return REGION_COLORS[j.region] ?? "hsl(var(--muted))";
      if (filters.colorMode === "year") {
        if (!j.year) return "hsl(var(--muted))";
        return yearScale(j.year);
      }
      if (filters.colorMode === "dpa") {
        return j.hasDPA ? "hsl(var(--status-comprehensive))" : "hsl(var(--status-none))";
      }
      return STATUS_COLOR[j.lawStatus];
    };

    return (
      <div
        ref={ref}
        className="relative w-full bg-card rounded-2xl shadow-soft overflow-hidden border border-border"
      >
        <ComposableMap
          projectionConfig={{ scale: 155 }}
          width={980}
          height={500}
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const iso = ID_TO_ISO3[String(geo.id).padStart(3, "0")];
                  const j = iso ? byIso.get(iso) : undefined;
                  const isSel = j && selected && j.iso3 === selected.iso3;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => j && setTooltip({ x: e.clientX, y: e.clientY, j })}
                      onMouseMove={(e) => j && setTooltip({ x: e.clientX, y: e.clientY, j })}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => j && onSelect(j)}
                      style={{
                        default: {
                          fill: j ? colorFor(j) : "hsl(var(--map-empty))",
                          stroke: "hsl(var(--map-stroke))",
                          strokeWidth: isSel ? 1.4 : 0.4,
                          outline: "none",
                          cursor: j ? "pointer" : "default",
                          transition: "fill 0.4s ease",
                        },
                        hover: {
                          fill: j ? colorFor(j) : "hsl(var(--map-empty))",
                          stroke: "hsl(var(--accent))",
                          strokeWidth: 1.2,
                          outline: "none",
                          filter: j ? "brightness(1.15)" : "none",
                        },
                        pressed: {
                          fill: j ? colorFor(j) : "hsl(var(--map-empty))",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {tooltip && (
          <div
            className="fixed pointer-events-none z-50 px-3 py-2 rounded-lg bg-foreground text-background text-xs shadow-pop max-w-[240px]"
            style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
          >
            <div className="font-semibold">{tooltip.j.jurisdiction}</div>
            <div className="opacity-80">
              {tooltip.j.subRegion}
              {tooltip.j.year ? ` · ${tooltip.j.year}` : ""}
            </div>
            <div className="mt-0.5" style={{ color: STATUS_COLOR[tooltip.j.lawStatus] }}>
              {STATUS_LABEL[tooltip.j.lawStatus]}
              {tooltip.j.hasDPA ? " · DPA" : ""}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-3 bg-background/85 backdrop-blur rounded-xl px-3 py-2 text-xs border border-border">
          {filters.colorMode === "status" && (
            <>
              <LegendDot color={STATUS_COLOR.comprehensive} label="Ley integral" />
              <LegendDot color={STATUS_COLOR.partial} label="Sectorial" />
              <LegendDot color={STATUS_COLOR.none} label="Sin ley" />
            </>
          )}
          {filters.colorMode === "dpa" && (
            <>
              <LegendDot color="hsl(var(--status-comprehensive))" label="Con DPA" />
              <LegendDot color="hsl(var(--status-none))" label="Sin DPA" />
            </>
          )}
          {filters.colorMode === "region" &&
            Object.entries(REGION_COLORS).map(([r, c]) => (
              <LegendDot
                key={r}
                color={c}
                label={r === "Latin America and the Caribbean" ? "LatAm & Caribe" : r}
              />
            ))}
          {filters.colorMode === "year" && (
            <div className="flex items-center gap-2 flex-1 min-w-[160px]">
              <span className="tabular-nums">{YEAR_MIN}</span>
              <div
                className="h-2 flex-1 rounded-full"
                style={{
                  background: "linear-gradient(90deg, hsl(178 62% 75%), hsl(326 90% 45%))",
                }}
              />
              <span className="tabular-nums">{YEAR_MAX}</span>
            </div>
          )}
          <span className="ml-auto text-muted-foreground">
            {filtered.length} jurisdicciones · gris = sin datos
          </span>
        </div>
      </div>
    );
  },
);
WorldMap.displayName = "WorldMap";

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-1.5">
    <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
    <span>{label}</span>
  </div>
);
