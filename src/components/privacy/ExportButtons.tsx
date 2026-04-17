import { RefObject, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Camera, Link2, Check } from "lucide-react";

export const ExportButtons = ({ mapRef }: { mapRef: RefObject<HTMLDivElement> }) => {
  const [copied, setCopied] = useState(false);

  const exportPNG = async () => {
    if (!mapRef.current) return;
    const url = await toPng(mapRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: "#ffffff" });
    const a = document.createElement("a");
    a.href = url;
    a.download = "privacy-atlas-map.png";
    a.click();
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={exportPNG}>
        <Camera className="h-4 w-4" /> PNG del mapa
      </Button>
      <Button size="sm" onClick={copyLink} className="bg-accent-gradient">
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        {copied ? "¡Copiado!" : "Compartir vista"}
      </Button>
    </div>
  );
};
