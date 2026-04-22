import { useEffect, useMemo, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { JURISDICTIONS, REGION_COLORS, YEAR_MAX, YEAR_MIN } from "@/data/jurisdictions";
import { Play } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Subset map (same as AdoptionPlayback) — reused via inline definition kept short
const ID_TO_ISO3: Record<string, string> = {
  "004":"AFG","008":"ALB","012":"DZA","024":"AGO","032":"ARG","036":"AUS","040":"AUT","050":"BGD","056":"BEL","076":"BRA","100":"BGR","124":"CAN","152":"CHL","156":"CHN","170":"COL","188":"CRI","192":"CUB","196":"CYP","203":"CZE","208":"DNK","218":"ECU","222":"SLV","231":"ETH","233":"EST","246":"FIN","250":"FRA","268":"GEO","276":"DEU","288":"GHA","300":"GRC","320":"GTM","324":"GIN","332":"HTI","340":"HND","348":"HUN","352":"ISL","356":"IND","360":"IDN","364":"IRN","368":"IRQ","372":"IRL","376":"ISR","380":"ITA","388":"JAM","392":"JPN","398":"KAZ","404":"KEN","408":"PRK","410":"KOR","414":"KWT","417":"KGZ","418":"LAO","422":"LBN","428":"LVA","434":"LBY","440":"LTU","442":"LUX","450":"MDG","454":"MWI","458":"MYS","466":"MLI","478":"MRT","480":"MUS","484":"MEX","498":"MDA","504":"MAR","508":"MOZ","512":"OMN","516":"NAM","524":"NPL","528":"NLD","554":"NZL","558":"NIC","562":"NER","566":"NGA","578":"NOR","586":"PAK","591":"PAN","598":"PNG","600":"PRY","604":"PER","608":"PHL","616":"POL","620":"PRT","624":"GNB","626":"TLS","634":"QAT","642":"ROU","643":"RUS","646":"RWA","682":"SAU","686":"SEN","688":"SRB","694":"SLE","702":"SGP","703":"SVK","704":"VNM","705":"SVN","706":"SOM","710":"ZAF","716":"ZWE","724":"ESP","728":"SSD","729":"SDN","748":"SWZ","752":"SWE","756":"CHE","760":"SYR","762":"TJK","764":"THA","768":"TGO","780":"TTO","784":"ARE","788":"TUN","792":"TUR","800":"UGA","804":"UKR","818":"EGY","826":"GBR","834":"TZA","840":"USA","854":"BFA","858":"URY","860":"UZB","862":"VEN","887":"YEM","894":"ZMB","051":"ARM","068":"BOL","070":"BIH","072":"BWA","086":"IOT","090":"SLB","104":"MMR","108":"BDI","112":"BLR","116":"KHM","120":"CMR","132":"CPV","140":"CAF","144":"LKA","148":"TCD","174":"COM","178":"COG","180":"COD","204":"BEN","226":"GNQ","232":"ERI","270":"GMB","384":"CIV","426":"LSO","430":"LBR","438":"LIE","462":"MDV","492":"MCO","496":"MNG","499":"MNE","807":"MKD","531":"CUW","548":"VUT","678":"STP","690":"SYC",
};

interface Props {
  total: number;
}

export const HeroAdoptionGlobe = ({ total }: Props) => {
  const [year, setYear] = useState(YEAR_MAX);
  const [animating, setAnimating] = useState(true);
  const raf = useRef<number | null>(null);
  const { t } = useT();

  const byIso = useMemo(() => {
    const m = new Map<string, { year: number; region: string }>();
    JURISDICTIONS.forEach((j) => {
      if (j.iso3 && j.year && j.lawStatus === "comprehensive") {
        m.set(j.iso3, { year: j.year, region: j.region });
      }
    });
    return m;
  }, []);

  const cumulative = useMemo(
    () => Array.from(byIso.values()).filter((j) => j.year <= year).length,
    [byIso, year],
  );

  useEffect(() => {
    if (!animating) return;
    setYear(YEAR_MIN);
    let start = 0;
    const duration = 6000; // 6s sweep
    const loop = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const y = Math.round(YEAR_MIN + (YEAR_MAX - YEAR_MIN) * p);
      setYear(y);
      if (p < 1) {
        raf.current = requestAnimationFrame(loop);
      } else {
        setAnimating(false);
      }
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [animating]);

  return (
    <div className="relative">
      <div className="rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm border border-border/50 shadow-soft">
        <ComposableMap
          projectionConfig={{ scale: 145 }}
          width={900}
          height={420}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso = ID_TO_ISO3[String(geo.id).padStart(3, "0")];
                const j = iso ? byIso.get(iso) : undefined;
                const lit = j && j.year <= year;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: lit
                          ? REGION_COLORS[j!.region] ?? "hsl(var(--status-comprehensive))"
                          : "hsl(var(--map-empty) / 0.55)",
                        stroke: "hsl(var(--map-stroke) / 0.5)",
                        strokeWidth: 0.3,
                        outline: "none",
                        transition: "fill 500ms ease",
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

      {/* Year ticker overlay */}
      <div className="absolute top-3 left-3 flex items-baseline gap-2 bg-background/85 backdrop-blur px-3 py-1.5 rounded-full border border-border/60">
        <span className="font-display text-2xl font-black tabular-nums text-accent leading-none">
          {year}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {t("globe.cumulative", { n: cumulative, total })}
        </span>
      </div>

      {!animating && (
        <button
          onClick={() => setAnimating(true)}
          aria-label={t("globe.replay")}
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 h-8 bg-background/85 backdrop-blur rounded-full border border-border/60 hover:bg-accent hover:text-accent-foreground transition-colors text-xs font-semibold"
        >
          {t("globe.replayLabel")}
        </button>
      )}
    </div>
  );
};
