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

  return (
    <div className="grid grid-cols-12 gap-4 p-4 h-full auto-rows-fr">
      {/* Simulation Controls */}
      <DashboardPanel title="Simulation Control" className="col-span-4 row-span-1">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-2">
            <span className={`status-dot ${simState === "running" ? "status-dot-online" : simState === "paused" ? "bg-sim-amber status-dot-warning" : "bg-muted-foreground"}`} />
            <span className="text-sm font-mono uppercase tracking-wider text-foreground">
              {simState === "idle" ? "Standby" : simState === "running" ? "Running" : "Paused"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSimState("running")}
              disabled={simState === "running"}
              className="sim-button flex-1 h-10 rounded-md bg-sim-green/20 border border-sim-green/40 text-sim-green font-semibold text-xs uppercase tracking-wider hover:bg-sim-green/30 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Start
            </button>
            <button
              onClick={() => setSimState("paused")}
              disabled={simState !== "running"}
              className="sim-button flex-1 h-10 rounded-md bg-sim-amber/20 border border-sim-amber/40 text-sim-amber font-semibold text-xs uppercase tracking-wider hover:bg-sim-amber/30 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              <Pause className="w-4 h-4" /> Pause
            </button>
            <button
              onClick={() => setSimState("idle")}
              disabled={simState === "idle"}
              className="sim-button flex-1 h-10 rounded-md bg-destructive/20 border border-destructive/40 text-destructive font-semibold text-xs uppercase tracking-wider hover:bg-destructive/30 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4" /> End
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="p-2 rounded bg-secondary/30 border border-border/30">
              <p className="text-[10px] text-muted-foreground uppercase">Duration</p>
              <p className="font-mono text-sm text-foreground">00:42:18</p>
            </div>
            <div className="p-2 rounded bg-secondary/30 border border-border/30">
              <p className="text-[10px] text-muted-foreground uppercase">Scenario</p>
              <p className="font-mono text-sm text-foreground">Urban Ops</p>
            </div>
          </div>
        </div>
      </DashboardPanel>

      {/* Performance Metrics */}
      <DashboardPanel title="Performance Metrics" className="col-span-4 row-span-1">
        <div className="space-y-3">
          {[
            { label: "Accuracy", value: 87, icon: <Target className="w-4 h-4" /> },
            { label: "Response Time", value: 72, icon: <Activity className="w-4 h-4" /> },
            { label: "Tactical Score", value: 91, icon: <BarChart3 className="w-4 h-4" /> },
          ].map((m) => (
            <div key={m.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">{m.icon} {m.label}</span>
                <span className="font-mono text-foreground">{m.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary/50">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${m.value}%`, boxShadow: "0 0 8px hsl(193 100% 50% / 0.4)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>

      {/* Trainee Overview */}
      <DashboardPanel title="Trainee Status" className="col-span-4 row-span-1">
        <div className="space-y-2">
          {trainees.map((t) => (
            <div key={t.name} className="flex items-center justify-between p-2 rounded bg-secondary/20 border border-border/20">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">{t.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground">{t.scenario}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  t.status === "Active" ? "bg-sim-green/20 text-sim-green" :
                  t.status === "Paused" ? "bg-sim-amber/20 text-sim-amber" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {t.status}
                </span>
                {t.score > 0 && <span className="font-mono text-xs text-primary">{t.score}</span>}
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>

      {/* Locked panels */}
      <DashboardPanel title="User Management" locked className="col-span-6">
        <p className="text-xs text-muted-foreground">Administrator access required</p>
      </DashboardPanel>
      <DashboardPanel title="Hardware Diagnostics" locked className="col-span-6">
        <p className="text-xs text-muted-foreground">Service Engineer access required</p>
      </DashboardPanel>
    </div>
  );
}
