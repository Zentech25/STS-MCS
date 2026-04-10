import { useState, useCallback } from "react";
import { Play, Pause, Square, ChevronLeft, Pin, PinOff, Target, Crosshair, Clock, Ruler, Zap } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { LaneAssignment, ExerciseConfig } from "./types";
import { getTargetById } from "@/contexts/TargetsContext";

interface Props {
  lanes: LaneAssignment[];
  exercises: ExerciseConfig[];
  onBack: () => void;
}

function LaneTile({
  lane,
  exercise,
  isExpanded,
  isPinned,
  onTogglePin,
  onToggleExpand,
  sessionState,
}: {
  lane: LaneAssignment;
  exercise: ExerciseConfig | undefined;
  isExpanded: boolean;
  isPinned: boolean;
  onTogglePin: () => void;
  onToggleExpand: () => void;
  sessionState: "idle" | "running" | "paused";
}) {
  const activeTrainee = lane.queue[0];
  const isEmpty = lane.queue.length === 0;
  const target = exercise ? getTargetById(exercise.targetType) : null;
  const shots = { hits: 0, misses: 0 };

  if (isEmpty || !exercise) {
    return (
      <motion.div
        layout
        className="glass-panel flex flex-col items-center justify-center opacity-40 cursor-default"
        style={{ minHeight: 120 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Target className="w-5 h-5 text-muted-foreground mb-1" />
        <p className="text-[11px] text-muted-foreground font-semibold">Lane {lane.laneId}</p>
        <p className="text-[9px] text-muted-foreground/60">Empty</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      onClick={onToggleExpand}
      className={`glass-panel flex flex-col overflow-hidden cursor-pointer relative group transition-shadow duration-300 ${
        isExpanded ? "shadow-xl shadow-primary/10" : "hover:shadow-lg hover:shadow-primary/5"
      }`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={!isExpanded ? { scale: 1.02, y: -2 } : undefined}
      whileTap={{ scale: 0.98 }}
    >
      {/* Pin button */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
        className={`absolute top-2 right-2 z-20 p-1.5 rounded-lg transition-all duration-200 ${
          isPinned
            ? "text-primary"
            : "text-muted-foreground/40 opacity-0 group-hover:opacity-100"
        }`}
        style={{ background: isPinned ? "hsl(var(--primary) / 0.15)" : "var(--surface-glass)" }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        title={isPinned ? "Unpin lane" : "Pin lane"}
      >
        {isPinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
      </motion.button>

      {/* Header */}
      <div
        className="px-3 py-2 flex items-center justify-between shrink-0"
        style={{ background: "var(--surface-glass-hover)", borderBottom: "1px solid var(--divider)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
            Lane {lane.laneId}
          </span>
          <motion.span
            className={`status-dot ${
              sessionState === "running" ? "status-dot-online" :
              sessionState === "paused" ? "status-dot-warning" :
              "bg-muted-foreground/30"
            }`}
            animate={sessionState === "running" ? { scale: [1, 1.3, 1] } : undefined}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
        {activeTrainee && (
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-md font-bold bg-success/10 text-success uppercase">
            Active
          </span>
        )}
      </div>

      {/* Compact view: target + key info */}
      <div className="p-3 flex gap-3 items-center">
        <motion.div
          layout="position"
          className="rounded-lg overflow-hidden bg-white flex items-center justify-center shrink-0"
          style={{
            border: "1px solid var(--divider)",
            width: isExpanded ? 100 : 56,
            height: isExpanded ? 100 : 56,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {target ? (
            <img src={target.image} alt={target.label} className="w-full h-full object-contain" />
          ) : (
            <Crosshair className="w-4 h-4 text-muted-foreground/40" />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-foreground truncate">{activeTrainee?.name || "—"}</p>
          <p className="text-[9px] text-muted-foreground font-mono">{activeTrainee?.id || ""}</p>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mt-1.5"
            >
              <div className="flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-success" />
                <span className="text-[9px] font-mono font-bold text-success">{shots.hits}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-destructive" />
                <span className="text-[9px] font-mono font-bold text-destructive">{shots.misses}</span>
              </div>
              <span className="text-[8px] text-muted-foreground/50">|</span>
              <span className="text-[9px] text-muted-foreground font-mono">{exercise.rounds}rds</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 flex flex-col gap-2.5">
              {/* Exercise info grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Crosshair, label: "Exercise", value: exercise.name || "Custom" },
                  { icon: Ruler, label: "Distance", value: `${exercise.distance}m` },
                  { icon: Clock, label: "Time", value: `${exercise.timeLimit}s` },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 30 }}
                    className="rounded-lg p-2 text-center"
                    style={{ background: "var(--surface-inset)" }}
                  >
                    <item.icon className="w-3 h-3 mx-auto text-primary/60 mb-0.5" />
                    <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">{item.label}</p>
                    <p className="text-[10px] font-mono text-foreground font-medium truncate">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* More details */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Weapon", value: exercise.weapon || "—" },
                  { label: "Rounds", value: String(exercise.rounds) },
                  { label: "Position", value: exercise.firingPosition || "—" },
                  { label: "Visibility", value: `${exercise.visibility}%` },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.04, type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">{item.label}</p>
                    <p className="text-[10px] font-mono text-foreground font-medium truncate">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Queue */}
              {lane.queue.length > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-lg p-2"
                  style={{ background: "var(--surface-inset)" }}
                >
                  <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                    Queue ({lane.queue.length - 1} waiting)
                  </p>
                  {lane.queue.slice(1, 4).map((t) => (
                    <p key={t.id} className="text-[9px] text-muted-foreground truncate">{t.name}</p>
                  ))}
                </motion.div>
              )}

              {/* Shot summary */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 30 }}
                className="rounded-xl p-2.5"
                style={{ background: "var(--surface-elevated)", border: "1px solid var(--divider)" }}
              >
                <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Shot Summary</p>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <p className="text-base font-mono font-bold text-success">{shots.hits}</p>
                    <p className="text-[7px] uppercase tracking-wider text-muted-foreground font-semibold">Hits</p>
                  </div>
                  <div className="w-px h-6" style={{ background: "var(--divider)" }} />
                  <div className="text-center flex-1">
                    <p className="text-base font-mono font-bold text-destructive">{shots.misses}</p>
                    <p className="text-[7px] uppercase tracking-wider text-muted-foreground font-semibold">Missed</p>
                  </div>
                  <div className="w-px h-6" style={{ background: "var(--divider)" }} />
                  <div className="text-center flex-1">
                    <p className="text-base font-mono font-bold text-foreground">{shots.hits + shots.misses}</p>
                    <p className="text-[7px] uppercase tracking-wider text-muted-foreground font-semibold">Total</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand indicator */}
      {!isExpanded && (
        <motion.div
          className="h-1 mx-3 mb-2 rounded-full"
          style={{ background: "var(--divider)" }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}

export function SessionLiveStep({ lanes, exercises, onBack }: Props) {
  const [sessionState, setSessionState] = useState<"idle" | "running" | "paused">("idle");
  const [expandedLanes, setExpandedLanes] = useState<Set<number>>(new Set());
  const [pinnedLanes, setPinnedLanes] = useState<Set<number>>(new Set());

  const toggleExpand = useCallback((laneId: number) => {
    setExpandedLanes((prev) => {
      const next = new Set(prev);
      if (next.has(laneId)) {
        // Don't collapse if pinned
        if (pinnedLanes.has(laneId)) return prev;
        next.delete(laneId);
      } else {
        next.add(laneId);
      }
      return next;
    });
  }, [pinnedLanes]);

  const togglePin = useCallback((laneId: number) => {
    setPinnedLanes((prev) => {
      const next = new Set(prev);
      if (next.has(laneId)) {
        next.delete(laneId);
        // Also collapse when unpinning
        setExpandedLanes((ep) => {
          const ne = new Set(ep);
          ne.delete(laneId);
          return ne;
        });
      } else {
        next.add(laneId);
        // Auto-expand when pinning
        setExpandedLanes((ep) => new Set(ep).add(laneId));
      }
      return next;
    });
  }, []);

  const btnBase =
    "h-10 px-5 rounded-xl font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none";

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
          <button
            onClick={() => setSessionState("paused")}
            className={`${btnBase} glass-btn text-warning hover:scale-[1.03] active:scale-[0.97]`}
          >
            <Pause className="w-3.5 h-3.5" /> Pause
          </button>
        ) : (
          <button
            onClick={() => setSessionState("running")}
            className={`${btnBase} glass-btn text-success hover:scale-[1.03] active:scale-[0.97]`}
          >
            <Play className="w-3.5 h-3.5" /> {sessionState === "paused" ? "Resume" : "Start"}
          </button>
        )}

        <button
          onClick={() => setSessionState("idle")}
          disabled={sessionState === "idle"}
          className={`${btnBase} glass-btn text-destructive hover:scale-[1.03] active:scale-[0.97]`}
        >
          <Square className="w-3.5 h-3.5" /> Stop
        </button>

        <div className="ml-4 flex items-center gap-2">
          <span
            className={`status-dot ${
              sessionState === "running"
                ? "status-dot-online"
                : sessionState === "paused"
                ? "status-dot-warning"
                : "bg-muted-foreground/30"
            }`}
          />
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            {sessionState === "idle" ? "Standby" : sessionState === "running" ? "Live" : "Paused"}
          </span>
        </div>

        {pinnedLanes.size > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              setPinnedLanes(new Set());
              setExpandedLanes(new Set());
            }}
            className={`${btnBase} glass-btn text-muted-foreground hover:text-foreground ml-auto`}
          >
            <PinOff className="w-3.5 h-3.5" /> Unpin All
          </motion.button>
        )}
      </div>

      {/* Lane tiles */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <LayoutGroup>
          <motion.div
            layout
            className="grid gap-3 auto-rows-min"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            }}
          >
            {lanes.map((lane, i) => {
              const exercise = exercises.find((e) => e.laneId === lane.laneId);
              return (
                <LaneTile
                  key={lane.laneId}
                  lane={lane}
                  exercise={exercise}
                  isExpanded={expandedLanes.has(lane.laneId)}
                  isPinned={pinnedLanes.has(lane.laneId)}
                  onTogglePin={() => togglePin(lane.laneId)}
                  onToggleExpand={() => toggleExpand(lane.laneId)}
                  sessionState={sessionState}
                />
              );
            })}
          </motion.div>
        </LayoutGroup>
      </div>
    </div>
  );
}
