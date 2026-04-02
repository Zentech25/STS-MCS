import { useState } from "react";
import { DashboardPanel } from "./DashboardPanel";
import { Users, Settings, Play, Pause, Square, Shield, Trash2 } from "lucide-react";

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
    <div className="grid grid-cols-12 gap-3 p-4 h-full auto-rows-fr">
      <DashboardPanel title="System Overview" className="col-span-4">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Active Sessions", value: "3", color: "text-sim-green" },
            { label: "Total Users", value: "24", color: "text-primary" },
            { label: "CPU Usage", value: "42%", color: "text-sim-amber" },
            { label: "Uptime", value: "14d 6h", color: "text-foreground/70" },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-lg bg-secondary/30 border border-border/20 text-center">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={`font-mono text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Simulation Control" className="col-span-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`status-dot ${simState === "running" ? "status-dot-online" : simState === "paused" ? "status-dot-warning" : "bg-muted-foreground/40"}`} />
          <span className="text-sm font-mono uppercase tracking-wider text-foreground/70">{simState === "idle" ? "Standby" : simState}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSimState("running")} disabled={simState === "running"} className="sim-button flex-1 h-9 rounded-lg bg-sim-green/10 border border-sim-green/30 text-sim-green text-[11px] uppercase tracking-wider disabled:opacity-25 transition-all flex items-center justify-center gap-1.5"><Play className="w-3.5 h-3.5" /> Start</button>
          <button onClick={() => setSimState("paused")} disabled={simState !== "running"} className="sim-button flex-1 h-9 rounded-lg bg-sim-amber/10 border border-sim-amber/30 text-sim-amber text-[11px] uppercase tracking-wider disabled:opacity-25 transition-all flex items-center justify-center gap-1.5"><Pause className="w-3.5 h-3.5" /> Pause</button>
          <button onClick={() => setSimState("idle")} disabled={simState === "idle"} className="sim-button flex-1 h-9 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-[11px] uppercase tracking-wider disabled:opacity-25 transition-all flex items-center justify-center gap-1.5"><Square className="w-3.5 h-3.5" /> End</button>
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
            <div key={c.label} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/20 border border-border/15">
              <span className="text-[11px] text-muted-foreground flex items-center gap-2"><Settings className="w-3 h-3" /> {c.label}</span>
              <span className="text-[11px] font-mono text-primary/70">{c.value}</span>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="User Management" className="col-span-12">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border/20 text-muted-foreground uppercase tracking-wider">
              <th className="text-left py-2 font-medium">Name</th>
              <th className="text-left py-2 font-medium">Role</th>
              <th className="text-left py-2 font-medium">Status</th>
              <th className="text-right py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.name} className="border-b border-border/8 hover:bg-secondary/15 transition-colors">
                <td className="py-2.5 text-foreground/80 flex items-center gap-2"><Users className="w-3 h-3 text-muted-foreground/50" /> {u.name}</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-medium border ${
                    u.role === "Administrator" ? "bg-primary/10 text-primary border-primary/20" :
                    u.role === "Engineer" ? "bg-sim-amber/10 text-sim-amber border-sim-amber/20" :
                    "bg-secondary/50 text-secondary-foreground/70 border-border/20"
                  }`}>{u.role}</span>
                </td>
                <td className="py-2.5">
                  <span className="flex items-center gap-1.5">
                    <span className={`status-dot ${u.status === "Online" ? "status-dot-online" : "status-dot-offline"}`} />
                    <span className="text-muted-foreground/60">{u.status}</span>
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground/40 hover:text-primary transition-colors"><Shield className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
