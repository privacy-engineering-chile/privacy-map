

# Two UX Improvements — Hero Impact + Sticky Filters Fix

## 1. Unstick the Filters Bar

**Problem**: `FiltersBar` stays pinned to the top while scrolling, covering content and feeling heavy on a long scroll-driven page.

**Fix**: Remove the `sticky top-0 z-...` classes from `src/components/privacy/FiltersBar.tsx` so the bar scrolls away naturally with Chapter 1. Keep the same visual styling (border, background blur) but as a static block.

Optional touch: add a small floating "Filters" button bottom-right (mobile + desktop) that opens the filters in a popover/sheet on demand once the bar has scrolled out of view. This keeps filters reachable without permanent screen real estate.

---

## 2. Hero That Earns the Scroll

Right now the hero shows a globe + KPI cards + "Your country" card — informative but static. We'll add three layered improvements to create momentum:

### A. Animated counter + live "pulse" headline
Replace the static subtitle with a rotating, data-driven statement that changes every ~3.5s:
- "**137** of 195 countries now have a comprehensive privacy law."
- "**1 in 3** people on Earth still live without legal data protection."
- "**Africa** added 14 new laws in the last 5 years — the fastest-growing region."
- "Your country: **{detected}** — {status}."

Numbers count up from 0 on first paint (already a familiar pattern, ~1.2s ease-out). This turns the hero into a 10-second story instead of a label.

### B. Scroll-cue with progress
Below the KPI cards, add a subtle, animated chevron + thin progress rail:

```text
        ╲╱   Scroll the atlas
   ━━━━━━━━━━━━━━━━━━━━━━  (fills as user scrolls)
```

The rail uses `scrollY / documentHeight` and sits fixed at the very top edge of the viewport (2px tall, accent color). It both invites scroll and gives orientation through the long page. Auto-hides at >95% scroll.

### C. Hero globe micro-interaction
The `HeroAdoptionGlobe` already auto-plays once. We'll make it more inviting:
- On hover over a lit country, show a tiny floating tag: "🇪🇸 Spain · LOPDGDD · 2018"
- After the initial sweep finishes, gently pulse the 3 most recent adopters (last 2 years) so the eye has somewhere to land instead of a frozen map.
- Replace the small ⏵ replay button with a labeled pill: "▶ Replay 1973 → 2024" so users understand what they just saw.

### D. One-line value prop above the fold
Add a single italic line right under the headline, region-aware via `t()`:

> *"50 years of privacy law, on one screen. No tracking, no login, no cookies."*

Reinforces the privacy badge and tells the user exactly what they're getting.

---

## Files to Edit

| File | Change |
|---|---|
| `src/components/privacy/FiltersBar.tsx` | Remove sticky positioning; keep styling |
| `src/pages/Index.tsx` | Add `<ScrollProgressRail />`, rotating headline component, scroll cue, italic value prop, optional floating filters button |
| `src/components/privacy/HeroAdoptionGlobe.tsx` | Hover tooltip, pulse recent adopters, labeled replay pill |
| `src/components/privacy/RotatingStat.tsx` *(new)* | Cycling data-driven hero statement with count-up |
| `src/components/privacy/ScrollProgressRail.tsx` *(new)* | 2px top progress bar tied to scroll |
| `src/i18n/dictionary.ts` | New keys: `hero.rotate.1..4`, `hero.valueprop`, `hero.scrollcue`, `globe.replayLabel`, `globe.tooltip` (EN + ES) |

No new dependencies. No backend changes. Approve to build.

