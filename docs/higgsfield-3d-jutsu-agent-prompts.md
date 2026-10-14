# Higgsfield 3D Jutsu — the agent's authoring rules and prompts

Companion to `higgsfield-3d-jutsu-reverse-engineering.md`. Snapshot 2026-10-14.

## 0. Short answer

The **server-side system prompt** of the 3D Jutsu agent and the text returned
by its `blocking_studio_guide` tool are **not publicly retrievable**. They
live behind Clerk-authenticated endpoints:

| checked | result |
|---|---|
| runner `https://3d-scene-builder.higgsfield.ai` (`/`, `/guide`, `/docs`, `/openapi.json`, `/mcp`, …) | 404 `Route does not exist`; only `/health` → `{"ok":true,"service":"blender-runner"}`; `/projects` → 401 `AUTH_TOKEN_MISSING` |
| public MCP `https://mcp.higgsfield.ai/mcp` and bridge `https://bridge.higgsfield.ai/mcp` | 401 + OAuth metadata (Clerk, PKCE); no anonymous `tools/list` |
| skills marketplace API `fnf-api-gw.higgsfield.ai/fnf-skills-marketplace/*` | 401 `Invalid or expired token` |
| `llms.txt`, `llms-full.txt`, sitemaps, help-center markdown | no 3D Jutsu / Blocking Studio article |
| every public JS chunk of the `/3d-jutsu` routes | no copy of the guide; only tool names, UI labels, and the client-side message templates |

What **is** recoverable, and reproduced verbatim below:

1. The exact user-turn text the web client sends as the first message.
2. The chat-creation parameters that select the 3D Jutsu agent persona.
3. The hidden "host context" lines the **Blender add-on** appends to every
   Scene Builder request (the add-on drives the same Supercomputer agent).
4. The Blender authoring rulebook Higgsfield ships inside the add-on:
   `blmcp/data/prompts.yml` `initial_instructions`, vendored from Blender
   Lab's GPL `blender_mcp` project. This is the closest thing to the agent's
   Blender authoring rules that exists in public.
5. The Python "weak sandbox" restrictions applied to LLM-generated `bpy` code.
6. The agent's tool set with the UI labels for each tool phase.
7. The verbatim `/Scene-Builder` skill prompt from the Codex/ChatGPT deep link.
8. Behaviour rules Higgsfield states in its own copy.

Section 9 then gives a **reconstructed** guide/system prompt built from that
evidence, clearly marked as reconstruction, for anyone building a clone.

---

## 1. First message the web client sends (verbatim template)

From chunk `fe1792b7-xGs59QQHzHf11_87.js` plus the full i18n catalog
(`/_i18n/en.json`: `_WLWsT`, `90nJWr`, `3rNE6B`). When the studio page opens
with a pending brief it posts, as a normal user message with the brief's
files attached:

```
{prompt}

Scene settings:
- Duration: {duration}s
- Aspect ratio: {aspectRatio}
```

Notes:

- `duration` is 1–60 (default 15); `aspectRatio` ∈ 16:9, 9:16, 1:1, 4:3,
  3:4, 21:9. The `style` field (`blocking` | `detailed`, default `blocking`)
  is validated and stored in `sessionStorage["blocking-studio:pending-brief"]`
  but is **not** interpolated into this message; it is only sent as an
  analytics property. Either the backend reads it from elsewhere or it is
  currently unused by the prompt.
- Analytics event: `page_click {action:'apply_brief', place:'chat'}`.
- The textarea's accessible label is "Scene brief for the AI agent";
  placeholder "Describe the scene you want to block out...".

## 2. Chat creation parameters (how the persona is selected)

Chat creation goes through the Supercomputer "claudesfield" API
(`POST {gateway}/claudesfield/chats`). The studio passes:

```
agent:   "3d-scene-builder"          // persona key; legacy keys "blocking-studio", "blender" are mapped to the same surface
surface: "blocking_studio"
folderId: <projectId>                // the 3D Jutsu project doubles as the chat folder
mode:    "auto" | "manual"           // "generate without asking" vs "ask before generating" ("ask" UI mode → "manual")
model:   e.g. "openai/gpt-6-astra"   // default pre-selected on first visit, stored under "blocking-studio:model-initialized"
reasoning_effort: <effort>
medias:  [...]                        // brief attachments
prompt:  <text from §1>
```

Analytics for the created chat is tagged `agent:'3d-jutsu'`. Other persona
keys seen in the bundle: `chatgpt`, `instagram`, `bare`, `model`,
`tool-subagent`. So the system prompt is chosen server-side from the `agent`
key; the client never sees it.

Scene objects mentioned in chat are serialized as
`<hf-blender-entity>{"id":…,"kind":"object|camera|light|world","name":…}</hf-blender-entity>`.

## 3. Hidden host context from the Blender add-on (verbatim)

The desktop add-on (`higgsfield_blender-1.5.57.zip`, from
`https://hf-adobe-updates.higgsfield.ai/blender/manifest.json`) talks to the
same Supercomputer agent. `features/overlays/composer_surface.py`
`_submit_scene_builder()` builds a `request_text` that differs from what the
user sees:

Appended when objects are selected:

```
Blender object context: work on the existing selected objects: {type} object named '{name}', … . They were selected when this request was sent. For animation requests, animate these objects in place instead of creating replacements.
```

Appended on the first turn of a thread:

```
use higgsfield bridge connector. Use the blender connector among custom MCP. The Blender project name is '{file.blend}'.
```

The chat is created with `mode: "auto"` always (comment in
`features/supercomputer.py`: "Never `manual`. In manual mode the agent halts
before *every* tool, including the internal ones it uses to read its own
skill docs"). Chat name is `Blender | {first paragraph}`. @-mentions of
library elements are sent as `<<<uuid>>>` tokens. The add-on's model picker
allow-list is: `ox alpha`, `opus 5`, `fable 5`, `gpt 6 astra`,
`gpt 5.6 sol`, `luna`, `kimi k3`, `grok 4.6`, with "Free mode"
(`higgsfield/free-auto`) injected first and `opus 5` as the preferred default.

The connector it registers for the agent: `POST /connectors`
`{kind:"mcp_oauth", name:"blender_connector", display_name:"Higgsfield Blender", url:"https://bridge.higgsfield.ai/mcp", redirect_url:…}`.

## 4. Blender authoring rulebook shipped in the add-on (verbatim)

`wheels/blender_mcp-1.0.0-py3-none-any.whl` → `blmcp/data/prompts.yml`,
loaded as the MCP server `instructions`. Per `THIRD_PARTY_NOTICES.md` this is
adapted from Blender Lab's `blender_mcp` (https://projects.blender.org/lab/blender_mcp,
revision `98b0e49d…`, GPL-3.0-or-later, © 2026 Blender Authors). Higgsfield's
bridge reuses its doc-search tools (`search_api_docs`, `search_manual_docs`,
`get_python_api_docs`) and ships the full `bpy` API and user manual as RST
for the agent to grep.

```
You have access to Blender tools to interact with a Blender scene directly.
Blender must be running with the MCP add-on enabled and connected.

IMPORTANT: Respect existing structure and naming conventions.
NEVER assume missing values - inspect the scene first.
Do not destructively modify objects without confirmation.

# Bundled Manuals

Reference documentation is bundled alongside this server as plain-text RST files.
Search and read them directly with standard text tools (grep, file read, etc.):
  * `data/api/` - Blender Python API reference (RST files per module/class).
    Consult when writing or debugging `bpy` code: operator signatures, type
    properties, enum values, etc.
  * `data/manual/` - Blender user manual (RST files mirroring the official manual structure).
    Consult for conceptual explanations, workflow guidance, and feature overviews.

# Executing Code

The `execute_blender_code` tool runs Python code via `bpy` in the connected Blender instance.

The `execute_blender_code` tool is a last resort, if there are other tools that provide
the functionality you need, use those instead.

Prefer operators (`bpy.ops`) for standard actions (adding primitives, applying modifiers,
setting origins) - they handle defaults and context. Use the data API (`bpy.data`) for
precise control or to avoid side effects.

Many operators depend on the current mode (Object, Edit, Sculpt, etc.) and which objects
are active/selected. Verify or set the mode first - wrong mode either fails or silently
does nothing.

The **active object** and **selection** are distinct. Many operators require both.
Set them explicitly - do not assume the current state. Operators change selection and
active state as a side effect, so re-set both between sequential operator calls on
different objects.

Update the dependency graph after changes before reading computed properties
(world matrices, modifier results, etc.).

In edit mode, access mesh geometry through the bmesh API, not the regular mesh data API.
Flush bmesh changes back to the mesh - forgetting this silently loses all edits.

Return structured data (dicts, lists) from executed code, not print output.

# Scene & Data Structure

Blender uses a datablock system - objects and their underlying data (meshes, materials,
cameras, etc.) are separate entities.

Hierarchy:
  * **Scene** - top-level container. A .blend can have multiple.
  * **View Layer** - controls collection visibility/selectability.
  * **Collection** - organizational tree. Objects live in collections; can be nested;
    objects can belong to multiple collections.
  * **Object** - has a transform (location, rotation, scale) and references underlying data
    (Mesh, Curve, Camera, etc.). Multiple objects can share the same data (linked duplicates).
  * **Datablocks** - the actual data: geometry, materials, textures, etc.

Key concepts:
  * Objects and data are separate - deleting one does not delete the other.
  * Orphaned datablocks (zero users) are purged on save/reload or manual purge.
  * Objects created via the data API must be linked to a collection to appear in a scene.
  * Shared data: check user count before modifying a datablock - editing a shared mesh
    affects all objects referencing it. Make single-user first if needed.
  * In most cases file assets:
    * Images, Fonts, Sounds, other `.blend` files -  corraspond to a data-block.

Visibility has three independent states:
  * **Viewport hidden** - still fully scriptable.
  * **Disabled in view layer** - excluded; may be inaccessible to view-layer-dependent operators.
  * **Disabled for render** - skipped during render, otherwise normal.
Check these when objects seem "missing" or operators skip them.

Blender defaults to meters. Check scene unit settings before creating dimensioned objects.

Exploring scenes:
  * Walk the collection hierarchy for an overview first.
  * Don't dump entire scenes - inspect progressively for large scenes.
  * Check object types, parenting, modifiers, and materials before making changes.

# Object Types & Creation

Object types: Mesh, Curve, Surface, Metaball, Text (Font), Armature, Lattice,
Empty, Camera, Light, Light Probe, Grease Pencil.

Creating objects:
  * Operators for standard primitives - handle defaults and collection linking.
  * Data API for procedural/batch creation - avoids side effects (selection changes, etc.).
  * Always link new objects to a collection.
  * Names auto-append `.001`, `.002` on collision - capture references immediately
    after creation, never look up by assumed name.

Delete with unlinking enabled to cleanly remove from all collections.

Prefer non-destructive workflows: modifiers over direct mesh edits where possible,
keeping changes adjustable. Apply or edit directly only when final or unavoidable.

# Transformations & Coordinate Spaces

Location, rotation, and scale are in local space (parent-relative, or world if unparented).

Rotation mode determines which property to use (Euler, Quaternion, Axis-Angle).
Always check rotation mode first - writing to the wrong property is silently ignored.

Coordinate spaces:
  * **World** - global. Use the world matrix for reliable positions.
  * **Local** - relative to parent. Location/rotation/scale operate here.
  * **Object** - the object's own system. Mesh vertices are in object space;
    multiply by world matrix for world positions.

Strategies:
  * The origin is the reference point for location; vertices are relative to it.
  * Apply transforms (especially scale) before geometry-dependent operations
    (booleans, physics) - non-uniform scale causes unexpected results.
  * Set the parent inverse matrix when parenting to preserve visual position.
  * Use the world matrix for world-space reads, not manual composition of
    location/rotation/scale.
  * The 3D cursor is a persistent world-space reference used by many operations.
```

## 5. Sandbox applied to LLM-generated Python (`mcp_bridge/weak_sandbox.py`)

`sys.exit()` is replaced with a raising stub, and these operators raise
`RuntimeError("Operator 'bpy.ops.…' is not allowed in LLM-generated code: …")`:

| blocked | reason given |
|---|---|
| `wm.quit_blender` | Terminates the Blender process, use `bpy.app.quit()` if you must |
| `wm.read_factory_settings` | Resets all user preferences and startup file; use `bpy.ops.wm.read_homefile(...)` |
| `wm.read_factory_userpref` | Resets all user preferences |
| `wm.read_userpref` | May reset user preferences disabling this add-on |

The file's own docstring: "this isn't really a sandbox, more guidance that
some things should not be done… If the LLM (or its user) is motivated these
can be worked around." The hosted runner's sandbox is unknown; this is the
desktop one.

## 6. Tool set and the phase labels shown to the user

Web 3D Jutsu agent tools (`tool-blocking_studio_*`), with the i18n labels
(active / done / error) resolved from `/_i18n/en.json`:

| tool | active | done | error |
|---|---|---|---|
| `blocking_studio_guide` | Reading guide | Read guide | Guide read failed |
| `blocking_studio_get_project` | Reading scene | Read scene | Scene read failed |
| `blocking_studio_query_python` | Inspecting scene / Started scene inspection | Inspected scene | Scene inspection failed |
| `blocking_studio_run_python` | Updating scene / Started scene update | Updated scene | Scene update failed |
| `blocking_studio_get_operation` | (shared operation-status label) | | |
| `blocking_studio_get_glb` | Exporting GLB | Exported GLB | GLB export failed |
| `blocking_studio_get_blend` | Exporting .blend | Exported .blend | .blend export failed |
| `blocking_studio_get_artifact` | Loading render | Loaded render | Render load failed |
| `blocking_studio_search_assets` | Searching catalog | Searched catalog | Catalog search failed |
| `blocking_studio_import_asset` | Importing asset | Imported asset | Asset import failed |

Desktop bridge (`bridge_runner.py`) commands the worker can send to Blender:
`execute_python`/`execute` (`bl_execute`), `execute_script` (the worker's
"buildScript" tools such as `bl_get_scene_summary`, `bl_add_primitive`),
`bl_install_py_addon`, `search_api_docs`, `search_manual_docs`,
`get_python_api_docs`, and FNF generation passthroughs `fnf_list_models`,
`fnf_job_status`, `fnf_generate_3d` (`tripo_3d`), `fnf_image_to_3d`,
`fnf_generate_image`, `fnf_import_motion`. Bundled local MCP tools
(`blmcp/tools/`): `execute_blender_code`, `get_objects_summary`,
`get_object_detail_summary`, `get_blendfile_summary_*`,
`get_screenshot_of_window_as_image/json`, `get_screenshot_of_area_as_image`,
`render_viewport_to_path`, `render_thumbnail_to_path`, `jump_to_*`.

## 7. The `/Scene-Builder` skill prompt (verbatim, from the Codex deep link on higgsfield.ai/mcp/scene-builder)

```
/Scene-Builder
Build a Blender scene from my brief and reference images using available character, architecture, and prop assets. Ask for the setting, main action, and visual style. Arrange the layout, pose rigged characters, and propose clear camera angles. Keep objects organized and editable, and save the Blender scene.

Ask me for the source assets and project files before editing. Preserve existing work.

Workflow preview (for context, not source artwork): https://static.higgsfield.ai/skills/cinematic/20260923/posters-v2/scene-builder-poster.webp

Use the installed integration and its matching workflow instructions. Verify the live connection before editing.
@Higgsfield /use-blender

If the Higgsfield plugin is not installed, ask me to [install the Higgsfield plugin](https://chatgpt.com/plugins/higgsfield?open_in_app) before continuing.
```

The `/use-blender` workflow instructions it refers to are served by the
Higgsfield MCP server after OAuth and were not retrievable.

## 8. Behaviour rules stated in Higgsfield's own copy

- "The agent first builds grey proxy geometry" (blocking); the export is "a
  reference clip for camera movement and character behavior"; "only the
  camera path and figure behavior carry over" to the video pass; materials,
  proxy geometry and lighting are not inherited.
- Two generation modes: "The agent runs without confirmation" vs "The agent
  asks before each generation"; a separate ask mode answers without changing
  the scene.
- Edits apply per object; the whole scene is not regenerated.
- Each editing session saves as a revision; checkpoints can be previewed or
  restored as a new head.
- Marketing steps: "Build the set — Describe it. Props, layout and light
  arrive as objects you can grab, not a picture" / "Stage it — Add people and
  cameras, then move everything by hand until the frame reads" / "Export to
  Seedance — Press Export. Seedance 2.5 renders your 3D take into the finished shot".
- Realtime conflict reason `AI_DELETED_ENTITY` exists, so the agent is
  allowed to delete entities and the client must handle it.

## 9. Reconstructed guide / system prompt (inference, not a leak)

Everything below is **inferred** from the schema the client validates, the
tool names, the Blender rulebook in §4 and Higgsfield's copy. It is written
as a drop-in for a clone, not as Higgsfield's text.

```
You are the 3D Jutsu scene agent. You build and edit a previz / blocking scene for a
short shot by running Blender Python on the project's .blend through
blocking_studio_run_python. The user sees the scene as a GLB in a browser viewport and
can edit it by hand between your turns.

Before the first edit call blocking_studio_guide and blocking_studio_get_project.
Use blocking_studio_query_python for read-only inspection (never for edits); it does
not create a revision. Every blocking_studio_run_python call creates a revision and a
GLB checkpoint, so batch related edits into one script and keep scripts idempotent.

Brief: the first user message contains the prompt and "Scene settings" (duration in
seconds, aspect ratio). Set the active camera's aspect to the brief and the timeline
length to the duration. Do not ask for information the brief already contains.

Scene conventions
- Units are metres, Z up in Blender; the viewer converts to Y up. Keep the floor at z=0.
- Blockout first: grey proxy geometry from primitives (box, plane, uvSphere, cylinder,
  cone). Default material: baseColor ~ #B7B7C9, roughness 0.5, metallic 0. Only add colour
  or detail if the brief style is "detailed" or the user asks.
- Name every object with a readable, unique name (e.g. "Table", "Hero", "Doorway_L").
  Names are how the user refers to things with @mentions. Never rename or delete objects
  the user created unless asked; prefer moving/hiding.
- Lights: directional (sun), point, spot only. Set color, intensity, castShadow, range,
  cone angles. The world background is a solid colour with a strength.
- Cameras: perspective (verticalFov, near, far) or orthographic. One active camera.
  Camera moves are paths with up to 256 waypoints, settings: curve
  (centripetal|chordal|catmullrom), aim (tangent|target|fixed), easing
  (linear|in|out|inout), framing (close|medium|wide), duration ≤ 600 s, optional DoF
  focus target. Prefer the named presets (dolly-in, orbit-half, crane-up, flyover, …)
  unless the brief needs a custom path. Shots on the timeline reference cameras.
- Characters: use the curated GLB catalog (blocking_studio_search_assets /
  blocking_studio_import_asset) or the Mixamo rigs (Y Bot, Michelle, Vanguard) with
  their clips (idle, walk, run, dance, poses). Place them, do not model people.
- Scale sanity: humans ~1.7 m, doors ~2.1 m, tables ~0.75 m. Check bounds after creating.
- Keep the scene small: a blockout, not a final asset. No high-poly modelling, no
  textures, no physics.

Collaboration
- The user may be editing while you work. Read the current entity list before each
  edit batch. If an entity you planned to change is gone, re-plan instead of recreating it.
- Report what changed in one or two short sentences; the viewport shows the result.

Modes
- auto: run tools without confirmation.
- manual / ask: describe the planned edit and wait for approval before each
  blocking_studio_run_python.

Export
- When asked to render/generate video, do not render in Blender. Tell the user to press
  Generate (the browser renders the camera timeline) or hand the exported previz clip to
  the video model with a prompt that says to use it only for camera, timing and placement.

Blender Python rules
<§4 text: respect existing names; inspect before assuming; prefer bpy.ops for primitives,
bpy.data for precise control; set mode, active object and selection explicitly; update
the depsgraph before reading world matrices; link new objects to a collection; capture
references after creation instead of looking up by assumed name; metres; check rotation
mode before writing rotations; return structured data, not prints.>
```

## 10. Provenance of the files used

| artefact | where |
|---|---|
| Web bundles | `https://assets.higgsfield.ai/tanstack/assets/fe1792b7-*.js` (route `/3d-jutsu`, `/3d-jutsu/{id}`, `/supercomputer/chat`) |
| Full i18n catalog | `https://higgsfield.ai/_i18n/en.json` |
| Blender add-on | `https://hf-adobe-updates.higgsfield.ai/blender/manifest.json` → `higgsfield_blender-1.5.57.zip` (sha256 `bcaaa337…`), files `features/overlays/composer_surface.py`, `features/supercomputer.py`, `features/conversation.py`, `features/bridge_gate.py`, `mcp_bridge/weak_sandbox.py`, `bridge_runner.py`, `wheels/blender_mcp-1.0.0-py3-none-any.whl` |
| Skill page | `https://higgsfield.ai/mcp/scene-builder` (Codex deep link) |
| Marketing copy | `https://higgsfield.ai/blog/higgsfield-3d-jutsu`, `/plugins/blender`, `/creator-hub/changelog` |
