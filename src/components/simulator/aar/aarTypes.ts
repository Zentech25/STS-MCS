export interface BulletHit {
  x: number; // 0-100 percentage on target
  y: number;
  zone: number;
  score: number;
  isHit: boolean;
}

export interface AARSessionRecord {
  id: string;
  traineeId: string;
  traineeName: string;
  rank: string;
  company: string;
  date: string; // ISO
  lane: number;
  practiceType: "grouping" | "application" | "timed" | "snapshot";
  weapon: string;
  firingPosition: string;
  targetType: string; // target id
  range: number;
  bulletsAllotted: number;
  bulletsHit: number;
  bulletsMissed: number;
  score: number;
  maxScore: number;
  groupingSize: number; // mm
  hits: BulletHit[];
  timeOfDay: "day" | "night";
  visibility: number;
}
