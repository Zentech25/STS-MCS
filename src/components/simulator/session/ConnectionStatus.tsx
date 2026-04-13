import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";

type ConnectionId = "FRN" | "TGT" | "FPE" | "SDU";

interface ConnectionInfo {
  id: ConnectionId;
  label: string;
  description: string;
  connected: boolean;
  latency?: number;
  firmware?: string;
  lastSeen?: string;
}

// Mock connection data per lane
function getMockConnections(laneId: number): ConnectionInfo[] {
  const seed = laneId * 7;
  return [
    {
      id: "FRN",
      label: "FRN",
      description: "Firing Range Node",
      connected: (seed + 1) % 5 !== 0,
      latency: 12 + (laneId * 3) % 20,
      firmware: "v2.4.1",
      lastSeen: "Just now",
    },
    {
      id: "TGT",
      label: "TGT",
      description: "Target Controller",
      connected: (seed + 2) % 7 !== 0,
      latency: 8 + (laneId * 5) % 15,
      firmware: "v1.8.3",
      lastSeen: "2s ago",
    },
    {
      id: "FPE",
      label: "FPE",
      description: "Firing Position Equipment",
      connected: (seed + 3) % 4 !== 0,
      latency: 15 + (laneId * 2) % 25,
      firmware: "v3.1.0",
      lastSeen: "Just now",
    },
    {
      id: "SDU",
      label: "SDU",
      description: "Shot Detection Unit",
      connected: (seed + 4) % 6 !== 0,
      latency: 5 + (laneId * 4) % 10,
      firmware: "v2.0.7",
      lastSeen: "1s ago",
    },
  ];
}

/* ── Single status dot with hover popup ── */
function ConnectionDot({ conn }: { conn: ConnectionInfo }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-md cursor-default"
        style={{
          background: conn.connected
            ? "hsl(var(--success) / 0.1)"
            : "hsl(var(--destructive) / 0.1)",
          border: `1px solid ${conn.connected ? "hsl(var(--success) / 0.25)" : "hsl(var(--destructive) / 0.25)"}`,
        }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${conn.connected ? "bg-success" : "bg-destructive"}`}
          animate={
            conn.connected
              ? { boxShadow: ["0 0 2px hsl(var(--success) / 0.4)", "0 0 6px hsl(var(--success) / 0.8)", "0 0 2px hsl(var(--success) / 0.4)"] }
              : undefined
          }
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <span className="text-[7px] font-mono font-bold text-foreground/80">{conn.label}</span>
      </motion.div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[100] w-44 rounded-lg overflow-hidden pointer-events-none"
            style={{
              background: "var(--surface-glass)",
              border: `1px solid ${conn.connected ? "hsl(var(--success) / 0.3)" : "hsl(var(--destructive) / 0.3)"}`,
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              boxShadow: conn.connected
                ? "0 0 30px hsl(var(--success) / 0.15), 0 8px 24px rgba(0,0,0,0.2)"
                : "0 0 30px hsl(var(--destructive) / 0.15), 0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            {/* Header */}
            <div
              className="px-2.5 py-1.5 flex items-center gap-2"
              style={{
                background: conn.connected
                  ? "hsl(var(--success) / 0.08)"
                  : "hsl(var(--destructive) / 0.08)",
                borderBottom: "1px solid var(--divider)",
              }}
            >
              {conn.connected ? (
                <Wifi className="w-3 h-3 text-success" />
              ) : (
                <WifiOff className="w-3 h-3 text-destructive" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-foreground">{conn.label}</p>
                <p className="text-[7px] text-muted-foreground">{conn.description}</p>
              </div>
              <span
                className={`text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                  conn.connected
                    ? "bg-success/20 text-success"
                    : "bg-destructive/20 text-destructive"
                }`}
              >
                {conn.connected ? "Online" : "Offline"}
              </span>
            </div>

            {/* Details */}
            <div className="p-2 space-y-1">
              {[
                { l: "Latency", v: conn.connected ? `${conn.latency}ms` : "—" },
                { l: "Firmware", v: conn.firmware || "—" },
                { l: "Last Seen", v: conn.connected ? conn.lastSeen || "—" : "N/A" },
              ].map((item) => (
                <div key={item.l} className="flex items-center justify-between">
                  <span className="text-[7px] uppercase tracking-wider text-muted-foreground font-semibold">{item.l}</span>
                  <span className="text-[8px] font-mono text-foreground">{item.v}</span>
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
              style={{
                background: "var(--surface-glass)",
                borderRight: `1px solid ${conn.connected ? "hsl(var(--success) / 0.3)" : "hsl(var(--destructive) / 0.3)"}`,
                borderBottom: `1px solid ${conn.connected ? "hsl(var(--success) / 0.3)" : "hsl(var(--destructive) / 0.3)"}`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Row of connection dots for a lane ── */
export function ConnectionStatusRow({ laneId, compact = false }: { laneId: number; compact?: boolean }) {
  const connections = getMockConnections(laneId);

  if (compact) {
    return (
      <div className="flex items-center gap-0.5">
        {connections.map((conn) => (
          <motion.span
            key={conn.id}
            className={`w-1.5 h-1.5 rounded-full ${conn.connected ? "bg-success" : "bg-destructive"}`}
            animate={
              conn.connected
                ? { boxShadow: ["0 0 1px hsl(var(--success) / 0.3)", "0 0 4px hsl(var(--success) / 0.7)", "0 0 1px hsl(var(--success) / 0.3)"] }
                : undefined
            }
            transition={{ repeat: Infinity, duration: 2, delay: Math.random() }}
            title={`${conn.label}: ${conn.connected ? "Online" : "Offline"}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {connections.map((conn) => (
        <ConnectionDot key={conn.id} conn={conn} />
      ))}
    </div>
  );
}

export { getMockConnections };
export type { ConnectionInfo };
