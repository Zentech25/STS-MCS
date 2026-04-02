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

      <div className="relative z-10 w-full max-w-[420px] animate-scale-in">
        <div className="glass-panel-glow p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <button onClick={() => onNavigate("login")} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground glass-btn">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-semibold tracking-wide">Change Password</h2>
              <p className="text-[12px] text-muted-foreground">Update credentials</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-3 py-8 animate-scale-in">
              <div className="w-14 h-14 rounded-2xl bg-success flex items-center justify-center" style={{
                boxShadow: "0 4px 16px hsl(152 69% 41% / 0.3)",
              }}>
                <Check className="w-7 h-7 text-success-foreground" />
              </div>
              <p className="text-sm font-medium">Password updated</p>
              <p className="text-xs text-muted-foreground">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-3 py-2.5 rounded-xl bg-destructive/8 border border-destructive/15 text-destructive text-sm animate-fade-in">{error}</div>
              )}

              {[
                { label: "Username", value: username, onChange: setUsername, type: "text" },
                { label: "Current Password", value: current, onChange: setCurrent, type: "password" },
                { label: "New Password", value: newPass, onChange: setNewPass, type: "password" },
                { label: "Confirm New Password", value: confirm, onChange: setConfirm, type: "password" },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{f.label}</label>
                  <input type={f.type} value={f.value} onChange={(e) => f.onChange(e.target.value)} required className="sys-input" />
                </div>
              ))}

              <button type="submit" disabled={loading} className="sys-btn-primary mt-2">
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
