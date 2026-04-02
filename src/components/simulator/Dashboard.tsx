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
      background: "linear-gradient(180deg, hsl(228 30% 10%) 0%, hsl(228 28% 8%) 100%)",
    }}>
      <HeaderBar />

      {/* Tab bar for instructor */}
      {isInstructor && (
        <div className="shrink-0 flex items-center gap-1 px-5 pt-2 pb-0">
          {(["dashboard", "session"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider rounded-t-lg border border-b-0 transition-all duration-150 ${
                activeTab === tab
                  ? "bg-secondary/60 text-foreground border-border/50"
                  : "text-muted-foreground border-transparent hover:text-foreground/70 hover:bg-secondary/20"
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
