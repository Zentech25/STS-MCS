import { useState } from "react";
import { Crosshair, Swords, Plus, X, Check, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface TagItem {
  id: string;
  label: string;
  selected: boolean;
}

const DEFAULT_POSITIONS: TagItem[] = [
  { id: "standing", label: "Standing", selected: true },
  { id: "kneeling", label: "Kneeling", selected: false },
  { id: "prone", label: "Prone", selected: false },
];

const DEFAULT_WEAPONS: TagItem[] = [
  { id: "ak", label: "AK-47", selected: true },
  { id: "carbine", label: "Carbine", selected: false },
  { id: "pistol", label: "Pistol", selected: false },
  { id: "desert-eagle", label: "Desert Eagle", selected: false },
  { id: "scar", label: "SCAR", selected: false },
  { id: "m4a4", label: "M4A4", selected: false },
];

function TagBoard({
  title,
  icon,
  accentColor,
  items,
  onAdd,
  onDelete,
  onToggle,
  snapshot,
  onEnterEdit,
  onCancelEdit,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  items: TagItem[];
  onAdd: (label: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  snapshot: TagItem[];
  onEnterEdit: () => void;
  onCancelEdit: () => void;
}) {
  const [newValue, setNewValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const selectedCount = items.filter((i) => i.selected).length;

  const handleAdd = () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    if (items.some((i) => i.label.toLowerCase() === trimmed.toLowerCase())) {
      toast({ title: "Duplicate entry", description: `"${trimmed}" already exists.`, variant: "destructive" });
      return;
    }
    onAdd(trimmed);
    setNewValue("");
    setIsAdding(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `hsl(${accentColor} / 0.12)`, color: `hsl(${accentColor})` }}
        >
          {icon}
        </div>
        <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">{title}</h3>
        <span className="text-xs text-muted-foreground ml-1">
          {selectedCount} of {items.length} active
        </span>
        <div className="ml-auto flex items-center gap-2">
          {editMode ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs rounded-lg gap-1.5"
                onClick={() => { onCancelEdit(); setEditMode(false); setIsAdding(false); setNewValue(""); }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs rounded-lg gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => { setEditMode(false); setIsAdding(false); setNewValue(""); }}
              >
                <Check className="w-3.5 h-3.5" />
                Done
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs rounded-lg gap-1.5"
              onClick={() => { onEnterEdit(); setEditMode(true); }}
            >
              <Settings className="w-3.5 h-3.5" />
              Manage
            </Button>
          )}
        </div>
      </div>

      {/* Tag grid */}
      <div className="flex flex-wrap gap-2.5 mb-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => !editMode && onToggle(item.id)}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 select-none ${
              !editMode ? "cursor-pointer hover:scale-[1.03] active:scale-[0.97]" : ""
            }`}
            style={{
              background: item.selected
                ? `hsl(${accentColor} / 0.15)`
                : "hsl(var(--muted) / 0.5)",
              color: item.selected
                ? `hsl(${accentColor})`
                : "hsl(var(--muted-foreground))",
              border: item.selected
                ? `1.5px solid hsl(${accentColor} / 0.4)`
                : "1.5px solid hsl(var(--border))",
              boxShadow: item.selected
                ? `0 0 10px hsl(${accentColor} / 0.1)`
                : "none",
            }}
          >
            {/* Selection indicator */}
            <span
              className="w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors"
              style={{
                background: item.selected ? `hsl(${accentColor})` : "transparent",
                border: item.selected
                  ? `1.5px solid hsl(${accentColor})`
                  : "1.5px solid hsl(var(--muted-foreground) / 0.4)",
              }}
            >
              {item.selected && <Check className="w-3 h-3 text-white" />}
            </span>
            {item.label}

            {/* Delete button — only in edit mode */}
            {editMode && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="ml-1 p-1 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors cursor-pointer"
                title="Delete"
              >
                <X className="w-3.5 h-3.5 text-destructive" />
              </span>
            )}
          </button>
        ))}

        {/* Add button — only in edit mode */}
        {editMode && (
          isAdding ? (
            <div className="flex items-center gap-1.5">
              <Input
                autoFocus
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") { setIsAdding(false); setNewValue(""); }
                }}
                placeholder={title === "Firing Positions" ? "e.g. Supine" : "e.g. Sniper Rifle"}
                className="h-9 w-40 text-sm rounded-xl"
              />
              <Button size="sm" className="h-9 rounded-xl" onClick={handleAdd}>Add</Button>
              <Button size="sm" variant="ghost" className="h-9 rounded-xl" onClick={() => { setIsAdding(false); setNewValue(""); }}>
                Cancel
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 rounded-xl border border-dashed px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.03] text-muted-foreground hover:text-foreground"
              style={{ borderColor: `hsl(${accentColor} / 0.3)` }}
            >
              <Plus className="w-4 h-4" />
              Add {title === "Firing Positions" ? "Position" : "Weapon"}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export function FiringWeaponPage() {
  const [positions, setPositions] = useState<TagItem[]>(DEFAULT_POSITIONS);
  const [weapons, setWeapons] = useState<TagItem[]>(DEFAULT_WEAPONS);

  const toggleItem = (setter: React.Dispatch<React.SetStateAction<TagItem[]>>) => (id: string) => {
    setter((prev) => prev.map((i) => i.id === id ? { ...i, selected: !i.selected } : i));
  };

  const addItem = (setter: React.Dispatch<React.SetStateAction<TagItem[]>>, type: string) => (label: string) => {
    setter((prev) => [...prev, { id: label.toLowerCase().replace(/\s+/g, "-"), label, selected: false }]);
    toast({ title: `${type} added`, description: `"${label}" has been added.` });
  };

  const deleteItem = (setter: React.Dispatch<React.SetStateAction<TagItem[]>>, type: string) => (id: string) => {
    setter((prev) => prev.filter((i) => i.id !== id));
    toast({ title: `${type} removed` });
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-8 overflow-y-auto animate-fade-in">
      <TagBoard
        title="Firing Positions"
        icon={<Crosshair className="w-5 h-5" />}
        accentColor="40 96% 53%"
        items={positions}
        onAdd={addItem(setPositions, "Position")}
        onDelete={deleteItem(setPositions, "Position")}
        onToggle={toggleItem(setPositions)}
      />

      <div className="h-px w-full" style={{ background: "var(--divider)" }} />

      <TagBoard
        title="Weapons"
        icon={<Swords className="w-5 h-5" />}
        accentColor="200 80% 50%"
        items={weapons}
        onAdd={addItem(setWeapons, "Weapon")}
        onDelete={deleteItem(setWeapons, "Weapon")}
        onToggle={toggleItem(setWeapons)}
      />
    </div>
  );
}
