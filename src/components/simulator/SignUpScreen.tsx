import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";
import { GraduationCap, Shield, Wrench, ArrowLeft, Check } from "lucide-react";

interface SignUpScreenProps {
  onNavigate: (screen: "login") => void;
}

const ROLES: { id: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "instructor", label: "Instructor", icon: <GraduationCap className="w-8 h-8" />, desc: "Manage simulation sessions and monitor trainee performance" },
  { id: "administrator", label: "Administrator", icon: <Shield className="w-8 h-8" />, desc: "Full system control, user management, and configuration" },
  { id: "engineer", label: "Service Engineer", icon: <Wrench className="w-8 h-8" />, desc: "Hardware diagnostics, maintenance, and system health monitoring" },
];

export function SignUpScreen({ onNavigate }: SignUpScreenProps) {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (!role) { setError("Select a role"); return; }
    setLoading(true);
    const ok = await signup(username, password, role);
    setLoading(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => onNavigate("login"), 1500);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/60" />

      <div className="relative z-10 w-full max-w-lg animate-scale-in">
        <div className="glass-panel-strong p-8 space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("login")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold tracking-[0.1em] uppercase">Create Account</h2>
              <p className="text-xs text-muted-foreground tracking-wider">Register new operator credentials</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-sim-green/20 border border-sim-green/40 flex items-center justify-center glow-green">
                <Check className="w-8 h-8 text-sim-green" />
              </div>
              <p className="text-sm text-foreground">Account created successfully</p>
              <p className="text-xs text-muted-foreground">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: "Username", value: username, onChange: setUsername, type: "text" },
                  { label: "Password", value: password, onChange: setPassword, type: "password" },
                  { label: "Confirm Password", value: confirmPassword, onChange: setConfirmPassword, type: "password" },
                ].map((f) => (
                  <div key={f.label} className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{f.label}</label>
                    <input
                      type={f.type}
                      value={f.value}
                      onChange={(e) => f.onChange(e.target.value)}
                      required
                      className="w-full h-10 px-3 rounded-md bg-input/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-300 font-mono text-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Select Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`group relative p-4 rounded-lg border text-center transition-all duration-300 sim-button ${
                        role === r.id
                          ? "bg-primary/15 border-primary/60 glow-cyan"
                          : "bg-secondary/30 border-border/40 hover:border-primary/30 hover:bg-primary/5"
                      }`}
                    >
                      <div className={`mx-auto mb-2 transition-colors ${role === r.id ? "text-primary" : "text-muted-foreground group-hover:text-primary/70"}`}>
                        {r.icon}
                      </div>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${role === r.id ? "text-primary" : "text-foreground"}`}>
                        {r.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{r.desc}</p>
                      {role === r.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="sim-button w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider glow-cyan hover:glow-cyan-strong disabled:opacity-50 transition-all duration-300"
              >
                {loading ? "Creating..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
