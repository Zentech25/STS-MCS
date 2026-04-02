import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { LogOut, Wifi, AlertTriangle } from "lucide-react";

export function HeaderBar() {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-10 flex items-center justify-between px-4 bg-card border-b border-border shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-1 h-4 rounded-sm bg-primary" />
        <h1 className="text-[12px] font-semibold tracking-[0.14em] uppercase text-foreground">
          Tactical Training Simulator
        </h1>
        <span className="text-[10px] text-muted-foreground tracking-wider font-mono border border-border rounded-sm px-1.5 py-0.5">
          v2.4.1
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-success" />
            <span className="status-dot status-dot-online" />
            <span className="text-muted-foreground uppercase tracking-wider">Connected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-warning" />
            <span className="status-dot status-dot-warning" />
            <span className="text-muted-foreground uppercase tracking-wider">2 Alerts</span>
          </div>
        </div>

        <div className="font-mono text-[12px] text-foreground/70 tracking-wider tabular-nums">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-[11px] font-medium text-foreground uppercase tracking-wider">{user?.username}</p>
            <p className="text-[10px] text-primary uppercase tracking-wider font-mono">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-7 h-7 rounded-sm flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-100"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
