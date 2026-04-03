import { useState } from "react";
import { Power, DatabaseBackup, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface ActionDef {
  id: string;
  label: string;
  description: string;
  confirmTitle: string;
  confirmDesc: string;
  icon: React.ReactNode;
  color: string;
  destructive?: boolean;
}

const ACTIONS: ActionDef[] = [
  {
    id: "remote-fpe-shutdown",
    label: "Remote FPE Shutdown",
    description: "Remotely shut down all connected FPE units. This will terminate active sessions.",
    confirmTitle: "Shut Down FPE Units?",
    confirmDesc: "This will immediately shut down all connected FPE units. Any active training sessions will be terminated. This action cannot be undone.",
    icon: <Power className="w-6 h-6" />,
    color: "0 70% 50%",
    destructive: true,
  },
  {
    id: "backup-db",
    label: "Backup Database",
    description: "Create a full backup of the current database. This may take a few minutes.",
    confirmTitle: "Create Database Backup?",
    confirmDesc: "A full snapshot of the current database will be created and stored. This process may take a few minutes depending on database size.",
    icon: <DatabaseBackup className="w-6 h-6" />,
    color: "180 60% 45%",
  },
  {
    id: "restore-db",
    label: "Restore Database",
    description: "Restore the database from the most recent backup. Current data will be overwritten.",
    confirmTitle: "Restore Database from Backup?",
    confirmDesc: "All current data will be replaced with the most recent backup. This action is irreversible and any changes made since the last backup will be lost.",
    icon: <RotateCcw className="w-6 h-6" />,
    color: "260 60% 55%",
    destructive: true,
  },
];

export function SystemActionsPage() {
  const handleConfirm = (action: ActionDef) => {
    toast({
      title: `${action.label} initiated`,
      description: `${action.label} has been triggered successfully.`,
    });
  };

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {ACTIONS.map((action) => (
          <div
            key={action.id}
            className="rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "var(--surface-glass)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--divider)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: `hsl(${action.color} / 0.12)`, color: `hsl(${action.color})` }}
            >
              {action.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">{action.label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{action.description}</p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full rounded-xl mt-auto gap-2"
                  variant={action.destructive ? "destructive" : "outline"}
                >
                  {action.icon}
                  {action.label}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>{action.confirmTitle}</AlertDialogTitle>
                  <AlertDialogDescription>{action.confirmDesc}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={`rounded-xl ${action.destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}`}
                    onClick={() => handleConfirm(action)}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  );
}
