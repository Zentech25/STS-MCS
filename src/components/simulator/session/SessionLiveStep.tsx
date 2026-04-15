import { useState, useCallback, useMemo } from "react";
import { Play, Pause, Square, ChevronLeft, Target, Crosshair, X, Circle, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LaneAssignment, ExerciseConfig } from "./types";
import { getTargetById } from "@/contexts/TargetsContext";
import { ConnectionStatusRow } from "./ConnectionStatus";

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

/* ── Thumbnail Card ── */
function ThumbnailCard({
  lane,
  exercise,
  sessionState,
  onSelect,
  isSelected,
}: {
  lane: LaneAssignment;
  exercise: ExerciseConfig | undefined;
  sessionState: "idle" | "running" | "paused";
  onSelect: () => void;
  isSelected: boolean;
}) {
  const activeTrainee = lane.queue[0];
  const shots = useLaneShots(lane.laneId);
  const target = exercise ? getTargetById(exercise.targetType) : null;

  return (
    <motion.button
      onClick={onSelect}
      className="rounded-xl flex flex-col overflow-hidden text-left relative group h-full"
      style={{
        background: isSelected ? "hsl(var(--primary) / 0.1)" : "var(--surface-glass)",
        border: isSelected ? "1px solid hsl(var(--primary) / 0.5)" : "1px solid var(--divider)",
        backdropFilter: "blur(20px)",
        boxShadow: isSelected
          ? "0 0 24px hsl(var(--primary) / 0.2)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        transition: "border-color 0.3s, box-shadow 0.3s, background 0.3s",
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 20px hsl(var(--primary) / 0.15), 0 4px 16px rgba(0,0,0,0.1)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Lane badge + trainee */}
      <div className="px-2.5 py-2 flex items-center gap-2"
        style={{ borderBottom: "1px solid var(--divider)" }}
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
          <p className="text-[10px] font-semibold text-foreground truncate">{activeTrainee?.name || "Empty"}</p>
          <p className="text-[7px] text-muted-foreground font-mono truncate">{activeTrainee?.rank || "—"}</p>
        </div>
        <motion.span
          className={`w-2 h-2 rounded-full shrink-0 ${sessionState === "running" ? "bg-success" : sessionState === "paused" ? "bg-warning" : "bg-muted-foreground/30"}`}
          animate={sessionState === "running" ? { scale: [1, 1.4, 1] } : undefined}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </div>

      {/* Target thumbnail - expanded to fill most of the card */}
      <div className="flex-1 flex items-center justify-center p-1 min-h-[120px] relative"
        style={{ background: "rgba(255,255,255,0.95)" }}
      >
        {target ? (
          <img src={target.image} alt={target.label} className="w-full h-full object-contain" />
        ) : (
          <Crosshair className="w-12 h-12 text-muted-foreground/15" />
        )}
      </div>

      {/* Stats row - redesigned with better visual hierarchy */}
      <div className="px-2 py-2 flex items-center justify-between gap-1"
        style={{ borderTop: "1px solid var(--divider)", background: "var(--surface-inset)" }}
      >
        <div className="flex items-center gap-1">
          {/* Hits - bullet hole in target */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" 
               style={{ background: "hsl(var(--success) / 0.25)", border: "1px solid hsl(var(--success) / 0.35)" }}>
            <Target className="w-3.5 h-3.5 text-success" strokeWidth={2.5} />
            <span className="text-xs font-mono font-bold text-foreground min-w-[1ch]">{shots.hits}</span>
          </div>
          
          {/* Miss - cross mark */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" 
               style={{ background: "hsl(var(--destructive) / 0.25)", border: "1px solid hsl(var(--destructive) / 0.35)" }}>
            <X className="w-3.5 h-3.5 text-destructive" strokeWidth={3} />
            <span className="text-xs font-mono font-bold text-foreground min-w-[1ch]">{shots.misses}</span>
          </div>
        </div>
        
        {/* Accuracy - crosshair/bullseye */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg" 
             style={{ background: "hsl(var(--primary) / 0.25)", border: "1px solid hsl(var(--primary) / 0.35)" }}>
          <Crosshair className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
          <span className="text-xs font-mono font-bold text-foreground">{shots.accuracy}%</span>
        </div>
      </div>
    </motion.button>
  );
}

/* ── Detail Popup ── */
function DetailPopup({
  lane,
  exercise,
  sessionState,
  onClose,
}: {
  lane: LaneAssignment;
  exercise: ExerciseConfig | undefined;
  sessionState: "idle" | "running" | "paused";
  onClose: () => void;
}) {
  const activeTrainee = lane.queue[0];
  const target = exercise ? getTargetById(exercise.targetType) : null;
  const shots = useLaneShots(lane.laneId);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />

      {/* Card */}
      <motion.div
        className="relative z-10 w-[680px] max-w-[92vw] max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "var(--surface-glass)",
          border: "2px solid hsl(var(--primary) / 0.4)",
          backdropFilter: "blur(30px) saturate(200%)",
          boxShadow: "0 0 80px hsl(var(--primary) / 0.25), 0 20px 60px rgba(0,0,0,0.3)",
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3 shrink-0"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.05))",
            borderBottom: "1px solid var(--divider)",
          }}
        >
          <motion.div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground"
            style={{ background: "var(--gradient-primary)", boxShadow: "0 2px 12px hsl(var(--primary) / 0.4)" }}
          >
            {lane.laneId}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-foreground truncate">{activeTrainee?.name || "—"}</p>
            <p className="text-xs text-muted-foreground font-mono">{activeTrainee?.id} · {activeTrainee?.rank}</p>
          </div>
          <ConnectionStatusRow laneId={lane.laneId} />
          <motion.span
            className={`w-2.5 h-2.5 rounded-full ${sessionState === "running" ? "bg-success" : sessionState === "paused" ? "bg-warning" : "bg-muted-foreground/30"}`}
            animate={sessionState === "running" ? { scale: [1, 1.4, 1] } : undefined}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: "hsl(var(--muted) / 0.5)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body: target + stats */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.92)" }}
          >
            {target ? (
              <img src={target.image} alt={target.label} className="max-w-full max-h-[340px] object-contain" />
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

          <div className="w-[140px] shrink-0 flex flex-col gap-3 p-4 justify-center"
            style={{ borderLeft: "1px solid var(--divider)", background: "var(--surface-inset)" }}
          >
            {[
              { label: "Hits", value: String(shots.hits), bg: "hsl(var(--success) / 0.25)", border: "hsl(var(--success) / 0.4)", icon: Target, iconColor: "text-success" },
              { label: "Miss", value: String(shots.misses), bg: "hsl(var(--destructive) / 0.25)", border: "hsl(var(--destructive) / 0.4)", icon: X, iconColor: "text-destructive" },
              { label: "Acc", value: `${shots.accuracy}%`, bg: "hsl(var(--primary) / 0.25)", border: "hsl(var(--primary) / 0.4)", icon: Crosshair, iconColor: "text-primary" },
              { label: "Rds", value: `${shots.total}/${exercise?.rounds || 0}`, bg: "hsl(var(--muted) / 0.4)", border: "hsl(var(--muted) / 0.5)", icon: Circle, iconColor: "text-muted-foreground", fillIcon: true },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-3 text-center"
                style={{ background: item.bg, border: `1px solid ${item.border}` }}
              >
                <item.icon className={`w-6 h-6 mx-auto ${item.iconColor} mb-1.5`} strokeWidth={item.label === "Miss" ? 3 : 2.5} fill={item.fillIcon ? "currentColor" : undefined} />
                <p className="text-lg font-mono font-bold leading-tight text-foreground">{item.value}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: exercise info */}
        {exercise && (
          <div className="px-5 py-3.5 flex items-center gap-6 shrink-0"
            style={{ borderTop: "1px solid var(--divider)", background: "var(--surface-glass-hover)" }}
          >
            {[
              { l: "Exercise", v: exercise.name || "Custom" },
              { l: "Range", v: `${exercise.range}m` },
              { l: "Time", v: `${exercise.timeLimit}s` },
              { l: "Weapon", v: exercise.weapon || "—" },
              { l: "Position", v: exercise.firingPosition || "—" },
            ].map((item) => (
              <div key={item.l} className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{item.l}</p>
                <p className="text-sm font-mono text-foreground font-bold truncate">{item.v}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Main ── */
export function SessionLiveStep({ lanes, exercises, onBack, isFirer = false }: Props) {
  const [sessionState, setSessionState] = useState<"idle" | "running" | "paused">("idle");
  const [selectedLane, setSelectedLane] = useState<number | null>(null);

  const handleSelect = useCallback((laneId: number) => {
    setSelectedLane(laneId);
  }, []);

  const selectedLaneData = selectedLane !== null ? lanes.find((l) => l.laneId === selectedLane) : null;

  const btnBase = "h-9 px-4 rounded-xl font-semibold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 disabled:opacity-25 disabled:pointer-events-none";

  return (
    <div className="flex flex-col h-full gap-3">
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
      </div>

      {/* 10-lane thumbnail grid */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="grid grid-cols-5 gap-3 h-full auto-rows-fr">
          {lanes.map((lane) => (
            <ThumbnailCard
              key={lane.laneId}
              lane={lane}
              exercise={exercises.find((e) => e.laneId === lane.laneId)}
              sessionState={sessionState}
              onSelect={() => handleSelect(lane.laneId)}
              isSelected={selectedLane === lane.laneId}
            />
          ))}
        </div>
      </div>

      {/* Detail popup */}
      <AnimatePresence>
        {selectedLaneData && (
          <DetailPopup
            key={`detail-${selectedLaneData.laneId}`}
            lane={selectedLaneData}
            exercise={exercises.find((e) => e.laneId === selectedLaneData.laneId)}
            sessionState={sessionState}
            onClose={() => setSelectedLane(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
