

## Zone Highlighting with Color-Coded Maps

### Summary
Add zone map images alongside each target and use a hidden canvas to detect zones by color. When a zone row is selected, overlay the zone map with CSS mix-blend/opacity to highlight that specific region on the target preview.

### Zone Map Analysis (from uploaded images)

| Target | Zone Map File | Zones (colors detected) |
|--------|--------------|------------------------|
| Fig 120cm | Fig120cm_Color.png | 10 zones (red, green, dark blue, yellow, magenta, cyan, dark navy, olive, steel blue, orange + gray corners) |
| Fig 120x4 | Fig120x4_Color.png | 10 zones (same color scheme) |
| Fig 11 | Fig11_Color.png | 8 zones (dark navy body, cyan, magenta, yellow, dark blue ring, green, red center, white bg) |
| Fig 11 Line | Fig11_Line_Color.png | 4 zones (yellow body, blue rect, green inner, red center) |
| Fig 12 | Fig12_Color.png | 2 zones (green silhouette, red circle) |
| SPG Target | SPGTarget_color.png | 3 zones (blue outer, green inner, red center) |
| Target 3 | Target_3_color.png | 2 zones (red hostage-taker, green hostage) |
| Small Blue | small_target_blue0.jpg | 3 zones (white bg, light blue top, gray bottom, inner circle) |
| Small Red | small_target_red0.jpg | 3 zones (white bg, gray top, pink bottom, inner circle) |

### Implementation

**Step 1 — Copy zone map images to `src/assets/targets/zones/`**

Copy all 9 uploaded zone maps into a `zones` subdirectory.

**Step 2 — Update `TargetsContext.tsx`**

- Add a `zoneMap` field to `TargetType` interface (the zone map image path)
- Add a `zoneColors` field: array of `{ zone: number, color: string }` mapping each zone number to its hex color in the zone map
- Import all zone map images and wire them into the TARGETS array
- Update zone counts to match actual zones visible in the color maps

**Step 3 — Update `TargetRegionScoresPage.tsx`**

- Add a hidden `<canvas>` element that loads the zone map image
- On zone row selection, use the canvas to create a mask: sample the zone map, find pixels matching the selected zone's color, and render a colored overlay on top of the target image
- The overlay approach: render the zone map image in a second `<img>` on top of the target, use CSS `mix-blend-mode` or a canvas-generated mask to show only the selected zone's region with a semi-transparent highlight color
- Clicking directly on the target image preview will also detect which zone was clicked (by sampling the zone map canvas at that pixel coordinate) and select the corresponding zone row

### Technical Approach for Highlighting

Use a canvas-based approach:
1. Load the zone map into a hidden canvas
2. When a zone is selected, iterate canvas pixels and create a highlight mask (transparent everywhere except where the zone color matches)
3. Render the mask as a `data:` URL on an absolutely-positioned `<img>` overlay
4. This gives pixel-perfect zone highlighting that exactly matches the color-coded maps

### Files to Create/Edit
- **Copy**: 9 zone map images → `src/assets/targets/zones/`
- **Edit**: `src/contexts/TargetsContext.tsx` — add `zoneMap` and `zoneColors` fields
- **Edit**: `src/components/simulator/TargetRegionScoresPage.tsx` — add canvas-based zone highlighting overlay and click-to-select

