
User picked the "New analyses" bundle: Sankey region→treaty + animated timeline + country comparison. Let me design concisely.

**1. Sankey Region → Treaty** (Chapter 2)
- Use a lightweight SVG sankey via `d3-sankey` (already have d3-scale; add `d3-sankey`).
- Nodes: regions (left) + 6 core treaties (right). Links weighted by # of member countries.
- Colored by region on left side; treaty color on right. Hover highlights flow + tooltip with count.
- Place alongside (or replacing) `TreatyRegionStacks` — keep stacks as toggle.

**2. Animated Timeline / Map playback** (new component, top of Chapter 3 or as map overlay)
- Play/Pause + year scrubber (1973 → 2025).
- As year advances, countries "light up" on a mini world map when their `year <= currentYear`.
- Counter shows cumulative jurisdictions with law. Speed control (1x/2x/4x).
- Component: `AdoptionPlayback.tsx` — reuses react-simple-maps with filtered fill logic per year.

**3. Country comparator** (new chapter or Chapter 5 prelude)
- Pick up to 4 countries (searchable multi-select chips).
- Side-by-side cards: flag, region, law status badge, key law name+year, first law year, DPA, treaty grid (6 dots), dev flags.
- A small bar showing law age (years since key law) for visual diff.
- URL-syncs the selection (`?cmp=USA,BRA,DEU,JPN`).
- Component: `CountryComparator.tsx` + integration in `Index.tsx`.

**Tech additions**
- `d3-sankey` package.
- New chapter heading "06 — Compara países" OR insert comparator inside chapter 5.
- Extend `useFilters` only for the comparator selection (or keep separate URL param to avoid coupling).

**Files to create**
- `src/components/privacy/RegionTreatySankey.tsx`
- `src/components/privacy/AdoptionPlayback.tsx`
- `src/components/privacy/CountryComparator.tsx`

**Files to edit**
- `src/pages/Index.tsx` — wire 3 new sections.
- `package.json` — add `d3-sankey` + types.

**Out of scope**
- Dark mode, Chapter Nav, AI features (offered separately).

Plan is concrete and bounded. Present.
