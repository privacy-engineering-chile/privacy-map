// AUTO-GENERATED from data.csv — Privacy Atlas v2 dataset

export type LawStatus = "comprehensive" | "partial" | "none";
export type Era = "Pre-GDPR" | "Post-GDPR";

export interface Treaties {
  gpa: boolean;
  gpen: boolean;
  oecd: boolean;
  oecdCandidate: boolean;
  oecdPartner: boolean;
  conv108: boolean;
  conv108plus: boolean;
  au: boolean;
  malaboSigned: boolean;
  malaboRatified: boolean;
  ecowas: boolean;
  ecowas2010: boolean;
  oecs: boolean;
  caricom: boolean;
  apec: boolean;
  asean: boolean;
  cis: boolean;
  mercosur: boolean;
}

export interface Jurisdiction {
  jurisdiction: string;
  subtitle: string | null;
  region: string;
  subRegion: string;
  iso3: string | null;
  m49: string | null;
  ldc: boolean;
  lldc: boolean;
  sids: boolean;
  lawStatus: LawStatus;
  keyLawName: string | null;
  keyLawYear: number | null;
  keyLawLink: string | null;
  keyLawPDF: string | null;
  firstLawName: string | null;
  firstLawYear: number | null;
  firstLawLink: string | null;
  firstLawPDF: string | null;
  otherLaws: string | null;
  legislativeNotes: string | null;
  dpa: string | null;
  dpaLink: string | null;
  hasDPA: boolean;
  era: Era | null;
  year: number | null;
  treaties: Treaties;
}

export const TREATY_LABELS: Record<keyof Treaties, string> = {
  gpa: "GPA",
  gpen: "GPEN",
  oecd: "OECD",
  oecdCandidate: "OECD candidate",
  oecdPartner: "OECD partner",
  conv108: "Convention 108",
  conv108plus: "Convention 108+",
  au: "African Union",
  malaboSigned: "Malabo (signed)",
  malaboRatified: "Malabo (ratified)",
  ecowas: "ECOWAS",
  ecowas2010: "ECOWAS 2010",
  oecs: "OECS",
  caricom: "CARICOM",
  apec: "APEC",
  asean: "ASEAN",
  cis: "CIS",
  mercosur: "MERCOSUR",
};

export const CORE_TREATIES: (keyof Treaties)[] = [
  "conv108", "conv108plus", "malaboRatified", "gpa", "gpen", "oecd",
];

export const BLOCS: { key: keyof Treaties; label: string }[] = [
  { key: "au", label: "African Union" },
  { key: "ecowas", label: "ECOWAS" },
  { key: "asean", label: "ASEAN" },
  { key: "apec", label: "APEC" },
  { key: "mercosur", label: "MERCOSUR" },
  { key: "caricom", label: "CARICOM" },
  { key: "oecs", label: "OECS" },
  { key: "cis", label: "CIS" },
  { key: "oecd", label: "OECD" },
];

export const STATUS_LABEL: Record<LawStatus, string> = {
  comprehensive: "Comprehensive law",
  partial: "Sectoral / partial",
  none: "No law",
};

export const STATUS_COLOR: Record<LawStatus, string> = {
  comprehensive: "hsl(var(--status-comprehensive))",
  partial: "hsl(var(--status-partial))",
  none: "hsl(var(--status-none))",
};

export const REGION_COLORS: Record<string, string> = {
  "Africa": "hsl(36 95% 55%)",
  "Asia": "hsl(178 70% 45%)",
  "Europe": "hsl(8 85% 62%)",
  "Latin America and the Caribbean": "hsl(280 65% 58%)",
  "Northern America": "hsl(220 75% 55%)",
  "Americas": "hsl(220 75% 55%)",
  "Oceania": "hsl(95 60% 50%)",
};

export const ALL_REGIONS = [
  "Africa", "Asia", "Europe", "Latin America and the Caribbean", "Americas", "Oceania",
];

export const ALL_ERAS: Era[] = ["Pre-GDPR", "Post-GDPR"];
export const ALL_STATUSES: LawStatus[] = ["comprehensive", "partial", "none"];

export const YEAR_MIN = 1973;
export const YEAR_MAX = 2024;

export type { } from "./jurisdictions.data";
export { JURISDICTIONS } from "./jurisdictions.data";
