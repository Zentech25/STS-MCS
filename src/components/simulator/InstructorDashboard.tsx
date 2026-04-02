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
    <div className="grid grid-cols-12 gap-3 p-4 h-full auto-rows-fr">
      <DashboardPanel title="Simulation Control" className="col-span-4 row-span-1">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <span className={`status-dot ${simState === "running" ? "status-dot-online" : simState === "paused" ? "status-dot-warning" : "bg-muted-foreground/40"}`} />
            <span className="text-sm font-mono uppercase tracking-wider text-foreground/80">
              {simState === "idle" ? "Standby" : simState === "running" ? "Running" : "Paused"}
            </span>
          </div>
          <div className="flex gap-2">
            {[
              { label: "Start", icon: <Play className="w-3.5 h-3.5" />, action: () => setSimState("running"), disabled: simState === "running", color: "sim-green" },
              { label: "Pause", icon: <Pause className="w-3.5 h-3.5" />, action: () => setSimState("paused"), disabled: simState !== "running", color: "sim-amber" },
              { label: "End", icon: <Square className="w-3.5 h-3.5" />, action: () => setSimState("idle"), disabled: simState === "idle", color: "destructive" },
            ].map((b) => (
              <button
                key={b.label}
                onClick={b.action}
                disabled={b.disabled}
                className={`sim-button flex-1 h-9 rounded-lg bg-${b.color}/10 border border-${b.color}/30 text-${b.color} font-medium text-[11px] uppercase tracking-wider hover:bg-${b.color}/20 disabled:opacity-25 disabled:pointer-events-none transition-all flex items-center justify-center gap-1.5`}
              >
                {b.icon} {b.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/20">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Duration</p>
              <p className="font-mono text-sm text-foreground/80 mt-0.5">00:42:18</p>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/20">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Scenario</p>
              <p className="font-mono text-sm text-foreground/80 mt-0.5">Urban Ops</p>
            </div>
          </div>
        </div>
      </DashboardPanel>

      <DashboardPanel title="Performance Metrics" className="col-span-4 row-span-1">
        <div className="space-y-4">
          {[
            { label: "Accuracy", value: 87, icon: <Target className="w-3.5 h-3.5" /> },
            { label: "Response Time", value: 72, icon: <Activity className="w-3.5 h-3.5" /> },
            { label: "Tactical Score", value: 91, icon: <BarChart3 className="w-3.5 h-3.5" /> },
          ].map((m) => (
            <div key={m.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-muted-foreground">{m.icon} {m.label}</span>
                <span className="font-mono text-foreground/80">{m.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${m.value}%`,
                    background: "linear-gradient(90deg, hsl(170 100% 50%), hsl(170 80% 40%))",
                    boxShadow: "0 0 10px hsl(170 100% 50% / 0.3)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Trainee Status" className="col-span-4 row-span-1">
        <div className="space-y-1.5">
          {trainees.map((t) => (
            <div key={t.name} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/20 border border-border/15 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-muted-foreground/60" />
                <span className="text-[11px] font-medium text-foreground/80">{t.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground/60 font-mono">{t.scenario}</span>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-medium ${
                  t.status === "Active" ? "bg-sim-green/10 text-sim-green border border-sim-green/20" :
                  t.status === "Paused" ? "bg-sim-amber/10 text-sim-amber border border-sim-amber/20" :
                  "bg-secondary/50 text-muted-foreground border border-border/20"
                }`}>
                  {t.status}
                </span>
                {t.score > 0 && <span className="font-mono text-[11px] text-primary/70 w-6 text-right">{t.score}</span>}
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="User Management" locked className="col-span-6">
        <p className="text-xs text-muted-foreground/40">Administrator access required</p>
      </DashboardPanel>
      <DashboardPanel title="Hardware Diagnostics" locked className="col-span-6">
        <p className="text-xs text-muted-foreground/40">Service Engineer access required</p>
      </DashboardPanel>
    </div>
  );
}
