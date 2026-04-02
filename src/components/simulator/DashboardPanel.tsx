import React from "react";
import { Lock } from "lucide-react";

interface DashboardPanelProps {
  title: string;
  children: React.ReactNode;
  locked?: boolean;
  className?: string;
}

export function DashboardPanel({ title, children, locked, className = "" }: DashboardPanelProps) {
  return (
    <div className={`glass-panel p-4 relative ${locked ? "locked-feature" : ""} ${className}`}>
      <div className="panel-header">{title}</div>
      {children}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl">
          <Lock className="w-5 h-5 text-muted-foreground/40" />
        </div>
      )}
    </div>
  );
}
