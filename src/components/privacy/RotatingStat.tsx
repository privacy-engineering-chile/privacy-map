import { useEffect, useMemo, useState } from "react";
import { JURISDICTIONS } from "@/data/jurisdictions";
import { useT } from "@/i18n/LanguageContext";

const useCountUp = (target: number, duration = 1100) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf: number;
    let start = 0;
    const loop = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
};

export const RotatingStat = () => {
  const { t } = useT();
  const stats = useMemo(() => {
    const total = JURISDICTIONS.length;
    const comp = JURISDICTIONS.filter((j) => j.lawStatus === "comprehensive").length;
    const none = JURISDICTIONS.filter((j) => j.lawStatus === "none").length;
    const dpa = JURISDICTIONS.filter((j) => j.dpa?.exists).length;
    const years = JURISDICTIONS.map((j) => j.year).filter((y): y is number => !!y);
    const pioneerYear = Math.min(...years);
    const recentYear = Math.max(...years);
    return { total, comp, none, dpa, pioneerYear, recentYear };
  }, []);

  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % 4);
        setVisible(true);
      }, 300);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const keys = ["hero.rotate.1", "hero.rotate.2", "hero.rotate.3", "hero.rotate.4"];
  const message = t(keys[idx], stats as any);

  // Count-up the first number we see in the message
  const match = message.match(/(\d{2,4})/);
  const num = match ? parseInt(match[1], 10) : 0;
  const animated = useCountUp(num, 900);
  const rendered = match ? message.replace(match[1], String(animated)) : message;

  return (
    <p
      className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl text-balance min-h-[3.5rem] transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      key={idx}
      aria-live="polite"
    >
      {rendered}
    </p>
  );
};
