import { useState } from "react";
import { Power, Plug, MonitorSmartphone, DatabaseBackup, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface FPEUnit {
  id: string;
  label: string;
  status: "online" | "offline";
}

const INITIAL_UNITS: FPEUnit[] = [
  { id: "fpe-1", label: "FPE Unit 1", status: "online" },
  { id: "fpe-2", label: "FPE Unit 2", status: "online" },
  { id: "fpe-3", label: "FPE Unit 3", status: "offline" },
  { id: "fpe-4", label: "FPE Unit 4", status: "online" },
  { id: "fpe-5", label: "FPE Unit 5", status: "online" },
  { id: "fpe-6", label: "FPE Unit 6", status: "offline" },
];

const FPE_ACCENT = "120 60% 40%";

export function SystemActionsPage() {
  const [units, setUnits] = useState<FPEUnit[]>(INITIAL_UNITS);

  const handleShutdown = (id: string) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, status: "offline" as const } : u)));
    toast({ title: "FPE Shut Down", description: `${units.find((u) => u.id === id)?.label} has been shut down.` });
  };

  const handleReconnect = (id: string) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, status: "online" as const } : u)));
    toast({ title: "FPE Reconnected", description: `${units.find((u) => u.id === id)?.label} is now online.` });
  };

  const handleShutdownAll = () => {
    setUnits((prev) => prev.map((u) => ({ ...u, status: "offline" as const })));
    toast({ title: "All FPE Units Shut Down", description: "All FPE units have been shut down." });
  };

  const handleDbAction = (action: string) => {
    toast({ title: `${action} initiated`, description: `${action} has been triggered successfully.` });
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-8 overflow-y-auto animate-fade-in">
      {/* Section 1: Database */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "hsl(180 60% 45% / 0.12)", color: "hsl(180 60% 45%)" }}
          >
            <DatabaseBackup className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">Database</h3>
        </div>
        <div className="flex gap-4 max-w-2xl">
          {/* Backup */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex-1 rounded-xl gap-2 h-12">
                <DatabaseBackup className="w-4 h-4" />
                Backup Database
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Create Database Backup?</AlertDialogTitle>
                <AlertDialogDescription>
                  A full snapshot of the current database will be created and stored. This process may take a few minutes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction className="rounded-xl" onClick={() => handleDbAction("Backup Database")}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Restore */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1 rounded-xl gap-2 h-12">
                <RotateCcw className="w-4 h-4" />
                Restore Database
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Restore Database from Backup?</AlertDialogTitle>
                <AlertDialogDescription>
                  All current data will be replaced with the most recent backup. This action is irreversible and any changes since the last backup will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => handleDbAction("Restore Database")}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="h-px w-full" style={{ background: "var(--divider)" }} />

      {/* Section 2: FPE Units */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `hsl(${FPE_ACCENT} / 0.12)`, color: `hsl(${FPE_ACCENT})` }}
          >
            <MonitorSmartphone className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">FPE Units</h3>
          <span className="text-xs text-muted-foreground ml-1">
            {units.filter((u) => u.status === "online").length} of {units.length} online
          </span>
          <div className="ml-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-xl gap-1.5"
                  disabled={units.every((u) => u.status === "offline")}
                >
                  <Power className="w-3.5 h-3.5" />
                  Shutdown All FPE
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Shut Down All FPE Units?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will immediately shut down all connected FPE units. Any active training sessions will be terminated.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleShutdownAll}
                  >
                    Shut Down All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200"
              style={{
                background: "var(--surface-glass)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--divider)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(${FPE_ACCENT} / 0.12)`, color: `hsl(${FPE_ACCENT})` }}
                >
                  <MonitorSmartphone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-foreground">{unit.label}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: unit.status === "online" ? "hsl(var(--success))" : "hsl(var(--destructive))",
                      }}
                    />
                    <span className="text-[11px] text-muted-foreground capitalize">{unit.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="flex-1 rounded-xl gap-1.5 text-xs" disabled={unit.status === "offline"}>
                      <Power className="w-3.5 h-3.5" />
                      Shut Down
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Shut Down {unit.label}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will immediately shut down {unit.label}. Any active session on this unit will be terminated.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleShutdown(unit.id)}
                      >
                        Shut Down
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 rounded-xl gap-1.5 text-xs"
                  disabled={unit.status === "online"}
                  onClick={() => handleReconnect(unit.id)}
                >
                  <Plug className="w-3.5 h-3.5" />
                  Reconnect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
