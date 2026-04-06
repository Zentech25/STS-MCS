import { useRef, useCallback } from "react";
import type { TargetType } from "@/contexts/TargetsContext";

const ACCENT = "4 80% 58%";

interface ZoneRow {
  id: string;
  zone: number;
  score: number;
}

interface TargetZonePreviewProps {
  target: TargetType;
  maskUrl: string | null;
  highlightedZone: number | null;
  rows: ZoneRow[];
  selectedRowId: string | null;
  onSelectRow: (id: string | null) => void;
  onTargetClick: (nx: number, ny: number) => void;
}

export function TargetZonePreview({
  target,
  maskUrl,
  highlightedZone,
  rows,
  selectedRowId,
  onSelectRow,
  onTargetClick,
}: TargetZonePreviewProps) {
  const imgRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      onTargetClick(nx, ny);
    },
    [onTargetClick]
  );

  const zoneLabel = target.zoneColors?.find((z) => z.zone === highlightedZone);

  return (
    <div className="lg:w-[400px] shrink-0 flex flex-col items-center gap-3">
      <div
        className="w-full rounded-2xl p-4 flex flex-col items-center"
        style={{
          background: "var(--surface-glass)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--divider)",
        }}
      >
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {target.label}
        </h4>

        {/* Target image with zone mask overlay */}
        <div
          ref={imgRef}
          className="w-full aspect-square rounded-xl overflow-hidden bg-white relative cursor-crosshair"
          onClick={handleClick}
        >
          <img
            src={target.image}
            alt={target.label}
            className="w-full h-full object-contain"
            draggable={false}
          />
          {/* Zone highlight mask */}
          {maskUrl && (
            <img
              src={maskUrl}
              alt="Zone highlight"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-200"
              draggable={false}
            />
          )}
          {/* Zone label pill */}
          {highlightedZone !== null && (
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{
                background: `hsl(${ACCENT} / 0.9)`,
                color: "white",
                boxShadow: `0 2px 12px hsl(${ACCENT} / 0.4)`,
              }}
            >
              Zone {highlightedZone}{zoneLabel ? ` — ${zoneLabel.label}` : ""} selected
            </div>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Click on the target to select a zone &middot; {target.zones} scoring zones
        </p>

        {/* Zone badges */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {rows.map((row) => {
            const zc = target.zoneColors?.find((z) => z.zone === row.zone);
            return (
              <span
                key={row.id}
                onClick={() => onSelectRow(selectedRowId === row.id ? null : row.id)}
                className="text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                style={{
                  background: selectedRowId === row.id ? `hsl(${ACCENT} / 0.3)` : `hsl(${ACCENT} / 0.15)`,
                  color: `hsl(${ACCENT})`,
                  border: selectedRowId === row.id
                    ? `1.5px solid hsl(${ACCENT})`
                    : `1px solid hsl(${ACCENT} / 0.3)`,
                }}
              >
                {zc && (
                  <span className="w-2 h-2 rounded-full" style={{ background: zc.color }} />
                )}
                Zone {row.zone}: {row.score}pts
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
