import { useState } from "react";
import { ChevronLeft, ChevronRight, Crosshair, Lock, Copy, Sun, Moon, Eye } from "lucide-react";
import { LaneAssignment, ExerciseConfig, PracticeType, TimeOfDay } from "./types";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const TARGET_TYPES = [
  { id: "humanoid-a", label: "Standard Humanoid", preview: "🎯" },
  { id: "humanoid-b", label: "Armored Humanoid", preview: "🛡️" },
  { id: "humanoid-c", label: "Moving Target", preview: "🏃" },
  { id: "humanoid-d", label: "Partial Exposure", preview: "👤" },
];

const PRACTICE_TYPES: { id: PracticeType; label: string }[] = [
  { id: "grouping", label: "Grouping" },
  { id: "application", label: "Application" },
  { id: "timed", label: "Timed" },
  { id: "snapshot", label: "Snap Shot" },
];

// These would come from the configure page in a real app
const WEAPONS = [
  { id: "ak", label: "AK-47" },
  { id: "carbine", label: "Carbine" },
  { id: "pistol", label: "Pistol" },
  { id: "desert-eagle", label: "Desert Eagle" },
  { id: "scar", label: "SCAR" },
  { id: "m4a4", label: "M4A4" },
];

const FIRING_POSITIONS = [
  { id: "standing", label: "Standing" },
  { id: "kneeling", label: "Kneeling" },
  { id: "prone", label: "Prone" },
];

interface Props {
  lanes: LaneAssignment[];
  exercises: ExerciseConfig[];
  onExercisesChange: (exercises: ExerciseConfig[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ExerciseSetupStep({ lanes, exercises, onExercisesChange, onBack, onNext }: Props) {
  const [copyFromLane, setCopyFromLane] = useState<number | null>(null);

  const updateExercise = (laneId: number, update: Partial<ExerciseConfig>) => {
    onExercisesChange(
      exercises.map((e) => (e.laneId === laneId ? { ...e, ...update } : e))
    );
  };

  const copyToLane = (fromLaneId: number, toLaneId: number) => {
    const source = exercises.find((e) => e.laneId === fromLaneId);
    if (!source) return;
    const { laneId: _, ...config } = source;
    onExercisesChange(
      exercises.map((e) => (e.laneId === toLaneId ? { ...e, ...config } : e))
    );
    toast({ title: `Copied to Lane ${toLaneId}`, description: `Exercise config copied from Lane ${fromLaneId}` });
    setCopyFromLane(null);
  };

  const allConfigured = exercises
    .filter((e) => lanes.find((l) => l.laneId === e.laneId)?.queue.length)
    .every((e) => e.name.trim() !== "");

  const activeLanes = lanes.filter((l) => l.queue.length > 0);

  const selectedTarget = (targetType: string) => TARGET_TYPES.find((t) => t.id === targetType);

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
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "var(--surface-inset)" }}>
            <Crosshair className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Custom</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg opacity-40 cursor-not-allowed" style={{ background: "var(--surface-inset)" }}>
            <Lock className="w-2.5 h-2.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">ARC</span>
          </div>

          <button
            onClick={onNext}
            disabled={!allConfigured}
            className="h-9 px-5 rounded-xl font-semibold text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none text-primary-foreground hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: "var(--gradient-primary)" }}
          >
            Start Session <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Exercise cards per lane */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-4 gap-3 h-full auto-rows-fr">
          {lanes.map((lane) => {
            const exercise = exercises.find((e) => e.laneId === lane.laneId);
            const activeTrainee = lane.queue[0];
            const isEmpty = lane.queue.length === 0;

            if (isEmpty || !exercise) {
              return (
                <div
                  key={lane.laneId}
                  className="glass-panel flex flex-col items-center justify-center opacity-40"
                >
                  <p className="text-[10px] text-muted-foreground font-medium">Lane {lane.laneId}</p>
                  <p className="text-[9px] text-muted-foreground">No trainees</p>
                </div>
              );
            }

            const target = selectedTarget(exercise.targetType);
            const isCopySource = copyFromLane === lane.laneId;
            const otherActiveLanes = activeLanes.filter((l) => l.laneId !== lane.laneId);

            return (
              <div key={lane.laneId} className="glass-panel flex flex-col overflow-hidden">
                {/* Lane header - compact */}
                <div
                  className="px-3 py-2 shrink-0 flex items-center gap-2"
                  style={{
                    background: "var(--surface-glass-hover)",
                    borderBottom: "1px solid var(--divider)",
                  }}
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
                  {/* Copy button */}
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
                            onClick={() => {
                              otherActiveLanes.forEach((ol) => copyToLane(lane.laneId, ol.laneId));
                            }}
                            className="text-[10px] text-primary font-semibold px-2 py-1 rounded-md hover:bg-primary/10 text-left transition-colors border-t border-[var(--divider)] mt-0.5 pt-1.5"
                          >
                            All Lanes
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Exercise config form - very compact, no scroll */}
                <div className="flex-1 p-2.5 flex flex-col gap-2">
                  {/* Exercise Name */}
                  <div>
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Exercise Name</label>
                    <Input
                      value={exercise.name}
                      onChange={(e) => updateExercise(lane.laneId, { name: e.target.value })}
                      placeholder="e.g. CQB Drill 1"
                      className="h-7 text-[10px] px-2"
                    />
                  </div>

                  {/* Practice Type - toggle pills */}
                  <div>
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Practice Type</label>
                    <div className="grid grid-cols-4 gap-0.5 p-0.5 rounded-lg" style={{ background: "var(--surface-inset)" }}>
                      {PRACTICE_TYPES.map((pt) => (
                        <button
                          key={pt.id}
                          onClick={() => updateExercise(lane.laneId, { practiceType: pt.id })}
                          className={`text-[8px] font-semibold py-1 rounded-md transition-all ${
                            exercise.practiceType === pt.id
                              ? "text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          style={exercise.practiceType === pt.id ? { background: "var(--gradient-primary)" } : undefined}
                        >
                          {pt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Common fields - dense 2-col grid */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                    {/* Weapon */}
                    <div>
                      <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Weapon</label>
                      <select
                        value={exercise.weapon}
                        onChange={(e) => updateExercise(lane.laneId, { weapon: e.target.value })}
                        className="sys-input h-7 text-[10px] w-full rounded-md px-1.5"
                      >
                        <option value="">Select...</option>
                        {WEAPONS.map((w) => (
                          <option key={w.id} value={w.id}>{w.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Firing Position */}
                    <div>
                      <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Position</label>
                      <select
                        value={exercise.firingPosition}
                        onChange={(e) => updateExercise(lane.laneId, { firingPosition: e.target.value })}
                        className="sys-input h-7 text-[10px] w-full rounded-md px-1.5"
                      >
                        <option value="">Select...</option>
                        {FIRING_POSITIONS.map((fp) => (
                          <option key={fp.id} value={fp.id}>{fp.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Range */}
                    <div>
                      <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Range (m)</label>
                      <Input
                        type="number"
                        value={exercise.range}
                        onChange={(e) => updateExercise(lane.laneId, { range: Number(e.target.value), distance: Number(e.target.value) })}
                        className="h-7 text-[10px] px-2"
                        min={5}
                      />
                    </div>

                    {/* Rounds */}
                    <div>
                      <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Rounds</label>
                      <Input
                        type="number"
                        value={exercise.rounds}
                        onChange={(e) => updateExercise(lane.laneId, { rounds: Number(e.target.value) })}
                        className="h-7 text-[10px] px-2"
                        min={1}
                      />
                    </div>
                  </div>

                  {/* Time of Day */}
                  <div>
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Time of Day</label>
                    <div className="flex items-center gap-1.5">
                      <div className="grid grid-cols-2 gap-0.5 p-0.5 rounded-lg flex-1" style={{ background: "var(--surface-inset)" }}>
                        <button
                          onClick={() => updateExercise(lane.laneId, { timeOfDay: "day", visibility: 100 })}
                          className={`flex items-center justify-center gap-1 text-[9px] font-semibold py-1 rounded-md transition-all ${
                            exercise.timeOfDay === "day"
                              ? "bg-amber-500/90 text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Sun className="w-2.5 h-2.5" /> Day
                        </button>
                        <button
                          onClick={() => updateExercise(lane.laneId, { timeOfDay: "night" })}
                          className={`flex items-center justify-center gap-1 text-[9px] font-semibold py-1 rounded-md transition-all ${
                            exercise.timeOfDay === "night"
                              ? "bg-indigo-600/90 text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Moon className="w-2.5 h-2.5" /> Night
                        </button>
                      </div>
                      {exercise.timeOfDay === "night" && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-muted-foreground shrink-0" />
                          <Input
                            type="number"
                            value={exercise.visibility}
                            onChange={(e) => updateExercise(lane.laneId, { visibility: Math.min(100, Math.max(0, Number(e.target.value))) })}
                            className="h-7 text-[10px] px-1.5 w-14"
                            min={0}
                            max={100}
                          />
                          <span className="text-[8px] text-muted-foreground">%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Target Type with preview */}
                  <div>
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Target</label>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={exercise.targetType}
                        onChange={(e) => updateExercise(lane.laneId, { targetType: e.target.value })}
                        className="sys-input h-7 text-[10px] flex-1 rounded-md px-1.5"
                      >
                        {TARGET_TYPES.map((t) => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-sm shrink-0"
                        style={{ background: "var(--surface-inset)", border: "1px solid var(--divider)" }}
                        title={target?.label}
                      >
                        {target?.preview}
                      </div>
                    </div>
                  </div>

                  {/* Practice-type specific fields */}
                  {exercise.practiceType === "timed" && (
                    <div>
                      <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Time Limit (sec)</label>
                      <Input
                        type="number"
                        value={exercise.timeLimit}
                        onChange={(e) => updateExercise(lane.laneId, { timeLimit: Number(e.target.value) })}
                        className="h-7 text-[10px] px-2"
                        min={1}
                      />
                    </div>
                  )}

                  {exercise.practiceType === "snapshot" && (
                    <div className="grid grid-cols-3 gap-1.5">
                      <div>
                        <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Exposure</label>
                        <Input
                          type="number"
                          value={exercise.exposure}
                          onChange={(e) => updateExercise(lane.laneId, { exposure: Number(e.target.value) })}
                          className="h-7 text-[10px] px-1.5"
                          min={1}
                        />
                      </div>
                      <div>
                        <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Up (sec)</label>
                        <Input
                          type="number"
                          value={exercise.upTime}
                          onChange={(e) => updateExercise(lane.laneId, { upTime: Number(e.target.value) })}
                          className="h-7 text-[10px] px-1.5"
                          min={1}
                        />
                      </div>
                      <div>
                        <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 block">Down (sec)</label>
                        <Input
                          type="number"
                          value={exercise.downTime}
                          onChange={(e) => updateExercise(lane.laneId, { downTime: Number(e.target.value) })}
                          className="h-7 text-[10px] px-1.5"
                          min={1}
                        />
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
