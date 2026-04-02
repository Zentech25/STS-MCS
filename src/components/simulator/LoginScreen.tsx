import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";

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

      <div className={`relative z-10 w-full max-w-[420px] animate-scale-in ${error ? "animate-shake" : ""}`}>
        <div className="glass-panel-glow p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 pb-5 border-b border-border">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary flex items-center justify-center mb-3 shadow-sm">
              <span className="text-primary-foreground text-lg font-bold">TS</span>
            </div>
            <h1 className="text-lg font-semibold tracking-wide text-foreground">
              Tactical Training Simulator
            </h1>
            <p className="text-[12px] text-muted-foreground">
              System Login
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Invalid credentials. Default: <span className="font-mono text-xs">instructor / demo</span></span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="sys-input"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="sys-input pr-10"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="sys-btn-primary mt-2">
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <div className="flex items-center justify-between text-[12px] pt-3 border-t border-border">
            <button
              onClick={() => onNavigate("signup")}
              className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
            >
              Create Account
            </button>
            <button
              onClick={() => onNavigate("changePassword")}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Change Password
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/60 mt-5 tracking-widest uppercase">
          Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
