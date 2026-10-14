---
name: fashion-ads-sizarev-4k-realistic-seedance-video-script
description: Write the video-generation script and prompt for SIZAREV-style 4K photoreal fashion ads in Seedance 2.5 (also Seedance 2.0 and Kling O3 video-reference). It covers @Image/@Video role tagging, the subject lock, action, bolt-cam camera language, timecoded beats matched to a 3D animatic, ARRI lens and film look, and failure-mode negatives. Use when the user asks for a Seedance prompt, ad script, shot list or beat sheet, or video-to-video prompt for a fashion, bag, eyewear or apparel ad, or when a take came out wrong (stiff motion, wrong bag, morphing).
---

# Seedance video script (prompt) writer

Both of SIZAREV's winning prompts are in the repo at `references/sizarev-3d-workflow/prompts/*_SELECTED.md`, and the rejected v1 prompts sit next to them. Build every new prompt from one of the two templates below.

## Template A: continuous bolt-cam (solo, one shot): AD 01 structure

```
@Image1 — the person: keep her face, skin tone, hairstyle and outfit exactly as in the photo.
@Image2 — the {product}: use this exact {product} (shape, size, material, color, logo, hardware, straps). Do not redesign it or change the logo.
@Video1 — camera only: copy only the camera path, framing, timing and speed of the camera moves. Take nothing else from this video (no character, no body motion, no style, no lighting).

Scene: a seamless white photo studio with a soft white cyclorama, even diffused light and soft contact shadows under her feet. Clean high-end fashion editorial look.

Subject: {re-describe in words: hair + fringe, eyewear, jewellery, top + texture, under-layer collar/cuffs, trousers cut, shoes + print}.

Action: she walks toward the camera with a natural, calm, elegant runway gait. Her steps are even and her feet plant firmly on the floor. Her body moves smoothly and fluidly, with no twitching. Her {right} hand carries the {product} from @Image2 by its handles, and it swings gently with realistic weight. Her {left} hand stays in her trouser pocket the whole time{, with the white cuff visible}.

Camera: a bolt-cam robotic arm move that follows the camera path of @Video1. It tracks her walk, glides fast into an extreme close-up of {detail} with a shallow depth of field, pulls back out, then makes a sweeping orbit to her right while she keeps walking. Every move is perfectly smooth, like a motion-control rig: dynamic speed with eased acceleration and deceleration. There is zero camera shake, zero jitter, no handheld feel and no wobble.

Style: photorealistic, 1080p, 60fps, silky smooth motion, natural skin texture, true fabric detail, accurate {pattern}, accurate {brand} branding exactly as in @Image2.

Negative: camera shake, jitter, stutter, frame skipping, flicker, the body motion or character from @Video1, {wrong product}, any other bag, changed logo, extra hands, the hand coming out of the pocket, face morphing, warped legs, sliding feet, text
```

## Template B: timecoded multi-shot (duo or story): AD 02 structure

```
Photorealistic high-end fashion commercial, {12} seconds. Use the input video ONLY as a reference for shot composition, framing, cut timing and camera movement. Do NOT copy the character animation from the input: generate completely new, natural, fluid human motion, realistic body weight, natural gestures and facial expressions.

Characters: {person 1 in words}. {person 2 in words}.
Setting: seamless light-grey studio cyclorama, soft diffused studio lighting, same background in every shot.

0–2s: {shot size}, {camera move}. {action}.
2–3s: …, then a fast whip-pan with motion blur.
3–4s: …
4–7s: Camera tracks the {prop} flying through the empty grey space in slow motion, spinning and catching the light.
7–9s: Extreme close-up …
9–12s: Locked extreme close-up, {final expression}, slight blink, gentle breathing.

Shot on ARRI Alexa, 35mm, 50mm and 85mm prime lenses, shallow depth of field, creamy bokeh, natural motion blur, realistic skin texture, subtle film grain, natural colors, ultra-detailed, 4K.
```
The timecodes **must equal the animatic's cut times** (take them from the spec JSON's `cut` keyframes).

## Assembly rules

1. **Reference order = tag order.** `image_urls[0]` is @Image1, and so on. AD 02 used `[woman, bag, man, sunglasses]`.
2. **The video controls only the camera.** The v1 prompts said “copy the walk cycle … frame-for-frame” or “keep exactly the same motion”, and both were rejected because the stiff box-person motion leaked through.
3. **Describe the subject again in words** even though the image is attached. Name textures (fuzzy mohair, washed canvas), cuffs and collars, shoe prints.
4. **Spell product text exactly** (`"1978 DIESEL FOR SUCCESSFUL LIVING"`, `"ONLY THE BRAVE"`). Say “do not redesign or change the logo”.
5. **Lock the hands.** Which hand holds what, and which stays in the pocket “the whole time”. Repeat it in the negatives.
6. **One camera paragraph.** Use rig language (bolt-cam, motion control, eased acceleration) and say explicitly what it isn't (no handheld, no wobble).
7. **Negatives name real failure modes**, not generic “bad quality”.
8. Duration 10–12 s. Explore at 720p, pick the best of 2 takes, and only then go 1080p or upscale.

## Fixing a bad take

| Symptom | Fix |
|---|---|
| Stiff or robotic body, copies the blocky walk | Restrict the video role to camera only, add “generate completely new natural fluid human motion”, list “the body motion or character from @Video1” as a negative |
| Wrong or altered product | Move the product to its own @Image with “use this exact …”, spell out the printed text, add “any other bag, changed logo” |
| Outfit drift (suit instead of knit) | Describe the wardrobe again in words, and check the white-studio ref is faithful |
| Face morphing on push-ins | Add an extreme close-up beat description, “natural skin texture”, “face morphing” to the negatives, and use a 50/85 mm lens line |
| Jitter or shake | Camera paragraph: “perfectly smooth, motion-control rig, zero shake, zero jitter, no handheld feel” |
| Prop lands wrong | Describe the landing in its own timecoded beat and the hand that adjusts it |
