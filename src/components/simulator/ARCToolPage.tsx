import { useState, useMemo } from "react";
import { Plus, Save, Trash2, RotateCcw, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useTrainingAssets } from "@/contexts/TrainingAssetsContext";
import { TARGETS } from "@/contexts/TargetsContext";
import {
  useARC,
  PRACTICE_TYPES,
  type PracticeType,
  type FireTypeEntry,
  type WeaponFireMap,
  type RegionRow,
  type ScoreClassification,
  type ARCConfig,
  defaultARCConfig,
} from "@/contexts/ARCContext";

const hasSectorTable = (type: PracticeType) => type !== "Grouping";
const hasScoreClassification = (type: PracticeType) => type !== "Grouping";

const ACCENT = "340 75% 55%";

/* ── Component ────────────────────────────────────────── */

export function ARCToolPage() {
  const { weapons, setWeapons, positions } = useTrainingAssets();
  const { fireMap, setFireMap, savedConfigs, setSavedConfigs } = useARC();
  const [config, setConfig] = useState<ARCConfig>(defaultARCConfig());

  /* ── Inline add mode: which field is in "text input" mode ── */
  const [addingField, setAddingField] = useState<"weapon" | "fire" | "practice" | null>(null);
  const [inlineValue, setInlineValue] = useState("");

  const fireTypesForWeapon = useMemo(
    () => (config.weapon ? fireMap[config.weapon] ?? [] : []),
    [config.weapon, fireMap]
  );

  const practicesForFire = useMemo(() => {
    const ft = fireTypesForWeapon.find((f) => f.id === config.typeOfFire);
    return ft?.practices ?? [];
  }, [fireTypesForWeapon, config.typeOfFire]);

  /* Is there already a saved config for this practice? */
  const isExistingPractice = config.nameOfPractice !== "" && savedConfigs.some(
    (c) => c.weapon === config.weapon && c.typeOfFire === config.typeOfFire && c.nameOfPractice === config.nameOfPractice
  );

  const patch = (p: Partial<ARCConfig>) => setConfig((prev) => ({ ...prev, ...p }));
  const patchClass = (p: Partial<ScoreClassification>) =>
    setConfig((prev) => ({ ...prev, scoreClassification: { ...prev.scoreClassification, ...p } }));

  const selectedTarget = TARGETS.find((t) => t.id === config.typeOfTarget);

  /* ── Inline confirm handlers ── */
  const confirmInlineAdd = () => {
    const val = inlineValue.trim();
    if (!val) return;

    if (addingField === "weapon") {
      const id = val.toLowerCase().replace(/\s+/g, "-");
      if (weapons.some((w) => w.id === id)) {
        toast({ title: "Weapon already exists", variant: "destructive" });
        return;
      }
      setWeapons((prev) => [...prev, { id, label: val }]);
      patch({ weapon: id, typeOfFire: "", nameOfPractice: "" });
      toast({ title: "Weapon added", description: `"${val}" added to weapons.` });
    } else if (addingField === "fire") {
      if (!config.weapon) { toast({ title: "Select a weapon first", variant: "destructive" }); return; }
      const id = val.toLowerCase().replace(/\s+/g, "-");
      const existing = fireMap[config.weapon] ?? [];
      if (existing.some((f) => f.id === id || f.label.toLowerCase() === val.toLowerCase())) {
        toast({ title: "Type of Fire already exists", description: `"${val}" already exists for this weapon.`, variant: "destructive" });
        return;
      }
      setFireMap((prev) => ({
        ...prev,
        [config.weapon]: [...(prev[config.weapon] ?? []), { id, label: val, practices: [] }],
      }));
      patch({ typeOfFire: id, nameOfPractice: "" });
      toast({ title: "Type of Fire added" });
    } else if (addingField === "practice") {
      if (!config.weapon || !config.typeOfFire) { toast({ title: "Select weapon & fire type first", variant: "destructive" }); return; }
      if (practicesForFire.some((p) => p.toLowerCase() === val.toLowerCase())) {
        toast({ title: "Practice already exists", description: `"${val}" already exists for this fire type.`, variant: "destructive" });
        return;
      }
      setFireMap((prev) => {
        const entries = prev[config.weapon] ?? [];
        return {
          ...prev,
          [config.weapon]: entries.map((f) =>
            f.id === config.typeOfFire
              ? { ...f, practices: [...f.practices, val] }
              : f
          ),
        };
      });
      patch({ nameOfPractice: val });
      toast({ title: "Practice added" });
    }
    cancelInlineAdd();
  };

  const cancelInlineAdd = () => {
    setAddingField(null);
    setInlineValue("");
  };

  const startInlineAdd = (field: "weapon" | "fire" | "practice") => {
    setAddingField(field);
    setInlineValue("");
  };

  /* ── Region management ── */
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

  /* ── Bottom action handlers ── */
  const handleAdd = () => {
    if (!config.weapon || !config.nameOfPractice) {
      toast({ title: "Missing fields", description: "Please fill weapon and practice name.", variant: "destructive" });
      return;
    }
    // Check if this practice config already exists
    const exists = savedConfigs.some(
      (c) => c.weapon === config.weapon && c.typeOfFire === config.typeOfFire && c.nameOfPractice === config.nameOfPractice
    );
    if (exists) {
      toast({ title: "Configuration already exists", description: "Use Update to modify an existing configuration.", variant: "destructive" });
      return;
    }
    setSavedConfigs((prev) => [...prev, { ...config }]);
    toast({ title: "ARC configuration added" });
  };

  const handleUpdate = () => {
    if (!config.weapon || !config.nameOfPractice) {
      toast({ title: "Missing fields", description: "Please fill weapon and practice name.", variant: "destructive" });
      return;
    }
    const idx = savedConfigs.findIndex(
      (c) => c.weapon === config.weapon && c.typeOfFire === config.typeOfFire && c.nameOfPractice === config.nameOfPractice
    );
    if (idx === -1) {
      toast({ title: "No existing config found", description: "Use Add for new configurations.", variant: "destructive" });
      return;
    }
    setSavedConfigs((prev) => prev.map((c, i) => (i === idx ? { ...config } : c)));
    toast({ title: "Configuration updated" });
  };

  const handleReset = () => {
    setConfig(defaultARCConfig());
    cancelInlineAdd();
    toast({ title: "Form reset" });
  };

  /* ── Inline field renderer ── */
  const renderInlineField = (
    placeholder: string,
  ) => (
    <div className="flex items-center gap-2 flex-1">
      <Input
        autoFocus
        value={inlineValue}
        onChange={(e) => setInlineValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") confirmInlineAdd();
          if (e.key === "Escape") cancelInlineAdd();
        }}
        placeholder={placeholder}
        className="h-9 rounded-xl text-sm max-w-xs"
      />
      <Button
        size="sm"
        className="h-9 w-9 p-0 rounded-xl shrink-0"
        style={{ background: `hsl(${ACCENT})`, color: "#fff" }}
        onClick={confirmInlineAdd}
        title="Confirm"
      >
        <Plus className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-9 w-9 p-0 rounded-xl shrink-0"
        onClick={cancelInlineAdd}
        title="Cancel"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );

  /* ── Field row helper ── */
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
        {/* Weapon */}
        <FieldRow label="Weapon">
          {addingField === "weapon" ? (
            renderInlineField("e.g. M16A4")
          ) : (
            <Select value={config.weapon} onValueChange={(v) => { patch({ weapon: v, typeOfFire: "", nameOfPractice: "" }); cancelInlineAdd(); }}>
              <SelectTrigger className="h-9 rounded-xl text-sm max-w-xs">
                <SelectValue placeholder="Select weapon" />
              </SelectTrigger>
              <SelectContent>
                {weapons.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FieldRow>

        {/* Type of Fire */}
        <FieldRow label="Type of Fire">
          {addingField === "fire" ? (
            renderInlineField("e.g. Infantry - Advanced Marksmanship")
          ) : (
            <div className="flex items-center gap-2">
              <Select value={config.typeOfFire} onValueChange={(v) => { patch({ typeOfFire: v, nameOfPractice: "" }); cancelInlineAdd(); }}>
                <SelectTrigger className="h-9 rounded-xl text-sm max-w-md">
                  <SelectValue placeholder={config.weapon ? "Select type of fire" : "Select a weapon first"} />
                </SelectTrigger>
                <SelectContent>
                  {fireTypesForWeapon.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 p-0 rounded-xl shrink-0"
                style={{ borderColor: `hsl(${ACCENT} / 0.4)`, color: `hsl(${ACCENT})` }}
                onClick={() => startInlineAdd("fire")}
                title="Add new type of fire"
                disabled={!config.weapon}
              >
                <PlusCircle className="w-4 h-4" />
              </Button>
            </div>
          )}
        </FieldRow>

        {/* Name of Practice */}
        <FieldRow label="Name of Practice">
          {addingField === "practice" ? (
            renderInlineField("e.g. BM1(TRB)")
          ) : (
            <div className="flex items-center gap-2">
              <Select value={config.nameOfPractice} onValueChange={(v) => {
                cancelInlineAdd();
                const existing = savedConfigs.find(
                  (c) => c.weapon === config.weapon && c.typeOfFire === config.typeOfFire && c.nameOfPractice === v
                );
                if (existing) {
                  setConfig({ ...existing });
                } else {
                  patch({ nameOfPractice: v });
                }
              }}>
                <SelectTrigger className="h-9 rounded-xl text-sm max-w-xs">
                  <SelectValue placeholder={config.typeOfFire ? "Select practice" : "Select fire type first"} />
                </SelectTrigger>
                <SelectContent>
                  {practicesForFire.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 p-0 rounded-xl shrink-0"
                style={{ borderColor: `hsl(${ACCENT} / 0.4)`, color: `hsl(${ACCENT})` }}
                onClick={() => startInlineAdd("practice")}
                title="Add new practice"
                disabled={!config.typeOfFire}
              >
                <PlusCircle className="w-4 h-4" />
              </Button>
            </div>
          )}
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
          <Select value={String(config.firingRange)} onValueChange={(v) => patch({ firingRange: Number(v) })}>
            <SelectTrigger className="h-9 rounded-xl text-sm w-32">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100, 200, 300, 400].map((r) => (
                <SelectItem key={r} value={String(r)}>{r} m</SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        {/* Practice-specific fields */}
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

        {/* Max Score Per Hit */}
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
          <Button
            className="h-9 rounded-xl gap-2"
            style={{ background: `hsl(${ACCENT})`, color: "#fff" }}
            onClick={handleAdd}
            disabled={isExistingPractice}
            title={isExistingPractice ? "This practice already exists. Use Update to modify." : "Add new configuration"}
          >
            <Plus className="w-4 h-4" /> Add
          </Button>
          <Button
            variant="outline"
            className="h-9 rounded-xl gap-2"
            onClick={handleUpdate}
            disabled={!isExistingPractice}
            title={!isExistingPractice ? "Select an existing practice to update" : "Update configuration"}
          >
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
