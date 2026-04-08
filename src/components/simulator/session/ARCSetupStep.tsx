import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Crosshair, Copy, Sun, Moon, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTrainingAssets } from "@/contexts/TrainingAssetsContext";
import { useARC, ARCConfig } from "@/contexts/ARCContext";
import { getTargetById, TARGETS } from "@/contexts/TargetsContext";
import { LaneAssignment } from "./types";

interface Props {
  lanes: LaneAssignment[];
  onBack: () => void;
  onNext: (configs: Record<number, ARCConfig>) => void;
  exerciseMode: "custom" | "arc";
  onModeChange: (mode: "custom" | "arc") => void;
}

const PRACTICE_TYPES = [
  { id: "Grouping", label: "Grouping" },
  { id: "Application", label: "Application" },
  { id: "Timed", label: "Timed" },
  { id: "Snap Shot", label: "Snap Shot" },
];

export function ARCSetupStep({ lanes, onBack, onNext, exerciseMode, onModeChange }: Props) {
  const { weapons } = useTrainingAssets();
  const { fireMap, savedConfigs } = useARC();

  const activeLanes = lanes.filter((l) => l.queue.length > 0);

  const [laneSelections, setLaneSelections] = useState<
    Record<number, { weapon: string; fireType: string; practice: string }>
  >(() =>
    Object.fromEntries(activeLanes.map((l) => [l.laneId, { weapon: "", fireType: "", practice: "" }]))
  );

  const [copyFromLane, setCopyFromLane] = useState<number | null>(null);

  const patchLane = (laneId: number, p: Partial<{ weapon: string; fireType: string; practice: string }>) => {
    setLaneSelections((prev) => {
      const cur = prev[laneId] || { weapon: "", fireType: "", practice: "" };
      const next = { ...cur, ...p };
      if (p.weapon !== undefined) { next.fireType = ""; next.practice = ""; }
      if (p.fireType !== undefined && p.weapon === undefined) { next.practice = ""; }
      return { ...prev, [laneId]: next };
    });
  };

  const getFireTypes = (weaponId: string) => fireMap[weaponId] ?? [];
  const getPractices = (weaponId: string, fireTypeId: string) => {
    const ft = getFireTypes(weaponId).find((f) => f.id === fireTypeId);
    return ft?.practices ?? [];
  };

  const getConfig = (weaponId: string, fireTypeId: string, practice: string): ARCConfig | undefined =>
    savedConfigs.find((c) => c.weapon === weaponId && c.typeOfFire === fireTypeId && c.nameOfPractice === practice);

  const availableWeapons = useMemo(
    () => weapons.filter((w) => (fireMap[w.id]?.length ?? 0) > 0),
    [weapons, fireMap]
  );

  const allConfigured = activeLanes.every((l) => {
    const s = laneSelections[l.laneId];
    return s && s.weapon && s.fireType && s.practice && getConfig(s.weapon, s.fireType, s.practice);
  });

  const handleNext = () => {
    const configs: Record<number, ARCConfig> = {};
    for (const l of activeLanes) {
      const s = laneSelections[l.laneId];
      const cfg = getConfig(s.weapon, s.fireType, s.practice);
      if (cfg) configs[l.laneId] = cfg;
    }
    onNext(configs);
  };

  const copyToLane = (fromLaneId: number, toLaneId: number) => {
    const source = laneSelections[fromLaneId];
    if (!source) return;
    setLaneSelections((prev) => ({ ...prev, [toLaneId]: { ...source } }));
    toast({ title: `Copied to Lane ${toLaneId}`, description: `ARC config copied from Lane ${fromLaneId}` });
    setCopyFromLane(null);
  };

  const copyToAllLanes = (fromLaneId: number, targetLaneIds: number[]) => {
    const source = laneSelections[fromLaneId];
    if (!source) return;
    setLaneSelections((prev) => {
      const next = { ...prev };
      for (const id of targetLaneIds) next[id] = { ...source };
      return next;
    });
    toast({ title: `Copied to all lanes`, description: `ARC config copied from Lane ${fromLaneId}` });
    setCopyFromLane(null);
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Top bar */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="h-9 px-4 rounded-xl font-semibold text-[10px] uppercase tracking-wider flex items-center gap-2 glass-btn text-muted-foreground hover:text-foreground hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
        >
          <ChevronLeft className="w-3 h-3" /> Back
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => onModeChange("custom")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all"
            style={{ background: exerciseMode === "custom" ? "var(--gradient-primary)" : "var(--surface-inset)" }}
          >
            <Crosshair className={`w-3 h-3 ${exerciseMode === "custom" ? "text-primary-foreground" : "text-muted-foreground"}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${exerciseMode === "custom" ? "text-primary-foreground" : "text-muted-foreground"}`}>Custom</span>
          </button>
          <button
            onClick={() => onModeChange("arc")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all"
            style={{ background: exerciseMode === "arc" ? "var(--gradient-primary)" : "var(--surface-inset)" }}
          >
            <Crosshair className={`w-3 h-3 ${exerciseMode === "arc" ? "text-primary-foreground" : "text-muted-foreground"}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${exerciseMode === "arc" ? "text-primary-foreground" : "text-muted-foreground"}`}>ARC</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!allConfigured}
            className="h-9 px-5 rounded-xl font-semibold text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none text-primary-foreground hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: "var(--gradient-primary)" }}
          >
            Start Session <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Lane cards */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-4 gap-3 h-full auto-rows-fr">
          {lanes.map((lane) => {
            const activeTrainee = lane.queue[0];
            const isEmpty = lane.queue.length === 0;

            if (isEmpty) {
              return (
                <div key={lane.laneId} className="glass-panel flex flex-col items-center justify-center opacity-40">
                  <p className="text-xs text-muted-foreground font-medium">Lane {lane.laneId}</p>
                  <p className="text-[10px] text-muted-foreground">No trainees</p>
                </div>
              );
            }

            const sel = laneSelections[lane.laneId] || { weapon: "", fireType: "", practice: "" };
            const fireTypes = getFireTypes(sel.weapon);
            const practices = getPractices(sel.weapon, sel.fireType);
            const cfg = sel.practice ? getConfig(sel.weapon, sel.fireType, sel.practice) : undefined;
            const target = cfg ? getTargetById(cfg.typeOfTarget) : undefined;
            const otherActiveLanes = activeLanes.filter((l) => l.laneId !== lane.laneId);
            const isCopySource = copyFromLane === lane.laneId;
            const positionLabel = cfg?.firingPosition || "";

            return (
              <div key={lane.laneId} className="glass-panel flex flex-col overflow-hidden">
                {/* Lane header */}
                <div
                  className="px-3 py-2 shrink-0 flex items-center gap-2"
                  style={{ background: "var(--surface-glass-hover)", borderBottom: "1px solid var(--divider)" }}
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                    {lane.laneId}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold text-foreground truncate">{activeTrainee.name}</p>
                    <p className="text-[8px] font-mono text-muted-foreground">{activeTrainee.id}</p>
                  </div>
                  {lane.queue.length > 1 && (
                    <span className="text-[8px] text-muted-foreground shrink-0">+{lane.queue.length - 1}</span>
                  )}
                  {otherActiveLanes.length > 0 && (
                    <div className="relative">
                      <button
                        onClick={() => setCopyFromLane(isCopySource ? null : lane.laneId)}
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                          isCopySource ? "bg-primary text-primary-foreground" : "hover:bg-muted/50 text-muted-foreground"
                        }`}
                        title="Copy config to other lanes"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {isCopySource && (
                        <div
                          className="absolute top-full right-0 mt-1 z-50 rounded-lg p-1.5 flex flex-col gap-0.5 min-w-[100px]"
                          style={{ background: "var(--surface-glass)", border: "1px solid var(--divider)", backdropFilter: "blur(16px)" }}
                        >
                          <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold px-2 py-0.5">Copy to</p>
                          {otherActiveLanes.map((ol) => (
                            <button
                              key={ol.laneId}
                              onClick={() => copyToLane(lane.laneId, ol.laneId)}
                              className="text-[10px] text-foreground font-medium px-2 py-1 rounded-md hover:bg-muted/50 text-left transition-colors"
                            >
                              Lane {ol.laneId}
                            </button>
                          ))}
                          <button
                            onClick={() => copyToAllLanes(lane.laneId, otherActiveLanes.map((ol) => ol.laneId))}
                            className="text-[10px] text-primary font-semibold px-2 py-1 rounded-md hover:bg-primary/10 text-left transition-colors border-t border-[var(--divider)] mt-0.5 pt-1.5"
                          >
                            All Lanes
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Form content */}
                <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
                  {/* ARC Selection: Weapon → Fire Type → Practice (cascading) */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Weapon</label>
                    <select
                      value={sel.weapon}
                      onChange={(e) => patchLane(lane.laneId, { weapon: e.target.value })}
                      className="sys-input h-8 text-xs w-full rounded-md px-2"
                    >
                      <option value="">Select...</option>
                      {availableWeapons.map((w) => (
                        <option key={w.id} value={w.id}>{w.label}</option>
                      ))}
                    </select>
                  </div>

                  {sel.weapon && (
                    <div className="animate-fade-in">
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Type of Fire</label>
                      <select
                        value={sel.fireType}
                        onChange={(e) => patchLane(lane.laneId, { fireType: e.target.value })}
                        className="sys-input h-8 text-xs w-full rounded-md px-2"
                      >
                        <option value="">Select...</option>
                        {fireTypes.map((f) => (
                          <option key={f.id} value={f.id}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {sel.weapon && sel.fireType && (
                    <div className="animate-fade-in">
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Name of Practice</label>
                      <select
                        value={sel.practice}
                        onChange={(e) => patchLane(lane.laneId, { practice: e.target.value })}
                        className="sys-input h-8 text-xs w-full rounded-md px-2"
                      >
                        <option value="">Select...</option>
                        {practices.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Once a practice is selected, show loaded config exactly like Custom tab */}
                  {cfg && (
                    <div className="animate-fade-in flex flex-col gap-2 mt-1">
                      <div className="h-px w-full" style={{ background: "var(--divider)" }} />

                      {/* Practice Type — read-only pills */}
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Practice Type</label>
                        <div className="grid grid-cols-4 gap-0.5 p-0.5 rounded-lg" style={{ background: "var(--surface-inset)" }}>
                          {PRACTICE_TYPES.map((pt) => (
                            <div
                              key={pt.id}
                              className={`text-[10px] text-center font-semibold py-1.5 rounded-md transition-all ${
                                cfg.practiceType === pt.id
                                  ? "text-primary-foreground shadow-sm"
                                  : "text-muted-foreground/40"
                              }`}
                              style={cfg.practiceType === pt.id ? { background: "var(--gradient-primary)" } : undefined}
                            >
                              {pt.label}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Weapon & Position — 2 col like Custom */}
                      <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Weapon</label>
                          <div className="sys-input h-8 text-xs w-full rounded-md px-2 flex items-center text-foreground/70">
                            {weapons.find((w) => w.id === cfg.weapon)?.label || cfg.weapon}
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Position</label>
                          <div className="sys-input h-8 text-xs w-full rounded-md px-2 flex items-center text-foreground/70">
                            {positionLabel || "—"}
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Range (m)</label>
                          <div className="sys-input h-8 text-xs w-full rounded-md px-2 flex items-center text-foreground/70">
                            {cfg.firingRange}
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Rounds</label>
                          <div className="sys-input h-8 text-xs w-full rounded-md px-2 flex items-center text-foreground/70">
                            {cfg.roundsAllotted}
                          </div>
                        </div>
                      </div>

                      {/* Time of Day — read-only toggle matching Custom */}
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Time of Day</label>
                        <div className="grid grid-cols-2 gap-0.5 p-0.5 rounded-lg" style={{ background: "var(--surface-inset)" }}>
                          <div
                            className={`flex items-center justify-center gap-1.5 text-[11px] font-semibold py-1.5 rounded-md transition-all ${
                              cfg.timeOfPractice === "day" ? "bg-amber-500/90 text-white shadow-sm" : "text-muted-foreground/40"
                            }`}
                          >
                            <Sun className="w-3.5 h-3.5" /> Day
                          </div>
                          <div
                            className={`flex items-center justify-center gap-1.5 text-[11px] font-semibold py-1.5 rounded-md transition-all ${
                              cfg.timeOfPractice === "night" ? "bg-indigo-600/90 text-white shadow-sm" : "text-muted-foreground/40"
                            }`}
                          >
                            <Moon className="w-3.5 h-3.5" /> Night
                          </div>
                        </div>
                      </div>

                      {/* Timed-specific: Time Limit */}
                      {cfg.practiceType === "Timed" && (
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Time Limit (sec)</label>
                          <div className="sys-input h-8 text-xs w-full rounded-md px-2 flex items-center text-foreground/70">
                            {cfg.timeSec}
                          </div>
                        </div>
                      )}

                      {/* Snap Shot-specific: Exposure, Up, Down */}
                      {cfg.practiceType === "Snap Shot" && (
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Exposure</label>
                            <div className="sys-input h-8 text-xs w-full rounded-md px-2 flex items-center text-foreground/70">
                              {cfg.exposures}
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Up (sec)</label>
                            <div className="sys-input h-8 text-xs w-full rounded-md px-2 flex items-center text-foreground/70">
                              {cfg.upTime}
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Down (sec)</label>
                            <div className="sys-input h-8 text-xs w-full rounded-md px-2 flex items-center text-foreground/70">
                              {cfg.downTime}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Target — dropdown (read-only) + preview, matching Custom */}
                      <div className="flex-1 flex flex-col min-h-0">
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block shrink-0">Target</label>
                        <div className="sys-input h-7 text-[10px] w-full rounded-md px-2 flex items-center text-foreground/70 shrink-0 mb-1.5">
                          {target?.label || cfg.typeOfTarget}
                        </div>
                        {target && (
                          <div
                            className="flex-1 rounded-lg flex items-center justify-center min-h-[80px] overflow-hidden"
                            style={{ background: "var(--surface-inset)", border: "1px solid var(--divider)" }}
                          >
                            <img
                              src={target.image}
                              alt={target.label}
                              className="max-w-full max-h-full object-contain p-1"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
