/* 내 지도: GeoJSON · Shapefile(.shp + .dbf, 또는 .zip) 읽어서 SVG 지도로 바꾸기
   결과는 convertSVG 와 같은 모양 { W, H, list:[{id,name,region,seats}], svg } 이에요. */

/* ---- 좌표 → 화면: 경위도면 위도에 맞춰 가로를 줄이고, 아니면 그대로 ---- */
function geoToSVG(feats, fileName) {
  // feats: [{ rings:[[[x,y],...],...] (외곽·구멍 섞여도 됨, evenodd), props:{} }]
  feats = feats.filter(f => f.rings && f.rings.length);
  if (!feats.length) throw new Error('도형(폴리곤)이 없어요.');
  let x0 = 1e18, y0 = 1e18, x1 = -1e18, y1 = -1e18;
  feats.forEach(f => f.rings.forEach(r => r.forEach(([x, y]) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; })));
  const deg = x0 >= -181 && x1 <= 181 && y0 >= -91 && y1 <= 91;
  const kx = deg ? Math.cos(((y0 + y1) / 2) * Math.PI / 180) : 1;
  const W = 1000, sc = W / ((x1 - x0) * kx || 1), H = Math.round((y1 - y0) * sc * 10) / 10 || 1, pad = 4;
  const P = ([x, y]) => [(x - x0) * kx * sc + pad, (y1 - y) * sc + pad];
  const tol = 0.35;
  const simp = pts => {           // Douglas–Peucker (고리 모양이라 가장 먼 점으로 둘로 나눠서)
    if (pts.length > 1 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) pts = pts.slice(0, -1);
    if (pts.length < 5) return pts;
    let far = 0, fd = -1; pts.forEach((q, i) => { const dd = (q[0] - pts[0][0]) ** 2 + (q[1] - pts[0][1]) ** 2; if (dd > fd) { fd = dd; far = i; } });
    if (far > 0) return [...simp1(pts.slice(0, far + 1)).slice(0, -1), ...simp1([...pts.slice(far), pts[0]]).slice(0, -1)];
    return simp1(pts);
  };
  const simp1 = pts => {
    if (pts.length < 4) return pts;
    const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
    const st = [[0, pts.length - 1]];
    while (st.length) {
      const [a, b] = st.pop(); let md = 0, mi = -1;
      const [ax, ay] = pts[a], [bx, by] = pts[b], dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1e-9;
      for (let i = a + 1; i < b; i++) { const d = Math.abs(dx * (ay - pts[i][1]) - dy * (ax - pts[i][0])) / L; if (d > md) { md = d; mi = i; } }
      if (md > tol && mi > 0) { keep[mi] = 1; st.push([a, mi], [mi, b]); }
    }
    return pts.filter((_, i) => keep[i]);
  };
  const keys = Object.keys(feats[0].props || {});
  const pick = re => keys.find(k => re.test(k) && feats.some(f => typeof f.props[k] === 'string' && f.props[k]));
  const nameKey = pick(/^(name|nom|nombre|navn|이름|선거구|.*_?name|.*nm|ts|dt|adm\d?_?(en|name)?)$/i) || pick(/name|nom|nm|이름|구/i) || keys.find(k => feats.some(f => typeof f.props[k] === 'string'));
  const regKey = pick(/^(region|state|st|province|sido|시도|county|fylke|dept|departement|adm1.*|parent)$/i);
  const seatKey = keys.find(k => /^(seats?|의석|정원|mandat.*|magnitude)$/i.test(k));
  const seen = {}, list = [], paths = [];
  feats.forEach((f, i) => {
    const d = f.rings.map(r => simp(r.map(P))).filter(r => r.length >= 3).map(r => 'M' + r.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join(' ') + 'Z').join('');
    if (!d) return;
    let name = String((nameKey && f.props[nameKey]) || ('구역 ' + (i + 1))).trim();
    let id = name.replace(/[\s"'<>&]+/g, '_').slice(0, 60) || ('a' + i);
    if (seen[id]) id = id + '_' + (++seen[id]); else seen[id] = 1;
    const region = String((regKey && regKey !== nameKey && f.props[regKey]) || 'default');
    const seats = seatKey ? parseInt(f.props[seatKey]) || null : null;
    list.push({ id, name, region, seats });
    paths.push(`<path id="${escAttr(id)}" data-region="${escAttr(region)}" d="${d}"/>`);
  });
  const SW = W + pad * 2, SH = Math.ceil(H + pad * 2);
  return { W: SW, H: SH, list, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}"><g fill="#1a3a40" stroke="#d86a78" stroke-width="1" stroke-linejoin="round" fill-rule="evenodd">\n${paths.join('\n')}\n</g></svg>`, nameKey };
}

/* ---- GeoJSON ---- */
function parseGeoJSON(text) {
  const j = JSON.parse(text);
  const fs = j.type === 'FeatureCollection' ? j.features : j.type === 'Feature' ? [j] : j.type ? [{ type: 'Feature', geometry: j, properties: {} }] : [];
  const out = [];
  fs.forEach(f => {
    const g = f && f.geometry; if (!g) return;
    let rings = [];
    if (g.type === 'Polygon') rings = g.coordinates;
    else if (g.type === 'MultiPolygon') g.coordinates.forEach(p => rings.push(...p));
    else if (g.type === 'GeometryCollection') g.geometries.forEach(x => { if (x.type === 'Polygon') rings.push(...x.coordinates); if (x.type === 'MultiPolygon') x.coordinates.forEach(p => rings.push(...p)); });
    if (rings.length) out.push({ rings: rings.map(r => r.map(c => [c[0], c[1]])), props: f.properties || {} });
  });
  if (!out.length) throw new Error('GeoJSON 안에 폴리곤이 없어요.');
  return out;
}

/* ---- Shapefile (.shp 폴리곤 + .dbf 속성) ---- */
function parseSHP(buf) {
  const v = new DataView(buf); if (v.getInt32(0) !== 9994) throw new Error('.shp 파일이 아니에요.');
  const out = []; let o = 100;
  while (o + 8 <= buf.byteLength) {
    const len = v.getInt32(o + 4) * 2; const s = o + 8; o = s + len;
    if (s + 4 > buf.byteLength) break;
    const t = v.getInt32(s, true);
    if (t === 0) { out.push(null); continue; }
    if (![5, 15, 25].includes(t)) { out.push(null); continue; }
    const np = v.getInt32(s + 36, true), nn = v.getInt32(s + 40, true);
    const parts = []; for (let i = 0; i < np; i++) parts.push(v.getInt32(s + 44 + i * 4, true));
    const p0 = s + 44 + np * 4, rings = [];
    for (let i = 0; i < np; i++) {
      const a = parts[i], b = i + 1 < np ? parts[i + 1] : nn, r = [];
      for (let k = a; k < b; k++) r.push([v.getFloat64(p0 + k * 16, true), v.getFloat64(p0 + k * 16 + 8, true)]);
      rings.push(r);
    }
    out.push(rings);
  }
  return out;
}
function parseDBF(buf, enc) {
  const v = new DataView(buf), n = v.getUint32(4, true), hl = v.getUint16(8, true), rl = v.getUint16(10, true);
  const fields = []; let o = 32;
  while (o < hl - 1 && v.getUint8(o) !== 0x0d) {
    let nm = ''; for (let i = 0; i < 11; i++) { const c = v.getUint8(o + i); if (!c) break; nm += String.fromCharCode(c); }
    fields.push({ nm, t: String.fromCharCode(v.getUint8(o + 11)), len: v.getUint8(o + 16) }); o += 32;
  }
  let dec; try { dec = new TextDecoder(enc || 'utf-8', { fatal: !enc }); } catch (e) { dec = new TextDecoder('utf-8'); }
  const fb = new TextDecoder('euc-kr');
  const rows = [];
  for (let r = 0; r < n; r++) {
    let p = hl + r * rl + 1; const row = {};
    fields.forEach(f => {
      const bytes = new Uint8Array(buf, p, f.len); p += f.len;
      let s; try { s = dec.decode(bytes); } catch (e) { s = fb.decode(bytes); }
      s = s.replace(/\0/g, '').trim();
      row[f.nm] = (f.t === 'N' || f.t === 'F') && s !== '' && !isNaN(+s) ? +s : s;
    });
    rows.push(row);
  }
  return rows;
}

/* ---- zip 풀기 (shp 묶음) ---- */
async function unzip(buf) {
  const v = new DataView(buf), u8 = new Uint8Array(buf), files = {};
  let e = buf.byteLength - 22; while (e >= 0 && v.getUint32(e, true) !== 0x06054b50) e--;
  if (e < 0) throw new Error('zip 파일을 읽지 못했어요.');
  let o = v.getUint32(e + 16, true); const cnt = v.getUint16(e + 10, true);
  for (let i = 0; i < cnt; i++) {
    const meth = v.getUint16(o + 10, true), csz = v.getUint32(o + 20, true), nl = v.getUint16(o + 28, true), xl = v.getUint16(o + 30, true), cl = v.getUint16(o + 32, true), lo = v.getUint32(o + 42, true);
    const name = new TextDecoder().decode(u8.subarray(o + 46, o + 46 + nl)); o += 46 + nl + xl + cl;
    const ds = lo + 30 + v.getUint16(lo + 26, true) + v.getUint16(lo + 28, true), data = u8.slice(ds, ds + csz);
    if (meth === 0) files[name] = data.buffer;
    else if (meth === 8) files[name] = await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer();
  }
  return files;
}

/* 파일들 → 지도. 여러 파일(.shp+.dbf+.cpg)을 함께 골라도 되고 .zip 하나여도 돼요 */
async function readMapFiles(fileList) {
  const files = [...fileList], by = {};
  for (const f of files) {
    const ext = f.name.toLowerCase().split('.').pop();
    if (ext === 'zip') {
      const z = await unzip(await f.arrayBuffer());
      for (const n in z) { const e2 = n.toLowerCase().split('.').pop(); if (!by[e2] && !/__macosx/i.test(n)) by[e2] = { name: n.split('/').pop(), buf: z[n] }; }
    } else by[ext] = { name: f.name, file: f };
  }
  const buf = async k => by[k].buf || await by[k].file.arrayBuffer();
  const txt = async k => by[k].file ? await by[k].file.text() : new TextDecoder().decode(by[k].buf);
  const base = n => n.replace(/\.[^.]+$/, '');
  if (by.svg) return { kind: 'SVG', name: base(by.svg.name), conv: convertSVG(await txt('svg')) };
  const gj = by.geojson || by.json;
  if (gj) return { kind: 'GeoJSON', name: base(gj.name), conv: geoToSVG(parseGeoJSON(await txt(by.geojson ? 'geojson' : 'json'))) };
  if (by.shp) {
    const shapes = parseSHP(await buf('shp'));
    let enc = null; if (by.cpg) { enc = (await txt('cpg')).trim().toLowerCase(); if (/^(utf-?8|65001)$/.test(enc)) enc = 'utf-8'; else if (/949|euc|ks/.test(enc)) enc = 'euc-kr'; }
    const rows = by.dbf ? parseDBF(await buf('dbf'), enc) : [];
    const feats = shapes.map((r, i) => r && { rings: r, props: rows[i] || {} }).filter(Boolean);
    return { kind: 'Shapefile', name: base(by.shp.name), conv: geoToSVG(feats), noDbf: !by.dbf };
  }
  throw new Error('SVG · GeoJSON · Shapefile(.shp/.zip) 파일을 골라 주세요.');
}
