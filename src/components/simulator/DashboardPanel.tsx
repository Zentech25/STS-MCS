import React from "react";

interface DashboardPanelProps {
  title: string;
  children: React.ReactNode;
  locked?: boolean;
  className?: string;
}

export function DashboardPanel({ title, children, locked, className = "" }: DashboardPanelProps) {
  return (
    <div className={`glass-panel p-4 ${locked ? "locked-feature" : ""} ${className}`}>
      <div className="panel-header">{title}</div>
      {children}
    </div>
  );
}
