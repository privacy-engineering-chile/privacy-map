# Reducir el dataset del bundle inicial

`src/data/jurisdictions.ts` pesa ~280 KB sin minificar. Aunque los 20 componentes que lo usan ya están lazy-loadeados, **el hero todavía lo importa** (via `KPICards`, `HeroAdoptionGlobe`, `YourCountryCard`, `RotatingStat` y `Index.tsx` con `JURISDICTIONS.length`), así que el dataset entero sigue entrando en el chunk inicial.

Objetivo: que el bundle inicial solo cargue un **resumen precomputado de ~2 KB** y que los ~280 KB se vayan al chunk del mapa (que ya es lazy).

## 1. Partir el módulo de datos en dos

- **`src/data/jurisdictions.ts`** — solo tipos y constantes ligeras (≈ líneas 1‑124 actuales): `LawStatus`, `Era`, `Treaties`, `Jurisdiction`, `TREATY_LABELS`, `CORE_TREATIES`, `STATUS_LABEL`, `STATUS_COLOR`, `REGION_COLORS`, `ALL_REGIONS`, `ALL_ERAS`, `ALL_STATUSES`, `YEAR_MIN`, `YEAR_MAX`. Reexporta `JURISDICTIONS` desde el nuevo módulo para no romper imports existentes.
- **`src/data/jurisdictions.data.ts`** — solo `export const JURISDICTIONS: Jurisdiction[] = [...]` (las ~11.800 líneas restantes).

Los 20 componentes seguirán haciendo `import { JURISDICTIONS } from "@/data/jurisdictions"`, **pero** los del hero pasarán a usar el resumen (paso 2). Como el reexport mantiene la API, ningún componente lazy se rompe.

## 2. Generar `kpiSummary` precomputado

Crear `scripts/generate-kpi-summary.ts` que lee `jurisdictions.data.ts` y escribe `src/data/kpiSummary.ts` con:

```ts
export const KPI_SUMMARY = {
  total: 195,
  byStatus: { comprehensive: 142, partial: 28, none: 25 },
  byRegion: { /* … */ },
  sidsNoLaw: 12,
  // índice mínimo para el geo-IP del hero
  byIso3: {
    "DEU": { jurisdiction: "Germany", lawStatus: "comprehensive", keyLawName: "BDSG", keyLawYear: 2018, region: "Europe" },
    /* … 1 línea por país */
  },
} as const;
```

Engancharlo en `package.json` (`predev` / `prebuild`) junto al `generate-sitemap`. Tamaño estimado: 5‑10 KB ya minificado.

## 3. Refactor del hero para usar el resumen

- **`KPICards`** → leer totales y `byStatus` desde `KPI_SUMMARY`, sin importar `JURISDICTIONS`.
- **`HeroAdoptionGlobe`** → recibir `total={KPI_SUMMARY.total}` desde `Index.tsx` (ya recibe `total` por prop, solo cambia la fuente).
- **`RotatingStat`** → consumir el resumen.
- **`YourCountryCard`** → buscar el país con `KPI_SUMMARY.byIso3[iso3]`. Al hacer click en "Ver detalle", hacer `await import("@/data/jurisdictions.data")` y resolver el `Jurisdiction` completo antes de llamar a `onSelect` (el drawer también es lazy, así que ese chunk se baja en el mismo momento de forma natural).
- **`Index.tsx`** → reemplazar `JURISDICTIONS.length` y el cálculo de `sidsNoLaw` por `KPI_SUMMARY.total` y `KPI_SUMMARY.sidsNoLaw`. Quitar el import directo de `JURISDICTIONS` y el `useEffect` que abre país por querystring se convierte en `await import("@/data/jurisdictions.data")` dentro del effect (es one-shot, no bloquea el render).

## 4. Verificación

- `bunx tsc --noEmit` — sin errores de tipos.
- Build y abrir `dist/` → confirmar que `index-*.js` ya no contiene los nombres de jurisdicciones (`grep -c "Albania" dist/assets/index-*.js` debe dar 0), y que aparecen en un chunk del mapa.
- Smoke test en preview: hero carga, KPIs correctos, "Your Country" detecta y abre drawer, mapa y tabla siguen funcionando con `?country=DEU` y `?from=DEU&to=USA`.

## Detalles técnicos

```text
Chunk inicial (hero)         Chunk lazy (al scrollear)
─────────────────────        ──────────────────────────
jurisdictions.ts (~3 KB)     jurisdictions.data.ts (~280 KB)
kpiSummary.ts (~8 KB)        recharts / d3 / maps
KPICards, Globe, YourCard    WorldMap, charts, tablas
```

Reducción esperada del JS inicial: **−250 a −280 KB** (sin gzip).

## Fuera de alcance

- Mover los datos a `public/jurisdictions.json` con `fetch` — más invasivo (todos los componentes pasarían a estado async). Lo dejamos para una tercera iteración solo si hace falta.
- Cambios de UI, copy o lógica de negocio.
