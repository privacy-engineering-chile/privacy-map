import { Jurisdiction, JURISDICTIONS, REGION_COLORS } from "@/data/jurisdictions";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface Props {
  country: Jurisdiction | null;
  onClose: () => void;
}

const ISO_TO_FLAG = (iso3?: string) => {
  if (!iso3) return "🌐";
  const map: Record<string, string> = {
    USA: "US", GBR: "GB",
  };
  // crude ISO3 -> ISO2 fallback for emoji (works for most cases via lookup); if not found, return globe
  const iso2Map: Record<string, string> = {
    ALA:"AX",ALB:"AL",DZA:"DZ",AND:"AD",AGO:"AO",ATG:"AG",ARG:"AR",ARM:"AM",ABW:"AW",AUS:"AU",AUT:"AT",AZE:"AZ",BHS:"BS",BHR:"BH",BGD:"BD",BRB:"BB",BLR:"BY",BEL:"BE",BLZ:"BZ",BEN:"BJ",BMU:"BM",BTN:"BT",BES:"BQ",BIH:"BA",BWA:"BW",BRA:"BR",VGB:"VG",BGR:"BG",BFA:"BF",CPV:"CV",CAN:"CA",CYM:"KY",TCD:"TD",CHL:"CL",CHN:"CN",HKG:"HK",MAC:"MO",COL:"CO",COG:"CG",CRI:"CR",CIV:"CI",HRV:"HR",CUW:"CW",CYP:"CY",CZE:"CZ",COD:"CD",DNK:"DK",DMA:"DM",ECU:"EC",EGY:"EG",GNQ:"GQ",EST:"EE",FRO:"FO",FIN:"FI",FRA:"FR",GAB:"GA",GEO:"GE",DEU:"DE",GHA:"GH",GIB:"GI",GRC:"GR",GRL:"GL",GGY:"GG",GIN:"GN",HUN:"HU",ISL:"IS",IND:"IN",IDN:"ID",IRL:"IE",IMN:"IM",ISR:"IL",ITA:"IT",JAM:"JM",JPN:"JP",JEY:"JE",KAZ:"KZ",KEN:"KE",XKX:"XK",KGZ:"KG",LAO:"LA",LVA:"LV",LBN:"LB",LSO:"LS",LIE:"LI",LTU:"LT",LUX:"LU",MDG:"MG",MWI:"MW",MYS:"MY",MLI:"ML",MLT:"MT",MRT:"MR",MUS:"MU",MEX:"MX",MCO:"MC",MNG:"MN",MNE:"ME",MAR:"MA",NPL:"NP",NLD:"NL",NZL:"NZ",NIC:"NI",NER:"NE",NGA:"NG",MKD:"MK",NOR:"NO",OMN:"OM",PAN:"PA",PRY:"PY",PER:"PE",PHL:"PH",POL:"PL",PRT:"PT",QAT:"QA",
  };
  const code = iso2Map[iso3];
  if (!code) return "🌐";
  return String.fromCodePoint(...code.split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
};

export const CountryDetailDrawer = ({ country, onClose }: Props) => {
  if (!country) return null;
  const sorted = [...JURISDICTIONS].sort((a, b) => a.year - b.year);
  const rank = sorted.findIndex((j) => j.jurisdiction === country.jurisdiction) + 1;
  const neighbors = JURISDICTIONS.filter(
    (j) => j.subRegion === country.subRegion && j.jurisdiction !== country.jurisdiction,
  ).sort((a, b) => a.year - b.year);

  const regionColor = REGION_COLORS[country.region];

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
        </SheetHeader>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="rounded-xl bg-secondary p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Año</div>
            <div className="font-display text-4xl font-black">{country.year}</div>
          </div>
          <div className="rounded-xl p-4" style={{ background: country.era === "Post-GDPR" ? "hsl(var(--era-post) / 0.15)" : "hsl(var(--era-pre) / 0.15)" }}>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Era</div>
            <Badge className="mt-2" style={{ background: country.era === "Post-GDPR" ? "hsl(var(--era-post))" : "hsl(var(--era-pre))", color: "white" }}>
              {country.era}
            </Badge>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Posición cronológica</div>
          <div className="mt-1 text-sm">
            La jurisdicción <strong>#{rank}</strong> de {JURISDICTIONS.length} en adoptar regulación de privacidad.
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-display text-lg mb-2">Vecinos en {country.subRegion}</h4>
          {neighbors.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin vecinos en el dataset.</p>
          ) : (
            <ul className="space-y-1.5">
              {neighbors.map((n) => (
                <li key={n.jurisdiction} className="flex justify-between text-sm">
                  <span>{n.jurisdiction}</span>
                  <span className="tabular-nums text-muted-foreground">{n.year}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
