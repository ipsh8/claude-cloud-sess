// Figma Plugin API script for use_figma (Design file). Paste this file, then set GRAPH at the bottom.
// Builds one lane of an Arcads-style node graph: dark cards per node, media placeholders
// (named "MEDIA:<file>") to fill afterwards with upload_assets(nodeIds), and bezier wires coloured by type.
// Returns created ids plus [nodeId, name] for every media slot.
const page = figma.currentPage;
const hex = h => ({ r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 });
const solid = (h, o = 1) => ({ type: 'SOLID', color: hex(h), opacity: o });
page.backgrounds = [solid('0B0B0D')];
await Promise.all([['Inter', 'Regular'], ['Inter', 'Semi Bold'], ['JetBrains Mono', 'Regular'], ['JetBrains Mono', 'Medium'], ['Instrument Serif', 'Regular']].map(([family, style]) => figma.loadFontAsync({ family, style })));
const C = { card: '161619', inner: '0F0F11', stroke: '26262B', text: 'ECECEC', dim: '8B8B94', green: '34D399', yellow: 'FACC15', purple: 'A78BFA', blue: '60A5FA', pink: 'F472B6', orange: 'FB923C', red: 'F87171' };
const KIND = { image: C.green, animatic: C.purple, llm: C.blue, nanobanana: C.orange, prompt: C.yellow, video: C.purple, upscale: C.blue, final: C.pink };
const WIRE = { image: C.green, prompt: C.yellow, video: C.purple, upscale: C.blue, final: C.pink };
const ids = [];
function txt(s, { size = 12, font = 'Inter', style = 'Regular', color = C.text, width = null, lh = null, ls = 0 } = {}) { const t = figma.createText(); t.fontName = { family: font, style }; t.characters = s; t.fontSize = size; t.fills = [solid(color)]; if (lh) t.lineHeight = { unit: 'PERCENT', value: lh }; if (ls) t.letterSpacing = { unit: 'PERCENT', value: ls }; if (width) { t.textAutoResize = 'HEIGHT'; t.resize(width, t.height); } return t; }
function row(children, gap = 8) { const r = figma.createAutoLayout('HORIZONTAL', { itemSpacing: gap }); r.fills = []; r.counterAxisAlignItems = 'CENTER'; children.forEach(c => r.appendChild(c)); return r; }
function badge(label, color) { const b = figma.createAutoLayout('HORIZONTAL'); b.paddingLeft = b.paddingRight = 8; b.paddingTop = b.paddingBottom = 3; b.cornerRadius = 99; b.fills = [solid(color, 0.14)]; b.strokes = [solid(color, 0.5)]; b.strokeWeight = 1; b.appendChild(txt(label, { font: 'JetBrains Mono', style: 'Medium', size: 9.5, color, ls: 4 })); return b; }
function buildNode(n, x, y) {
  const color = KIND[n.kind] || C.dim, w = n.w || 360, iw = w - 28;
  const f = figma.createAutoLayout('VERTICAL', { name: n.id, itemSpacing: 10 });
  f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = 14; f.cornerRadius = 14; f.fills = [solid(C.card)];
  f.strokes = [solid(n.selected ? color : C.stroke)]; f.strokeWeight = n.selected ? 2 : 1;
  f.counterAxisSizingMode = 'FIXED'; f.resize(w, 100); f.primaryAxisSizingMode = 'AUTO';
  const dot = figma.createEllipse(); dot.resize(8, 8); dot.fills = [solid(color)];
  f.appendChild(row([dot, txt(n.label || n.kind.toUpperCase(), { font: 'JetBrains Mono', style: 'Medium', size: 10, color, ls: 6 })]));
  if (n.title) f.appendChild(txt(n.title, { size: 15, style: 'Semi Bold', width: iw, lh: 125 }));
  for (const b of n.blocks || []) {
    if (b.badge) f.appendChild(row([badge(b.badge, b.color ? C[b.color] : color)]));
    if (b.media) { const r = figma.createRectangle(); r.name = 'MEDIA:' + b.media; r.resize(iw, Math.round(iw / (b.ar || 16 / 9))); r.cornerRadius = 8; r.fills = [solid('222226')]; f.appendChild(r); }
    if (b.kv) { const box = figma.createAutoLayout('VERTICAL', { itemSpacing: 4 }); box.fills = []; b.kv.forEach(([k, v]) => box.appendChild(txt(`${k.padEnd(14, ' ')}${v}`, { font: 'JetBrains Mono', size: 10.5, color: C.dim, width: iw }))); f.appendChild(box); }
    if (b.prompt) { const p = figma.createAutoLayout('VERTICAL', { itemSpacing: 6 }); const pc = b.color ? C[b.color] : C.yellow; p.fills = [solid(C.inner)]; p.cornerRadius = 8; p.paddingTop = p.paddingBottom = p.paddingLeft = p.paddingRight = 10; p.strokes = [solid(pc, 0.25)]; p.strokeWeight = 1; if (b.title) p.appendChild(txt(b.title, { font: 'JetBrains Mono', style: 'Medium', size: 9.5, color: pc, ls: 4 })); p.appendChild(txt(b.prompt, { size: 11, width: iw - 20, lh: 145, color: 'D4D4D8' })); f.appendChild(p); }
    if (b.note) f.appendChild(txt(b.note, { size: 11, color: b.color ? C[b.color] : C.dim, width: iw, lh: 140 }));
    if (b.hf) f.appendChild(txt('HIGGSFIELD ↦  ' + b.hf, { font: 'JetBrains Mono', size: 10, color: C.pink, width: iw, lh: 140 }));
  }
  f.x = x; f.y = y; ids.push(f.id); return f;
}
function wire(a, b, type) {
  const color = WIRE[type] || C.dim;
  const x1 = a.x + a.width, y1 = a.y + 60, x2 = b.x, y2 = b.y + 60, dx = Math.max(60, (x2 - x1) * 0.5);
  const mx = Math.min(x1, x2), my = Math.min(y1, y2), L = (X, Y) => `${(X - mx).toFixed(1)} ${(Y - my).toFixed(1)}`;
  const v = figma.createVector(); v.name = 'edge'; v.vectorPaths = [{ windingRule: 'NONE', data: `M ${L(x1, y1)} C ${L(x1 + dx, y1)} ${L(x2 - dx, y2)} ${L(x2, y2)}` }];
  v.strokes = [solid(color, 0.85)]; v.strokeWeight = 2; v.fills = []; v.x = mx; v.y = my; page.insertChild(0, v); ids.push(v.id);
  for (const [px, py] of [[x1, y1], [x2, y2]]) { const d = figma.createEllipse(); d.resize(10, 10); d.fills = [solid(color)]; d.strokes = [solid('0B0B0D')]; d.strokeWeight = 2; d.x = px - 5; d.y = py - 5; ids.push(d.id); }
}
function buildLane(L) {
  const title = txt(L.title, { font: 'Instrument Serif', size: 44 }); title.x = L.x || 0; title.y = L.y - 90; ids.push(title.id);
  const byId = {};
  L.columns.forEach((col, ci) => { let y = L.y; for (const n of col) { const node = buildNode(n, (L.x || 0) + ci * (L.colGap || 440), y); byId[n.id] = node; y += node.height + 36; } });
  for (const [a, b, t] of L.edges) wire(byId[a], byId[b], t);
  return Math.max(...Object.values(byId).map(n => n.y + n.height));
}
// ---- GRAPH: one lane per call keeps scripts small and safe to retry ----
// const GRAPH = { title: 'AD 03 — …', y: 6000, columns: [[{id:'in-woman',kind:'image',title:'Woman',blocks:[{media:'woman.png',ar:16/9},{kv:[['size','2048×1152']]}]}], [...]], edges: [['in-woman','nb-woman','image']] };
const bottom = buildLane(GRAPH);
return { ids, bottom, media: page.findAll(n => n.name.startsWith('MEDIA:')).map(n => [n.id, n.name]) };
