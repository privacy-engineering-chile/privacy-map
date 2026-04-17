import { useRef, useState } from "react";
import { Jurisdiction, JURISDICTIONS } from "@/data/jurisdictions";
import { useFilters } from "@/hooks/useFilters";
import { KPICards } from "@/components/privacy/KPICards";
import { FiltersBar } from "@/components/privacy/FiltersBar";
import { WorldMap } from "@/components/privacy/WorldMap";
import { CountryDetailDrawer } from "@/components/privacy/CountryDetailDrawer";
import { RegionComparator } from "@/components/privacy/RegionComparator";
import { SubRegionTreemap } from "@/components/privacy/SubRegionTreemap";
import { RegionRanking } from "@/components/privacy/RegionRanking";
import { MilestonesTimeline } from "@/components/privacy/MilestonesTimeline";
import { JurisdictionsTable } from "@/components/privacy/JurisdictionsTable";
import { ExportButtons } from "@/components/privacy/ExportButtons";
import { TreatyMatrix } from "@/components/privacy/TreatyMatrix";
import { TreatyRegionStacks } from "@/components/privacy/TreatyRegionStacks";
import { RegionTreatySankey } from "@/components/privacy/RegionTreatySankey";
import { LawMaturityScatter } from "@/components/privacy/LawMaturityScatter";
import { DevelopmentEquity } from "@/components/privacy/DevelopmentEquity";
import { BlocExplorer } from "@/components/privacy/BlocExplorer";
import { ChapterHeading } from "@/components/privacy/ChapterHeading";
import { AdoptionPlayback } from "@/components/privacy/AdoptionPlayback";
import { CountryComparator } from "@/components/privacy/CountryComparator";

const Index = () => {
  const { filters, setFilters, filtered, reset } = useFilters();
  const [selected, setSelected] = useState<Jurisdiction | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const sidsNoLaw = JURISDICTIONS.filter((j) => j.sids && j.lawStatus === "none").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="bg-hero border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-3xl animate-fade-up">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-bold mb-4">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> Privacy Atlas v2
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95] text-balance">
                ¿Cómo protege el mundo tus <span className="text-accent">datos</span>?
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-2xl text-balance">
                {JURISDICTIONS.length} jurisdicciones, sus leyes, sus autoridades, sus tratados — y los{" "}
                <span className="text-status-none font-semibold">
                  {JURISDICTIONS.filter((j) => j.lawStatus === "none").length} territorios
                </span>{" "}
                que aún no protegen los datos personales.
              </p>
            </div>
            <ExportButtons mapRef={mapRef} />
          </div>

          <div className="mt-10">
            <KPICards />
          </div>
        </div>
      </header>

      <FiltersBar filters={filters} setFilters={setFilters} reset={reset} />

      <main className="container mx-auto px-4 py-8 space-y-14">
        {/* CHAPTER 1 — Coverage */}
        <section className="animate-fade-up">
          <ChapterHeading
            number="01"
            title="Cobertura — el mapa global de la protección"
            lead="¿Dónde existe ley integral, dónde apenas marcos sectoriales, y dónde simplemente no hay nada?"
            accent="text-status-comprehensive"
          />
          <WorldMap
            ref={mapRef}
            filtered={filtered}
            filters={filters}
            onSelect={setSelected}
            selected={selected}
          />
          {sidsNoLaw > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-status-none/10 text-status-none border border-status-none/30">
              <span className="h-1.5 w-1.5 rounded-full bg-status-none" />
              {sidsNoLaw} pequeños estados insulares aún no tienen ley integral.
            </div>
          )}
        </section>

        {/* CHAPTER 2 — Treaty web */}
        <section className="animate-fade-up">
          <ChapterHeading
            number="02"
            title="La red de tratados"
            lead="Convenios, alianzas y bloques: las conexiones invisibles que tejen un estándar global de privacidad."
            accent="text-status-treaty"
          />
          <div className="grid lg:grid-cols-2 gap-6">
            <TreatyMatrix data={filtered} onSelect={setSelected} />
            <TreatyRegionStacks data={filtered} />
          </div>
          <div className="mt-6">
            <RegionTreatySankey data={filtered} />
          </div>
        </section>

        {/* CHAPTER 3 — Maturity & evolution */}
        <section className="animate-fade-up">
          <ChapterHeading
            number="03"
            title="Evolución y madurez"
            lead="De la primera ley a la ley vigente: ¿quién modernizó su marco y quién se quedó atrás?"
            accent="text-accent"
          />
          <div className="mb-6">
            <AdoptionPlayback data={filtered} />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <LawMaturityScatter data={filtered} onSelect={setSelected} />
            <RegionComparator data={filtered} />
          </div>
          <div className="mt-6">
            <MilestonesTimeline data={filtered} onSelect={setSelected} />
          </div>
        </section>

        {/* CHAPTER 4 — Equity */}
        <section className="animate-fade-up">
          <ChapterHeading
            number="04"
            title="Equidad y bloques"
            lead="La protección no se distribuye por igual: explora la brecha por desarrollo y por bloque económico."
            accent="text-region-africa"
          />
          <div className="grid lg:grid-cols-2 gap-6">
            <DevelopmentEquity data={filtered} />
            <BlocExplorer data={filtered} onSelect={setSelected} />
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <SubRegionTreemap data={filtered} />
            <RegionRanking data={filtered} />
          </div>
        </section>

        {/* CHAPTER 5 — Data */}
        <section className="animate-fade-up">
          <ChapterHeading
            number="05"
            title="Los datos"
            lead="Explora, ordena y exporta el dataset filtrado."
            accent="text-primary"
          />
          <div className="mb-6">
            <CountryComparator onSelect={setSelected} />
          </div>
          <JurisdictionsTable data={filtered} onSelect={setSelected} />
        </section>

        <footer className="text-center text-xs text-muted-foreground py-8">
          Privacy Atlas v2 · estilo <em>Information is Beautiful</em> · datos: marcos nacionales de
          protección de datos personales y participación en tratados internacionales.
        </footer>
      </main>

      <CountryDetailDrawer country={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Index;
