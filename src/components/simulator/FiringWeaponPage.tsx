import { useState } from "react";
import { Crosshair, Swords, Award } from "lucide-react";
import { AssetTable, type AssetItem } from "./AssetTable";
import { toast } from "@/hooks/use-toast";

const DEFAULT_POSITIONS: AssetItem[] = [
  { id: "standing", label: "Standing" },
  { id: "kneeling", label: "Kneeling" },
  { id: "prone", label: "Prone" },
];

const DEFAULT_WEAPONS: AssetItem[] = [
  { id: "ak", label: "AK-47" },
  { id: "carbine", label: "Carbine" },
  { id: "pistol", label: "Pistol" },
  { id: "desert-eagle", label: "Desert Eagle" },
  { id: "scar", label: "SCAR" },
  { id: "m4a4", label: "M4A4" },
];

const DEFAULT_RANKS: AssetItem[] = [
  { id: "pvt", label: "Private" },
  { id: "cpl", label: "Corporal" },
  { id: "sgt", label: "Sergeant" },
  { id: "lt", label: "Lieutenant" },
  { id: "capt", label: "Captain" },
  { id: "maj", label: "Major" },
  { id: "col", label: "Colonel" },
  { id: "brig", label: "Brigadier" },
];

export function FiringWeaponPage() {
  const [positions, setPositions] = useState<AssetItem[]>(DEFAULT_POSITIONS);
  const [weapons, setWeapons] = useState<AssetItem[]>(DEFAULT_WEAPONS);
  const [ranks, setRanks] = useState<AssetItem[]>(DEFAULT_RANKS);

  const addItem = (setter: React.Dispatch<React.SetStateAction<AssetItem[]>>, type: string) => (label: string) => {
    setter((prev) => [...prev, { id: label.toLowerCase().replace(/\s+/g, "-"), label }]);
    toast({ title: `${type} added`, description: `"${label}" has been added.` });
  };

  const deleteItem = (setter: React.Dispatch<React.SetStateAction<AssetItem[]>>, type: string) => (id: string) => {
    setter((prev) => prev.filter((i) => i.id !== id));
    toast({ title: `${type} removed` });
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-8 overflow-y-auto animate-fade-in">
      <AssetTable
        title="Firing Positions"
        icon={<Crosshair className="w-5 h-5" />}
        accentColor="40 96% 53%"
        items={positions}
        onAdd={addItem(setPositions, "Position")}
        onDelete={deleteItem(setPositions, "Position")}
        singularName="Position"
      />

      <AssetTable
        title="Weapons"
        icon={<Swords className="w-5 h-5" />}
        accentColor="200 80% 50%"
        items={weapons}
        onAdd={addItem(setWeapons, "Weapon")}
        onDelete={deleteItem(setWeapons, "Weapon")}
        singularName="Weapon"
      />

      <AssetTable
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
