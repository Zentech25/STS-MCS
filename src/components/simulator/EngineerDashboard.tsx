import { DashboardPanel } from "./DashboardPanel";
import { Cpu, Thermometer, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

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
    { label: "CPU", value: 38, color: "hsl(152 69% 41%)" },
    { label: "Memory", value: 64, color: "hsl(38 92% 50%)" },
    { label: "Disk I/O", value: 22, color: "hsl(217 91% 60%)" },
    { label: "Network", value: 15, color: "hsl(152 69% 41%)" },
  ];

  return (
    <div className="grid grid-cols-12 gap-5 p-5 h-full auto-rows-fr">
      <DashboardPanel title="Hardware Diagnostics" className="col-span-5" glow>
        <div className="space-y-1.5">
          {hardware.map((h) => (
            <div key={h.name} className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
              h.status === "error" ? "bg-destructive/5 border-destructive/20" :
              h.status === "warning" ? "bg-warning/5 border-warning/20" :
              "bg-secondary border-border"
            } hover:bg-accent`}>
              <div className="flex items-center gap-2.5">
                {h.status === "ok" ? <CheckCircle className="w-4 h-4 text-success" /> :
                 h.status === "warning" ? <AlertTriangle className="w-4 h-4 text-warning" /> :
                 <XCircle className="w-4 h-4 text-destructive" />}
                <span className="text-[11px] font-medium text-foreground">{h.name}</span>
              </div>
              {h.status !== "error" ? (
                <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
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
          {healthMetrics.map((m) => (
            <div key={m.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Cpu className="w-3.5 h-3.5" /> {m.label}
                </span>
                <span className="font-mono text-foreground">{m.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${m.value}%`,
                    background: m.color,
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
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-secondary transition-all duration-200">
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
