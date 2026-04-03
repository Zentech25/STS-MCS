import { useState, useMemo } from "react";
import { Search, UserPlus, RefreshCw, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { AddTraineeDialog } from "./AddTraineeDialog";

interface Trainee {
  id: string;
  name: string;
  rank: string;
  designation: string;
  joinDate: string;
  orgPath: string;
}

const SAMPLE_TRAINEES: Trainee[] = Array.from({ length: 47 }, (_, i) => {
  const ranks = ["Pvt", "LCpl", "Cpl", "Sgt", "SSgt", "Lt", "Capt", "Maj"];
  const designations = ["Rifleman", "Marksman", "Grenadier", "SAW Gunner", "Team Leader", "Squad Leader"];
  const orgs = [
    "1st Div / 2nd Reg / Alpha Co / 1st Plt / Sec A",
    "1st Div / 2nd Reg / Alpha Co / 2nd Plt / Sec B",
    "1st Div / 3rd Reg / Bravo Co / 1st Plt / Sec A",
    "2nd Div / 1st Reg / Charlie Co / 3rd Plt / Sec C",
    "2nd Div / 4th Reg / Delta Co / 2nd Plt / Sec A",
  ];
  const first = ["James", "Sarah", "Michael", "Emma", "Robert", "Olivia", "Daniel", "Sophia", "William", "Ava"][i % 10];
  const last = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Taylor"][Math.floor(i / 5) % 10];
  return {
    id: `TRN-${String(1001 + i).padStart(4, "0")}`,
    name: `${first} ${last}`,
    rank: ranks[i % ranks.length],
    designation: designations[i % designations.length],
    joinDate: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    orgPath: orgs[i % orgs.length],
  };
});

const PAGE_SIZE = 15;

export function TraineePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return SAMPLE_TRAINEES;
    const q = search.toLowerCase();
    return SAMPLE_TRAINEES.filter(
      (t) => t.name.toLowerCase().includes(q) || t.rank.toLowerCase().includes(q) || t.id.toLowerCase().includes(q),
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageData = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="h-full flex flex-col p-5 gap-4 overflow-hidden animate-fade-in">
      {/* Toolbar */}
      <div className="shrink-0 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, rank or ID…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 text-sm bg-background/60 backdrop-blur border-border/50"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Building2 className="w-3.5 h-3.5" />
            Modify Organization
          </Button>
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => setAddDialogOpen(true)}>
            <UserPlus className="w-3.5 h-3.5" />
            Add New Trainee
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh from CS
          </Button>
        </div>
      </div>

      {/* Table */}
      <div
        className="flex-1 min-h-0 rounded-xl overflow-auto border border-border/40"
        style={{ background: "var(--surface-glass)", backdropFilter: "blur(12px)" }}
      >
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-muted-foreground w-[10%]">Trainee ID</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground w-[18%]">Name</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground w-[8%]">Rank</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground w-[14%]">Designation</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground w-[12%]">Join Date</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground w-[38%]">Organization Path</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-12">
                  No trainees found
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((t) => (
                <TableRow key={t.id} className="border-border/20 cursor-pointer hover:bg-muted/40 transition-colors">
                  <TableCell className="text-xs font-mono text-primary/80 py-2.5">{t.id}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground py-2.5">{t.name}</TableCell>
                  <TableCell className="py-2.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {t.rank}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground py-2.5">{t.designation}</TableCell>
                  <TableCell className="text-xs text-muted-foreground tabular-nums py-2.5">{t.joinDate}</TableCell>
                  <TableCell className="text-[11px] text-muted-foreground/80 font-mono truncate py-2.5" title={t.orgPath}>
                    {t.orgPath}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="shrink-0 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} trainees
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline" size="sm"
            className="h-7 px-2 text-xs"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
            .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "ellipsis" ? (
                <span key={`e${idx}`} className="px-1">…</span>
              ) : (
                <Button
                  key={item}
                  variant={item === safePage ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 p-0 text-xs"
                  onClick={() => setPage(item)}
                >
                  {item}
                </Button>
              ),
            )}
          <Button
            variant="outline" size="sm"
            className="h-7 px-2 text-xs"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
