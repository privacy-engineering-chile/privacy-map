# Mejoras de rendimiento y carga

El home (`/`) carga de golpe ~20 componentes pesados (recharts, d3-sankey, react-simple-maps, topojson, html-to-image, qrcode) y un dataset de ~12.000 líneas (`src/data/jurisdictions.ts`). Todo eso entra en el bundle inicial aunque el usuario sólo vea el hero. Plan en 4 frentes, de mayor a menor impacto.

## 1. Code-splitting de rutas y secciones below-the-fold

- Convertir `Index`, `Cookies` y `NotFound` en `React.lazy(...)` dentro de `App.tsx`, envueltos en un `<Suspense>` con un fallback ligero. Esto saca `Cookies` y `NotFound` del bundle inicial.
- Dentro de `Index.tsx`, dejar **eager** sólo lo del hero visible (header, `KPICards`, `HeroAdoptionGlobe`, `YourCountryCard`, badges/toggles).
- Lazy-load del resto envuelto en `<Suspense fallback={<SkeletonSection/>}>`:
  - `WorldMap` + `FiltersBar` (chapter 01)
  - `TreatyMatrix`, `TreatyRegionStacks`, `RegionTreatySankey` (chapter 02)
  - `RegionComparator`, `DevelopmentEquity`, `BlocExplorer`, `RegionRanking` (chapters 03–04)
  - `TravelRiskTool`, `CountryComparator`, `JurisdictionsTable`, `CountryDetailDrawer` (chapters 05+)
- Opcional: usar `IntersectionObserver` para no montar las secciones hasta que estén cerca del viewport (mejora INP además del TTI).

## 2. Reducir el peso del dataset

`src/data/jurisdictions.ts` (~12k líneas) se importa estáticamente en el hero (`KPICards`, `HeroAdoptionGlobe`, `YourCountryCard`). Opciones:

- **Mínimo invasivo:** mantener el import estático pero asegurar que sólo se importe desde componentes **lazy**, y crear un `kpiSummary.ts` precomputado (totales por status/región, número total) que use el hero. Así el JSON gigante entra sólo cuando se monta el mapa.
- **Mayor impacto:** mover los datos a `public/jurisdictions.json` y cargarlos con `fetch` + cache de React Query la primera vez que se necesiten. El bundle JS baja drásticamente.

Recomendado: empezar por el `kpiSummary.ts` precomputado (script en `scripts/`), y dejar el JSON externo para una segunda iteración si hace falta.

## 3. Diferir librerías y assets pesados

- **Topojson del mapa** (`countries-110m.json`, ~250 KB): ya se hace `fetch` en runtime, pero se dispara al cargar Index aunque el mapa esté fuera de viewport. Mover el `fetch` dentro del componente `WorldMap` ya lazy y añadir `<link rel="preconnect" href="https://cdn.jsdelivr.net">` en `index.html`.
- **html-to-image** y **qrcode**: sólo se usan en exports/share. Importarlos con `await import(...)` dentro del handler del botón, no en el top-level de `ExportButtons` / `CountryDetailDrawer`.
- **recharts** y **d3-sankey**: quedan automáticamente fuera del bundle inicial al lazy-loadear los componentes que los usan (paso 1).
- **`ipapi.co`** (geo-IP del `YourCountryCard`): el fetch falla en preview y bloquea una conexión. Envolverlo en `requestIdleCallback` / `setTimeout(…, 1500)` para no competir con el LCP.

## 4. Configuración de Vite y entrega de assets

- Añadir `build.rollupOptions.output.manualChunks` en `vite.config.ts` para separar vendors grandes:
  ```ts
  manualChunks: {
    recharts: ['recharts'],
    d3: ['d3-sankey', 'd3-scale'],
    maps: ['react-simple-maps'],
    radix: [/* paquetes @radix-ui/* usados */],
  }
  ```
- Activar `build.cssCodeSplit` (ya lo hace Vite por defecto, verificar) y `build.target: 'es2020'` para reducir polyfills.
- `<link rel="preload">` para la fuente principal del hero (display font) y `font-display: swap` en `index.css` para evitar FOIT.
- `<img>` del hero/cards con `loading="lazy"` excepto el LCP, que lleva `fetchpriority="high"`.

## Detalles técnicos

```text
App.tsx
 ├─ <Suspense fallback={<RouteSkeleton/>}>
 │   ├─ lazy(Index)        ──┐
 │   ├─ lazy(Cookies)        │ rutas en chunks separados
 │   └─ lazy(NotFound)      ─┘
 │
Index.tsx (eager: hero)
 ├─ KPICards (usa kpiSummary precomputado)
 ├─ HeroAdoptionGlobe
 ├─ YourCountryCard (ipapi diferido)
 └─ <Suspense> + lazy(...) por sección
      └─ al montar WorldMap → fetch topojson + import jurisdictions.ts
```

Métricas a vigilar antes/después con `browser--performance_profile`:
- Transfer size del bundle inicial (`/assets/index-*.js`)
- LCP del hero
- Long tasks > 50 ms durante la primera interacción

## Fuera de alcance

- Cambios de diseño, copy, traducciones.
- SSR/SSG (sigue siendo SPA Vite).
- Cambios en la página `/cookies` o en el footer.
