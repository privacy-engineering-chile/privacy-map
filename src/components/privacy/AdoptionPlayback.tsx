import { useEffect, useMemo, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Jurisdiction, YEAR_MAX, YEAR_MIN } from "@/data/jurisdictions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const ID_TO_ISO3: Record<string, string> = {
  "004":"AFG","008":"ALB","012":"DZA","020":"AND","024":"AGO","028":"ATG","032":"ARG","051":"ARM","036":"AUS","040":"AUT","031":"AZE","044":"BHS","048":"BHR","050":"BGD","052":"BRB","112":"BLR","056":"BEL","084":"BLZ","204":"BEN","064":"BTN","068":"BOL","070":"BIH","072":"BWA","076":"BRA","100":"BGR","854":"BFA","108":"BDI","132":"CPV","116":"KHM","120":"CMR","124":"CAN","140":"CAF","148":"TCD","152":"CHL","156":"CHN","170":"COL","174":"COM","178":"COG","188":"CRI","384":"CIV","191":"HRV","192":"CUB","196":"CYP","203":"CZE","180":"COD","208":"DNK","262":"DJI","212":"DMA","214":"DOM","218":"ECU","818":"EGY","222":"SLV","226":"GNQ","232":"ERI","233":"EST","748":"SWZ","231":"ETH","234":"FRO","242":"FJI","246":"FIN","250":"FRA","266":"GAB","270":"GMB","268":"GEO","276":"DEU","288":"GHA","300":"GRC","304":"GRL","308":"GRD","320":"GTM","324":"GIN","624":"GNB","328":"GUY","332":"HTI","340":"HND","348":"HUN","352":"ISL","356":"IND","360":"IDN","364":"IRN","368":"IRQ","372":"IRL","376":"ISR","380":"ITA","388":"JAM","392":"JPN","400":"JOR","398":"KAZ","404":"KEN","296":"KIR","408":"PRK","410":"KOR","414":"KWT","417":"KGZ","418":"LAO","428":"LVA","422":"LBN","426":"LSO","430":"LBR","434":"LBY","438":"LIE","440":"LTU","442":"LUX","450":"MDG","454":"MWI","458":"MYS","462":"MDV","466":"MLI","470":"MLT","584":"MHL","478":"MRT","480":"MUS","484":"MEX","583":"FSM","498":"MDA","492":"MCO","496":"MNG","499":"MNE","504":"MAR","508":"MOZ","104":"MMR","516":"NAM","520":"NRU","524":"NPL","528":"NLD","554":"NZL","558":"NIC","562":"NER","566":"NGA","807":"MKD","578":"NOR","512":"OMN","586":"PAK","585":"PLW","591":"PAN","598":"PNG","600":"PRY","604":"PER","608":"PHL","616":"POL","620":"PRT","634":"QAT","642":"ROU","643":"RUS","646":"RWA","659":"KNA","662":"LCA","670":"VCT","882":"WSM","674":"SMR","678":"STP","682":"SAU","686":"SEN","688":"SRB","690":"SYC","694":"SLE","702":"SGP","703":"SVK","705":"SVN","090":"SLB","706":"SOM","710":"ZAF","728":"SSD","724":"ESP","144":"LKA","729":"SDN","740":"SUR","752":"SWE","756":"CHE","760":"SYR","762":"TJK","834":"TZA","764":"THA","626":"TLS","768":"TGO","776":"TON","780":"TTO","788":"TUN","792":"TUR","795":"TKM","798":"TUV","800":"UGA","804":"UKR","784":"ARE","826":"GBR","840":"USA","858":"URY","860":"UZB","548":"VUT","862":"VEN","704":"VNM","887":"YEM","894":"ZMB","716":"ZWE",
};

interface Props {
  data: Jurisdiction[];
}

const SPEEDS = [1, 2, 4] as const;

export const AdoptionPlayback = ({ data }: Props) => {
  const [year, setYear] = useState(YEAR_MIN);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(2);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);

  const byIso = useMemo(() => {
    const m = new Map<string, Jurisdiction>();
    data.forEach((j) => j.iso3 && j.year && m.set(j.iso3, j));
    return m;
  }, [data]);

  const cumulative = useMemo(
    () => Array.from(byIso.values()).filter((j) => (j.year ?? 9999) <= year).length,
    [byIso, year],
  );

  useEffect(() => {
    if (!playing) {
      if (raf.current) cancelAnimationFrame(raf.current);
      return;
    }
    const stepMs = 220 / speed;
    const tick = (t: number) => {
      if (t - last.current >= stepMs) {
        last.current = t;
        setYear((y) => {
          if (y >= YEAR_MAX) {
            setPlaying(false);
            return y;
          }
          return y + 1;
        });
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, speed]);

  const reset = () => {
    setPlaying(false);
    setYear(YEAR_MIN);
  };

  return (
    <Card className="p-5 shadow-soft">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-display text-2xl">El mundo se enciende</h3>
          <p className="text-xs text-muted-foreground">
            Cada país se ilumina cuando adopta su primera ley integral.
          </p>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-5xl font-black tabular-nums text-accent">{year}</span>
          <span className="text-xs text-muted-foreground">
            · {cumulative} con ley
          </span>
        </div>
      </div>

      <div className="mt-3 relative bg-card rounded-xl overflow-hidden border border-border">
        <ComposableMap
          projectionConfig={{ scale: 140 }}
          width={980}
          height={440}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso = ID_TO_ISO3[String(geo.id).padStart(3, "0")];
                const j = iso ? byIso.get(iso) : undefined;
                const lit = j && (j.year ?? 9999) <= year;
                const justLit = lit && j && j.year === year;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: lit
                          ? "hsl(var(--status-comprehensive))"
                          : "hsl(var(--map-empty))",
                        stroke: "hsl(var(--map-stroke))",
                        strokeWidth: 0.4,
                        outline: "none",
                        filter: justLit ? "brightness(1.4) drop-shadow(0 0 4px hsl(var(--accent)))" : "none",
                        transition: "fill 600ms ease, filter 600ms ease",
                      },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <Button
          size="sm"
          variant={playing ? "secondary" : "default"}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pausa" : "Play"}
        </Button>
        <Button size="sm" variant="outline" onClick={reset}>
          <RotateCcw className="h-4 w-4" />
          Reiniciar
        </Button>
        <div className="flex items-center gap-1 ml-1">
          {SPEEDS.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={speed === s ? "default" : "ghost"}
              className="h-8 px-2 text-xs"
              onClick={() => setSpeed(s)}
            >
              {s}x
            </Button>
          ))}
        </div>
        <div className="flex-1 min-w-[200px] flex items-center gap-3">
          <span className="text-xs tabular-nums text-muted-foreground">{YEAR_MIN}</span>
          <Slider
            value={[year]}
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={1}
            onValueChange={(v) => {
              setPlaying(false);
              setYear(v[0]);
            }}
            className="flex-1"
          />
          <span className="text-xs tabular-nums text-muted-foreground">{YEAR_MAX}</span>
        </div>
      </div>
    </Card>
  );
};
