---
name: fashion-ads-sizarev-4k-realistic-workflow
description: Master playbook for SIZAREV-style 4K photoreal AI fashion ads (the "3D Workflow, made in Claude not Blender"). Use when the user wants a new fashion, apparel, bag, eyewear or sneaker ad in this style, wants to riff on or remix the SIZAREV Diesel walk or sunglasses-toss ads, or asks to plan, concept or run a full pipeline. It covers the 3D blockout animatic, white-studio identity cleanup, Seedance 2.5 video, upscale, the Higgsfield or Arcads run, and the Figma breakdown. It chains the other fashion-ads-sizarev-4k-realistic-* skills.
---

# fashion-ads · SIZAREV · 4k-realistic — master workflow

Reverse-engineered from SIZAREV's public Arcads flow “3D workflow” (two finished ads). The full breakdown, every prompt word for word and all original assets are in `references/sizarev-3d-workflow/` at the repo root. Read `README.md` there before inventing anything new.

## The formula

```
CAST (real photos) ──► white-studio cleanup ──┐
PRODUCT / PROP photos ────────────────────────┤──► Seedance 2.5 reference-to-video ──► pick best take ──► upscale 2× ──► FINAL
3D BLOCKOUT ANIMATIC (made in Claude) ────────┤        (720p while exploring,
VIDEO SCRIPT PROMPT (@roles + beats) ─────────┘         1080p on Higgsfield)
```

Why it works: the **animatic owns the camera and the edit**, the **photos own identity and product**, and the **prompt owns everything else** (motion quality, lighting, lens, film look, negatives). Each input controls one thing, so nothing fights.

## Run it — step by step

1. **Concept** (fill `templates/ad-concept.md`): product, cast (1–2 people), camera archetype, the “gag” or hero beat, duration (10–12 s), aspect (16:9 hero, 9:16 cut-down).
2. **Cast and product references.** For each person, use `fashion-ads-sizarev-4k-realistic-white-studio-character-sheet` (LLM writes the Nano Banana prompt, Nano Banana outputs a 2K 16:9 #FFFFFF studio full body). Products go in raw if they're on a clean background.
3. **3D blockout animatic.** Use `fashion-ads-sizarev-4k-realistic-3d-blockout-animatic`. Copy the closest spec (`solo-bolt-cam-walk.json` or `duo-sunglasses-toss.json`), edit the characters, path, props and camera keyframes, render the MP4, and check the frame sheet.
4. **Video script.** Use `fashion-ads-sizarev-4k-realistic-seedance-video-script`. Pick the template (continuous bolt-cam, or timecoded cuts), give each reference an @role, describe the subject again in words, add camera, lens and film language, and finish with negatives.
5. **Generate.** Use `fashion-ads-sizarev-4k-realistic-higgsfield-pipeline` (web app or `hf_pipeline.py`), or rebuild the same graph in Arcads. **Run 2 takes.** If a take copies the blocky motion, tighten the video role to “camera only”.
6. **Finish.** Upscale only the winning take (2× → 1440p, or 4K for delivery). Optionally cut a 9:16 version.
7. **Document.** Use `fashion-ads-sizarev-4k-realistic-figma-mindmap` to build the node-graph mind map with every asset and prompt, ending in the final video.

## Non-negotiable rules (learned from the rejected takes)

- The video reference controls **camera path, framing, cut timing**. Never let it control body motion (“generate completely new, natural, fluid human motion”).
- Tag references by role in the same order you pass them: `@Image1 — the person … @Image2 — the bag … @Video1 — camera only`.
- Lock the product: “use this exact bag (shape, size, material, color, logo, hardware, straps). Do not redesign it or change the logo.” Spell out any printed text exactly.
- Fix the hands: which hand carries the product, and which stays in the pocket “the whole time”. Name both in the negatives.
- Name the failure modes in the negatives: camera shake, jitter, face morphing, warped legs, sliding feet, extra hands, wrong or extra bag, changed logo, the 3D blocky style, text.
- When reusing an LLM instruction per character, re-read it. The “wooman” copy-paste once gender-swapped the male model.

## Look bible: “4k-realistic”

Seamless white or light-grey paper cyclorama, soft diffused key from the left, soft contact shadows. ARRI Alexa with 35/50/85 mm primes, shallow depth of field, creamy bokeh, natural motion blur, subtle film grain, natural or muted-warm grade, real skin texture with pores, true fabric detail. Camera language: bolt-cam robotic arm, motion-control smooth, eased acceleration and deceleration, snap push-ins with short holds, sweeping orbits, whip-pans with motion blur.

## Remix axes (for drawing inspiration)

| Axis | SIZAREV used | Swap ideas |
|------|--------------|------------|
| Hero product | Diesel canvas bag · pink star wraparound shades | sneakers (track at foot level), watch (ECU wrist turn), jacket (spin reveal), fragrance |
| Cast | solo · duo | trio passing a prop down a line, mirror twins, model + stylist |
| Camera archetype | bolt-cam track → eye ECU → orbit · cut-driven duo | overhead crane drop, 360° freeze orbit, macro-to-wide pull, dolly-zoom |
| Gag / beat | product swing · thrown sunglasses land on face | jacket tossed into frame and caught on, bag sliding across the floor into the hand, hat flip |
| Set | white cyc · light-grey cyc | coloured cyc matching the product, mirrored floor, single hard light |
| Length | 10 s · 12 s | 6 s bumper, 15 s with a logo-card beat |

`templates/ad-concept.md` turns any row into a brief. `references/inspiration-ideas.md` has 12 ready concepts.

## Files

- `templates/ad-concept.md`: the brief to fill before generating.
- `references/inspiration-ideas.md`: 12 new ad concepts built on the same formula.
- Repo `references/sizarev-3d-workflow/`: the original assets, prompts and `workflow.json`.
- Figma breakdown of the original: <https://www.figma.com/design/afVIa2ZnzWrGSs5LVRhUrR>
