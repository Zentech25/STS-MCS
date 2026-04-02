import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";
import { ArrowLeft, Check, User } from "lucide-react";

interface Props {
  onNavigate: (screen: "login") => void;
}

export function ChangePasswordScreen({ onNavigate }: Props) {
  const { changePassword } = useAuth();
  const [username, setUsername] = useState("");
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPass !== confirm) { setError("Passwords do not match"); return; }
    if (!username.trim()) { setError("Enter a username"); return; }
    setLoading(true);
    const ok = await changePassword(username, current, newPass);
    setLoading(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => onNavigate("login"), 1500);
    } else {
      setError("Invalid username or current password");
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-[420px] px-6 animate-scale-in">
        <div className="glass-panel-strong p-10 space-y-7">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("login")} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-lg font-bold tracking-[0.12em] uppercase">Change Password</h2>
              <p className="text-[11px] text-muted-foreground tracking-[0.15em] uppercase">Update credentials</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-10 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-sim-green/15 border border-sim-green/30 flex items-center justify-center glow-green">
                <Check className="w-8 h-8 text-sim-green" />
              </div>
              <p className="text-sm font-medium">Password updated</p>
              <p className="text-xs text-muted-foreground">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-destructive/8 border border-destructive/20 text-destructive text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    className="sim-input pl-10"
                  />
                </div>
              </div>

              {[
                { label: "Current Password", value: current, onChange: setCurrent },
                { label: "New Password", value: newPass, onChange: setNewPass },
                { label: "Confirm New Password", value: confirm, onChange: setConfirm },
              ].map((f) => (
                <div key={f.label} className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">{f.label}</label>
                  <input
                    type="password"
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    required
                    className="sim-input"
                  />
                </div>
              ))}

              <button type="submit" disabled={loading} className="sim-primary-btn">
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
