import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";
import { GraduationCap, Shield, Wrench, ArrowLeft, Check } from "lucide-react";

interface SignUpScreenProps {
  onNavigate: (screen: "login") => void;
}

const ROLES: { id: UserRole; label: string; icon: React.ReactNode; gradient: string }[] = [
  { id: "instructor", label: "Instructor", icon: <GraduationCap className="w-6 h-6" />, gradient: "var(--gradient-primary)" },
  { id: "administrator", label: "Admin", icon: <Shield className="w-6 h-6" />, gradient: "var(--gradient-warm)" },
  { id: "engineer", label: "Engineer", icon: <Wrench className="w-6 h-6" />, gradient: "var(--gradient-cool)" },
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
      setTimeout(() => onNavigate("login"), 1200);
    } else {
      setError("Username already exists");
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-[460px] animate-scale-in">
        <div className="glass-panel-glow p-9 space-y-6">
          <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid var(--divider)" }}>
            <button onClick={() => onNavigate("login")} className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground glass-btn">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-lg font-bold tracking-wide">Create Account</h2>
              <p className="text-[12px] text-muted-foreground">New operator registration</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-10 animate-scale-in">
              <div className="w-16 h-16 rounded-2xl bg-success flex items-center justify-center" style={{
                boxShadow: "0 8px 24px hsl(160 72% 42% / 0.3)",
              }}>
                <Check className="w-8 h-8 text-success-foreground" />
              </div>
              <p className="text-base font-semibold">Account created!</p>
              <p className="text-sm text-muted-foreground">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-destructive/8 border border-destructive/15 text-destructive text-[13px] animate-fade-in">{error}</div>
              )}

              {[
                { label: "Username", value: username, onChange: setUsername, type: "text" },
                { label: "Password", value: password, onChange: setPassword, type: "password" },
                { label: "Confirm Password", value: confirmPassword, onChange: setConfirmPassword, type: "password" },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{f.label}</label>
                  <input type={f.type} value={f.value} onChange={(e) => f.onChange(e.target.value)} required className="sys-input h-11" />
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Role</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`relative flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-300 ${
                        role === r.id ? "scale-[1.03] border-primary/30" : "border-transparent hover:scale-[1.02]"
                      }`}
                      style={{
                        background: role === r.id ? "var(--surface-glass-hover)" : "var(--surface-elevated)",
                        boxShadow: role === r.id ? "var(--shadow-glow)" : "var(--shadow-soft)",
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{
                        background: role === r.id ? r.gradient : "var(--surface-inset)",
                        color: role === r.id ? "white" : "hsl(var(--muted-foreground))",
                        boxShadow: role === r.id ? "0 4px 14px hsl(230 80% 60% / 0.25)" : "none",
                        transition: "all 0.3s ease",
                      }}>
                        {r.icon}
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${role === r.id ? "text-primary" : "text-muted-foreground"}`}>{r.label}</p>
                      {role === r.id && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white animate-scale-in" style={{
                          background: "var(--gradient-primary)",
                          boxShadow: "0 2px 10px hsl(230 80% 60% / 0.4)",
                        }}>
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="sys-btn-primary mt-3">
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
