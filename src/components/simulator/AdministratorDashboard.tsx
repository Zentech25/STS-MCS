import { useState } from "react";
import { DashboardPanel } from "./DashboardPanel";
import { Users, Settings, Play, Pause, Square, Shield, Trash2 } from "lucide-react";

export function AdministratorDashboard() {
  const [simState, setSimState] = useState<"idle" | "running" | "paused">("idle");
  const btnBase = "flex-1 h-9 rounded-sm font-medium text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-colors duration-100 disabled:opacity-25 disabled:pointer-events-none";

  const users = [
    { name: "SGT. Reeves", role: "Instructor", status: "Online" },
    { name: "CPL. Vasquez", role: "Instructor", status: "Online" },
    { name: "ADMIN. Clarke", role: "Administrator", status: "Online" },
    { name: "ENG. Patel", role: "Engineer", status: "Offline" },
    { name: "PFC. Kim", role: "Instructor", status: "Online" },
  ];

  return (
    <div className="grid grid-cols-12 gap-3 p-3 h-full auto-rows-fr">
      <DashboardPanel title="System Overview" className="col-span-4">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Active Sessions", value: "3", color: "text-success" },
            { label: "Total Users", value: "24", color: "text-primary" },
            { label: "CPU Usage", value: "42%", color: "text-warning" },
            { label: "Uptime", value: "14d 6h", color: "text-foreground" },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-sm bg-muted border border-border text-center">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={`font-mono text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Simulation Control" className="col-span-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`status-dot ${simState === "running" ? "status-dot-online" : simState === "paused" ? "status-dot-warning" : "bg-muted-foreground/30"}`} />
          <span className="text-sm font-mono uppercase tracking-wider text-foreground/70">{simState === "idle" ? "Standby" : simState}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSimState("running")} disabled={simState === "running"} className={`${btnBase} bg-success/10 border-success/30 text-success hover:bg-success/20`}><Play className="w-3.5 h-3.5" /> Start</button>
          <button onClick={() => setSimState("paused")} disabled={simState !== "running"} className={`${btnBase} bg-warning/10 border-warning/30 text-warning hover:bg-warning/20`}><Pause className="w-3.5 h-3.5" /> Pause</button>
          <button onClick={() => setSimState("idle")} disabled={simState === "idle"} className={`${btnBase} bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20`}><Square className="w-3.5 h-3.5" /> End</button>
        </div>
      </DashboardPanel>

      <DashboardPanel title="System Configuration" className="col-span-4">
        <div className="space-y-1">
          {[
            { label: "Render Quality", value: "Ultra" },
            { label: "Physics Engine", value: "Enabled" },
            { label: "Network Mode", value: "LAN" },
            { label: "Logging Level", value: "Verbose" },
          ].map((c) => (
            <div key={c.label} className="flex items-center justify-between p-2.5 rounded-sm bg-muted/50 border border-border/50">
              <span className="text-[11px] text-muted-foreground flex items-center gap-2"><Settings className="w-3 h-3" /> {c.label}</span>
              <span className="text-[11px] font-mono text-primary">{c.value}</span>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="User Management" className="col-span-12">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border text-muted-foreground uppercase tracking-wider">
              <th className="text-left py-2 font-medium">Name</th>
              <th className="text-left py-2 font-medium">Role</th>
              <th className="text-left py-2 font-medium">Status</th>
              <th className="text-right py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.name} className="border-b border-border/30 hover:bg-muted/30 transition-colors duration-100">
                <td className="py-2.5 text-foreground flex items-center gap-2"><Users className="w-3 h-3 text-muted-foreground" /> {u.name}</td>
                <td className="py-2.5">
                  <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-medium border ${
                    u.role === "Administrator" ? "bg-primary/10 text-primary border-primary/25" :
                    u.role === "Engineer" ? "bg-warning/10 text-warning border-warning/25" :
                    "bg-muted text-secondary-foreground border-border"
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
                    <button className="p-1.5 rounded-sm hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors duration-100"><Shield className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-sm hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors duration-100"><Trash2 className="w-3.5 h-3.5" /></button>
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
