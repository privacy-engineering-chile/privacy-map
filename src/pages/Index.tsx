import { useRef, useState } from "react";
import { Jurisdiction } from "@/data/jurisdictions";
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

const Index = () => {
  const { filters, setFilters, filtered, reset } = useFilters();
  const [selected, setSelected] = useState<Jurisdiction | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="bg-hero border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-3xl animate-fade-up">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-bold mb-4">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> Privacy Atlas
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95] text-balance">
                Una historia <span className="text-accent">global</span> de la <span className="italic">privacidad</span>.
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-2xl text-balance">
                126 jurisdicciones, tres décadas de leyes, un mapa para entender cómo el mundo decidió proteger los datos personales — antes y después del GDPR.
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

      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="animate-fade-up">
          <WorldMap ref={mapRef} filtered={filtered} filters={filters} onSelect={setSelected} selected={selected} />
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <RegionComparator data={filtered} />
          <RegionRanking data={filtered} />
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <SubRegionTreemap data={filtered} />
          <MilestonesTimeline data={filtered} onSelect={setSelected} />
        </section>

        <section>
          <JurisdictionsTable data={filtered} onSelect={setSelected} />
        </section>

        <footer className="text-center text-xs text-muted-foreground py-8">
          Diseñado al estilo <em>Information is Beautiful</em> · Datos: leyes nacionales de protección de datos personales
        </footer>
      </main>

      <CountryDetailDrawer country={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Index;
