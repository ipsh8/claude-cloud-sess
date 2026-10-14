---
name: fashion-ads-sizarev-4k-realistic-higgsfield-pipeline
description: Replicate and run SIZAREV-style fashion-ad pipelines (built in Arcads) on Higgsfield, in the web app or through the Higgsfield API with hf_pipeline.py. Maps Arcads nodes to Higgsfield models (Nano Banana → Higgsfield Image or Qwen Image 3 Edit, Seedance 2.5 → bytedance/seedance-2.5/reference-to-video at native 1080p, Upscale → optional), with ready configs for the Diesel solo walk and the duo sunglasses toss. Use when the user says "do this on Higgsfield", "run the Arcads flow on Higgsfield", or wants to automate generations with HF_API_KEY_ID / HF_API_KEY_SECRET.
---

# Higgsfield replication and runner

## Node mapping: Arcads → Higgsfield

| Arcads node (SIZAREV flow) | Higgsfield web app | Higgsfield API (`https://api.higgsfield.ai`) |
|---|---|---|
| Input image / video | Upload to the generation's reference slots | `POST /files/generate-upload-url` → `PUT` the bytes → use `public_url` (jpeg/png/webp/gif, wav, mp4) |
| LLM (gpt-6-sol) writes the Nano Banana prompt | Claude writes it (white-studio skill) | n/a, the prompt is plain text |
| Nano Banana 2.1 · 2K · 16:9 · thinking HIGH | **Image → Nano Banana (Pro/2)**, 16:9, 2K, attach the photo | Nano Banana isn't in the API catalog; use `alibaba/qwen-image-3/edit` (`image_urls` ≤ 3, `resolution 2k`, `aspect_ratio 16:9`) or `xai/grok-imagine-image-2.0`. Or reuse SIZAREV's own Nano Banana outputs (the default) |
| Seedance 2.5 · 720p · 16:9 · 10/12 s · bitrate high · audio | **Video → Seedance 2.5 → Reference to video**: add images in @Image order and the animatic as the video/motion reference, paste the prompt, 16:9, 1080p, 10 s / 12 s | `POST /bytedance/seedance-2.5/reference-to-video` with `prompt, image_urls[≤30], video_urls[≤10], duration 4–30, resolution 480p/720p/1080p, aspect_ratio, bitrate_mode, generate_audio` |
| Upscale 2× fast → 2560×1440 | Optional: Seedance 2.5 renders 1080p natively; use Higgsfield's upscaler for 1440p/4K | n/a in the documented catalog; upscale the downloaded MP4 with your upscaler of choice |

Docs used: <https://docs.higgsfield.ai/docs/llms.txt>, <https://docs.higgsfield.ai/docs/models/seedance-2-5/reference-to-video.md>, <https://docs.higgsfield.ai/docs/concepts/file-uploads.md>. Re-check them before relying on a model, because the catalog changes and an account's access may differ from what's documented.

## Web app runbook (no code)

1. **AD 01**. Images: `A3_nanobanana_woman_white_studio.png` (@Image1), `A2_input_diesel_bag.png` (@Image2). Video ref: `A4_3d_animatic_bolt_cam_walk.mp4` (@Video1). Prompt: `references/sizarev-3d-workflow/prompts/plain/ad01_seedance_v2.txt`. Settings: 10 s · 16:9 · 1080p · audio on. Generate 2.
2. **AD 02**. Images in this order: woman white, Diesel bag, man white (`B2_…`), sunglasses (`B3_…`). Video ref: `B4_3d_animatic_bolt_duo.mp4`. Prompt: `ad02_seedance_v2.txt`. Settings: 12 s · 16:9 · 1080p. Generate 2.
3. To start from the raw photos, run Nano Banana first with `prompts/plain/woman_white_studio.txt` / `man_white_studio.txt`.
4. Pick the best take and upscale if you need more than 1080p.

## API runner

```bash
export HF_API_KEY_ID=…  HF_API_KEY_SECRET=…        # console.higgsfield.ai → API keys (prepaid USD balance)
cd .claude/skills/fashion-ads-sizarev-4k-realistic-higgsfield-pipeline
python3 scripts/hf_pipeline.py configs/ad01-solo-diesel-walk.json --dry-run           # inspect payloads, no network
python3 scripts/hf_pipeline.py configs/ad01-solo-diesel-walk.json --takes 2 --out out/ad01
python3 scripts/hf_pipeline.py configs/ad02-duo-sunglasses-toss.json --regenerate --out out/ad02   # also redo the white-studio cleanup
```

The runner uploads `@file:` refs, inlines `@text:` prompts, chains `@step:` outputs, submits with an `Idempotency-Key`, polls `status_url` with backoff until `completed`, `failed`, `nsfw` or `canceled`, downloads the outputs and writes `run.json`. Stdlib only.

**New ad:** copy a config, point `base_dir` at the new asset folder, and edit the `image_urls` order so it matches the @tags in your prompt.

Never commit API keys. Pass them through the environment only.
