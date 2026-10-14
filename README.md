# fashion-ads · SIZAREV · 4k-realistic

A breakdown of SIZAREV's Arcads **“3D workflow”** (made in Claude, not Blender), rebuilt for Higgsfield, with Claude skills for making new ads in the same style.

| What | Where |
|---|---|
| Figma mind map (page 1: Arcads flow · page 2: Higgsfield version + skills) | <https://www.figma.com/design/afVIa2ZnzWrGSs5LVRhUrR> |
| Original flow | <https://app.arcads.ai/flow/public/6wsiDNWJAeHP0iafdSjT3T0p> |
| Written breakdown, every prompt word for word, all full-res assets | [`references/sizarev-3d-workflow/`](references/sizarev-3d-workflow/README.md) |
| Skills (Claude Code, auto-loaded in this repo) | [`.claude/skills/`](.claude/skills) |
| Skills as zips for claude.ai → Settings → Capabilities → Skills | [`dist/skills/`](dist/skills) |

## Skills

| Skill | Role |
|---|---|
| `fashion-ads-sizarev-4k-realistic-workflow` | Master playbook: formula, rules, look bible, remix axes, concept template, 12 new ad ideas |
| `fashion-ads-sizarev-4k-realistic-3d-blockout-animatic` | Claude-made three.js blocky animatic → MP4 (bolt-cam, orbits, cuts, flying props). Both SIZAREV animatics are recreated in `specs/` |
| `fashion-ads-sizarev-4k-realistic-white-studio-character-sheet` | LLM → Nano Banana white-studio identity refs, plus a multi-view character sheet |
| `fashion-ads-sizarev-4k-realistic-seedance-video-script` | Seedance 2.5 script and prompt templates (continuous bolt-cam / timecoded), negatives, bad-take fixes |
| `fashion-ads-sizarev-4k-realistic-higgsfield-pipeline` | Arcads → Higgsfield mapping, web-app runbook, `hf_pipeline.py` API runner with configs for both ads |
| `fashion-ads-sizarev-4k-realistic-figma-mindmap` | Extract any Arcads flow and rebuild it as the Figma node-graph mind map |

## Quick start

```bash
# 1. previz a new camera move (the "made in Claude, not Blender" step)
node .claude/skills/fashion-ads-sizarev-4k-realistic-3d-blockout-animatic/scripts/render.mjs \
     .claude/skills/fashion-ads-sizarev-4k-realistic-3d-blockout-animatic/specs/solo-bolt-cam-walk.json out/solo.mp4
# 2. replicate an ad on Higgsfield (needs HF_API_KEY_ID / HF_API_KEY_SECRET)
python3 .claude/skills/fashion-ads-sizarev-4k-realistic-higgsfield-pipeline/scripts/hf_pipeline.py \
     .claude/skills/fashion-ads-sizarev-4k-realistic-higgsfield-pipeline/configs/ad01-solo-diesel-walk.json --dry-run
```
