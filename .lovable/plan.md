

## Plan: Dynamic Lane Grid Layout

### Problem
The grid is hardcoded to `grid-cols-5`, which only works well for exactly 10 lanes. Fewer lanes leave empty space; more lanes don't align properly.

### Solution
Dynamically compute the optimal column count based on the number of lanes so thumbnails always fill the available space proportionally.

### Logic
- 1-2 lanes → 1-2 columns
- 3-4 lanes → 2 columns  
- 5-6 lanes → 3 columns
- 7-9 lanes → 3 columns (3 rows)
- 10-12 lanes → 4 columns (or 5 for 10)
- 13-16 lanes → 4 columns
- 17-20 lanes → 5 columns
- 21+ lanes → 6 columns

A simple approach: use `Math.ceil(Math.sqrt(n))` capped at 6 to get a balanced grid that fills the space.

### Changes

**`src/components/simulator/session/SessionLiveStep.tsx`**
- Add a `useMemo` that computes optimal columns from `lanes.length`
- Replace hardcoded `grid-cols-5` with dynamic `gridTemplateColumns` style
- Keep `auto-rows-fr` and `h-full` so cards stretch to fill vertical space

### Updated Prompt Section
The prompt will note: "The grid adapts dynamically — column count is computed from lane count (roughly `ceil(sqrt(n))`, max 6) so cards always fill the screen whether there are 2 lanes or 20+."

