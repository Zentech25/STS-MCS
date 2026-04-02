import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { LogOut, Wifi, AlertTriangle, Bell, Search } from "lucide-react";

export function HeaderBar() {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-12 flex items-center justify-between px-5 shrink-0 border-b" style={{
      background: "linear-gradient(90deg, hsl(228 28% 12%) 0%, hsl(228 25% 14%) 100%)",
      borderColor: "hsl(228 20% 20% / 0.6)",
    }}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
            background: "var(--gradient-primary)",
            boxShadow: "0 0 12px hsl(199 89% 48% / 0.3)",
          }}>
            <span className="text-white text-xs font-bold">TS</span>
          </div>
          <h1 className="text-[13px] font-semibold tracking-wide text-foreground">
            Tactical Simulator
          </h1>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono px-2 py-0.5 rounded-md bg-secondary/50 border border-border/50">
          v2.4.1
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground">
          <Search className="w-3.5 h-3.5" />
          <span className="text-[11px]">Search...</span>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-success" />
            <span className="status-dot status-dot-online" />
            <span className="text-muted-foreground">Connected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-warning" />
            <span className="text-muted-foreground">2 Alerts</span>
          </div>
        </div>

        {/* Notification */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" style={{
            boxShadow: "0 0 6px hsl(199 89% 48% / 0.5)",
          }} />
        </button>

        {/* Clock */}
        <div className="font-mono text-[12px] text-foreground/60 tabular-nums">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-border/40">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold" style={{
            background: "var(--gradient-accent)",
            boxShadow: "0 0 10px hsl(270 60% 58% / 0.2)",
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium text-foreground">{user?.username}</p>
            <p className="text-[10px] text-primary font-mono">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
