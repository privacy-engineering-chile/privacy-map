import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ALL_ERAS,
  ALL_REGIONS,
  ALL_STATUSES,
  Era,
  Jurisdiction,
  LawStatus,
  Treaties,
  YEAR_MAX,
  YEAR_MIN,
} from "@/data/jurisdictions";

export type ColorMode = "status" | "region" | "year" | "dpa";
export type DevFlag = "ldc" | "lldc" | "sids";

export interface Filters {
  regions: string[];
  statuses: LawStatus[];
  eras: Era[];
  yearRange: [number, number];
  search: string;
  colorMode: ColorMode;
  hasDPA: "any" | "yes" | "no";
  devFlags: DevFlag[];
  treaties: (keyof Treaties)[];
}

const DEFAULT: Filters = {
  regions: ALL_REGIONS,
  statuses: ALL_STATUSES,
  eras: ALL_ERAS,
  yearRange: [YEAR_MIN, YEAR_MAX],
  search: "",
  colorMode: "status",
  hasDPA: "any",
  devFlags: [],
  treaties: [],
};

function decode(): Filters {
  if (typeof window === "undefined") return DEFAULT;
  const p = new URLSearchParams(window.location.search);
  const regions = p.get("r")?.split(",").filter(Boolean);
  const statuses = p.get("s")?.split(",").filter(Boolean) as LawStatus[] | undefined;
  const eras = p.get("e")?.split(",").filter(Boolean) as Era[] | undefined;
  const yr = p.get("y")?.split("-").map(Number);
  const treaties = p.get("t")?.split(",").filter(Boolean) as (keyof Treaties)[] | undefined;
  const devFlags = p.get("d")?.split(",").filter(Boolean) as DevFlag[] | undefined;
  const hasDPA = (p.get("dpa") as Filters["hasDPA"]) ?? "any";
  const search = p.get("q") ?? "";
  const colorMode = (p.get("c") as ColorMode) ?? "status";
  return {
    regions: regions && regions.length ? regions : DEFAULT.regions,
    statuses: statuses && statuses.length ? statuses : DEFAULT.statuses,
    eras: eras && eras.length ? eras : DEFAULT.eras,
    yearRange: yr && yr.length === 2 ? [yr[0], yr[1]] : DEFAULT.yearRange,
    search,
    colorMode,
    hasDPA,
    devFlags: devFlags ?? [],
    treaties: treaties ?? [],
  };
}

export function useFilters() {
  const [filters, setFilters] = useState<Filters>(decode);
  const [data, setData] = useState<Jurisdiction[]>([]);

  // Load the heavy dataset lazily, off the critical path.
  useEffect(() => {
    let cancelled = false;
    import("@/data/jurisdictions.data").then((m) => {
      if (!cancelled) setData(m.JURISDICTIONS);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.regions.length !== ALL_REGIONS.length) p.set("r", filters.regions.join(","));
    if (filters.statuses.length !== ALL_STATUSES.length) p.set("s", filters.statuses.join(","));
    if (filters.eras.length !== ALL_ERAS.length) p.set("e", filters.eras.join(","));
    if (filters.yearRange[0] !== YEAR_MIN || filters.yearRange[1] !== YEAR_MAX)
      p.set("y", `${filters.yearRange[0]}-${filters.yearRange[1]}`);
    if (filters.search) p.set("q", filters.search);
    if (filters.colorMode !== "status") p.set("c", filters.colorMode);
    if (filters.hasDPA !== "any") p.set("dpa", filters.hasDPA);
    if (filters.devFlags.length) p.set("d", filters.devFlags.join(","));
    if (filters.treaties.length) p.set("t", filters.treaties.join(","));
    const qs = p.toString();
    const url = `${window.location.pathname}${qs ? "?" + qs : ""}`;
    window.history.replaceState(null, "", url);
  }, [filters]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return data.filter((j) => {
      if (!filters.regions.includes(j.region)) return false;
      if (!filters.statuses.includes(j.lawStatus)) return false;
      // Era filter only applies to jurisdictions that have an era
      if (j.era && !filters.eras.includes(j.era)) return false;
      if (j.year != null) {
        if (j.year < filters.yearRange[0] || j.year > filters.yearRange[1]) return false;
      }
      if (filters.hasDPA === "yes" && !j.hasDPA) return false;
      if (filters.hasDPA === "no" && j.hasDPA) return false;
      if (filters.devFlags.length && !filters.devFlags.some((f) => j[f])) return false;
      if (filters.treaties.length && !filters.treaties.every((t) => j.treaties[t])) return false;
      if (q && !j.jurisdiction.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filters, data]);

  const reset = useCallback(() => setFilters(DEFAULT), []);

  return { filters, setFilters, filtered, reset };
}
