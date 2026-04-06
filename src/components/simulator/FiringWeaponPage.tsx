import { Crosshair, Swords, Award } from "lucide-react";
import { AssetTable } from "./AssetTable";
import { toast } from "@/hooks/use-toast";
import { useTrainingAssets, type AssetItem } from "@/contexts/TrainingAssetsContext";

export function FiringWeaponPage() {
  const { positions, setPositions, weapons, setWeapons, ranks, setRanks } = useTrainingAssets();

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
