import { createContext, useContext, useState, ReactNode } from "react";
import { TARGETS } from "@/contexts/TargetsContext";

/* ── Types ── */
export const PRACTICE_TYPES = ["Grouping", "Application", "Timed", "Snap Shot"] as const;
export type PracticeType = (typeof PRACTICE_TYPES)[number];

export interface FireTypeEntry {
  id: string;
  label: string;
  practices: string[];
}

export interface WeaponFireMap {
  [weaponId: string]: FireTypeEntry[];
}

export interface RegionRow {
  id: string;
  regionNo: number;
  fromSector: number;
  toSector: number;
  score: number;
}

export interface ScoreClassification {
  maxScore: number;
  marksMan: number;
  firstClass: number;
  standardShot: number;
}

export interface ARCConfig {
  weapon: string;
  typeOfFire: string;
  nameOfPractice: string;
  firingPosition: string;
  firingRange: number;
  typeOfTarget: string;
  practiceType: PracticeType;
  roundsAllotted: number;
  timeOfPractice: "day" | "night";
  acceptingGroupSize: number;
  timeSec: number;
  isBonusPoint: boolean;
  exposures: number;
  upTime: number;
  downTime: number;
  maxScorePerHit: number;
  scoreClassification: ScoreClassification;
  regions: RegionRow[];
}

export const defaultARCConfig = (): ARCConfig => ({
  weapon: "",
  typeOfFire: "",
  nameOfPractice: "",
  firingPosition: "",
  firingRange: 50,
  typeOfTarget: TARGETS[0]?.id ?? "",
  practiceType: "Grouping",
  roundsAllotted: 4,
  timeOfPractice: "day",
  acceptingGroupSize: 0,
  timeSec: 10,
  isBonusPoint: false,
  exposures: 0,
  upTime: 0,
  downTime: 0,
  maxScorePerHit: 1,
  scoreClassification: { maxScore: 4, marksMan: 3, firstClass: 2, standardShot: 1 },
  regions: [{ id: "reg1", regionNo: 1, fromSector: 1, toSector: 7, score: 1 }],
});

const DEFAULT_FIRE_MAP: WeaponFireMap = {
  ak: [
    { id: "basic-mm", label: "ALL Armed and Services(Recruits) - Basic MM(Classification)", practices: ["BM1(TRB)", "BM2(GRP)"] },
    { id: "adv-marks", label: "Infantry - Advanced Marksmanship", practices: ["AM1(APP)", "AM2(TMD)"] },
  ],
  carbine: [
    { id: "basic-mm", label: "ALL Armed and Services(Recruits) - Basic MM(Classification)", practices: ["BM1(TRB)"] },
    { id: "sf-cqb", label: "Special Forces - CQB", practices: ["CQB1(SNP)"] },
  ],
};

interface ARCContextValue {
  fireMap: WeaponFireMap;
  setFireMap: React.Dispatch<React.SetStateAction<WeaponFireMap>>;
  savedConfigs: ARCConfig[];
  setSavedConfigs: React.Dispatch<React.SetStateAction<ARCConfig[]>>;
}

const ARCContext = createContext<ARCContextValue | null>(null);

export function ARCProvider({ children }: { children: ReactNode }) {
  const [fireMap, setFireMap] = useState<WeaponFireMap>(DEFAULT_FIRE_MAP);
  const [savedConfigs, setSavedConfigs] = useState<ARCConfig[]>([]);

  return (
    <ARCContext.Provider value={{ fireMap, setFireMap, savedConfigs, setSavedConfigs }}>
      {children}
    </ARCContext.Provider>
  );
}

export function useARC() {
  const ctx = useContext(ARCContext);
  if (!ctx) throw new Error("useARC must be used within ARCProvider");
  return ctx;
}
