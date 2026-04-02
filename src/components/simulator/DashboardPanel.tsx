import React from "react";

interface DashboardPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function DashboardPanel({ title, children, className = "", glow }: DashboardPanelProps) {
  return (
    <div className={`${glow ? "glass-panel-glow" : "glass-panel"} p-4 ${className}`}>
      <div className="panel-header">{title}</div>
      {children}
    </div>
  );
}
