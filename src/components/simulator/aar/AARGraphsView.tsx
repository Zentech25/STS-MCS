import { AARSessionRecord } from "./aarTypes";
import { useMemo } from "react";

interface Props {
  records: AARSessionRecord[];
}

export function AARGraphsView({ records }: Props) {
  const stats = useMemo(() => {
    if (records.length === 0) return null;
    const avgScore = Math.round(records.reduce((s, r) => s + (r.score / r.maxScore) * 100, 0) / records.length);
    const avgGrouping = Math.round(records.reduce((s, r) => s + r.groupingSize, 0) / records.length);
    const totalHits = records.reduce((s, r) => s + r.bulletsHit, 0);
    const totalShots = records.reduce((s, r) => s + r.bulletsAllotted, 0);
    const accuracy = Math.round((totalHits / totalShots) * 100);

    // By practice type
    const byPractice: Record<string, { count: number; avgScore: number }> = {};
    records.forEach((r) => {
      if (!byPractice[r.practiceType]) byPractice[r.practiceType] = { count: 0, avgScore: 0 };
      byPractice[r.practiceType].count++;
      byPractice[r.practiceType].avgScore += (r.score / r.maxScore) * 100;
    });
    Object.keys(byPractice).forEach((k) => {
      byPractice[k].avgScore = Math.round(byPractice[k].avgScore / byPractice[k].count);
    });

    // By trainee (top 5)
    const byTrainee: Record<string, { name: string; avgScore: number; count: number }> = {};
    records.forEach((r) => {
      if (!byTrainee[r.traineeId]) byTrainee[r.traineeId] = { name: r.traineeName, avgScore: 0, count: 0 };
      byTrainee[r.traineeId].count++;
      byTrainee[r.traineeId].avgScore += (r.score / r.maxScore) * 100;
    });
    const topTrainees = Object.values(byTrainee)
      .map((t) => ({ ...t, avgScore: Math.round(t.avgScore / t.count) }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);

    return { avgScore, avgGrouping, accuracy, totalShots, totalHits, byPractice, topTrainees };
  }, [records]);

  if (!stats) return <div className="text-center text-muted-foreground py-12">No data to display.</div>;

  return (
    <div className="py-4 space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Avg Score" value={`${stats.avgScore}%`} />
        <StatCard label="Accuracy" value={`${stats.accuracy}%`} />
        <StatCard label="Avg Grouping" value={`${stats.avgGrouping}mm`} />
        <StatCard label="Total Rounds" value={String(stats.totalShots)} />
      </div>

      {/* Practice type breakdown */}
      <div className="glass-panel p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">By Practice Type</h3>
        <div className="space-y-3">
          {Object.entries(stats.byPractice).map(([type, data]) => (
            <div key={type} className="flex items-center gap-3">
              <span className="text-xs capitalize w-24 text-muted-foreground">{type}</span>
              <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/70 flex items-center justify-end pr-2 transition-all duration-500"
                  style={{ width: `${data.avgScore}%` }}
                >
                  <span className="text-[10px] font-bold">{data.avgScore}%</span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground w-16 text-right">{data.count} sessions</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top trainees */}
      <div className="glass-panel p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Top Performers</h3>
        <div className="space-y-3">
          {stats.topTrainees.map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-bold w-6 text-primary">{i + 1}.</span>
              <span className="text-xs font-medium w-32">{t.name}</span>
              <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                  style={{
                    width: `${t.avgScore}%`,
                    background: i === 0 ? "hsl(45 93% 47% / 0.6)" : i === 1 ? "hsl(0 0% 70% / 0.5)" : i === 2 ? "hsl(30 60% 50% / 0.5)" : "hsl(var(--primary) / 0.4)",
                  }}
                >
                  <span className="text-[10px] font-bold">{t.avgScore}%</span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground w-16 text-right">{t.count} sessions</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel p-4 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
