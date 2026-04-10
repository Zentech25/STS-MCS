import { useState, useCallback } from "react";
import { Play, Pause, Square, ChevronLeft, Pin, PinOff, Target, Crosshair, Clock, Ruler, Zap, Shield, Eye } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { LaneAssignment, ExerciseConfig } from "./types";
import { getTargetById } from "@/contexts/TargetsContext";

const MAX_PINS = 4;

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
  isHovered,
  isDimmed,
  onTogglePin,
  onClick,
  onHoverStart,
  onHoverEnd,
  sessionState,
  pinCount,
}: {
  lane: LaneAssignment;
  exercise: ExerciseConfig | undefined;
  isExpanded: boolean;
  isPinned: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onTogglePin: () => void;
  onClick: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  sessionState: "idle" | "running" | "paused";
  pinCount: number;
}) {
  const activeTrainee = lane.queue[0];
  const isEmpty = lane.queue.length === 0;
  const target = exercise ? getTargetById(exercise.targetType) : null;
  const shots = { hits: Math.floor(Math.random() * 5), misses: Math.floor(Math.random() * 3), total: 0 };
  shots.total = shots.hits + shots.misses;
  const accuracy = shots.total > 0 ? Math.round((shots.hits / shots.total) * 100) : 0;

  if (isEmpty || !exercise) {
    return (
      <motion.div
        layout
        className="rounded-2xl flex flex-col items-center justify-center cursor-default"
        style={{
          background: "var(--surface-glass)",
          border: "1px solid var(--surface-glass-border)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          minHeight: 100,
          opacity: 0.3,
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      >
        <Target className="w-4 h-4 text-muted-foreground mb-1" />
        <p className="text-[10px] text-muted-foreground font-semibold">Lane {lane.laneId}</p>
        <p className="text-[8px] text-muted-foreground/50">Empty</p>
      </motion.div>
    );
  }

  const canPin = pinCount < MAX_PINS || isPinned;

  return (
    <motion.div
      layout
      onClick={onClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      className="rounded-2xl flex flex-col overflow-hidden cursor-pointer relative group"
      style={{
        background: "var(--surface-glass)",
        border: `1px solid ${isExpanded || isHovered ? "hsl(var(--primary) / 0.4)" : "var(--surface-glass-border)"}`,
        backdropFilter: "blur(28px) saturate(200%)",
        WebkitBackdropFilter: "blur(28px) saturate(200%)",
        boxShadow: isExpanded || isHovered
          ? "0 0 40px hsl(var(--primary) / 0.2), 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
        opacity: isDimmed ? 0.35 : 1,
        filter: isDimmed ? "blur(1px)" : "none",
        transition: "opacity 0.4s ease, filter 0.4s ease, border-color 0.3s ease, box-shadow 0.4s ease",
      }}
      initial={{ opacity: 0, scale: 0.85, y: 24 }}
      animate={{
        opacity: isDimmed ? 0.35 : 1,
        scale: isExpanded ? 1 : isHovered ? 1.03 : 1,
        y: isHovered && !isExpanded ? -4 : 0,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
    >
      {/* Glow overlay for hovered/expanded */}
      <AnimatePresence>
        {(isHovered || isExpanded) && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, hsl(var(--accent) / 0.04) 100%)",
              boxShadow: "inset 0 0 60px hsl(var(--primary) / 0.05)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Pin button */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
        className={`absolute top-2.5 right-2.5 z-20 p-1.5 rounded-lg transition-all duration-300 ${
          isPinned
            ? "text-primary"
            : "text-muted-foreground/30 opacity-0 group-hover:opacity-100"
        }`}
        style={{
          background: isPinned ? "hsl(var(--primary) / 0.15)" : "var(--surface-glass)",
          backdropFilter: "blur(12px)",
          border: isPinned ? "1px solid hsl(var(--primary) / 0.3)" : "1px solid transparent",
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.85 }}
        title={isPinned ? "Unpin lane" : canPin ? "Pin lane (max 4)" : "Max 4 pins reached"}
        disabled={!canPin && !isPinned}
      >
        {isPinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
      </motion.button>

      {/* Header */}
      <div
        className="px-3 py-2 flex items-center justify-between shrink-0 relative z-10"
        style={{
          background: isPinned
            ? "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.05))"
            : "var(--surface-glass-hover)",
          borderBottom: "1px solid var(--divider)",
        }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-primary-foreground"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "0 2px 8px hsl(var(--primary) / 0.3)",
            }}
            animate={sessionState === "running" ? { boxShadow: ["0 2px 8px hsl(var(--primary) / 0.3)", "0 2px 16px hsl(var(--primary) / 0.6)", "0 2px 8px hsl(var(--primary) / 0.3)"] } : undefined}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {lane.laneId}
          </motion.div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
            Lane {lane.laneId}
          </span>
          <motion.span
            className={`status-dot ${
              sessionState === "running" ? "status-dot-online" :
              sessionState === "paused" ? "status-dot-warning" :
              "bg-muted-foreground/30"
            }`}
            animate={sessionState === "running" ? { scale: [1, 1.4, 1] } : undefined}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
        {isPinned && (
          <span className="text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
            Pinned
          </span>
        )}
      </div>

      {/* Compact view */}
      <div className="p-3 flex gap-3 items-center relative z-10">
        <motion.div
          layout="position"
          className="rounded-xl overflow-hidden flex items-center justify-center shrink-0"
          style={{
            border: "1px solid var(--divider)",
            background: "rgba(255,255,255,0.9)",
            width: isExpanded ? 140 : 48,
            height: isExpanded ? 140 : 48,
            boxShadow: isExpanded ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
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
          <p className="text-[8px] text-muted-foreground font-mono">{activeTrainee?.id} · {activeTrainee?.rank}</p>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 mt-2"
            >
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                <span className="text-[9px] font-mono font-bold text-success">{shots.hits}H</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                <span className="text-[9px] font-mono font-bold text-destructive">{shots.misses}M</span>
              </div>
              <span className="text-[8px] text-muted-foreground font-mono">{exercise.rounds}rds</span>
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
            className="overflow-hidden relative z-10"
          >
            <div className="px-3 pb-3 flex flex-col gap-3">
              {/* Real-time target area placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl p-3 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, var(--surface-inset), hsl(var(--primary) / 0.03))",
                  border: "1px solid var(--divider)",
                  minHeight: 120,
                }}
              >
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Live Target Feed</p>
                <div className="flex items-center justify-center h-20 rounded-lg" style={{ background: "var(--surface-elevated)", border: "1px dashed var(--divider)" }}>
                  <div className="text-center">
                    <Crosshair className="w-6 h-6 text-primary/30 mx-auto mb-1" />
                    <p className="text-[9px] text-muted-foreground/60">Real-time bullet impact display</p>
                  </div>
                </div>
                {/* Animated scanning line */}
                {sessionState === "running" && (
                  <motion.div
                    className="absolute left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), transparent)" }}
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  />
                )}
              </motion.div>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Hits", value: String(shots.hits), color: "text-success", icon: Zap },
                  { label: "Miss", value: String(shots.misses), color: "text-destructive", icon: Target },
                  { label: "Accuracy", value: `${accuracy}%`, color: "text-primary", icon: Eye },
                  { label: "Rounds", value: `${shots.total}/${exercise.rounds}`, color: "text-foreground", icon: Shield },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 400, damping: 30 }}
                    className="rounded-xl p-2.5 text-center"
                    style={{
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--divider)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <item.icon className={`w-3 h-3 mx-auto ${item.color} mb-0.5 opacity-60`} />
                    <p className={`text-sm font-mono font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-[7px] uppercase tracking-widest text-muted-foreground font-semibold">{item.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Exercise config */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Exercise", value: exercise.name || "Custom" },
                  { label: "Distance", value: `${exercise.distance}m` },
                  { label: "Time Limit", value: `${exercise.timeLimit}s` },
                  { label: "Weapon", value: exercise.weapon || "—" },
                  { label: "Position", value: exercise.firingPosition || "—" },
                  { label: "Visibility", value: `${exercise.visibility}%` },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.03 }}
                  >
                    <p className="text-[7px] uppercase tracking-widest text-muted-foreground font-semibold">{item.label}</p>
                    <p className="text-[10px] font-mono text-foreground font-medium truncate">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Queue */}
              {lane.queue.length > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="rounded-xl p-2.5"
                  style={{ background: "var(--surface-inset)", border: "1px solid var(--divider)" }}
                >
                  <p className="text-[7px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5">
                    Queue ({lane.queue.length - 1} waiting)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {lane.queue.slice(1, 6).map((t) => (
                      <span key={t.id} className="text-[8px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{t.name}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SessionLiveStep({ lanes, exercises, onBack }: Props) {
  const [sessionState, setSessionState] = useState<"idle" | "running" | "paused">("idle");
  const [pinnedLanes, setPinnedLanes] = useState<Set<number>>(new Set());
  const [hoveredLane, setHoveredLane] = useState<number | null>(null);

  const togglePin = useCallback((laneId: number) => {
    setPinnedLanes((prev) => {
      const next = new Set(prev);
      if (next.has(laneId)) {
        next.delete(laneId);
      } else {
        if (next.size >= MAX_PINS) return prev; // enforce max
        next.add(laneId);
      }
      return next;
    });
  }, []);

  const isAnyHovered = hoveredLane !== null;

  const btnBase =
    "h-10 px-5 rounded-xl font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-25 disabled:pointer-events-none";

  // Sort: pinned first, then rest
  const sortedLanes = [...lanes].sort((a, b) => {
    const aPin = pinnedLanes.has(a.laneId) ? 0 : 1;
    const bPin = pinnedLanes.has(b.laneId) ? 0 : 1;
    return aPin - bPin || a.laneId - b.laneId;
  });

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          disabled={sessionState !== "idle"}
          className={`${btnBase} glass-btn text-muted-foreground hover:text-foreground`}
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>

        {sessionState === "running" ? (
          <button
            onClick={() => setSessionState("paused")}
            className={`${btnBase} glass-btn text-warning`}
          >
            <Pause className="w-3.5 h-3.5" /> Pause
          </button>
        ) : (
          <button
            onClick={() => setSessionState("running")}
            className={`${btnBase} glass-btn text-success`}
          >
            <Play className="w-3.5 h-3.5" /> {sessionState === "paused" ? "Resume" : "Start"}
          </button>
        )}

        <button
          onClick={() => setSessionState("idle")}
          disabled={sessionState === "idle"}
          className={`${btnBase} glass-btn text-destructive`}
        >
          <Square className="w-3.5 h-3.5" /> Stop
        </button>

        <div className="ml-3 flex items-center gap-2">
          <motion.span
            className={`w-2.5 h-2.5 rounded-full ${
              sessionState === "running" ? "bg-success" : sessionState === "paused" ? "bg-warning" : "bg-muted-foreground/30"
            }`}
            animate={sessionState === "running" ? {
              boxShadow: ["0 0 4px hsl(var(--success) / 0.3)", "0 0 16px hsl(var(--success) / 0.7)", "0 0 4px hsl(var(--success) / 0.3)"],
            } : undefined}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            {sessionState === "idle" ? "Standby" : sessionState === "running" ? "Live" : "Paused"}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">
            {pinnedLanes.size}/{MAX_PINS} pinned
          </span>
          {pinnedLanes.size > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setPinnedLanes(new Set())}
              className={`${btnBase} glass-btn text-muted-foreground hover:text-foreground`}
            >
              <PinOff className="w-3.5 h-3.5" /> Unpin All
            </motion.button>
          )}
        </div>
      </div>

      {/* Lane tiles */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1">
        <LayoutGroup>
          <motion.div
            layout
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(5, 1fr)`,
            }}
          >
            {sortedLanes.map((lane) => {
              const exercise = exercises.find((e) => e.laneId === lane.laneId);
              const isPinned = pinnedLanes.has(lane.laneId);
              const isHovered = hoveredLane === lane.laneId;
              const isExpanded = isPinned || isHovered;
              const isDimmed = isAnyHovered && !isHovered && !isPinned;

              return (
                <LaneTile
                  key={lane.laneId}
                  lane={lane}
                  exercise={exercise}
                  isExpanded={isExpanded}
                  isPinned={isPinned}
                  isHovered={isHovered}
                  isDimmed={isDimmed}
                  onTogglePin={() => togglePin(lane.laneId)}
                  onClick={() => togglePin(lane.laneId)}
                  onHoverStart={() => setHoveredLane(lane.laneId)}
                  onHoverEnd={() => setHoveredLane(null)}
                  sessionState={sessionState}
                  pinCount={pinnedLanes.size}
                />
              );
            })}
          </motion.div>
        </LayoutGroup>
      </div>
    </div>
  );
}
