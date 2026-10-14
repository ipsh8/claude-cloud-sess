# Scene schema (from the 3D Jutsu client validators)

Entity: `{ id ≤128 chars, kind: object|camera|light|world|timeline, deleted, version, lastSequence, state }`. Reserved ids `__world__`, `__timeline__`.

```
Transform  = { position:[x,y,z], rotation:[x,y,z,w] (quaternion), scale:[x,y,z] }
Material   = { baseColor:[r,g,b,a], metallic:0..1, roughness:0..1 }
Projection = { type:'perspective', near>0, far>near, verticalFov:(0,π) rad }
           | { type:'orthographic', near>=0, far>near, verticalSize>0 }
Light      = { type:'directional'|'point'|'spot', color:[r,g,b], intensity>=0, castShadow,
               range?:null|>0 (point/spot), innerConeAngle<=outerConeAngle<=π/2 (spot) }
           | { type:'unsupported' }
World      = { type:'solid', color:[r,g,b], strength>=0 }
CameraRig  = { aspect:null|>0, dofFocusName:null|string, path:null|Path, animation:null|Anim }
Path       = { id, name, transform, waypoints:[{id,name,transform}] (<=256), aim, focus,
               focusParent:'aim'|'path', anchor:null|{origin:[3], focus:[3], radius>=0},
               settings:{ enabled, closed, bounce, curve:'centripetal'|'chordal'|'catmullrom',
                          aim:'tangent'|'target'|'fixed', easing:'linear'|'in'|'out'|'inout',
                          framing:'close'|'medium'|'wide', tension:0..1, duration:(0,600],
                          roll, intensity (0.25..2), speed, targetName, presetId } }
Anim       = { name, duration:(0,600], times:[2..20000 ascending], positions:[3n], quaternions:[4n] }
Timeline   = { shots:[{ cameraId, start, end, … }] }
```

Scene-operation kinds (`kind` + `payload`), each with `baseSequence`, optional `expectedEntityVersion` and `lease`:

| kind | payload |
|---|---|
| `object.create.primitive` | `{primitive:'box'|'plane'|'uvSphere'|'cylinder'|'cone', name?, transform}` |
| `object.create.from_glb` | `{assetId, name?, transform}` |
| `entity.transform.set` / `object.transform.set` / `camera.transform.set` | `{transform}` |
| `object.material.set` | `{material}` |
| `entity.rename` / `object.rename` | `{name}` |
| `entity.delete` / `object.delete` | `{}` |
| `camera.create` | `{name?, transform, projection}` |
| `camera.projection.set` | `{projection}` |
| `camera.rig.set` | `{rig}` |
| `camera.active.set` | `{}` |
| `light.create` | `{name?, transform, properties}` |
| `light.properties.set` | `{properties}` |
| `world.settings.set` | `{settings}` |
| `timeline.shots.set` | `{timeline}` |

GLB extras written by the runner (Three.js `userData`): `blockingStudioEntityName`, `blockingStudioCharacter`, `blockingStudioTimeline`, `blockingStudioDofFocus`, `blockingStudioAspect`, `blockingStudioPathFor`, `blockingStudioWaypoint`, `blockingStudioWaypointIndex`, `blockingStudioSharedResources`, `blockingStudioEnabled` (legacy prefix `blenderGlbLab*`).

Default proxy material in the viewer: `MeshStandardMaterial({color: 0xB7B7C9, roughness: 0.5})`. Characters: three.js r178 example GLBs `Xbot.glb` (Y Bot), `Michelle.glb`, `Soldier.glb` (Vanguard).
