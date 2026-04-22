

# Cleanup, Polish, Bilingual + Privacy Note — Build Plan

Five focused improvements: trim noise, remove four charts, polish responsive UX, add EN/ES toggle, and surface a "no data collected" notice.

---

## 1. Remove 4 Visualizations

Delete these components and their imports/usage in `src/pages/Index.tsx`:

| Component | Where | Action |
|---|---|---|
| `SubRegionTreemap` | Chapter 4 | delete file + remove usage |
| `MilestonesTimeline` | Chapter 3 | delete file + remove usage |
| `LawMaturityScatter` | Chapter 3 | delete file + remove usage |
| `AdoptionPlayback` ("El mundo se enciende") | Chapter 3 | delete file + remove usage |

After cleanup:
- **Chapter 3** = `RegionComparator` (full width).
- **Chapter 4** = `DevelopmentEquity` + `BlocExplorer` (2-col on `lg:`), then `RegionRanking` (full width).

---

## 2. Text Cleanup (signal > noise)

- **Hero subtitle** → one sharp line (`X jurisdicciones · Y sin protección`).
- **Chapter leads** → ≤10-word punchlines.
- **KPI cards** → drop redundant `sub` labels when value is self-explanatory.
- **HeroAdoptionGlobe** → keep "Replay" as icon only.
- **FiltersBar** → tooltips replace long labels where space is tight on mobile.

**Footer** becomes minimal:
> *Privacy Atlas v2 — built by [Chasquilla Engineer](https://www.linkedin.com/in/chasquilla-engineer/)*
> *This site collects no data, no cookies, no analytics.*

Small `Linkedin` icon (lucide) inline.

---

## 3. Privacy Notice ("no data collected")

Two surfaces so the user always sees it:

1. **Footer line** (above) — always visible at page bottom.
2. **Tiny pill in the header**, next to `ThemeToggle` / `LanguageToggle`:
   ```
   🛡  No tracking · No cookies
   ```
   Hover/tap opens a one-line popover: *"This site stores nothing about you. The only local data is your theme & language preference, kept in your browser."*

Both strings go through the i18n dictionary so they translate.

---

## 4. Responsive UX/UI Pass

**Hero (mobile)**: stack `HeroAdoptionGlobe` and `YourCountryCard`; on `lg:` keep 2-col. Title scales `text-4xl` → `text-7xl`. Action row (theme + lang + privacy + export) wraps below title on `<sm`.

**FiltersBar (mobile)**: single horizontal scroll-snap row on `<md`; color-mode picker collapses into the "Avanzado" popover; sticky bar gets `overflow-x-auto`.

**Chapter cards**: all use `p-5`, `min-h-0`, `aspect-[16/9]` on mobile to avoid squish. Section spacing `space-y-14` → `space-y-10`.

---

## 5. Bilingual EN / ES Toggle

Lightweight in-house i18n (no library — keeps bundle small).

**New files**:
- `src/i18n/dictionary.ts` — flat `{ key: { es, en } }` covering hero, chapters, KPIs, filters, footer, drawer, privacy notice.
- `src/i18n/LanguageContext.tsx` — context + `useT()` hook returning `t(key)` and `{ lang, setLang }`. Persists to `localStorage` (`pa.lang`); defaults to browser language with `es` fallback.
- `src/components/privacy/LanguageToggle.tsx` — pill toggle `ES | EN`, sits next to `ThemeToggle`.

**Wiring**:
- Wrap app in `<LanguageProvider>` inside `src/App.tsx`.
- Replace hardcoded Spanish in: `Index.tsx`, `KPICards`, `ChapterHeading`, `FiltersBar`, `HeroAdoptionGlobe`, `YourCountryCard`, `RegionComparator`, `DevelopmentEquity`, `BlocExplorer`, `RegionRanking`, `TreatyMatrix`, `TreatyRegionStacks`, `RegionTreatySankey`, `TravelRiskTool`, `CountryComparator`, `JurisdictionsTable`, `CountryDetailDrawer`, `ExportButtons`, footer, privacy pill.
- Country/region proper nouns stay as in dataset; only UI chrome translates. Region label "LatAm & Caribe" gets EN equivalent "LatAm & Caribbean".

---

## Final Page Structure

```text
HEADER
  ├─ Title + 1-line subtitle
  ├─ [Theme] [ES|EN] [🛡 No tracking] [Export]
  ├─ HeroAdoptionGlobe  |  YourCountryCard
  └─ KPICards (4)

FILTERS BAR (sticky, mobile-scroll)

CH 01  Coverage         → WorldMap
CH 02  Treaty web       → TreatyMatrix | TreatyRegionStacks
                        → RegionTreatySankey
CH 03  Maturity         → RegionComparator (full width)
CH 04  Equity & blocs   → DevelopmentEquity | BlocExplorer
                        → RegionRanking
       TravelRiskTool
CH 05  Data             → CountryComparator → JurisdictionsTable

FOOTER  Built by Chasquilla Engineer (LinkedIn)
        No data · no cookies · no analytics.
```

---

## Files Touched

**Delete**: `SubRegionTreemap.tsx`, `MilestonesTimeline.tsx`, `LawMaturityScatter.tsx`, `AdoptionPlayback.tsx`.

**Create**: `src/i18n/dictionary.ts`, `src/i18n/LanguageContext.tsx`, `src/components/privacy/LanguageToggle.tsx`, `src/components/privacy/PrivacyBadge.tsx`.

**Edit**: `src/App.tsx`, `src/pages/Index.tsx`, plus all remaining chart/UI components listed above for translated titles/subtitles and responsive tweaks.

No new dependencies. Approve to build.

