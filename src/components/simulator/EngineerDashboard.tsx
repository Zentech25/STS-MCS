import { DashboardPanel } from "./DashboardPanel";
import { HardDrive, Cpu, Thermometer, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

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

  return (
    <div className="grid grid-cols-12 gap-4 p-4 h-full auto-rows-fr">
      {/* Hardware Status */}
      <DashboardPanel title="Hardware Diagnostics" className="col-span-5">
        <div className="space-y-2">
          {hardware.map((h) => (
            <div key={h.name} className={`flex items-center justify-between p-2.5 rounded border transition-colors ${
              h.status === "error" ? "bg-destructive/5 border-destructive/30" :
              h.status === "warning" ? "bg-sim-amber/5 border-sim-amber/30" :
              "bg-secondary/20 border-border/20"
            }`}>
              <div className="flex items-center gap-2.5">
                {h.status === "ok" ? <CheckCircle className="w-4 h-4 text-sim-green" /> :
                 h.status === "warning" ? <AlertTriangle className="w-4 h-4 text-sim-amber" /> :
                 <XCircle className="w-4 h-4 text-destructive" />}
                <span className="text-xs font-medium text-foreground">{h.name}</span>
              </div>
              {h.status !== "error" && (
                <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> {h.temp}°C</span>
                  <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {h.load}%</span>
                </div>
              )}
              {h.status === "error" && <span className="text-[10px] font-mono text-destructive">OFFLINE</span>}
            </div>
          ))}
        </div>
      </DashboardPanel>

      {/* System Health */}
      <DashboardPanel title="System Health" className="col-span-3">
        <div className="space-y-3">
          {[
            { label: "CPU", value: 38, icon: <Cpu className="w-4 h-4" /> },
            { label: "Memory", value: 64, icon: <HardDrive className="w-4 h-4" /> },
            { label: "Disk I/O", value: 22, icon: <HardDrive className="w-4 h-4" /> },
            { label: "Network", value: 15, icon: <HardDrive className="w-4 h-4" /> },
          ].map((m) => (
            <div key={m.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">{m.icon} {m.label}</span>
                <span className="font-mono text-foreground">{m.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary/50">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    m.value > 80 ? "bg-destructive" : m.value > 60 ? "bg-sim-amber" : "bg-sim-green"
                  }`}
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>

      {/* Error Logs */}
      <DashboardPanel title="Event Log" className="col-span-4">
        <div className="space-y-1 max-h-full overflow-y-auto">
          {logs.map((l, i) => (
            <div key={i} className="flex items-start gap-2 p-1.5 rounded hover:bg-secondary/20 transition-colors">
              <span className="font-mono text-[10px] text-muted-foreground shrink-0">{l.time}</span>
              <span className={`text-[10px] font-mono font-bold shrink-0 w-10 ${
                l.level === "ERROR" ? "text-destructive" :
                l.level === "WARN" ? "text-sim-amber" :
                "text-muted-foreground"
              }`}>
                {l.level}
              </span>
              <span className="text-[11px] text-foreground/80">{l.msg}</span>
            </div>
          ))}
        </div>
      </DashboardPanel>

      {/* Locked panels */}
      <DashboardPanel title="Simulation Control" locked className="col-span-6">
        <p className="text-xs text-muted-foreground">Instructor access required</p>
      </DashboardPanel>
      <DashboardPanel title="User Management" locked className="col-span-6">
        <p className="text-xs text-muted-foreground">Administrator access required</p>
      </DashboardPanel>
    </div>
  );
}
