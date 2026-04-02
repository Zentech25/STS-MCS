import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedBackground } from "./AnimatedBackground";
import { ArrowLeft, Check } from "lucide-react";

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
      setTimeout(() => onNavigate("login"), 1200);
    } else {
      setError("Invalid username or current password");
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-[440px] animate-scale-in">
        <div className="glass-panel-glow p-9 space-y-6">
          <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid var(--divider)" }}>
            <button onClick={() => onNavigate("login")} className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground glass-btn">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-lg font-bold tracking-wide">Change Password</h2>
              <p className="text-[12px] text-muted-foreground">Update your credentials</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-10 animate-scale-in">
              <div className="w-16 h-16 rounded-2xl bg-success flex items-center justify-center" style={{
                boxShadow: "0 8px 24px hsl(160 72% 42% / 0.3)",
              }}>
                <Check className="w-8 h-8 text-success-foreground" />
              </div>
              <p className="text-base font-semibold">Password updated!</p>
              <p className="text-sm text-muted-foreground">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-destructive/8 border border-destructive/15 text-destructive text-[13px] animate-fade-in">{error}</div>
              )}

              {[
                { label: "Username", value: username, onChange: setUsername, type: "text" },
                { label: "Current Password", value: current, onChange: setCurrent, type: "password" },
                { label: "New Password", value: newPass, onChange: setNewPass, type: "password" },
                { label: "Confirm New Password", value: confirm, onChange: setConfirm, type: "password" },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{f.label}</label>
                  <input type={f.type} value={f.value} onChange={(e) => f.onChange(e.target.value)} required className="sys-input h-11" />
                </div>
              ))}

              <button type="submit" disabled={loading} className="sys-btn-primary mt-3">
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
