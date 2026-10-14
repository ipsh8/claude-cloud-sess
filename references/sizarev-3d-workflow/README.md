# SIZAREV — “3D Workflow” breakdown (Arcads flow)

Source: <https://app.arcads.ai/flow/public/6wsiDNWJAeHP0iafdSjT3T0p> (flow name `3D workflow`, revision 1, 22 nodes, 18 assets).
Figma mind map: <https://www.figma.com/design/afVIa2ZnzWrGSs5LVRhUrR>

Everything in `assets/` is the full-resolution original pulled from the public flow. `workflow.json` is the raw node graph with the prompts resolved and the signed S3 URLs removed. Every prompt is in `prompts/`, word for word.

## The idea in one line

> **Made in Claude, not Blender.** A blocky low-poly 3D animatic, built with Claude, locks the camera choreography and cut timing. Seedance 2.5 then re-renders it as a photoreal fashion film. Identity comes from real photos cleaned onto white, and the product comes from its own reference image.

## Pipeline (identical shape for both ads)

```
real photo ──► LLM (GPT) "make this person on white bg, write a Nano Banana 2.1 prompt"
     │                         │ prompt
     └──────── image ─────────►└► Nano Banana 2.1 (2K, 16:9, thinking HIGH) ──► person on #FFFFFF  ─┐
product photo (bag / sunglasses) ───────────────────────────────────────────────────────────────────┤ image refs
3D blockout animatic (Claude-made, blocky characters, grey cyc) ─────────────────────────────────────┤ video ref
Seedance prompt (@Image / @Video roles, beats, camera, negatives) ───────────────────────────────────┤ prompt
                                                                                                     ▼
                                            Seedance 2.5 (720p, 16:9, 10–12 s, bitrate high, audio on) ×2 takes
                                                                                                     ▼
                                                              Upscale 2× (fast) → 2560×1440 FINAL
```

## AD 01 — solo walk, Diesel bag (10 s)

| # | Node | Model / settings | Asset |
|---|------|------------------|-------|
| A1 | Input image: woman | 2048×1152 photo, warm-grey studio | `A1_input_woman_original.png` |
| — | LLM | `gpt-6-sol` · “make this wooman on white background. make prompt for nano banana 2.1” | `prompts/nanobanana_woman_white_studio.md` |
| A3 | Nano Banana 2.1 | 2K · 16:9 · thinking HIGH · grounding off | `A3_nanobanana_woman_white_studio.png` (2752×1536) |
| A2 | Input image: product | Diesel “1978 For Successful Living” bag, @sixninefits | `A2_input_diesel_bag.png` |
| A4 | Input video: 3D animatic | `bolt_cam_walk_preview.mp4` 1280×720 · 10 s | `A4_3d_animatic_bolt_cam_walk.mp4` |
| — | Prompt | v2, “camera only” | `prompts/ad01_seedance_prompt_v2_camera_only_SELECTED.md` |
| A5 | Seedance 2.5 take 1 | prompt v1 (copy walk cycle + camera) · **rejected** | `A5_seedance_take1_motion_transfer.mp4` |
| A6 | Seedance 2.5 take 2 | prompt v2 (camera only) · **selected** | `A6_seedance_take2_camera_only_SELECTED.mp4` |
| A7 | Upscale run 1 | 2× fast, from take 1 | `A7_upscale_take1_1440p.mp4` |
| A8 | **FINAL** | 2× fast, from take 2 · 2560×1440 · 24 fps · 10.13 s | `A8_FINAL_solo_diesel_walk_1440p.mp4` |

Seedance inputs: `referenceImages = [A3 woman-on-white, A2 bag]` (so @Image1 is the woman and @Image2 is the bag), `referenceVideos = [A4]` (@Video1).

## AD 02 — duo, pink star sunglasses toss (12 s)

| # | Node | Model / settings | Asset |
|---|------|------------------|-------|
| B1 | Input image: man | 1280×2207 gallery photo | `B1_input_man_original.png` |
| — | LLM ×2 runs | run 1 kept “wooman” in the instruction and gender-swapped him (**rejected**). Run 2: “make this man…” (**selected**) | `prompts/nanobanana_man_*.md` |
| B2 | Nano Banana 2.1 | 2K · 16:9 · thinking HIGH | `B2_nanobanana_man_white_studio.png` |
| A1→A3 | Woman (reused) | same LLM + Nano Banana output as AD 01 | `A3_…` |
| A2 | Diesel bag (reused) | | `A2_…` |
| B3 | Prop | pink star wraparound sunglasses | `B3_input_pink_star_sunglasses.png` |
| B4 | Input video: 3D animatic | `bolt_duo_small.mp4` 960×540 · 12 s | `B4_3d_animatic_bolt_duo.mp4` |
| B5 | Seedance 2.5 take 1 | prompt v1 (“transform everything”) · **rejected** | `B5_seedance_take1_full_transform.mp4` |
| B6 | Seedance 2.5 take 2 | prompt v2 (timecoded beats) · **selected** | `B6_seedance_take2_timecoded_SELECTED.mp4` |
| B7 | **FINAL** | 2× fast · 2560×1440 · 12.07 s | `B7_FINAL_duo_sunglasses_toss_1440p.mp4` |

Seedance inputs: `referenceImages = [woman-on-white, Diesel bag, man-on-white, sunglasses]`, `referenceVideos = [B4]`.

## Why the second take won, both times (the lessons to reuse)

1. **Restrict what the video reference controls.** v1 prompts told Seedance to copy the walk cycle and motion frame for frame, and the stiff blocky animation leaked into the people. Both winning prompts limit the 3D clip to *camera path, framing, cut timing* and ask for “completely new, natural, fluid human motion”.
2. **Give every reference a role, with @tags.** “@Image1 — the person: keep… @Image2 — the bag: use this exact… @Video1 — camera only…”
3. **Describe the subject again in words**, even though she's in the reference: hair, glasses, knitwear texture, collar and cuffs, trousers, shoe print. Text plus image beats image alone.
4. **Timecoded beats that match the animatic's cuts** (0–2 s wide push-in · 2–3 s glance + whip-pan · 3–4 s man tosses · 4–7 s slow-motion flight · 7–9 s land and adjust · 9–12 s locked extreme close-up).
5. **A camera language block**: bolt-cam robotic arm, motion-control smoothness, eased acceleration, “zero shake”. Then **lens and film language**: ARRI Alexa, 35/50/85 mm primes, shallow depth of field, creamy bokeh, subtle grain.
6. **Negatives that name the failure modes**: wrong bag, changed logo, extra hands, the hand leaving the pocket, sliding feet, face morphing, the 3D blocky style.
7. **A white-studio cleanup before video** so identity references carry no background noise. Re-check the LLM instruction for each character (the “wooman” copy-paste bug).
8. **Render at 720p and pick the best take, then upscale only the winner** (2× → 1440p).
