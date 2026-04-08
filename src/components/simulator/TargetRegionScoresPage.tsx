import { useState, useMemo, useCallback, useRef } from "react";
import { Plus, Trash2, PlusCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { TARGETS } from "@/contexts/TargetsContext";
import { useZoneHighlight } from "@/hooks/useZoneHighlight";
import { TargetZonePreview } from "./TargetZonePreview";
import { AddTargetDialog } from "./AddTargetDialog";

/* ── Types ────────────────────────────────────────────────────── */

interface ZoneRow {
  id: string;
  zone: number;
  score: number;
}

const EXERCISE_TYPES = ["Grouping", "Application", "Timed", "Snap Shot"] as const;

const MAX_ROWS = 8;
const ACCENT = "4 80% 58%";

/* ── Main Component ───────────────────────────────────────────── */

export function TargetRegionScoresPage() {
  const [selectedTarget, setSelectedTarget] = useState<string>(TARGETS[0].id);
  const [range, setRange] = useState("100");
  const [totalZones, setTotalZones] = useState("8");
  const [exerciseType, setExerciseType] = useState<string>(EXERCISE_TYPES[0]);
  const [rows, setRows] = useState<ZoneRow[]>([
    { id: "r1", zone: 1, score: 10 },
    { id: "r2", zone: 2, score: 9 },
    { id: "r3", zone: 3, score: 8 },
  ]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const target = TARGETS.find((t) => t.id === selectedTarget)!;
  const usedZones = new Set(rows.map((r) => r.zone));

  const highlightedZone = useMemo(() => {
    const row = rows.find((r) => r.id === selectedRowId);
    return row ? row.zone : null;
  }, [rows, selectedRowId]);

  const { maskUrl, getZoneAtPixel } = useZoneHighlight(
    target.zoneMap,
    target.zoneColors,
    highlightedZone
  );

  const availableZonesForRow = (currentZone: number) => {
    const available: number[] = [];
    for (let i = 1; i <= target.zones; i++) {
      if (!usedZones.has(i) || i === currentZone) available.push(i);
    }
    return available;
  };

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

  // Click on target image to select zone
  const handleTargetClick = useCallback(
    (nx: number, ny: number) => {
      const zone = getZoneAtPixel(nx, ny);
      if (zone === null) return;
      // Find the row with this zone, or select nothing
      const row = rows.find((r) => r.zone === zone);
      if (row) {
        setSelectedRowId(selectedRowId === row.id ? null : row.id);
      }
    },
    [getZoneAtPixel, rows, selectedRowId]
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto animate-fade-in">
      {/* Left: controls + table */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target</label>
            <div className="flex gap-2">
              <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                <SelectTrigger className="flex-1 h-9 rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TARGETS.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-2">
                        <img src={t.image} alt={t.label} className="w-6 h-6 rounded object-contain bg-white" />
                        {t.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-xl gap-1.5 shrink-0"
                onClick={() => setAddDialogOpen(true)}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Target
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Zones</label>
            <Input
              type="number"
              value={totalZones}
              onChange={(e) => setTotalZones(e.target.value)}
              min={1}
              className="h-9 rounded-xl text-sm"
              placeholder="8"
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

        {/* Zone scores table */}
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
              const zoneColor = target.zoneColors?.find((z) => z.zone === row.zone);
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
                  <span className="flex items-center gap-1.5">
                    {zoneColor && (
                      <span
                        className="w-3 h-3 rounded-full border border-white/30 shrink-0"
                        style={{ background: zoneColor.color }}
                      />
                    )}
                    <span className="text-xs font-mono text-muted-foreground">{idx + 1}</span>
                  </span>

                  <Select
                    value={String(row.zone)}
                    onValueChange={(v) => updateRow(row.id, { zone: Number(v) })}
                  >
                    <SelectTrigger className="h-8 w-28 rounded-lg text-sm" onClick={(e) => e.stopPropagation()}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableZonesForRow(row.zone).map((z) => {
                        const zc = target.zoneColors?.find((c) => c.zone === z);
                        return (
                          <SelectItem key={z} value={String(z)}>
                            <div className="flex items-center gap-2">
                              {zc && <span className="w-2.5 h-2.5 rounded-full" style={{ background: zc.color }} />}
                              Zone {z}{zc ? ` — ${zc.label}` : ""}
                            </div>
                          </SelectItem>
                        );
                      })}
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

          <div className="flex justify-end mt-2">
            <Button
              className="h-9 rounded-xl gap-2 hover:opacity-90"
              style={{ background: "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}
              onClick={handleSave}
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>

      {/* Right: Target image preview with zone highlighting */}
      <TargetZonePreview
        target={target}
        maskUrl={maskUrl}
        highlightedZone={highlightedZone}
        rows={rows}
        selectedRowId={selectedRowId}
        onSelectRow={setSelectedRowId}
        onTargetClick={handleTargetClick}
      />

      <AddTargetDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={(data) => {
          toast({ title: "Target added", description: `"${data.name}" with ${data.zones} zones has been added.` });
        }}
      />
    </div>
  );
}
