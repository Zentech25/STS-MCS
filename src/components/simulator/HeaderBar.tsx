import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { LogOut, Wifi, Bell, Search } from "lucide-react";

export function HeaderBar() {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-6 shrink-0 bg-card border-b border-border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground text-xs font-bold">TS</span>
          </div>
          <h1 className="text-[14px] font-semibold tracking-wide text-foreground">
            Tactical Simulator
          </h1>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono px-2 py-0.5 rounded-md bg-secondary border border-border">
          v2.4.1
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground">
          <Search className="w-3.5 h-3.5" />
          <span className="text-[11px]">Search...</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-success" />
            <span className="status-dot status-dot-online" />
            <span className="text-muted-foreground">Connected</span>
          </div>
        </div>

        {/* Notification */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
        </button>

        {/* Clock */}
        <div className="font-mono text-[12px] text-muted-foreground tabular-nums">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium text-foreground">{user?.username}</p>
            <p className="text-[10px] text-primary font-mono capitalize">{user?.role}</p>
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
