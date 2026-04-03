import { useState } from "react";
import { Crosshair, Swords, Plus, X, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface TagItem {
  id: string;
  label: string;
  isDefault?: boolean;
}

const DEFAULT_POSITIONS: TagItem[] = [
  { id: "standing", label: "Standing", isDefault: true },
  { id: "kneeling", label: "Kneeling", isDefault: true },
  { id: "prone", label: "Prone", isDefault: true },
];

const DEFAULT_WEAPONS: TagItem[] = [
  { id: "ak", label: "AK-47", isDefault: true },
  { id: "carbine", label: "Carbine", isDefault: true },
  { id: "pistol", label: "Pistol", isDefault: true },
  { id: "desert-eagle", label: "Desert Eagle", isDefault: true },
  { id: "scar", label: "SCAR", isDefault: true },
  { id: "m4a4", label: "M4A4", isDefault: true },
];

function TagBoard({
  title,
  icon,
  accentColor,
  items,
  onAdd,
  onDelete,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  items: TagItem[];
  onAdd: (label: string) => void;
  onDelete: (id: string) => void;
}) {
  const [newValue, setNewValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

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
        <span className="ml-auto text-xs font-mono text-muted-foreground">{items.length} items</span>
      </div>

      {/* Tag grid */}
      <div className="flex flex-wrap gap-2.5 mb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.03] select-none"
            style={{
              background: `hsl(${accentColor} / 0.08)`,
              color: `hsl(${accentColor})`,
              border: `1px solid hsl(${accentColor} / 0.15)`,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: `hsl(${accentColor})` }} />
            {item.label}
            {item.isDefault && (
              <span
                className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                style={{ background: `hsl(${accentColor} / 0.12)` }}
              >
                default
              </span>
            )}
            <button
              onClick={() => onDelete(item.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-0.5 rounded-md hover:bg-destructive/20"
              title="Delete"
            >
              <X className="w-3.5 h-3.5 text-destructive" />
            </button>
          </div>
        ))}

        {/* Add button / inline input */}
        {isAdding ? (
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
        )}
      </div>
    </div>
  );
}

export function FiringWeaponPage() {
  const [positions, setPositions] = useState<TagItem[]>(DEFAULT_POSITIONS);
  const [weapons, setWeapons] = useState<TagItem[]>(DEFAULT_WEAPONS);

  const addPosition = (label: string) => {
    setPositions((prev) => [...prev, { id: label.toLowerCase().replace(/\s+/g, "-"), label }]);
    toast({ title: "Position added", description: `"${label}" has been added.` });
  };

  const deletePosition = (id: string) => {
    setPositions((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Position removed" });
  };

  const addWeapon = (label: string) => {
    setWeapons((prev) => [...prev, { id: label.toLowerCase().replace(/\s+/g, "-"), label }]);
    toast({ title: "Weapon added", description: `"${label}" has been added.` });
  };

  const deleteWeapon = (id: string) => {
    setWeapons((prev) => prev.filter((w) => w.id !== id));
    toast({ title: "Weapon removed" });
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-8 overflow-y-auto animate-fade-in">
      <TagBoard
        title="Firing Positions"
        icon={<Crosshair className="w-5 h-5" />}
        accentColor="40 96% 53%"
        items={positions}
        onAdd={addPosition}
        onDelete={deletePosition}
      />

      <div className="h-px w-full" style={{ background: "var(--divider)" }} />

      <TagBoard
        title="Weapons"
        icon={<Swords className="w-5 h-5" />}
        accentColor="200 80% 50%"
        items={weapons}
        onAdd={addWeapon}
        onDelete={deleteWeapon}
      />
    </div>
  );
}
