import { useState } from "react";
import { DashboardPanel } from "./DashboardPanel";
import { Play, Pause, Square, Users, Activity, Target, BarChart3, TrendingUp } from "lucide-react";

export function InstructorDashboard() {
  const [simState, setSimState] = useState<"idle" | "running" | "paused">("idle");

  const trainees = [
    { name: "SGT. Reeves", status: "Active", score: 94, scenario: "Urban Ops" },
    { name: "CPL. Vasquez", status: "Active", score: 87, scenario: "Recon" },
    { name: "PFC. Kim", status: "Paused", score: 72, scenario: "Convoy" },
    { name: "PVT. Okafor", status: "Standby", score: 0, scenario: "—" },
  ];

  const btnBase = "flex-1 h-10 rounded-xl font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none";

  return (
    <div className="grid grid-cols-12 gap-5 p-5 h-full auto-rows-fr">
      {/* Stats row */}
      <div className="col-span-12 grid grid-cols-4 gap-4 stagger-children">
        {[
          { label: "Active Trainees", value: "3", change: "+1", icon: <Users className="w-4 h-4" />, gradient: "var(--gradient-primary)" },
          { label: "Avg. Accuracy", value: "84%", change: "+2.1%", icon: <Target className="w-4 h-4" />, gradient: "var(--gradient-cool)" },
          { label: "Sessions Today", value: "7", change: "+3", icon: <Activity className="w-4 h-4" />, gradient: "var(--gradient-warm)" },
          { label: "Tactical Score", value: "91", change: "+5", icon: <TrendingUp className="w-4 h-4" />, gradient: "linear-gradient(135deg, hsl(160 72% 42%), hsl(190 80% 45%))" },
        ].map((s) => (
          <div key={s.label} className="glass-panel p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0" style={{
              background: s.gradient,
              boxShadow: "0 4px 14px hsl(230 80% 60% / 0.2)",
            }}>
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{s.label}</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <span className="text-[10px] font-mono text-success font-semibold">{s.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DashboardPanel title="Simulation Control" className="col-span-4" glow>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <span className={`status-dot ${simState === "running" ? "status-dot-online" : simState === "paused" ? "status-dot-warning" : "bg-muted-foreground/30"}`} />
            <span className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              {simState === "idle" ? "Standby" : simState === "running" ? "Running" : "Paused"}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSimState("running")} disabled={simState === "running"} className={`${btnBase} glass-btn text-success hover:scale-[1.03] active:scale-[0.97]`}>
              <Play className="w-3.5 h-3.5" /> Start
            </button>
            <button onClick={() => setSimState("paused")} disabled={simState !== "running"} className={`${btnBase} glass-btn text-warning hover:scale-[1.03] active:scale-[0.97]`}>
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
            <button onClick={() => setSimState("idle")} disabled={simState === "idle"} className={`${btnBase} glass-btn text-destructive hover:scale-[1.03] active:scale-[0.97]`}>
              <Square className="w-3.5 h-3.5" /> End
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="p-3 rounded-xl" style={{ background: "var(--surface-elevated)", border: "1px solid var(--divider)" }}>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Duration</p>
              <p className="font-mono text-sm text-foreground mt-0.5 font-semibold">00:42:18</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: "var(--surface-elevated)", border: "1px solid var(--divider)" }}>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Scenario</p>
              <p className="font-mono text-sm text-foreground mt-0.5 font-semibold">Urban Ops</p>
            </div>
          </div>
        </div>
      </DashboardPanel>

      <DashboardPanel title="Performance Metrics" className="col-span-4">
        <div className="space-y-4">
          {[
            { label: "Accuracy", value: 87, icon: <Target className="w-3.5 h-3.5" />, gradient: "var(--gradient-primary)" },
            { label: "Response Time", value: 72, icon: <Activity className="w-3.5 h-3.5" />, gradient: "var(--gradient-warm)" },
            { label: "Tactical Score", value: 91, icon: <BarChart3 className="w-3.5 h-3.5" />, gradient: "var(--gradient-cool)" },
          ].map((m) => (
            <div key={m.label} className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-muted-foreground font-medium">{m.icon} {m.label}</span>
                <span className="font-mono text-foreground font-bold">{m.value}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--surface-inset)" }}>
                <div className="h-full rounded-full progress-bar transition-all duration-700" style={{
                  width: `${m.value}%`,
                  background: m.gradient,
                  boxShadow: "0 2px 8px hsl(230 80% 60% / 0.2)",
                }} />
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Trainee Status" className="col-span-4">
        <div className="space-y-2 stagger-children">
          {trainees.map((t) => (
            <div key={t.name} className="flex items-center justify-between p-3 rounded-xl interactive-row" style={{
              background: "var(--surface-elevated)",
              border: "1px solid var(--divider)",
            }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground" style={{ background: "var(--surface-inset)" }}>
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-semibold text-foreground">{t.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground font-mono">{t.scenario}</span>
                <span className={`text-[9px] font-mono px-2.5 py-1 rounded-lg font-bold ${
                  t.status === "Active" ? "bg-success/10 text-success" :
                  t.status === "Paused" ? "bg-warning/10 text-warning" :
                  "text-muted-foreground"
                }`} style={t.status === "Standby" ? { background: "var(--surface-inset)" } : undefined}>{t.status}</span>
                {t.score > 0 && <span className="font-mono text-[12px] font-bold gradient-text w-7 text-right">{t.score}</span>}
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>
    </div>
  );
}
