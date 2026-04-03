import { useState } from "react";
import {
  Users, Shield, Layers, Crosshair, Wrench, Swords,
  Award, Target, Power, DatabaseBackup, RotateCcw, RefreshCw,
  ArrowLeft,
} from "lucide-react";

interface ConfigOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const CONFIG_OPTIONS: ConfigOption[] = [
  { id: "trainee", label: "Trainee", icon: <Users className="w-6 h-6" />, color: "217 91% 60%", description: "Manage trainee profiles and assignments" },
  { id: "orbat", label: "ORBAT", icon: <Shield className="w-6 h-6" />, color: "280 65% 60%", description: "Order of Battle configuration" },
  { id: "batch", label: "Batch", icon: <Layers className="w-6 h-6" />, color: "160 72% 42%", description: "Batch training session setup" },
  { id: "firing-position", label: "Firing Position", icon: <Crosshair className="w-6 h-6" />, color: "40 96% 53%", description: "Configure firing positions & lanes" },
  { id: "arc-tool", label: "ARC Tool", icon: <Wrench className="w-6 h-6" />, color: "340 75% 55%", description: "ARC calibration & tools" },
  { id: "weapon-details", label: "Weapon Details", icon: <Swords className="w-6 h-6" />, color: "200 80% 50%", description: "Weapon types and specifications" },
  { id: "rank-details", label: "Rank Details", icon: <Award className="w-6 h-6" />, color: "30 90% 55%", description: "Military rank configuration" },
  { id: "target-region-scores", label: "Target Region Scores", icon: <Target className="w-6 h-6" />, color: "4 80% 58%", description: "Scoring zones and point values" },
  { id: "remote-fpe-shutdown", label: "Remote FPE Shutdown", icon: <Power className="w-6 h-6" />, color: "0 70% 50%", description: "Remote shutdown of FPE units" },
  { id: "backup-db", label: "Backup DB", icon: <DatabaseBackup className="w-6 h-6" />, color: "180 60% 45%", description: "Create database backups" },
  { id: "restore-db", label: "Restore DB", icon: <RotateCcw className="w-6 h-6" />, color: "260 60% 55%", description: "Restore from backup" },
  { id: "restart-fpe", label: "Restart FPE", icon: <RefreshCw className="w-6 h-6" />, color: "120 60% 40%", description: "Restart FPE service" },
];

function HexButton({ option, index, onClick }: { option: ConfigOption; index: number; onClick: () => void }) {
  const delay = index * 60;

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
      style={{
        width: 140,
        height: 160,
        animationDelay: `${delay}ms`,
        animation: `hex-appear 0.5s ease-out ${delay}ms both`,
      }}
    >
      {/* Hex shape */}
      <svg viewBox="0 0 140 160" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`hex-grad-${option.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`hsl(${option.color})`} stopOpacity="0.15" />
            <stop offset="100%" stopColor={`hsl(${option.color})`} stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id={`hex-stroke-${option.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`hsl(${option.color})`} stopOpacity="0.5" />
            <stop offset="100%" stopColor={`hsl(${option.color})`} stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          d="M70 4 L134 42 L134 118 L70 156 L6 118 L6 42 Z"
          fill={`url(#hex-grad-${option.id})`}
          stroke={`url(#hex-stroke-${option.id})`}
          strokeWidth="1.5"
          className="transition-all duration-300 group-hover:stroke-[2.5]"
          style={{
            filter: "drop-shadow(0 4px 12px hsl(0 0% 0% / 0.08))",
          }}
        />
        {/* Hover glow overlay */}
        <path
          d="M70 4 L134 42 L134 118 L70 156 L6 118 L6 42 Z"
          fill={`hsl(${option.color})`}
          className="opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg"
          style={{
            background: `hsl(${option.color} / 0.12)`,
            color: `hsl(${option.color})`,
          }}
        >
          {option.icon}
        </div>
        <span className="text-[10px] font-semibold text-foreground/80 group-hover:text-foreground transition-colors text-center leading-tight max-w-[100px]">
          {option.label}
        </span>
      </div>
    </button>
  );
}

function ConfigSubPage({ option, onBack }: { option: ConfigOption; onBack: () => void }) {
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="shrink-0 flex items-center gap-3 px-6 py-4" style={{
        borderBottom: "1px solid var(--divider)",
      }}>
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: "var(--surface-elevated)", border: "1px solid var(--divider)" }}
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `hsl(${option.color} / 0.12)`, color: `hsl(${option.color})` }}
        >
          {option.icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">{option.label}</h2>
          <p className="text-[11px] text-muted-foreground">{option.description}</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
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
    </div>
  );
}

export function ConfigurePage() {
  const [selectedOption, setSelectedOption] = useState<ConfigOption | null>(null);

  if (selectedOption) {
    return <ConfigSubPage option={selectedOption} onBack={() => setSelectedOption(null)} />;
  }

  // Honeycomb layout: rows with offset
  const rows = [
    CONFIG_OPTIONS.slice(0, 4),
    CONFIG_OPTIONS.slice(4, 8),
    CONFIG_OPTIONS.slice(8, 12),
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="text-xl font-bold text-foreground tracking-tight">System Configuration</h1>
        <p className="text-xs text-muted-foreground mt-1">Select a module to configure</p>
      </div>

      <div className="flex flex-col items-center" style={{ gap: "-20px" }}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center justify-center"
            style={{
              marginTop: rowIndex > 0 ? -28 : 0,
              marginLeft: rowIndex % 2 === 1 ? 75 : 0,
            }}
          >
            {row.map((option, colIndex) => (
              <HexButton
                key={option.id}
                option={option}
                index={rowIndex * 4 + colIndex}
                onClick={() => setSelectedOption(option)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
