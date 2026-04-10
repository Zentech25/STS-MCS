import { useState } from "react";
import { AARSessionRecord } from "./aarTypes";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Printer, PlayCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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

  if (records.length === 0) {
    return <div className="text-center text-muted-foreground py-12">No records found. Adjust your filters.</div>;
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
  if (!isReplayPicker && mode === "group" && selectedIds.size > 0) {
    const selectedRecords = records.filter((r) => selectedIds.has(r.id));
    if (selectedRecords.length > 0) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} className="gap-1.5">
              ← Back to selection
            </Button>
            <h2 className="text-lg font-bold">Group Report — {selectedRecords.length} Records</h2>
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
      {/* Mode selector - only show on reports tab, not replay picker */}
      {!isReplayPicker && (
        <div className="flex items-center justify-between">
          <RadioGroup value={mode} onValueChange={(v) => { setMode(v as "single" | "group"); setSelectedIds(new Set()); setViewingRecord(null); }} className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="single" id="mode-single" />
              <Label htmlFor="mode-single" className="text-sm cursor-pointer">Single Report</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="group" id="mode-group" />
              <Label htmlFor="mode-group" className="text-sm cursor-pointer">Group Report</Label>
            </div>
          </RadioGroup>
          {mode === "group" && selectedIds.size > 0 && (
            <Button size="sm" className="gap-1.5" onClick={() => {}}>
              <Eye className="w-3.5 h-3.5" /> View Group Report ({selectedIds.size})
            </Button>
          )}
        </div>
      )}

      <div className="glass-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30">
              {mode === "group" && !isReplayPicker && (
                <TableHead className="w-10">
                  <Checkbox checked={selectedIds.size === records.length && records.length > 0} onCheckedChange={toggleAll} />
                </TableHead>
              )}
              <TableHead className="text-[10px] uppercase tracking-wider">ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Trainee</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Company</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Practice</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Weapon</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Lane</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Score</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Hit/Miss</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Date</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r) => (
              <TableRow
                key={r.id}
                className="border-border/20 hover:bg-muted/30 cursor-pointer"
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
                <TableCell className="text-xs font-mono">{r.traineeId}</TableCell>
                <TableCell className="text-xs font-medium">{r.traineeName}</TableCell>
                <TableCell className="text-xs">{r.company}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px] capitalize">{r.practiceType}</Badge>
                </TableCell>
                <TableCell className="text-xs">{r.weapon}</TableCell>
                <TableCell className="text-xs text-center">{r.lane}</TableCell>
                <TableCell className="text-xs font-semibold">{r.score}/{r.maxScore}</TableCell>
                <TableCell className="text-xs">
                  <span className="text-green-400">{r.bulletsHit}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-red-400">{r.bulletsMissed}</span>
                </TableCell>
                <TableCell className="text-xs">{format(new Date(r.date), "dd MMM yy")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1" onClick={(e) => {
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
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Records" value={String(records.length)} />
        <StatCard label="Total Score" value={`${totalScore} / ${totalMax}`} />
        <StatCard label="Total Hits" value={String(totalHits)} />
        <StatCard label="Total Misses" value={String(totalMiss)} />
        <StatCard label="Avg Accuracy" value={`${avgAccuracy.toFixed(1)}%`} />
        <StatCard label="Avg Grouping" value={`${avgGrouping.toFixed(1)} mm`} />
      </div>

      {/* Detailed table */}
      <div className="glass-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30">
              <TableHead className="text-[10px] uppercase tracking-wider">#</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Trainee</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Rank</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Company</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Practice</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Weapon</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Position</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Range</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Lane</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Allotted</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Hit</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Miss</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Accuracy</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Score</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Grouping</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Time</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Visibility</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r, i) => {
              const acc = r.bulletsAllotted > 0 ? Math.round((r.bulletsHit / r.bulletsAllotted) * 100) : 0;
              return (
                <TableRow key={r.id} className="border-border/20">
                  <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="text-xs font-mono">{r.traineeId}</TableCell>
                  <TableCell className="text-xs font-medium">{r.traineeName}</TableCell>
                  <TableCell className="text-xs">{r.rank}</TableCell>
                  <TableCell className="text-xs">{r.company}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{r.practiceType}</Badge></TableCell>
                  <TableCell className="text-xs">{r.weapon}</TableCell>
                  <TableCell className="text-xs">{r.firingPosition}</TableCell>
                  <TableCell className="text-xs">{r.range}m</TableCell>
                  <TableCell className="text-xs text-center">{r.lane}</TableCell>
                  <TableCell className="text-xs text-center">{r.bulletsAllotted}</TableCell>
                  <TableCell className="text-xs text-center text-green-400">{r.bulletsHit}</TableCell>
                  <TableCell className="text-xs text-center text-red-400">{r.bulletsMissed}</TableCell>
                  <TableCell className="text-xs font-semibold">{acc}%</TableCell>
                  <TableCell className="text-xs font-semibold">{r.score}/{r.maxScore}</TableCell>
                  <TableCell className="text-xs">{r.groupingSize}mm</TableCell>
                  <TableCell className="text-xs capitalize">{r.timeOfDay}</TableCell>
                  <TableCell className="text-xs">{r.visibility}%</TableCell>
                  <TableCell className="text-xs">{format(new Date(r.date), "dd MMM yy")}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
}
