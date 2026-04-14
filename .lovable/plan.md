

## Fix Build Errors in chart.tsx

The `recharts` package was updated and its TypeScript types changed, breaking `chart.tsx`. The errors are about missing properties (`payload`, `label`) and incompatible `Pick` types on the Legend component.

### Plan

**File: `src/components/ui/chart.tsx`**

1. **Fix ChartTooltipContent props** (lines ~96-117): Extract `active`, `payload`, `label` from the component props by casting or using `any` type workaround, since recharts v2.13+ changed its tooltip prop types. Add explicit type declarations for these destructured props.

2. **Fix ChartLegendContent props** (line ~233): Replace `Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign">` with inline prop types since `payload` is no longer a valid key in the updated Legend SVG props. Define `payload` and `verticalAlign` as explicit optional props.

These are type-only fixes — no behavioral changes.

