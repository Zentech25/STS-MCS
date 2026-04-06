import { createContext, useContext, useState, ReactNode } from "react";

export interface AssetItem {
  id: string;
  label: string;
}

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

interface TrainingAssetsContextType {
  positions: AssetItem[];
  setPositions: React.Dispatch<React.SetStateAction<AssetItem[]>>;
  weapons: AssetItem[];
  setWeapons: React.Dispatch<React.SetStateAction<AssetItem[]>>;
  ranks: AssetItem[];
  setRanks: React.Dispatch<React.SetStateAction<AssetItem[]>>;
}

const TrainingAssetsContext = createContext<TrainingAssetsContextType | null>(null);

export function TrainingAssetsProvider({ children }: { children: ReactNode }) {
  const [positions, setPositions] = useState<AssetItem[]>(DEFAULT_POSITIONS);
  const [weapons, setWeapons] = useState<AssetItem[]>(DEFAULT_WEAPONS);
  const [ranks, setRanks] = useState<AssetItem[]>(DEFAULT_RANKS);

  return (
    <TrainingAssetsContext.Provider value={{ positions, setPositions, weapons, setWeapons, ranks, setRanks }}>
      {children}
    </TrainingAssetsContext.Provider>
  );
}

export function useTrainingAssets() {
  const ctx = useContext(TrainingAssetsContext);
  if (!ctx) throw new Error("useTrainingAssets must be used within TrainingAssetsProvider");
  return ctx;
}
