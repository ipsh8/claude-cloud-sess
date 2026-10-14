---
name: higgsfield-blender-bridge
description: How the Higgsfield Blender add-on (Scene Builder tab) wires a desktop Blender to the Supercomputer agent — connector registration, the hidden host-context text it appends to every request, the bridge tool surface, model allow-list and endpoints. Use when replicating Higgsfield's "agent drives Blender" loop or when reasoning about what the 3D Jutsu agent is told.
source: higgsfield_blender-1.5.57.zip (https://hf-adobe-updates.higgsfield.ai/blender/manifest.json), files features/overlays/composer_surface.py, features/supercomputer.py, features/conversation.py, features/bridge_gate.py, bridge_runner.py, mcp_service.py, runtime_config.py
relevance_to_3d_jutsu: primary
retrieved: 2026-10-14
---

# Higgsfield Blender Bridge (as implemented in the add-on)

## Topology

```
Blender add-on ──(OAuth oat_ token)──> FNF gateway  https://fnf-api-gw.higgsfield.ai/fnf-plugin-gateway
      │   POST /claudesfield/chats  {text, mode:"auto", name:"Blender | …", model?, medias?}
      │   POST /claudesfield/chats/{id}/messages   {type:"message", text, medias?}  |  {type:"tool_approval", …}
      │   POST /claudesfield/chats/{id}/config     {model}
      │   POST /claudesfield/chats/{id}/command    {command:"interrupt"}
      │   GET  {notification}/chats/{id}/poll?from=<cursor>      ("0-0" = from the beginning)
      │   GET  /claudesfield/models                              (model catalog)
      │   GET/POST /connectors                                   (register the bridge as a custom MCP)
      │
      └── bridge_runner.py  ──(wss://bridge.higgsfield.ai/plugin/ws?token=…&host=blr)──> Higgsfield MCP worker
                 recv {"type":"command","id","tool","input"}  → runs against local socket bridge :9876 (bpy on main thread)
                 send {"type":"result","id","ok","data"|"error"}
Agent side: custom MCP connector  https://bridge.higgsfield.ai/mcp  (Clerk OAuth; Codex callback http://localhost:56444/callback)
```

Connector registration payload:

```json
{"kind":"mcp_oauth","name":"blender_connector","display_name":"Higgsfield Blender","url":"https://bridge.higgsfield.ai/mcp","redirect_url":"https://higgsfield.ai/supercomputer/connectors?mcp_oauth=pending"}
```

## Hidden host context appended to the agent request (verbatim)

The user sees only their prompt; the agent receives `request_text`:

With selected objects:

```
Blender object context: work on the existing selected objects: {type} object named '{name}', … . They were selected when this request was sent. For animation requests, animate these objects in place instead of creating replacements.
```

First turn of a thread:

```
use higgsfield bridge connector. Use the blender connector among custom MCP. The Blender project name is '{file.blend}'.
```

Mentions of library elements are wired as `<<<uuid>>>` tokens; the chat is always created with `mode: "auto"` ("in manual mode the agent halts before every tool, including the internal ones it uses to read its own skill docs"). Chat name: `Blender | <first paragraph>`. Max 14 medias per turn. Turn timeout 900 s; job follow-up every 5 s up to 900 s.

## Model picker

Fallback `higgsfield/free-auto` ("Free mode"); catalog rows kept only if they match: `ox alpha`, `opus 5`, `fable 5`, `gpt 6 astra`, `gpt 5.6 sol`, `luna`, `kimi k3`, `grok 4.6`. Preferred default `opus 5`; `stealth/ox-alpha` is placed right after Free.

## Commands the worker can send to Blender (`bridge_runner._run_command`)

| tool | handled as |
|---|---|
| `execute_python` / `execute` (`bl_execute`) | run `code` in Blender under the weak sandbox |
| `execute_script` (buildScript tools: `bl_get_scene_summary`, `bl_add_primitive`, …) | run worker-generated `script`, success reported inside the result |
| `bl_install_py_addon` | install an add-on from source |
| `search_api_docs`, `search_manual_docs`, `get_python_api_docs` | offline RST search via bundled blmcp data |
| `fnf_list_models`, `fnf_job_status`, `fnf_generate_3d` (tripo_3d), `fnf_image_to_3d`, `fnf_generate_image`, `fnf_import_motion` | Higgsfield generation via the bundled fnf_sdk |

Fatal WS close codes (no reconnect): 4000 replaced, 4001 missing token, 4003 invalid. Reconnect backoff 1 s → 30 s.

## Other endpoints baked into the add-on

- Device auth origin: `https://fnf-device-auth.higgsfield.ai`; connector auth: `https://clerk.higgsfield.ai`
- Phone camera (Camera tab): `https://blendercam.higgsfield.ai`
- Update manifest: `https://hf-adobe-updates.higgsfield.ai/blender/manifest.json`
