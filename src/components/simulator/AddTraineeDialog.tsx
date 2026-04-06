import { useState, useCallback } from "react";
import {
  ChevronRight, ChevronDown, Building2, Shield, Users, Crosshair, UserCheck,
  ImagePlus,
} from "lucide-react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { OrbatNode, TYPE_META, INITIAL_ORBAT, mapTree, getNodePath } from "./orbatData";

const ICON_MAP: Record<OrbatNode["type"], typeof Building2> = {
  organization: Building2,
  regiment: Shield,
  unit: Users,
  company: Crosshair,
  platoon: UserCheck,
  section: Users,
};

const RANKS = ["Pvt", "LCpl", "Cpl", "Sgt", "SSgt", "Lt", "Capt", "Maj", "LtCol", "Col"];
const DESIGNATIONS = ["Rifleman", "Marksman", "Grenadier", "SAW Gunner", "Team Leader", "Squad Leader", "Medic", "Signaller"];

// ── Mini tree for selection ───────────────────────────────
function SelectableTreeNode({
  node, depth, selectedId, onSelect, onToggle,
}: {
  node: OrbatNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const meta = TYPE_META[node.type];
  const Icon = ICON_MAP[node.type];
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1 py-[2px] pr-1 rounded-md cursor-pointer transition-colors text-xs",
          isSelected ? "bg-primary/15 ring-1 ring-primary/40" : "hover:bg-muted/40",
        )}
        style={{ paddingLeft: `${depth * 14 + 4}px` }}
        onClick={() => onSelect(node.id)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); if (hasChildren) onToggle(node.id); }}
          className="w-4 h-4 flex items-center justify-center"
          style={{ visibility: hasChildren ? "visible" : "hidden" }}
        >
          {node.expanded ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
        </button>
        <div
          className="w-4 h-4 rounded flex items-center justify-center shrink-0"
          style={{ background: `hsl(${meta.color} / 0.12)`, color: `hsl(${meta.color})` }}
        >
          <Icon className="w-2.5 h-2.5" />
        </div>
        <span className={cn("truncate", isSelected ? "font-semibold text-primary" : "text-foreground")}>
          {node.name}
        </span>
      </div>
      {node.expanded && hasChildren && (
        <div className="relative">
          <span
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${depth * 14 + 12}px`, background: `hsl(${meta.color} / 0.15)` }}
          />
          {node.children.map((c) => (
            <SelectableTreeNode key={c.id} node={c} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

interface AddTraineeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTraineeDialog({ open, onOpenChange }: AddTraineeDialogProps) {
  const [tree, setTree] = useState<OrbatNode[]>(INITIAL_ORBAT);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Form state
  const [traineeId, setTraineeId] = useState("");
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [designation, setDesignation] = useState("");
  const [joinDate, setJoinDate] = useState<Date>();
  const [photo, setPhoto] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const toggleNode = useCallback((id: string) => {
    setTree((prev) => mapTree(prev, id, (n) => ({ ...n, expanded: !n.expanded })));
  }, []);

  // Derive path from selection
  const path = selectedNodeId ? getNodePath(tree, selectedNodeId) : null;
  const fullPath = path ? path.map((n) => n.name).join(" / ") : "";

  const handlePhotoSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setPhoto(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSubmit = () => {
    if (!traineeId || !name || !rank || !designation || !joinDate || !selectedNodeId) {
      toast.error("Please fill in all required fields and select an ORBAT node.");
      return;
    }
    toast.success(`Trainee "${name}" added successfully.`);
    onOpenChange(false);
    // Reset
    setTraineeId(""); setName(""); setRank(""); setDesignation("");
    setJoinDate(undefined); setPhoto(null); setSelectedNodeId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px] w-[95vw] p-0 gap-0 overflow-hidden flex flex-col" style={{ maxHeight: "85vh" }}>
        <DialogHeader className="px-5 pt-4 pb-3" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
          <DialogTitle className="text-base">Add New Trainee</DialogTitle>
          <DialogDescription className="text-xs">Fill in the details and select an ORBAT node to assign the trainee.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-0 flex-1 min-h-0 overflow-hidden">
          {/* Section 1: ORBAT Tree */}
          <div className="w-[280px] shrink-0 flex flex-col border-r border-border/40">
            <div className="px-3 py-2 shrink-0" style={{ borderBottom: "1px solid hsl(var(--border) / 0.4)" }}>
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Step 1 - Select Organization</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 text-xs">
              {tree.map((node) => (
                <SelectableTreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedId={selectedNodeId}
                  onSelect={setSelectedNodeId}
                  onToggle={toggleNode}
                />
              ))}
            </div>
          </div>

          {/* Section 2: Basic Details */}
          <div className="flex-1 flex flex-col border-r border-border/40 min-w-0">
            <div className="px-4 py-2 shrink-0" style={{ borderBottom: "1px solid hsl(var(--border) / 0.4)" }}>
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Step 2 - Enter Details</h3>
            </div>
            <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
              <div className="flex gap-3">
                {/* Photo */}
                <div
                  className="shrink-0 w-20 h-24 rounded-lg border-2 border-dashed border-border/60 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden"
                  onClick={handlePhotoSelect}
                >
                  {photo ? (
                    <img src={photo} alt="Trainee" className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <>
                      <ImagePlus className="w-5 h-5 text-muted-foreground/50 mb-1" />
                      <span className="text-[9px] text-muted-foreground/60">Browse</span>
                    </>
                  )}
                </div>

                {/* ID + Name */}
                <div className="flex-1 flex flex-col gap-2">
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Trainee ID</Label>
                    <Input
                      value={traineeId}
                      onChange={(e) => setTraineeId(e.target.value)}
                      placeholder="TRN-0001"
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Rank */}
              <div>
                <Label className="text-[11px] text-muted-foreground">Rank</Label>
                <Select value={rank} onValueChange={setRank}>
                  <SelectTrigger className="h-8 text-xs mt-1">
                    <SelectValue placeholder="Select rank" />
                  </SelectTrigger>
                  <SelectContent>
                    {RANKS.map((r) => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Designation */}
              <div>
                <Label className="text-[11px] text-muted-foreground">Designation</Label>
                <Select value={designation} onValueChange={setDesignation}>
                  <SelectTrigger className="h-8 text-xs mt-1">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {DESIGNATIONS.map((d) => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Date of Joining */}
              <div>
                <Label className="text-[11px] text-muted-foreground">Date of Joining</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-8 justify-start text-left text-xs font-normal mt-1",
                        !joinDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="w-3.5 h-3.5 mr-2" />
                      {joinDate ? format(joinDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex items-center justify-between gap-1 px-3 pt-3 pb-1">
                      <Select
                        value={String(calendarMonth.getMonth())}
                        onValueChange={(v) => {
                          const d = new Date(calendarMonth);
                          d.setMonth(Number(v));
                          setCalendarMonth(d);
                        }}
                      >
                        <SelectTrigger className="h-7 text-xs w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                            <SelectItem key={i} value={String(i)} className="text-xs">{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={String((calendarMonth ?? new Date()).getFullYear())}
                        onValueChange={(v) => {
                          const d = new Date(calendarMonth);
                          d.setFullYear(Number(v));
                          setCalendarMonth(d);
                        }}
                      >
                        <SelectTrigger className="h-7 text-xs w-[80px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 31 }, (_, i) => 2000 + i).map((y) => (
                            <SelectItem key={y} value={String(y)} className="text-xs">{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Calendar
                      mode="single"
                      month={calendarMonth}
                      onMonthChange={setCalendarMonth}
                      selected={joinDate}
                      onSelect={setJoinDate}
                      initialFocus
                      className={cn("p-3 pt-1 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Section 3: Organization */}
          <div className="w-[260px] shrink-0 flex flex-col min-w-0">
            <div className="px-4 py-2 shrink-0" style={{ borderBottom: "1px solid hsl(var(--border) / 0.4)" }}>
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider"></h3>
            </div>
            <div className="flex-1 p-4 flex flex-col gap-2.5">
              {(["organization", "regiment", "unit", "platoon", "section"] as const).map((key) => (
                <div key={key}>
                  <Label className="text-[11px] text-muted-foreground capitalize">{key}</Label>
                  <Input
                    readOnly
                    value={orgFields[key]}
                    placeholder="—"
                    className="h-8 text-xs mt-1 bg-muted/30 cursor-default"
                  />
                </div>
              ))}
              <div>
                <Label className="text-[11px] text-muted-foreground">Path</Label>
                <Input
                  readOnly
                  value={fullPath}
                  placeholder="Select a node from ORBAT"
                  className="h-8 text-[10px] mt-1 bg-muted/30 cursor-default font-mono"
                  title={fullPath}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-5 py-3 gap-2 sm:gap-2" style={{ borderTop: "1px solid hsl(var(--border))" }}>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit}>Add Trainee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
