
# 🌐 Privacy Atlas v2 — From "where" to "how" countries protect data

The new dataset unlocks a **much richer story**: not just *when* countries adopted privacy laws, but *which* law, *who* enforces it, *what treaties* they joined, and crucially **which jurisdictions still have no law at all**. Let's evolve the dashboard from a single-screen map into a layered, exploratory atlas.

## What's new in the data (vs. v1)

- **253 jurisdictions** (vs 126), including those *without* any law → enables a "coverage gap" narrative
- **Law identity**: KeyLawName, FirstLawName, links + PDFs, year of first vs. key/amended law → **maturity dimension** (years between first law and current key law)
- **Data Protection Authority** (name + link) → DPA strength indicator
- **Treaty network**: Convention 108, 108+, Malabo, GPA, GPEN, OECD, AU, ECOWAS, ASEAN, APEC, MERCOSUR, CARICOM, OECS, CIS → **rich relational graph**
- **Development flags**: LDC / LLDC / SIDS → equity & access angle
- **ISO3 + M49** → reliable mapping

## Proposed dashboard — 4 narrative chapters

A single page with sticky chapter nav, each chapter is a "scrollytelling" section with its own hero stat.

### Chapter 1 — Coverage (the big picture)
- **Updated KPIs**: total jurisdictions, % with comprehensive law, % without any law, # in DPA-less limbo, oldest law (Sweden-style pioneers)
- **World map** recolored by **status**: `Comprehensive law` / `Sectoral or partial` / `No law` / `Treaty-only` (detected from KeyLawName text patterns)
- Toggle map view: by **status**, **law age**, **DPA presence**, **region**
- **Gap callouts**: floating annotations like "8 Pacific SIDS still have no law"

### Chapter 2 — The Treaty Web
- **Treaty membership matrix** (heatmap): rows = countries (filterable), cols = Conv.108, 108+, Malabo, GPA, GPEN, OECD → see who's "wired in"
- **Stacked bars by region**: how many countries belong to each treaty network
- **Sankey** (or chord-lite): Region → Treaty membership flows, showing the European dominance of Conv.108 vs. the African Malabo cluster

### Chapter 3 — Law evolution & maturity
- **Timeline strip** with two dots per country: First law (hollow) → Key/amended law (filled), connected by a line → instantly shows **maturity gap**
- **Scatter**: First-law year (x) vs. Key-law year (y); diagonal = no update; far above = recently modernized. Colored by region.
- **Top 10 oldest pioneers** + **Top 10 most recent adopters** mini-cards

### Chapter 4 — Equity & blocs
- **Development overlay**: % of LDC / LLDC / SIDS with vs. without comprehensive law (diverging bars)
- **Regional bloc explorer**: pick a bloc (ASEAN, ECOWAS, AU, APEC, MERCOSUR…) → see member coverage rate, average law age, treaty participation
- Highlights the **"protection inequality"** angle

### Persistent — Country detail drawer (upgraded)
On click in any chart/map, drawer shows:
- Flag, region/sub-region, dev flags as chips
- **Key law card**: name, year, link button (opens law page), PDF download button
- **First law card** (if different): name, year, link/PDF
- **DPA card**: name + website button
- **Treaty chips**: visual badges for each treaty/bloc the country belongs to
- "Other notable laws" + "Legislative updates" notes
- Mini chronological position ("Country #N to adopt comprehensive law")

### Filters bar (upgraded)
- Region, sub-region, era, year range, **law status** (comprehensive / partial / none), **has DPA**, **dev classification** (LDC/LLDC/SIDS), **treaty membership** (multi-select)
- Search by country
- URL-synced for sharing

### Export
- PNG of current chapter, CSV of filtered set, "copy share link"

## Visual style
Keep the *Information is Beautiful* infographic palette, but introduce:
- A **status palette** (green = comprehensive, amber = partial, red = none, blue = treaty-only) for the new coverage layer
- Treaty badges with distinctive icons/colors per treaty
- Subtle chapter dividers with large number labels (01, 02, 03, 04) and pull-quotes

## Technical plan

1. **Data layer** — `src/data/jurisdictions.ts` regenerated from the new CSV. Parse script (one-off) → emit a typed array with cleaned fields:
   - Derive `lawStatus`: heuristic on KeyLawName ("does not appear to be in place" → `none`; "[Sectoral]" / "not comprehensive" → `partial`; else `comprehensive`)
   - Derive `hasDPA`: DPA name not "No apparent DPA" / empty
   - Normalize treaty fields to booleans + keep raw string for tooltip
   - Keep all links/PDFs
2. **New components**:
   - `CoverageMap` (replaces WorldMap with status modes)
   - `TreatyMatrix`, `TreatyRegionStacks`
   - `LawMaturityScatter`, `FirstVsKeyTimeline`
   - `DevelopmentEquity`, `BlocExplorer`
   - `ChapterNav` (sticky side dots)
3. **Upgraded** `CountryDetailDrawer`, `FiltersBar`, `KPICards`, `useFilters`
4. **Reuse** `ExportButtons`, table & existing chart infra; retire components that no longer fit (RegionRanking can stay, MilestonesTimeline merges into Ch.3)
5. Tokens: extend `index.css` with `--status-*` and `--treaty-*` colors

## Out of scope (for now)
- Backend / DB (data stays embedded)
- Editable records, user uploads
- Animated year-by-year playback (could be follow-up)
