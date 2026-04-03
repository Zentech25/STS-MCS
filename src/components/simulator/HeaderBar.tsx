import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState, useRef } from "react";
import { LogOut, Wifi, Bell, Search, Sun, Moon, Leaf, User, ChevronDown } from "lucide-react";

export function HeaderBar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [time, setTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-6 shrink-0 relative z-50" style={{
      background: "var(--surface-glass)",
      backdropFilter: "blur(24px) saturate(180%)",
      WebkitBackdropFilter: "blur(24px) saturate(180%)",
      borderBottom: `1px solid var(--divider)`,
      boxShadow: "var(--shadow-soft)",
    }}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
            background: "var(--gradient-primary)",
            boxShadow: "0 4px 14px hsl(230 80% 60% / 0.3)",
          }}>
            <span className="text-white text-sm font-bold">TS</span>
          </div>
          <div>
            <h1 className="text-[14px] font-bold tracking-wide text-foreground leading-none">
              Tactical Simulator
            </h1>
            <span className="text-[9px] text-muted-foreground font-mono">v2.4.1</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-btn text-muted-foreground cursor-pointer min-w-[180px]">
          <Search className="w-3.5 h-3.5" />
          <span className="text-[11px]">Search...</span>
          <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded-md" style={{
            background: "var(--surface-inset)",
          }}>⌘K</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <Wifi className="w-3.5 h-3.5 text-success" />
          <span className="status-dot status-dot-online" />
          <span className="text-muted-foreground">Online</span>
        </div>

        {/* Notification */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground glass-btn">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{
            background: "var(--gradient-warm)",
            boxShadow: "0 2px 8px hsl(340 75% 58% / 0.4)",
          }}>3</span>
        </button>

        {/* Clock */}
        <div className="font-mono text-[12px] text-muted-foreground tabular-nums px-3 py-1.5 rounded-lg" style={{
          background: "var(--surface-inset)",
        }}>
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </div>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 pl-4 py-1 pr-2 rounded-xl glass-btn"
            style={{ borderLeft: "none" }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{
              background: "var(--gradient-primary)",
              boxShadow: "0 2px 10px hsl(230 80% 60% / 0.3)",
            }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-[11px] font-semibold text-foreground leading-none">{user?.username}</p>
              <p className="text-[9px] text-muted-foreground font-mono capitalize mt-0.5">{user?.role}</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 glass-panel-glow p-2 z-50 animate-scale-in" style={{
              transformOrigin: "top right",
            }}>
              <div className="px-3 py-2.5 mb-1">
                <p className="text-[12px] font-semibold text-foreground">{user?.username}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <div style={{ borderTop: `1px solid var(--divider)` }} className="pt-1 mb-1" />

              {/* Theme selector */}
              <div className="px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Theme</p>
                <div className="flex gap-1.5">
                  {([
                    { key: "light" as const, icon: Sun, label: "Light", color: "text-warning" },
                    { key: "dark" as const, icon: Moon, label: "Dark", color: "text-accent" },
                    { key: "zen" as const, icon: Leaf, label: "Zen", color: "text-success" },
                  ]).map(({ key, icon: Icon, label, color }) => (
                    <button
                      key={key}
                      onClick={(e) => { e.stopPropagation(); setTheme(key); }}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-medium transition-all ${
                        theme === key
                          ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${theme === key ? color : ""}`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: `1px solid var(--divider)` }} className="pt-1 mt-1" />

              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left text-[11px] text-destructive font-medium interactive-row"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
