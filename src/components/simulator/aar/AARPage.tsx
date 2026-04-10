import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AARFilters, AARFilterValues } from "./AARFilters";
import { AARReplayView } from "./AARReplayView";
import { AARReportsView } from "./AARReportsView";
import { AARGraphsView } from "./AARGraphsView";
import { AARSessionRecord } from "./aarTypes";
import { MOCK_AAR_RECORDS } from "./aarMockData";
import { FileText, PlayCircle, BarChart3 } from "lucide-react";

export function AARPage() {
  const [subTab, setSubTab] = useState<"replay" | "reports" | "graphs">("reports");
  const [filters, setFilters] = useState<AARFilterValues>({
    traineeId: "",
    name: "",
    practiceType: "",
    company: "",
    fromDate: undefined,
    toDate: undefined,
  });
  const [selectedRecord, setSelectedRecord] = useState<AARSessionRecord | null>(null);

  const filtered = MOCK_AAR_RECORDS.filter((r) => {
    if (filters.traineeId && !r.traineeId.toLowerCase().includes(filters.traineeId.toLowerCase())) return false;
    if (filters.name && !r.traineeName.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.practiceType && r.practiceType !== filters.practiceType) return false;
    if (filters.company && r.company !== filters.company) return false;
    if (filters.fromDate && new Date(r.date) < filters.fromDate) return false;
    if (filters.toDate && new Date(r.date) > filters.toDate) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Tabs value={subTab} onValueChange={(v) => { setSubTab(v as any); setSelectedRecord(null); }} className="flex flex-col h-full">
        <div className="shrink-0 px-6 pt-4 pb-1">
          <TabsList className="bg-muted/40 backdrop-blur-sm border border-border/30 p-1 h-11">
            <TabsTrigger value="reports" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <FileText className="w-3.5 h-3.5" /> Reports
            </TabsTrigger>
            <TabsTrigger value="replay" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <PlayCircle className="w-3.5 h-3.5" /> Replay
            </TabsTrigger>
            <TabsTrigger value="graphs" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <BarChart3 className="w-3.5 h-3.5" /> Graphs
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="reports" className="flex-1 overflow-auto px-6 pb-4">
          <AARFilters filters={filters} onChange={setFilters} />
          <AARReportsView records={filtered} onSelectRecord={(r) => { setSelectedRecord(r); setSubTab("replay"); }} />
        </TabsContent>

        <TabsContent value="replay" className="flex-1 overflow-auto px-6 pb-4">
          {!selectedRecord ? (
            <>
              <AARFilters filters={filters} onChange={setFilters} />
              <AARReportsView records={filtered} onSelectRecord={setSelectedRecord} isReplayPicker />
            </>
          ) : (
            <AARReplayView record={selectedRecord} onBack={() => setSelectedRecord(null)} records={filtered} onNavigate={setSelectedRecord} />
          )}
        </TabsContent>

        <TabsContent value="graphs" className="flex-1 overflow-auto px-6 pb-4">
          <AARGraphsView allRecords={MOCK_AAR_RECORDS} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
