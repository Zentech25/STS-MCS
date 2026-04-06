import { useState } from "react";
import {
  Users, Shield, Crosshair, Wrench, Swords,
  Target, Power, Layers,
} from "lucide-react";
import { OrbatPage } from "./OrbatPage";
import { TraineePage } from "./TraineePage";
import { FiringWeaponPage } from "./FiringWeaponPage";
import { WeaponsPage } from "./WeaponsPage";
import { BatchesPage } from "./BatchesPage";
import { TargetRegionScoresPage } from "./TargetRegionScoresPage";
import { SystemActionsPage } from "./SystemActionsPage";

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
  { id: "weapons", label: "Weapons", icon: <Swords className="w-5 h-5" />, color: "200 80% 50%", description: "Manage weapon inventory" },
  { id: "firing-weapon", label: "Positions & Ranks", icon: <Crosshair className="w-5 h-5" />, color: "40 96% 53%", description: "Firing positions & rank configuration" },
  { id: "batches", label: "Batches", icon: <Layers className="w-5 h-5" />, color: "160 72% 42%", description: "Manage training batches" },
  { id: "arc-tool", label: "ARC Tool", icon: <Wrench className="w-5 h-5" />, color: "340 75% 55%", description: "ARC calibration & tools" },
  { id: "target-region-scores", label: "Target Region Scores", icon: <Target className="w-5 h-5" />, color: "4 80% 58%", description: "Scoring zones and point values" },
  { id: "system-actions", label: "System Actions", icon: <Power className="w-5 h-5" />, color: "0 70% 50%", description: "Database, FPE shutdown & maintenance" },
];

function ConfigContent({ option }: { option: ConfigOption }) {
  if (option.id === "orbat") return <OrbatPage />;
  if (option.id === "trainee") return <TraineePage />;
  if (option.id === "weapons") return <WeaponsPage />;
  if (option.id === "firing-weapon") return <FiringWeaponPage />;
  if (option.id === "batches") return <BatchesPage />;
  if (option.id === "target-region-scores") return <TargetRegionScoresPage />;
  if (option.id === "system-actions") return <SystemActionsPage />;

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
  const [hovered, setHovered] = useState(false);

  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar – expands on hover */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="shrink-0 flex flex-col gap-1 py-3 px-2 overflow-y-auto overflow-x-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          width: hovered ? 200 : 56,
          background: "var(--surface-glass)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRight: "1px solid var(--divider)",
        }}
      >
        {CONFIG_OPTIONS.map((opt) => {
          const isActive = selected.id === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt)}
              className={`relative flex items-center gap-3 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.97] ${
                hovered ? "px-3 py-2.5" : "w-10 h-10 justify-center"
              } ${isActive ? "shadow-lg" : "hover:bg-muted/50"}`}
              style={isActive ? {
                background: `hsl(${opt.color} / 0.15)`,
                color: `hsl(${opt.color})`,
                boxShadow: `0 0 12px hsl(${opt.color} / 0.2)`,
              } : {
                color: "hsl(var(--muted-foreground))",
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full transition-all duration-500"
                  style={{ background: `hsl(${opt.color})` }}
                />
              )}

              <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                {opt.icon}
              </span>

              {/* Label – only visible when expanded */}
              <span
                className={`text-xs font-semibold whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  hovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 w-0 overflow-hidden"
                }`}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main content */}
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
