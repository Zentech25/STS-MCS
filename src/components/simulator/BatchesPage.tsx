import { useState } from "react";
import { Layers } from "lucide-react";
import { AssetTable, type AssetItem } from "./AssetTable";
import { toast } from "@/hooks/use-toast";

const DEFAULT_BATCHES: AssetItem[] = [
  { id: "batch-1", label: "Batch 1" },
  { id: "batch-2", label: "Batch 2" },
  { id: "batch-3", label: "Batch 3" },
];

export function BatchesPage() {
  const [batches, setBatches] = useState<AssetItem[]>(DEFAULT_BATCHES);

  const addBatch = (label: string) => {
    setBatches((prev) => [...prev, { id: label.toLowerCase().replace(/\s+/g, "-"), label }]);
    toast({ title: "Batch added", description: `"${label}" has been added.` });
  };

  const deleteBatch = (id: string) => {
    setBatches((prev) => prev.filter((i) => i.id !== id));
    toast({ title: "Batch removed" });
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto animate-fade-in">
      <AssetTable
        title="Batches"
        icon={<Layers className="w-5 h-5" />}
        accentColor="160 72% 42%"
        items={batches}
        onAdd={addBatch}
        onDelete={deleteBatch}
        singularName="Batch"
      />
    </div>
  );
}
