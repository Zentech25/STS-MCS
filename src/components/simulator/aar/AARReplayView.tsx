import { AARSessionRecord } from "./aarTypes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Crosshair } from "lucide-react";
import { getTargetById } from "@/contexts/TargetsContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Props {
  record: AARSessionRecord;
  onBack: () => void;
}

export function AARReplayView({ record, onBack }: Props) {
  const target = getTargetById(record.targetType);
  const accuracy = record.bulletsAllotted > 0 ? Math.round((record.bulletsHit / record.bulletsAllotted) * 100) : 0;

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to list
        </Button>
        <h2 className="text-lg font-bold">{record.traineeName} — Session Replay</h2>
        <Badge variant="secondary" className="capitalize">{record.practiceType}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Target replay */}
        <div className="lg:col-span-2 glass-panel p-4 flex items-center justify-center">
          <div className="relative w-full" style={{ maxWidth: 520, aspectRatio: "1" }}>
            {target?.image ? (
              <img src={target.image} alt={target.label} className="w-full h-full object-contain rounded-lg" />
            ) : (
              <div className="w-full h-full bg-muted/30 rounded-lg flex items-center justify-center">
                <Target className="w-20 h-20 text-muted-foreground/30" />
              </div>
            )}
            {/* Bullet hits overlay */}
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
                  backgroundColor: hit.isHit ? "hsl(142 71% 45% / 0.8)" : "hsl(0 84% 60% / 0.8)",
                  borderColor: hit.isHit ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)",
                  boxShadow: hit.isHit
                    ? "0 0 6px hsl(142 71% 45% / 0.5)"
                    : "0 0 6px hsl(0 84% 60% / 0.5)",
                }}
                title={`Zone ${hit.zone} — Score ${hit.score} — ${hit.isHit ? "Hit" : "Miss"}`}
              />
            ))}
          </div>
        </div>

        {/* Session details sidebar */}
        <div className="glass-panel p-5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Crosshair className="w-4 h-4" /> Session Details
          </h3>

          <div className="space-y-2.5 text-sm">
            <DetailRow label="Trainee ID" value={record.traineeId} />
            <DetailRow label="Name" value={record.traineeName} />
            <DetailRow label="Rank" value={record.rank} />
            <DetailRow label="Company" value={record.company} />
            <DetailRow label="Date" value={format(new Date(record.date), "dd MMM yyyy HH:mm")} />
            <DetailRow label="Lane" value={String(record.lane)} />
            <div className="border-t border-border/30 pt-2" />
            <DetailRow label="Practice Type" value={record.practiceType} capitalize />
            <DetailRow label="Weapon" value={record.weapon} />
            <DetailRow label="Firing Position" value={record.firingPosition} />
            <DetailRow label="Target" value={target?.label ?? record.targetType} />
            <DetailRow label="Range" value={`${record.range}m`} />
            <DetailRow label="Time of Day" value={record.timeOfDay} capitalize />
            <DetailRow label="Visibility" value={`${record.visibility}%`} />
            <div className="border-t border-border/30 pt-2" />
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
      <span className={`font-medium text-xs ${cap ? "capitalize" : ""} ${highlight ? "text-primary" : ""} ${good ? "text-green-400" : ""} ${bad ? "text-red-400" : ""}`}>
        {value}
      </span>
    </div>
  );
}
