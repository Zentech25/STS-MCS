import { DashboardPanel } from "./DashboardPanel";
import { Cpu, Thermometer, AlertTriangle, CheckCircle, XCircle, HardDrive, Wifi, MemoryStick } from "lucide-react";

export function EngineerDashboard() {
  const hardware = [
    { name: "GPU Cluster A", status: "ok", temp: 62, load: 45 },
    { name: "GPU Cluster B", status: "warning", temp: 78, load: 89 },
    { name: "Motion Platform", status: "ok", temp: 34, load: 12 },
    { name: "Display Array", status: "ok", temp: 41, load: 55 },
    { name: "Audio System", status: "error", temp: 0, load: 0 },
  ];

  const logs = [
    { time: "14:32:18", level: "ERROR", msg: "Audio subsystem: Device not responding" },
    { time: "14:30:05", level: "WARN", msg: "GPU-B temperature exceeding threshold (78°C)" },
    { time: "14:28:41", level: "INFO", msg: "Motion platform calibration complete" },
    { time: "14:25:12", level: "WARN", msg: "Network latency spike detected: 142ms" },
    { time: "14:20:00", level: "INFO", msg: "System health check passed (4/5 modules)" },
    { time: "14:15:33", level: "INFO", msg: "Display array sync verified" },
  ];

  const healthMetrics = [
    { label: "CPU", value: 38, gradient: "var(--gradient-cool)" },
    { label: "Memory", value: 64, gradient: "var(--gradient-warm)" },
    { label: "Disk I/O", value: 22, gradient: "var(--gradient-primary)" },
    { label: "Network", value: 15, gradient: "linear-gradient(135deg, hsl(160 72% 42%), hsl(190 80% 45%))" },
  ];

  return (
    <div className="grid grid-cols-12 gap-5 p-5 h-full auto-rows-fr">
      {/* Top stats */}
      <div className="col-span-12 grid grid-cols-4 gap-4 stagger-children">
        {[
          { label: "Hardware Online", value: "4/5", icon: <HardDrive className="w-4 h-4" />, gradient: "var(--gradient-primary)" },
          { label: "Avg Temp", value: "54°C", icon: <Thermometer className="w-4 h-4" />, gradient: "var(--gradient-warm)" },
          { label: "CPU Load", value: "38%", icon: <Cpu className="w-4 h-4" />, gradient: "var(--gradient-cool)" },
          { label: "Network", value: "12ms", icon: <Wifi className="w-4 h-4" />, gradient: "linear-gradient(135deg, hsl(160 72% 42%), hsl(190 80% 45%))" },
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
              <p className="text-xl font-bold text-foreground mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <DashboardPanel title="Hardware Diagnostics" className="col-span-5" glow>
        <div className="space-y-2 stagger-children">
          {hardware.map((h) => (
            <div key={h.name} className={`flex items-center justify-between p-3 rounded-xl interactive-row`} style={{
              background: h.status === "error" ? "hsl(var(--destructive) / 0.06)" :
                          h.status === "warning" ? "hsl(var(--warning) / 0.06)" :
                          "var(--surface-elevated)",
              border: `1px solid ${h.status === "error" ? "hsl(var(--destructive) / 0.12)" :
                                    h.status === "warning" ? "hsl(var(--warning) / 0.12)" :
                                    "var(--divider)"}`,
            }}>
              <div className="flex items-center gap-2.5">
                {h.status === "ok" ? <CheckCircle className="w-4 h-4 text-success" /> :
                 h.status === "warning" ? <AlertTriangle className="w-4 h-4 text-warning" /> :
                 <XCircle className="w-4 h-4 text-destructive" />}
                <span className="text-[11px] font-semibold text-foreground">{h.name}</span>
              </div>
              {h.status !== "error" ? (
                <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> {h.temp}°C</span>
                  <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {h.load}%</span>
                </div>
              ) : (
                <span className="text-[10px] font-mono text-destructive font-bold">OFFLINE</span>
              )}
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="System Health" className="col-span-3">
        <div className="space-y-4">
          {healthMetrics.map((m) => (
            <div key={m.label} className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-muted-foreground font-medium">
                  <Cpu className="w-3.5 h-3.5" /> {m.label}
                </span>
                <span className="font-mono text-foreground font-bold">{m.value}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--surface-inset)" }}>
                <div className="h-full rounded-full progress-bar transition-all duration-700" style={{
                  width: `${m.value}%`,
                  background: m.gradient,
                  boxShadow: "0 2px 8px hsl(230 80% 60% / 0.15)",
                }} />
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Event Log" className="col-span-4">
        <div className="space-y-1 stagger-children">
          {logs.map((l, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl interactive-row">
              <span className="font-mono text-[9px] text-muted-foreground shrink-0 mt-0.5">{l.time}</span>
              <span className={`text-[9px] font-mono font-bold shrink-0 w-10 mt-0.5 ${
                l.level === "ERROR" ? "text-destructive" :
                l.level === "WARN" ? "text-warning" :
                "text-muted-foreground"
              }`}>{l.level}</span>
              <span className="text-[11px] text-foreground/70 leading-tight">{l.msg}</span>
            </div>
          ))}
        </div>
      </DashboardPanel>
    </div>
  );
}
