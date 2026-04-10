import { useState, useCallback } from "react";
import { Play, Pause, Square, ChevronLeft, Pin, PinOff, Target, Crosshair, Zap, Shield, Eye, Layers, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { LaneAssignment, ExerciseConfig } from "./types";
import { getTargetById } from "@/contexts/TargetsContext";

const MAX_PINS = 4;

interface Props {
  lanes: LaneAssignment[];
  exercises: ExerciseConfig[];
  onBack: () => void;
}

/* ── Pinned Lane Card (full detail) ── */
function PinnedCard({
  lane,
  exercise,
  onUnpin,
  sessionState,
}: {
  lane: LaneAssignment;
  exercise: ExerciseConfig | undefined;
  onUnpin: () => void;
  sessionState: "idle" | "running" | "paused";
}) {
  const activeTrainee = lane.queue[0];
  const target = exercise ? getTargetById(exercise.targetType) : null;
  const shots = { hits: Math.floor(Math.random() * 5), misses: Math.floor(Math.random() * 3), total: 0 };
  shots.total = shots.hits + shots.misses;
  const accuracy = shots.total > 0 ? Math.round((shots.hits / shots.total) * 100) : 0;

  return (
    <motion.div
      layout
      className="rounded-2xl flex flex-col overflow-hidden relative group"
      style={{
        background: "var(--surface-glass)",
        border: "1px solid hsl(var(--primary) / 0.3)",
        backdropFilter: "blur(28px) saturate(200%)",
        WebkitBackdropFilter: "blur(28px) saturate(200%)",
        boxShadow: "0 0 40px hsl(var(--primary) / 0.15), 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
    >
      {/* Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, hsl(var(--accent) / 0.04) 100%)",
          boxShadow: "inset 0 0 60px hsl(var(--primary) / 0.05)",
        }}
      />

      {/* Header: lane number + trainee info + unpin */}
      <div
        className="px-3 py-2 flex items-center gap-2.5 shrink-0 relative z-10"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.05))",
          borderBottom: "1px solid var(--divider)",
        }}
      >
        <motion.div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-primary-foreground shrink-0"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "0 2px 8px hsl(var(--primary) / 0.3)",
          }}
          animate={sessionState === "running" ? { boxShadow: ["0 2px 8px hsl(var(--primary) / 0.3)", "0 2px 16px hsl(var(--primary) / 0.6)", "0 2px 8px hsl(var(--primary) / 0.3)"] } : undefined}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {lane.laneId}
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-foreground truncate">{activeTrainee?.name || "—"}</p>
          <p className="text-[8px] text-muted-foreground font-mono truncate">{activeTrainee?.id} · {activeTrainee?.rank}</p>
        </div>
        <motion.span
          className={`w-2 h-2 rounded-full shrink-0 ${
            sessionState === "running" ? "bg-success" :
            sessionState === "paused" ? "bg-warning" :
            "bg-muted-foreground/30"
          }`}
          animate={sessionState === "running" ? { scale: [1, 1.4, 1] } : undefined}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <motion.button
          onClick={onUnpin}
          className="p-1.5 rounded-lg text-primary shrink-0"
          style={{
            background: "hsl(var(--primary) / 0.15)",
            border: "1px solid hsl(var(--primary) / 0.3)",
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.85 }}
          title="Unpin lane"
        >
          <Pin className="w-3 h-3" />
        </motion.button>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-3 relative z-10 flex-1">
        {/* Target image (replaces live feed) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl overflow-hidden relative flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid var(--divider)",
            minHeight: 160,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          {target ? (
            <img src={target.image} alt={target.label} className="w-full h-full object-contain p-2" style={{ maxHeight: 180 }} />
          ) : (
            <div className="text-center py-8">
              <Crosshair className="w-8 h-8 text-muted-foreground/30 mx-auto mb-1" />
              <p className="text-[9px] text-muted-foreground/50">No target assigned</p>
            </div>
          )}
          {/* Scanning line when running */}
          {sessionState === "running" && (
            <motion.div
              className="absolute left-0 right-0 h-px pointer-events-none"
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
            { label: "Rounds", value: `${shots.total}/${exercise?.rounds || 0}`, color: "text-foreground", icon: Shield },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 400, damping: 30 }}
              className="rounded-xl p-2 text-center"
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
        {exercise && (
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
        )}

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
  );
}

/* ── Drawer Thumbnail (unpinned lane) ── */
function DrawerThumbnail({
  lane,
  exercise,
  onPin,
  canPin,
  sessionState,
  onHoverStart,
  onHoverEnd,
  isHovered,
}: {
  lane: LaneAssignment;
  exercise: ExerciseConfig | undefined;
  onPin: () => void;
  canPin: boolean;
  sessionState: "idle" | "running" | "paused";
  onHoverStart: () => void;
  onHoverEnd: () => void;
  isHovered: boolean;
}) {
  const activeTrainee = lane.queue[0];
  const isEmpty = lane.queue.length === 0;
  const target = exercise ? getTargetById(exercise.targetType) : null;
  const shots = { hits: Math.floor(Math.random() * 5), misses: Math.floor(Math.random() * 3), total: 0 };
  shots.total = shots.hits + shots.misses;

  return (
    <motion.div
      layout
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      className="rounded-xl flex items-center gap-2.5 p-2.5 cursor-pointer relative group"
      style={{
        background: isHovered ? "var(--surface-glass-hover)" : "var(--surface-glass)",
        border: `1px solid ${isHovered ? "hsl(var(--primary) / 0.3)" : "var(--surface-glass-border)"}`,
        backdropFilter: "blur(20px) saturate(180%)",
        boxShadow: isHovered ? "0 0 20px hsl(var(--primary) / 0.1)" : "none",
        transition: "all 0.3s ease",
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isEmpty ? 0.4 : 1, x: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Lane number */}
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold text-primary-foreground shrink-0"
        style={{
          background: "var(--gradient-primary)",
          boxShadow: "0 2px 6px hsl(var(--primary) / 0.25)",
        }}
      >
        {lane.laneId}
      </div>

      {/* Target thumbnail */}
      <div
        className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0"
        style={{ background: "rgba(255,255,255,0.9)", border: "1px solid var(--divider)" }}
      >
        {target ? (
          <img src={target.image} alt={target.label} className="w-full h-full object-contain" />
        ) : (
          <Target className="w-3 h-3 text-muted-foreground/40" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-foreground truncate">{activeTrainee?.name || "Empty"}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {!isEmpty && (
            <>
              <span className="text-[8px] font-mono text-success font-bold">{shots.hits}H</span>
              <span className="text-[8px] font-mono text-destructive font-bold">{shots.misses}M</span>
            </>
          )}
          <motion.span
            className={`w-1.5 h-1.5 rounded-full ${
              sessionState === "running" ? "bg-success" :
              sessionState === "paused" ? "bg-warning" :
              "bg-muted-foreground/30"
            }`}
            animate={sessionState === "running" ? { scale: [1, 1.3, 1] } : undefined}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </div>

      {/* Pin button */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); onPin(); }}
        className="p-1.5 rounded-lg text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0"
        style={{ background: "var(--surface-glass)" }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.85 }}
        disabled={!canPin}
        title={canPin ? "Pin lane" : "Max 4 pins reached"}
      >
        <Pin className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );
}

/* ── Main Component ── */
export function SessionLiveStep({ lanes, exercises, onBack }: Props) {
  const [sessionState, setSessionState] = useState<"idle" | "running" | "paused">("idle");
  const [pinnedLanes, setPinnedLanes] = useState<Set<number>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredDrawerLane, setHoveredDrawerLane] = useState<number | null>(null);

  const togglePin = useCallback((laneId: number) => {
    setPinnedLanes((prev) => {
      const next = new Set(prev);
      if (next.has(laneId)) {
        next.delete(laneId);
      } else {
        if (next.size >= MAX_PINS) return prev;
        next.add(laneId);
      }
      return next;
    });
  }, []);

  const pinnedLanesList = lanes.filter((l) => pinnedLanes.has(l.laneId)).sort((a, b) => a.laneId - b.laneId);
  const unpinnedLanesList = lanes.filter((l) => !pinnedLanes.has(l.laneId)).sort((a, b) => a.laneId - b.laneId);

  const btnBase =
    "h-10 px-5 rounded-xl font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-25 disabled:pointer-events-none";

  const gridCols = pinnedLanesList.length <= 2 ? pinnedLanesList.length : pinnedLanesList.length <= 4 ? 2 : 2;

  return (
    <div className="flex flex-col h-full gap-4 relative">
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
          <button onClick={() => setSessionState("paused")} className={`${btnBase} glass-btn text-warning`}>
            <Pause className="w-3.5 h-3.5" /> Pause
          </button>
        ) : (
          <button onClick={() => setSessionState("running")} className={`${btnBase} glass-btn text-success`}>
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
          {/* Drawer toggle */}
          <motion.button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`${btnBase} glass-btn ${drawerOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            style={drawerOpen ? { background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.3)" } : {}}
            whileTap={{ scale: 0.95 }}
          >
            <Layers className="w-3.5 h-3.5" />
            All Lanes
            {unpinnedLanesList.length > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary/20 text-primary text-[9px] font-bold flex items-center justify-center">
                {unpinnedLanesList.length}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex gap-3 overflow-hidden">
        {/* Pinned cards grid */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1">
          <AnimatePresence mode="popLayout">
            {pinnedLanesList.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-3"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <Pin className="w-10 h-10 text-muted-foreground/20" />
                </motion.div>
                <p className="text-sm text-muted-foreground/50 font-medium">No lanes pinned</p>
                <p className="text-[10px] text-muted-foreground/30">
                  Open <strong>All Lanes</strong> and pin up to {MAX_PINS} lanes to monitor
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid gap-3 h-full"
                style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
              >
                {pinnedLanesList.map((lane) => {
                  const exercise = exercises.find((e) => e.laneId === lane.laneId);
                  return (
                    <PinnedCard
                      key={lane.laneId}
                      lane={lane}
                      exercise={exercise}
                      onUnpin={() => togglePin(lane.laneId)}
                      sessionState={sessionState}
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Drawer panel (slides in from right) */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="shrink-0 overflow-hidden flex flex-col rounded-2xl"
              style={{
                background: "var(--surface-glass)",
                border: "1px solid var(--surface-glass-border)",
                backdropFilter: "blur(28px) saturate(200%)",
                WebkitBackdropFilter: "blur(28px) saturate(200%)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {/* Drawer header */}
              <div
                className="px-3 py-2.5 flex items-center justify-between shrink-0"
                style={{ borderBottom: "1px solid var(--divider)", background: "var(--surface-glass-hover)" }}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">All Lanes</span>
                </div>
                <motion.button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </div>

              {/* Drawer content */}
              <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
                {/* Pinned lanes section */}
                {pinnedLanesList.length > 0 && (
                  <>
                    <p className="text-[8px] uppercase tracking-widest text-primary font-bold px-1 pt-1">
                      Pinned ({pinnedLanesList.length})
                    </p>
                    {pinnedLanesList.map((lane) => {
                      const exercise = exercises.find((e) => e.laneId === lane.laneId);
                      return (
                        <DrawerThumbnail
                          key={lane.laneId}
                          lane={lane}
                          exercise={exercise}
                          onPin={() => togglePin(lane.laneId)}
                          canPin={true}
                          sessionState={sessionState}
                          onHoverStart={() => setHoveredDrawerLane(lane.laneId)}
                          onHoverEnd={() => setHoveredDrawerLane(null)}
                          isHovered={hoveredDrawerLane === lane.laneId}
                        />
                      );
                    })}
                    <div className="h-px my-1" style={{ background: "var(--divider)" }} />
                  </>
                )}

                {/* Unpinned lanes */}
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold px-1 pt-1">
                  Available ({unpinnedLanesList.length})
                </p>
                {unpinnedLanesList.map((lane) => {
                  const exercise = exercises.find((e) => e.laneId === lane.laneId);
                  return (
                    <DrawerThumbnail
                      key={lane.laneId}
                      lane={lane}
                      exercise={exercise}
                      onPin={() => togglePin(lane.laneId)}
                      canPin={pinnedLanes.size < MAX_PINS}
                      sessionState={sessionState}
                      onHoverStart={() => setHoveredDrawerLane(lane.laneId)}
                      onHoverEnd={() => setHoveredDrawerLane(null)}
                      isHovered={hoveredDrawerLane === lane.laneId}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
