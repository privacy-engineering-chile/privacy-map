import { useEffect, useRef, useState } from "react";
import { Jurisdiction, JURISDICTIONS } from "@/data/jurisdictions";
import { useFilters } from "@/hooks/useFilters";
import { KPICards } from "@/components/privacy/KPICards";
import { FiltersBar } from "@/components/privacy/FiltersBar";
import { WorldMap } from "@/components/privacy/WorldMap";
import { CountryDetailDrawer } from "@/components/privacy/CountryDetailDrawer";
import { RegionComparator } from "@/components/privacy/RegionComparator";
import { RegionRanking } from "@/components/privacy/RegionRanking";
import { JurisdictionsTable } from "@/components/privacy/JurisdictionsTable";

import { TreatyMatrix } from "@/components/privacy/TreatyMatrix";
import { TreatyRegionStacks } from "@/components/privacy/TreatyRegionStacks";
import { RegionTreatySankey } from "@/components/privacy/RegionTreatySankey";
import { DevelopmentEquity } from "@/components/privacy/DevelopmentEquity";
import { BlocExplorer } from "@/components/privacy/BlocExplorer";
import { ChapterHeading } from "@/components/privacy/ChapterHeading";
import { CountryComparator } from "@/components/privacy/CountryComparator";
import { HeroAdoptionGlobe } from "@/components/privacy/HeroAdoptionGlobe";
import { YourCountryCard } from "@/components/privacy/YourCountryCard";
import { TravelRiskTool } from "@/components/privacy/TravelRiskTool";
import { ThemeToggle } from "@/components/privacy/ThemeToggle";
import { LanguageToggle } from "@/components/privacy/LanguageToggle";
import { PrivacyBadge } from "@/components/privacy/PrivacyBadge";
import { RotatingStat } from "@/components/privacy/RotatingStat";
import { ScrollProgressRail } from "@/components/privacy/ScrollProgressRail";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useT } from "@/i18n/LanguageContext";
import { Linkedin } from "lucide-react";

const Index = () => {
  const { filters, setFilters, filtered, reset } = useFilters();
  const [selected, setSelected] = useState<Jurisdiction | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  useTheme();
  const { t } = useT();

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const iso = p.get("country");
    if (iso) {
      const found = JURISDICTIONS.find((j) => j.iso3 === iso);
      if (found) setSelected(found);
    }
  }, []);

  const sidsNoLaw = JURISDICTIONS.filter((j) => j.sids && j.lawStatus === "none").length;
  const noneTotal = JURISDICTIONS.filter((j) => j.lawStatus === "none").length;

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgressRail />
      <header className="bg-hero border-b border-border">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="flex items-start justify-end gap-2 flex-wrap mb-6">
            <ThemeToggle />
            <LanguageToggle />
            <PrivacyBadge />
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-bold mb-4">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> {t("hero.eyebrow")}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] text-balance">
                {t("hero.title.a")}<span className="text-accent">{t("hero.title.accent")}</span>{t("hero.title.b")}
              </h1>
              <p className="mt-3 text-sm md:text-base italic text-muted-foreground/90 max-w-2xl">
                {t("hero.valueprop")}
              </p>
              <RotatingStat />
            </div>
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[300px]">
                <YourCountryCard onSelect={setSelected} />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <KPICards />
          </div>

          <div className="mt-8">
            <HeroAdoptionGlobe total={JURISDICTIONS.length} />
          </div>

          <button
            onClick={() =>
              document.querySelector("main")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="mt-10 mx-auto flex flex-col items-center gap-1 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-accent transition-colors group"
            aria-label={t("hero.scrollcue")}
          >
            <span>{t("hero.scrollcue")}</span>
            <ChevronDown className="h-4 w-4 animate-bounce group-hover:text-accent" />
          </button>
        </div>
      </header>

      <FiltersBar filters={filters} setFilters={setFilters} reset={reset} />

      <main className="container mx-auto px-4 py-8 space-y-10">
        <section className="animate-fade-up">
          <ChapterHeading number="01" title={t("ch1.title")} lead={t("ch1.lead")} accent="text-status-comprehensive" />
          <WorldMap ref={mapRef} filtered={filtered} filters={filters} onSelect={setSelected} selected={selected} />
          {sidsNoLaw > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-status-none/10 text-status-none border border-status-none/30">
              <span className="h-1.5 w-1.5 rounded-full bg-status-none" />
              {t("ch1.sids", { n: sidsNoLaw })}
            </div>
          )}
        </section>

        <section className="animate-fade-up">
          <ChapterHeading number="02" title={t("ch2.title")} lead={t("ch2.lead")} accent="text-status-treaty" />
          <div className="space-y-6">
            <TreatyMatrix data={filtered} onSelect={setSelected} />
            <TreatyRegionStacks data={filtered} />
            <RegionTreatySankey data={filtered} />
          </div>
        </section>

        <section className="animate-fade-up">
          <ChapterHeading number="03" title={t("ch3.title")} lead={t("ch3.lead")} accent="text-accent" />
          <RegionComparator data={filtered} />
        </section>

        <section className="animate-fade-up">
          <ChapterHeading number="04" title={t("ch4.title")} lead={t("ch4.lead")} accent="text-region-africa" />
          <div className="grid lg:grid-cols-2 gap-6">
            <DevelopmentEquity data={filtered} />
            <BlocExplorer data={filtered} onSelect={setSelected} />
          </div>
          <div className="mt-6">
            <RegionRanking data={filtered} />
          </div>
        </section>

        <section className="animate-fade-up">
          <TravelRiskTool />
        </section>

        <section className="animate-fade-up">
          <ChapterHeading number="05" title={t("ch5.title")} lead={t("ch5.lead")} accent="text-primary" />
          <div className="mb-6">
            <CountryComparator onSelect={setSelected} />
          </div>
          <JurisdictionsTable data={filtered} onSelect={setSelected} />
        </section>

        <footer className="text-center text-xs text-muted-foreground py-10 space-y-2 border-t border-border">
          <div>
            Privacy Atlas v2 — {t("ft.builtby")}{" "}
            <a
              href="https://www.linkedin.com/in/chasquilla-engineer/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-accent transition-colors"
            >
              <Linkedin className="h-3 w-3" /> Chasquilla Engineer
            </a>
          </div>
          <div className="text-muted-foreground/80">{t("ft.privacy")}</div>
        </footer>
      </main>

      <CountryDetailDrawer country={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Index;
