import { useEffect, useRef, useState, useCallback } from "react";
import type { ZoneColor } from "@/contexts/TargetsContext";

/**
 * Loads a zone-map image into a hidden canvas and provides:
 * 1. `maskUrl` — a data-URL overlay highlighting only the selected zone
 * 2. `getZoneAtPixel(x, y)` — returns the zone number at the given image coordinate
 */
export function useZoneHighlight(
  zoneMapSrc: string | undefined,
  zoneColors: ZoneColor[] | undefined,
  selectedZone: number | null,
  highlightColor = "rgba(255, 120, 40, 0.45)"
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [ready, setReady] = useState(false);
  const [maskUrl, setMaskUrl] = useState<string | null>(null);
  const imgW = useRef(0);
  const imgH = useRef(0);

  // Load zone map into hidden canvas
  useEffect(() => {
    if (!zoneMapSrc) { setReady(false); return; }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }
      const c = canvasRef.current;
      c.width = img.width;
      c.height = img.height;
      imgW.current = img.width;
      imgH.current = img.height;
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      ctxRef.current = ctx;
      setReady(true);
    };
    img.src = zoneMapSrc;
  }, [zoneMapSrc]);

  // Generate mask when zone changes
  useEffect(() => {
    if (!ready || !ctxRef.current || !zoneColors || selectedZone === null) {
      setMaskUrl(null);
      return;
    }

    const zc = zoneColors.find((z) => z.zone === selectedZone);
    if (!zc) { setMaskUrl(null); return; }

    const targetRGB = hexToRgb(zc.color);
    if (!targetRGB) { setMaskUrl(null); return; }

    const ctx = ctxRef.current;
    const w = imgW.current;
    const h = imgH.current;
    const srcData = ctx.getImageData(0, 0, w, h);
    const src = srcData.data;

    // Create mask canvas
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = w;
    maskCanvas.height = h;
    const mctx = maskCanvas.getContext("2d")!;
    const maskData = mctx.createImageData(w, h);
    const dst = maskData.data;

    // Parse highlight color
    const hl = parseHighlightColor(highlightColor);

    for (let i = 0; i < src.length; i += 4) {
      const match = colorMatch(src[i], src[i + 1], src[i + 2], targetRGB, 40);
      if (match) {
        dst[i] = hl.r;
        dst[i + 1] = hl.g;
        dst[i + 2] = hl.b;
        dst[i + 3] = hl.a;
      } else {
        dst[i + 3] = 0; // transparent
      }
    }

    mctx.putImageData(maskData, 0, 0);
    setMaskUrl(maskCanvas.toDataURL());
  }, [ready, zoneColors, selectedZone, highlightColor]);

  // Detect zone at pixel coordinate (normalized 0-1)
  const getZoneAtPixel = useCallback(
    (nx: number, ny: number): number | null => {
      if (!ready || !ctxRef.current || !zoneColors) return null;
      const px = Math.floor(nx * imgW.current);
      const py = Math.floor(ny * imgH.current);
      const pixel = ctxRef.current.getImageData(px, py, 1, 1).data;

      for (const zc of zoneColors) {
        const rgb = hexToRgb(zc.color);
        if (rgb && colorMatch(pixel[0], pixel[1], pixel[2], rgb, 40)) {
          return zc.zone;
        }
      }
      return null;
    },
    [ready, zoneColors]
  );

  return { maskUrl, getZoneAtPixel, ready };
}

/* ── Helpers ──────────────────────────────────────────────── */

function hexToRgb(hex: string) {
  const m = hex.replace("#", "");
  if (m.length !== 6) return null;
  return {
    r: parseInt(m.slice(0, 2), 16),
    g: parseInt(m.slice(2, 4), 16),
    b: parseInt(m.slice(4, 6), 16),
  };
}

function colorMatch(r: number, g: number, b: number, target: { r: number; g: number; b: number }, tolerance: number) {
  return Math.abs(r - target.r) <= tolerance && Math.abs(g - target.g) <= tolerance && Math.abs(b - target.b) <= tolerance;
}

function parseHighlightColor(c: string) {
  // Supports "rgba(r,g,b,a)"
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: Math.round((m[4] !== undefined ? +m[4] : 1) * 255) };
  return { r: 255, g: 120, b: 40, a: 115 };
}
