import { AARSessionRecord } from "./aarTypes";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, PlayCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Props {
  records: AARSessionRecord[];
  onSelectRecord: (r: AARSessionRecord) => void;
  isReplayPicker?: boolean;
}

export function AARReportsView({ records, onSelectRecord, isReplayPicker }: Props) {
  if (records.length === 0) {
    return <div className="text-center text-muted-foreground py-12">No records found. Adjust your filters.</div>;
  }

  return (
    <div className="glass-panel overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/30">
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
            <TableRow key={r.id} className="border-border/20 hover:bg-muted/30 cursor-pointer" onClick={() => onSelectRecord(r)}>
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
                <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1">
                  {isReplayPicker ? <><PlayCircle className="w-3.5 h-3.5" /> Replay</> : <><Eye className="w-3.5 h-3.5" /> View</>}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
