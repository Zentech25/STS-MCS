import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Crosshair, Clock, Eye, Target, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTrainingAssets } from "@/contexts/TrainingAssetsContext";
import { useARC, ARCConfig } from "@/contexts/ARCContext";
import { getTargetById } from "@/contexts/TargetsContext";
import { LaneAssignment } from "./types";

interface Props {
  lanes: LaneAssignment[];
  onBack: () => void;
  onNext: (configs: Record<number, ARCConfig>) => void;
  exerciseMode: "custom" | "arc";
  onModeChange: (mode: "custom" | "arc") => void;
}

export function ARCSetupStep({ lanes, onBack, onNext, exerciseMode, onModeChange }: Props) {
  const { weapons } = useTrainingAssets();
  const { fireMap, savedConfigs } = useARC();

  const activeLanes = lanes.filter((l) => l.queue.length > 0);

  /* Per-lane selections */
  const [laneSelections, setLaneSelections] = useState<
    Record<number, { weapon: string; fireType: string; practice: string }>
  >(() =>
    Object.fromEntries(activeLanes.map((l) => [l.laneId, { weapon: "", fireType: "", practice: "" }]))
  );

  const patchLane = (laneId: number, p: Partial<{ weapon: string; fireType: string; practice: string }>) => {
    setLaneSelections((prev) => {
      const cur = prev[laneId] || { weapon: "", fireType: "", practice: "" };
      const next = { ...cur, ...p };
      // Reset children on parent change
      if (p.weapon !== undefined) { next.fireType = ""; next.practice = ""; }
      if (p.fireType !== undefined && p.weapon === undefined) { next.practice = ""; }
      return { ...prev, [laneId]: next };
    });
  };

  const getFireTypes = (weaponId: string) => fireMap[weaponId] ?? [];
  const getPractices = (weaponId: string, fireTypeId: string) => {
    const ft = getFireTypes(weaponId).find((f) => f.id === fireTypeId);
    return ft?.practices ?? [];
  };

  const getConfig = (weaponId: string, fireTypeId: string, practice: string): ARCConfig | undefined =>
    savedConfigs.find((c) => c.weapon === weaponId && c.typeOfFire === fireTypeId && c.nameOfPractice === practice);

  /* Available weapons = only those that have fire types configured */
  const availableWeapons = useMemo(
    () => weapons.filter((w) => (fireMap[w.id]?.length ?? 0) > 0),
    [weapons, fireMap]
  );

  const allConfigured = activeLanes.every((l) => {
    const s = laneSelections[l.laneId];
    return s && s.weapon && s.fireType && s.practice && getConfig(s.weapon, s.fireType, s.practice);
  });

  const handleNext = () => {
    const configs: Record<number, ARCConfig> = {};
    for (const l of activeLanes) {
      const s = laneSelections[l.laneId];
      const cfg = getConfig(s.weapon, s.fireType, s.practice);
      if (cfg) configs[l.laneId] = cfg;
    }
    onNext(configs);
  };

  const btnBase =
    "h-10 px-5 rounded-xl font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none";

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Nav */}
      <div className="flex items-center justify-between shrink-0">
        <button onClick={onBack} className={`${btnBase} glass-btn text-muted-foreground hover:text-foreground hover:scale-[1.03] active:scale-[0.97]`}>
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <button onClick={handleNext} disabled={!allConfigured} className={`${btnBase} text-primary-foreground shadow-lg hover:scale-[1.03] active:scale-[0.97]`} style={{ background: "var(--gradient-primary)" }}>
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Lane cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeLanes.map((lane) => {
            const sel = laneSelections[lane.laneId] || { weapon: "", fireType: "", practice: "" };
            const fireTypes = getFireTypes(sel.weapon);
            const practices = getPractices(sel.weapon, sel.fireType);
            const cfg = sel.practice ? getConfig(sel.weapon, sel.fireType, sel.practice) : undefined;
            const target = cfg ? getTargetById(cfg.typeOfTarget) : undefined;

            return (
              <div
                key={lane.laneId}
                className="glass-panel rounded-2xl p-4 flex flex-col gap-3"
              >
                {/* Lane header */}
                <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid var(--divider)" }}>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    L{lane.laneId}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Lane {lane.laneId}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {lane.queue.map((t) => t.name).join(", ")}
                    </p>
                  </div>
                </div>

                {/* Weapon */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Weapon</label>
                  <Select value={sel.weapon} onValueChange={(v) => patchLane(lane.laneId, { weapon: v })}>
                    <SelectTrigger className="h-9 rounded-xl text-sm">
                      <SelectValue placeholder="Select weapon" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableWeapons.map((w) => (
                        <SelectItem key={w.id} value={w.id}>{w.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type of Fire – only visible after weapon */}
                {sel.weapon && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Type of Fire</label>
                    <Select value={sel.fireType} onValueChange={(v) => patchLane(lane.laneId, { fireType: v })}>
                      <SelectTrigger className="h-9 rounded-xl text-sm">
                        <SelectValue placeholder="Select type of fire" />
                      </SelectTrigger>
                      <SelectContent>
                        {fireTypes.map((f) => (
                          <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Name of Practice – only visible after fire type */}
                {sel.weapon && sel.fireType && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Name of Practice</label>
                    <Select value={sel.practice} onValueChange={(v) => patchLane(lane.laneId, { practice: v })}>
                      <SelectTrigger className="h-9 rounded-xl text-sm">
                        <SelectValue placeholder="Select practice" />
                      </SelectTrigger>
                      <SelectContent>
                        {practices.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Config details – shown after practice selected */}
                {cfg && (
                  <div className="animate-fade-in mt-1 space-y-3">
                    <div className="h-px w-full" style={{ background: "var(--divider)" }} />

                    {/* Target preview */}
                    {target && (
                      <div className="flex justify-center">
                        <div
                          className="w-28 h-28 rounded-xl overflow-hidden flex items-center justify-center"
                          style={{ background: "var(--surface-inset)" }}
                        >
                          <img
                            src={target.image}
                            alt={target.label}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                    )}

                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <DetailChip icon={<Crosshair className="w-3 h-3" />} label="Position" value={cfg.firingPosition || "—"} />
                      <DetailChip icon={<Target className="w-3 h-3" />} label="Range" value={`${cfg.firingRange}m`} />
                      <DetailChip icon={<Zap className="w-3 h-3" />} label="Rounds" value={String(cfg.roundsAllotted)} />
                      <DetailChip icon={<Eye className="w-3 h-3" />} label="Practice" value={cfg.practiceType} />
                      <DetailChip icon={<Clock className="w-3 h-3" />} label="Time" value={cfg.timeOfPractice === "day" ? "Day" : "Night"} />
                      {cfg.practiceType === "Grouping" && (
                        <DetailChip icon={<Target className="w-3 h-3" />} label="Group Size" value={`${cfg.acceptingGroupSize}cm`} />
                      )}
                      {cfg.practiceType === "Timed" && (
                        <DetailChip icon={<Clock className="w-3 h-3" />} label="Time Limit" value={`${cfg.timeSec}s`} />
                      )}
                      {cfg.practiceType === "Snap Shot" && (
                        <>
                          <DetailChip icon={<Zap className="w-3 h-3" />} label="Exposures" value={String(cfg.exposures)} />
                          <DetailChip icon={<Clock className="w-3 h-3" />} label="Up/Down" value={`${cfg.upTime}s/${cfg.downTime}s`} />
                        </>
                      )}
                    </div>

                    {/* Score Classification */}
                    {cfg.practiceType !== "Grouping" && (
                      <div className="p-2 rounded-xl" style={{ background: "var(--surface-elevated)", border: "1px solid var(--divider)" }}>
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Score Classification</p>
                        <div className="grid grid-cols-4 gap-1 text-center">
                          {[
                            { label: "Max", value: cfg.scoreClassification.maxScore },
                            { label: "Marksman", value: cfg.scoreClassification.marksMan },
                            { label: "1st Class", value: cfg.scoreClassification.firstClass },
                            { label: "Standard", value: cfg.scoreClassification.standardShot },
                          ].map((s) => (
                            <div key={s.label}>
                              <p className="text-[9px] text-muted-foreground">{s.label}</p>
                              <p className="text-xs font-bold font-mono text-foreground">{s.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {activeLanes.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No lanes have trainees assigned. Go back to Group Setup.
          </div>
        )}
      </div>
    </div>
  );
}

function DetailChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "var(--surface-elevated)", border: "1px solid var(--divider)" }}>
      <span className="text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-[11px] font-semibold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
