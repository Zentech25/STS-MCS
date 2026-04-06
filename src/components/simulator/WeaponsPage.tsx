import { Swords } from "lucide-react";
import { AssetTable } from "./AssetTable";
import { toast } from "@/hooks/use-toast";
import { useTrainingAssets, type AssetItem } from "@/contexts/TrainingAssetsContext";

export function WeaponsPage() {
  const { weapons, setWeapons } = useTrainingAssets();

  const addItem = (label: string) => {
    setWeapons((prev) => [...prev, { id: label.toLowerCase().replace(/\s+/g, "-"), label }]);
    toast({ title: "Weapon added", description: `"${label}" has been added.` });
  };

  const deleteItem = (id: string) => {
    setWeapons((prev) => prev.filter((i) => i.id !== id));
    toast({ title: "Weapon removed" });
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-8 overflow-y-auto animate-fade-in">
      <AssetTable
        title="Weapons"
        icon={<Swords className="w-5 h-5" />}
        accentColor="200 80% 50%"
        items={weapons}
        onAdd={addItem}
        onDelete={deleteItem}
        singularName="Weapon"
        showSearch
      />
    </div>
  );
}
