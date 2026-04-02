import { useState } from "react";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { LoginScreen } from "@/components/simulator/LoginScreen";
import { SignUpScreen } from "@/components/simulator/SignUpScreen";
import { ChangePasswordScreen } from "@/components/simulator/ChangePasswordScreen";
import { Dashboard } from "@/components/simulator/Dashboard";

type Screen = "login" | "signup" | "changePassword";

function SimulatorApp() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>("login");

  if (user) return <Dashboard />;

  switch (screen) {
    case "signup":
      return <SignUpScreen onNavigate={() => setScreen("login")} />;
    case "changePassword":
      return <ChangePasswordScreen onNavigate={() => setScreen("login")} />;
    default:
      return <LoginScreen onNavigate={(s) => setScreen(s)} />;
  }
}

export default function Index() {
  return (
    <AuthProvider>
      <SimulatorApp />
    </AuthProvider>
  );
}
