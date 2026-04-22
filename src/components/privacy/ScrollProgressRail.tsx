import { useEffect, useState } from "react";

export const ScrollProgressRail = () => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      setPct(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = pct > 0.5 && pct < 99;

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="h-full bg-accent shadow-[0_0_8px_hsl(var(--accent))]"
        style={{ width: `${pct}%`, transition: "width 80ms linear" }}
      />
    </div>
  );
};
