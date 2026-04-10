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
  date: Date | undefined;
  fromDate: Date | undefined;
  toDate: Date | undefined;
}

interface Props {
  filters: AARFilterValues;
  onChange: (f: AARFilterValues) => void;
  showDateRange: boolean;
}

export function AARFilters({ filters, onChange, showDateRange }: Props) {
  const set = (k: keyof AARFilterValues, v: any) => onChange({ ...filters, [k]: v });

  return (
    <div className="my-4 space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Trainee ID</label>
          <Input placeholder="e.g. T001" value={filters.traineeId} onChange={(e) => set("traineeId", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
          <Input placeholder="Search name" value={filters.name} onChange={(e) => set("name", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Practice Type</label>
          <Select value={filters.practiceType} onValueChange={(v) => set("practiceType", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="grouping">Grouping</SelectItem>
              <SelectItem value="application">Application</SelectItem>
              <SelectItem value="timed">Timed</SelectItem>
              <SelectItem value="snapshot">Snapshot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Company</label>
          <Select value={filters.company} onValueChange={(v) => set("company", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Alpha">Alpha</SelectItem>
              <SelectItem value="Bravo">Bravo</SelectItem>
              <SelectItem value="Charlie">Charlie</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("h-9 text-sm justify-start font-normal", !filters.date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                {filters.date ? format(filters.date, "PP") : "Pick date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={filters.date} onSelect={(d) => set("date", d)} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">From Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("h-9 text-sm justify-start font-normal", !filters.fromDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                {filters.fromDate ? format(filters.fromDate, "PP") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={filters.fromDate} onSelect={(d) => set("fromDate", d)} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">To Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("h-9 text-sm justify-start font-normal", !filters.toDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                {filters.toDate ? format(filters.toDate, "PP") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={filters.toDate} onSelect={(d) => set("toDate", d)} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {showDateRange && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">From Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("h-9 text-sm justify-start font-normal", !filters.fromDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {filters.fromDate ? format(filters.fromDate, "PP") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={filters.fromDate} onSelect={(d) => set("fromDate", d)} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">To Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("h-9 text-sm justify-start font-normal", !filters.toDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {filters.toDate ? format(filters.toDate, "PP") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={filters.toDate} onSelect={(d) => set("toDate", d)} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-end">
            <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={() => onChange({ traineeId: "", name: "", practiceType: "", company: "", date: undefined, fromDate: undefined, toDate: undefined })}>
              <X className="w-3.5 h-3.5 mr-1" /> Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
