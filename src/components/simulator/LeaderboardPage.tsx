import { useState, useMemo } from "react";
import {
  Trophy, Medal, Crown, Filter, ChevronDown, ChevronUp,
  Target, Clock, Crosshair, TrendingUp, Users, Search,
  ArrowUpDown, Star, Flame, Award,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ── Mock Data ──────────────────────────────────────────────── */

interface TraineeRecord {
  id: string;
  name: string;
  rank: string;
  avgScore: number;
  bestScore: number;
  accuracy: number;
  totalRounds: number;
  sessionsCompleted: number;
  avgGrouping: number; // mm
  bestGrouping: number; // mm
  trend: number; // positive = improving
  lastSession: string;
  practiceBreakdown: {
    grouping: number;
    application: number;
    timed: number;
    snapshot: number;
  };
}

const MOCK_TRAINEES: TraineeRecord[] = [
  { id: "1", name: "Reeves, Marcus", rank: "SGT", avgScore: 94, bestScore: 100, accuracy: 96.2, totalRounds: 1240, sessionsCompleted: 42, avgGrouping: 18, bestGrouping: 12, trend: 5.2, lastSession: "2026-04-05", practiceBreakdown: { grouping: 96, application: 93, timed: 91, snapshot: 88 } },
  { id: "2", name: "Vasquez, Elena", rank: "CPL", avgScore: 91, bestScore: 98, accuracy: 93.8, totalRounds: 980, sessionsCompleted: 35, avgGrouping: 22, bestGrouping: 15, trend: 3.1, lastSession: "2026-04-05", practiceBreakdown: { grouping: 94, application: 90, timed: 88, snapshot: 85 } },
  { id: "3", name: "Kim, Daniel", rank: "PFC", avgScore: 87, bestScore: 95, accuracy: 89.4, totalRounds: 870, sessionsCompleted: 31, avgGrouping: 28, bestGrouping: 19, trend: 7.8, lastSession: "2026-04-04", practiceBreakdown: { grouping: 90, application: 86, timed: 84, snapshot: 82 } },
  { id: "4", name: "Okafor, Chidi", rank: "PVT", avgScore: 82, bestScore: 92, accuracy: 85.1, totalRounds: 650, sessionsCompleted: 24, avgGrouping: 32, bestGrouping: 22, trend: -1.3, lastSession: "2026-04-04", practiceBreakdown: { grouping: 85, application: 80, timed: 78, snapshot: 76 } },
  { id: "5", name: "Thompson, Jake", rank: "CPL", avgScore: 89, bestScore: 97, accuracy: 91.5, totalRounds: 1100, sessionsCompleted: 38, avgGrouping: 24, bestGrouping: 16, trend: 2.4, lastSession: "2026-04-05", practiceBreakdown: { grouping: 92, application: 88, timed: 86, snapshot: 84 } },
  { id: "6", name: "Nakamura, Yuki", rank: "SGT", avgScore: 93, bestScore: 99, accuracy: 95.3, totalRounds: 1350, sessionsCompleted: 45, avgGrouping: 19, bestGrouping: 13, trend: 1.8, lastSession: "2026-04-05", practiceBreakdown: { grouping: 95, application: 92, timed: 90, snapshot: 89 } },
  { id: "7", name: "Patel, Arun", rank: "PFC", avgScore: 78, bestScore: 88, accuracy: 80.2, totalRounds: 520, sessionsCompleted: 19, avgGrouping: 38, bestGrouping: 26, trend: 4.5, lastSession: "2026-04-03", practiceBreakdown: { grouping: 82, application: 76, timed: 74, snapshot: 70 } },
  { id: "8", name: "Rodriguez, Ana", rank: "PVT", avgScore: 75, bestScore: 86, accuracy: 77.8, totalRounds: 410, sessionsCompleted: 15, avgGrouping: 42, bestGrouping: 30, trend: 6.2, lastSession: "2026-04-03", practiceBreakdown: { grouping: 78, application: 73, timed: 71, snapshot: 68 } },
];

const SORT_OPTIONS = [
  { value: "avgScore", label: "Avg Score" },
  { value: "bestScore", label: "Best Score" },
  { value: "accuracy", label: "Accuracy" },
  { value: "avgGrouping", label: "Grouping (Tightest)" },
  { value: "totalRounds", label: "Total Rounds" },
  { value: "sessionsCompleted", label: "Sessions" },
  { value: "trend", label: "Most Improved" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

const PRACTICE_FILTERS = ["All", "Grouping", "Application", "Timed", "Snapshot"] as const;
const RANK_FILTERS = ["All", "SGT", "CPL", "PFC", "PVT"] as const;

const ACCENT = "230 80% 60%";

/* ── Component ──────────────────────────────────────────────── */

export function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<SortKey>("avgScore");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [practiceFilter, setPracticeFilter] = useState<string>("All");
  const [rankFilter, setRankFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    let list = [...MOCK_TRAINEES];

    // Filter by rank
    if (rankFilter !== "All") list = list.filter((t) => t.rank === rankFilter);

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.rank.toLowerCase().includes(q));
    }

    // Sort
    list.sort((a, b) => {
      let va: number, vb: number;
      if (practiceFilter !== "All" && (sortBy === "avgScore" || sortBy === "bestScore")) {
        const key = practiceFilter.toLowerCase() as keyof TraineeRecord["practiceBreakdown"];
        va = a.practiceBreakdown[key];
        vb = b.practiceBreakdown[key];
      } else if (sortBy === "avgGrouping") {
        // Lower is better for grouping
        va = a.avgGrouping;
        vb = b.avgGrouping;
        return sortDir === "desc" ? va - vb : vb - va;
      } else {
        va = a[sortBy] as number;
        vb = b[sortBy] as number;
      }
      return sortDir === "desc" ? vb - va : va - vb;
    });

    return list;
  }, [sortBy, sortDir, practiceFilter, rankFilter, search]);

  const topThree = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const toggleSort = () => setSortDir((d) => (d === "desc" ? "asc" : "desc"));

  const getScoreForPractice = (t: TraineeRecord) => {
    if (practiceFilter === "All") return t.avgScore;
    return t.practiceBreakdown[practiceFilter.toLowerCase() as keyof TraineeRecord["practiceBreakdown"]];
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-5 overflow-y-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `hsl(${ACCENT} / 0.12)`, color: `hsl(${ACCENT})` }}
          >
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">Leaderboard</h2>
            <p className="text-xs text-muted-foreground">{sorted.length} trainees · performance rankings</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className="rounded-2xl p-4 flex flex-wrap gap-4 items-end"
        style={{
          background: "var(--surface-glass)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--divider)",
        }}
      >
        {/* Search */}
        <div className="flex flex-col gap-1.5 min-w-[180px]">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or rank…"
              className="h-9 rounded-xl text-sm pl-8"
            />
          </div>
        </div>

        {/* Sort by */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Sort by</label>
          <div className="flex gap-1.5">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
              <SelectTrigger className="h-9 w-[160px] rounded-xl text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={toggleSort}
              className="h-9 w-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: "var(--surface-elevated)", border: "1px solid var(--divider)" }}
              title={sortDir === "desc" ? "Descending" : "Ascending"}
            >
              {sortDir === "desc" ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
        </div>

        {/* Practice type filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Practice</label>
          <div className="flex gap-1">
            {PRACTICE_FILTERS.map((p) => (
              <button
                key={p}
                onClick={() => setPracticeFilter(p)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 select-none"
                style={{
                  background: practiceFilter === p ? `hsl(${ACCENT} / 0.15)` : "transparent",
                  color: practiceFilter === p ? `hsl(${ACCENT})` : "hsl(var(--muted-foreground))",
                  border: practiceFilter === p ? `1.5px solid hsl(${ACCENT} / 0.4)` : "1.5px solid transparent",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Rank filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Rank</label>
          <Select value={rankFilter} onValueChange={setRankFilter}>
            <SelectTrigger className="h-9 w-[100px] rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANK_FILTERS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top 3 Podium */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {[topThree[1], topThree[0], topThree[2]].map((t, vi) => {
            const position = vi === 0 ? 2 : vi === 1 ? 1 : 3;
            const isFirst = position === 1;
            const Icon = isFirst ? Crown : position === 2 ? Medal : Award;
            const gradient = isFirst
              ? "linear-gradient(135deg, hsl(45 90% 55%), hsl(35 85% 45%))"
              : position === 2
              ? "linear-gradient(135deg, hsl(220 20% 75%), hsl(220 15% 60%))"
              : "linear-gradient(135deg, hsl(25 60% 55%), hsl(20 50% 45%))";

            return (
              <div
                key={t.id}
                className={`rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.01] ${isFirst ? "ring-2" : ""}`}
                style={{
                  background: "var(--surface-glass)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid var(--divider)",
                  ...(isFirst ? { ringColor: "hsl(45 90% 55% / 0.4)" } : {}),
                  order: vi === 1 ? 0 : vi === 0 ? -1 : 1,
                }}
              >
                {/* Medal icon */}
                <div
                  className={`${isFirst ? "w-14 h-14" : "w-11 h-11"} rounded-2xl flex items-center justify-center text-white shadow-lg`}
                  style={{ background: gradient }}
                >
                  <Icon className={isFirst ? "w-7 h-7" : "w-5 h-5"} />
                </div>

                {/* Position */}
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: isFirst ? "hsl(45 90% 55%)" : "hsl(var(--muted-foreground))" }}
                >
                  #{position}
                </span>

                {/* Name & rank */}
                <div className="text-center">
                  <p className={`font-bold text-foreground ${isFirst ? "text-base" : "text-sm"}`}>{t.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{t.rank}</p>
                </div>

                {/* Score */}
                <div
                  className={`${isFirst ? "text-3xl" : "text-2xl"} font-black font-mono`}
                  style={{
                    background: gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {getScoreForPractice(t)}
                </div>

                {/* Stats row */}
                <div className="flex gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" />{t.accuracy}%</span>
                  <span className="flex items-center gap-1"><Crosshair className="w-3 h-3" />{t.avgGrouping}mm</span>
                  <span className={`flex items-center gap-1 ${t.trend >= 0 ? "text-success" : "text-destructive"}`}>
                    <TrendingUp className="w-3 h-3" />{t.trend > 0 ? "+" : ""}{t.trend}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Rankings Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--surface-glass)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--divider)",
        }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-[48px_1fr_80px_80px_80px_80px_72px_80px] text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3"
          style={{ borderBottom: "1px solid var(--divider)" }}
        >
          <span>#</span>
          <span>Trainee</span>
          <span className="text-center">Score</span>
          <span className="text-center">Accuracy</span>
          <span className="text-center">Grouping</span>
          <span className="text-center">Rounds</span>
          <span className="text-center">Trend</span>
          <span className="text-center">Sessions</span>
        </div>

        {sorted.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">No trainees match your filters.</div>
        )}

        {sorted.map((t, idx) => {
          const isExpanded = expandedId === t.id;
          return (
            <div key={t.id}>
              <div
                onClick={() => setExpandedId(isExpanded ? null : t.id)}
                className="grid grid-cols-[48px_1fr_80px_80px_80px_80px_72px_80px] items-center px-4 py-3 cursor-pointer transition-colors hover:bg-accent/5"
                style={{
                  borderBottom: "1px solid var(--divider)",
                  background: isExpanded ? `hsl(${ACCENT} / 0.05)` : "transparent",
                }}
              >
                {/* Rank */}
                <span className="flex items-center gap-1">
                  {idx === 0 && <Crown className="w-3.5 h-3.5 text-yellow-500" />}
                  {idx === 1 && <Medal className="w-3.5 h-3.5 text-gray-400" />}
                  {idx === 2 && <Award className="w-3.5 h-3.5 text-orange-400" />}
                  {idx > 2 && <span className="text-xs font-mono text-muted-foreground w-4 text-center">{idx + 1}</span>}
                </span>

                {/* Name */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "var(--surface-inset)", color: "hsl(var(--muted-foreground))" }}
                  >
                    {t.rank}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{t.name}</span>
                </div>

                {/* Score */}
                <span className="text-center text-sm font-bold font-mono text-foreground">{getScoreForPractice(t)}</span>

                {/* Accuracy */}
                <span className="text-center text-sm font-mono text-muted-foreground">{t.accuracy}%</span>

                {/* Grouping */}
                <span className="text-center text-sm font-mono text-muted-foreground">{t.avgGrouping}mm</span>

                {/* Rounds */}
                <span className="text-center text-sm font-mono text-muted-foreground">{t.totalRounds}</span>

                {/* Trend */}
                <span className={`text-center text-xs font-mono font-bold ${t.trend >= 0 ? "text-success" : "text-destructive"}`}>
                  {t.trend > 0 ? "+" : ""}{t.trend}%
                </span>

                {/* Sessions */}
                <span className="text-center text-sm font-mono text-muted-foreground">{t.sessionsCompleted}</span>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div
                  className="px-6 py-4 grid grid-cols-4 gap-4 animate-fade-in"
                  style={{ background: `hsl(${ACCENT} / 0.03)`, borderBottom: "1px solid var(--divider)" }}
                >
                  {(["grouping", "application", "timed", "snapshot"] as const).map((p) => (
                    <div key={p} className="flex flex-col gap-2">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider capitalize">{p}</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold font-mono text-foreground">{t.practiceBreakdown[p]}</span>
                        <span className="text-[10px] text-muted-foreground">pts</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-inset)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${t.practiceBreakdown[p]}%`,
                            background: "var(--gradient-primary)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="col-span-4 flex gap-6 mt-2 text-xs text-muted-foreground">
                    <span>Best Score: <strong className="text-foreground">{t.bestScore}</strong></span>
                    <span>Best Grouping: <strong className="text-foreground">{t.bestGrouping}mm</strong></span>
                    <span>Last Session: <strong className="text-foreground">{t.lastSession}</strong></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
