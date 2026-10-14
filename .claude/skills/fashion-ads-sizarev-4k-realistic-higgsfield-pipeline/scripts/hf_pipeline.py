#!/usr/bin/env python3
"""Run a SIZAREV-style fashion-ad pipeline on the Higgsfield API.

    python3 hf_pipeline.py configs/ad01-solo-diesel-walk.json --dry-run
    python3 hf_pipeline.py configs/ad01-solo-diesel-walk.json --out ./out
    python3 hf_pipeline.py configs/ad02-duo-sunglasses-toss.json --regenerate --takes 2

Credentials: HF_API_KEY_ID and HF_API_KEY_SECRET (Higgsfield Console -> API keys).
API docs: https://docs.higgsfield.ai/docs/llms.txt  (base URL https://api.higgsfield.ai)

Config values can reference:
  "@file:<path>"  local file -> uploaded via /files/generate-upload-url -> public URL
  "@text:<path>"  replaced with the file's text (prompts)
  "@step:<id>"    replaced with the output URL of an earlier step
Paths are relative to the config's "base_dir" (itself relative to the config file).
A step with "reuse_file" uploads that file instead of generating, unless --regenerate is passed.
Only the standard library is used.
"""
import argparse, json, mimetypes, os, sys, time, urllib.request, urllib.error, uuid
from pathlib import Path

API = "https://api.higgsfield.ai"
TERMINAL = {"completed", "failed", "nsfw", "canceled"}


def auth_headers():
    kid, sec = os.environ.get("HF_API_KEY_ID"), os.environ.get("HF_API_KEY_SECRET")
    if not kid or not sec:
        sys.exit("Set HF_API_KEY_ID and HF_API_KEY_SECRET (Higgsfield Console -> API keys).")
    return {"Authorization": f"Key {kid}:{sec}", "Content-Type": "application/json"}


def http(method, url, body=None, headers=None, data=None):
    req = urllib.request.Request(url, method=method, headers=headers or {},
                                 data=data if data is not None else (json.dumps(body).encode() if body is not None else None))
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            raw = r.read()
            return json.loads(raw) if raw and r.headers.get_content_type() == "application/json" else raw
    except urllib.error.HTTPError as e:
        sys.exit(f"{method} {url} -> HTTP {e.code}: {e.read().decode(errors='replace')[:800]}")


class Runner:
    def __init__(self, cfg_path, out, dry, regenerate, takes):
        self.cfg_path = Path(cfg_path).resolve()
        self.cfg = json.loads(self.cfg_path.read_text())
        self.base = (self.cfg_path.parent / self.cfg.get("base_dir", ".")).resolve()
        self.out = Path(out).resolve(); self.out.mkdir(parents=True, exist_ok=True)
        self.dry, self.regenerate, self.takes = dry, regenerate, takes
        self.uploads, self.outputs, self.log = {}, {}, []
        self.h = None if dry else auth_headers()

    # ---- references ----
    def upload(self, rel):
        if rel in self.uploads:
            return self.uploads[rel]
        p = self.base / rel
        if not p.exists():
            sys.exit(f"missing file: {p}")
        ctype = mimetypes.guess_type(p.name)[0] or "application/octet-stream"
        if self.dry:
            url = f"https://cdn.higgsfield.example/upload/{p.name}"
        else:
            u = http("POST", f"{API}/files/generate-upload-url", {"content_type": ctype}, self.h)
            http("PUT", u["upload_url"], headers=u.get("upload_headers", {"Content-Type": ctype}), data=p.read_bytes())
            url = u["public_url"]
        print(f"  upload {rel} -> {url}")
        self.uploads[rel] = url
        return url

    def resolve(self, v):
        if isinstance(v, list):
            return [self.resolve(x) for x in v]
        if isinstance(v, dict):
            return {k: self.resolve(x) for k, x in v.items()}
        if isinstance(v, str):
            if v.startswith("@file:"):
                return self.upload(v[6:])
            if v.startswith("@text:"):
                return (self.base / v[6:]).read_text().strip()
            if v.startswith("@step:"):
                return self.outputs[v[6:]][0]
        return v

    # ---- generation ----
    def submit_and_wait(self, endpoint, payload):
        if self.dry:
            return {"status": "completed", "dry_run": True}
        h = dict(self.h, **{"Idempotency-Key": str(uuid.uuid4())})
        r = http("POST", f"{API}/{endpoint}", payload, h)
        status_url, delay = r["status_url"], 4
        print(f"  queued {r['request_id']}")
        while True:
            time.sleep(delay); delay = min(delay * 1.5, 20)
            s = http("GET", status_url, headers=self.h)
            print(f"  status {s.get('status')}")
            if s.get("status") in TERMINAL:
                if s["status"] != "completed":
                    sys.exit(f"request {r['request_id']} ended as {s['status']}: {json.dumps(s)[:600]}")
                return s

    @staticmethod
    def result_urls(s):
        urls = [i["url"] for i in s.get("images", []) if i.get("url")]
        if s.get("video", {}).get("url"):
            urls.append(s["video"]["url"])
        return urls

    def download(self, url, name):
        dest = self.out / name
        if not self.dry:
            dest.write_bytes(http("GET", url))
        print(f"  saved {dest}")
        return str(dest)

    def run(self):
        print(f"== {self.cfg['name']}  (dry-run={self.dry})")
        for step in self.cfg["steps"]:
            sid = step["id"]
            print(f"-- step {sid}: {step.get('note', step['endpoint'])}")
            if step.get("reuse_file") and not self.regenerate:
                self.outputs[sid] = [self.upload(step["reuse_file"])]
                self.log.append({"step": sid, "reused": step["reuse_file"], "url": self.outputs[sid][0]})
                continue
            payload = self.resolve(step["params"])
            n = self.takes if step.get("kind") == "video" else 1
            self.outputs[sid] = []
            for take in range(1, n + 1):
                if self.dry:
                    shown = {k: (v[:90] + "…" if isinstance(v, str) and len(v) > 90 else v) for k, v in payload.items()}
                    print(f"  POST {API}/{step['endpoint']}\n  " + json.dumps(shown, indent=2).replace("\n", "\n  "))
                s = self.submit_and_wait(step["endpoint"], payload)
                urls = self.result_urls(s) or [f"https://cdn.higgsfield.example/out/{sid}_take{take}"]
                ext = ".mp4" if step.get("kind") == "video" else ".png"
                files = [self.download(u, f"{sid}_take{take}{ext}") for u in urls[:1]]
                self.outputs[sid].append(urls[0])
                self.log.append({"step": sid, "take": take, "endpoint": step["endpoint"], "url": urls[0], "file": files[0]})
        (self.out / "run.json").write_text(json.dumps({"config": str(self.cfg_path), "log": self.log}, indent=2))
        print(f"== done -> {self.out / 'run.json'}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("config")
    ap.add_argument("--out", default="./hf_out")
    ap.add_argument("--dry-run", action="store_true", help="print payloads, no network, no credentials needed")
    ap.add_argument("--regenerate", action="store_true", help="re-run white-studio cleanup instead of reusing files")
    ap.add_argument("--takes", type=int, default=1, help="video takes per video step (SIZAREV ran 2)")
    a = ap.parse_args()
    Runner(a.config, a.out, a.dry_run, a.regenerate, a.takes).run()
