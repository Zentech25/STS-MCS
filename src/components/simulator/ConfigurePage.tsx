import { useState } from "react";
import {
  Users, Shield, Layers, Crosshair, Wrench, Swords,
  Award, Target, Power, DatabaseBackup, RotateCcw, RefreshCw,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { OrbatPage } from "./OrbatPage";
import { TraineePage } from "./TraineePage";
import { FiringWeaponPage } from "./FiringWeaponPage";

interface ConfigOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const CONFIG_OPTIONS: ConfigOption[] = [
  { id: "trainee", label: "Trainee", icon: <Users className="w-5 h-5" />, color: "217 91% 60%", description: "Manage trainee profiles and assignments" },
  { id: "orbat", label: "ORBAT", icon: <Shield className="w-5 h-5" />, color: "280 65% 60%", description: "Order of Battle configuration" },
  { id: "batch", label: "Batch", icon: <Layers className="w-5 h-5" />, color: "160 72% 42%", description: "Batch training session setup" },
  { id: "firing-weapon", label: "Position, Weapons & Ranks", icon: <Crosshair className="w-5 h-5" />, color: "40 96% 53%", description: "Firing positions, weapon & rank configurations" },
  { id: "arc-tool", label: "ARC Tool", icon: <Wrench className="w-5 h-5" />, color: "340 75% 55%", description: "ARC calibration & tools" },
  { id: "target-region-scores", label: "Target Region Scores", icon: <Target className="w-5 h-5" />, color: "4 80% 58%", description: "Scoring zones and point values" },
  { id: "remote-fpe-shutdown", label: "Remote FPE Shutdown", icon: <Power className="w-5 h-5" />, color: "0 70% 50%", description: "Remote shutdown of FPE units" },
  { id: "backup-db", label: "Backup DB", icon: <DatabaseBackup className="w-5 h-5" />, color: "180 60% 45%", description: "Create database backups" },
  { id: "restore-db", label: "Restore DB", icon: <RotateCcw className="w-5 h-5" />, color: "260 60% 55%", description: "Restore from backup" },
  { id: "restart-fpe", label: "Restart FPE", icon: <RefreshCw className="w-5 h-5" />, color: "120 60% 40%", description: "Restart FPE service" },
];

function ConfigContent({ option }: { option: ConfigOption }) {
  if (option.id === "orbat") {
    return <OrbatPage />;
  }
  if (option.id === "trainee") {
    return <TraineePage />;
  }
  if (option.id === "firing-weapon") {
    return <FiringWeaponPage />;
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 animate-fade-in" key={option.id}>
      <div className="glass-panel p-10 text-center max-w-md">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: `hsl(${option.color} / 0.1)`, color: `hsl(${option.color})` }}
        >
          {option.icon}
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">{option.label}</h3>
        <p className="text-sm text-muted-foreground">{option.description}</p>
        <p className="text-xs text-muted-foreground/60 mt-4 font-mono">Configuration panel coming soon</p>
      </div>
    </div>
  );
}

export function ConfigurePage() {
  const [selected, setSelected] = useState<ConfigOption>(CONFIG_OPTIONS[0]);

  return (
    <div className="h-full flex overflow-hidden">
      {/* Side rail */}
      <div
        className="shrink-0 flex flex-col gap-1 py-3 px-2 overflow-y-auto"
        style={{
          background: "var(--surface-glass)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRight: "1px solid var(--divider)",
        }}
      >
        {CONFIG_OPTIONS.map((opt) => {
          const isActive = selected.id === opt.id;
          return (
            <Tooltip key={opt.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSelected(opt)}
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isActive ? "shadow-lg" : "hover:bg-muted/50"
                  }`}
                  style={isActive ? {
                    background: `hsl(${opt.color} / 0.15)`,
                    color: `hsl(${opt.color})`,
                    boxShadow: `0 0 12px hsl(${opt.color} / 0.2)`,
                  } : {
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  {opt.icon}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                      style={{ background: `hsl(${opt.color})` }}
                    />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs font-semibold">
                {opt.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Header + Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="shrink-0 flex items-center gap-3 px-6 py-3" style={{ borderBottom: "1px solid var(--divider)" }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `hsl(${selected.color} / 0.12)`, color: `hsl(${selected.color})` }}
          >
            {selected.icon}
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">{selected.label}</h2>
            <p className="text-[11px] text-muted-foreground">{selected.description}</p>
          </div>
        </div>
        <ConfigContent option={selected} />
      </div>
    </div>
  );
}
