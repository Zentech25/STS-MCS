import { useState } from "react";
import { Play, Pause, Square, Settings, Crosshair, Wifi } from "lucide-react";

const TARGET_TYPES = [
  { id: "humanoid-a", label: "Standard Humanoid" },
  { id: "humanoid-b", label: "Armored Humanoid" },
  { id: "humanoid-c", label: "Moving Target" },
  { id: "humanoid-d", label: "Partial Exposure" },
];

interface LaneData {
  id: number;
  targetType: string;
  traineeId: string;
  name: string;
  weapon: string;
  practice: string;
  rounds: string;
  sessionState: string;
  range: string;
  timer: string;
  shotsFired: number;
  shotsMissed: number;
  connections: { TGT: boolean; FPE: boolean; FRM: boolean; SDU: boolean };
}

const createEmptyLane = (id: number): LaneData => ({
  id,
  targetType: "humanoid-a",
  traineeId: "—",
  name: "—",
  weapon: "—",
  practice: "—",
  rounds: "—",
  sessionState: "—",
  range: "—",
  timer: "—",
  shotsFired: 0,
  shotsMissed: 0,
  connections: { TGT: false, FPE: false, FRM: false, SDU: false },
});

function HumanoidTarget({ targetType }: { targetType: string }) {
  const getTargetColor = () => {
    switch (targetType) {
      case "humanoid-b": return "hsl(var(--warning))";
      case "humanoid-c": return "hsl(var(--success))";
      case "humanoid-d": return "hsl(var(--accent))";
      default: return "hsl(var(--primary))";
    }
  };

  const color = getTargetColor();

  return (
    <svg viewBox="0 0 120 200" className="w-full h-full max-h-[220px]">
      {/* Target rings */}
      <circle cx="60" cy="45" r="38" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <circle cx="60" cy="45" r="28" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />
      <circle cx="60" cy="45" r="18" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" />
      
      {/* Head */}
      <circle cx="60" cy="35" r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" />
      <circle cx="60" cy="35" r="4" fill={color} opacity="0.4" />
      
      {/* Neck */}
      <line x1="60" y1="49" x2="60" y2="58" stroke={color} strokeWidth="1.5" opacity="0.8" />
      
      {/* Torso */}
      <rect x="40" y="58" width="40" height="50" rx="3" fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" />
      
      {/* Torso target rings */}
      <circle cx="60" cy="83" r="18" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <circle cx="60" cy="83" r="10" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />
      <circle cx="60" cy="83" r="4" fill={color} opacity="0.3" />
      
      {/* Arms */}
      <line x1="40" y1="62" x2="22" y2="95" stroke={color} strokeWidth="1.5" opacity="0.8" />
      <line x1="80" y1="62" x2="98" y2="95" stroke={color} strokeWidth="1.5" opacity="0.8" />
      
      {/* Legs */}
      <line x1="48" y1="108" x2="38" y2="155" stroke={color} strokeWidth="1.5" opacity="0.8" />
      <line x1="72" y1="108" x2="82" y2="155" stroke={color} strokeWidth="1.5" opacity="0.8" />
      
      {/* Feet */}
      <line x1="38" y1="155" x2="30" y2="165" stroke={color} strokeWidth="1.5" opacity="0.8" />
      <line x1="82" y1="155" x2="90" y2="165" stroke={color} strokeWidth="1.5" opacity="0.8" />

      {/* Label */}
      {targetType === "humanoid-b" && (
        <text x="60" y="190" textAnchor="middle" fill={color} fontSize="8" opacity="0.5">ARMORED</text>
      )}
      {targetType === "humanoid-c" && (
        <text x="60" y="190" textAnchor="middle" fill={color} fontSize="8" opacity="0.5">MOVING</text>
      )}
      {targetType === "humanoid-d" && (
        <text x="60" y="190" textAnchor="middle" fill={color} fontSize="8" opacity="0.5">PARTIAL</text>
      )}
    </svg>
  );
}

function ConnectionIndicator({ label, connected }: { label: string; connected: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${connected ? "bg-success shadow-[0_0_6px_hsl(var(--success)/0.5)]" : "bg-muted-foreground/30"}`} />
      <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
    </div>
  );
}

function LanePanel({ lane, onTargetChange }: { lane: LaneData; onTargetChange: (type: string) => void }) {
  const isActive = lane.name !== "—";

  return (
    <div className="glass-panel flex flex-col min-w-[280px] w-[280px] shrink-0 overflow-hidden">
      {/* Lane header */}
      <div className="px-3 py-2 border-b border-border/40 flex items-center justify-between" style={{
        background: "hsl(228 25% 13%)",
      }}>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80">
          Lane {lane.id}
        </span>
        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
          isActive
            ? "bg-success/10 text-success border-success/25"
            : "bg-secondary/50 text-muted-foreground border-border/30"
        }`}>
          {isActive ? "ASSIGNED" : "EMPTY"}
        </span>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
        {/* Target silhouette */}
        <div className="rounded-lg border border-border/30 p-2 flex items-center justify-center" style={{
          background: "hsl(228 28% 9%)",
          minHeight: "180px",
        }}>
          <HumanoidTarget targetType={lane.targetType} />
        </div>

        {/* Connection indicators */}
        <div className="flex items-center justify-between px-1">
          {(Object.keys(lane.connections) as (keyof typeof lane.connections)[]).map((key) => (
            <ConnectionIndicator key={key} label={key} connected={lane.connections[key]} />
          ))}
        </div>

        {/* Target selector */}
        <div>
          <label className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1 block">Target Type</label>
          <select
            value={lane.targetType}
            onChange={(e) => onTargetChange(e.target.value)}
            className="sys-input h-8 text-[11px]"
          >
            {TARGET_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Trainee details */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {[
            { label: "Trainee ID", value: lane.traineeId },
            { label: "Name", value: lane.name },
            { label: "Weapon", value: lane.weapon },
            { label: "Practice", value: lane.practice },
            { label: "Rounds", value: lane.rounds },
            { label: "Session State", value: lane.sessionState },
            { label: "Range (mts.)", value: lane.range },
            { label: "Timer (Sec)", value: lane.timer },
          ].map((d) => (
            <div key={d.label}>
              <p className="text-[8px] uppercase tracking-wider text-muted-foreground">{d.label}</p>
              <p className="text-[11px] font-mono text-foreground/80 truncate">{d.value}</p>
            </div>
          ))}
        </div>

        {/* Shot stats */}
        <div className="mt-auto rounded-lg border border-border/30 p-2.5" style={{
          background: "hsl(228 25% 12%)",
        }}>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Shot Summary</p>
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-lg font-mono font-semibold text-success">{lane.shotsFired}</p>
              <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Hits</p>
            </div>
            <div className="w-px h-8 bg-border/40" />
            <div className="text-center flex-1">
              <p className="text-lg font-mono font-semibold text-destructive">{lane.shotsMissed}</p>
              <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Missed</p>
            </div>
            <div className="w-px h-8 bg-border/40" />
            <div className="text-center flex-1">
              <p className="text-lg font-mono font-semibold text-foreground">{lane.shotsFired + lane.shotsMissed}</p>
              <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SessionPage() {
  const [sessionState, setSessionState] = useState<"idle" | "running" | "paused">("idle");
  const [lanes, setLanes] = useState<LaneData[]>([
    createEmptyLane(1),
    createEmptyLane(2),
    createEmptyLane(3),
    createEmptyLane(4),
  ]);

  const handleTargetChange = (laneId: number, type: string) => {
    setLanes((prev) => prev.map((l) => (l.id === laneId ? { ...l, targetType: type } : l)));
  };

  const handleStart = () => {
    if (sessionState === "paused") {
      setSessionState("running");
    } else {
      setSessionState("running");
    }
  };

  const handlePause = () => setSessionState("paused");
  const handleStop = () => setSessionState("idle");

  const btnBase =
    "h-10 px-5 rounded-lg font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 border transition-all duration-150 disabled:opacity-25 disabled:pointer-events-none";

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Top controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          className={`${btnBase} bg-primary/10 border-primary/30 text-primary hover:bg-primary/20`}
        >
          <Settings className="w-3.5 h-3.5" /> Setup
        </button>

        {sessionState === "running" ? (
          <button
            onClick={handlePause}
            className={`${btnBase} bg-warning/10 border-warning/30 text-warning hover:bg-warning/20`}
          >
            <Pause className="w-3.5 h-3.5" /> Pause
          </button>
        ) : (
          <button
            onClick={handleStart}
            className={`${btnBase} bg-success/10 border-success/30 text-success hover:bg-success/20`}
          >
            <Play className="w-3.5 h-3.5" /> Start
          </button>
        )}

        <button
          onClick={handleStop}
          disabled={sessionState === "idle"}
          className={`${btnBase} bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20`}
        >
          <Square className="w-3.5 h-3.5" /> Stop
        </button>

        {/* Session status */}
        <div className="ml-4 flex items-center gap-2">
          <span className={`status-dot ${
            sessionState === "running" ? "status-dot-online" :
            sessionState === "paused" ? "status-dot-warning" :
            "bg-muted-foreground/30"
          }`} />
          <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/60">
            {sessionState === "idle" ? "Standby" : sessionState === "running" ? "Live" : "Paused"}
          </span>
        </div>
      </div>

      {/* Lane panels - horizontal scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 h-full pb-2">
          {lanes.map((lane) => (
            <LanePanel
              key={lane.id}
              lane={lane}
              onTargetChange={(type) => handleTargetChange(lane.id, type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
