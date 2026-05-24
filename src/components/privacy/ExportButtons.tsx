import { RefObject, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Link2, Check } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

export const ExportButtons = ({ mapRef }: { mapRef: RefObject<HTMLDivElement> }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useT();

  const exportPNG = async () => {
    if (!mapRef.current) return;
    const { toPng } = await import("html-to-image");
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
      <Button variant="outline" size="sm" onClick={exportPNG} className="h-10">
        <Camera className="h-4 w-4" /> <span className="hidden sm:inline">{t("exp.png")}</span>
      </Button>
      <Button size="sm" onClick={copyLink} className="bg-accent-gradient h-10">
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        <span className="hidden sm:inline">{copied ? t("exp.copied") : t("exp.share")}</span>
      </Button>
    </div>
  );
};
