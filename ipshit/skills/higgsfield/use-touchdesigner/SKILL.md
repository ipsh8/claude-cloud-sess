---
name: use-touchdesigner
title: "Create visual effects in TouchDesigner"
description: "Build visual effects for images and video in TouchDesigner, then preview, refine, and export the result."
command: "/use-touchdesigner"
category: "Production"
bundle: "production-skills"
host_app: "TouchDesigner"
relevance_to_3d_jutsu: secondary
source: https://higgsfield.ai/mcp/use-touchdesigner
provider: Higgsfield (MCP skill; server-side workflow instructions not public)
retrieved: 2026-10-14
---

# Create visual effects in TouchDesigner

Build visual effects for images and video in TouchDesigner, then preview, refine, and export the result.

## Invocation

Slash command `/use-touchdesigner` on the Higgsfield MCP (`https://mcp.higgsfield.ai/mcp`, OAuth via Clerk), used from Claude, Codex or the ChatGPT plugin. The command's full workflow instructions are served by the MCP server after sign-in and are **not** included here; what follows is the public launch prompt verbatim.

## Launch prompt (verbatim from the page's deep link)

```text
/use-touchdesigner
Create a visual effect in TouchDesigner for my image or video. Ask for a style reference, output format, and duration. Build an editable network with clear controls for the main effect, preview it with my source media, and refine the look before export. Preserve the original input and save the TouchDesigner project.

Ask me for the source assets and project files before editing. Preserve existing work.

Workflow preview (for context, not source artwork): https://static.higgsfield.ai/skills/production/20260924/use-touchdesigner-poster.webp

Check that the required local tools and workflow instructions are available before editing.
@Higgsfield /use-touchdesigner

If the Higgsfield plugin is not installed, ask me to [install the Higgsfield plugin](https://chatgpt.com/plugins/higgsfield?open_in_app) before continuing.
```

<details><summary>Variant: chatgpt</summary>

```text
/use-touchdesigner
Create a visual effect in TouchDesigner for my image or video. Ask for a style reference, output format, and duration. Build an editable network with clear controls for the main effect, preview it with my source media, and refine the look before export. Preserve the original input and save the TouchDesigner project.

Ask me for the source assets and project files before editing. Preserve existing work.

Workflow preview (for context, not source artwork): https://static.higgsfield.ai/skills/production/20260924/use-touchdesigner-poster.webp

Check that the required local tools and workflow instructions are available before editing.
@Higgsfield /use-touchdesigner
```
</details>

## Setup steps (page text)

Start from a reference or describe the effect you want. Build a controllable TouchDesigner network, adjust the look, combine effects where useful, and inspect the result before exporting.
Open Codex
Use Codex on the same computer as TouchDesigner.
Connect Higgsfield
Enable Higgsfield in Codex and check that its tools are available.
Install TouchDesigner
Install TouchDesigner on the same computer.
Get TouchDesigner
Start your first workflow
Use the Open in Codex button to start this workflow, then provide your brief and source assets.
Open in Codex

## Media

- https://static.higgsfield.ai/skills/production/20260924/use-touchdesigner-poster.webp
- https://static.higgsfield.ai/skills/production/20260924/use-touchdesigner.mp4

## Recommended presets (as listed on the page)

Explore more cinematic workflows for your next project.
Color grade footage in DaVinci Resolve
Grade footage in DaVinci Resolve Studio with balanced shots, natural skin tones, and an editable node structure.
/
color-grading
Production
Simulate destruction in Blender
Create cinematic destruction in Blender with fractured structures, simulated debris, dust, and editable scenes.
/
Destruction-Studio
Production
Animate object assembly in Blender
Animate objects assembling in Blender with coordinated parts, clear camera staging, and an editable final scene.
/
Exploded-view
Production
Build 3D scenes in Blender
Build editable Blender scenes from characters, architecture, and props, with room to refine poses and camera angles.
/
Scene-Builder
Production
