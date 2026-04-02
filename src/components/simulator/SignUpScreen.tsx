import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";
import { GraduationCap, Shield, Wrench, ArrowLeft, Check } from "lucide-react";

interface SignUpScreenProps {
  onNavigate: (screen: "login") => void;
}

const ROLES: { id: UserRole; label: string; icon: React.ReactNode }[] = [
  { id: "instructor", label: "Instructor", icon: <GraduationCap className="w-6 h-6" /> },
  { id: "administrator", label: "Administrator", icon: <Shield className="w-6 h-6" /> },
  { id: "engineer", label: "Service Engineer", icon: <Wrench className="w-6 h-6" /> },
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
    } else {
      setError("Username already exists");
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-[440px] px-6 animate-scale-in">
        <div className="glass-panel-strong p-10 space-y-7">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("login")} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-lg font-bold tracking-[0.12em] uppercase">Create Account</h2>
              <p className="text-[11px] text-muted-foreground tracking-[0.15em] uppercase">New operator registration</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-10 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-sim-green/15 border border-sim-green/30 flex items-center justify-center glow-green">
                <Check className="w-8 h-8 text-sim-green" />
              </div>
              <p className="text-sm font-medium text-foreground">Account created</p>
              <p className="text-xs text-muted-foreground">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-destructive/8 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              {[
                { label: "Username", value: username, onChange: setUsername, type: "text" },
                { label: "Password", value: password, onChange: setPassword, type: "password" },
                { label: "Confirm Password", value: confirmPassword, onChange: setConfirmPassword, type: "password" },
              ].map((f) => (
                <div key={f.label} className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">{f.label}</label>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    required
                    className="sim-input"
                  />
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 sim-button ${
                        role === r.id
                          ? "bg-primary/12 border-primary/40 glow-cyan"
                          : "bg-secondary/30 border-border/30 hover:border-primary/20 hover:bg-primary/5"
                      }`}
                    >
                      <div className={`transition-colors ${role === r.id ? "text-primary" : "text-muted-foreground group-hover:text-primary/60"}`}>
                        {r.icon}
                      </div>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider ${role === r.id ? "text-primary" : "text-foreground/80"}`}>
                        {r.label}
                      </p>
                      {role === r.id && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="sim-primary-btn">
                {loading ? "Creating..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
