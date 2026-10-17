# Arena synthesis — Event Horizon homepage

**Candidates:** c1 observatory instrument (Canvas 2D), c2 cinematic (WebGL shader + 2D fallback), c3 playful narrator (Canvas 2D). No dropouts.

**Cross-judge:** c1 27, c2 26, c3 25; recommended c1 as base (cleanest code), graft c2's shader.

**Pick: c2.** Disagreed with the judge. The board's main condition is a flawless "wow" from the host, and c2's shader is the only hero that delivers it. Transplanting a shader + fallback into c1 is a bigger, riskier change than grafting c1/c3's smaller features into c2. c2's extensibility cost is confined to one GLSL string; briefings are already one `STORIES` array.

**Grafts**
- c1: per-briefing source citation (`src` field, `#story-src`); trajectory preview while dragging.
- c3: host commentary bubble in Orbits (`say()`); speed vs escape speed readout with bound/escaping label (replaced c2's buggy "Escaped" counter); ghost-text layer so the card reserves exactly the story's height (no jump, no fixed gap).
- Fixes: message when tapping inside 3 Rs, explicit `body{margin:0}`.

**Rejected**
- c1 telescope telemetry frame and signal bars: clashes with c2's film look.
- c3 per-story gestures and pointer "look": would need a 2D overlay on the shader; worth doing later as the next host feature.
- c3 plum palette, pill buttons: read as templated.
- c3 keyboard launch: "Add a body" button already covers keyboard users.

**Verification:** `node --check` passes. Headless Chromium (SwiftShader WebGL) at 1280 and 375: no page errors, no horizontal scroll, briefing navigation, source line, drag preview, launch commentary and escape ratio all work.
