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
    <header className="h-12 flex items-center justify-between px-5 bg-sim-graphite/80 backdrop-blur-md border-b border-border/40 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-primary">
          Tactical Training Simulator
        </h1>
        <span className="text-[10px] text-muted-foreground tracking-wider uppercase border border-border/40 rounded px-2 py-0.5">
          v2.4.1
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Status indicators */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-sim-green" />
            <span className="status-dot status-dot-online" />
            <span className="text-muted-foreground uppercase tracking-wider">Connected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-sim-amber" />
            <span className="status-dot bg-sim-amber status-dot-warning" />
            <span className="text-muted-foreground uppercase tracking-wider">2 Warnings</span>
          </div>
        </div>

        {/* Clock */}
        <div className="font-mono text-sm text-foreground tracking-wider">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-border/40">
          <div className="text-right">
            <p className="text-xs font-medium text-foreground uppercase tracking-wider">{user?.username}</p>
            <p className="text-[10px] text-primary uppercase tracking-wider">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
