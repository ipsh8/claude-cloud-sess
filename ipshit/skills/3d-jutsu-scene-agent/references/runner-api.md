# Blender runner API (https://3d-scene-builder.higgsfield.ai)

Bearer = Clerk session token; retried once on 401. `/health` → `{"ok":true,"service":"blender-runner"}`.

| Method | Path | Notes |
|---|---|---|
| GET | `/projects?limit=24&cursor=` | list |
| POST | `/projects` `{name}` | → `{project:{id}}` |
| DELETE | `/projects/{id}` | |
| GET | `/projects/{id}/collaboration?after=N` | `{revision, sceneSequence, appliedSequence, entities[], operations[], leases[]}` |
| POST | `/projects/{id}/scene-operations` `{operations:[…]}` | → accepted / conflicted per op |
| GET | `/projects/{id}/revisions?cursor&limit` | |
| POST | `/projects/{id}/revisions/{rev}/restore` `{operationId}` | long-running; poll `Location` |
| GET | `/projects/{id}/operations/{opId}` | honour `retry-after` (≤5 s), 5-min client cap |
| GET | `/projects/{id}/glb`, `/revisions/{rev}/glb` | presigned download + `{revision,size,etag}` |
| POST | `/projects/{id}/revisions/{rev}/glb-uploads` `{contentLength}` | presigned PUT; `SCENE_NOT_SETTLED` until `appliedSequence == sceneSequence` |
| GET | `/projects/{id}/scene-assets/{assetId}` | presigned download |
| POST | `/projects/{id}/entity-leases` (+`/renew`, `/release`) | `{entityId, clientSessionId, displayName?}` |
| POST | `/projects/{id}/event-ticket` `{profile}` | → `{ticket}` for `wss://…/projects/{id}/events?ticket=` |
| GET | `/curated-assets?search&limit=100` | separate host; `{total, items:[{id,name,tags,glb_url}]}` |

WebSocket events: `presence.snapshot|joined|updated|left`, `entity.lease.snapshot|acquired|released`, `entity.transform.preview|.cancelled|.rejected` (LEASE_NOT_ACTIVE, RATE_LIMITED), `scene.operation.committed|conflicted` (AI_DELETED_ENTITY, ENTITY_REMOVED), `scene.checkpointed`, `revision.committed`, `operation.updated`. Client sends `presence.update`, `entity.transform.preview`, `entity.transform.preview.cancel`.
