import { useState, useMemo } from "react";
import { Search, UserPlus, Trash2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AddTraineeDialog } from "./AddTraineeDialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Trainee {
  id: string;
  name: string;
  rank: string;
  designation: string;
  joinDate: string;
  orgPath: string;
}

const INITIAL_TRAINEES: Trainee[] = Array.from({ length: 47 }, (_, i) => {
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
  const [editTrainee, setEditTrainee] = useState<Trainee | null>(null);
  const [trainees, setTrainees] = useState<Trainee[]>(INITIAL_TRAINEES);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!search.trim()) return trainees;
    const q = search.toLowerCase();
    return trainees.filter(
      (t) => t.name.toLowerCase().includes(q) || t.rank.toLowerCase().includes(q) || t.id.toLowerCase().includes(q),
    );
  }, [search, trainees]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageData = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const allPageSelected = pageData.length > 0 && pageData.every((t) => selectedIds.has(t.id));
  const multiSelected = selectedIds.size > 1;

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageData.forEach((t) => next.delete(t.id));
      } else {
        pageData.forEach((t) => next.add(t.id));
      }
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    setTrainees((prev) => prev.filter((t) => !selectedIds.has(t.id)));
    toast.success(`Deleted ${selectedIds.size} trainee(s).`);
    setSelectedIds(new Set());
  };

  const handleDeleteOne = (id: string) => {
    setTrainees((prev) => prev.filter((t) => t.id !== id));
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    toast.success("Trainee deleted.");
  };

  const handleEdit = (t: Trainee) => {
    setEditTrainee(t);
  };

  const handleEditSave = (updated: { name: string; rank: string; designation: string; orgPath: string; photo: string | null }) => {
    if (!editTrainee) return;
    setTrainees((prev) =>
      prev.map((t) =>
        t.id === editTrainee.id
          ? { ...t, name: updated.name, rank: updated.rank, designation: updated.designation, orgPath: updated.orgPath }
          : t,
      ),
    );
    setEditTrainee(null);
    toast.success("Trainee updated.");
  };

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
          {selectedIds.size > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-1.5 text-xs">
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete {selectedIds.size} Selected
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {selectedIds.size} trainee(s)?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => setAddDialogOpen(true)}>
            <UserPlus className="w-3.5 h-3.5" />
            Add New Trainee
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
              <TableHead className="w-[40px] px-2">
                <Checkbox checked={allPageSelected} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground w-[9%]">Trainee ID</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground w-[15%]">Name</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground w-[7%]">Rank</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground w-[12%]">Designation</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground w-[10%]">Join Date</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground w-[35%]">Organization Path</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground w-[80px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-12">
                  No trainees found
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((t) => {
                const isSelected = selectedIds.has(t.id);
                return (
                  <TableRow
                    key={t.id}
                    className="border-border/20 hover:bg-muted/40 transition-colors group"
                  >
                    {/* Checkbox: invisible by default, visible on row hover or when selected */}
                    <TableCell className="px-2 py-2.5">
                      <div className={`transition-opacity duration-200 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}>
                        <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(t.id)} />
                      </div>
                    </TableCell>
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
                    {/* Actions: only visible when selected */}
                    <TableCell className="py-2.5">
                      {isSelected && (
                        <div className="flex items-center justify-center gap-1 animate-fade-in">
                          {/* Edit only when single selection */}
                          {!multiSelected && (
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleEdit(t)}>
                              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete trainee "{t.name}"?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteOne(t.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
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
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
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
                <Button key={item} variant={item === safePage ? "default" : "outline"} size="sm" className="h-7 w-7 p-0 text-xs" onClick={() => setPage(item)}>{item}</Button>
              ),
            )}
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>

      {/* Add dialog */}
      <AddTraineeDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      {/* Edit dialog */}
      {editTrainee && (
        <AddTraineeDialog
          open={true}
          onOpenChange={(open) => { if (!open) setEditTrainee(null); }}
          editMode
          initialData={{
            traineeId: editTrainee.id,
            name: editTrainee.name,
            rank: editTrainee.rank,
            designation: editTrainee.designation,
            joinDate: editTrainee.joinDate,
            orgPath: editTrainee.orgPath,
          }}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
