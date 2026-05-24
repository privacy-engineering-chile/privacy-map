import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Jurisdiction, JURISDICTIONS } from "@/data/jurisdictions";
import { useFilters } from "@/hooks/useFilters";
import { KPICards } from "@/components/privacy/KPICards";
import { ChapterHeading } from "@/components/privacy/ChapterHeading";
import { HeroAdoptionGlobe } from "@/components/privacy/HeroAdoptionGlobe";
import { YourCountryCard } from "@/components/privacy/YourCountryCard";
import { ThemeToggle } from "@/components/privacy/ThemeToggle";
import { LanguageToggle } from "@/components/privacy/LanguageToggle";
import { PrivacyBadge } from "@/components/privacy/PrivacyBadge";
import { RotatingStat } from "@/components/privacy/RotatingStat";
import { ScrollProgressRail } from "@/components/privacy/ScrollProgressRail";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useT } from "@/i18n/LanguageContext";
import { Helmet } from "react-helmet-async";
import { Linkedin } from "lucide-react";

// Below-the-fold: code-split to keep the initial bundle small
const FiltersBar = lazy(() => import("@/components/privacy/FiltersBar").then(m => ({ default: m.FiltersBar })));
const WorldMap = lazy(() => import("@/components/privacy/WorldMap").then(m => ({ default: m.WorldMap })));
const CountryDetailDrawer = lazy(() => import("@/components/privacy/CountryDetailDrawer").then(m => ({ default: m.CountryDetailDrawer })));
const RegionComparator = lazy(() => import("@/components/privacy/RegionComparator").then(m => ({ default: m.RegionComparator })));
const RegionRanking = lazy(() => import("@/components/privacy/RegionRanking").then(m => ({ default: m.RegionRanking })));
const JurisdictionsTable = lazy(() => import("@/components/privacy/JurisdictionsTable").then(m => ({ default: m.JurisdictionsTable })));
const TreatyMatrix = lazy(() => import("@/components/privacy/TreatyMatrix").then(m => ({ default: m.TreatyMatrix })));
const TreatyRegionStacks = lazy(() => import("@/components/privacy/TreatyRegionStacks").then(m => ({ default: m.TreatyRegionStacks })));
const RegionTreatySankey = lazy(() => import("@/components/privacy/RegionTreatySankey").then(m => ({ default: m.RegionTreatySankey })));
const DevelopmentEquity = lazy(() => import("@/components/privacy/DevelopmentEquity").then(m => ({ default: m.DevelopmentEquity })));
const BlocExplorer = lazy(() => import("@/components/privacy/BlocExplorer").then(m => ({ default: m.BlocExplorer })));
const CountryComparator = lazy(() => import("@/components/privacy/CountryComparator").then(m => ({ default: m.CountryComparator })));
const TravelRiskTool = lazy(() => import("@/components/privacy/TravelRiskTool").then(m => ({ default: m.TravelRiskTool })));

const SectionFallback = () => (
  <div className="h-72 rounded-2xl border border-border bg-card/40 animate-pulse" aria-hidden />
);


const Index = () => {
  const { filters, setFilters, filtered, reset } = useFilters();
  const [selected, setSelected] = useState<Jurisdiction | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  useTheme();
  const { t, lang } = useT();

  const seoTitle =
    lang === "en"
      ? "Privacy Atlas — Global data privacy regulation"
      : "Privacy Atlas — Regulación mundial de privacidad de datos";
  const seoDesc =
    lang === "en"
      ? "50 years of privacy laws in a single screen. Explore comprehensive vs sectoral laws, DPAs, treaties and cross-border transfer risk."
      : "50 años de leyes de privacidad en una sola pantalla. Explora leyes integrales, sectoriales, autoridades, tratados y riesgo de transferencias.";

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
      <Helmet>
        <html lang={lang} />
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href="https://atlas.privacyengineering.cl/" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content="https://atlas.privacyengineering.cl/" />
        <meta property="og:locale" content={lang === "en" ? "en_US" : "es_ES"} />
      </Helmet>
      <ScrollProgressRail />
      <header className="bg-hero border-b border-border">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="flex items-start justify-end gap-2 flex-wrap mb-6">
            <ThemeToggle />
            <LanguageToggle />
            <PrivacyBadge />
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-accent font-bold mb-4">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> {t("hero.eyebrow")}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] text-balance">
                {t("hero.title.a")}
                <span className="text-accent">{t("hero.title.accent")}</span>
                {t("hero.title.b")}
              </h1>
              <p className="mt-4 text-base md:text-lg italic text-muted-foreground max-w-2xl">{t("hero.valueprop")}</p>
              <RotatingStat />
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-[400px]">
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
            onClick={() => document.querySelector("main")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="mt-10 mx-auto flex flex-col items-center gap-1 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-accent transition-colors group"
            aria-label={t("hero.scrollcue")}
          >
            <span>{t("hero.scrollcue")}</span>
            <ChevronDown className="h-4 w-4 animate-bounce group-hover:text-accent" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-10">
        <section className="animate-fade-up">
          <ChapterHeading number="01" title={t("ch1.title")} lead={t("ch1.lead")} accent="text-status-comprehensive" />
          <Suspense fallback={<SectionFallback />}>
            <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden shadow-soft">
              <div className="border-b border-border bg-background/60">
                <FiltersBar filters={filters} setFilters={setFilters} reset={reset} />
              </div>
              <WorldMap ref={mapRef} filtered={filtered} filters={filters} onSelect={setSelected} selected={selected} />
            </div>
          </Suspense>
          {sidsNoLaw > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-status-none/10 text-status-none border border-status-none/30">
              <span className="h-1.5 w-1.5 rounded-full bg-status-none" />
              {t("ch1.sids", { n: sidsNoLaw })}
            </div>
          )}
        </section>

        <section className="animate-fade-up">
          <ChapterHeading number="02" title={t("ch2.title")} lead={t("ch2.lead")} accent="text-status-treaty" />
          <Suspense fallback={<SectionFallback />}>
            <div className="space-y-6">
              <TreatyMatrix data={filtered} onSelect={setSelected} />
              <TreatyRegionStacks data={filtered} />
              <RegionTreatySankey data={filtered} />
            </div>
          </Suspense>
        </section>

        <section className="animate-fade-up">
          <ChapterHeading number="03" title={t("ch3.title")} lead={t("ch3.lead")} accent="text-accent" />
          <Suspense fallback={<SectionFallback />}>
            <RegionComparator data={filtered} />
          </Suspense>
        </section>

        <section className="animate-fade-up">
          <ChapterHeading number="04" title={t("ch4.title")} lead={t("ch4.lead")} accent="text-region-africa" />
          <Suspense fallback={<SectionFallback />}>
            <div className="grid lg:grid-cols-2 gap-6">
              <DevelopmentEquity data={filtered} />
              <BlocExplorer data={filtered} onSelect={setSelected} />
            </div>
            <div className="mt-6">
              <RegionRanking data={filtered} />
            </div>
          </Suspense>
        </section>

        <section className="animate-fade-up">
          <Suspense fallback={<SectionFallback />}>
            <TravelRiskTool />
          </Suspense>
        </section>

        <section className="animate-fade-up">
          <ChapterHeading number="05" title={t("ch5.title")} lead={t("ch5.lead")} accent="text-primary" />
          <Suspense fallback={<SectionFallback />}>
            <div className="mb-6">
              <CountryComparator onSelect={setSelected} />
            </div>
            <JurisdictionsTable data={filtered} onSelect={setSelected} />
          </Suspense>
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
          <div className="text-muted-foreground">{t("ft.privacy")}</div>
          <div>
            <a href="/cookies" className="hover:text-accent transition-colors underline-offset-2 hover:underline">
              {t("ft.cookiesLink")}
            </a>
          </div>
        </footer>
      </main>

      {selected && (
        <Suspense fallback={null}>
          <CountryDetailDrawer country={selected} onClose={() => setSelected(null)} />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
