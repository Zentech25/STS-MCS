import { useState } from "react";
import { Play, Pause, Square, ChevronLeft } from "lucide-react";
import { LaneAssignment, ExerciseConfig } from "./types";
import { getTargetById } from "@/contexts/TargetsContext";

interface Props {
  lanes: LaneAssignment[];
  exercises: ExerciseConfig[];
  onBack: () => void;
}

export function SessionLiveStep({ lanes, exercises, onBack }: Props) {
  const [sessionState, setSessionState] = useState<"idle" | "running" | "paused">("idle");
  const [shotData] = useState<Record<number, { hits: number; misses: number }>>(
    Object.fromEntries(lanes.map((l) => [l.laneId, { hits: 0, misses: 0 }]))
  );

  const btnBase = "h-10 px-5 rounded-xl font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none";

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          disabled={sessionState !== "idle"}
          className={`${btnBase} glass-btn text-muted-foreground hover:text-foreground hover:scale-[1.03] active:scale-[0.97]`}
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>

        {sessionState === "running" ? (
          <button onClick={() => setSessionState("paused")} className={`${btnBase} glass-btn text-warning hover:scale-[1.03] active:scale-[0.97]`}>
            <Pause className="w-3.5 h-3.5" /> Pause
          </button>
        ) : (
          <button onClick={() => setSessionState("running")} className={`${btnBase} glass-btn text-success hover:scale-[1.03] active:scale-[0.97]`}>
            <Play className="w-3.5 h-3.5" /> {sessionState === "paused" ? "Resume" : "Start"}
          </button>
        )}

        <button onClick={() => setSessionState("idle")} disabled={sessionState === "idle"} className={`${btnBase} glass-btn text-destructive hover:scale-[1.03] active:scale-[0.97]`}>
          <Square className="w-3.5 h-3.5" /> Stop
        </button>

        <div className="ml-4 flex items-center gap-2">
          <span className={`status-dot ${
            sessionState === "running" ? "status-dot-online" :
            sessionState === "paused" ? "status-dot-warning" :
            "bg-muted-foreground/30"
          }`} />
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            {sessionState === "idle" ? "Standby" : sessionState === "running" ? "Live" : "Paused"}
          </span>
        </div>
      </div>

      {/* Lane panels */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-4 gap-4 h-full">
          {lanes.map((lane) => {
            const exercise = exercises.find((e) => e.laneId === lane.laneId);
            const activeTrainee = lane.queue[0];
            const shots = shotData[lane.laneId] || { hits: 0, misses: 0 };
            const isEmpty = lane.queue.length === 0;
            const target = exercise ? getTargetById(exercise.targetType) : null;

            if (isEmpty || !exercise) {
              return (
                <div key={lane.laneId} className="glass-panel flex flex-col items-center justify-center opacity-40">
                  <p className="text-[11px] text-muted-foreground">Lane {lane.laneId} — Empty</p>
                </div>
              );
            }

            return (
              <div key={lane.laneId} className="glass-panel flex flex-col overflow-hidden">
                <div className="px-4 py-2.5 flex items-center justify-between shrink-0" style={{ background: "var(--surface-glass-hover)", borderBottom: "1px solid var(--divider)" }}>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">Lane {lane.laneId}</span>
                  <span className="text-[9px] font-mono px-2.5 py-1 rounded-lg font-bold bg-success/10 text-success">ACTIVE</span>
                </div>

                <div className="flex-1 p-3.5 flex flex-col gap-3 overflow-y-auto">
                  <div className="rounded-xl overflow-hidden flex items-center justify-center bg-white" style={{ border: "1px solid var(--divider)", minHeight: "140px" }}>
                    {target ? (
                      <img src={target.image} alt={target.label} className="w-full h-full object-contain max-h-[160px]" />
                    ) : (
                      <p className="text-xs text-muted-foreground">No target</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">Trainee</p>
                      <p className="text-[11px] font-mono text-foreground truncate font-medium">{activeTrainee.name}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">ID</p>
                      <p className="text-[11px] font-mono text-foreground font-medium">{activeTrainee.id}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">Exercise</p>
                      <p className="text-[11px] font-mono text-foreground truncate font-medium">{exercise.name}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">Rounds</p>
                      <p className="text-[11px] font-mono text-foreground font-medium">{exercise.rounds}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">Distance</p>
                      <p className="text-[11px] font-mono text-foreground font-medium">{exercise.distance}m</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">Time</p>
                      <p className="text-[11px] font-mono text-foreground font-medium">{exercise.timeLimit}s</p>
                    </div>
                  </div>

                  {lane.queue.length > 1 && (
                    <div className="rounded-lg p-2" style={{ background: "var(--surface-inset)" }}>
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Queue ({lane.queue.length - 1} waiting)</p>
                      {lane.queue.slice(1, 4).map((t) => (
                        <p key={t.id} className="text-[10px] text-muted-foreground truncate">{t.name}</p>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto rounded-xl p-3" style={{ background: "var(--surface-elevated)", border: "1px solid var(--divider)" }}>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Shot Summary</p>
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <p className="text-lg font-mono font-bold text-success">{shots.hits}</p>
                        <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">Hits</p>
                      </div>
                      <div className="w-px h-8" style={{ background: "var(--divider)" }} />
                      <div className="text-center flex-1">
                        <p className="text-lg font-mono font-bold text-destructive">{shots.misses}</p>
                        <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">Missed</p>
                      </div>
                      <div className="w-px h-8" style={{ background: "var(--divider)" }} />
                      <div className="text-center flex-1">
                        <p className="text-lg font-mono font-bold text-foreground">{shots.hits + shots.misses}</p>
                        <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">Total</p>
                      </div>
                    </div>
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
