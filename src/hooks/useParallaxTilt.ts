import { useEffect, useRef, useState } from "react";

interface Options {
  max?: number; // max degrees
  disabled?: boolean;
}

export function useParallaxTilt<T extends HTMLElement>({ max = 6, disabled }: Options = {}) {
  const ref = useRef<T | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    if (disabled) return;
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia?.("(hover: none)").matches;
    if (reduce || touch) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setTilt({ rx: -y * max, ry: x * max });
      });
    };
    const onLeave = () => setTilt({ rx: 0, ry: 0 });

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max, disabled]);

  const style: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
    transition: "transform 200ms ease-out",
    transformStyle: "preserve-3d",
    willChange: "transform",
  };

  return { ref, style };
}
