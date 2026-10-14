---
name: shot-composer
title: "Create VFX composites in After Effects"
description: "Combine footage and visual layers into editable VFX shots in After Effects, with matched lighting, depth, and grain."
command: "/Shot-Composer"
category: "Production"
bundle: "production-skills"
host_app: "After Effects"
relevance_to_3d_jutsu: secondary
source: https://higgsfield.ai/mcp/shot-composer
provider: Higgsfield (MCP skill; server-side workflow instructions not public)
retrieved: 2026-10-14
---

# Create VFX composites in After Effects

Combine footage and visual layers into editable VFX shots in After Effects, with matched lighting, depth, and grain.

## Invocation

Slash command `/Shot-Composer` on the Higgsfield MCP (`https://mcp.higgsfield.ai/mcp`, OAuth via Clerk), used from Claude, Codex or the ChatGPT plugin. The command's full workflow instructions are served by the MCP server after sign-in and are **not** included here; what follows is the public launch prompt verbatim.

## Launch prompt (verbatim from the page's deep link)

```text
/Shot-Composer
Composite my footage and supplied layers into a cohesive VFX shot in After Effects. Ask for the target look and identify the keying, tracking, and cleanup needed. Match lighting, atmosphere, depth of field, motion blur, and grain. Generate missing visual layers only when needed, then deliver a preview and an editable AE project.

Ask me for the source assets and project files before editing. Preserve existing work.

Workflow preview (for context, not source artwork): https://static.higgsfield.ai/skills/production/20260924/composer-sorter-v2/shot-composer-poster.webp

Use the installed integration and its matching workflow instructions. Verify the live connection before editing.
@Higgsfield /use-after-effects

If the Higgsfield plugin is not installed, ask me to [install the Higgsfield plugin](https://chatgpt.com/plugins/higgsfield?open_in_app) before continuing.
```

<details><summary>Variant: chatgpt</summary>

```text
/Shot-Composer
Composite my footage and supplied layers into a cohesive VFX shot in After Effects. Ask for the target look and identify the keying, tracking, and cleanup needed. Match lighting, atmosphere, depth of field, motion blur, and grain. Generate missing visual layers only when needed, then deliver a preview and an editable AE project.

Ask me for the source assets and project files before editing. Preserve existing work.

Workflow preview (for context, not source artwork): https://static.higgsfield.ai/skills/production/20260924/composer-sorter-v2/shot-composer-poster.webp

Use the installed integration and its matching workflow instructions. Verify the live connection before editing.
@Higgsfield /use-after-effects
```
</details>

## Setup steps (page text)

Build a cohesive shot from your footage, green screen, and reference layers. Refine keying, tracking, light, atmosphere, depth of field, motion blur, and grain, generating missing layers only when needed.
Open Codex
Use Codex on the same computer as Adobe After Effects.
Connect Higgsfield
Enable Higgsfield in Codex and check that its tools are available.
Install Adobe After Effects
Install Adobe After Effects on the same computer.
Get Adobe After Effects
Start your first workflow
Use the Open in Codex button to start this workflow, then provide your brief and source assets.
Open in Codex

## Media

- https://static.higgsfield.ai/skills/production/20260924/composer-sorter-v2/shot-composer-poster.webp
- https://static.higgsfield.ai/skills/production/20260924/composer-sorter-v2/shot-composer.mp4
- https://static.higgsfield.ai/skills/production/20260924/shot-cleanup-poster.webp
- https://static.higgsfield.ai/skills/production/20260924/shot-cleanup.mp4

## Recommended presets (as listed on the page)

Explore more cinematic workflows for your next project.
Remove unwanted objects in After Effects
Clean up unwanted elements in After Effects while preserving the shot’s movement, texture, and editable layers.
/
Shot-Cleanup
Production
Convert images to vectors in Illustrator
Turn raster illustrations into editable Illustrator artwork with organized paths, groups, and layers.
/
Vectorize
Production
Clean up images in Photoshop
Refine generated locations in Photoshop by fixing textures, removing unwanted objects, and preserving editable masks.
/
Image-fixer
Production
Create visual effects in TouchDesigner
Build visual effects for images and video in TouchDesigner, then preview, refine, and export the result.
/
use-touchdesigner
Production
