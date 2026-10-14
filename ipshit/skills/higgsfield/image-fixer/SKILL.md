---
name: image-fixer
title: "Clean up images in Photoshop"
description: "Refine generated locations in Photoshop by fixing textures, removing unwanted objects, and preserving editable masks."
command: "/Image-fixer"
category: "Production"
bundle: "production-skills"
host_app: "Photoshop"
relevance_to_3d_jutsu: secondary
source: https://higgsfield.ai/mcp/image-fixer
provider: Higgsfield (MCP skill; server-side workflow instructions not public)
retrieved: 2026-10-14
---

# Clean up images in Photoshop

Refine generated locations in Photoshop by fixing textures, removing unwanted objects, and preserving editable masks.

## Invocation

Slash command `/Image-fixer` on the Higgsfield MCP (`https://mcp.higgsfield.ai/mcp`, OAuth via Clerk), used from Claude, Codex or the ChatGPT plugin. The command's full workflow instructions are served by the MCP server after sign-in and are **not** included here; what follows is the public launch prompt verbatim.

## Launch prompt (verbatim from the page's deep link)

```text
/Image-fixer
Refine this generated location image in Adobe Photoshop. Ask me which objects to remove, which textures to repair, and what lighting I want. Clean up inconsistent details and surfaces, blend only the necessary generated changes through editable masks, and preserve the composition. Keep the retouching layered and save a PSD.

Ask me for the source assets and project files before editing. Preserve existing work.

Workflow preview (for context, not source artwork): https://static.higgsfield.ai/skills/production/20260924/image-fixer-poster.webp

Use the installed integration and its matching workflow instructions. Verify the live connection before editing.
@Higgsfield /use-photoshop

If the Higgsfield plugin is not installed, ask me to [install the Higgsfield plugin](https://chatgpt.com/plugins/higgsfield?open_in_app) before continuing.
```

<details><summary>Variant: chatgpt</summary>

```text
/Image-fixer
Refine this generated location image in Adobe Photoshop. Ask me which objects to remove, which textures to repair, and what lighting I want. Clean up inconsistent details and surfaces, blend only the necessary generated changes through editable masks, and preserve the composition. Keep the retouching layered and save a PSD.

Ask me for the source assets and project files before editing. Preserve existing work.

Workflow preview (for context, not source artwork): https://static.higgsfield.ai/skills/production/20260924/image-fixer-poster.webp

Use the installed integration and its matching workflow instructions. Verify the live connection before editing.
@Higgsfield /use-photoshop
```
</details>

## Setup steps (page text)

Direct the cleanup of a generated location: specify objects to remove, surfaces to repair, and the lighting you want. Combine targeted edits with selective masks and retouching to preserve useful detail.
Open Codex
Use Codex on the same computer as Adobe Photoshop.
Connect Higgsfield
Enable Higgsfield in Codex and check that its tools are available.
Install Adobe Photoshop
Install Adobe Photoshop on the same computer.
Get Adobe Photoshop
Start your first workflow
Use the Open in Codex button to start this workflow, then provide your brief and source assets.
Open in Codex

## Media

- https://static.higgsfield.ai/skills/cinematic/20260923/image-fixer-example-poster.webp
- https://static.higgsfield.ai/skills/cinematic/20260923/image-fixer-example.mp4
- https://static.higgsfield.ai/skills/production/20260924/image-fixer-poster.webp
- https://static.higgsfield.ai/skills/production/20260924/image-fixer.mp4

## Recommended presets (as listed on the page)

Explore more cinematic workflows for your next project.
Create visual effects in TouchDesigner
Build visual effects for images and video in TouchDesigner, then preview, refine, and export the result.
/
use-touchdesigner
Production
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
