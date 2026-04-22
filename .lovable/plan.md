
# 🚀 Top 4 Wow Moments — Build Plan

Implementing the four highest-impact additions to Privacy Atlas v2, designed to feel cohesive (not bolted on) and to land the "whoa" reaction in the first 10 seconds.

---

## 1. 🌍 Hero Adoption Globe

Replace the static hero block with a **live SVG world that lights up year by year** (1973 → 2025) over ~6 seconds, then settles on "today".

- New component `HeroAdoptionGlobe.tsx` using `react-simple-maps` (already installed) with an orthographic-style projection sized for the hero band (~500×320).
- Countries start dimmed (`hsl(var(--muted) / 0.15)`); when their `firstLawYear <= currentYear`, they animate to their region color via a 400 ms CSS transition.
- A thin progress rail under the headline shows the year ticking; a counter below the H1 morphs from "0 jurisdicciones protegen tus datos" → final count.
- `requestAnimationFrame` driven, auto-plays on mount, replays on click.
- Headline keeps current copy but the accent word "datos" pulses in sync with each new country lighting up.

## 2. 📍 Auto-Detect "Your Country" + Travel Risk

A floating card top-right of the hero, plus a compact tool above Chapter 5.

**A. Geolocation card** (`YourCountryCard.tsx`)
- On mount, `fetch("https://ipapi.co/json/")` (no key needed, free CORS endpoint, ~50 ms).
- Match returned `country_code` against `JURISDICTIONS[].iso3` (convert ISO2 → ISO3 via small lookup or use `country_code_iso3` field from ipapi).
- Render a 320×auto card: flag emoji, "Tu ubicación: 🇲🇽 México", status pill, key-law line, a CTA *"Ver detalle"* that opens the existing `CountryDetailDrawer`.
- Graceful fallback: hide silently if fetch fails or country not in dataset. Dismissible (stored in `sessionStorage`).

**B. Travel Risk mini-tool** (`TravelRiskTool.tsx`, new chapter 4½ block or top of Chapter 5)
- Two searchable selects: *Origen* → *Destino* (defaults to detected country → US).
- Compute a 0-100 "data safety drop" score:
  - Origin status weight (none=0, sectoral=40, comprehensive=80) + DPA bonus (+10) + treaty bonus (+10).
  - Same for destination. Drop = max(0, originScore − destScore).
- Verdict card with color-coded badge (`safe / caution / risk`), one-line plain-language explanation, and a treaty-overlap chip row ("Ambos en CoE 108+: tu data viaja con garantías").
- URL-syncs `?from=DEU&to=USA`.

## 3. 🌓 Dark/Light Mode with Color Morph

- Add `ThemeToggle.tsx` (sun/moon icon, top-right header) using a tiny `useTheme` hook persisted in `localStorage`.
- Add a `.light` class with overrides in `index.css`. The base palette already lives in CSS variables, so we redefine them under `:root.light { --background: ... }`.
- The "morph" effect: add `transition: background-color 600ms, color 600ms, fill 600ms, stroke 600ms` to `body, svg path, .card` selectors so the swap interpolates smoothly instead of snapping.
- Region/status/treaty colors keep their hue but adjust lightness for legibility on light bg (defined as separate vars `--status-comprehensive-light`, etc., consumed via `light-dark()` fallback or a second variable set).
- Map, charts, Sankey, scatter all already read from CSS vars → no per-component changes needed beyond auditing 2-3 hardcoded colors.

## 4. 📸 Shareable Country Card

In `CountryDetailDrawer`, add a *"Compartir tarjeta"* button that generates a 1080×1080 PNG.

- New util `generateCountryCard.ts`: uses HTML5 `<canvas>` (no extra deps) to draw:
  - Top band in the country's region color, big flag emoji + country name in `font-display`.
  - Status badge, key-law name + year, DPA chip, 6 treaty dots (filled if member).
  - Footer: "privacy-map.lovable.app" + a small auto-generated QR (via tiny `qrcode` lib, ~6 KB, added to deps) pointing to `/?country=ISO3`.
  - Background: subtle dotted grid in muted color, accent corner triangle.
- Two actions: **Download PNG** (canvas → blob → `<a download>`) and **Share** (uses `navigator.share` with the blob on mobile; falls back to download on desktop).
- Drawer also gets a deep-link `?country=` param so the existing single-country URL works as the share target.

---

## Technical changes

**New files**
- `src/components/privacy/HeroAdoptionGlobe.tsx`
- `src/components/privacy/YourCountryCard.tsx`
- `src/components/privacy/TravelRiskTool.tsx`
- `src/components/privacy/ThemeToggle.tsx`
- `src/hooks/useTheme.ts`
- `src/lib/generateCountryCard.ts`
- `src/lib/iso2to3.ts` (small lookup table for geolocation)

**Edited**
- `src/pages/Index.tsx` — mount globe in hero, add `YourCountryCard`, `ThemeToggle` in header, `TravelRiskTool` block, read `?country=` on mount to open drawer.
- `src/components/privacy/CountryDetailDrawer.tsx` — add share buttons + render preview thumbnail.
- `src/index.css` — `.light` palette, smooth color transitions, optional brighter region tints for light mode.
- `package.json` — add `qrcode` (+ `@types/qrcode`).

**Out of scope**
- Sonification, force-directed network, scroll-pinned map, leaderboards, OG image generation (server-side).
- Any backend — geolocation uses public IP API with no key.

**Edge cases handled**
- ipapi quota exceeded / blocked → card stays hidden, no UI shift.
- User country not in dataset → card shows "Tu jurisdicción no está en el atlas todavía".
- Reduced motion preference → globe skips animation and renders final state immediately.
- Light mode is opt-in; dark stays default to preserve current visual identity.
