---
name: fashion-ads-sizarev-4k-realistic-white-studio-character-sheet
description: Turn real cast or product photos into clean identity references for SIZAREV-style fashion ads, with the person or product on a seamless pure-white (#FFFFFF) studio, using Nano Banana (2.1 / Pro / 2) or Qwen Image Edit. Optionally builds a multi-view character sheet (front, 3/4, side, back, face close-up). Use before any Seedance or Kling reference-to-video run, or when the user asks to "put this model on white", "make a character sheet", "clean the background for the video", or "write the Nano Banana prompt".
---

# White-studio identity refs and character sheet

In SIZAREV's flow every person goes through **LLM → Nano Banana 2.1** before the video model. The LLM (GPT in Arcads, Claude here) writes the edit prompt. Nano Banana runs it at **2K, 16:9, thinking HIGH, search grounding off**. A white seamless background removes noise, so Seedance reads face, hair, wardrobe and product cleanly.

## 1. Write the cleanup prompt (you are the LLM node)

Look at the photo, then fill the matching template. List every identity and wardrobe item you can see. Those words are the lock.

**Person, keep exactly** (SIZAREV's woman, word for word):
```
Use the attached image as the reference. Keep the same woman, face, hairstyle, sunglasses, outfit, pose, beige tote bag, and shoes. Replace only the existing background and floor with a seamless pure white studio background (#FFFFFF). Preserve her full body and the entire bag in frame, with clean edges, natural studio lighting, and a subtle shadow beneath her feet. Do not change her appearance or add any objects.
```
**Person, man** (SIZAREV's selected run):
```
Use the attached photo as the reference. Keep the man exactly as he appears—same face, expression, pose, proportions, cream beret, dark jacket, striped tie, wide-leg trousers, black shoes, and brown shoulder bag. Replace the entire existing background and floor with a seamless pure white studio background. Preserve his full body in frame, with clean, natural edges and a subtle realistic shadow beneath his shoes. Do not change his clothing, accessories, or facial features.
```
**Generic template**:
```
Use the attached photo as the reference. Keep the {person} exactly as they appear — same face, expression, pose, proportions, {hair}, {eyewear}, {top}, {layer/collar/cuffs}, {bottoms}, {shoes}, {bag/accessory}. Replace the entire existing background and floor with a seamless pure white studio background (#FFFFFF). Preserve the full body {and the entire <product>} in frame, with clean natural edges, soft even studio lighting and a subtle realistic contact shadow beneath the shoes. Do not change clothing, accessories or facial features, and do not add any objects.
```
**Product** (only if the product shot isn't already clean):
```
Use the attached product photo. Keep the {product} exactly — shape, proportions, material and texture, colour, hardware, stitching, and all printed text "{exact text}" letter for letter. Place it alone on a seamless pure white studio background (#FFFFFF), centred, fully in frame, soft even light, subtle contact shadow. No props, no hands, no added text.
```

Rules:
- Re-read the instruction for **each** character. SIZAREV's man was gender-swapped once because a copy-pasted instruction still said “make this wooman…”. The model obeys the words over the picture.
- Keep the pose from the photo (it reads better as a reference). Don't ask for a T-pose.
- Output 16:9 2K for people (matches the video), and square or 4:5 for products.

## 2. Run it

| Where | How |
|---|---|
| Higgsfield web app | Image → Nano Banana (Pro/2) → attach the photo → paste the prompt → 16:9 · 2K → generate 2–4 and pick the most faithful |
| Higgsfield API | `alibaba/qwen-image-3/edit` (`image_urls` ≤ 3, `resolution: "2k"`, `aspect_ratio: "16:9"`, `negative_prompt`) or `xai/grok-imagine-image-2.0` with `image_urls`. Wire it through `hf_pipeline.py` (see the higgsfield-pipeline skill) |
| Arcads | LLM node (instruction + image) → Nano Banana 2.1 node (2K, 16:9, thinking HIGH) |

QA: compare side by side with the original. Face, hairline, eyewear shape, every garment, shoe colour and print, bag hardware and text. If anything drifted, regenerate. Don't fix it in the video prompt.

## 3. Optional: multi-view character sheet

For longer or more complex ads (orbits, back views), give Seedance more angles of the same person. Generate with the cleaned image attached:
```
Character turnaround sheet of the exact same person from the reference — identical face, hair, wardrobe and accessories. One row, five full-body views on a seamless pure white studio background (#FFFFFF): front, three-quarter left, side profile, back, three-quarter right, plus a head-and-shoulders face close-up on the far right. Even soft studio lighting, consistent scale and eye line, subtle contact shadows, no text, no labels, no extra props. Photorealistic, natural skin texture, true fabric detail.
```
Use 21:9 or 16:9 at 2K. Pass the sheet as an extra `@Image` and tag it: “@Image3 — character sheet of the same woman from other angles; use it only for her back and side views.”
