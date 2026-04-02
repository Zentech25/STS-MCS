import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";
import { ArrowLeft, Check } from "lucide-react";

interface Props {
  onNavigate: (screen: "login") => void;
}

export function ChangePasswordScreen({ onNavigate }: Props) {
  const { changePassword } = useAuth();
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
    setLoading(true);
    const ok = await changePassword(current, newPass);
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

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="glass-panel-strong p-8 space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("login")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold tracking-[0.1em] uppercase">Change Password</h2>
              <p className="text-xs text-muted-foreground tracking-wider">Update your access credentials</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-sim-green/20 border border-sim-green/40 flex items-center justify-center glow-green">
                <Check className="w-8 h-8 text-sim-green" />
              </div>
              <p className="text-sm">Password updated</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">{error}</div>
              )}
              {[
                { label: "Current Password", value: current, onChange: setCurrent },
                { label: "New Password", value: newPass, onChange: setNewPass },
                { label: "Confirm New Password", value: confirm, onChange: setConfirm },
              ].map((f) => (
                <div key={f.label} className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{f.label}</label>
                  <input
                    type="password"
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-md bg-input/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-300 font-mono text-sm"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="sim-button w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider glow-cyan hover:glow-cyan-strong disabled:opacity-50 transition-all duration-300"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
