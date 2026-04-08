export interface Trainee {
  id: string;
  name: string;
  rank: string;
}

export interface LaneAssignment {
  laneId: number;
  queue: Trainee[]; // first is active, rest are waiting
}

export interface SavedGroup {
  id: string;
  name: string;
  lanes: LaneAssignment[];
  createdAt: string;
}

export type PracticeType = "grouping" | "application" | "timed" | "snapshot";
export type TimeOfDay = "day" | "night";

export interface ExerciseConfig {
  laneId: number;
  type: "custom" | "arc";
  name: string;
  practiceType: PracticeType;
  weapon: string;
  firingPosition: string;
  range: number;
  rounds: number;
  timeOfDay: TimeOfDay;
  visibility: number; // percentage, relevant when night
  targetType: string;
  // Timed fields
  timeLimit: number;
  // Snapshot fields
  exposure: number;
  upTime: number;
  downTime: number;
  // Legacy compat
  distance: number;
}

export type SessionStep = "group" | "exercise" | "live";
