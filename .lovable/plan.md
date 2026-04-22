
# 🌐 3D + Isometric + Parallax Bundle — Build Plan

Three layered enhancements that add **dimensionality** to Privacy Atlas v2 without breaking what's there.

---

## A1 — 3D Globe Hero 🌎

A real, draggable WebGL globe replacing (or coexisting with) the current flat `HeroAdoptionGlobe`.

- New component `Globe3D.tsx` using `@react-three/fiber@^8.18`, `@react-three/drei@^9.122`, `three@^0.160`.
- Sphere with a subtle atmosphere shader + faint starfield (`<Stars/>` from drei).
- Country geometry built from `world-atlas` GeoJSON, projected onto the sphere as **extruded pads** via `THREE.Shape` + `ExtrudeGeometry`. Pad height = years since first law (0 for "none"). Pad color = region color (or status, toggled).
- Auto-rotates at 0.05 rad/s; OrbitControls enable drag + pinch-zoom (no pan).
- Same 1973 → 2025 sweep timeline as the flat version: pads pop up + light up as their year is reached. Replay button kept.
- Click a pad → `onSelect(country)` opens existing drawer.
- A small toggle pill `2D | 3D` in the corner switches between the existing `HeroAdoptionGlobe` and the new `Globe3D`. Default = 3D on capable devices, 2D otherwise.
- **Fallback**: feature-detect WebGL via a one-line `canvas.getContext('webgl2') || getContext('webgl')`. If null → silently render the existing 2D globe. Preview sandbox has no GPU adapter, so the editor preview will fall back gracefully; the published site renders 3D.
- Respects `prefers-reduced-motion`: no auto-rotate, no animated sweep — final state on mount.

## B1 — Isometric Region Stacks 🧱

A new editorial showpiece in **Chapter 4 (Equity)**, sitting next to `DevelopmentEquity`.

- New component `IsoRegionStacks.tsx` — pure SVG, no new deps.
- One **isometric tower per region** (8 towers in a row, wrapping on mobile).
- Each tower is a stack of cubes; each cube layer = one of the 6 core treaties; cube width scales with the % of countries in that region holding that treaty (10% → small cube, 100% → full cube).
- Top of the tower shows a flag-like banner with the region name + total country count.
- Color of each layer matches existing `--treaty-*` CSS vars.
- Hover a layer → tooltip "12 / 35 países en LatAm firmaron CoE 108+".
- ~280 LOC, isometric transform `matrix(0.866, 0.5, -0.866, 0.5, 0, 0)` applied per cube face.

## C1 — Parallax Tilt ✨

Ambient depth across the page, zero new deps.

- New hook `useParallaxTilt.ts`: tracks `mousemove` on a target element, returns `{rx, ry}` clamped to ±6°.
- Apply to:
  - The hero globe wrapper (subtle, max ±4° so it doesn't fight OrbitControls).
  - The 4 KPI cards (max ±6° each, independent — feels playful).
  - The `YourCountryCard` (max ±5°).
- Disabled on touch devices and when `prefers-reduced-motion: reduce`.
- ~50 LOC total.

---

## Technical changes

**New files**
- `src/components/privacy/Globe3D.tsx` — r3f scene
- `src/components/privacy/HeroGlobeSwitcher.tsx` — wraps `HeroAdoptionGlobe` + `Globe3D` with 2D/3D toggle and WebGL detection
- `src/components/privacy/IsoRegionStacks.tsx` — isometric SVG component
- `src/hooks/useParallaxTilt.ts` — mouse tilt hook
- `src/lib/webglSupport.ts` — feature detection helper
- `src/lib/geoToSphere.ts` — small helper converting GeoJSON polygons to extruded `THREE.BufferGeometry` on a sphere

**Edited**
- `src/pages/Index.tsx` — swap `HeroAdoptionGlobe` for `HeroGlobeSwitcher`; add `IsoRegionStacks` to Chapter 4; wrap KPI grid + YourCountryCard with parallax.
- `src/components/privacy/KPICards.tsx` — accept optional tilt props on each card.
- `package.json` — add `three@^0.160`, `@react-three/fiber@^8.18`, `@react-three/drei@^9.122`, `@types/three`.

**Out of scope**
- A2 treaty constellation, A3 terrain, B2 cartogram, B3 book shelf, C2 card flip, C3 layered scroll. (Easy follow-ups if you want more after seeing this.)

---

## Edge cases & safety

- **No WebGL** (sandbox, old browsers): switcher falls back to current 2D globe. Toggle hides the "3D" option.
- **Slow devices**: `Globe3D` caps `dpr` at 1.5 and disables shadows. Country pads are batched into a single `InstancedMesh` for performance with ~250 countries.
- **Reduced motion**: no auto-rotate, no sweep, no parallax — final visual state only.
- **Touch**: parallax disabled; OrbitControls remain (pinch + drag).
- **Bundle size**: three.js + r3f + drei adds ~250 KB gzipped. Lazy-loaded via `React.lazy(() => import('./Globe3D'))` so the 2D fallback path stays light.
- **Click vs drag**: a 5px movement threshold on pointerdown→up disambiguates orbit drags from country clicks.

---

## What it feels like

1. Page loads → 3D Earth fades in, slowly rotating, country pads rising one decade at a time. Mouse tilt makes the surrounding hero subtly breathe.
2. Scroll to Chapter 4 → isometric towers stand like a city skyline of treaties.
3. Everything else stays exactly as you designed it. No regressions.

---

## How to proceed

If this looks right, approve and I'll build it. If you want to swap any piece (e.g. *"replace B1 with B2 cartogram"* or *"skip C1 parallax"*), say so and I'll revise the plan.
