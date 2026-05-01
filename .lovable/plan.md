# Prepare repo for public GitHub release

Add two files at the project root so anyone visiting the GitHub repo immediately understands what Privacy Atlas is, how to run it, how to contribute, and under what terms they can use it.

## 1. Replace `README.md`

Currently the README is a placeholder ("TODO: Document your project here"). Replace it with a proper project README containing:

- **Hero**: tagline + link to the live site (`atlas.privacyengineering.cl`).
- **What you can do**: bulleted feature tour (locator, world map, comparator, travel risk tool, treaty network, regional analysis) — emphasizing no backend / no tracking.
- **Tech stack**: React 18, TypeScript, Vite, Tailwind, shadcn/ui, react-simple-maps, d3, Recharts, ES/EN i18n.
- **Run locally**: `npm install`, `npm run dev`, `npm run build`, `npm test`. Node 18+.
- **Project structure**: short tree of `src/` with one-line descriptions and a pointer to `src/data/jurisdictions.ts` as the source of truth.
- **Contributing**: invite data updates (with source links), translations, visualizations, accessibility improvements.
- **License**: link to the new `LICENSE` file.
- **Credits**: Privacy Engineering + Lovable.

## 2. Add `LICENSE` (MIT)

Standard MIT license text, copyright "Privacy Engineering" 2026. MIT is the right fit because:
- It's the most common OSS license — minimal friction for forks and remixes.
- It's permissive: anyone can use, modify, redistribute, and sublicense.
- It still requires attribution.

If you'd prefer a different license (e.g. Apache 2.0 for explicit patent grant, or CC-BY-4.0 just for the dataset), say the word and I'll swap it.

## Out of scope (for now)

- `CONTRIBUTING.md` — can be added later if contribution volume justifies it.
- Issue / PR templates — same.
- Changing the copyright holder name, year, or contact email — let me know if you want anything different before I write the files.
