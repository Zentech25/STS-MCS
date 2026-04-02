import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { LogOut, Wifi, AlertTriangle, Hexagon } from "lucide-react";

export function HeaderBar() {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-11 flex items-center justify-between px-5 border-b border-border/30 shrink-0" style={{ background: "linear-gradient(90deg, hsl(230 20% 7% / 0.95), hsl(230 20% 9% / 0.9))" }}>
      <div className="flex items-center gap-3">
        <Hexagon className="w-4 h-4 text-primary/70" />
        <h1 className="text-[13px] font-bold tracking-[0.2em] uppercase text-foreground/90">
          Tactical Training Simulator
        </h1>
        <span className="text-[9px] text-muted-foreground/60 tracking-wider uppercase border border-border/30 rounded-md px-2 py-0.5 font-mono">
          v2.4.1
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-sim-green/80" />
            <span className="status-dot status-dot-online" />
            <span className="text-muted-foreground/70 uppercase tracking-wider">Connected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-sim-amber/80" />
            <span className="status-dot status-dot-warning" />
            <span className="text-muted-foreground/70 uppercase tracking-wider">2 Alerts</span>
          </div>
        </div>

        <div className="font-mono text-[13px] text-foreground/70 tracking-wider tabular-nums">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-border/20">
          <div className="text-right">
            <p className="text-[11px] font-medium text-foreground/80 uppercase tracking-wider">{user?.username}</p>
            <p className="text-[9px] text-primary/60 uppercase tracking-wider font-mono">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
