import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface AARFilterValues {
  traineeId: string;
  name: string;
  practiceType: string;
  company: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
}

interface Props {
  filters: AARFilterValues;
  onChange: (f: AARFilterValues) => void;
  /** Which filter fields to show */
  fields?: Array<"traineeId" | "name" | "practiceType" | "company" | "fromDate" | "toDate">;
}

const ALL_FIELDS: Props["fields"] = ["traineeId", "name", "practiceType", "company", "fromDate", "toDate"];

export function AARFilters({ filters, onChange, fields = ALL_FIELDS }: Props) {
  const set = (k: keyof AARFilterValues, v: any) => onChange({ ...filters, [k]: v });
  const show = (f: string) => fields!.includes(f as any);

  const colCount = fields!.length;
  const gridClass = colCount <= 3 ? "grid-cols-1 sm:grid-cols-3" : colCount <= 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6";

  return (
    <div className="my-4 space-y-3">
      <div className={cn("grid gap-3", gridClass)}>
        {show("traineeId") && (
          <FilterField label="Trainee ID">
            <Input placeholder="e.g. T001" value={filters.traineeId} onChange={(e) => set("traineeId", e.target.value)} className="h-9 text-sm bg-background/60 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-colors" />
          </FilterField>
        )}
        {show("name") && (
          <FilterField label="Name">
            <Input placeholder="Search name" value={filters.name} onChange={(e) => set("name", e.target.value)} className="h-9 text-sm bg-background/60 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-colors" />
          </FilterField>
        )}
        {show("practiceType") && (
          <FilterField label="Practice Type">
            <Select value={filters.practiceType || "all"} onValueChange={(v) => set("practiceType", v === "all" ? "" : v)}>
              <SelectTrigger className="h-9 text-sm bg-background/60 backdrop-blur-sm border-border/50"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="grouping">Grouping</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="timed">Timed</SelectItem>
                <SelectItem value="snapshot">Snapshot</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
        )}
        {show("company") && (
          <FilterField label="Company">
            <Select value={filters.company || "all"} onValueChange={(v) => set("company", v === "all" ? "" : v)}>
              <SelectTrigger className="h-9 text-sm bg-background/60 backdrop-blur-sm border-border/50"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Alpha">Alpha</SelectItem>
                <SelectItem value="Bravo">Bravo</SelectItem>
                <SelectItem value="Charlie">Charlie</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
        )}
        {show("fromDate") && (
          <FilterField label="From Date">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("h-9 text-sm justify-start font-normal bg-background/60 backdrop-blur-sm border-border/50", !filters.fromDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {filters.fromDate ? format(filters.fromDate, "PP") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.fromDate}
                  onSelect={(d) => set("fromDate", d)}
                  className="p-3 pointer-events-auto"
                  captionLayout="dropdown-buttons"
                  fromYear={2020}
                  toYear={2030}
                />
              </PopoverContent>
            </Popover>
          </FilterField>
        )}
        {show("toDate") && (
          <FilterField label="To Date">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("h-9 text-sm justify-start font-normal bg-background/60 backdrop-blur-sm border-border/50", !filters.toDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {filters.toDate ? format(filters.toDate, "PP") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.toDate}
                  onSelect={(d) => set("toDate", d)}
                  className="p-3 pointer-events-auto"
                  captionLayout="dropdown-buttons"
                  fromYear={2020}
                  toYear={2030}
                />
              </PopoverContent>
            </Popover>
          </FilterField>
        )}
      </div>
      <div className="flex items-end">
        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground transition-colors" onClick={() => onChange({ traineeId: "", name: "", practiceType: "", company: "", fromDate: undefined, toDate: undefined })}>
          <X className="w-3.5 h-3.5 mr-1" /> Clear All
        </Button>
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
