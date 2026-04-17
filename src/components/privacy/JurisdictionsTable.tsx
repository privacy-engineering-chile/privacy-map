import { useMemo, useState } from "react";
import { Jurisdiction, REGION_COLORS } from "@/data/jurisdictions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download } from "lucide-react";

type SortKey = "jurisdiction" | "region" | "subRegion" | "year" | "era";

export const JurisdictionsTable = ({ data, onSelect }: { data: Jurisdiction[]; onSelect: (j: Jurisdiction) => void }) => {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "year", dir: "desc" });

  const sorted = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [data, sort]);

  const toggle = (k: SortKey) =>
    setSort((p) => (p.key === k ? { key: k, dir: p.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));

  const exportCSV = () => {
    const header = "Jurisdiction,Region,SubRegion,Year,Era\n";
    const body = sorted.map((j) => `"${j.jurisdiction}","${j.region}","${j.subRegion}",${j.year},${j.era}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "privacy-jurisdictions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const Th = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <TableHead>
      <button onClick={() => toggle(k)} className="inline-flex items-center gap-1 hover:text-foreground">
        {children} <ArrowUpDown className="h-3 w-3 opacity-60" />
      </button>
    </TableHead>
  );

  return (
    <Card className="p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display text-2xl">Datos</h3>
          <p className="text-xs text-muted-foreground">{sorted.length} resultados según filtros</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      </div>
      <div className="max-h-[480px] overflow-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <Th k="jurisdiction">Jurisdicción</Th>
              <Th k="region">Región</Th>
              <Th k="subRegion">Sub-región</Th>
              <Th k="year">Año</Th>
              <Th k="era">Era</Th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((j) => (
              <TableRow key={j.jurisdiction} className="cursor-pointer" onClick={() => onSelect(j)}>
                <TableCell className="font-medium">{j.jurisdiction}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: REGION_COLORS[j.region] }} />
                    <span className="text-xs">{j.region}</span>
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{j.subRegion}</TableCell>
                <TableCell className="tabular-nums">{j.year}</TableCell>
                <TableCell>
                  <Badge style={{ background: j.era === "Post-GDPR" ? "hsl(var(--era-post))" : "hsl(var(--era-pre))", color: "white" }}>
                    {j.era}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
