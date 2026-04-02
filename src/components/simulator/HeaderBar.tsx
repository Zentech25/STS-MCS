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
    <header className="h-14 flex items-center justify-between px-6 shrink-0" style={{
      background: "rgba(255, 255, 255, 0.72)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
    }}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center" style={{
            boxShadow: "0 2px 10px hsl(217 91% 60% / 0.3)",
          }}>
            <span className="text-primary-foreground text-xs font-bold">TS</span>
          </div>
          <h1 className="text-[14px] font-semibold tracking-wide text-foreground">
            Tactical Simulator
          </h1>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono px-2 py-0.5 rounded-lg glass-btn">
          v2.4.1
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-btn text-muted-foreground cursor-pointer">
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
        <button className="relative w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground glass-btn">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white" style={{
            boxShadow: "0 0 6px hsl(217 91% 60% / 0.4)",
          }} />
        </button>

        {/* Clock */}
        <div className="font-mono text-[12px] text-muted-foreground tabular-nums">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 pl-4" style={{ borderLeft: "1px solid rgba(0, 0, 0, 0.06)" }}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-[11px] font-bold text-primary-foreground" style={{
            boxShadow: "0 2px 8px hsl(217 91% 60% / 0.25)",
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium text-foreground">{user?.username}</p>
            <p className="text-[10px] text-primary font-mono capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive glass-btn"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
