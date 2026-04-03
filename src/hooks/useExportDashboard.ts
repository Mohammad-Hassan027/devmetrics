import { useCallback, useState } from "react";

type ExportState = "idle" | "capturing" | "done" | "error";

/**
 * useExportDashboard
 *
 * Captures a DOM element to a PNG image using html2canvas and triggers
 * a browser download. Returns a ref-setter and the current export state.
 *
 * Usage:
 *   const { exportRef, exportImage, exportState } = useExportDashboard();
 *   <div ref={exportRef}>...</div>
 *   <button onClick={exportImage}>Export</button>
 */
export function useExportDashboard(filename = "devmetrics-dashboard.png") {
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);

  const exportRef = useCallback((el: HTMLElement | null) => {
    setContainerEl(el);
  }, []);

  const exportImage = useCallback(async () => {
    if (!containerEl) return;
    setExportState("capturing");

    try {
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(containerEl, {
        backgroundColor: "#0a0c10",
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        onclone: (doc) => {
          const style = doc.createElement("style");
          style.textContent = `*, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }`;
          doc.head.appendChild(style);
        },
      });

      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();

      setExportState("done");
      setTimeout(() => setExportState("idle"), 2000);
    } catch (err) {
      console.error("[useExportDashboard] capture failed:", err);
      setExportState("error");
      setTimeout(() => setExportState("idle"), 3000);
    }
  }, [containerEl, filename]);

  return { exportRef, exportImage, exportState };
}
