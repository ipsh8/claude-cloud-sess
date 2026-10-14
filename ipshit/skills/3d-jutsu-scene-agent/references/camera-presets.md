# Camera-rig presets (client-side, built around an anchor frame)

Anchor frame `F = {origin, focus, radius, height, right, horizontal}` is derived from the camera and its focus target. `I(F, d, h, s)` places a point at distance factor `d` along the view axis, height offset `h`, side offset `s` (fractions of radius); `Ur(F, angle, d, h)` orbits around the focus.

| group | id | label | build |
|---|---|---|---|
| orbit | `orbit-half` | Orbit 180 | 10 points over a half turn around focus, aim target |
| orbit | `arc-left` / `arc-right` | Arc | 10 points, -angle·1.5 sweep, distance 1+0.35t, height 0.9→0; linear, 14 s |
| orbit | `figure-eight` | Figure eight | 8 points on a lemniscate (sin 2θ along horizontal, sin θ along right), closed, linear, 16 s |
| orbit | `spiral-up` / `spiral-down` | Spiral | orbit with rising / falling height |
| dolly | `dolly-in` | Dolly in | distances 1.6, 1.1, 0.6; aim target; 6 s |
| dolly | `dolly-out` | Dolly out | distances 0.6, 1.1, 1.6; 6 s |
| dolly | `push-in-low` | Low push in | (1.7,-0.35) (1.1,-0.1) (0.65,0.15); easing out; 7 s |
| dolly | `truck-left` / `truck-right` | Truck | side offsets 0.9, 0, -0.9 at distance 1; 7 s |
| dolly | `s-curve` | S curve | 5 points, distance 1.5-0.9t, side sin(πt)·0.35; aim tangent; 8 s |
| crane | `crane-up` | Crane up | (1.15,-0.4) (1,0.25) (0.95,0.95); 8 s |
| crane | `crane-down` | Crane down | reverse of crane-up; 8 s |
| aerial | `flyover` | Flyover | (1.8,-0.15) (0.8,0.7) (-0.2,1.1) (-1.2,0.6); linear; 10 s |
| aerial | `drone-pullback` | Drone pullback | 5 points, distance 0.5+1.8t, height -0.2+1.1t; easing in; 10 s |
| reveal | `reveal-behind` | Reveal | 5 points orbiting from behind (angle (1-t)·0.75π), distance 1.3-0.3t, height -0.3+0.3t; easing out; 9 s |

Defaults: intensity 1 (clamped 0.25–2), framing medium (close ≈ 0.72 scale), speed 1, aim target.
