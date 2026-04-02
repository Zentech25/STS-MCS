import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";
import { GraduationCap, Shield, Wrench, ArrowLeft, Check } from "lucide-react";

interface SignUpScreenProps {
  onNavigate: (screen: "login") => void;
}

const ROLES: { id: UserRole; label: string; icon: React.ReactNode }[] = [
  { id: "instructor", label: "Instructor", icon: <GraduationCap className="w-5 h-5" /> },
  { id: "administrator", label: "Administrator", icon: <Shield className="w-5 h-5" /> },
  { id: "engineer", label: "Engineer", icon: <Wrench className="w-5 h-5" /> },
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

      <div className="relative z-10 w-full max-w-[440px] animate-scale-in">
        <div className="glass-panel-glow p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <button onClick={() => onNavigate("login")} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground glass-btn">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-semibold tracking-wide">Create Account</h2>
              <p className="text-[12px] text-muted-foreground">New operator registration</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-3 py-8 animate-scale-in">
              <div className="w-14 h-14 rounded-2xl bg-success flex items-center justify-center" style={{
                boxShadow: "0 4px 16px hsl(152 69% 41% / 0.3)",
              }}>
                <Check className="w-7 h-7 text-success-foreground" />
              </div>
              <p className="text-sm font-medium">Account created</p>
              <p className="text-xs text-muted-foreground">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-3 py-2.5 rounded-xl bg-destructive/8 border border-destructive/15 text-destructive text-sm animate-fade-in">{error}</div>
              )}

              {[
                { label: "Username", value: username, onChange: setUsername, type: "text" },
                { label: "Password", value: password, onChange: setPassword, type: "password" },
                { label: "Confirm Password", value: confirmPassword, onChange: setConfirmPassword, type: "password" },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{f.label}</label>
                  <input type={f.type} value={f.value} onChange={(e) => f.onChange(e.target.value)} required className="sys-input" />
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl border transition-all duration-300 ${
                        role === r.id
                          ? "border-primary/40 text-primary scale-[1.02]"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:scale-[1.02]"
                      }`}
                      style={{
                        background: role === r.id ? "rgba(59, 130, 246, 0.08)" : "rgba(255, 255, 255, 0.4)",
                        backdropFilter: "blur(8px)",
                        boxShadow: role === r.id
                          ? "0 4px 16px rgba(59, 130, 246, 0.12), inset 0 1px 0 rgba(255,255,255,0.4)"
                          : "0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
                      }}
                    >
                      {r.icon}
                      <p className="text-[10px] font-semibold uppercase tracking-wider">{r.label}</p>
                      {role === r.id && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center" style={{
                          boxShadow: "0 2px 8px hsl(217 91% 60% / 0.4)",
                        }}>
                          <Check className="w-2.5 h-2.5 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="sys-btn-primary mt-2">
                {loading ? "Creating..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
