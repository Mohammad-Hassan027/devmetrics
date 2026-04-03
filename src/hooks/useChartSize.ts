import { useLayoutEffect, useRef, useState } from "react";

/**
 * useChartSize
 *
 * Measures the container element's pixel dimensions using ResizeObserver.
 * Returns { ref, width, height } where width/height are 0 until the browser
 * has completed layout — preventing Recharts' "-1 dimension" warning entirely.
 *
 * Usage:
 *   const { ref, width, height } = useChartSize();
 *   return (
 *     <div ref={ref} style={{ width: "100%", height: 224 }}>
 *       {width > 0 && (
 *         <BarChart width={width} height={height} .../>
 *       )}
 *     </div>
 *   );
 */
export function useChartSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (w: number, h: number) => {
      if (w > 0 && h > 0) {
        setSize((prev) =>
          prev.width === w && prev.height === h
            ? prev
            : { width: w, height: h },
        );
      }
    };

    const rect = el.getBoundingClientRect();
    update(rect.width, rect.height);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      update(width, height);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, ...size };
}
