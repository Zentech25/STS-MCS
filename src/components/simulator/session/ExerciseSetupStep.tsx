import { useState } from "react";
import { ChevronLeft, ChevronRight, Crosshair, Copy, Sun, Moon, Eye, Check, AlertCircle, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LaneAssignment, ExerciseConfig, PracticeType } from "./types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useTrainingAssets } from "@/contexts/TrainingAssetsContext";
import { TARGETS } from "@/contexts/TargetsContext";

const PRACTICE_TYPES: { id: PracticeType; label: string; desc: string }[] = [
  { id: "grouping", label: "Grouping", desc: "Accuracy grouping practice" },
  { id: "application", label: "Application", desc: "Applied marksmanship" },
  { id: "timed", label: "Timed", desc: "Time-limited exercise" },
  { id: "snapshot", label: "Snap Shot", desc: "Quick exposure drills" },
];

interface Props {
  lanes: LaneAssignment[];
  exercises: ExerciseConfig[];
  onExercisesChange: (exercises: ExerciseConfig[]) => void;
  onBack: () => void;
  onNext: () => void;
  exerciseMode: "custom" | "arc";
  onModeChange: (mode: "custom" | "arc") => void;
}

export function ExerciseSetupStep({ lanes, exercises, onExercisesChange, onBack, onNext, exerciseMode, onModeChange }: Props) {
  const { weapons, positions } = useTrainingAssets();
  const [selectedLaneId, setSelectedLaneId] = useState<number>(
    lanes.find((l) => l.queue.length > 0)?.laneId ?? lanes[0]?.laneId ?? 1
  );
  const [copyMenuOpen, setCopyMenuOpen] = useState(false);

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
    setCopyMenuOpen(false);
  };

  const copyToAllLanes = (fromLaneId: number, targetLaneIds: number[]) => {
    const source = exercises.find((e) => e.laneId === fromLaneId);
    if (!source) return;
    const { laneId: _, ...config } = source;
    onExercisesChange(
      exercises.map((e) => targetLaneIds.includes(e.laneId) ? { ...e, ...config } : e)
    );
    toast({ title: `Copied to all lanes`, description: `Exercise config copied from Lane ${fromLaneId}` });
    setCopyMenuOpen(false);
  };

  const allConfigured = exercises
    .filter((e) => lanes.find((l) => l.laneId === e.laneId)?.queue.length)
    .every((e) => e.weapon !== "");

  const activeLanes = lanes.filter((l) => l.queue.length > 0);
  const otherActiveLanes = activeLanes.filter((l) => l.laneId !== selectedLaneId);

  const currentLane = lanes.find((l) => l.laneId === selectedLaneId);
  const exercise = exercises.find((e) => e.laneId === selectedLaneId);
  const activeTrainee = currentLane?.queue[0];
  const isEmpty = !currentLane || currentLane.queue.length === 0;
  const target = exercise ? TARGETS.find((t) => t.id === exercise.targetType) : null;

  const isLaneConfigured = (laneId: number) => {
    const ex = exercises.find((e) => e.laneId === laneId);
    return ex && ex.weapon !== "";
  };

  const labelClass = "text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1 block";
  const inputClass = "sys-input h-9 text-sm w-full rounded-xl px-3";

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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
            style={{ background: exerciseMode === "custom" ? "var(--gradient-primary)" : "var(--surface-inset)" }}
          >
            <Crosshair className={`w-3 h-3 ${exerciseMode === "custom" ? "text-primary-foreground" : "text-muted-foreground"}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${exerciseMode === "custom" ? "text-primary-foreground" : "text-muted-foreground"}`}>Custom</span>
          </button>
          <button
            onClick={() => onModeChange("arc")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
            style={{ background: exerciseMode === "arc" ? "var(--gradient-primary)" : "var(--surface-inset)" }}
          >
            <Crosshair className={`w-3 h-3 ${exerciseMode === "arc" ? "text-primary-foreground" : "text-muted-foreground"}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${exerciseMode === "arc" ? "text-primary-foreground" : "text-muted-foreground"}`}>ARC</span>
          </button>

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

      {/* Main content: Lane sidebar + Config form */}
      <div className="flex-1 flex gap-3 min-h-0">
        {/* Lane selector sidebar */}
        <div
          className="w-48 shrink-0 rounded-2xl flex flex-col overflow-hidden"
          style={{
            background: "var(--surface-glass)",
            border: "1px solid var(--surface-glass-border)",
            backdropFilter: "blur(28px) saturate(200%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%)",
            boxShadow: "var(--shadow-soft), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div className="px-3 py-2.5 shrink-0" style={{ borderBottom: "1px solid var(--divider)" }}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Lanes</p>
            <p className="text-[8px] text-muted-foreground/60 mt-0.5">{activeLanes.length} active · {activeLanes.filter((l) => isLaneConfigured(l.laneId)).length} configured</p>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 flex flex-col gap-0.5">
            {lanes.map((lane) => {
              const hasTrainees = lane.queue.length > 0;
              const isSelected = selectedLaneId === lane.laneId;
              const configured = isLaneConfigured(lane.laneId);
              const trainee = lane.queue[0];

              return (
                <motion.button
                  key={lane.laneId}
                  onClick={() => setSelectedLaneId(lane.laneId)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all duration-200 relative ${
                    isSelected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--accent) / 0.08))"
                      : "transparent",
                    border: isSelected ? "1px solid hsl(var(--primary) / 0.2)" : "1px solid transparent",
                  }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold shrink-0"
                    style={{
                      background: isSelected ? "var(--gradient-primary)" : hasTrainees ? "hsl(var(--primary) / 0.1)" : "var(--surface-inset)",
                      color: isSelected ? "white" : hasTrainees ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      boxShadow: isSelected ? "0 2px 8px hsl(var(--primary) / 0.3)" : "none",
                    }}
                  >
                    {lane.laneId}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-semibold truncate ${!hasTrainees ? "opacity-40" : ""}`}>
                      {hasTrainees ? trainee?.name : "Empty"}
                    </p>
                    {hasTrainees && (
                      <p className="text-[8px] font-mono text-muted-foreground/60">{lane.queue.length} queued</p>
                    )}
                  </div>
                  {hasTrainees && (
                    <div className="shrink-0">
                      {configured ? (
                        <Check className="w-3 h-3 text-success" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-warning" />
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Config form */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLaneId}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="h-full rounded-2xl flex flex-col overflow-hidden"
              style={{
                background: "var(--surface-glass)",
                border: "1px solid var(--surface-glass-border)",
                backdropFilter: "blur(28px) saturate(200%)",
                WebkitBackdropFilter: "blur(28px) saturate(200%)",
                boxShadow: "var(--shadow-soft), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Lane header */}
              <div
                className="px-5 py-3 flex items-center justify-between shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--surface-glass-hover), var(--surface-glass))",
                  borderBottom: "1px solid var(--divider)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-bold text-primary-foreground"
                    style={{ background: "var(--gradient-primary)", boxShadow: "0 3px 12px hsl(var(--primary) / 0.3)" }}
                  >
                    {selectedLaneId}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-foreground">Lane {selectedLaneId}</p>
                    {activeTrainee ? (
                      <p className="text-[10px] text-muted-foreground">{activeTrainee.name} · {activeTrainee.rank} · <span className="font-mono">{activeTrainee.id}</span></p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground/50">No trainees assigned</p>
                    )}
                  </div>
                  {currentLane && currentLane.queue.length > 1 && (
                    <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      <Users className="w-2.5 h-2.5" /> +{currentLane.queue.length - 1} in queue
                    </span>
                  )}
                </div>

                {/* Copy controls */}
                {!isEmpty && otherActiveLanes.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setCopyMenuOpen(!copyMenuOpen)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all ${
                        copyMenuOpen ? "bg-primary text-primary-foreground" : "glass-btn text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Copy className="w-3 h-3" /> Copy Config
                    </button>
                    {copyMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute top-full right-0 mt-1.5 z-50 rounded-xl p-2 min-w-[140px]"
                        style={{
                          background: "var(--surface-glass)",
                          border: "1px solid var(--surface-glass-border)",
                          backdropFilter: "blur(24px)",
                          boxShadow: "var(--shadow-glow)",
                        }}
                      >
                        <p className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold px-2 py-1">Copy to</p>
                        {otherActiveLanes.map((ol) => (
                          <button
                            key={ol.laneId}
                            onClick={() => copyToLane(selectedLaneId, ol.laneId)}
                            className="w-full text-[10px] text-foreground font-medium px-2.5 py-1.5 rounded-lg hover:bg-primary/10 text-left transition-colors"
                          >
                            Lane {ol.laneId} — {ol.queue[0]?.name}
                          </button>
                        ))}
                        <div className="my-1" style={{ borderTop: "1px solid var(--divider)" }} />
                        <button
                          onClick={() => copyToAllLanes(selectedLaneId, otherActiveLanes.map((ol) => ol.laneId))}
                          className="w-full text-[10px] text-primary font-bold px-2.5 py-1.5 rounded-lg hover:bg-primary/10 text-left transition-colors"
                        >
                          All Active Lanes
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Form body */}
              {isEmpty ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-40">
                  <Users className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm font-semibold text-muted-foreground">No trainees assigned</p>
                  <p className="text-[10px] text-muted-foreground/60">Go back to Group Setup to assign trainees to this lane</p>
                </div>
              ) : exercise ? (
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="flex gap-6">
                    {/* Left column: form fields */}
                    <div className="flex-1 flex flex-col gap-4">
                      {/* Practice Type */}
                      <div>
                        <label className={labelClass}>Practice Type</label>
                        <div className="grid grid-cols-4 gap-1 p-1 rounded-xl" style={{ background: "var(--surface-inset)" }}>
                          {PRACTICE_TYPES.map((pt) => (
                            <button
                              key={pt.id}
                              onClick={() => updateExercise(selectedLaneId, { practiceType: pt.id })}
                              className={`text-[11px] font-semibold py-2 rounded-lg transition-all duration-200 ${
                                exercise.practiceType === pt.id
                                  ? "text-primary-foreground shadow-md"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                              style={exercise.practiceType === pt.id ? {
                                background: "var(--gradient-primary)",
                                boxShadow: "0 2px 10px hsl(var(--primary) / 0.3)",
                              } : undefined}
                            >
                              {pt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Common fields */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div>
                          <label className={labelClass}>Weapon</label>
                          <select
                            value={exercise.weapon}
                            onChange={(e) => updateExercise(selectedLaneId, { weapon: e.target.value })}
                            className={inputClass}
                          >
                            <option value="">Select weapon...</option>
                            {weapons.map((w) => (
                              <option key={w.id} value={w.id}>{w.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Firing Position</label>
                          <select
                            value={exercise.firingPosition}
                            onChange={(e) => updateExercise(selectedLaneId, { firingPosition: e.target.value })}
                            className={inputClass}
                          >
                            <option value="">Select position...</option>
                            {positions.map((fp) => (
                              <option key={fp.id} value={fp.id}>{fp.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Range (meters)</label>
                          <Select value={String(exercise.range)} onValueChange={(v) => updateExercise(selectedLaneId, { range: Number(v), distance: Number(v) })}>
                            <SelectTrigger className="h-9 text-sm px-3 rounded-xl">
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                              {[10, 25, 50, 100, 200, 300, 400].map((r) => (
                                <SelectItem key={r} value={String(r)}>{r} m</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className={labelClass}>Rounds</label>
                          <Input
                            type="number"
                            value={exercise.rounds}
                            onChange={(e) => updateExercise(selectedLaneId, { rounds: Number(e.target.value) })}
                            className="h-9 text-sm px-3 rounded-xl"
                            min={1}
                          />
                        </div>
                      </div>

                      {/* Time of Day */}
                      <div>
                        <label className={labelClass}>Time of Day</label>
                        <div className="flex items-center gap-3">
                          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl flex-1" style={{ background: "var(--surface-inset)" }}>
                            <button
                              onClick={() => updateExercise(selectedLaneId, { timeOfDay: "day", visibility: 100 })}
                              className={`flex items-center justify-center gap-2 text-[11px] font-semibold py-2 rounded-lg transition-all ${
                                exercise.timeOfDay === "day"
                                  ? "bg-amber-500/90 text-white shadow-md"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Sun className="w-4 h-4" /> Day
                            </button>
                            <button
                              onClick={() => updateExercise(selectedLaneId, { timeOfDay: "night" })}
                              className={`flex items-center justify-center gap-2 text-[11px] font-semibold py-2 rounded-lg transition-all ${
                                exercise.timeOfDay === "night"
                                  ? "bg-indigo-600/90 text-white shadow-md"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Moon className="w-4 h-4" /> Night
                            </button>
                          </div>
                          {exercise.timeOfDay === "night" && (
                            <motion.div
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4 text-muted-foreground shrink-0" />
                              <Input
                                type="number"
                                value={exercise.visibility}
                                onChange={(e) => updateExercise(selectedLaneId, { visibility: Math.min(100, Math.max(0, Number(e.target.value))) })}
                                className="h-9 text-sm px-3 w-20 rounded-xl"
                                min={0}
                                max={100}
                              />
                              <span className="text-[10px] text-muted-foreground font-medium">% visibility</span>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Practice-specific fields */}
                      <AnimatePresence mode="wait">
                        {exercise.practiceType === "timed" && (
                          <motion.div
                            key="timed"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                          >
                            <label className={labelClass}>Time Limit (seconds)</label>
                            <Input
                              type="number"
                              value={exercise.timeLimit}
                              onChange={(e) => updateExercise(selectedLaneId, { timeLimit: Number(e.target.value) })}
                              className="h-9 text-sm px-3 rounded-xl max-w-xs"
                              min={1}
                            />
                          </motion.div>
                        )}
                        {exercise.practiceType === "snapshot" && (
                          <motion.div
                            key="snapshot"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                          >
                            <label className={labelClass}>Snap Shot Parameters</label>
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="text-[9px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-0.5 block">Exposures</label>
                                <Input
                                  type="number"
                                  value={exercise.exposure}
                                  onChange={(e) => updateExercise(selectedLaneId, { exposure: Number(e.target.value) })}
                                  className="h-9 text-sm px-3 rounded-xl"
                                  min={1}
                                />
                              </div>
                              <div>
                                <label className="text-[9px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-0.5 block">Up Time (sec)</label>
                                <Input
                                  type="number"
                                  value={exercise.upTime}
                                  onChange={(e) => updateExercise(selectedLaneId, { upTime: Number(e.target.value) })}
                                  className="h-9 text-sm px-3 rounded-xl"
                                  min={1}
                                />
                              </div>
                              <div>
                                <label className="text-[9px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-0.5 block">Down Time (sec)</label>
                                <Input
                                  type="number"
                                  value={exercise.downTime}
                                  onChange={(e) => updateExercise(selectedLaneId, { downTime: Number(e.target.value) })}
                                  className="h-9 text-sm px-3 rounded-xl"
                                  min={1}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Target selector */}
                      <div>
                        <label className={labelClass}>Target</label>
                        <select
                          value={exercise.targetType}
                          onChange={(e) => updateExercise(selectedLaneId, { targetType: e.target.value })}
                          className={inputClass}
                        >
                          {TARGETS.map((t) => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Right column: Target preview */}
                    <div className="w-64 shrink-0 flex flex-col gap-3">
                      <div
                        className="flex-1 rounded-2xl flex items-center justify-center overflow-hidden min-h-[280px]"
                        style={{
                          background: "var(--surface-inset)",
                          border: "1px solid var(--divider)",
                          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)",
                        }}
                      >
                        {target ? (
                          <motion.img
                            key={target.id}
                            src={target.image}
                            alt={target.label}
                            className="max-w-full max-h-full object-contain p-3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        ) : (
                          <Crosshair className="w-8 h-8 text-muted-foreground/20" />
                        )}
                      </div>
                      {target && (
                        <p className="text-[10px] text-center text-muted-foreground font-medium">{target.label}</p>
                      )}

                      {/* Config summary */}
                      <div
                        className="rounded-xl p-3 flex flex-col gap-2"
                        style={{ background: "var(--surface-elevated)", border: "1px solid var(--divider)" }}
                      >
                        <p className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Configuration Summary</p>
                        {[
                          { label: "Practice", value: PRACTICE_TYPES.find((p) => p.id === exercise.practiceType)?.label || "—" },
                          { label: "Weapon", value: weapons.find((w) => w.id === exercise.weapon)?.label || "Not set" },
                          { label: "Position", value: positions.find((p) => p.id === exercise.firingPosition)?.label || "Not set" },
                          { label: "Range", value: `${exercise.range}m` },
                          { label: "Rounds", value: String(exercise.rounds) },
                          { label: "Time", value: exercise.timeOfDay === "day" ? "Day" : `Night (${exercise.visibility}%)` },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between">
                            <span className="text-[9px] text-muted-foreground">{item.label}</span>
                            <span className="text-[10px] font-mono text-foreground font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
