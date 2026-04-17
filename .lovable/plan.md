
# 🌍 Privacy Atlas — Dashboard interactivo de regulación de privacidad mundial

Una experiencia visual tipo *Information is Beautiful*: colorida, narrativa y data-driven, centrada en un mapa mundial interactivo de las leyes de privacidad por país.

## Estructura de la página (single-page)

### 1. Hero / Header
- Título grande con tipografía display + subtítulo narrativo: *"126 jurisdicciones, una historia global de la privacidad"*.
- 4 KPIs con números grandes y colores vibrantes:
  - Total de jurisdicciones
  - % Post-GDPR (post-2018)
  - Año pico de adopción
  - Regiones cubiertas
- Paleta colorida por región (Europa, Asia, África, Américas, Oceanía) + acento neón para "Post-GDPR".

### 2. Mapa mundial interactivo (pieza central)
- Mapa SVG/coreográfico del mundo coloreado por **era** (Pre/Post-GDPR) con toggle para colorear por **año** (gradiente) o por **región**.
- Hover → tooltip con país, año, era, región.
- Click → abre **panel lateral de detalle** (drawer) con ficha del país: bandera/emoji, año de la ley, era, región/sub-región, posición cronológica ("el país #45 en adoptar regulación") y comparación con vecinos.
- Leyenda visual estilo infográfico abajo.

### 3. Barra de filtros (sticky)
- Chips multi-select para **Región** y **Era**.
- Slider de rango de años (1996–2023).
- Buscador de país.
- Los filtros afectan mapa + todos los gráficos en vivo.

### 4. Comparador de regiones
- Gráfico de área apilada / líneas: **adopción acumulada por región a lo largo del tiempo** (1996→2023).
- Permite ver claramente el "boom GDPR" de 2018 y la ola posterior en África/Asia.
- Toggle: acumulado vs. nuevas leyes por año.

### 5. Distribución visual
- **Treemap** por sub-región mostrando cuántos países regulan en cada una, coloreado por % Post-GDPR.
- **Barras horizontales** con ranking de regiones por velocidad de adopción.

### 6. Timeline narrativa
- Banda horizontal con hitos clave (Israel 1996, India 2000, **GDPR 2018**, etc.) y puntos por país, agrupados por color regional.

### 7. Tabla de datos (al final)
- Tabla filtrable y ordenable con todas las jurisdicciones. Respeta los filtros activos.
- Botón de **exportar CSV** de la vista filtrada.

### 8. Compartir / exportar
- Botón "Exportar PNG del mapa" (snapshot de la vista actual).
- Botón "Copiar enlace" que codifica los filtros en la URL para compartir vistas específicas.

## Estilo visual (Information is Beautiful)
- **Paleta vibrante por región**: cada continente con su color distintivo (ej. Europa coral, Asia turquesa, África ámbar, Américas violeta, Oceanía verde lima).
- Acento neón/magenta para resaltar "Post-GDPR" y elementos interactivos.
- Fondo crema/off-white con tarjetas suaves y mucho whitespace.
- Tipografía: display serif elegante para titulares + sans-serif geométrica para datos.
- Microanimaciones: fade-in al scroll, transiciones suaves al filtrar, pulso en el país seleccionado.
- Totalmente responsive: en móvil el mapa se mantiene central y los paneles se apilan.

## Datos
- CSV embebido como constante TS (`src/data/jurisdictions.ts`) con los 126 registros que enviaste, tipados.
- Todo cliente, sin backend.

## Stack técnico
- **react-simple-maps** + topojson world atlas para el mapa.
- **Recharts** para área apilada, barras y treemap.
- **html-to-image** para exportar PNG.
- shadcn/ui (Drawer, Slider, Badge, Table) + Tailwind con tokens de color personalizados en `index.css`.

## Entregables
1. Sistema de diseño actualizado (`index.css` + `tailwind.config.ts`) con paleta infográfica por región.
2. Página `Index` rediseñada con todas las secciones anteriores.
3. Componentes: `WorldMap`, `CountryDetailDrawer`, `FiltersBar`, `RegionComparator`, `SubRegionTreemap`, `MilestonesTimeline`, `JurisdictionsTable`, `KPICards`, `ExportButtons`.
4. Hook `useFilters` con sincronización a URL para compartir vistas.
