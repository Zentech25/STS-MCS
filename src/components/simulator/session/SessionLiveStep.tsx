import { useState, useCallback, useMemo } from "react";
import { Play, Pause, Square, ChevronLeft, Pin, PinOff, Target, Crosshair, Zap, Shield, Eye, CheckCircle2, Loader2, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LaneAssignment, ExerciseConfig } from "./types";
import { getTargetById } from "@/contexts/TargetsContext";
import { ConnectionStatusRow } from "./ConnectionStatus";

const MAX_PINS = 4;

interface Props {
  lanes: LaneAssignment[];
  exercises: ExerciseConfig[];
  onBack: () => void;
  isFirer?: boolean;
}

/* ── Mock shot data (stable per lane) ── */
function useLaneShots(laneId: number) {
  return useMemo(() => {
    const hits = ((laneId * 7 + 3) % 8) + 1;
    const misses = ((laneId * 3 + 1) % 5);
    const total = hits + misses;
    const accuracy = total > 0 ? Math.round((hits / total) * 100) : 0;
    return { hits, misses, total, accuracy };
  }, [laneId]);
}

/* ── Pinned Lane Card ── */
function PinnedCard({
  lane,
  exercise,
  onUnpin,
  sessionState,
  isHovered,
  onHoverStart,
  onHoverEnd,
}: {
  lane: LaneAssignment;
  exercise: ExerciseConfig | undefined;
  onUnpin: () => void;
  sessionState: "idle" | "running" | "paused";
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const activeTrainee = lane.queue[0];
  const target = exercise ? getTargetById(exercise.targetType) : null;
  const shots = useLaneShots(lane.laneId);

  return (
    <motion.div
      layout
      className="rounded-2xl flex flex-col overflow-hidden relative h-full"
      style={{
        background: "var(--surface-glass)",
        border: isHovered ? "1px solid hsl(var(--primary) / 0.6)" : "1px solid hsl(var(--primary) / 0.2)",
        backdropFilter: "blur(28px) saturate(200%)",
        WebkitBackdropFilter: "blur(28px) saturate(200%)",
        boxShadow: isHovered
          ? "0 0 60px hsl(var(--primary) / 0.3), 0 0 100px hsl(var(--primary) / 0.15), 0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)"
          : "0 0 20px hsl(var(--primary) / 0.08), 0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.08)",
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{
        opacity: 1,
        scale: isHovered ? 1.02 : 1,
        y: 0,
        zIndex: isHovered ? 10 : 1,
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {/* Glow overlay on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--accent) / 0.05) 50%, hsl(var(--primary) / 0.03) 100%)",
        }}
      />

      {/* Top bar */}
      <div
        className="px-3 py-1.5 flex items-center gap-2 shrink-0 relative z-10"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--accent) / 0.04))",
          borderBottom: "1px solid var(--divider)",
        }}
      >
        <motion.div
          className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0"
          style={{ background: "var(--gradient-primary)", boxShadow: "0 2px 8px hsl(var(--primary) / 0.3)" }}
          animate={sessionState === "running" ? { boxShadow: ["0 2px 8px hsl(var(--primary) / 0.3)", "0 2px 14px hsl(var(--primary) / 0.6)", "0 2px 8px hsl(var(--primary) / 0.3)"] } : undefined}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {lane.laneId}
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-foreground truncate leading-tight">{activeTrainee?.name || "—"}</p>
          <p className="text-[7px] text-muted-foreground font-mono truncate">{activeTrainee?.id} · {activeTrainee?.rank}</p>
        </div>
        <ConnectionStatusRow laneId={lane.laneId} />
        <motion.span
          className={`w-2 h-2 rounded-full shrink-0 ${sessionState === "running" ? "bg-success" : sessionState === "paused" ? "bg-warning" : "bg-muted-foreground/30"}`}
          animate={sessionState === "running" ? { scale: [1, 1.4, 1] } : undefined}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <motion.button
          onClick={onUnpin}
          className="p-1 rounded-md text-primary shrink-0"
          style={{ background: "hsl(var(--primary) / 0.12)", border: "1px solid hsl(var(--primary) / 0.2)" }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
        >
          <Pin className="w-2.5 h-2.5" />
        </motion.button>
      </div>

      {/* Main body: target + stats */}
      <div className="flex-1 flex relative z-10 min-h-0">
        <div className="flex-1 flex items-center justify-center p-2 relative overflow-hidden min-h-0"
          style={{ background: "rgba(255,255,255,0.92)" }}
        >
          {target ? (
            <img src={target.image} alt={target.label} className="max-w-full max-h-full object-contain" />
          ) : (
            <Crosshair className="w-12 h-12 text-muted-foreground/20" />
          )}
          {sessionState === "running" && (
            <motion.div
              className="absolute left-0 right-0 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), transparent)" }}
              animate={{ top: ["5%", "95%", "5%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
          )}
        </div>

        <div className="w-[72px] shrink-0 flex flex-col gap-1 p-1.5 justify-center"
          style={{ borderLeft: "1px solid var(--divider)", background: "var(--surface-inset)" }}
        >
          {[
            { label: "Hits", value: String(shots.hits), color: "text-success", icon: Zap },
            { label: "Miss", value: String(shots.misses), color: "text-destructive", icon: Target },
            { label: "Acc", value: `${shots.accuracy}%`, color: "text-primary", icon: Eye },
            { label: "Rds", value: `${shots.total}/${exercise?.rounds || 0}`, color: "text-foreground", icon: Shield },
          ].map((item) => (
            <div key={item.label} className="rounded-lg p-1.5 text-center"
              style={{ background: "var(--surface-elevated)", border: "1px solid var(--divider)" }}
            >
              <item.icon className={`w-2.5 h-2.5 mx-auto ${item.color} mb-0.5 opacity-60`} />
              <p className={`text-[11px] font-mono font-bold leading-tight ${item.color}`}>{item.value}</p>
              <p className="text-[6px] uppercase tracking-widest text-muted-foreground font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar: exercise info */}
      {exercise && (
        <div className="px-3 py-1.5 flex items-center gap-3 shrink-0 relative z-10"
          style={{ borderTop: "1px solid var(--divider)", background: "var(--surface-glass-hover)" }}
        >
          {[
            { l: "Ex", v: exercise.name || "Custom" },
            { l: "Dist", v: `${exercise.distance}m` },
            { l: "Time", v: `${exercise.timeLimit}s` },
            { l: "Wpn", v: exercise.weapon || "—" },
            { l: "Pos", v: exercise.firingPosition || "—" },
          ].map((item) => (
            <div key={item.l} className="flex-1 min-w-0">
              <p className="text-[6px] uppercase tracking-widest text-muted-foreground font-semibold">{item.l}</p>
              <p className="text-[9px] font-mono text-foreground font-medium truncate">{item.v}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ── Lane Strip Thumbnail ── */
function StripThumbnail({
  lane,
  exercise,
  onPin,
  canPin,
  sessionState,
  isPinned,
  isHighlighted,
  onHoverLane,
  onLeaveLane,
}: {
  lane: LaneAssignment;
  exercise: ExerciseConfig | undefined;
  onPin: () => void;
  canPin: boolean;
  sessionState: "idle" | "running" | "paused";
  isPinned: boolean;
  isHighlighted: boolean;
  onHoverLane: () => void;
  onLeaveLane: () => void;
}) {
  const activeTrainee = lane.queue[0];
  const shots = useLaneShots(lane.laneId);
  const isCompleted = shots.total >= (exercise?.rounds || 0) && (exercise?.rounds || 0) > 0;
  const isInProgress = sessionState === "running" && !isCompleted;

  return (
    <div className="relative shrink-0">
      <motion.button
        onClick={() => { if (canPin || isPinned) onPin(); }}
        onMouseEnter={onHoverLane}
        onMouseLeave={onLeaveLane}
        className={`rounded-xl flex items-center gap-2 px-2.5 py-2 relative group shrink-0 ${canPin || isPinned ? "cursor-pointer" : "cursor-default"}`}
        style={{
          background: isPinned
            ? "hsl(var(--primary) / 0.15)"
            : isHighlighted
            ? "hsl(var(--primary) / 0.08)"
            : "var(--surface-elevated)",
          border: isPinned
            ? "1px solid hsl(var(--primary) / 0.4)"
            : isHighlighted
            ? "1px solid hsl(var(--primary) / 0.3)"
            : "1px solid var(--divider)",
          minWidth: 120,
          boxShadow: isHighlighted
            ? "0 0 20px hsl(var(--primary) / 0.2), 0 0 40px hsl(var(--primary) / 0.1)"
            : isPinned
            ? "0 0 12px hsl(var(--primary) / 0.1)"
            : "none",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
        }}
        whileHover={{
          scale: 1.06,
          boxShadow: "0 0 24px hsl(var(--primary) / 0.2)",
        }}
        whileTap={{ scale: 0.95 }}
        animate={isHighlighted ? {
          boxShadow: [
            "0 0 20px hsl(var(--primary) / 0.2)",
            "0 0 30px hsl(var(--primary) / 0.35)",
            "0 0 20px hsl(var(--primary) / 0.2)",
          ],
        } : undefined}
        transition={isHighlighted ? { repeat: Infinity, duration: 1.5 } : { type: "spring", stiffness: 400, damping: 30 }}
        layout
      >
        <div className="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-bold text-primary-foreground shrink-0"
          style={{ background: "var(--gradient-primary)" }}
        >
          {lane.laneId}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[8px] font-semibold text-foreground truncate">{activeTrainee?.name || "Empty"}</p>
        </div>
        {/* Status indicator */}
        {isCompleted ? (
          <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
        ) : isInProgress ? (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
            <Loader2 className="w-3 h-3 text-warning shrink-0" />
          </motion.div>
        ) : (
          <span className="w-2 h-2 rounded-full bg-muted-foreground/20 shrink-0" />
        )}
        {isPinned ? (
          <Pin className="w-2.5 h-2.5 text-primary shrink-0" />
        ) : (
          <PinOff className="w-2.5 h-2.5 text-muted-foreground/30 group-hover:text-primary shrink-0 transition-colors" />
        )}
      </motion.button>
    </div>
  );
}

/* ── Hover Overlay Card (shows over pinned area) ── */
function HoverOverlayCard({
  lane,
  exercise,
  sessionState,
}: {
  lane: LaneAssignment;
  exercise: ExerciseConfig | undefined;
  sessionState: "idle" | "running" | "paused";
}) {
  const activeTrainee = lane.queue[0];
  const target = exercise ? getTargetById(exercise.targetType) : null;
  const shots = useLaneShots(lane.laneId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="absolute inset-0 z-50 rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "var(--surface-glass)",
        border: "2px solid hsl(var(--primary) / 0.5)",
        backdropFilter: "blur(30px) saturate(200%)",
        WebkitBackdropFilter: "blur(30px) saturate(200%)",
        boxShadow: "0 0 80px hsl(var(--primary) / 0.3), 0 0 120px hsl(var(--primary) / 0.15), 0 20px 60px rgba(0,0,0,0.25)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-2 flex items-center gap-3 shrink-0"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--accent) / 0.06))",
          borderBottom: "1px solid var(--divider)",
        }}
      >
        <motion.div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground"
          style={{ background: "var(--gradient-primary)", boxShadow: "0 2px 12px hsl(var(--primary) / 0.4)" }}
        >
          {lane.laneId}
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{activeTrainee?.name || "—"}</p>
          <p className="text-[8px] text-muted-foreground font-mono">{activeTrainee?.id} · {activeTrainee?.rank}</p>
        </div>
        <ConnectionStatusRow laneId={lane.laneId} />
        <motion.span
          className={`w-2.5 h-2.5 rounded-full ${sessionState === "running" ? "bg-success" : sessionState === "paused" ? "bg-warning" : "bg-muted-foreground/30"}`}
          animate={sessionState === "running" ? { scale: [1, 1.4, 1] } : undefined}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md text-primary"
          style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}
        >
          Preview
        </span>
      </div>

      {/* Body: target + stats */}
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.92)" }}
        >
          {target ? (
            <img src={target.image} alt={target.label} className="max-w-full max-h-full object-contain" />
          ) : (
            <Crosshair className="w-16 h-16 text-muted-foreground/20" />
          )}
          {sessionState === "running" && (
            <motion.div
              className="absolute left-0 right-0 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), transparent)" }}
              animate={{ top: ["5%", "95%", "5%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
          )}
        </div>

        <div className="w-[90px] shrink-0 flex flex-col gap-1.5 p-2 justify-center"
          style={{ borderLeft: "1px solid var(--divider)", background: "var(--surface-inset)" }}
        >
          {[
            { label: "Hits", value: String(shots.hits), color: "text-success", icon: Zap },
            { label: "Miss", value: String(shots.misses), color: "text-destructive", icon: Target },
            { label: "Acc", value: `${shots.accuracy}%`, color: "text-primary", icon: Eye },
            { label: "Rds", value: `${shots.total}/${exercise?.rounds || 0}`, color: "text-foreground", icon: Shield },
          ].map((item) => (
            <div key={item.label} className="rounded-lg p-2 text-center"
              style={{ background: "var(--surface-elevated)", border: "1px solid var(--divider)" }}
            >
              <item.icon className={`w-3 h-3 mx-auto ${item.color} mb-0.5 opacity-60`} />
              <p className={`text-xs font-mono font-bold leading-tight ${item.color}`}>{item.value}</p>
              <p className="text-[7px] uppercase tracking-widest text-muted-foreground font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: exercise info */}
      {exercise && (
        <div className="px-4 py-2 flex items-center gap-4 shrink-0"
          style={{ borderTop: "1px solid var(--divider)", background: "var(--surface-glass-hover)" }}
        >
          {[
            { l: "Exercise", v: exercise.name || "Custom" },
            { l: "Distance", v: `${exercise.distance}m` },
            { l: "Time", v: `${exercise.timeLimit}s` },
            { l: "Weapon", v: exercise.weapon || "—" },
            { l: "Position", v: exercise.firingPosition || "—" },
          ].map((item) => (
            <div key={item.l} className="flex-1 min-w-0">
              <p className="text-[7px] uppercase tracking-widest text-muted-foreground font-semibold">{item.l}</p>
              <p className="text-[10px] font-mono text-foreground font-medium truncate">{item.v}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ── Main ── */
export function SessionLiveStep({ lanes, exercises, onBack, isFirer = false }: Props) {
  const [sessionState, setSessionState] = useState<"idle" | "running" | "paused">("idle");
  const [pinnedLanes, setPinnedLanes] = useState<Set<number>>(new Set());
  const [hoveredPinnedLane, setHoveredPinnedLane] = useState<number | null>(null);
  const [hoveredStripLane, setHoveredStripLane] = useState<number | null>(null);

  const togglePin = useCallback((laneId: number) => {
    setPinnedLanes((prev) => {
      const next = new Set(prev);
      if (next.has(laneId)) next.delete(laneId);
      else if (next.size < MAX_PINS) next.add(laneId);
      return next;
    });
  }, []);

  const pinnedList = lanes.filter((l) => pinnedLanes.has(l.laneId)).sort((a, b) => a.laneId - b.laneId);

  // The lane to show as overlay (only non-pinned lanes trigger overlay)
  const overlayLane = hoveredStripLane !== null && !pinnedLanes.has(hoveredStripLane)
    ? lanes.find((l) => l.laneId === hoveredStripLane)
    : null;

  const btnBase = "h-9 px-4 rounded-xl font-semibold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 disabled:opacity-25 disabled:pointer-events-none";

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Top controls */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {!isFirer ? (
          <button onClick={onBack} disabled={sessionState !== "idle"} className={`${btnBase} glass-btn text-muted-foreground hover:text-foreground`}>
            <ChevronLeft className="w-3 h-3" /> Back
          </button>
        ) : (
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest text-accent" style={{
            background: "linear-gradient(135deg, hsl(var(--accent) / 0.15), hsl(var(--primary) / 0.1))",
            border: "1px solid hsl(var(--accent) / 0.3)",
            boxShadow: "0 0 20px hsl(var(--accent) / 0.15), inset 0 1px 0 hsl(var(--accent) / 0.1)",
          }}>
            <Gamepad2 className="w-4 h-4" />
            <span>Control with FPE</span>
            <motion.span
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ opacity: [1, 0.3, 1], boxShadow: ["0 0 4px hsl(var(--accent) / 0.5)", "0 0 12px hsl(var(--accent) / 0.8)", "0 0 4px hsl(var(--accent) / 0.5)"] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        )}
        {sessionState === "running" ? (
          <button onClick={() => setSessionState("paused")} className={`${btnBase} glass-btn text-warning`}>
            <Pause className="w-3 h-3" /> Pause
          </button>
        ) : (
          <button onClick={() => setSessionState("running")} className={`${btnBase} glass-btn text-success`}>
            <Play className="w-3 h-3" /> {sessionState === "paused" ? "Resume" : "Start"}
          </button>
        )}
        <button onClick={() => setSessionState("idle")} disabled={sessionState === "idle"} className={`${btnBase} glass-btn text-destructive`}>
          <Square className="w-3 h-3" /> Stop
        </button>
        <div className="ml-2 flex items-center gap-1.5">
          <motion.span
            className={`w-2 h-2 rounded-full ${sessionState === "running" ? "bg-success" : sessionState === "paused" ? "bg-warning" : "bg-muted-foreground/30"}`}
            animate={sessionState === "running" ? { boxShadow: ["0 0 4px hsl(var(--success) / 0.3)", "0 0 14px hsl(var(--success) / 0.7)", "0 0 4px hsl(var(--success) / 0.3)"] } : undefined}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            {sessionState === "idle" ? "Standby" : sessionState === "running" ? "Live" : "Paused"}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[9px] text-muted-foreground font-mono">{pinnedLanes.size}/{MAX_PINS} pinned</span>
          {pinnedLanes.size > 0 && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              onClick={() => setPinnedLanes(new Set())} className={`${btnBase} glass-btn text-muted-foreground hover:text-foreground`}>
              <PinOff className="w-3 h-3" /> Clear
            </motion.button>
          )}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        {/* Pinned cards + hover overlay */}
        <div className="flex-1 min-h-0 relative">
          <AnimatePresence mode="popLayout">
            {pinnedList.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-2"
              >
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
                  <Pin className="w-8 h-8 text-muted-foreground/15" />
                </motion.div>
                <p className="text-xs text-muted-foreground/40 font-medium">No lanes pinned</p>
                <p className="text-[9px] text-muted-foreground/25">Click a lane below to pin it (up to {MAX_PINS})</p>
              </motion.div>
            ) : (
              <div className="flex gap-3 h-full">
                {pinnedList.map((lane) => (
                  <div key={lane.laneId} className="flex-1 min-w-0 h-full">
                    <PinnedCard
                      lane={lane}
                      exercise={exercises.find((e) => e.laneId === lane.laneId)}
                      onUnpin={() => togglePin(lane.laneId)}
                      sessionState={sessionState}
                      isHovered={hoveredPinnedLane === lane.laneId}
                      onHoverStart={() => setHoveredPinnedLane(lane.laneId)}
                      onHoverEnd={() => setHoveredPinnedLane(null)}
                    />
                  </div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Hover overlay from strip */}
          <AnimatePresence>
            {overlayLane && (
              <HoverOverlayCard
                key={`overlay-${overlayLane.laneId}`}
                lane={overlayLane}
                exercise={exercises.find((e) => e.laneId === overlayLane.laneId)}
                sessionState={sessionState}
              />
            )}
          </AnimatePresence>
        </div>

        {/* All lanes strip */}
        <div className="shrink-0 rounded-xl p-1.5"
          style={{
            background: "var(--surface-glass)",
            border: "1px solid var(--surface-glass-border)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex gap-1.5 overflow-x-auto">
            {lanes.map((lane) => {
              const isPinned = pinnedLanes.has(lane.laneId);
              return (
                <StripThumbnail
                  key={lane.laneId}
                  lane={lane}
                  exercise={exercises.find((e) => e.laneId === lane.laneId)}
                  onPin={() => togglePin(lane.laneId)}
                  canPin={isPinned || pinnedLanes.size < MAX_PINS}
                  sessionState={sessionState}
                  isPinned={isPinned}
                  isHighlighted={hoveredPinnedLane === lane.laneId}
                  onHoverLane={() => setHoveredStripLane(lane.laneId)}
                  onLeaveLane={() => setHoveredStripLane(null)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
