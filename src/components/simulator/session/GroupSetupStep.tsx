import { useState, useEffect } from "react";
import { Users, Plus, Save, FolderOpen, X, ChevronRight, Search, UserPlus, Trash2, Pencil, Check } from "lucide-react";
import { LaneAssignment, SavedGroup, Trainee } from "./types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Mock trainee pool
const TRAINEE_POOL: Trainee[] = Array.from({ length: 30 }, (_, i) => {
  const ranks = ["Pvt", "LCpl", "Cpl", "Sgt", "SSgt", "Lt"];
  const names = [
    "James Wilson", "Sarah Chen", "Mike Torres", "Emily Park", "David Kim",
    "Anna Reed", "Chris Lee", "Maria Garcia", "John Smith", "Lisa Wang",
    "Tom Brown", "Amy Liu", "Kevin Patel", "Rachel Green", "Mark Davis",
    "Nina Shah", "Alex Turner", "Sophie Moore", "Ryan Clark", "Olivia Scott",
    "Jake Adams", "Emma White", "Luke Harris", "Mia Young", "Sam King",
    "Zoe Allen", "Ben Wright", "Lily Hall", "Dan Baker", "Eva Nelson",
  ];
  return {
    id: `TRN-${String(i + 1).padStart(3, "0")}`,
    name: names[i],
    rank: ranks[i % ranks.length],
  };
});

const GROUPS_KEY = "simulator_saved_groups";

const DEFAULT_GROUPS: SavedGroup[] = [
  {
    id: "g1", name: "Alpha Squad - Morning", createdAt: "2026-04-01",
    lanes: [
      { laneId: 1, queue: [TRAINEE_POOL[0], TRAINEE_POOL[1]] },
      { laneId: 2, queue: [TRAINEE_POOL[2], TRAINEE_POOL[3]] },
      { laneId: 3, queue: [TRAINEE_POOL[4]] },
      { laneId: 4, queue: [TRAINEE_POOL[5], TRAINEE_POOL[6], TRAINEE_POOL[7]] },
    ],
  },
  {
    id: "g2", name: "Bravo Team - Assessment", createdAt: "2026-04-03",
    lanes: [
      { laneId: 1, queue: [TRAINEE_POOL[8]] },
      { laneId: 2, queue: [TRAINEE_POOL[9]] },
      { laneId: 3, queue: [TRAINEE_POOL[10]] },
      { laneId: 4, queue: [TRAINEE_POOL[11]] },
    ],
  },
];

function loadGroups(): SavedGroup[] {
  try {
    const stored = localStorage.getItem(GROUPS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  // Initialize with defaults
  localStorage.setItem(GROUPS_KEY, JSON.stringify(DEFAULT_GROUPS));
  return DEFAULT_GROUPS;
}

function saveGroupsToStorage(groups: SavedGroup[]) {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

interface Props {
  lanes: LaneAssignment[];
  onLanesChange: (lanes: LaneAssignment[]) => void;
  onNext: () => void;
}

export function GroupSetupStep({ lanes, onLanesChange, onNext }: Props) {
  const [savedGroups, setSavedGroups] = useState<SavedGroup[]>(loadGroups());
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [showTraineeSearch, setShowTraineeSearch] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveGroupName, setSaveGroupName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState("");

  const assignedIds = new Set(lanes.flatMap((l) => l.queue.map((t) => t.id)));
  const availableTrainees = TRAINEE_POOL.filter(
    (t) => !assignedIds.has(t.id) && (
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const addTraineeToLane = (laneId: number, trainee: Trainee) => {
    onLanesChange(
      lanes.map((l) =>
        l.laneId === laneId ? { ...l, queue: [...l.queue, trainee] } : l
      )
    );
    setShowTraineeSearch(null);
    setSearchQuery("");
  };

  const removeTraineeFromLane = (laneId: number, traineeId: string) => {
    onLanesChange(
      lanes.map((l) =>
        l.laneId === laneId
          ? { ...l, queue: l.queue.filter((t) => t.id !== traineeId) }
          : l
      )
    );
  };

  const loadGroup = (group: SavedGroup) => {
    onLanesChange(group.lanes);
    setShowGroupPicker(false);
    toast.success(`Loaded group: ${group.name}`);
  };

  const handleSaveGroup = () => {
    if (!saveGroupName.trim()) return;
    const newGroup: SavedGroup = {
      id: `g-${Date.now()}`,
      name: saveGroupName.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      lanes: lanes.map((l) => ({ ...l, queue: [...l.queue] })),
    };
    const updated = [...savedGroups, newGroup];
    setSavedGroups(updated);
    saveGroupsToStorage(updated);
    toast.success(`Group "${saveGroupName}" saved successfully`);
    setSaveGroupName("");
    setShowSaveDialog(false);
  };

  const handleDeleteGroup = (id: string) => {
    const updated = savedGroups.filter((g) => g.id !== id);
    setSavedGroups(updated);
    saveGroupsToStorage(updated);
    toast.success("Group deleted");
  };

  const handleRenameGroup = (id: string) => {
    if (!editGroupName.trim()) return;
    const updated = savedGroups.map((g) => g.id === id ? { ...g, name: editGroupName.trim() } : g);
    setSavedGroups(updated);
    saveGroupsToStorage(updated);
    setEditingGroupId(null);
    setEditGroupName("");
    toast.success("Group renamed");
  };

  const hasAnyTrainee = lanes.some((l) => l.queue.length > 0);

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Top actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setShowGroupPicker(!showGroupPicker)}
          className="h-10 px-5 rounded-xl font-semibold text-[11px] uppercase tracking-wider flex items-center gap-2 glass-btn text-primary hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
        >
          <FolderOpen className="w-3.5 h-3.5" /> Load Group
        </button>
        {hasAnyTrainee && (
          <button
            onClick={() => setShowSaveDialog(true)}
            className="h-10 px-5 rounded-xl font-semibold text-[11px] uppercase tracking-wider flex items-center gap-2 glass-btn text-muted-foreground hover:text-foreground hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
          >
            <Save className="w-3.5 h-3.5" /> Save Group
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground font-medium">
            {lanes.reduce((a, l) => a + l.queue.length, 0)} trainees assigned
          </span>
          <button
            onClick={onNext}
            disabled={!hasAnyTrainee}
            className="h-10 px-6 rounded-xl font-semibold text-[11px] uppercase tracking-wider flex items-center gap-2 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none text-primary-foreground hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: "var(--gradient-primary)" }}
          >
            Next: Exercise Setup <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Save group dialog */}
      {showSaveDialog && (
        <div className="glass-panel p-4 flex items-center gap-3 shrink-0 animate-fade-in">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Group Name:</span>
          <Input
            value={saveGroupName}
            onChange={(e) => setSaveGroupName(e.target.value)}
            placeholder="e.g. Alpha Squad - Morning"
            className="h-9 max-w-xs text-sm"
          />
          <button onClick={handleSaveGroup} className="h-9 px-4 rounded-lg text-[11px] font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:scale-[1.03]" style={{ background: "var(--gradient-primary)" }}>Save</button>
          <button onClick={() => setShowSaveDialog(false)} className="h-9 px-3 rounded-lg text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-all">Cancel</button>
        </div>
      )}

      {/* Group picker overlay */}
      {showGroupPicker && (
        <div className="glass-panel p-4 shrink-0 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">Saved Groups</span>
            <button onClick={() => setShowGroupPicker(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          {savedGroups.length === 0 ? (
            <p className="text-[11px] text-muted-foreground py-3 text-center">No saved groups yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {savedGroups.map((g) => (
                <div
                  key={g.id}
                  className="p-3.5 rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-[1.01] group/card"
                  style={{
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--divider)",
                  }}
                >
                  {editingGroupId === g.id ? (
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <Input
                        autoFocus
                        value={editGroupName}
                        onChange={(e) => setEditGroupName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleRenameGroup(g.id)}
                        className="h-8 text-xs flex-1"
                      />
                      <button onClick={() => handleRenameGroup(g.id)} className="text-primary hover:scale-110 transition-all shrink-0">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingGroupId(null)} className="text-muted-foreground hover:text-foreground transition-all shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => loadGroup(g)}
                        className="flex-1 text-left min-w-0"
                      >
                        <p className="text-sm font-semibold text-foreground truncate">{g.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {g.lanes.reduce((a, l) => a + l.queue.length, 0)} trainees · {g.lanes.filter((l) => l.queue.length > 0).length} lanes · Created {g.createdAt}
                        </p>
                      </button>
                      <button
                        onClick={() => { setEditingGroupId(g.id); setEditGroupName(g.name); }}
                        className="opacity-0 group-hover/card:opacity-100 text-muted-foreground hover:text-primary transition-all shrink-0"
                        title="Rename"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(g.id)}
                        className="opacity-0 group-hover/card:opacity-100 text-muted-foreground hover:text-destructive transition-all shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
            </div>
          )}
        </div>
      )}

      {/* Lane cards */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-4 gap-4 h-full">
          {lanes.map((lane) => (
            <div
              key={lane.laneId}
              className="glass-panel flex flex-col overflow-hidden"
            >
              {/* Lane header */}
              <div
                className="px-4 py-3 flex items-center justify-between shrink-0"
                style={{
                  background: "var(--surface-glass-hover)",
                  borderBottom: "1px solid var(--divider)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                    {lane.laneId}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                    Lane {lane.laneId}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {lane.queue.length} queued
                </span>
              </div>

              {/* Trainee queue */}
              <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
                {lane.queue.map((trainee, idx) => (
                  <div
                    key={trainee.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl group transition-all duration-200"
                    style={{
                      background: idx === 0 ? "hsl(var(--primary) / 0.08)" : "var(--surface-inset)",
                      border: idx === 0 ? "1px solid hsl(var(--primary) / 0.2)" : "1px solid transparent",
                    }}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                      idx === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-foreground truncate">{trainee.name}</p>
                      <p className="text-[9px] font-mono text-muted-foreground">{trainee.id} · {trainee.rank}</p>
                    </div>
                    {idx === 0 && (
                      <span className="text-[8px] font-bold uppercase tracking-wider text-primary shrink-0">Active</span>
                    )}
                    <button
                      onClick={() => removeTraineeFromLane(lane.laneId, trainee.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Add trainee button / search */}
                {showTraineeSearch === lane.laneId ? (
                  <div className="flex flex-col gap-2 animate-fade-in">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => {
                          setTimeout(() => {
                            setShowTraineeSearch(null);
                            setSearchQuery("");
                          }, 200);
                        }}
                        placeholder="Search trainees..."
                        className="h-8 pl-8 text-[11px]"
                      />
                    </div>
                    <div className="max-h-[180px] overflow-y-auto flex flex-col gap-1 rounded-xl p-1.5" style={{ background: "var(--surface-inset)" }}>
                      {availableTrainees.slice(0, 8).map((t) => (
                        <button
                          key={t.id}
                          onMouseDown={() => addTraineeToLane(lane.laneId, t)}
                          className="flex items-center gap-2 p-2 rounded-lg text-left transition-all hover:bg-primary/10"
                        >
                          <span className="text-[10px] font-mono text-muted-foreground w-14 shrink-0">{t.id}</span>
                          <span className="text-[11px] font-medium text-foreground truncate">{t.name}</span>
                          <span className="text-[9px] text-muted-foreground ml-auto shrink-0">{t.rank}</span>
                        </button>
                      ))}
                      {availableTrainees.length === 0 && (
                        <p className="text-[10px] text-muted-foreground text-center py-3">No trainees available</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowTraineeSearch(lane.laneId)}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl text-[11px] font-semibold text-muted-foreground transition-all duration-200 hover:text-primary hover:scale-[1.02] active:scale-[0.98] mt-auto"
                    style={{
                      border: "2px dashed var(--divider)",
                    }}
                  >
                    <UserPlus className="w-4 h-4" /> Add Trainee
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
