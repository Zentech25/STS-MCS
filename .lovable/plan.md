
## Session Page Redesign

### Understanding the Flow
The session page guides the instructor through a **step-by-step wizard**:

**Step 1 — Group Setup (Assign Trainees to Lanes)**
- Visual lane cards (Lane 1–4) shown side by side
- Each lane has a queue — drag/search trainees into lanes (multiple trainees per lane, first one is active, rest wait their turn)
- Instructor can:
  - **Create new group**: manually assign trainees to lanes
  - **Load pre-made group**: pick from saved group configurations
  - **Save current group**: save the assignment as a reusable group
- Each lane card shows: Trainee ID + Name for each queued trainee, with the first one highlighted as "active"

**Step 2 — Exercise Creation (Per Lane)**
- After group is confirmed, move to exercise setup
- Each lane card now shows the assigned trainee and an exercise configuration area
- Exercise type selector: **Custom** (ARC greyed out / coming soon)
- Each lane can have a **different** exercise — they are independent
- Placeholder for exercise details (user will define next)

**Step 3 — Ready / Session Control**
- Once exercises are assigned, show a summary + Start/Pause/Stop controls
- Live session view (existing lane panels with shot data)

### UX Approach
- **Stepper/wizard** at top showing: `Group Setup → Exercise → Session`
- Clean, non-overwhelming cards for each lane
- Smooth transitions between steps
- "Next" / "Back" navigation between steps

### Files to Create/Edit
- `src/components/simulator/SessionPage.tsx` — complete redesign with wizard flow
- `src/components/simulator/session/GroupSetupStep.tsx` — Step 1 component
- `src/components/simulator/session/ExerciseSetupStep.tsx` — Step 2 component  
- `src/components/simulator/session/SessionLiveStep.tsx` — Step 3 (existing lane panels moved here)
- `src/components/simulator/session/types.ts` — shared types
