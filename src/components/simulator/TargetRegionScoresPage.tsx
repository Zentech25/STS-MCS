import { useState, useMemo } from "react";
import { Plus, Trash2, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

/* ── Types ────────────────────────────────────────────────────── */

interface TargetOption {
  id: string;
  label: string;
  zones: number;
}

interface ZoneRow {
  id: string;
  zone: number;
  score: number;
}

const TARGETS: TargetOption[] = [
  { id: "silhouette", label: "Standard Silhouette", zones: 10 },
  { id: "bullseye", label: "Bullseye Target", zones: 10 },
  { id: "hostage", label: "Hostage Target", zones: 8 },
];

const EXERCISE_TYPES = ["Grouping", "Application", "Timed", "Snap Shot"] as const;

const MAX_ROWS = 8;
const ACCENT = "4 80% 58%";

/* ── SVG Target Visualization ─────────────────────────────────── */

function TargetSVG({ totalZones, highlightedZone }: { totalZones: number; highlightedZone: number | null }) {
  const cx = 150;
  const cy = 170;
  const maxR = 120;
  const zoneWidth = maxR / totalZones;

  return (
    <svg viewBox="0 0 300 340" className="w-full h-full" style={{ maxHeight: 360 }}>
      <ellipse cx={cx} cy={60} rx={32} ry={40} fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth={1.5} />
      <path
        d={`M${cx - 70} 340 Q${cx - 70} 95 ${cx - 32} 95 L${cx + 32} 95 Q${cx + 70} 95 ${cx + 70} 340`}
        fill="hsl(var(--muted))"
        stroke="hsl(var(--border))"
        strokeWidth={1.5}
      />

      {Array.from({ length: totalZones }, (_, i) => {
        const zoneNum = totalZones - i;
        const r = zoneWidth * zoneNum;
        const isHighlighted = highlightedZone === zoneNum;
        return (
          <circle
            key={zoneNum}
            cx={cx}
            cy={cy}
            r={r}
            fill={isHighlighted ? `hsl(${ACCENT} / 0.25)` : "transparent"}
            stroke={isHighlighted ? `hsl(${ACCENT})` : "hsl(var(--border))"}
            strokeWidth={isHighlighted ? 2.5 : 1}
            className="transition-all duration-300"
          />
        );
      })}

      {Array.from({ length: totalZones }, (_, i) => {
        const zoneNum = i + 1;
        const r = zoneWidth * zoneNum - zoneWidth / 2;
        const isHighlighted = highlightedZone === zoneNum;
        return (
          <text
            key={zoneNum}
            x={cx + r}
            y={cy - 4}
            textAnchor="middle"
            fontSize={9}
            fontWeight={isHighlighted ? 700 : 400}
            fill={isHighlighted ? `hsl(${ACCENT})` : "hsl(var(--muted-foreground))"}
            className="transition-all duration-300 select-none"
          >
            {zoneNum}
          </text>
        );
      })}

      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill={highlightedZone === 1 ? `hsl(${ACCENT})` : "hsl(var(--muted-foreground))"}
      />
    </svg>
  );
}

/* ── Main Component ───────────────────────────────────────────── */

export function TargetRegionScoresPage() {
  const [selectedTarget, setSelectedTarget] = useState<string>(TARGETS[0].id);
  const [range, setRange] = useState("100");
  const [exerciseType, setExerciseType] = useState<string>(EXERCISE_TYPES[0]);
  const [rows, setRows] = useState<ZoneRow[]>([
    { id: "r1", zone: 1, score: 10 },
    { id: "r2", zone: 2, score: 9 },
    { id: "r3", zone: 3, score: 8 },
  ]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const target = TARGETS.find((t) => t.id === selectedTarget)!;
  const usedZones = new Set(rows.map((r) => r.zone));

  const availableZonesForRow = (currentZone: number) => {
    const available: number[] = [];
    for (let i = 1; i <= target.zones; i++) {
      if (!usedZones.has(i) || i === currentZone) available.push(i);
    }
    return available;
  };

  const highlightedZone = useMemo(() => {
    const row = rows.find((r) => r.id === selectedRowId);
    return row ? row.zone : null;
  }, [rows, selectedRowId]);

  const addRow = () => {
    if (rows.length >= MAX_ROWS) {
      toast({ title: "Maximum rows reached", description: `You can add up to ${MAX_ROWS} zone rows.`, variant: "destructive" });
      return;
    }
    const nextZone = Array.from({ length: target.zones }, (_, i) => i + 1).find((z) => !usedZones.has(z));
    if (nextZone === undefined) {
      toast({ title: "All zones assigned", variant: "destructive" });
      return;
    }
    const newId = `r${Date.now()}`;
    setRows((prev) => [...prev, { id: newId, zone: nextZone, score: 0 }]);
    setSelectedRowId(newId);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (selectedRowId === id) setSelectedRowId(null);
  };

  const updateRow = (id: string, patch: Partial<ZoneRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const handleSave = () => {
    toast({ title: "Configuration saved", description: "Target region scores have been saved successfully." });
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto animate-fade-in">
      {/* Left: Controls + Table */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        {/* Top fields row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target</label>
            <div className="flex gap-2">
              <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                <SelectTrigger className="flex-1 h-9 rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TARGETS.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-xl gap-1.5 shrink-0"
                onClick={() => toast({ title: "Import Target", description: "Target import dialog coming soon." })}
              >
                <Upload className="w-3.5 h-3.5" />
                Import
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Range (m)</label>
            <Input
              type="number"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              min={1}
              className="h-9 rounded-xl text-sm"
              placeholder="100"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exercise Type</label>
            <div className="flex flex-wrap gap-2">
              {EXERCISE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setExerciseType(type)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] select-none"
                  style={{
                    background: exerciseType === type ? `hsl(${ACCENT} / 0.15)` : "hsl(var(--muted) / 0.5)",
                    color: exerciseType === type ? `hsl(${ACCENT})` : "hsl(var(--muted-foreground))",
                    border: exerciseType === type
                      ? `1.5px solid hsl(${ACCENT} / 0.4)`
                      : "1.5px solid hsl(var(--border))",
                    boxShadow: exerciseType === type ? `0 0 10px hsl(${ACCENT} / 0.1)` : "none",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Zone Score Table */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground tracking-wide uppercase flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `hsl(${ACCENT} / 0.12)`, color: `hsl(${ACCENT})` }}
              >
                <span className="text-xs font-bold">⊚</span>
              </div>
              Zone Scores
              <span className="text-xs font-normal text-muted-foreground ml-1">
                {rows.length} / {MAX_ROWS}
              </span>
            </h3>
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-xl gap-1.5 text-xs"
              onClick={addRow}
              disabled={rows.length >= MAX_ROWS}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Zone
            </Button>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid var(--divider)",
              background: "var(--surface-glass)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="grid grid-cols-[50px_1fr_1fr_48px] text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5"
              style={{ borderBottom: "1px solid var(--divider)" }}
            >
              <span>#</span>
              <span>Zone</span>
              <span>Score</span>
              <span />
            </div>

            {rows.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No zones configured. Click "Add Zone" to get started.
              </div>
            )}
            {rows.map((row, idx) => {
              const isSelected = selectedRowId === row.id;
              return (
                <div
                  key={row.id}
                  onClick={() => setSelectedRowId(isSelected ? null : row.id)}
                  className="grid grid-cols-[50px_1fr_1fr_48px] items-center px-4 py-2 transition-colors cursor-pointer"
                  style={{
                    borderBottom: idx < rows.length - 1 ? "1px solid var(--divider)" : "none",
                    background: isSelected ? `hsl(${ACCENT} / 0.08)` : "transparent",
                  }}
                >
                  <span className="text-xs font-mono text-muted-foreground">{idx + 1}</span>

                  <Select
                    value={String(row.zone)}
                    onValueChange={(v) => updateRow(row.id, { zone: Number(v) })}
                  >
                    <SelectTrigger className="h-8 w-28 rounded-lg text-sm" onClick={(e) => e.stopPropagation()}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableZonesForRow(row.zone).map((z) => (
                        <SelectItem key={z} value={String(z)}>
                          Zone {z}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    value={row.score}
                    onChange={(e) => updateRow(row.id, { score: Number(e.target.value) })}
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 w-24 rounded-lg text-sm"
                    min={0}
                  />

                  <button
                    onClick={(e) => { e.stopPropagation(); removeRow(row.id); }}
                    className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
                    title="Remove zone"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Save button */}
          <div className="flex justify-end mt-2">
            <Button
              className="h-9 rounded-xl gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSave}
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>

      {/* Right: Target Visualization */}
      <div className="lg:w-[320px] shrink-0 flex flex-col items-center gap-3">
        <div
          className="w-full rounded-2xl p-4 flex flex-col items-center"
          style={{
            background: "var(--surface-glass)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--divider)",
          }}
        >
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {target.label}
          </h4>
          <TargetSVG totalZones={target.zones} highlightedZone={highlightedZone} />
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {rows.map((row) => (
              <span
                key={row.id}
                onClick={() => setSelectedRowId(selectedRowId === row.id ? null : row.id)}
                className="text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer transition-all"
                style={{
                  background: selectedRowId === row.id ? `hsl(${ACCENT} / 0.3)` : `hsl(${ACCENT} / 0.15)`,
                  color: `hsl(${ACCENT})`,
                  border: selectedRowId === row.id
                    ? `1.5px solid hsl(${ACCENT})`
                    : `1px solid hsl(${ACCENT} / 0.3)`,
                }}
              >
                Zone {row.zone}: {row.score}pts
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
