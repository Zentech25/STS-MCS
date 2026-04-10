import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { HeaderBar } from "./HeaderBar";
import { AdministratorDashboard } from "./AdministratorDashboard";
import { EngineerDashboard } from "./EngineerDashboard";
import { SessionPage, SessionMode } from "./SessionPage";
import { ConfigurePage } from "./ConfigurePage";
import { LeaderboardPage } from "./LeaderboardPage";
import { AARPage } from "./aar/AARPage";

type Tab = "session" | "leaderboard" | "configure" | "aar";

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("session");
  const [sessionMode, setSessionMode] = useState<SessionMode>("master");

  const isInstructor = user?.role === "instructor";

  return (
    <div className="w-full h-screen flex flex-col" style={{
      background: "var(--gradient-mesh)",
    }}>
      <HeaderBar />

      {isInstructor && (
        <div className="shrink-0 flex items-center gap-1 px-6 pt-1" style={{
          background: "var(--surface-glass)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid var(--divider)`,
        }}>
          {(["session", "leaderboard", "configure", "aar"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wide transition-all duration-300 border-b-2 ${
                activeTab === tab
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
              style={activeTab === tab ? {
                textShadow: "0 0 20px hsl(230 80% 60% / 0.3)",
              } : undefined}
            >
              {tab === "aar" ? "AAR" : tab}
            </button>
          ))}
        </div>
      )}

      <main className="flex-1 overflow-hidden animate-fade-in" key={activeTab}>
        {isInstructor && activeTab === "configure" ? (
          <ConfigurePage />
        ) : isInstructor && activeTab === "leaderboard" ? (
          <LeaderboardPage />
        ) : isInstructor && activeTab === "aar" ? (
          <AARPage />
        ) : isInstructor && activeTab === "session" ? (
          <SessionPage mode={sessionMode} onModeChange={setSessionMode} />
        ) : (
          <>
            {user?.role === "administrator" && <AdministratorDashboard />}
            {user?.role === "engineer" && <EngineerDashboard />}
          </>
        )}
      </main>
    </div>
  );
}
