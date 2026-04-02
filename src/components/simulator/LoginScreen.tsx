import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";
import { Eye, EyeOff, Lock, User, AlertTriangle, Hexagon } from "lucide-react";

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
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background">
      <AnimatedBackground />

      <div className={`relative z-10 w-full max-w-[420px] px-6 animate-scale-in ${error ? "animate-shake" : ""}`}>
        <div className="glass-panel-strong p-10 space-y-8">
          {/* Logo */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-float">
              <Hexagon className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-lg font-bold tracking-[0.2em] uppercase text-foreground">
              Tactical Training
            </h1>
            <p className="text-[11px] text-muted-foreground tracking-[0.25em] uppercase">
              Simulator Control System
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-destructive/8 border border-destructive/20 text-sm text-destructive">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Invalid credentials. Default: <span className="font-mono">instructor / demo</span></span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="sim-input pl-10"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="sim-input pl-10 pr-11"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="sim-primary-btn">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating
                </span>
              ) : (
                "Authenticate"
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] pt-2">
            <button
              onClick={() => onNavigate("signup")}
              className="text-primary/60 hover:text-primary transition-colors uppercase tracking-[0.12em] font-medium"
            >
              Create Account
            </button>
            <button
              onClick={() => onNavigate("changePassword")}
              className="text-muted-foreground/60 hover:text-foreground transition-colors uppercase tracking-[0.12em]"
            >
              Change Password
            </button>
          </div>
        </div>

        <p className="text-center text-[9px] text-muted-foreground/30 mt-6 tracking-[0.3em] uppercase">
          Authorized Personnel Only • Restricted Access
        </p>
      </div>
    </div>
  );
}
