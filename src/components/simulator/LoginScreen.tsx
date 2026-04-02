import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";
import { Eye, EyeOff, Lock, User, AlertTriangle } from "lucide-react";

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

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/60" />

      <div className={`relative z-10 w-full max-w-md animate-scale-in ${error ? "animate-shake" : ""}`}>
        <div className="glass-panel-strong p-8 space-y-6">
          {/* Logo / Title */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-cyan mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-xl font-semibold tracking-[0.15em] uppercase text-foreground">
              Tactical Training Simulator
            </h1>
            <p className="text-xs text-muted-foreground tracking-wider uppercase">
              Secure Access Portal
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Invalid credentials. Try: instructor / demo</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-md bg-input/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-300 font-mono text-sm"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-11 rounded-md bg-input/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-300 font-mono text-sm"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="sim-button w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider glow-cyan hover:glow-cyan-strong disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigate("signup")}
              className="text-primary/70 hover:text-primary transition-colors uppercase tracking-wider"
            >
              Create Account
            </button>
            <button
              onClick={() => onNavigate("changePassword")}
              className="text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              Change Password
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/50 mt-4 tracking-wider uppercase">
          Authorized Personnel Only • Classification: Restricted
        </p>
      </div>
    </div>
  );
}
