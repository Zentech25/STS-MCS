import { useState } from "react";
import { AARSessionRecord } from "./aarTypes";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Printer, PlayCircle, Users, User } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AARSingleReportView } from "./AARSingleReportView";

interface Props {
  records: AARSessionRecord[];
  onSelectRecord: (r: AARSessionRecord) => void;
  isReplayPicker?: boolean;
}

export function AARReportsView({ records, onSelectRecord, isReplayPicker }: Props) {
  const [mode, setMode] = useState<"single" | "group">("single");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewingRecord, setViewingRecord] = useState<AARSessionRecord | null>(null);
  const [viewingGroup, setViewingGroup] = useState(false);

  if (records.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16">
        <p className="text-sm">No records found. Adjust your filters.</p>
      </div>
    );
  }

  // Single report detail view
  if (!isReplayPicker && mode === "single" && viewingRecord) {
    return (
      <AARSingleReportView
        record={viewingRecord}
        onBack={() => setViewingRecord(null)}
        records={records}
        onNavigate={setViewingRecord}
      />
    );
  }

  // Group report view
  if (!isReplayPicker && mode === "group" && viewingGroup && selectedIds.size > 0) {
    const selectedRecords = records.filter((r) => selectedIds.has(r.id));
    if (selectedRecords.length > 0) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setViewingGroup(false)} className="gap-1.5 hover:bg-muted/50">
              ← Back to selection
            </Button>
            <h2 className="text-lg font-bold text-foreground">Group Report</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{selectedRecords.length} Records</Badge>
            <Button variant="outline" size="sm" className="ml-auto gap-1.5" onClick={() => window.print()}>
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>
          </div>
          <GroupReportTable records={selectedRecords} />
        </div>
      );
    }
  }

  const toggleId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === records.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(records.map((r) => r.id)));
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      {!isReplayPicker && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-muted/40 backdrop-blur-sm rounded-lg p-1 border border-border/30">
            <Button
              variant={mode === "single" ? "default" : "ghost"}
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => { setMode("single"); setSelectedIds(new Set()); setViewingRecord(null); }}
            >
              <User className="w-3.5 h-3.5" /> Single Report
            </Button>
            <Button
              variant={mode === "group" ? "default" : "ghost"}
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => { setMode("group"); setViewingRecord(null); }}
            >
              <Users className="w-3.5 h-3.5" /> Group Report
            </Button>
          </div>
          {mode === "group" && selectedIds.size > 0 && (
            <Button size="sm" className="gap-1.5">
              <Eye className="w-3.5 h-3.5" /> View Group Report ({selectedIds.size})
            </Button>
          )}
        </div>
      )}

      <div className="rounded-xl border border-border/30 bg-background/60 backdrop-blur-sm overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-border/20 bg-muted/30">
              {mode === "group" && !isReplayPicker && (
                <TableHead className="w-10">
                  <Checkbox checked={selectedIds.size === records.length && records.length > 0} onCheckedChange={toggleAll} />
                </TableHead>
              )}
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Trainee</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Company</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Practice</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Weapon</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Lane</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Score</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Hit/Miss</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Date</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r) => (
              <TableRow
                key={r.id}
                className="border-border/15 hover:bg-muted/20 cursor-pointer transition-colors"
                onClick={() => {
                  if (isReplayPicker) {
                    onSelectRecord(r);
                  } else if (mode === "group") {
                    toggleId(r.id);
                  } else {
                    setViewingRecord(r);
                  }
                }}
              >
                {mode === "group" && !isReplayPicker && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selectedIds.has(r.id)} onCheckedChange={() => toggleId(r.id)} />
                  </TableCell>
                )}
                <TableCell className="text-xs font-mono text-muted-foreground">{r.traineeId}</TableCell>
                <TableCell className="text-xs font-medium">{r.traineeName}</TableCell>
                <TableCell className="text-xs">{r.company}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px] capitalize bg-muted/50">{r.practiceType}</Badge>
                </TableCell>
                <TableCell className="text-xs">{r.weapon}</TableCell>
                <TableCell className="text-xs text-center">{r.lane}</TableCell>
                <TableCell className="text-xs font-semibold">{r.score}/{r.maxScore}</TableCell>
                <TableCell className="text-xs">
                  <span className="text-emerald-500 dark:text-emerald-400">{r.bulletsHit}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-destructive">{r.bulletsMissed}</span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{format(new Date(r.date), "dd MMM yy")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 hover:bg-primary/10 hover:text-primary" onClick={(e) => {
                    e.stopPropagation();
                    if (isReplayPicker) {
                      onSelectRecord(r);
                    } else if (mode === "single") {
                      setViewingRecord(r);
                    } else {
                      toggleId(r.id);
                    }
                  }}>
                    {isReplayPicker ? <><PlayCircle className="w-3.5 h-3.5" /> Replay</> : mode === "single" ? <><Eye className="w-3.5 h-3.5" /> View</> : <><Eye className="w-3.5 h-3.5" /> Select</>}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function GroupReportTable({ records }: { records: AARSessionRecord[] }) {
  const totalHits = records.reduce((s, r) => s + r.bulletsHit, 0);
  const totalMiss = records.reduce((s, r) => s + r.bulletsMissed, 0);
  const totalScore = records.reduce((s, r) => s + r.score, 0);
  const totalMax = records.reduce((s, r) => s + r.maxScore, 0);
  const avgAccuracy = records.reduce((s, r) => s + (r.bulletsAllotted > 0 ? (r.bulletsHit / r.bulletsAllotted) * 100 : 0), 0) / records.length;
  const avgGrouping = records.reduce((s, r) => s + r.groupingSize, 0) / records.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <GlassStatCard label="Total Records" value={String(records.length)} />
        <GlassStatCard label="Total Score" value={`${totalScore} / ${totalMax}`} />
        <GlassStatCard label="Total Hits" value={String(totalHits)} accent="success" />
        <GlassStatCard label="Total Misses" value={String(totalMiss)} accent="destructive" />
        <GlassStatCard label="Avg Accuracy" value={`${avgAccuracy.toFixed(1)}%`} />
        <GlassStatCard label="Avg Grouping" value={`${avgGrouping.toFixed(1)} mm`} />
      </div>

      <div className="rounded-xl border border-border/30 bg-background/60 backdrop-blur-sm overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-border/20 bg-muted/30">
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">#</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Trainee</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Rank</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Company</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Practice</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Weapon</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Position</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Range</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Lane</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Allotted</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Hit</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Miss</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Accuracy</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Score</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Grouping</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Time</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Visibility</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r, i) => {
              const acc = r.bulletsAllotted > 0 ? Math.round((r.bulletsHit / r.bulletsAllotted) * 100) : 0;
              return (
                <TableRow key={r.id} className="border-border/15 hover:bg-muted/20 transition-colors">
                  <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{r.traineeId}</TableCell>
                  <TableCell className="text-xs font-medium">{r.traineeName}</TableCell>
                  <TableCell className="text-xs">{r.rank}</TableCell>
                  <TableCell className="text-xs">{r.company}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px] capitalize bg-muted/50">{r.practiceType}</Badge></TableCell>
                  <TableCell className="text-xs">{r.weapon}</TableCell>
                  <TableCell className="text-xs">{r.firingPosition}</TableCell>
                  <TableCell className="text-xs">{r.range}m</TableCell>
                  <TableCell className="text-xs text-center">{r.lane}</TableCell>
                  <TableCell className="text-xs text-center">{r.bulletsAllotted}</TableCell>
                  <TableCell className="text-xs text-center text-emerald-500 dark:text-emerald-400">{r.bulletsHit}</TableCell>
                  <TableCell className="text-xs text-center text-destructive">{r.bulletsMissed}</TableCell>
                  <TableCell className="text-xs font-semibold">{acc}%</TableCell>
                  <TableCell className="text-xs font-semibold">{r.score}/{r.maxScore}</TableCell>
                  <TableCell className="text-xs">{r.groupingSize}mm</TableCell>
                  <TableCell className="text-xs capitalize">{r.timeOfDay}</TableCell>
                  <TableCell className="text-xs">{r.visibility}%</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(new Date(r.date), "dd MMM yy")}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function GlassStatCard({ label, value, accent }: { label: string; value: string; accent?: "success" | "destructive" }) {
  const colorClass = accent === "success" ? "text-emerald-500 dark:text-emerald-400" : accent === "destructive" ? "text-destructive" : "text-foreground";
  return (
    <div className="rounded-xl border border-border/30 bg-background/60 backdrop-blur-sm p-3 text-center shadow-sm">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-lg font-bold mt-1 ${colorClass}`}>{value}</div>
    </div>
  );
}
