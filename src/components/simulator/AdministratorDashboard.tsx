import { useState } from "react";
import { DashboardPanel } from "./DashboardPanel";
import { Users, Settings, Play, Pause, Square, Shield, Trash2, TrendingUp, Server, Clock, Zap } from "lucide-react";

export function AdministratorDashboard() {
  const [simState, setSimState] = useState<"idle" | "running" | "paused">("idle");
  const btnBase = "flex-1 h-10 rounded-xl font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none";

  const users = [
    { name: "SGT. Reeves", role: "Instructor", status: "Online" },
    { name: "CPL. Vasquez", role: "Instructor", status: "Online" },
    { name: "ADMIN. Clarke", role: "Administrator", status: "Online" },
    { name: "ENG. Patel", role: "Engineer", status: "Offline" },
    { name: "PFC. Kim", role: "Instructor", status: "Online" },
  ];

  const stats = [
    { label: "Active Sessions", value: "3", icon: <Zap className="w-4 h-4" />, gradient: "var(--gradient-primary)" },
    { label: "Total Users", value: "24", icon: <Users className="w-4 h-4" />, gradient: "var(--gradient-cool)" },
    { label: "CPU Usage", value: "42%", icon: <Server className="w-4 h-4" />, gradient: "var(--gradient-warm)" },
    { label: "Uptime", value: "14d 6h", icon: <Clock className="w-4 h-4" />, gradient: "linear-gradient(135deg, hsl(160 72% 42%), hsl(190 80% 45%))" },
  ];

  return (
    <div className="grid grid-cols-12 gap-5 p-5 h-full auto-rows-fr">
      <div className="col-span-12 grid grid-cols-4 gap-4 stagger-children">
        {stats.map((s) => (
          <div key={s.label} className="glass-panel p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0" style={{
              background: s.gradient,
              boxShadow: "0 4px 14px hsl(230 80% 60% / 0.2)",
            }}>
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{s.label}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <DashboardPanel title="Simulation Control" className="col-span-4" glow>
        <div className="flex items-center gap-2 mb-3">
          <span className={`status-dot ${simState === "running" ? "status-dot-online" : simState === "paused" ? "status-dot-warning" : "bg-muted-foreground/30"}`} />
          <span className="text-sm font-mono uppercase tracking-wider text-muted-foreground">{simState === "idle" ? "Standby" : simState}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSimState("running")} disabled={simState === "running"} className={`${btnBase} glass-btn text-success hover:scale-[1.03] active:scale-[0.97]`}><Play className="w-3.5 h-3.5" /> Start</button>
          <button onClick={() => setSimState("paused")} disabled={simState !== "running"} className={`${btnBase} glass-btn text-warning hover:scale-[1.03] active:scale-[0.97]`}><Pause className="w-3.5 h-3.5" /> Pause</button>
          <button onClick={() => setSimState("idle")} disabled={simState === "idle"} className={`${btnBase} glass-btn text-destructive hover:scale-[1.03] active:scale-[0.97]`}><Square className="w-3.5 h-3.5" /> End</button>
        </div>
      </DashboardPanel>

      <DashboardPanel title="System Configuration" className="col-span-8">
        <div className="grid grid-cols-2 gap-2 stagger-children">
          {[
            { label: "Render Quality", value: "Ultra" },
            { label: "Physics Engine", value: "Enabled" },
            { label: "Network Mode", value: "LAN" },
            { label: "Logging Level", value: "Verbose" },
          ].map((c) => (
            <div key={c.label} className="flex items-center justify-between p-3 rounded-xl interactive-row" style={{
              background: "var(--surface-elevated)",
              border: "1px solid var(--divider)",
            }}>
              <span className="text-[11px] text-muted-foreground flex items-center gap-2 font-medium"><Settings className="w-3.5 h-3.5" /> {c.label}</span>
              <span className="text-[11px] font-mono text-primary font-bold">{c.value}</span>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="User Management" className="col-span-12">
        <table className="w-full text-[11px]">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--divider)" }} className="text-muted-foreground uppercase tracking-wider">
              <th className="text-left py-2.5 font-semibold">Name</th>
              <th className="text-left py-2.5 font-semibold">Role</th>
              <th className="text-left py-2.5 font-semibold">Status</th>
              <th className="text-right py-2.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="stagger-children">
            {users.map((u) => (
              <tr key={u.name} className="interactive-row" style={{ borderBottom: "1px solid var(--divider)" }}>
                <td className="py-3 text-foreground font-medium flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--surface-inset)" }}>
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  {u.name}
                </td>
                <td className="py-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold ${
                    u.role === "Administrator" ? "bg-primary/10 text-primary" :
                    u.role === "Engineer" ? "bg-warning/10 text-warning" :
                    "text-muted-foreground"
                  }`} style={u.role === "Instructor" ? { background: "var(--surface-inset)" } : undefined}>{u.role}</span>
                </td>
                <td className="py-3">
                  <span className="flex items-center gap-1.5">
                    <span className={`status-dot ${u.status === "Online" ? "status-dot-online" : "status-dot-offline"}`} />
                    <span className="text-muted-foreground font-medium">{u.status}</span>
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 rounded-xl text-muted-foreground glass-btn hover:text-primary"><Shield className="w-3.5 h-3.5" /></button>
                    <button className="p-2 rounded-xl text-muted-foreground glass-btn hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
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
