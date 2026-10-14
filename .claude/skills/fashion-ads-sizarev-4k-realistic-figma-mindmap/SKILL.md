---
name: fashion-ads-sizarev-4k-realistic-figma-mindmap
description: Build a Figma breakdown or mind map of an AI fashion-ad workflow in the Arcads node-graph style. Dark node cards for every input, LLM, Nano Banana, prompt, Seedance and upscale step, the full-resolution assets and full prompts inside each card, coloured bezier wires (image/prompt/video), and everything converging on the final video, plus a Higgsfield-equivalent line per node. Use when the user asks to map, document, visualise or replicate an Arcads, Higgsfield or Weavy workflow in Figma, or to add a new SIZAREV-style ad to the breakdown file.
---

# Figma mind map of a fashion-ad workflow

Reference build: <https://www.figma.com/design/afVIa2ZnzWrGSs5LVRhUrR> (page “01 · Arcads Flow — Mind Map”, SIZAREV AD 01 and AD 02).

## Procedure

1. **Extract the workflow.** For an Arcads public flow (`app.arcads.ai/flow/public/<id>`), `curl` the page, join the `self.__next_f.push([1,"…"])` chunks, and JSON-decode the object containing `"nodes"`. Long prompts are `"$2d"`-style references to `2d:T<hexlen>,<text>` chunks (the length is in **bytes**, so slice the UTF-8 bytes). The `"assets"` array has signed S3 URLs (`url` is full resolution, valid about 12 h), so download immediately. Node types: `inputImage`, `inputVideo`, `prompt`, `workflowLlm`, `generateImage` (nano-banana-2-1), `generateVideo` (seedance_25), `upscale`. Edges are implicit in each node's `inputs` (`prompt`, `referenceImages[]`, `referenceVideos[]`).
2. **Prepare media.** Figma `upload_assets` takes PNG/JPG/GIF/WebP up to 10 MB (no MP4). **GIF fills render blank in Figma's renderer and screenshots**, so for every video use a 16:9 **2×2 key-frame grid JPG** (4 frames at 8/36/62/90 % of the clip):
   ```bash
   d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 v.mp4); i=0
   for p in 0.08 0.36 0.62 0.9; do ffmpeg -v error -y -ss $(python3 -c "print($d*$p)") -i v.mp4 -frames:v 1 -vf "scale=960:540:force_original_aspect_ratio=decrease,pad=960:540:(ow-iw)/2:(oh-ih)/2" f$i.png; i=$((i+1)); done
   ffmpeg -y -i f0.png -i f1.png -i f2.png -i f3.png -filter_complex "[0][1][2][3]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0" -q:v 2 v_keyframes.jpg
   ```
   Add a full-res poster JPG on the final card. Keep the full MP4s in the repo and link them from the cards.
3. **Load the `figma-use` skill**, then create the file (`figma-create-new-file`) in a plan where the user has an editable seat.
4. **Build one lane per `use_figma` call.** Paste `scripts/mindmap_builder.js` and define `GRAPH` (columns, left to right: inputs → LLM → Nano Banana → prompt → Seedance (takes) → upscale → final). The script returns the `MEDIA:` slot ids.
5. **Fill the media.** `upload_assets(count=N, nodeIds=[…slot ids in order…])`, then POST each file as multipart (`curl -F file=@path <submitUrl>`), in parallel.
6. **Check**: screenshot the page (a temporary section around all nodes, `screenshot({scale: 0.2})`) and look for overlaps, clipped text and wires pointing at the wrong card.

## Conventions

- Colours: image `#34D399` · 3D animatic and video `#A78BFA` · LLM and upscale `#60A5FA` · Nano Banana `#FB923C` · prompt `#FACC15` · final `#F472B6` · background `#0B0B0D` · cards `#161619`.
- Every card shows: kind label, title, media, model settings (mono key/value), the full prompt (never truncated), a one-line “why”, and `HIGGSFIELD ↦` the equivalent model and settings.
- Rejected takes stay on the board with a grey or red badge and the reason. Selected ones get a green `✓ SELECTED` badge. The final card has a pink 2 px stroke.
- Fonts: Instrument Serif for titles, Inter for body, JetBrains Mono for labels and settings.
