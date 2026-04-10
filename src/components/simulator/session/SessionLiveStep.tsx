import { useState, useCallback } from "react";
import { Play, Pause, Square, ChevronLeft, Pin, PinOff, Target, Crosshair, Zap, Shield, Eye, Layers, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LaneAssignment, ExerciseConfig } from "./types";
import { getTargetById } from "@/contexts/TargetsContext";

const MAX_PINS = 4;

interface Props {
  lanes: LaneAssignment[];
  exercises: ExerciseConfig[];
  onBack: () => void;
}

/* ── Pinned Lane Card ── */
function PinnedCard({
  lane,
  exercise,
  onUnpin,
  sessionState,
  cardCount,
}: {
  lane: LaneAssignment;
  exercise: ExerciseConfig | undefined;
  onUnpin: () => void;
  sessionState: "idle" | "running" | "paused";
  cardCount: number;
}) {
  const activeTrainee = lane.queue[0];
  const target = exercise ? getTargetById(exercise.targetType) : null;
  const shots = { hits: Math.floor(Math.random() * 5), misses: Math.floor(Math.random() * 3), total: 0 };
  shots.total = shots.hits + shots.misses;
  const accuracy = shots.total > 0 ? Math.round((shots.hits / shots.total) * 100) : 0;

  return (
    <motion.div
      layout
      className="rounded-2xl flex flex-col overflow-hidden relative h-full"
      style={{
        background: "var(--surface-glass)",
        border: "1px solid hsl(var(--primary) / 0.25)",
        backdropFilter: "blur(28px) saturate(200%)",
        WebkitBackdropFilter: "blur(28px) saturate(200%)",
        boxShadow: "0 0 40px hsl(var(--primary) / 0.12), 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--accent) / 0.03) 100%)",
        }}
      />

      {/* Top bar: lane# + trainee + status + unpin */}
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

      {/* Main body: target image (hero) + stats side strip */}
      <div className="flex-1 flex relative z-10 min-h-0">
        {/* Target image — takes most space */}
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

        {/* Stats strip on right */}
        <div className="w-[72px] shrink-0 flex flex-col gap-1 p-1.5 justify-center"
          style={{ borderLeft: "1px solid var(--divider)", background: "var(--surface-inset)" }}
        >
          {[
            { label: "Hits", value: String(shots.hits), color: "text-success", icon: Zap },
            { label: "Miss", value: String(shots.misses), color: "text-destructive", icon: Target },
            { label: "Acc", value: `${accuracy}%`, color: "text-primary", icon: Eye },
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

/* ── Drawer Thumbnail ── */
function DrawerThumbnail({
  lane,
  exercise,
  onPin,
  canPin,
  sessionState,
}: {
  lane: LaneAssignment;
  exercise: ExerciseConfig | undefined;
  onPin: () => void;
  canPin: boolean;
  sessionState: "idle" | "running" | "paused";
}) {
  const activeTrainee = lane.queue[0];
  const isEmpty = lane.queue.length === 0;
  const target = exercise ? getTargetById(exercise.targetType) : null;
  const shots = { hits: Math.floor(Math.random() * 5), misses: Math.floor(Math.random() * 3), total: 0 };
  shots.total = shots.hits + shots.misses;

  return (
    <motion.div
      className="rounded-xl flex items-center gap-2 p-2 cursor-pointer relative group"
      style={{
        background: "var(--surface-glass)",
        border: "1px solid var(--surface-glass-border)",
        transition: "all 0.25s ease",
      }}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: isEmpty ? 0.35 : 1, x: 0 }}
      whileHover={{
        scale: 1.02,
        borderColor: "hsl(var(--primary) / 0.3)",
        boxShadow: "0 0 16px hsl(var(--primary) / 0.1)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
    >
      <div className="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-bold text-primary-foreground shrink-0"
        style={{ background: "var(--gradient-primary)" }}
      >
        {lane.laneId}
      </div>
      <div className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center shrink-0"
        style={{ background: "rgba(255,255,255,0.9)", border: "1px solid var(--divider)" }}
      >
        {target ? <img src={target.image} alt="" className="w-full h-full object-contain" /> : <Target className="w-3 h-3 text-muted-foreground/30" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-semibold text-foreground truncate">{activeTrainee?.name || "Empty"}</p>
        {!isEmpty && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[7px] font-mono text-success font-bold">{shots.hits}H</span>
            <span className="text-[7px] font-mono text-destructive font-bold">{shots.misses}M</span>
          </div>
        )}
      </div>
      <motion.button
        onClick={(e) => { e.stopPropagation(); onPin(); }}
        className="p-1 rounded-md text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        style={{ background: "var(--surface-glass)" }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.85 }}
        disabled={!canPin}
      >
        <Pin className="w-2.5 h-2.5" />
      </motion.button>
    </motion.div>
  );
}

/* ── Main ── */
export function SessionLiveStep({ lanes, exercises, onBack }: Props) {
  const [sessionState, setSessionState] = useState<"idle" | "running" | "paused">("idle");
  const [pinnedLanes, setPinnedLanes] = useState<Set<number>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);

  const togglePin = useCallback((laneId: number) => {
    setPinnedLanes((prev) => {
      const next = new Set(prev);
      if (next.has(laneId)) next.delete(laneId);
      else if (next.size < MAX_PINS) next.add(laneId);
      return next;
    });
  }, []);

  const pinnedList = lanes.filter((l) => pinnedLanes.has(l.laneId)).sort((a, b) => a.laneId - b.laneId);
  const unpinnedList = lanes.filter((l) => !pinnedLanes.has(l.laneId)).sort((a, b) => a.laneId - b.laneId);

  const btnBase = "h-9 px-4 rounded-xl font-semibold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 disabled:opacity-25 disabled:pointer-events-none";

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Top controls */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <button onClick={onBack} disabled={sessionState !== "idle"} className={`${btnBase} glass-btn text-muted-foreground hover:text-foreground`}>
          <ChevronLeft className="w-3 h-3" /> Back
        </button>
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
          <span className="text-[9px] text-muted-foreground font-mono">{pinnedLanes.size}/{MAX_PINS}</span>
          {pinnedLanes.size > 0 && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              onClick={() => setPinnedLanes(new Set())} className={`${btnBase} glass-btn text-muted-foreground hover:text-foreground`}>
              <PinOff className="w-3 h-3" /> Clear
            </motion.button>
          )}
          <motion.button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`${btnBase} glass-btn ${drawerOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            style={drawerOpen ? { background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.25)" } : {}}
            whileTap={{ scale: 0.95 }}
          >
            <Layers className="w-3 h-3" />
            Lanes
            {unpinnedList.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[8px] font-bold flex items-center justify-center">
                {unpinnedList.length}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Main area: pinned cards side-by-side + drawer */}
      <div className="flex-1 flex gap-3 min-h-0">
        {/* Pinned cards — fills available space, side by side */}
        <div className="flex-1 min-h-0 min-w-0">
          <AnimatePresence mode="popLayout">
            {pinnedList.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-2"
              >
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
                  <Pin className="w-8 h-8 text-muted-foreground/15" />
                </motion.div>
                <p className="text-xs text-muted-foreground/40 font-medium">No lanes pinned</p>
                <p className="text-[9px] text-muted-foreground/25">Open <strong>Lanes</strong> panel to pin up to {MAX_PINS}</p>
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
                      cardCount={pinnedList.length}
                    />
                  </div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Drawer panel */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="shrink-0 overflow-hidden flex flex-col rounded-2xl h-full"
              style={{
                background: "var(--surface-glass)",
                border: "1px solid var(--surface-glass-border)",
                backdropFilter: "blur(28px) saturate(200%)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div className="px-3 py-2 flex items-center justify-between shrink-0"
                style={{ borderBottom: "1px solid var(--divider)", background: "var(--surface-glass-hover)" }}
              >
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">All Lanes</span>
                </div>
                <motion.button onClick={() => setDrawerOpen(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <X className="w-3 h-3" />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto p-1.5 flex flex-col gap-1">
                {pinnedList.length > 0 && (
                  <>
                    <p className="text-[7px] uppercase tracking-widest text-primary font-bold px-1 pt-1">Pinned</p>
                    {pinnedList.map((lane) => (
                      <DrawerThumbnail key={lane.laneId} lane={lane} exercise={exercises.find((e) => e.laneId === lane.laneId)}
                        onPin={() => togglePin(lane.laneId)} canPin={true} sessionState={sessionState} />
                    ))}
                    <div className="h-px my-0.5" style={{ background: "var(--divider)" }} />
                  </>
                )}
                <p className="text-[7px] uppercase tracking-widest text-muted-foreground font-bold px-1 pt-0.5">Available</p>
                {unpinnedList.map((lane) => (
                  <DrawerThumbnail key={lane.laneId} lane={lane} exercise={exercises.find((e) => e.laneId === lane.laneId)}
                    onPin={() => togglePin(lane.laneId)} canPin={pinnedLanes.size < MAX_PINS} sessionState={sessionState} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
