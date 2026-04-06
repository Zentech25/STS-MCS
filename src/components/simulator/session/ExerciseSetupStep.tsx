import { useState } from "react";
import { ChevronLeft, ChevronRight, Crosshair, Lock } from "lucide-react";
import { LaneAssignment, ExerciseConfig } from "./types";
import { Input } from "@/components/ui/input";

const TARGET_TYPES = [
  { id: "humanoid-a", label: "Standard Humanoid" },
  { id: "humanoid-b", label: "Armored Humanoid" },
  { id: "humanoid-c", label: "Moving Target" },
  { id: "humanoid-d", label: "Partial Exposure" },
];

interface Props {
  lanes: LaneAssignment[];
  exercises: ExerciseConfig[];
  onExercisesChange: (exercises: ExerciseConfig[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ExerciseSetupStep({ lanes, exercises, onExercisesChange, onBack, onNext }: Props) {
  const updateExercise = (laneId: number, update: Partial<ExerciseConfig>) => {
    onExercisesChange(
      exercises.map((e) => (e.laneId === laneId ? { ...e, ...update } : e))
    );
  };

  const allConfigured = exercises.every((e) => e.name.trim() !== "");
  const activeLanes = lanes.filter((l) => l.queue.length > 0);

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Top bar */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="h-10 px-5 rounded-xl font-semibold text-[11px] uppercase tracking-wider flex items-center gap-2 glass-btn text-muted-foreground hover:text-foreground hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Groups
        </button>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "var(--surface-inset)" }}>
            <Crosshair className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Custom Exercise</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg opacity-40 cursor-not-allowed" style={{ background: "var(--surface-inset)" }}>
            <Lock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">ARC</span>
          </div>

          <button
            onClick={onNext}
            disabled={!allConfigured}
            className="h-10 px-6 rounded-xl font-semibold text-[11px] uppercase tracking-wider flex items-center gap-2 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none text-primary-foreground hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: "var(--gradient-primary)" }}
          >
            Start Session <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Exercise cards per lane */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-4 gap-4 h-full">
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
                  <p className="text-[11px] text-muted-foreground font-medium">Lane {lane.laneId}</p>
                  <p className="text-[10px] text-muted-foreground">No trainees assigned</p>
                </div>
              );
            }

            return (
              <div key={lane.laneId} className="glass-panel flex flex-col overflow-hidden">
                {/* Lane header with active trainee */}
                <div
                  className="px-4 py-3 shrink-0"
                  style={{
                    background: "var(--surface-glass-hover)",
                    borderBottom: "1px solid var(--divider)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                      {lane.laneId}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                      Lane {lane.laneId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px] font-bold">1</div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-foreground truncate">{activeTrainee.name}</p>
                      <p className="text-[9px] font-mono text-muted-foreground">{activeTrainee.id}</p>
                    </div>
                    {lane.queue.length > 1 && (
                      <span className="text-[9px] text-muted-foreground ml-auto">+{lane.queue.length - 1} waiting</span>
                    )}
                  </div>
                </div>

                {/* Exercise config form */}
                <div className="flex-1 p-4 flex flex-col gap-3.5 overflow-y-auto">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Exercise Name</label>
                    <Input
                      value={exercise.name}
                      onChange={(e) => updateExercise(lane.laneId, { name: e.target.value })}
                      placeholder="e.g. CQB Drill 1"
                      className="h-9 text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Target Type</label>
                    <select
                      value={exercise.targetType}
                      onChange={(e) => updateExercise(lane.laneId, { targetType: e.target.value })}
                      className="sys-input h-9 text-[11px] w-full"
                    >
                      {TARGET_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Rounds</label>
                      <Input
                        type="number"
                        value={exercise.rounds}
                        onChange={(e) => updateExercise(lane.laneId, { rounds: Number(e.target.value) })}
                        className="h-9 text-[11px]"
                        min={1}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Distance (m)</label>
                      <Input
                        type="number"
                        value={exercise.distance}
                        onChange={(e) => updateExercise(lane.laneId, { distance: Number(e.target.value) })}
                        className="h-9 text-[11px]"
                        min={5}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Time Limit (sec)</label>
                    <Input
                      type="number"
                      value={exercise.timeLimit}
                      onChange={(e) => updateExercise(lane.laneId, { timeLimit: Number(e.target.value) })}
                      className="h-9 text-[11px]"
                      min={10}
                    />
                  </div>

                  {/* Quick summary */}
                  <div className="mt-auto rounded-xl p-3" style={{ background: "var(--surface-inset)", border: "1px solid var(--divider)" }}>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Summary</p>
                    <p className="text-[10px] text-foreground leading-relaxed">
                      {exercise.name || "—"} · {exercise.rounds} rds · {exercise.distance}m · {exercise.timeLimit}s
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
