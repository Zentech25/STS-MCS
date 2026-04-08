import { useState, useMemo } from "react";
import { Plus, Save, Trash2, RotateCcw, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useTrainingAssets } from "@/contexts/TrainingAssetsContext";
import { TARGETS } from "@/contexts/TargetsContext";

/* ── Types ────────────────────────────────────────────── */

const PRACTICE_TYPES = ["Grouping", "Application", "Timed", "Snap Shot"] as const;
type PracticeType = (typeof PRACTICE_TYPES)[number];

const TYPE_OF_FIRE_OPTIONS = [
  "ALL Armed and Services(Recruits) - Basic MM(Classification)",
  "Infantry - Advanced Marksmanship",
  "Special Forces - CQB",
];

interface RegionRow {
  id: string;
  regionNo: number;
  fromSector: number;
  toSector: number;
  score: number;
}

interface ScoreClassification {
  maxScore: number;
  marksMan: number;
  firstClass: number;
  standardShot: number;
}

interface ARCConfig {
  weapon: string;
  typeOfFire: string;
  nameOfPractice: string;
  firingPosition: string;
  firingRange: number;
  typeOfTarget: string;
  practiceType: PracticeType;
  roundsAllotted: number;
  timeOfPractice: "day" | "night";
  // Grouping-specific
  acceptingGroupSize: number;
  // Timed-specific
  timeSec: number;
  isBonusPoint: boolean;
  // Snap Shot-specific
  exposures: number;
  upTime: number;
  downTime: number;
  // Shared
  maxScorePerHit: number;
  scoreClassification: ScoreClassification;
  regions: RegionRow[];
}

const ACCENT = "340 75% 55%";

const defaultConfig = (): ARCConfig => ({
  weapon: "",
  typeOfFire: "",
  nameOfPractice: "",
  firingPosition: "",
  firingRange: 50,
  typeOfTarget: TARGETS[0]?.id ?? "",
  practiceType: "Grouping",
  roundsAllotted: 4,
  timeOfPractice: "day",
  acceptingGroupSize: 0,
  timeSec: 10,
  isBonusPoint: false,
  exposures: 0,
  upTime: 0,
  downTime: 0,
  maxScorePerHit: 1,
  scoreClassification: { maxScore: 4, marksMan: 3, firstClass: 2, standardShot: 1 },
  regions: [{ id: "reg1", regionNo: 1, fromSector: 1, toSector: 7, score: 1 }],
});

/* ── Helpers ──────────────────────────────────────────── */

const hasSectorTable = (type: PracticeType) => type !== "Grouping";
const hasScoreClassification = (type: PracticeType) => type !== "Grouping";

/* ── Component ────────────────────────────────────────── */

export function ARCToolPage() {
  const { weapons, positions } = useTrainingAssets();
  const [config, setConfig] = useState<ARCConfig>(defaultConfig());
  const [savedConfigs, setSavedConfigs] = useState<ARCConfig[]>([]);

  const patch = (p: Partial<ARCConfig>) => setConfig((prev) => ({ ...prev, ...p }));
  const patchClass = (p: Partial<ScoreClassification>) =>
    setConfig((prev) => ({ ...prev, scoreClassification: { ...prev.scoreClassification, ...p } }));

  const selectedTarget = TARGETS.find((t) => t.id === config.typeOfTarget);

  const addRegion = () => {
    const next = config.regions.length + 1;
    patch({
      regions: [...config.regions, { id: `reg${Date.now()}`, regionNo: next, fromSector: 1, toSector: 1, score: 1 }],
    });
  };

  const removeRegion = (id: string) => {
    patch({ regions: config.regions.filter((r) => r.id !== id) });
  };

  const updateRegion = (id: string, p: Partial<RegionRow>) => {
    patch({ regions: config.regions.map((r) => (r.id === id ? { ...r, ...p } : r)) });
  };

  const handleAdd = () => {
    if (!config.weapon || !config.nameOfPractice) {
      toast({ title: "Missing fields", description: "Please fill weapon and practice name.", variant: "destructive" });
      return;
    }
    setSavedConfigs((prev) => [...prev, { ...config }]);
    toast({ title: "ARC configuration added" });
  };

  const handleReset = () => {
    setConfig(defaultConfig());
    toast({ title: "Form reset" });
  };

  /* ── Field row helper ────────────────────────────────── */
  const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center gap-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-40 shrink-0 text-right">
        {label}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto animate-fade-in">
      {/* ─── Left: Form Fields ─── */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Common fields */}
        <FieldRow label="Weapon">
          <Select value={config.weapon} onValueChange={(v) => patch({ weapon: v })}>
            <SelectTrigger className="h-9 rounded-xl text-sm max-w-xs">
              <SelectValue placeholder="Select weapon" />
            </SelectTrigger>
            <SelectContent>
              {weapons.map((w) => (
                <SelectItem key={w.id} value={w.id}>{w.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>

        <FieldRow label="Type of Fire">
          <Select value={config.typeOfFire} onValueChange={(v) => patch({ typeOfFire: v })}>
            <SelectTrigger className="h-9 rounded-xl text-sm max-w-md">
              <SelectValue placeholder="Select type of fire" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OF_FIRE_OPTIONS.map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>

        <FieldRow label="Name of Practice">
          <Input
            value={config.nameOfPractice}
            onChange={(e) => patch({ nameOfPractice: e.target.value })}
            className="h-9 rounded-xl text-sm max-w-xs"
            placeholder="e.g. BM1(TRB)"
          />
        </FieldRow>

        <FieldRow label="Firing Position">
          <Select value={config.firingPosition} onValueChange={(v) => patch({ firingPosition: v })}>
            <SelectTrigger className="h-9 rounded-xl text-sm max-w-xs">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>

        <FieldRow label="Firing Range">
          <Input
            type="number"
            value={config.firingRange}
            onChange={(e) => patch({ firingRange: Number(e.target.value) })}
            className="h-9 rounded-xl text-sm w-24"
            min={1}
          />
        </FieldRow>

        <FieldRow label="Type of Target">
          <Select value={config.typeOfTarget} onValueChange={(v) => patch({ typeOfTarget: v })}>
            <SelectTrigger className="h-9 rounded-xl text-sm max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TARGETS.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  <div className="flex items-center gap-2">
                    <img src={t.image} alt={t.label} className="w-5 h-5 rounded object-contain bg-white" />
                    {t.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>

        <FieldRow label="Type of Practice">
          <div className="flex flex-wrap gap-2">
            {PRACTICE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => patch({ practiceType: type })}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] select-none"
                style={{
                  background: config.practiceType === type ? `hsl(${ACCENT} / 0.15)` : "hsl(var(--muted) / 0.5)",
                  color: config.practiceType === type ? `hsl(${ACCENT})` : "hsl(var(--muted-foreground))",
                  border: config.practiceType === type ? `1.5px solid hsl(${ACCENT} / 0.4)` : "1.5px solid hsl(var(--border))",
                  boxShadow: config.practiceType === type ? `0 0 10px hsl(${ACCENT} / 0.1)` : "none",
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </FieldRow>

        <FieldRow label="Rounds Allotted">
          <Input
            type="number"
            value={config.roundsAllotted}
            onChange={(e) => patch({ roundsAllotted: Number(e.target.value) })}
            className="h-9 rounded-xl text-sm w-24"
            min={1}
          />
        </FieldRow>

        <FieldRow label="Time of Practice">
          <div className="flex gap-4">
            {(["day", "night"] as const).map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="timeOfPractice"
                  checked={config.timeOfPractice === t}
                  onChange={() => patch({ timeOfPractice: t })}
                  className="accent-current"
                  style={{ accentColor: `hsl(${ACCENT})` }}
                />
                <span className="text-sm capitalize">{t}</span>
              </label>
            ))}
          </div>
        </FieldRow>

        {/* ─── Practice-specific fields ─── */}
        {config.practiceType === "Grouping" && (
          <FieldRow label="Accepting Groupsize (cm)">
            <Input
              type="number"
              value={config.acceptingGroupSize}
              onChange={(e) => patch({ acceptingGroupSize: Number(e.target.value) })}
              className="h-9 rounded-xl text-sm w-24"
              min={0}
            />
          </FieldRow>
        )}

        {config.practiceType === "Timed" && (
          <>
            <FieldRow label="Time (Sec.)">
              <Input
                type="number"
                value={config.timeSec}
                onChange={(e) => patch({ timeSec: Number(e.target.value) })}
                className="h-9 rounded-xl text-sm w-24"
                min={0}
              />
            </FieldRow>
            <FieldRow label="Is Bonus Point">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.isBonusPoint}
                  onChange={(e) => patch({ isBonusPoint: e.target.checked })}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: `hsl(${ACCENT})` }}
                />
                <span className="text-sm text-muted-foreground">Enable bonus scoring</span>
              </label>
            </FieldRow>
          </>
        )}

        {config.practiceType === "Snap Shot" && (
          <>
            <FieldRow label="Exposures">
              <Input
                type="number"
                value={config.exposures}
                onChange={(e) => patch({ exposures: Number(e.target.value) })}
                className="h-9 rounded-xl text-sm w-24"
                min={0}
              />
            </FieldRow>
            <FieldRow label="UpTime (Sec.)">
              <Input
                type="number"
                value={config.upTime}
                onChange={(e) => patch({ upTime: Number(e.target.value) })}
                className="h-9 rounded-xl text-sm w-24"
                min={0}
              />
            </FieldRow>
            <FieldRow label="Down Time (Sec.)">
              <Input
                type="number"
                value={config.downTime}
                onChange={(e) => patch({ downTime: Number(e.target.value) })}
                className="h-9 rounded-xl text-sm w-24"
                min={0}
              />
            </FieldRow>
          </>
        )}

        {/* Max Score Per Hit – all types */}
        <FieldRow label="Max. Score per Hit">
          <Input
            type="number"
            value={config.maxScorePerHit}
            onChange={(e) => patch({ maxScorePerHit: Number(e.target.value) })}
            className="h-9 rounded-xl text-sm w-24"
            min={0}
          />
        </FieldRow>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4 pt-4" style={{ borderTop: "1px solid var(--divider)" }}>
          <Button className="h-9 rounded-xl gap-2" style={{ background: `hsl(${ACCENT})`, color: "#fff" }} onClick={handleAdd}>
            <Plus className="w-4 h-4" /> Add
          </Button>
          <Button variant="outline" className="h-9 rounded-xl gap-2" onClick={() => toast({ title: "Configuration updated" })}>
            <Save className="w-4 h-4" /> Update
          </Button>
          <Button variant="outline" className="h-9 rounded-xl gap-2 text-destructive hover:bg-destructive/10" onClick={() => toast({ title: "Configuration deleted", variant: "destructive" })}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
          <Button variant="outline" className="h-9 rounded-xl gap-2" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>
      </div>

      {/* ─── Right: Target preview + Region table + Score Classification ─── */}
      <div className="w-full lg:w-[420px] flex flex-col gap-5 shrink-0">
        {/* Target preview */}
        {selectedTarget && (
          <div
            className="rounded-2xl overflow-hidden flex items-center justify-center p-4"
            style={{ background: "var(--surface-glass)", border: "1px solid var(--divider)" }}
          >
            <img
              src={selectedTarget.image}
              alt={selectedTarget.label}
              className="w-48 h-48 object-contain rounded-xl"
              style={{ background: "hsl(0 0% 95%)" }}
            />
          </div>
        )}

        {/* Region Scores Table – Application, Timed, Snap Shot */}
        {hasSectorTable(config.practiceType) && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--surface-glass)", border: "1px solid var(--divider)", backdropFilter: "blur(12px)" }}
          >
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid var(--divider)" }}>
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Region Scores</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 rounded-lg gap-1 text-[11px]" onClick={addRegion}>
                  <PlusCircle className="w-3 h-3" /> Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-lg text-[11px]"
                  onClick={() => patch({ regions: [{ id: "reg1", regionNo: 1, fromSector: 1, toSector: 7, score: 1 }] })}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div
              className="grid grid-cols-[60px_1fr_1fr_1fr_40px] text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2"
              style={{ borderBottom: "1px solid var(--divider)" }}
            >
              <span>Region</span>
              <span>From</span>
              <span>To</span>
              <span>Score</span>
              <span />
            </div>

            <div className="max-h-[180px] overflow-y-auto">
              {config.regions.map((reg, idx) => (
                <div
                  key={reg.id}
                  className="grid grid-cols-[60px_1fr_1fr_1fr_40px] items-center px-4 py-1.5"
                  style={{ borderBottom: idx < config.regions.length - 1 ? "1px solid var(--divider)" : "none" }}
                >
                  <span className="text-xs font-mono" style={{ color: `hsl(${ACCENT})` }}>{reg.regionNo}</span>
                  <Input
                    type="number"
                    value={reg.fromSector}
                    onChange={(e) => updateRegion(reg.id, { fromSector: Number(e.target.value) })}
                    className="h-7 rounded-lg text-xs w-16"
                    min={1}
                  />
                  <Input
                    type="number"
                    value={reg.toSector}
                    onChange={(e) => updateRegion(reg.id, { toSector: Number(e.target.value) })}
                    className="h-7 rounded-lg text-xs w-16"
                    min={1}
                  />
                  <Input
                    type="number"
                    value={reg.score}
                    onChange={(e) => updateRegion(reg.id, { score: Number(e.target.value) })}
                    className="h-7 rounded-lg text-xs w-16"
                    min={0}
                  />
                  <button
                    onClick={() => removeRegion(reg.id)}
                    className="p-1 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Score Classification – Application, Timed, Snap Shot */}
        {hasScoreClassification(config.practiceType) && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--surface-glass)", border: "1px solid var(--divider)", backdropFilter: "blur(12px)" }}
          >
            <div className="px-4 py-2.5" style={{ borderBottom: "1px solid var(--divider)" }}>
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Score Classification</span>
            </div>
            <div className="flex flex-col gap-2.5 p-4">
              {([
                { label: "Max. Score", key: "maxScore" as const },
                { label: "Marks Man", key: "marksMan" as const },
                { label: "First Class", key: "firstClass" as const },
                { label: "Standard Shot", key: "standardShot" as const },
              ]).map(({ label, key }) => (
                <div key={key} className="flex items-center gap-3">
                  <label className="text-xs font-medium text-muted-foreground w-28 text-right">{label}</label>
                  <Input
                    type="number"
                    value={config.scoreClassification[key]}
                    onChange={(e) => patchClass({ [key]: Number(e.target.value) })}
                    className="h-8 rounded-lg text-sm w-20"
                    min={0}
                    disabled={key === "maxScore"}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
