import { useState } from "react";
import { Crosshair, Award, ChevronDown, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTrainingAssets, type AssetItem } from "@/contexts/TrainingAssetsContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CompactAssetSectionProps {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  items: AssetItem[];
  onAdd: (label: string) => void;
  onDelete: (id: string) => void;
  singularName: string;
}

function CompactAssetSection({ title, icon, accentColor, items, onAdd, onDelete, singularName }: CompactAssetSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className="rounded-2xl border border-border/60 overflow-hidden transition-all duration-300"
        style={{
          background: isOpen ? `hsl(${accentColor} / 0.03)` : "hsl(var(--card))",
          borderColor: isOpen ? `hsl(${accentColor} / 0.2)` : undefined,
        }}
      >
        {/* Header */}
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `hsl(${accentColor} / 0.12)`, color: `hsl(${accentColor})` }}
            >
              {icon}
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {items.length} {items.length === 1 ? singularName.toLowerCase() : `${singularName.toLowerCase()}s`} configured
              </p>
            </div>
            {/* Tags preview when collapsed */}
            {!isOpen && (
              <div className="flex items-center gap-1.5 flex-wrap justify-end max-w-[50%]">
                {items.slice(0, 4).map((item) => (
                  <span
                    key={item.id}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: `hsl(${accentColor} / 0.1)`,
                      color: `hsl(${accentColor})`,
                    }}
                  >
                    {item.label}
                  </span>
                ))}
                {items.length > 4 && (
                  <span className="text-[11px] text-muted-foreground">+{items.length - 4}</span>
                )}
              </div>
            )}
            <ChevronDown
              className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300"
              style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
        </CollapsibleTrigger>

        {/* Content */}
        <CollapsibleContent>
          <div className="px-5 pb-4 pt-1">
            {/* Item chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-border/50 bg-background hover:border-destructive/40 transition-colors"
                >
                  <span>{item.label}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {singularName}</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{item.label}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => onDelete(item.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>

            {/* Add new */}
            {isAdding ? (
              <div className="flex items-center gap-2">
                <Input
                  autoFocus
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd();
                    if (e.key === "Escape") { setIsAdding(false); setNewValue(""); }
                  }}
                  placeholder={`New ${singularName.toLowerCase()} name…`}
                  className="h-8 w-48 text-sm rounded-lg"
                />
                <Button size="sm" className="h-8 rounded-lg text-xs" onClick={handleAdd}>Add</Button>
                <Button size="sm" variant="ghost" className="h-8 rounded-lg text-xs" onClick={() => { setIsAdding(false); setNewValue(""); }}>Cancel</Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="w-3.5 h-3.5" />
                Add {singularName}
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function FiringWeaponPage() {
  const { positions, setPositions, ranks, setRanks } = useTrainingAssets();

  const addItem = (setter: React.Dispatch<React.SetStateAction<AssetItem[]>>, type: string) => (label: string) => {
    setter((prev) => [...prev, { id: label.toLowerCase().replace(/\s+/g, "-"), label }]);
    toast({ title: `${type} added`, description: `"${label}" has been added.` });
  };

  const deleteItem = (setter: React.Dispatch<React.SetStateAction<AssetItem[]>>, type: string) => (id: string) => {
    setter((prev) => prev.filter((i) => i.id !== id));
    toast({ title: `${type} removed` });
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-4 overflow-y-auto animate-fade-in max-w-2xl">
      <CompactAssetSection
        title="Firing Positions"
        icon={<Crosshair className="w-5 h-5" />}
        accentColor="40 96% 53%"
        items={positions}
        onAdd={addItem(setPositions, "Position")}
        onDelete={deleteItem(setPositions, "Position")}
        singularName="Position"
      />
      <CompactAssetSection
        title="Ranks"
        icon={<Award className="w-5 h-5" />}
        accentColor="30 90% 55%"
        items={ranks}
        onAdd={addItem(setRanks, "Rank")}
        onDelete={deleteItem(setRanks, "Rank")}
        singularName="Rank"
      />
    </div>
  );
}
