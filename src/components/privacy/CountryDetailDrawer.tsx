import {
  BLOCS,
  CORE_TREATIES,
  Jurisdiction,
  JURISDICTIONS,
  REGION_COLORS,
  STATUS_COLOR,
  STATUS_LABEL,
  TREATY_LABELS,
  Treaties,
} from "@/data/jurisdictions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileDown, Building2, Share2, Download } from "lucide-react";
import { downloadCountryCard, shareCountryCard } from "@/lib/generateCountryCard";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Props {
  country: Jurisdiction | null;
  onClose: () => void;
}

const ISO_TO_FLAG = (iso3?: string | null) => {
  if (!iso3) return "🌐";
  const iso2Map: Record<string, string> = {
    AFG:"AF",ALA:"AX",ALB:"AL",DZA:"DZ",AND:"AD",AGO:"AO",ATG:"AG",ARG:"AR",ARM:"AM",ABW:"AW",AUS:"AU",AUT:"AT",AZE:"AZ",BHS:"BS",BHR:"BH",BGD:"BD",BRB:"BB",BLR:"BY",BEL:"BE",BLZ:"BZ",BEN:"BJ",BMU:"BM",BTN:"BT",BES:"BQ",BIH:"BA",BWA:"BW",BRA:"BR",VGB:"VG",BGR:"BG",BFA:"BF",BDI:"BI",CPV:"CV",KHM:"KH",CMR:"CM",CAN:"CA",CYM:"KY",CAF:"CF",TCD:"TD",CHL:"CL",CHN:"CN",HKG:"HK",MAC:"MO",COL:"CO",COM:"KM",COG:"CG",CRI:"CR",CIV:"CI",HRV:"HR",CUB:"CU",CUW:"CW",CYP:"CY",CZE:"CZ",COD:"CD",DNK:"DK",DJI:"DJ",DMA:"DM",DOM:"DO",ECU:"EC",EGY:"EG",SLV:"SV",GNQ:"GQ",ERI:"ER",EST:"EE",SWZ:"SZ",ETH:"ET",FRO:"FO",FJI:"FJ",FIN:"FI",FRA:"FR",GAB:"GA",GMB:"GM",GEO:"GE",DEU:"DE",GHA:"GH",GIB:"GI",GRC:"GR",GRL:"GL",GRD:"GD",GTM:"GT",GGY:"GG",GIN:"GN",GNB:"GW",GUY:"GY",HTI:"HT",HND:"HN",HUN:"HU",ISL:"IS",IND:"IN",IDN:"ID",IRN:"IR",IRQ:"IQ",IRL:"IE",IMN:"IM",ISR:"IL",ITA:"IT",JAM:"JM",JPN:"JP",JEY:"JE",JOR:"JO",KAZ:"KZ",KEN:"KE",KIR:"KI",PRK:"KP",KOR:"KR",XKX:"XK",KWT:"KW",KGZ:"KG",LAO:"LA",LVA:"LV",LBN:"LB",LSO:"LS",LBR:"LR",LBY:"LY",LIE:"LI",LTU:"LT",LUX:"LU",MDG:"MG",MWI:"MW",MYS:"MY",MDV:"MV",MLI:"ML",MLT:"MT",MHL:"MH",MRT:"MR",MUS:"MU",MEX:"MX",FSM:"FM",MDA:"MD",MCO:"MC",MNG:"MN",MNE:"ME",MAR:"MA",MOZ:"MZ",MMR:"MM",NAM:"NA",NRU:"NR",NPL:"NP",NLD:"NL",NZL:"NZ",NIC:"NI",NER:"NE",NGA:"NG",MKD:"MK",NOR:"NO",OMN:"OM",PAK:"PK",PLW:"PW",PAN:"PA",PNG:"PG",PRY:"PY",PER:"PE",PHL:"PH",POL:"PL",PRT:"PT",QAT:"QA",ROU:"RO",RUS:"RU",RWA:"RW",KNA:"KN",LCA:"LC",VCT:"VC",WSM:"WS",SMR:"SM",STP:"ST",SAU:"SA",SEN:"SN",SRB:"RS",SYC:"SC",SLE:"SL",SGP:"SG",SVK:"SK",SVN:"SI",SLB:"SB",SOM:"SO",ZAF:"ZA",SSD:"SS",ESP:"ES",LKA:"LK",SDN:"SD",SUR:"SR",SWE:"SE",CHE:"CH",SYR:"SY",TJK:"TJ",TZA:"TZ",THA:"TH",TLS:"TL",TGO:"TG",TON:"TO",TTO:"TT",TUN:"TN",TUR:"TR",TKM:"TM",TUV:"TV",UGA:"UG",UKR:"UA",ARE:"AE",GBR:"GB",USA:"US",URY:"UY",UZB:"UZ",VUT:"VU",VEN:"VE",VNM:"VN",YEM:"YE",ZMB:"ZM",ZWE:"ZW",
  };
  const code = iso2Map[iso3];
  if (!code) return "🌐";
  return String.fromCodePoint(...code.split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
};

export const CountryDetailDrawer = ({ country, onClose }: Props) => {
  if (!country) return null;

  const sorted = JURISDICTIONS.filter((j) => j.lawStatus === "comprehensive" && j.firstLawYear).sort(
    (a, b) => (a.firstLawYear ?? 9999) - (b.firstLawYear ?? 9999),
  );
  const rank = country.lawStatus === "comprehensive" && country.firstLawYear
    ? sorted.findIndex((j) => j.jurisdiction === country.jurisdiction) + 1
    : null;

  const regionColor = REGION_COLORS[country.region];
  const activeTreaties = (Object.keys(country.treaties) as (keyof Treaties)[]).filter(
    (k) => country.treaties[k],
  );
  const blocs = BLOCS.filter((b) => country.treaties[b.key]);

  return (
    <Sheet open={!!country} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="text-6xl mb-2">{ISO_TO_FLAG(country.iso3)}</div>
          <SheetTitle className="font-display text-3xl">{country.jurisdiction}</SheetTitle>
          <SheetDescription>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: regionColor }} />
              {country.region} · {country.subRegion}
            </span>
          </SheetDescription>
          {(country.ldc || country.lldc || country.sids) && (
            <div className="flex gap-1 mt-2">
              {country.ldc && <Badge variant="outline" className="text-[10px]">LDC</Badge>}
              {country.lldc && <Badge variant="outline" className="text-[10px]">LLDC</Badge>}
              {country.sids && <Badge variant="outline" className="text-[10px]">SIDS</Badge>}
            </div>
          )}
        </SheetHeader>

        {/* Status badge */}
        <div className="mt-5">
          <Badge
            className="text-xs"
            style={{ background: STATUS_COLOR[country.lawStatus], color: "white" }}
          >
            {STATUS_LABEL[country.lawStatus]}
          </Badge>
        </div>

        {/* Key law */}
        {country.keyLawName ? (
          <div className="mt-4 rounded-xl border border-border p-4 bg-card">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Ley clave {country.keyLawYear ? `· ${country.keyLawYear}` : ""}
            </div>
            <div className="text-sm font-medium leading-snug">{country.keyLawName}</div>
            <div className="flex gap-2 mt-3">
              {country.keyLawLink && (
                <Button asChild variant="outline" size="sm">
                  <a href={country.keyLawLink} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" /> Sitio
                  </a>
                </Button>
              )}
              {country.keyLawPDF && (
                <Button asChild variant="outline" size="sm">
                  <a href={country.keyLawPDF} target="_blank" rel="noreferrer">
                    <FileDown className="h-3.5 w-3.5" /> PDF
                  </a>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-status-none/50 p-4 bg-status-none/5">
            <div className="text-sm text-status-none font-medium">
              Sin ley integral de protección de datos identificada.
            </div>
          </div>
        )}

        {/* First law */}
        {country.firstLawName && country.firstLawName !== country.keyLawName && (
          <div className="mt-3 rounded-xl border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Primera ley {country.firstLawYear ? `· ${country.firstLawYear}` : ""}
            </div>
            <div className="text-sm leading-snug">{country.firstLawName}</div>
            <div className="flex gap-2 mt-3">
              {country.firstLawLink && (
                <Button asChild variant="ghost" size="sm">
                  <a href={country.firstLawLink} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" /> Sitio
                  </a>
                </Button>
              )}
              {country.firstLawPDF && (
                <Button asChild variant="ghost" size="sm">
                  <a href={country.firstLawPDF} target="_blank" rel="noreferrer">
                    <FileDown className="h-3.5 w-3.5" /> PDF
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* DPA */}
        <div className="mt-3 rounded-xl border border-border p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Building2 className="h-3 w-3" /> Autoridad de Protección
          </div>
          {country.hasDPA ? (
            <>
              <div className="text-sm font-medium">{country.dpa}</div>
              {country.dpaLink && (
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <a href={country.dpaLink} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" /> Sitio oficial
                  </a>
                </Button>
              )}
            </>
          ) : (
            <div className="text-sm text-muted-foreground italic">Sin DPA aparente.</div>
          )}
        </div>

        {/* Treaties */}
        {activeTreaties.length > 0 && (
          <div className="mt-3 rounded-xl border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Tratados y redes
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CORE_TREATIES.filter((t) => country.treaties[t]).map((t) => (
                <Badge
                  key={t}
                  className="text-[10px]"
                  style={{ background: "hsl(var(--status-treaty))", color: "white" }}
                >
                  {TREATY_LABELS[t]}
                </Badge>
              ))}
              {blocs.map((b) => (
                <Badge key={b.key} variant="outline" className="text-[10px]">
                  {b.label}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Other laws / notes */}
        {country.otherLaws && (
          <div className="mt-3 rounded-xl bg-secondary p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Otras leyes notables
            </div>
            <div className="text-xs leading-relaxed whitespace-pre-line">{country.otherLaws}</div>
          </div>
        )}
        {country.legislativeNotes && (
          <div className="mt-3 rounded-xl bg-secondary p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Actualizaciones legislativas
            </div>
            <div className="text-xs leading-relaxed whitespace-pre-line">
              {country.legislativeNotes}
            </div>
          </div>
        )}

        {rank && (
          <div className="mt-4 rounded-xl border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              Posición cronológica
            </div>
            <div className="mt-1 text-sm">
              País <strong>#{rank}</strong> en adoptar regulación integral.
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
