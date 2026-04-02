import { useState } from "react";
import { DashboardPanel } from "./DashboardPanel";
import { Play, Pause, Square, Users, Activity, Target, BarChart3 } from "lucide-react";

export function InstructorDashboard() {
  const [simState, setSimState] = useState<"idle" | "running" | "paused">("idle");

  const trainees = [
    { name: "SGT. Reeves", status: "Active", score: 94, scenario: "Urban Ops" },
    { name: "CPL. Vasquez", status: "Active", score: 87, scenario: "Recon" },
    { name: "PFC. Kim", status: "Paused", score: 72, scenario: "Convoy" },
    { name: "PVT. Okafor", status: "Standby", score: 0, scenario: "—" },
  ];

  const btnBase = "flex-1 h-9 rounded-xl font-medium text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none";

  return (
    <div className="grid grid-cols-12 gap-5 p-5 h-full auto-rows-fr">
      <DashboardPanel title="Simulation Control" className="col-span-4" glow>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <span className={`status-dot ${simState === "running" ? "status-dot-online" : simState === "paused" ? "status-dot-warning" : "bg-muted-foreground/30"}`} />
            <span className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              {simState === "idle" ? "Standby" : simState === "running" ? "Running" : "Paused"}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSimState("running")} disabled={simState === "running"} className={`${btnBase} glass-btn text-success hover:scale-[1.02] active:scale-[0.98]`}>
              <Play className="w-3.5 h-3.5" /> Start
            </button>
            <button onClick={() => setSimState("paused")} disabled={simState !== "running"} className={`${btnBase} glass-btn text-warning hover:scale-[1.02] active:scale-[0.98]`}>
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
            <button onClick={() => setSimState("idle")} disabled={simState === "idle"} className={`${btnBase} glass-btn text-destructive hover:scale-[1.02] active:scale-[0.98]`}>
              <Square className="w-3.5 h-3.5" /> End
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="p-3 rounded-xl" style={{
              background: "rgba(255,255,255,0.4)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Duration</p>
              <p className="font-mono text-sm text-foreground mt-0.5">00:42:18</p>
            </div>
            <div className="p-3 rounded-xl" style={{
              background: "rgba(255,255,255,0.4)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Scenario</p>
              <p className="font-mono text-sm text-foreground mt-0.5">Urban Ops</p>
            </div>
          </div>
        </div>
      </DashboardPanel>

      <DashboardPanel title="Performance Metrics" className="col-span-4">
        <div className="space-y-4">
          {[
            { label: "Accuracy", value: 87, icon: <Target className="w-3.5 h-3.5" />, color: "hsl(217 91% 60%)" },
            { label: "Response Time", value: 72, icon: <Activity className="w-3.5 h-3.5" />, color: "hsl(38 92% 50%)" },
            { label: "Tactical Score", value: 91, icon: <BarChart3 className="w-3.5 h-3.5" />, color: "hsl(152 69% 41%)" },
          ].map((m) => (
            <div key={m.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-muted-foreground">{m.icon} {m.label}</span>
                <span className="font-mono text-foreground font-medium">{m.value}%</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{
                background: "rgba(0,0,0,0.06)",
              }}>
                <div
                  className="h-full rounded-full progress-bar transition-all duration-700"
                  style={{
                    width: `${m.value}%`,
                    background: m.color,
                    boxShadow: `0 1px 6px ${m.color}40`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Trainee Status" className="col-span-4">
        <div className="space-y-1.5">
          {trainees.map((t) => (
            <div key={t.name} className="flex items-center justify-between p-2.5 rounded-xl interactive-row" style={{
              background: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium text-foreground">{t.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground font-mono">{t.scenario}</span>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-lg font-medium ${
                  t.status === "Active" ? "bg-success/10 text-success" :
                  t.status === "Paused" ? "bg-warning/10 text-warning" :
                  "bg-muted text-muted-foreground"
                }`}>{t.status}</span>
                {t.score > 0 && <span className="font-mono text-[11px] text-primary w-6 text-right font-semibold">{t.score}</span>}
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>
    </div>
  );
}
