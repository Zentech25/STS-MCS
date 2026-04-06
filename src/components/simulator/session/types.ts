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

export interface ExerciseConfig {
  laneId: number;
  type: "custom" | "arc";
  name: string;
  rounds: number;
  distance: number;
  timeLimit: number;
  targetType: string;
}

export type SessionStep = "group" | "exercise" | "live";
