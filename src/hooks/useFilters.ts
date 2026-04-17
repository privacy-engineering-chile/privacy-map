import { useCallback, useEffect, useMemo, useState } from "react";
import { ALL_ERAS, ALL_REGIONS, Era, JURISDICTIONS, YEAR_MAX, YEAR_MIN } from "@/data/jurisdictions";

export interface Filters {
  regions: string[];
  eras: Era[];
  yearRange: [number, number];
  search: string;
  colorMode: "era" | "region" | "year";
}

const DEFAULT: Filters = {
  regions: ALL_REGIONS,
  eras: ALL_ERAS,
  yearRange: [YEAR_MIN, YEAR_MAX],
  search: "",
  colorMode: "era",
};

function decode(): Filters {
  if (typeof window === "undefined") return DEFAULT;
  const p = new URLSearchParams(window.location.search);
  const regions = p.get("r")?.split(",").filter(Boolean);
  const eras = p.get("e")?.split(",").filter(Boolean) as Era[] | undefined;
  const yr = p.get("y")?.split("-").map(Number);
  const search = p.get("q") ?? "";
  const colorMode = (p.get("c") as Filters["colorMode"]) ?? "era";
  return {
    regions: regions && regions.length ? regions : DEFAULT.regions,
    eras: eras && eras.length ? eras : DEFAULT.eras,
    yearRange: yr && yr.length === 2 ? [yr[0], yr[1]] : DEFAULT.yearRange,
    search,
    colorMode,
  };
}

export function useFilters() {
  const [filters, setFilters] = useState<Filters>(decode);

  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.regions.length !== ALL_REGIONS.length) p.set("r", filters.regions.join(","));
    if (filters.eras.length !== ALL_ERAS.length) p.set("e", filters.eras.join(","));
    if (filters.yearRange[0] !== YEAR_MIN || filters.yearRange[1] !== YEAR_MAX)
      p.set("y", `${filters.yearRange[0]}-${filters.yearRange[1]}`);
    if (filters.search) p.set("q", filters.search);
    if (filters.colorMode !== "era") p.set("c", filters.colorMode);
    const qs = p.toString();
    const url = `${window.location.pathname}${qs ? "?" + qs : ""}`;
    window.history.replaceState(null, "", url);
  }, [filters]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return JURISDICTIONS.filter((j) =>
      filters.regions.includes(j.region) &&
      filters.eras.includes(j.era) &&
      j.year >= filters.yearRange[0] && j.year <= filters.yearRange[1] &&
      (q === "" || j.jurisdiction.toLowerCase().includes(q))
    );
  }, [filters]);

  const reset = useCallback(() => setFilters(DEFAULT), []);

  return { filters, setFilters, filtered, reset };
}
