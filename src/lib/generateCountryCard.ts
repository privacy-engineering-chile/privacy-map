import QRCode from "qrcode";
import {
  CORE_TREATIES,
  Jurisdiction,
  REGION_COLORS,
  STATUS_COLOR,
  STATUS_LABEL,
  TREATY_LABELS,
} from "@/data/jurisdictions";

const SIZE = 1080;

const ISO_TO_FLAG = (iso3?: string | null) => {
  if (!iso3) return "🌐";
  const map: Record<string, string> = {
    USA: "US", DEU: "DE", FRA: "FR", GBR: "GB", BRA: "BR", MEX: "MX", ESP: "ES",
    JPN: "JP", CHN: "CN", IND: "IN", CAN: "CA", AUS: "AU", ARG: "AR", ITA: "IT",
  };
  const code = map[iso3];
  if (!code) return "🌐";
  return String.fromCodePoint(...code.split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
};

// Resolve hsl(var(--name)) tokens to actual hex/hsl strings
const resolveColor = (cssVar: string): string => {
  const match = cssVar.match(/var\((--[\w-]+)\)/);
  if (!match) return cssVar;
  const value = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
  return `hsl(${value})`;
};

export async function generateCountryCard(country: Jurisdiction): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = resolveColor("hsl(var(--background))");
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle dotted grid
  ctx.fillStyle = resolveColor("hsl(var(--muted-foreground))") + "";
  ctx.globalAlpha = 0.08;
  for (let x = 40; x < SIZE; x += 40) {
    for (let y = 40; y < SIZE; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  // Region color band (top)
  const regionColor = REGION_COLORS[country.region] ?? resolveColor("hsl(var(--accent))");
  ctx.fillStyle = regionColor;
  ctx.fillRect(0, 0, SIZE, 220);

  // Accent corner triangle
  ctx.fillStyle = resolveColor("hsl(var(--accent))");
  ctx.beginPath();
  ctx.moveTo(SIZE, 0);
  ctx.lineTo(SIZE, 140);
  ctx.lineTo(SIZE - 140, 0);
  ctx.closePath();
  ctx.fill();

  // Flag emoji
  ctx.font = "120px serif";
  ctx.textBaseline = "middle";
  ctx.fillText(ISO_TO_FLAG(country.iso3), 60, 110);

  // Region label
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "600 22px 'Space Grotesk', sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(country.region.toUpperCase() + " · " + country.subRegion.toUpperCase(), 220, 90);

  // Country name
  ctx.fillStyle = "white";
  ctx.font = "900 64px 'Fraunces', Georgia, serif";
  ctx.fillText(country.jurisdiction, 220, 160);

  // Status badge
  const statusColor = STATUS_COLOR[country.lawStatus];
  ctx.fillStyle = statusColor;
  const statusLabel = STATUS_LABEL[country.lawStatus];
  ctx.font = "700 28px 'Space Grotesk', sans-serif";
  const sw = ctx.measureText(statusLabel).width + 60;
  const radius = 24;
  ctx.beginPath();
  ctx.roundRect(60, 280, sw, 60, radius);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.fillText(statusLabel, 90, 322);

  // Key law block
  ctx.fillStyle = resolveColor("hsl(var(--foreground))");
  ctx.font = "600 22px 'Space Grotesk', sans-serif";
  ctx.fillText("LEY CLAVE" + (country.keyLawYear ? " · " + country.keyLawYear : ""), 60, 410);

  ctx.font = "700 36px 'Fraunces', Georgia, serif";
  const lawName = country.keyLawName ?? "Sin ley integral identificada";
  // Wrap text
  const words = lawName.split(" ");
  let line = "";
  let y = 460;
  const maxWidth = SIZE - 120;
  for (const w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, 60, y);
      line = w + " ";
      y += 48;
      if (y > 600) break;
    } else {
      line = test;
    }
  }
  if (line && y <= 600) ctx.fillText(line, 60, y);

  // DPA
  ctx.font = "600 22px 'Space Grotesk', sans-serif";
  ctx.fillStyle = resolveColor("hsl(var(--muted-foreground))");
  ctx.fillText("AUTORIDAD", 60, 680);
  ctx.fillStyle = resolveColor("hsl(var(--foreground))");
  ctx.font = "500 26px 'Space Grotesk', sans-serif";
  ctx.fillText(country.hasDPA && country.dpa ? country.dpa.slice(0, 60) : "Sin DPA aparente", 60, 720);

  // Treaty dots row
  ctx.fillStyle = resolveColor("hsl(var(--muted-foreground))");
  ctx.font = "600 22px 'Space Grotesk', sans-serif";
  ctx.fillText("TRATADOS", 60, 800);
  let cx = 60;
  CORE_TREATIES.forEach((t) => {
    const member = country.treaties[t];
    ctx.fillStyle = member ? resolveColor("hsl(var(--status-treaty))") : resolveColor("hsl(var(--muted))");
    ctx.beginPath();
    ctx.arc(cx + 18, 850, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = member ? "white" : resolveColor("hsl(var(--muted-foreground))");
    ctx.font = "600 14px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(TREATY_LABELS[t].slice(0, 4), cx + 18, 855);
    ctx.textAlign = "start";
    cx += 80;
  });

  // QR code
  const qrUrl = `${window.location.origin}/?country=${country.iso3 ?? ""}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    margin: 1,
    width: 180,
    color: {
      dark: resolveColor("hsl(var(--foreground))"),
      light: "#00000000",
    },
  });
  const qrImg = new Image();
  await new Promise<void>((res) => {
    qrImg.onload = () => res();
    qrImg.src = qrDataUrl;
  });
  ctx.drawImage(qrImg, SIZE - 220, SIZE - 220, 180, 180);

  // Footer
  ctx.fillStyle = resolveColor("hsl(var(--muted-foreground))");
  ctx.font = "600 22px 'Space Grotesk', sans-serif";
  ctx.fillText("PRIVACY ATLAS v2", 60, SIZE - 100);
  ctx.fillStyle = resolveColor("hsl(var(--foreground))");
  ctx.font = "500 28px 'Space Grotesk', sans-serif";
  ctx.fillText("privacy-map.lovable.app", 60, SIZE - 60);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), "image/png");
  });
}

export async function downloadCountryCard(country: Jurisdiction) {
  const blob = await generateCountryCard(country);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `privacy-atlas-${country.iso3 ?? country.jurisdiction}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function shareCountryCard(country: Jurisdiction) {
  const blob = await generateCountryCard(country);
  const file = new File([blob], `${country.jurisdiction}.png`, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `${country.jurisdiction} · Privacy Atlas`,
        text: `Cómo protege ${country.jurisdiction} tus datos personales.`,
      });
      return;
    } catch {
      /* user cancelled; fall through to download */
    }
  }
  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `privacy-atlas-${country.iso3 ?? country.jurisdiction}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
