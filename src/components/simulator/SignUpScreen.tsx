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
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <button onClick={() => onNavigate("login")} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-semibold tracking-wide">Create Account</h2>
              <p className="text-[12px] text-muted-foreground">New operator registration</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
              <div className="w-14 h-14 rounded-xl bg-success flex items-center justify-center shadow-sm">
                <Check className="w-7 h-7 text-success-foreground" />
              </div>
              <p className="text-sm font-medium">Account created</p>
              <p className="text-xs text-muted-foreground">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
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
                      className={`relative flex flex-col items-center gap-2 p-3.5 rounded-lg border transition-all duration-200 ${
                        role === r.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-secondary text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {r.icon}
                      <p className="text-[10px] font-semibold uppercase tracking-wider">{r.label}</p>
                      {role === r.id && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
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
