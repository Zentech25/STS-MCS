

## Summary

A comprehensive prompt to recreate the **Tactical Simulator** application as a Windows desktop application using Electron. This prompt captures all features built across the project lifecycle.

---

## The Full Prompt

```text
Build a Tactical Simulator application for military marksmanship training that will be packaged as a Windows desktop application using Electron.

### Core Requirements:

**User Authentication & Roles**
- Implement login/signup with role-based access: Administrator, Engineer, and Instructor
- Each role sees a different dashboard view
- Use localStorage or Supabase for authentication state

**Dashboard Architecture**
- Header bar with:
  - "TS" logo with "Tactical Simulator v2.4.1" branding
  - Real-time clock display
  - User profile dropdown with theme toggle (dark/light mode) and logout
  - NO search bar or notification bell (keep it clean)
  
**Session Management (Instructor Role)**
- Three-step workflow with visual stepper: Group Setup → Exercise → Live Session
- Stepper is hidden in Firer mode and during live session
- Master/Firer mode toggle in header:
  - Master: Full control over all setup steps
  - Firer: Skips directly to Live Session with prominent "Control with FPE" badge (animated pulsing indicator, gradient background, accent color)

**Group Setup Step**
- 10 lanes displayed as cards
- Add trainees to lanes with name, rank, and batch selection
- Queue system: first trainee is active, others wait
- Save/load predefined groups

**Exercise Setup Step**
- Mode toggle: Custom vs ARC (Automatic Range Control)
- Custom mode: Configure per-lane exercises with:
  - Practice type: Grouping, Application, Timed, Snap Shot
  - Weapon selection
  - Firing position (Standing, Kneeling, Prone)
  - Range: DROPDOWN with options [10, 25, 50, 100, 200, 300, 400] meters (NOT number input)
  - Rounds count
  - Time of day (Day/Night) with visibility percentage for night
  - Target type selection
  - Timed practice: time limit field
  - Snap Shot: exposure count, up time, down time
- ARC mode: Use predefined ARC configurations

**Live Session Step**
- Display up to 4 pinned lane cards (limit pinning to 4 maximum)
- Bottom tile bar showing all 10 lanes
- Bottom tiles show:
  - Connection status (connected/disconnected)
  - Exercise status: "Completed" or "In Progress"
- Hover behavior on bottom tiles:
  - When hovering over a bottom tile, overlay that lane's card on top of currently pinned cards
  - Moving cursor off removes the overlay
  - Allows previewing any lane without unpinning current 4
- Target preview display on pinned cards
- Prominent "Control with FPE" badge in Firer mode (no back button, animated pulse)

**ARC Tool (Configure Page)**
- Configure weapon-to-fire-type mappings
- Add/edit weapons, fire types, and practices
- ARC configuration form with:
  - Weapon selection (NO add button next to weapon field - keep it clean)
  - Type of fire
  - Practice name
  - Firing position
  - Range: DROPDOWN [10, 25, 50, 100, 200, 300, 400] (NOT number input)
  - Practice type: Grouping, Application, Timed, Snap Shot
  - Rounds allotted
  - Day/Night toggle
  - Score classification settings (Marksman, First Class, Standard)
  - Target regions with sector ranges and scores
- Save/load ARC configurations

**AAR (After Action Review) Page**
- Tabbed interface: Filters, Replay, Graphs, Reports
- Filter by date, batch, lane, weapon
- Replay view: Shot-by-shot playback on target diagram
- Graphs view: Performance analytics, score trends
- Reports view: Individual trainee reports with score breakdown
- Export capabilities

**Trainee & Batch Management**
- Trainee list with add/edit functionality
- Batch creation and management
- Rank selection from predefined list

**Weapons & Assets Configuration**
- Configure weapons list
- Configure firing positions
- Configure ranks list
- All stored in context for cross-page access

**Leaderboard Page**
- Score rankings by batch and session
- Filter by date range and weapon

**ORBAT Page**
- Organizational chart visualization
- Hierarchical display of units and personnel

**Visual Design System**
- Dark/Light theme support with CSS variables
- Glass morphism effects: --surface-glass, backdrop filters
- Gradient primary colors: blue-based (hsl 230)
- Accent colors for warnings and statuses
- Consistent spacing, rounded corners (rounded-xl, rounded-2xl)
- Lucide icons throughout
- Framer Motion animations for transitions and pulsing effects

**State Management**
- React Context for: Auth, Theme, ARC, Targets, Training Assets
- No external backend - use localStorage or Supabase if needed
- All data ephemeral (refresh resets to defaults)

**Windows Desktop Packaging**
- Package as Electron application for Windows
- Use @electron/packager with --platform=win32
- Vite base path must be set to './' for file:// protocol compatibility
- Create electron/main.cjs (CommonJS) with BrowserWindow loading index.html
- Enable contextIsolation and disable nodeIntegration for security
- Final output as .zip for Windows distribution (not .exe installer)

### Technical Stack:
- React 18 + TypeScript 5
- Vite 5 with base: './' 
- Tailwind CSS v3 with custom CSS variables
- Framer Motion for animations
- Lucide React for icons
- Recharts for graphs
- shadcn/ui components (button, card, select, input, dialog, etc.)
- Electron + @electron/packager for Windows build

### Deliverables:
1. Fully functional React application with all features above
2. Electron main process configuration (electron/main.cjs)
3. Windows build packaged as .zip file
4. Instructions for running the .exe on Windows

### File Structure:
- src/components/simulator/ - Main simulator components
- src/components/simulator/session/ - Session step components
- src/components/simulator/aar/ - AAR components
- src/contexts/ - All React contexts
- src/components/ui/ - shadcn components
- electron/ - Electron main process files
- dist/ - Built React app (loaded by Electron)
```

