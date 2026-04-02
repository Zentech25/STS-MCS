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
    <div className="w-full h-screen flex flex-col overflow-hidden bg-background">
      <HeaderBar />

      {isInstructor && (
        <div className="shrink-0 flex items-center gap-1 px-6 bg-card border-b border-border">
          {(["dashboard", "session"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[12px] font-semibold capitalize tracking-wide transition-all duration-150 border-b-2 ${
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
