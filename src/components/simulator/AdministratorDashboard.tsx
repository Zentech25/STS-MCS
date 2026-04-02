import { useState } from "react";
import { DashboardPanel } from "./DashboardPanel";
import { Users, Settings, Server, Play, Pause, Square, Shield, Trash2 } from "lucide-react";

export function AdministratorDashboard() {
  const [simState, setSimState] = useState<"idle" | "running" | "paused">("idle");

  const users = [
    { name: "SGT. Reeves", role: "Instructor", status: "Online" },
    { name: "CPL. Vasquez", role: "Instructor", status: "Online" },
    { name: "ADMIN. Clarke", role: "Administrator", status: "Online" },
    { name: "ENG. Patel", role: "Engineer", status: "Offline" },
    { name: "PFC. Kim", role: "Instructor", status: "Online" },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 p-4 h-full auto-rows-fr">
      {/* System Overview */}
      <DashboardPanel title="System Overview" className="col-span-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Active Sessions", value: "3", color: "text-sim-green" },
            { label: "Total Users", value: "24", color: "text-primary" },
            { label: "CPU Usage", value: "42%", color: "text-sim-amber" },
            { label: "Uptime", value: "14d 6h", color: "text-foreground" },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded bg-secondary/30 border border-border/30 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={`font-mono text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </DashboardPanel>

      {/* Simulation Controls */}
      <DashboardPanel title="Simulation Control" className="col-span-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`status-dot ${simState === "running" ? "status-dot-online" : simState === "paused" ? "bg-sim-amber status-dot-warning" : "bg-muted-foreground"}`} />
          <span className="text-sm font-mono uppercase tracking-wider">{simState === "idle" ? "Standby" : simState}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSimState("running")} disabled={simState === "running"} className="sim-button flex-1 h-9 rounded-md bg-sim-green/20 border border-sim-green/40 text-sim-green text-xs uppercase tracking-wider disabled:opacity-30 transition-all flex items-center justify-center gap-1.5">
            <Play className="w-3.5 h-3.5" /> Start
          </button>
          <button onClick={() => setSimState("paused")} disabled={simState !== "running"} className="sim-button flex-1 h-9 rounded-md bg-sim-amber/20 border border-sim-amber/40 text-sim-amber text-xs uppercase tracking-wider disabled:opacity-30 transition-all flex items-center justify-center gap-1.5">
            <Pause className="w-3.5 h-3.5" /> Pause
          </button>
          <button onClick={() => setSimState("idle")} disabled={simState === "idle"} className="sim-button flex-1 h-9 rounded-md bg-destructive/20 border border-destructive/40 text-destructive text-xs uppercase tracking-wider disabled:opacity-30 transition-all flex items-center justify-center gap-1.5">
            <Square className="w-3.5 h-3.5" /> End
          </button>
        </div>
      </DashboardPanel>

      {/* System Config */}
      <DashboardPanel title="System Configuration" className="col-span-4">
        <div className="space-y-2">
          {[
            { label: "Render Quality", value: "Ultra" },
            { label: "Physics Engine", value: "Enabled" },
            { label: "Network Mode", value: "LAN" },
            { label: "Logging Level", value: "Verbose" },
          ].map((c) => (
            <div key={c.label} className="flex items-center justify-between p-2 rounded bg-secondary/20 border border-border/20">
              <span className="text-xs text-muted-foreground flex items-center gap-2"><Settings className="w-3 h-3" /> {c.label}</span>
              <span className="text-xs font-mono text-primary">{c.value}</span>
            </div>
          ))}
        </div>
      </DashboardPanel>

      {/* User Management */}
      <DashboardPanel title="User Management" className="col-span-12">
        <div className="overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/30 text-muted-foreground uppercase tracking-wider">
                <th className="text-left py-2 font-medium">Name</th>
                <th className="text-left py-2 font-medium">Role</th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="text-right py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.name} className="border-b border-border/10 hover:bg-secondary/20 transition-colors">
                  <td className="py-2 text-foreground flex items-center gap-2"><Users className="w-3 h-3 text-muted-foreground" /> {u.name}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      u.role === "Administrator" ? "bg-primary/20 text-primary" :
                      u.role === "Engineer" ? "bg-sim-amber/20 text-sim-amber" :
                      "bg-secondary text-secondary-foreground"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className="flex items-center gap-1.5">
                      <span className={`status-dot ${u.status === "Online" ? "status-dot-online" : "status-dot-offline"}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Shield className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardPanel>
    </div>
  );
}
