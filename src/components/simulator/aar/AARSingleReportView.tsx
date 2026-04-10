import { AARSessionRecord } from "./aarTypes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Crosshair, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { getTargetById } from "@/contexts/TargetsContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Props {
  record: AARSessionRecord;
  onBack: () => void;
  records?: AARSessionRecord[];
  onNavigate?: (record: AARSessionRecord) => void;
}

export function AARSingleReportView({ record, onBack, records, onNavigate }: Props) {
  const target = getTargetById(record.targetType);
  const accuracy = record.bulletsAllotted > 0 ? Math.round((record.bulletsHit / record.bulletsAllotted) * 100) : 0;

  const currentIndex = records?.findIndex((r) => r.id === record.id) ?? -1;
  const hasPrev = currentIndex > 0;
  const hasNext = records ? currentIndex < records.length - 1 : false;

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 hover:bg-muted/50">
          <ArrowLeft className="w-4 h-4" /> Back to list
        </Button>
        <h2 className="text-lg font-bold text-foreground">{record.traineeName} — Report</h2>
        <Badge variant="secondary" className="capitalize bg-primary/10 text-primary border-primary/20">{record.practiceType}</Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
            <Printer className="w-3.5 h-3.5" /> Print
          </Button>
          {records && records.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded-md bg-muted/40">{currentIndex + 1} / {records.length}</span>
              <Button variant="outline" size="icon" className="h-8 w-8 border-border/50" disabled={!hasPrev} onClick={() => hasPrev && onNavigate?.(records[currentIndex - 1])}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 border-border/50" disabled={!hasNext} onClick={() => hasNext && onNavigate?.(records[currentIndex + 1])}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Target with hits */}
        <div className="lg:col-span-2 rounded-xl border border-border/30 bg-background/60 backdrop-blur-sm p-6 flex items-center justify-center shadow-sm">
          <div className="relative w-full" style={{ maxWidth: 520, aspectRatio: "1" }}>
            {target?.image ? (
              <img src={target.image} alt={target.label} className="w-full h-full object-contain rounded-lg" />
            ) : (
              <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center border border-border/20">
                <Target className="w-20 h-20 text-muted-foreground/20" />
              </div>
            )}
            {record.hits.map((hit, i) => (
              <div
                key={i}
                className="absolute rounded-full border-2 transition-all"
                style={{
                  left: `${hit.x}%`,
                  top: `${hit.y}%`,
                  width: 10,
                  height: 10,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: hit.isHit ? "hsl(var(--success) / 0.8)" : "hsl(var(--destructive) / 0.8)",
                  borderColor: hit.isHit ? "hsl(var(--success))" : "hsl(var(--destructive))",
                  boxShadow: hit.isHit
                    ? "0 0 8px hsl(var(--success) / 0.4)"
                    : "0 0 8px hsl(var(--destructive) / 0.4)",
                }}
                title={`Zone ${hit.zone} — Score ${hit.score} — ${hit.isHit ? "Hit" : "Miss"}`}
              />
            ))}
          </div>
        </div>

        {/* Session details */}
        <div className="rounded-xl border border-border/30 bg-background/60 backdrop-blur-sm p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-primary" /> Session Details
          </h3>
          <div className="space-y-2.5 text-sm">
            <DetailRow label="Trainee ID" value={record.traineeId} />
            <DetailRow label="Name" value={record.traineeName} />
            <DetailRow label="Rank" value={record.rank} />
            <DetailRow label="Company" value={record.company} />
            <DetailRow label="Date" value={format(new Date(record.date), "dd MMM yyyy HH:mm")} />
            <DetailRow label="Lane" value={String(record.lane)} />
            <div className="border-t border-border/20 pt-2" />
            <DetailRow label="Practice Type" value={record.practiceType} capitalize />
            <DetailRow label="Weapon" value={record.weapon} />
            <DetailRow label="Firing Position" value={record.firingPosition} />
            <DetailRow label="Target" value={target?.label ?? record.targetType} />
            <DetailRow label="Range" value={`${record.range}m`} />
            <DetailRow label="Time of Day" value={record.timeOfDay} capitalize />
            <DetailRow label="Visibility" value={`${record.visibility}%`} />
            <div className="border-t border-border/20 pt-2" />
            <DetailRow label="Score" value={`${record.score} / ${record.maxScore}`} highlight />
            <DetailRow label="Accuracy" value={`${accuracy}%`} highlight />
            <DetailRow label="Bullets Allotted" value={String(record.bulletsAllotted)} />
            <DetailRow label="Target Hit" value={String(record.bulletsHit)} good />
            <DetailRow label="Miss" value={String(record.bulletsMissed)} bad />
            <DetailRow label="Grouping Size" value={`${record.groupingSize} mm`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight, good, bad, capitalize: cap }: {
  label: string; value: string; highlight?: boolean; good?: boolean; bad?: boolean; capitalize?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={`font-medium text-xs ${cap ? "capitalize" : ""} ${highlight ? "text-primary" : ""} ${good ? "text-emerald-500 dark:text-emerald-400" : ""} ${bad ? "text-destructive" : ""}`}>
        {value}
      </span>
    </div>
  );
}
