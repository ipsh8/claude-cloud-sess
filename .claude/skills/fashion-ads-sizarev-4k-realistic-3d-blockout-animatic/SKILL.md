---
name: fashion-ads-sizarev-4k-realistic-3d-blockout-animatic
description: Build the "made in Claude, not Blender" 3D blockout animatic for SIZAREV-style fashion ads. It renders blocky low-poly characters on a seamless studio cyc, with a motion-control (bolt-cam) camera, cuts and flying props, from a JSON shot spec to an MP4 via three.js and headless Chromium. Use when the user needs a camera, motion or timing reference video for Seedance or Kling video-to-video, wants to previz a fashion ad without Blender, or asks for a bolt-cam walk, orbit, whip-pan, snap push-in or prop-toss animatic.
---

# 3D blockout animatic: “Made in Claude, not Blender”

SIZAREV's signature move: the camera choreography is blocked out as a cheap blocky 3D animatic (box people on a grey cyc), then Seedance 2.5 uses it as `@Video1 — camera only`. This skill is that animatic generator.

- `engine/animatic.html`: three.js engine (blocky characters with procedural walk, gestures, bag-in-hand, props with arcs and spin, seamless cyc, soft shadows, a spherical motion-control camera with easing and hard cuts).
- `scripts/render.mjs`: deterministic frame capture with Playwright, piped to ffmpeg H.264.
- `specs/solo-bolt-cam-walk.json`: recreates SIZAREV's `bolt_cam_walk_preview.mp4` (AD 01).
- `specs/duo-sunglasses-toss.json`: recreates `bolt_duo_small.mp4` (AD 02).
- `examples/*.mp4` and `*_frames.jpg`: rendered outputs of both specs.

## Render

```bash
node scripts/render.mjs specs/solo-bolt-cam-walk.json out/solo.mp4
node scripts/render.mjs specs/duo-sunglasses-toss.json out/duo.mp4 --preview-png out/f.jpg --at 5.0   # single frame
ffmpeg -i out/solo.mp4 -vf "fps=1/1.5,scale=320:-1,tile=4x2" -frames:v 1 out/solo_frames.jpg       # contact sheet to review
```

Needs Node 18+, `playwright` (global or local) with Chromium, and `ffmpeg`. Set `CHROMIUM_PATH` to use a specific browser. The engine loads three.js from jsDelivr (`three@0.170.0`). Opening `engine/animatic.html?spec=specs/x.json` over a local web server plays a live preview loop.

Always render a contact sheet and **look at it** before handing the MP4 to the video model. Check the framing at every cut, that nothing clips through the camera, and that the props land where the script says.

## Spec schema

```jsonc
{
  "duration": 10, "fps": 24, "width": 1280, "height": 720,         // 720×1280 for 9:16
  "studio": { "floor": "#d3d0ca", "wall": "#8f8b85", "key": "left" },
  "characters": [{
    "id": "woman",
    "look": { "hair": "#262628", "top": "#1b1b1d", "bottom": "#151517", "shoes": "#a99c88",
              "glasses": "#c98a3a", "shirt": "#f5f5f3", "skin": "#f0d6c4", "hat": null,
              "hairStyle": "bob|none", "fringe": true, "collar": true, "cuffs": true, "height": 1.0 },
    "bag": { "hand": "right", "color": "#d9cdb6", "w": 0.34, "h": 0.36, "d": 0.1 },
    "pose": { "leftHandInPocket": true },
    "path": [ { "t": 0, "pos": [x, z], "face": 0, "headYaw": 0, "headPitch": 0 },     // face 0 = toward +z (camera az 0)
              { "t": 10, "pos": [0, 2.2], "ease": "linear" } ],                         // walk cycle comes from distance travelled
    "gestures": [ { "type": "throw|adjustGlasses|wave", "hand": "right", "t0": 3.1, "t1": 3.7 } ]
  }],
  "props": [{ "id": "glasses", "kind": "sunglasses", "color": "#ff86b0",
              "path": [ { "t": 0, "at": "man.handR", "offset": [0, -0.42, 0] },
                        { "t": 7.6, "at": "woman.head", "offset": [0, 0, 0.17], "spin": 1440, "arc": 0.5, "attach": true } ] }],
  "camera": [   // spherical rig around a (moving) target = motion control
    { "t": 0,   "target": "woman.hips", "dist": 5.2, "az": 0, "el": 6, "fov": 34 },
    { "t": 3.1, "target": "woman.head", "dist": 1.05, "fov": 30, "ease": "inOutQuint" },      // bolt-cam snap push-in
    { "t": 3.0, "target": "man.head", "dist": 2.6, "az": -70, "cut": true }                   // hard cut
  ]
}
```

Anchors are `<characterId>.head|hips|handL|handR`, `prop.<id>` or a literal `[x, y, z]`. Easing options: `linear`, `inOutCubic`, `outCubic`, `inCubic`, `inOutQuint` (snappy bolt-cam), `outExpo`. A keyframe with `"cut": true` jumps instead of interpolating. Use two keyframes at the same `t` to end one shot and start the next.

## Camera archetypes (copy-paste blocks)

- **Track the walk**: target `hips`, dist 4.5–5.5, az 0, el 5–8, linear, while the character walks toward +z.
- **Bolt-cam snap push-in**: target `head`, dist about 1.0, fov 30, `inOutQuint` over 0.6–0.8 s, then hold 1 s with a slight az drift.
- **Fast pull-out**: back to `hips` at dist 4.4, `inOutQuint` over about 0.9 s.
- **Sweeping orbit**: keep the dist and animate az 10 → 80 → 96 over about 4.8 s (`inOutCubic` then `outCubic`).
- **Whip-pan**: az changes 50–60° in 0.3 s with `inCubic`, then cut to the next subject.
- **Prop flight**: target `prop.<id>`, dist 1.3–1.5, az 50 → 75, linear, while the prop path arcs and spins.
- **Locked extreme close-up**: target `head`, dist 1.25 → 0.95 over 5 s, linear (a barely-perceptible creep).

## Hand-off to the video model

Pass the MP4 as `@Video1` and say exactly what it controls: “camera only: copy only the camera path, framing, timing and speed of the camera moves. Take nothing else from this video (no character, no body motion, no style, no lighting).” For cut-driven pieces, write timecoded beats that match the spec's cut times one to one. See `fashion-ads-sizarev-4k-realistic-seedance-video-script`.
