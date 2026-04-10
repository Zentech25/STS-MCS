import { useState } from "react";
import { Users, Crosshair, Radio, Monitor, Gamepad2 } from "lucide-react";
import { GroupSetupStep } from "./session/GroupSetupStep";
import { ExerciseSetupStep } from "./session/ExerciseSetupStep";
import { ARCSetupStep } from "./session/ARCSetupStep";
import { SessionLiveStep } from "./session/SessionLiveStep";
import { LaneAssignment, ExerciseConfig, SessionStep } from "./session/types";
import { ARCConfig } from "@/contexts/ARCContext";
import { TARGETS } from "@/contexts/TargetsContext";

export type SessionMode = "master" | "firer";

const STEPS: { key: SessionStep; label: string; icon: React.ElementType }[] = [
  { key: "group", label: "Group Setup", icon: Users },
  { key: "exercise", label: "Exercise", icon: Crosshair },
  { key: "live", label: "Session", icon: Radio },
];

const createEmptyLanes = (): LaneAssignment[] => [
  { laneId: 1, queue: [] },
  { laneId: 2, queue: [] },
  { laneId: 3, queue: [] },
  { laneId: 4, queue: [] },
];

const createDefaultExercises = (): ExerciseConfig[] =>
  [1, 2, 3, 4].map((laneId) => ({
    laneId,
    type: "custom" as const,
    name: "",
    practiceType: "grouping" as const,
    weapon: "",
    firingPosition: "",
    range: 25,
    rounds: 5,
    timeOfDay: "day" as const,
    visibility: 100,
    targetType: TARGETS[0]?.id ?? "",
    timeLimit: 30,
    exposure: 3,
    upTime: 3,
    downTime: 5,
    distance: 25,
  }));

interface SessionPageProps {
  mode: SessionMode;
  onModeChange: (mode: SessionMode) => void;
}

export function SessionPage({ mode, onModeChange }: SessionPageProps) {
  const [step, setStep] = useState<SessionStep>(mode === "firer" ? "live" : "group");
  const [lanes, setLanes] = useState<LaneAssignment[]>(createEmptyLanes());
  const [exercises, setExercises] = useState<ExerciseConfig[]>(createDefaultExercises());
  const [exerciseMode, setExerciseMode] = useState<"custom" | "arc">("custom");
  const [arcConfigs, setArcConfigs] = useState<Record<number, ARCConfig>>({});

  const isFirer = mode === "firer";
  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="flex flex-col h-full p-5 gap-4">
      {/* Mode selector */}
      <div className="flex items-center justify-center gap-2 shrink-0">
        <div className="flex items-center rounded-xl overflow-hidden" style={{ background: "var(--surface-glass)", border: "1px solid var(--divider)" }}>
          {(["master", "firer"] as SessionMode[]).map((m) => {
            const isActive = mode === m;
            const Icon = m === "master" ? Monitor : Gamepad2;
            return (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={`flex items-center gap-2 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={isActive ? { background: "var(--gradient-primary)" } : undefined}
              >
                <Icon className="w-3.5 h-3.5" />
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stepper – hidden in firer mode */}
      {!isFirer && (
      <div className="flex items-center justify-center gap-1 shrink-0">
        {STEPS.map((s, i) => {
          const isActive = s.key === step;
          const isDone = i < stepIndex;
          const Icon = s.icon;

          return (
            <div key={s.key} className="flex items-center gap-1">
              {i > 0 && (
                <div
                  className="w-12 h-px mx-1 transition-all duration-500"
                  style={{
                    background: isDone ? "hsl(var(--primary))" : "var(--divider)",
                  }}
                />
              )}
              <button
                onClick={() => {
                  if (isDone) setStep(s.key);
                }}
                disabled={!isDone && !isActive}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "text-primary-foreground shadow-lg"
                    : isDone
                    ? "text-primary glass-btn cursor-pointer hover:scale-[1.03]"
                    : "text-muted-foreground/40 cursor-default"
                }`}
                style={isActive ? { background: "var(--gradient-primary)" } : undefined}
              >
                <Icon className="w-4 h-4" />
                {s.label}
              </button>
            </div>
          );
        })}
      </div>
      )}

      {/* Step content */}
      <div className={`flex-1 overflow-hidden relative ${isFirer ? "pointer-events-none" : ""}`}>
        {isFirer && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl" style={{ background: "var(--surface-glass)", backdropFilter: "blur(2px)" }}>
            <Gamepad2 className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-sm font-semibold text-muted-foreground/60 uppercase tracking-wider">Firer Mode</p>
            <p className="text-xs text-muted-foreground/40 max-w-xs text-center">Session is controlled by FPE. Trainee and exercise data will be received automatically.</p>
          </div>
        )}

        {!isFirer && step === "group" && (
          <GroupSetupStep
            lanes={lanes}
            onLanesChange={setLanes}
            onNext={() => setStep("exercise")}
          />
        )}
        {!isFirer && step === "exercise" && exerciseMode === "custom" && (
          <ExerciseSetupStep
            lanes={lanes}
            exercises={exercises}
            onExercisesChange={setExercises}
            onBack={() => setStep("group")}
            onNext={() => setStep("live")}
            exerciseMode={exerciseMode}
            onModeChange={setExerciseMode}
          />
        )}
        {!isFirer && step === "exercise" && exerciseMode === "arc" && (
          <ARCSetupStep
            lanes={lanes}
            onBack={() => setStep("group")}
            onNext={(configs) => {
              setArcConfigs(configs);
              setStep("live");
            }}
            exerciseMode={exerciseMode}
            onModeChange={setExerciseMode}
          />
        )}
        {(isFirer || step === "live") && !isFirer && (
          <SessionLiveStep
            lanes={lanes}
            exercises={exercises}
            onBack={() => setStep("exercise")}
          />
        )}
      </div>
    </div>
  );
}
