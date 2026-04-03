import { useState, useMemo } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

/* ── Types ────────────────────────────────────────────────────── */

interface TargetOption {
  id: string;
  label: string;
  rings: number; // total rings available
}

interface RingRow {
  id: string;
  ring: number; // which ring (1 = bullseye, outward)
  score: number;
}

const TARGETS: TargetOption[] = [
  { id: "silhouette", label: "Standard Silhouette", rings: 10 },
  { id: "bullseye", label: "Bullseye Target", rings: 10 },
  { id: "hostage", label: "Hostage Target", rings: 8 },
];

const EXERCISE_TYPES = ["Grouping", "Application", "Timed", "Snap Shot"] as const;

const MAX_ROWS = 8;
const ACCENT = "4 80% 58%";

/* ── SVG Target Visualization ─────────────────────────────────── */

function TargetSVG({ totalRings, highlightedRings }: { totalRings: number; highlightedRings: Set<number> }) {
  const cx = 150;
  const cy = 170;
  const maxR = 120;
  const ringWidth = maxR / totalRings;

  return (
    <svg viewBox="0 0 300 340" className="w-full h-full" style={{ maxHeight: 360 }}>
      {/* Silhouette head + shoulders outline */}
      <ellipse cx={cx} cy={60} rx={32} ry={40} fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth={1.5} />
      <path
        d={`M${cx - 70} 340 Q${cx - 70} 95 ${cx - 32} 95 L${cx + 32} 95 Q${cx + 70} 95 ${cx + 70} 340`}
        fill="hsl(var(--muted))"
        stroke="hsl(var(--border))"
        strokeWidth={1.5}
      />

      {/* Concentric scoring rings */}
      {Array.from({ length: totalRings }, (_, i) => {
        const ringNum = totalRings - i; // outer ring first
        const r = ringWidth * ringNum;
        const isHighlighted = highlightedRings.has(ringNum);
        return (
          <circle
            key={ringNum}
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

      {/* Ring labels */}
      {Array.from({ length: totalRings }, (_, i) => {
        const ringNum = i + 1;
        const r = ringWidth * ringNum - ringWidth / 2;
        const isHighlighted = highlightedRings.has(ringNum);
        return (
          <text
            key={ringNum}
            x={cx + r}
            y={cy - 4}
            textAnchor="middle"
            fontSize={9}
            fontWeight={isHighlighted ? 700 : 400}
            fill={isHighlighted ? `hsl(${ACCENT})` : "hsl(var(--muted-foreground))"}
            className="transition-all duration-300 select-none"
          >
            {ringNum}
          </text>
        );
      })}

      {/* Bullseye dot */}
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill={highlightedRings.has(1) ? `hsl(${ACCENT})` : "hsl(var(--muted-foreground))"}
      />
    </svg>
  );
}

/* ── Main Component ───────────────────────────────────────────── */

export function TargetRegionScoresPage() {
  const [selectedTarget, setSelectedTarget] = useState<string>(TARGETS[0].id);
  const [range, setRange] = useState("100");
  const [exerciseType, setExerciseType] = useState<string>(EXERCISE_TYPES[0]);
  const [rows, setRows] = useState<RingRow[]>([
    { id: "r1", ring: 1, score: 10 },
    { id: "r2", ring: 2, score: 9 },
    { id: "r3", ring: 3, score: 8 },
  ]);

  const target = TARGETS.find((t) => t.id === selectedTarget)!;
  const usedRings = new Set(rows.map((r) => r.ring));

  const availableRingsForRow = (currentRing: number) => {
    const available: number[] = [];
    for (let i = 1; i <= target.rings; i++) {
      if (!usedRings.has(i) || i === currentRing) available.push(i);
    }
    return available;
  };

  const highlightedRings = useMemo(() => new Set(rows.map((r) => r.ring)), [rows]);

  const addRow = () => {
    if (rows.length >= MAX_ROWS) {
      toast({ title: "Maximum rows reached", description: `You can add up to ${MAX_ROWS} ring rows.`, variant: "destructive" });
      return;
    }
    const nextRing = Array.from({ length: target.rings }, (_, i) => i + 1).find((r) => !usedRings.has(r));
    if (nextRing === undefined) {
      toast({ title: "All rings assigned", variant: "destructive" });
      return;
    }
    setRows((prev) => [...prev, { id: `r${Date.now()}`, ring: nextRing, score: 0 }]);
  };

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const updateRow = (id: string, patch: Partial<RingRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto animate-fade-in">
      {/* Left: Controls + Table */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        {/* Top fields row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Target */}
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

          {/* Range */}
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

          {/* Exercise Type */}
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

        {/* Ring Score Table */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground tracking-wide uppercase flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `hsl(${ACCENT} / 0.12)`, color: `hsl(${ACCENT})` }}
              >
                <span className="text-xs font-bold">⊚</span>
              </div>
              Ring Scores
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
              Add Ring
            </Button>
          </div>

          {/* Table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid var(--divider)",
              background: "var(--surface-glass)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Header */}
            <div
              className="grid grid-cols-[50px_1fr_1fr_48px] text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5"
              style={{ borderBottom: "1px solid var(--divider)" }}
            >
              <span>#</span>
              <span>Ring</span>
              <span>Score</span>
              <span />
            </div>

            {/* Rows */}
            {rows.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No rings configured. Click "Add Ring" to get started.
              </div>
            )}
            {rows.map((row, idx) => (
              <div
                key={row.id}
                className="grid grid-cols-[50px_1fr_1fr_48px] items-center px-4 py-2 transition-colors hover:bg-muted/30"
                style={{ borderBottom: idx < rows.length - 1 ? "1px solid var(--divider)" : "none" }}
              >
                <span className="text-xs font-mono text-muted-foreground">{idx + 1}</span>

                {/* Ring selector */}
                <Select
                  value={String(row.ring)}
                  onValueChange={(v) => updateRow(row.id, { ring: Number(v) })}
                >
                  <SelectTrigger className="h-8 w-28 rounded-lg text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRingsForRow(row.ring).map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        Ring {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Score */}
                <Input
                  type="number"
                  value={row.score}
                  onChange={(e) => updateRow(row.id, { score: Number(e.target.value) })}
                  className="h-8 w-24 rounded-lg text-sm"
                  min={0}
                />

                {/* Delete */}
                <button
                  onClick={() => removeRow(row.id)}
                  className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
                  title="Remove ring"
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            ))}
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
          <TargetSVG totalRings={target.rings} highlightedRings={highlightedRings} />
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {rows.map((row) => (
              <span
                key={row.id}
                className="text-[10px] font-bold px-2 py-1 rounded-lg"
                style={{
                  background: `hsl(${ACCENT} / 0.15)`,
                  color: `hsl(${ACCENT})`,
                  border: `1px solid hsl(${ACCENT} / 0.3)`,
                }}
              >
                Ring {row.ring}: {row.score}pts
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
