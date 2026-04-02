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
    <div className="grid grid-cols-12 gap-3 p-4 h-full auto-rows-fr">
      <DashboardPanel title="Hardware Diagnostics" className="col-span-5">
        <div className="space-y-1.5">
          {hardware.map((h) => (
            <div key={h.name} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              h.status === "error" ? "bg-destructive/5 border-destructive/20" :
              h.status === "warning" ? "bg-sim-amber/5 border-sim-amber/20" :
              "bg-secondary/20 border-border/15"
            }`}>
              <div className="flex items-center gap-2.5">
                {h.status === "ok" ? <CheckCircle className="w-4 h-4 text-sim-green/80" /> :
                 h.status === "warning" ? <AlertTriangle className="w-4 h-4 text-sim-amber/80" /> :
                 <XCircle className="w-4 h-4 text-destructive/80" />}
                <span className="text-[11px] font-medium text-foreground/80">{h.name}</span>
              </div>
              {h.status !== "error" ? (
                <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground/60">
                  <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> {h.temp}°C</span>
                  <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {h.load}%</span>
                </div>
              ) : (
                <span className="text-[10px] font-mono text-destructive font-medium">OFFLINE</span>
              )}
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="System Health" className="col-span-3">
        <div className="space-y-4">
          {[
            { label: "CPU", value: 38, icon: <Cpu className="w-3.5 h-3.5" /> },
            { label: "Memory", value: 64, icon: <HardDrive className="w-3.5 h-3.5" /> },
            { label: "Disk I/O", value: 22, icon: <HardDrive className="w-3.5 h-3.5" /> },
            { label: "Network", value: 15, icon: <HardDrive className="w-3.5 h-3.5" /> },
          ].map((m) => (
            <div key={m.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-muted-foreground">{m.icon} {m.label}</span>
                <span className="font-mono text-foreground/70">{m.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000`}
                  style={{
                    width: `${m.value}%`,
                    background: m.value > 80 ? "hsl(0 85% 55%)" : m.value > 60 ? "hsl(42 100% 60%)" : "hsl(155 80% 48%)",
                    boxShadow: `0 0 8px ${m.value > 80 ? "hsl(0 85% 55% / 0.3)" : m.value > 60 ? "hsl(42 100% 60% / 0.3)" : "hsl(155 80% 48% / 0.3)"}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Event Log" className="col-span-4">
        <div className="space-y-0.5">
          {logs.map((l, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-secondary/15 transition-colors">
              <span className="font-mono text-[9px] text-muted-foreground/50 shrink-0 mt-0.5">{l.time}</span>
              <span className={`text-[9px] font-mono font-bold shrink-0 w-10 mt-0.5 ${
                l.level === "ERROR" ? "text-destructive" :
                l.level === "WARN" ? "text-sim-amber" :
                "text-muted-foreground/50"
              }`}>{l.level}</span>
              <span className="text-[11px] text-foreground/60 leading-tight">{l.msg}</span>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Simulation Control" locked className="col-span-6">
        <p className="text-xs text-muted-foreground/40">Instructor access required</p>
      </DashboardPanel>
      <DashboardPanel title="User Management" locked className="col-span-6">
        <p className="text-xs text-muted-foreground/40">Administrator access required</p>
      </DashboardPanel>
    </div>
  );
}
