# Privacy Atlas

> 50 years of privacy laws, on a single screen. No login, no cookies, no tracking.

**Live site:** [atlas.privacyengineering.cl](https://atlas.privacyengineering.cl)

Privacy Atlas is an interactive, public-interest visualization of how the world protects personal data. It maps every jurisdiction's data protection framework — from the first national law in 1974 to the most recent in 2024 — and lets anyone explore coverage, treaties, regional dynamics, and cross-border risk in seconds.

---

## What you can do

- **Locate yourself** — see your country's data protection status at a glance.
- **Explore the world map** — filter by comprehensive law, sectoral law, or no law.
- **Compare countries** — side-by-side breakdown of legal frameworks, authorities, and treaties.
- **Travel risk tool** — measure the drop in protection when data crosses a border, with a transparent 0–100 scoring methodology.
- **Treaty network** — see which countries participate in international privacy frameworks.
- **Regional analysis** — rankings, blocs, and development equity views.

All data is rendered client-side. There is no backend, no analytics, no tracking.

---

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **react-simple-maps** + **d3** for cartography and Sankey diagrams
- **Recharts** for charts
- Bilingual (ES / EN) via a lightweight i18n context

---

## Run locally

```bash
# install deps
npm install

# start dev server
npm run dev

# build for production
npm run build

# run tests
npm test
```

Requires Node 18+.

---

## Project structure

```
src/
├── components/privacy/   # Visualizations (map, KPIs, comparator, treaties, etc.)
├── components/ui/        # shadcn/ui primitives
├── data/                 # Jurisdictions dataset (source of truth)
├── i18n/                 # Spanish / English dictionary
├── hooks/                # Filters, theme, viewport helpers
├── lib/                  # Utilities (ISO codes, card generation)
└── pages/                # Index + 404
```

The dataset lives in [`src/data/jurisdictions.ts`](src/data/jurisdictions.ts). Each entry includes the country's law status, key law name and link, first law, data protection authority, and treaty participation.

---

## Contributing

Contributions are welcome — especially:

- **Data updates**: new laws, amendments, or corrections to existing entries.
- **Translations**: improvements to ES / EN strings, or new languages.
- **Visualizations**: new ways to read the dataset.
- **Accessibility**: anything that makes the atlas easier to use.

If you spot an error in a country's data, please open an issue with a source link (official text, gazette, or DPA page).

---

## License

[MIT](./LICENSE) — free to use, fork, and remix. Attribution appreciated.

---

## Credits

Built by [Privacy Engineering](https://privacyengineering.cl) with [Lovable](https://lovable.dev). Data compiled from official government sources, data protection authorities, and international treaty registries.
