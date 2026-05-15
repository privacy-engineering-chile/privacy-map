export type Lang = "es" | "en";

type Dict = Record<string, { es: string; en: string }>;

export const dict: Dict = {
  // Hero
  "hero.eyebrow": { es: "Privacy Atlas v2", en: "Privacy Atlas v2" },
  "hero.title.a": { es: "¿Cómo protege el mundo tus ", en: "How does the world protect your " },
  "hero.title.accent": { es: "datos", en: "data" },
  "hero.title.b": { es: "?", en: "?" },
  "hero.subtitle": {
    es: "{total} jurisdicciones · {none} sin protección.",
    en: "{total} jurisdictions · {none} with no protection.",
  },

  // Privacy badge
  "privacy.short": { es: "Sin tracking · Sin cookies", en: "No tracking · No cookies" },
  "privacy.long": {
    es: "Este sitio no almacena nada sobre ti. Solo tus preferencias de tema e idioma quedan en tu navegador.",
    en: "This site stores nothing about you. Only your theme & language preferences are kept in your browser.",
  },

  // Theme & language
  "theme.toggle": { es: "Cambiar tema", en: "Toggle theme" },
  "lang.label": { es: "Idioma", en: "Language" },

  // KPIs
  "kpi.jurisdictions": { es: "Jurisdicciones", en: "Jurisdictions" },
  "kpi.comprehensive": { es: "Con ley integral", en: "With comprehensive law" },
  "kpi.none": { es: "Sin ley alguna", en: "No law at all" },
  "kpi.pioneer": { es: "Pionero", en: "Pioneer" },

  // Globe hero
  "globe.replay": { es: "Repetir", en: "Replay" },
  "globe.cumulative": { es: "{n} de {total}", en: "{n} of {total}" },

  // YourCountryCard
  "you.location": { es: "Tu ubicación", en: "Your location" },
  "you.viewDetail": { es: "Ver detalle", en: "View detail" },
  "you.close": { es: "Cerrar", en: "Close" },

  // Filters
  "filters.search": { es: "Buscar país…", en: "Search country…" },
  "filters.regions": { es: "Regiones", en: "Regions" },
  "filters.advanced": { es: "Avanzado", en: "Advanced" },
  "filters.dpa": { es: "Autoridad de Protección de Datos", en: "Data Protection Authority" },
  "filters.dev": { es: "Clasificación de desarrollo", en: "Development classification" },
  "filters.treaties": { es: "Tratados (todos requeridos)", en: "Treaties (all required)" },
  "filters.dpa.any": { es: "Cualquiera", en: "Any" },
  "filters.dpa.yes": { es: "Con DPA", en: "With DPA" },
  "filters.dpa.no": { es: "Sin DPA", en: "No DPA" },
  "filters.reset": { es: "Reset", en: "Reset" },
  "filters.color.status": { es: "Estatus", en: "Status" },
  "filters.color.region": { es: "Región", en: "Region" },
  "filters.color.year": { es: "Año", en: "Year" },
  "filters.color.dpa": { es: "DPA", en: "DPA" },

  // Chapters
  "ch1.title": { es: "Cobertura — el mapa global", en: "Coverage — the global map" },
  "ch1.lead": {
    es: "Dónde existe ley integral, sectorial o ninguna.",
    en: "Where comprehensive, sectoral, or no law exists.",
  },
  "ch1.sids": {
    es: "{n} pequeños estados insulares aún sin ley integral.",
    en: "{n} small island states still without a comprehensive law.",
  },

  "ch2.title": { es: "La red de tratados", en: "The treaty network" },
  "ch2.lead": {
    es: "Conexiones invisibles que tejen el estándar global.",
    en: "Invisible connections weaving the global standard.",
  },

  "ch3.title": { es: "Evolución y madurez", en: "Evolution & maturity" },
  "ch3.lead": {
    es: "Quién modernizó su marco y quién se quedó atrás.",
    en: "Who modernised their framework, and who fell behind.",
  },

  "ch4.title": { es: "Equidad y bloques", en: "Equity & blocs" },
  "ch4.lead": { es: "La protección no se distribuye por igual.", en: "Protection is not distributed equally." },

  "ch5.title": { es: "Los datos", en: "The data" },
  "ch5.lead": { es: "Explora, ordena y exporta el dataset.", en: "Explore, sort and export the dataset." },

  // Region comparator
  "rc.title": { es: "Adopción por región", en: "Adoption by region" },
  "rc.lead": { es: "Cómo cada región adoptó leyes en el tiempo.", en: "How each region adopted laws over time." },
  "rc.cum": { es: "Acumulado", en: "Cumulative" },
  "rc.new": { es: "Nuevas/año", en: "New/year" },

  // DevelopmentEquity
  "de.title": { es: "Equidad en la protección", en: "Equity in protection" },
  "de.lead": {
    es: "Cobertura por clasificación · global: {pct}% con ley integral.",
    en: "Coverage by classification · global: {pct}% with comprehensive law.",
  },
  "de.ldc": { es: "Países menos adelantados (LDC)", en: "Least developed countries (LDC)" },
  "de.ldc.desc": { es: "Naciones con menor IDH", en: "Lowest HDI nations" },
  "de.lldc": { es: "Países en desarrollo sin litoral (LLDC)", en: "Landlocked developing countries (LLDC)" },
  "de.lldc.desc": { es: "Sin acceso al mar", en: "No sea access" },
  "de.sids": { es: "Pequeños estados insulares (SIDS)", en: "Small island states (SIDS)" },
  "de.sids.desc": { es: "Pequeñas islas en desarrollo", en: "Small developing islands" },
  "de.legend.comp": { es: "Integral", en: "Comprehensive" },
  "de.legend.part": { es: "Parcial", en: "Partial" },
  "de.legend.none": { es: "Sin ley", en: "No law" },
  "de.countries": { es: "{n} países", en: "{n} countries" },

  // BlocExplorer
  "bloc.title": { es: "Explorador de bloques", en: "Blocs explorer" },
  "bloc.lead": { es: "Cobertura por bloque económico/regional.", en: "Coverage by economic/regional bloc." },
  "bloc.members": { es: "Miembros", en: "Members" },
  "bloc.lawpct": { es: "% con ley", en: "% with law" },
  "bloc.avgyear": { es: "Año medio", en: "Avg year" },
  "bloc.empty": { es: "Sin miembros en el filtro actual.", en: "No members under current filter." },

  // RegionRanking
  "rr.title": { es: "Velocidad de adopción", en: "Adoption speed" },
  "rr.lead": { es: "Año promedio (más bajo = adoptó antes).", en: "Average year (lower = earlier adoption)." },

  // TreatyMatrix
  "tm.title": { es: "Red de tratados", en: "Treaty network" },
  "tm.lead": { es: "Conexión a marcos internacionales.", en: "Connection to international frameworks." },
  "tm.allRegions": { es: "Todas las regiones", en: "All regions" },
  "tm.country": { es: "País", en: "Country" },
  "tm.footer": { es: "Hasta 60 países con ≥1 tratado.", en: "Up to 60 countries with ≥1 treaty." },

  // TreatyRegionStacks
  "trs.title": { es: "Tratados por región", en: "Treaties by region" },
  "trs.lead": { es: "Membresías acumuladas en marcos.", en: "Cumulative memberships in frameworks." },

  // Sankey
  "sk.title": { es: "Flujo Región → Tratado", en: "Region → Treaty flow" },
  "sk.lead": {
    es: "Cada hilo = jurisdicciones de una región en un tratado.",
    en: "Each thread = jurisdictions of a region within a treaty.",
  },

  // TravelRiskTool
  "trv.title": { es: "¿Tus datos viajan seguros?", en: "Do your data travel safely?" },
  "trv.lead": {
    es: "Compara países y mide la caída en protección al cruzar la frontera.",
    en: "Compare countries and measure the protection drop across borders.",
  },
  "trv.from": { es: "Origen", en: "Origin" },
  "trv.to": { es: "Destino", en: "Destination" },
  "trv.drop": { es: "Caída de protección", en: "Protection drop" },
  "trv.shared": { es: "Tratados en común", en: "Shared treaties" },
  "trv.high": { es: "Riesgo alto", en: "High risk" },
  "trv.caution": { es: "Precaución", en: "Caution" },
  "trv.safe": { es: "Datos a salvo", en: "Data safe" },
  "trv.swap": { es: "Intercambiar", en: "Swap" },
  "trv.search": { es: "Buscar país…", en: "Search country…" },
  "trv.score": { es: "Puntuación", en: "Score" },
  "trv.howtitle": { es: "Cómo se calcula", en: "How it's calculated" },
  "trv.how.law.label": { es: "Ley", en: "Law" },
  "trv.how.law.value": { es: "Integral 80 · Sectorial 40 · Ninguna 0", en: "Comprehensive 80 · Sectoral 40 · None 0" },
  "trv.how.dpa.label": { es: "Autoridad (DPA)", en: "Authority (DPA)" },
  "trv.how.dpa.value": { es: "+10", en: "+10" },
  "trv.how.treaty.label": { es: "Tratado clave", en: "Key treaty" },
  "trv.how.treaty.value": { es: "+10", en: "+10" },
  "trv.how.formula": { es: "Caída = origen − destino", en: "Drop = origin − destination" },
  "trv.verdict.label": { es: "Veredicto", en: "Verdict" },
  "trv.improvement": { es: "Mejora de protección", en: "Protection upgrade" },

  // CountryComparator
  "cc.title": { es: "Compara hasta {n} países", en: "Compare up to {n} countries" },
  "cc.lead": {
    es: "Leyes, autoridad, tratados y antigüedad — lado a lado.",
    en: "Laws, authority, treaties and age — side by side.",
  },
  "cc.add": { es: "Añadir país", en: "Add country" },
  "cc.search": { es: "Buscar país…", en: "Search country…" },
  "cc.empty": { es: "Añade países para comenzar la comparación.", en: "Add countries to start comparing." },
  "cc.noresults": { es: "Sin resultados.", en: "No results." },
  "cc.remove": { es: "Quitar", en: "Remove" },
  "cc.keylaw": { es: "Ley vigente", en: "Current law" },
  "cc.firstlaw": { es: "Primera ley", en: "First law" },
  "cc.age": { es: "Antigüedad ley vigente", en: "Current law age" },
  "cc.dpa": { es: "Autoridad (DPA)", en: "Authority (DPA)" },
  "cc.dpa.none": { es: "Sin autoridad", en: "No authority" },
  "cc.treaties": { es: "Tratados", en: "Treaties" },

  // JurisdictionsTable
  "jt.title": { es: "Datos", en: "Data" },
  "jt.results": { es: "{n} resultados según filtros", en: "{n} results matching filters" },
  "jt.export": { es: "Exportar CSV", en: "Export CSV" },
  "jt.col.juris": { es: "Jurisdicción", en: "Jurisdiction" },
  "jt.col.region": { es: "Región", en: "Region" },
  "jt.col.sub": { es: "Sub-región", en: "Sub-region" },
  "jt.col.year": { es: "Año", en: "Year" },
  "jt.col.status": { es: "Estatus", en: "Status" },

  // Drawer
  "dr.share": { es: "Compartir", en: "Share" },
  "dr.download": { es: "Descargar tarjeta", en: "Download card" },
  "dr.keylaw": { es: "Ley clave", en: "Key law" },
  "dr.firstlaw": { es: "Primera ley", en: "First law" },
  "dr.dpa": { es: "Autoridad de Protección", en: "Protection Authority" },
  "dr.dpa.site": { es: "Sitio oficial", en: "Official site" },
  "dr.dpa.none": { es: "Sin DPA aparente.", en: "No DPA apparent." },
  "dr.treaties": { es: "Tratados y redes", en: "Treaties & networks" },
  "dr.other": { es: "Otras leyes notables", en: "Other notable laws" },
  "dr.notes": { es: "Actualizaciones legislativas", en: "Legislative updates" },
  "dr.rank": { es: "Posición cronológica", en: "Chronological rank" },
  "dr.rank.text": {
    es: "País #{n} en adoptar regulación integral.",
    en: "Country #{n} to adopt comprehensive regulation.",
  },
  "dr.nokeylaw": { es: "Sin ley integral identificada.", en: "No comprehensive law identified." },
  "dr.site": { es: "Sitio", en: "Site" },
  "dr.toast.shareFail": { es: "No se pudo compartir", en: "Couldn't share" },
  "dr.toast.shareFailDesc": { es: "Intenta descargar la imagen.", en: "Try downloading the image instead." },
  "dr.toast.downloaded": { es: "Tarjeta descargada", en: "Card downloaded" },

  // Export
  "exp.png": { es: "PNG del mapa", en: "Map as PNG" },
  "exp.share": { es: "Compartir vista", en: "Share view" },
  "exp.copied": { es: "¡Copiado!", en: "Copied!" },

  // WorldMap legend
  "map.legend.comp": { es: "Ley integral", en: "Comprehensive" },
  "map.legend.sect": { es: "Sectorial", en: "Sectoral" },
  "map.legend.none": { es: "Sin ley", en: "No law" },
  "map.legend.dpaY": { es: "Con DPA", en: "With DPA" },
  "map.legend.dpaN": { es: "Sin DPA", en: "No DPA" },
  "map.legend.foot": { es: "{n} jurisdicciones · gris = sin datos", en: "{n} jurisdictions · grey = no data" },

  // Footer
  "ft.builtby": { es: "Construido por", en: "Built by" },
  "ft.privacy": { es: "", en: "" },

  // Hero rotating stats & cues
  "hero.valueprop": {
    es: "50 años de leyes de privacidad, en una sola pantalla.",
    en: "50 years of privacy law, on one screen.",
  },
  "hero.scrollcue": { es: "Recorre el atlas", en: "Scroll the atlas" },
  "hero.rotate.1": {
    es: "{comp} de {total} países tienen una ley integral de privacidad.",
    en: "{comp} of {total} countries have a comprehensive privacy law.",
  },
  "hero.rotate.2": {
    es: "Aún hay {none} jurisdicciones sin ley alguna de protección.",
    en: "{none} jurisdictions still have no data protection law at all.",
  },
  "hero.rotate.3": {
    es: "{dpa} países cuentan con una autoridad de protección activa.",
    en: "{dpa} countries have an active data protection authority.",
  },
  "hero.rotate.4": {
    es: "El primer país en legislar lo hizo en {pioneerYear}. El más reciente, en {recentYear}.",
    en: "The first country legislated in {pioneerYear}. The most recent, in {recentYear}.",
  },
  "globe.replayLabel": { es: "▶ Repetir 1973 → 2024", en: "▶ Replay 1973 → 2024" },
};

export const tFormat = (s: string, vars?: Record<string, string | number>) => {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
};
