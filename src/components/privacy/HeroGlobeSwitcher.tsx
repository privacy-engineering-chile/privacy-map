import { lazy, Suspense, useEffect, useState } from "react";
import { hasWebGL } from "@/lib/webglSupport";
import { HeroAdoptionGlobe } from "./HeroAdoptionGlobe";
import { Jurisdiction } from "@/data/jurisdictions";

const Globe3D = lazy(() => import("./Globe3D"));

interface Props {
  total: number;
  onSelect: (j: Jurisdiction) => void;
}

export const HeroGlobeSwitcher = ({ total, onSelect }: Props) => {
  const [supports3D, setSupports3D] = useState(false);
  const [mode, setMode] = useState<"2d" | "3d">("2d");

  useEffect(() => {
    const ok = hasWebGL();
    setSupports3D(ok);
    if (ok) setMode("3d");
  }, []);

  return (
    <div className="relative">
      {mode === "3d" && supports3D ? (
        <Suspense
          fallback={
            <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm shadow-soft animate-pulse" style={{ aspectRatio: "900 / 420" }} />
          }
        >
          <Globe3D total={total} onSelect={onSelect} />
        </Suspense>
      ) : (
        <HeroAdoptionGlobe total={total} />
      )}

      {supports3D && (
        <div className="absolute bottom-3 right-3 inline-flex items-center bg-background/85 backdrop-blur rounded-full border border-border/60 p-0.5 text-[10px] uppercase tracking-widest">
          <button
            onClick={() => setMode("2d")}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              mode === "2d" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            2D
          </button>
          <button
            onClick={() => setMode("3d")}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              mode === "3d" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            3D
          </button>
        </div>
      )}
    </div>
  );
};
