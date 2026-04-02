# Military Training Simulator UI

## Overview

A full-screen (1920×1080) Windows desktop simulator interface with a futuristic aerospace/command-center aesthetic. Deep navy/graphite base with electric blue/cyan accents, glassmorphism panels, and micro-interactions throughout.

## Screens & Flow

### 1. Login Screen

- Centered glass panel over animated particle/grid background
- Username & password fields with glow-on-focus effects
- Show/hide password toggle
- Primary login button with cyan glow pulse
- Links to Sign Up and Change Password
- Success: smooth fade transition to dashboard
- Error: shake animation + red border flash

### 2. Sign Up Screen

- Same animated background as login
- Form: Username, Password, Confirm Password
- Role selection via 3 interactive cards (Instructor, Administrator, Service Engineer) with icons, descriptions, hover glow, and animated selection state
- Submit button transitions to login on success

### 3. Change Password Screen

- Simple glass panel: Current Password, New Password, Confirm New Password

### 4. Main Application Shell (post-login)

- **Top header bar**: App title ("TACTICAL TRAINING SIMULATOR"), system status indicators (Connected/Offline/Warning with colored dots), live clock display, user info + logout
- **Role-based dashboard content** rendered in structured grid panels:

#### Instructor Dashboard

- Simulation controls panel (Start / Pause / End buttons with glow states)
- Performance monitoring panel with gauges/metrics
- Trainee status overview panel
- Locked admin/engineer features shown as disabled with opacity + blur

#### Administrator Dashboard

- Full system overview panel
- User management panel (table with role badges)
- System configuration panel
- Simulation controls (also accessible)

#### Service Engineer Dashboard

- Hardware diagnostics panel with status indicators
- System health gauges
- Error/event log panel
- Locked simulation controls shown as disabled

## Design System

- **Colors**: Navy (#0a0e1a), Graphite (#1a1f2e), Slate (#252b3b), Cyan accent (#00d4ff), Amber warning (#ffb020), Red error (#ff3b3b)
- **Typography**: Monospace/tech font (JetBrains Mono or similar) for data, clean sans-serif for labels
- **Effects**: Subtle glassmorphism on panels (backdrop-blur, semi-transparent borders), soft glow on interactive elements, thin 1px borders with low-opacity cyan
- **Micro-interactions**: Hover glow + slight scale on buttons, focus glow on inputs, ripple on click, smooth fade/slide transitions between screens

## State Management

- Auth state stored in React context (local only, no backend)
- Role determines which dashboard panels are active vs disabled
- Mock data for all panels

**Target Audience** 

- Militry officials
- Soldiers