import { AARSessionRecord } from "./aarTypes";

const names = [
  { id: "T001", name: "SGT. Reeves", rank: "SGT", company: "Alpha" },
  { id: "T002", name: "CPL. Vasquez", rank: "CPL", company: "Alpha" },
  { id: "T003", name: "PFC. Kim", rank: "PFC", company: "Bravo" },
  { id: "T004", name: "PVT. Okafor", rank: "PVT", company: "Bravo" },
  { id: "T005", name: "SGT. Chen", rank: "SGT", company: "Charlie" },
  { id: "T006", name: "CPL. Morales", rank: "CPL", company: "Charlie" },
];

const practices: AARSessionRecord["practiceType"][] = ["grouping", "application", "timed", "snapshot"];
const weapons = ["M4A1", "M16A4", "AK-47", "SA80"];
const targets = ["fig120cm", "fig11", "fig12", "spg"];
const positions = ["Prone", "Kneeling", "Standing"];

function randHits(allotted: number, targetId: string): { hits: AARSessionRecord["hits"]; hit: number; miss: number; score: number } {
  const hits: AARSessionRecord["hits"] = [];
  let hit = 0;
  let score = 0;
  for (let i = 0; i < allotted; i++) {
    const isHit = Math.random() > 0.15;
    const zone = isHit ? Math.ceil(Math.random() * 5) : 0;
    const s = isHit ? Math.max(1, 10 - zone) : 0;
    hits.push({
      x: 30 + Math.random() * 40 + (isHit ? 0 : (Math.random() > 0.5 ? 30 : -25)),
      y: 20 + Math.random() * 60 + (isHit ? 0 : (Math.random() > 0.5 ? 25 : -15)),
      zone,
      score: s,
      isHit,
    });
    if (isHit) hit++;
    score += s;
  }
  return { hits, hit, miss: allotted - hit, score };
}

export const MOCK_AAR_RECORDS: AARSessionRecord[] = [];

for (let i = 0; i < 40; i++) {
  const t = names[i % names.length];
  const allotted = [10, 15, 20][Math.floor(Math.random() * 3)];
  const { hits, hit, miss, score } = randHits(allotted, targets[i % targets.length]);
  const daysAgo = Math.floor(Math.random() * 60);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);

  MOCK_AAR_RECORDS.push({
    id: `AAR-${String(i + 1).padStart(3, "0")}`,
    traineeId: t.id,
    traineeName: t.name,
    rank: t.rank,
    company: t.company,
    date: d.toISOString(),
    lane: (i % 4) + 1,
    practiceType: practices[i % practices.length],
    weapon: weapons[i % weapons.length],
    firingPosition: positions[i % positions.length],
    targetType: targets[i % targets.length],
    range: [25, 50, 100, 200][i % 4],
    bulletsAllotted: allotted,
    bulletsHit: hit,
    bulletsMissed: miss,
    score,
    maxScore: allotted * 10,
    groupingSize: Math.round(15 + Math.random() * 80),
    hits,
    timeOfDay: Math.random() > 0.3 ? "day" : "night",
    visibility: Math.round(60 + Math.random() * 40),
  });
}
