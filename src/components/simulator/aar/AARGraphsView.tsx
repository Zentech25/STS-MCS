import { AARSessionRecord } from "./aarTypes";
import { useMemo, useState } from "react";
import { AARFilters, AARFilterValues } from "./AARFilters";
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart as LineChartIcon, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  allRecords: AARSessionRecord[];
}

export function AARGraphsView({ allRecords }: Props) {
  const [filters, setFilters] = useState<AARFilterValues>({
    traineeId: "",
    name: "",
    practiceType: "",
    company: "",
    fromDate: undefined,
    toDate: undefined,
  });
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [zoomLevel, setZoomLevel] = useState(1);

  const filtered = useMemo(() => {
    return allRecords.filter((r) => {
      if (filters.traineeId && !r.traineeId.toLowerCase().includes(filters.traineeId.toLowerCase())) return false;
      if (filters.name && !r.traineeName.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.practiceType && r.practiceType !== filters.practiceType) return false;
      if (filters.fromDate && new Date(r.date) < filters.fromDate) return false;
      if (filters.toDate && new Date(r.date) > filters.toDate) return false;
      return true;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allRecords, filters]);

  const isGrouping = filters.practiceType === "grouping";
  const yLabel = isGrouping ? "Grouping Size (mm)" : "Score";

  const chartData = useMemo(() => {
    return filtered.map((r) => ({
      label: `${r.id}\n${format(new Date(r.date), "dd MMM yy")}`,
      shortLabel: r.id,
      date: format(new Date(r.date), "dd MMM yy"),
      value: isGrouping ? r.groupingSize : r.score,
      trainee: r.traineeName,
      practiceType: r.practiceType,
    }));
  }, [filtered, isGrouping]);

  // Zoom: show a subset of data
  const visibleData = useMemo(() => {
    if (zoomLevel <= 1) return chartData;
    const visibleCount = Math.max(5, Math.ceil(chartData.length / zoomLevel));
    const start = Math.max(0, chartData.length - visibleCount);
    return chartData.slice(start);
  }, [chartData, zoomLevel]);

  const maxZoom = Math.max(1, Math.floor(chartData.length / 5));

  const stats = useMemo(() => {
    if (filtered.length === 0) return null;
    const values = filtered.map((r) => isGrouping ? r.groupingSize : r.score);
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { avg, max, min, count: filtered.length };
  }, [filtered, isGrouping]);

  return (
    <div className="py-4 space-y-5">
      <AARFilters
        filters={filters}
        onChange={setFilters}
        fields={["traineeId", "name", "practiceType", "fromDate", "toDate"]}
      />

      {filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-16">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No data matches your filters. Try adjusting them.</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <GlassCard label="Sessions" value={String(stats.count)} />
              <GlassCard label={`Avg ${isGrouping ? "Grouping" : "Score"}`} value={isGrouping ? `${stats.avg}mm` : String(stats.avg)} />
              <GlassCard label={isGrouping ? "Best (Smallest)" : "Highest"} value={isGrouping ? `${stats.min}mm` : String(stats.max)} accent />
              <GlassCard label={isGrouping ? "Worst (Largest)" : "Lowest"} value={isGrouping ? `${stats.max}mm` : String(stats.min)} />
            </div>
          )}

          {/* Chart controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => setChartType("line")}
              >
                <LineChartIcon className="w-3.5 h-3.5" /> Line
              </Button>
              <Button
                variant={chartType === "bar" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => setChartType("bar")}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Bar
              </Button>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={zoomLevel >= maxZoom}
                onClick={() => setZoomLevel((z) => Math.min(z + 1, maxZoom))}
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={zoomLevel <= 1}
                onClick={() => setZoomLevel((z) => Math.max(1, z - 1))}
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={zoomLevel === 1}
                onClick={() => setZoomLevel(1)}
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              {zoomLevel > 1 && (
                <span className="text-[10px] text-muted-foreground ml-1">
                  Showing {visibleData.length}/{chartData.length}
                </span>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-border/30 bg-background/60 backdrop-blur-sm p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                {isGrouping ? "Grouping Size Over Sessions" : "Score Over Sessions"}
              </h3>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {filters.practiceType ? filters.practiceType : "All Practices"}
              </span>
            </div>
            <div style={{ width: "100%", height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={visibleData} margin={{ top: 5, right: 20, bottom: 60, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis
                      dataKey="shortLabel"
                      tick={({ x, y, payload }) => (
                        <g transform={`translate(${x},${y})`}>
                          <text x={0} y={0} dy={12} textAnchor="end" transform="rotate(-45)" className="fill-muted-foreground" fontSize={10}>
                            {payload.value}
                          </text>
                          <text x={0} y={0} dy={24} textAnchor="end" transform="rotate(-45)" className="fill-muted-foreground" fontSize={9} opacity={0.6}>
                            {visibleData[payload.index]?.date}
                          </text>
                        </g>
                      )}
                      interval={0}
                      height={70}
                    />
                    <YAxis
                      label={{ value: yLabel, angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip content={<CustomTooltip yLabel={yLabel} />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name={yLabel}
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={visibleData} margin={{ top: 5, right: 20, bottom: 60, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis
                      dataKey="shortLabel"
                      tick={({ x, y, payload }) => (
                        <g transform={`translate(${x},${y})`}>
                          <text x={0} y={0} dy={12} textAnchor="end" transform="rotate(-45)" className="fill-muted-foreground" fontSize={10}>
                            {payload.value}
                          </text>
                          <text x={0} y={0} dy={24} textAnchor="end" transform="rotate(-45)" className="fill-muted-foreground" fontSize={9} opacity={0.6}>
                            {visibleData[payload.index]?.date}
                          </text>
                        </g>
                      )}
                      interval={0}
                      height={70}
                    />
                    <YAxis
                      label={{ value: yLabel, angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip content={<CustomTooltip yLabel={yLabel} />} />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name={yLabel}
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                      opacity={0.85}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, yLabel }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-border/50 bg-popover px-3 py-2 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-foreground">{data.shortLabel}</p>
      <p className="text-muted-foreground">{data.date}</p>
      <p className="text-muted-foreground">Trainee: <span className="text-foreground font-medium">{data.trainee}</span></p>
      <p className="text-muted-foreground capitalize">Practice: <span className="text-foreground font-medium">{data.practiceType}</span></p>
      <p className="text-primary font-semibold">{yLabel}: {data.value}{yLabel.includes("mm") ? "mm" : ""}</p>
    </div>
  );
}

function GlassCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border/30 bg-background/60 backdrop-blur-sm p-4 text-center shadow-sm">
      <div className={`text-2xl font-bold ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
