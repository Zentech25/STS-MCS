import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";
import { Eye, EyeOff, AlertTriangle, ArrowRight } from "lucide-react";

interface LoginScreenProps {
  onNavigate: (screen: "signup" | "changePassword") => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (!success) setError(true);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />

      <div className={`relative z-10 w-full max-w-[440px] animate-scale-in ${error ? "animate-shake" : ""}`}>
        <div className="glass-panel-glow p-9 space-y-7">
          {/* Header */}
          <div className="text-center space-y-3 pb-6" style={{ borderBottom: "1px solid var(--divider)" }}>
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{
              background: "var(--gradient-primary)",
              boxShadow: "0 8px 28px hsl(230 80% 60% / 0.35)",
            }}>
              <span className="text-white text-2xl font-extrabold">TS</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-foreground">
              Welcome Back
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Sign in to access your simulator
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-destructive/8 border border-destructive/15 text-destructive text-[13px] animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Invalid credentials. Try <span className="font-mono text-xs font-semibold">instructor / demo</span></span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="sys-input h-11" placeholder="Enter username" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="sys-input h-11 pr-10" placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-90">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="sys-btn-primary mt-3 flex items-center justify-center gap-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-[12px] pt-4" style={{ borderTop: "1px solid var(--divider)" }}>
            <button onClick={() => onNavigate("signup")} className="text-primary hover:text-primary/80 transition-all duration-200 font-semibold hover:scale-105 active:scale-95">
              Create Account
            </button>
            <button onClick={() => onNavigate("changePassword")} className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 active:scale-95">
              Change Password
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40 mt-6 tracking-widest uppercase">
          Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
