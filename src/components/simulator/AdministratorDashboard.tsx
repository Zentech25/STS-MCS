import { useState } from "react";
import { DashboardPanel } from "./DashboardPanel";
import { Users, Settings, Play, Pause, Square, Shield, Trash2 } from "lucide-react";

export function AdministratorDashboard() {
  const [simState, setSimState] = useState<"idle" | "running" | "paused">("idle");
  const btnBase = "flex-1 h-9 rounded-xl font-medium text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none";

  const users = [
    { name: "SGT. Reeves", role: "Instructor", status: "Online" },
    { name: "CPL. Vasquez", role: "Instructor", status: "Online" },
    { name: "ADMIN. Clarke", role: "Administrator", status: "Online" },
    { name: "ENG. Patel", role: "Engineer", status: "Offline" },
    { name: "PFC. Kim", role: "Instructor", status: "Online" },
  ];

  const stats = [
    { label: "Active Sessions", value: "3", color: "text-success" },
    { label: "Total Users", value: "24", color: "text-primary" },
    { label: "CPU Usage", value: "42%", color: "text-warning" },
    { label: "Uptime", value: "14d 6h", color: "text-foreground" },
  ];

  return (
    <div className="grid grid-cols-12 gap-5 p-5 h-full auto-rows-fr">
      <DashboardPanel title="System Overview" className="col-span-4" glow>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="p-3 rounded-xl text-center hover-lift" style={{
              background: "rgba(255,255,255,0.4)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={`font-mono text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Simulation Control" className="col-span-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`status-dot ${simState === "running" ? "status-dot-online" : simState === "paused" ? "status-dot-warning" : "bg-muted-foreground/30"}`} />
          <span className="text-sm font-mono uppercase tracking-wider text-muted-foreground">{simState === "idle" ? "Standby" : simState}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSimState("running")} disabled={simState === "running"} className={`${btnBase} glass-btn text-success hover:scale-[1.02] active:scale-[0.98]`}><Play className="w-3.5 h-3.5" /> Start</button>
          <button onClick={() => setSimState("paused")} disabled={simState !== "running"} className={`${btnBase} glass-btn text-warning hover:scale-[1.02] active:scale-[0.98]`}><Pause className="w-3.5 h-3.5" /> Pause</button>
          <button onClick={() => setSimState("idle")} disabled={simState === "idle"} className={`${btnBase} glass-btn text-destructive hover:scale-[1.02] active:scale-[0.98]`}><Square className="w-3.5 h-3.5" /> End</button>
        </div>
      </DashboardPanel>

      <DashboardPanel title="System Configuration" className="col-span-4">
        <div className="space-y-1.5">
          {[
            { label: "Render Quality", value: "Ultra" },
            { label: "Physics Engine", value: "Enabled" },
            { label: "Network Mode", value: "LAN" },
            { label: "Logging Level", value: "Verbose" },
          ].map((c) => (
            <div key={c.label} className="flex items-center justify-between p-2.5 rounded-xl interactive-row" style={{
              background: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <span className="text-[11px] text-muted-foreground flex items-center gap-2"><Settings className="w-3 h-3" /> {c.label}</span>
              <span className="text-[11px] font-mono text-primary font-medium">{c.value}</span>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="User Management" className="col-span-12">
        <table className="w-full text-[11px]">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }} className="text-muted-foreground uppercase tracking-wider">
              <th className="text-left py-2 font-medium">Name</th>
              <th className="text-left py-2 font-medium">Role</th>
              <th className="text-left py-2 font-medium">Status</th>
              <th className="text-right py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.name} className="interactive-row" style={{ borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
                <td className="py-2.5 text-foreground flex items-center gap-2"><Users className="w-3 h-3 text-muted-foreground" /> {u.name}</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-medium ${
                    u.role === "Administrator" ? "bg-primary/10 text-primary" :
                    u.role === "Engineer" ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground"
                  }`}>{u.role}</span>
                </td>
                <td className="py-2.5">
                  <span className="flex items-center gap-1.5">
                    <span className={`status-dot ${u.status === "Online" ? "status-dot-online" : "status-dot-offline"}`} />
                    <span className="text-muted-foreground">{u.status}</span>
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded-xl text-muted-foreground glass-btn hover:text-primary transition-all duration-200"><Shield className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-xl text-muted-foreground glass-btn hover:text-destructive transition-all duration-200"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardPanel>
    </div>
  );
}
