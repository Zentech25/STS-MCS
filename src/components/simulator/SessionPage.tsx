import { useState } from "react";
import { Users, Crosshair, Radio } from "lucide-react";
import { GroupSetupStep } from "./session/GroupSetupStep";
import { ExerciseSetupStep } from "./session/ExerciseSetupStep";
import { SessionLiveStep } from "./session/SessionLiveStep";
import { LaneAssignment, ExerciseConfig, SessionStep } from "./session/types";

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
  [1, 2, 3, 4].map((id) => ({
    laneId: id,
    type: "custom" as const,
    name: "",
    rounds: 10,
    distance: 25,
    timeLimit: 60,
    targetType: "humanoid-a",
  }));

export function SessionPage() {
  const [step, setStep] = useState<SessionStep>("group");
  const [lanes, setLanes] = useState<LaneAssignment[]>(createEmptyLanes());
  const [exercises, setExercises] = useState<ExerciseConfig[]>(createDefaultExercises());

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="flex flex-col h-full p-5 gap-4">
      {/* Stepper */}
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

      {/* Step content */}
      <div className="flex-1 overflow-hidden">
        {step === "group" && (
          <GroupSetupStep
            lanes={lanes}
            onLanesChange={setLanes}
            onNext={() => setStep("exercise")}
          />
        )}
        {step === "exercise" && (
          <ExerciseSetupStep
            lanes={lanes}
            exercises={exercises}
            onExercisesChange={setExercises}
            onBack={() => setStep("group")}
            onNext={() => setStep("live")}
          />
        )}
        {step === "live" && (
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
