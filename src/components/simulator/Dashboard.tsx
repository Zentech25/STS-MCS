import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { HeaderBar } from "./HeaderBar";
import { InstructorDashboard } from "./InstructorDashboard";
import { AdministratorDashboard } from "./AdministratorDashboard";
import { EngineerDashboard } from "./EngineerDashboard";
import { SessionPage } from "./SessionPage";

type Tab = "dashboard" | "session";

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const isInstructor = user?.role === "instructor";

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden" style={{
      background: "linear-gradient(135deg, hsl(220 30% 96%) 0%, hsl(225 20% 94%) 50%, hsl(230 25% 95%) 100%)",
    }}>
      <HeaderBar />

      {isInstructor && (
        <div className="shrink-0 flex items-center gap-1 px-6 pt-1" style={{
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
        }}>
          {(["dashboard", "session"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-[12px] font-semibold capitalize tracking-wide transition-all duration-300 border-b-2 ${
                activeTab === tab
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <main className="flex-1 overflow-hidden animate-fade-in">
        {isInstructor && activeTab === "session" ? (
          <SessionPage />
        ) : (
          <>
            {user?.role === "instructor" && <InstructorDashboard />}
            {user?.role === "administrator" && <AdministratorDashboard />}
            {user?.role === "engineer" && <EngineerDashboard />}
          </>
        )}
      </main>
    </div>
  );
}
