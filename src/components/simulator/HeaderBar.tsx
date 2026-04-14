import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState, useRef } from "react";
import { LogOut, Sun, Moon, ChevronDown, Monitor, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

export type SessionMode = "master" | "firer";

interface HeaderBarProps {
  sessionMode?: SessionMode;
  onSessionModeChange?: (mode: SessionMode) => void;
  showModeToggle?: boolean;
}

export function HeaderBar({ sessionMode, onSessionModeChange, showModeToggle }: HeaderBarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

        {/* Mode Toggle in header */}
        {showModeToggle && sessionMode && onSessionModeChange && (
          <div className="ml-4 flex items-center">
            <div className="flex items-center rounded-full overflow-hidden p-0.5" style={{
              background: "var(--surface-inset)",
              border: "1px solid var(--divider)",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.15)",
            }}>
              {(["master", "firer"] as SessionMode[]).map((m) => {
                const isActive = sessionMode === m;
                const Icon = m === "master" ? Monitor : Gamepad2;
                return (
                  <motion.button
                    key={m}
                    onClick={() => onSessionModeChange(m)}
                    className={`relative flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors duration-200 ${
                      isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                    whileHover={!isActive ? { scale: 1.03 } : undefined}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mode-pill"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: m === "master" ? "var(--gradient-primary)" : "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--primary)))",
                          boxShadow: `0 2px 12px hsl(var(--primary) / 0.4)`,
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="w-3 h-3" />
                      {m}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">

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

          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 glass-panel-glow p-2 z-50 animate-scale-in" style={{
              transformOrigin: "top right",
            }}>
              <div className="px-3 py-2.5 mb-1">
                <p className="text-[12px] font-semibold text-foreground">{user?.username}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <div style={{ borderTop: `1px solid var(--divider)` }} className="pt-1 mb-1" />

              <div className="flex items-center justify-between px-3 py-2 rounded-lg interactive-row">
                <div className="flex items-center gap-2 text-[11px] text-foreground">
                  {theme === "dark" ? <Moon className="w-3.5 h-3.5 text-accent" /> : <Sun className="w-3.5 h-3.5 text-warning" />}
                  <span className="font-medium">{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
                  className={`theme-toggle ${theme === "dark" ? "active" : ""}`}
                />
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
