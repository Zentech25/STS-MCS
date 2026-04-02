import { useAuth } from "@/contexts/AuthContext";
import { HeaderBar } from "./HeaderBar";
import { InstructorDashboard } from "./InstructorDashboard";
import { AdministratorDashboard } from "./AdministratorDashboard";
import { EngineerDashboard } from "./EngineerDashboard";

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-background">
      <HeaderBar />
      <main className="flex-1 overflow-hidden animate-fade-in">
        {user?.role === "instructor" && <InstructorDashboard />}
        {user?.role === "administrator" && <AdministratorDashboard />}
        {user?.role === "engineer" && <EngineerDashboard />}
      </main>
    </div>
  );
}
