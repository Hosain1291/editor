/* 내보내기: PNG 이미지 · SVG 파일 · JSON 파일, 그리고 JSON 불러오기 */

/* 지금 보기의 색칠된 지도를 SVG 문자열로 (해안선·줄무늬 포함) */
function mapSVG(pad = 20, fx = false) {
  const v = curView, b = boxOf(v), sc = Math.min(1, 1400 / b.w);
  const W = Math.round(b.w * sc + pad * 2), H = Math.round(b.h * sc + pad * 2);
  const clone = svg.cloneNode(true);
  clone.removeAttribute('id'); clone.removeAttribute('style');
  clone.setAttribute('xmlns', NS);
  clone.setAttribute('viewBox', `${b.x - pad / sc} ${b.y - pad / sc} ${b.w + 2 * pad / sc} ${b.h + 2 * pad / sc}`);
  clone.setAttribute('width', W); clone.setAttribute('height', H);
  const ci = clone.querySelector('#coast');
  if (ci && !OPT.coast) ci.remove();
  else if (ci) {
    const cg = document.createElementNS(NS, 'g'); cg.setAttribute('fill', 'none'); cg.setAttribute('stroke', '#e6fbfb');
    cg.setAttribute('stroke-width', (2.6 * MAP.width / 1600 / sc).toFixed(2)); cg.setAttribute('stroke-linejoin', 'round');
    DATA.forEach(d => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d[2]); if (d[3]) p.setAttribute('transform', d[3]); cg.appendChild(p); });
    ci.replaceWith(cg);
  }
  const live = {}; if (fx) svg.querySelectorAll('#g path').forEach(p => live[p.dataset.id] = p);
  clone.querySelectorAll('#g path').forEach(p => {
    const id = p.dataset.id, lp = fx && live[id], ls = lp && getComputedStyle(lp).stroke;
    p.setAttribute('id', id); p.removeAttribute('data-id');
    p.setAttribute('stroke', ls && ls !== 'none' ? ls : p.classList.contains('lock') ? THEME.frame : (p.classList.contains('ctx') ? THEME.ctxStroke : strokeColor()));
    p.setAttribute('stroke-width', (0.6 * OPT.strokeW * MAP.width / 1600 / sc).toFixed(2)); p.setAttribute('fill-rule', 'evenodd');
    p.removeAttribute('class');
    if (inMap[id]) { const t = document.createElementNS(NS, 'title'); t.textContent = `${nameOf(id)} (${seatsOf(id)})`; p.appendChild(t); }
  });
  /* PNG 용: 테마의 지도 효과(크레파스·키캡 등)와 글자 모양을 그대로 옮겨요 */
  let cssFx = 'none';
  if (fx) {
    const lg0 = svg.querySelector('#g'), cg0 = clone.querySelector('#g'), f = getComputedStyle(lg0).filter, m = /url\("?#([^")]+)"?\)/.exec(f || '');
    if (m && document.getElementById(m[1])) {
      const d = clone.querySelector('defs') || clone.insertBefore(document.createElementNS(NS, 'defs'), clone.firstChild);
      d.appendChild(document.getElementById(m[1]).cloneNode(true)); if (window.tuneFx) tuneFx(d, 1 / sc); cg0.setAttribute('filter', `url(#${m[1]})`);
    } else if (f && f !== 'none') cg0.setAttribute('style', 'filter:' + f);
    const lt = [...svg.querySelectorAll('#labels text')];
    clone.querySelectorAll('#labels text').forEach((t, i) => { const c = lt[i] && getComputedStyle(lt[i]); if (!c) return;
      t.setAttribute('fill', c.fill); t.setAttribute('stroke', c.stroke); t.setAttribute('stroke-width', c.strokeWidth); t.setAttribute('stroke-linejoin', 'round'); t.setAttribute('paint-order', 'stroke'); t.setAttribute('font-family', c.fontFamily.replace(/"/g, "'")); });
    const wf = getComputedStyle(svg).filter; if (wf && wf !== 'none' && !/url\(/.test(wf)) cssFx = wf;
  }
  const lg = clone.querySelector('#labels');
  if (lg) { lg.removeAttribute('id'); if (!OPT.labels) lg.remove(); else { if (!fx) lg.setAttribute('font-family', 'Rajdhani, Arial, sans-serif'); lg.setAttribute('font-weight', '700'); lg.setAttribute('text-anchor', 'middle'); lg.setAttribute('dominant-baseline', 'central'); lg.querySelectorAll('text').forEach(t => { if (t.style.display === 'none') t.remove(); else t.removeAttribute('data-id'); }); } }
  return { str: new XMLSerializer().serializeToString(clone), W, H, cssFx };
}

/* 결과 데이터 (JSON) — 다시 불러올 수 있도록 저장 상태(store)도 같이 넣어요 */
function resultJSON() {
  const T = totals();
  const districts = mapIds.map(id => {
    const x = M.d[id] || { a: {} };
    const alloc = {}, margins = {}; store.parties.forEach(p => { if (x.a[p.id]) { alloc[p.name] = x.a[p.id]; margins[p.name] = MARGINS[mOf(x, p.id)]; } });
    const u = Object.values(x.a).reduce((a, b) => a + b, 0);
    const w = isPres() ? winnerOf(id) : owner(id);
    return {
      id, name: nameOf(id), region: regionName(region[id]), seats: seatsOf(id),
      result: alloc, tossup: Math.max(0, seatsOf(id) - u), margin: u ? margins : null,
      winner: w ? party(w).name : null, disabled: !!x.off, locked: !!x.lock
    };
  });
  return {
    app: 'TNO map', version: 1, exported: new Date().toISOString(),
    map: MAP.id, mapName: MAP.name, view: curView.key, viewName: curView.name,
    totals: {
      seats: T.all, majority: T.maj, tossup: T.toss,
      parties: store.parties.map(p => ({ name: p.name, candidate: p.cand || undefined, color: p.colors[0], seats: T.t[p.id], byMargin: Object.fromEntries(MARGINS.map((m, i) => [m, T.mg[p.id][i]])) }))
    },
    districts,
    store
  };
}

/* 파일 받기 (막힌 곳에서는 복사로 대신) */
function download(name, text, type) {
  try {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    $('#exMsg').textContent = `'${name}' 파일을 받았어요. 받아지지 않았다면 아래 복사 버튼을 쓰세요.`;
  } catch (e) { $('#exMsg').textContent = '이 화면에서는 파일 받기가 막혀 있어요. 복사 버튼을 쓰세요.'; }
}
async function copyText(text, what) {
  try { await navigator.clipboard.writeText(text); $('#exMsg').textContent = `${what}을(를) 복사했어요.`; }
  catch (e) { $('#exMsg').textContent = '복사가 막혀 있어요. 이 기능은 GitHub Pages 주소에서 써 주세요.'; }
}
const fileBase = () => `tno-map_${MAP.id}_${curView.key}_${new Date().toISOString().slice(0, 10)}`;

/* 테마별 PNG 꾸미기: 바탕(bg) · 마지막 덧칠(top) */
function grainPat(x, a) {
  const c = document.createElement('canvas'); c.width = c.height = 160; const g = c.getContext('2d'), im = g.createImageData(160, 160);
  for (let i = 0; i < im.data.length; i += 4) { const v = 70 + Math.random() * 60; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = Math.random() * a; }
  g.putImageData(im, 0, 0); return x.createPattern(c, 'repeat');
}
function scanlines(x, W, H, a) { x.fillStyle = `rgba(0,0,0,${a})`; for (let y = 2; y < H; y += 3) x.fillRect(0, y, W, 1); }
const PNG_DECO = {
  sketch: {
    bg(x, W, H, top) {
      x.fillStyle = '#fdfcf7'; x.fillRect(0, 0, W, H);
      x.strokeStyle = '#e3e8f2'; x.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 24) { x.beginPath(); x.moveTo(gx + .5, top); x.lineTo(gx + .5, H); x.stroke(); }
      for (let gy = top; gy < H; gy += 24) { x.beginPath(); x.moveTo(0, gy + .5); x.lineTo(W, gy + .5); x.stroke(); }
      x.fillStyle = '#f6f4ec'; x.fillRect(0, 0, W, top);
      /* 연필로 그은 듯 흔들리는 두 줄 */
      x.strokeStyle = '#2b2b2b'; x.lineWidth = 2; x.lineCap = 'round';
      for (const yy of [top - 4, top - 1]) { x.beginPath(); x.moveTo(10, yy); for (let gx = 10; gx < W - 10; gx += 18) x.lineTo(gx, yy + Math.sin(gx * .05 + yy) * 1.2); x.stroke(); }
      return true;
    },
    top(x, W, H) {
      x.save(); x.globalCompositeOperation = 'multiply'; x.fillStyle = grainPat(x, 26); x.fillRect(0, 0, W, H); x.restore();
      for (let gx = 17; gx < W; gx += 34) { x.beginPath(); x.arc(gx, 14, 5.5, 0, 7); x.fillStyle = '#c8c6bf'; x.fill(); x.beginPath(); x.arc(gx, 14, 3, 0, 7); x.fillStyle = '#55555c'; x.fill(); }
    }
  },
  cmyk: {
    bg(x, W, H, top) {
      x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
      x.fillStyle = '#00aeef22'; for (let gy = 4; gy < top - 6; gy += 9) for (let gx = 4; gx < W; gx += 9) { x.beginPath(); x.arc(gx, gy, 1.2, 0, 7); x.fill(); }
      x.fillStyle = '#ec008c1c'; for (let gy = 7; gy < top - 6; gy += 11) for (let gx = 8; gx < W; gx += 11) { x.beginPath(); x.arc(gx, gy, 1.2, 0, 7); x.fill(); }
      x.fillStyle = '#111'; x.fillRect(0, top - 4, W, 4); x.fillStyle = '#00aeef'; x.fillRect(0, top, W, 3);
      return true;
    },
    title(x, txt, X, Y) { x.fillStyle = '#00aeefcc'; x.fillText(txt, X - 2, Y); x.fillStyle = '#ec008ccc'; x.fillText(txt, X + 2, Y + 1); },
    top(x, W, H) {
      const c = ['#00aeef', '#ec008c', '#fff200', '#111111']; c.forEach((k, i) => { x.fillStyle = k; x.fillRect(i * W / 4, H - 8, W / 4 + 1, 8); });
      x.strokeStyle = '#111'; x.lineWidth = 1;
      [[12, 12, 1, 1], [W - 12, 12, -1, 1], [12, H - 20, 1, -1], [W - 12, H - 20, -1, -1]].forEach(([cx, cy, sx, sy]) => { x.beginPath(); x.moveTo(cx, cy + sy * 26); x.lineTo(cx, cy); x.lineTo(cx + sx * 26, cy); x.stroke(); });
      x.beginPath(); x.arc(W / 2, 14, 7, 0, 7); x.moveTo(W / 2 - 12, 14); x.lineTo(W / 2 + 12, 14); x.moveTo(W / 2, 2); x.lineTo(W / 2, 26); x.stroke();
    }
  },
  term: {
    glow: '#33ff66',
    titlePre: 'C:\\> ', cursor: true,
    top(x, W, H) {
      scanlines(x, W, H, .33);
      const g = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.6)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    }
  }
};
async function showPNG() {
  const v = curView, { str, W, H: Hm, cssFx } = mapSVG(20, true), W2 = Math.max(W, 900);
  const D = PNG_DECO[THEME_ID] || {}, rs = getComputedStyle(document.documentElement);
  const fTitle = rs.getPropertyValue('--title').trim() || 'Orbit, sans-serif', fLat = rs.getPropertyValue('--lat').trim() || 'Rajdhani, sans-serif', fBody = getComputedStyle(document.body).fontFamily || '"IBM Plex Sans KR", sans-serif';
  try { await Promise.all([`40px ${fTitle}`, `700 16px ${fLat}`, `18px ${fBody}`].map(f => document.fonts.load(f, MAP.name + '가0'))); } catch (e) { }
  /* 범례 자리를 먼저 재서 머리 높이를 정해요 (정당이 많으면 머리가 길어져요) */
  const T = totals(), sorted = [...store.parties].filter(p => T.t[p.id]).sort((a, b) => T.t[b.id] - T.t[a.id]);
  const mx = document.createElement('canvas').getContext('2d'); mx.font = `500 19px ${fBody}`;
  const leg = []; { let ly = 158, lx = 28; sorted.forEach(p => { const s = (isPres() && p.cand ? p.cand : p.name) + '  ' + T.t[p.id], w = mx.measureText(s).width + 52; if (lx + w > W2 - 260) { lx = 28; ly += 32; } leg.push([p, s, lx, ly]); lx += w; }); }
  const top = Math.max(230, (leg.length ? leg[leg.length - 1][3] : 158) + 34), H2 = Hm + top;
  const after = getComputedStyle(document.body, '::after'), scan = !D.top && after.display !== 'none' && /repeating-linear-gradient/.test(after.backgroundImage);
  const img = new Image();
  img.onload = () => {
    const K = 2;   // 고화질: 2배 크기로 저장
    const c = document.createElement('canvas'); c.width = W2 * K; c.height = H2 * K; const x = c.getContext('2d'); x.scale(K, K);
    x.imageSmoothingQuality = 'high';
    if (!(D.bg && D.bg(x, W2, H2, top))) {
      x.fillStyle = THEME.sea; x.fillRect(0, 0, W2, H2);
      x.strokeStyle = THEME.grid; x.lineWidth = 1;
      for (let gx = 0; gx < W2; gx += 22) { x.beginPath(); x.moveTo(gx + .5, 0); x.lineTo(gx + .5, H2); x.stroke(); }
      for (let gy = 0; gy < H2; gy += 22) { x.beginPath(); x.moveTo(0, gy + .5); x.lineTo(W2, gy + .5); x.stroke(); }
      x.fillStyle = THEME.head; x.fillRect(0, 0, W2, top); x.fillStyle = THEME.frame; x.fillRect(0, top - 3, W2, 3);
    }
    if (cssFx !== 'none') x.filter = cssFx;
    x.drawImage(img, (W2 - W) / 2, top, W, Hm); x.filter = 'none';
    if (D.glow) { x.shadowColor = D.glow; x.shadowBlur = 6; }
    x.fillStyle = THEME.frame; x.font = `700 16px ${fLat}`; x.fillText('EDITOR · ' + THEME.full, 28, 40);
    const title = (D.titlePre || '') + (v.key === 'all' ? MAP.name : MAP.name + ' — ' + v.name);
    x.font = `40px ${fTitle}`; if (D.title) D.title(x, title, 28, 88);
    x.fillStyle = THEME.text; x.fillText(title, 28, 88);
    if (D.cursor) { const tw = x.measureText(title).width; x.fillStyle = THEME.frame; x.fillRect(28 + tw + 6, 58, 20, 34); }
    x.fillStyle = THEME.mute; x.font = `18px ${fBody}`;
    x.fillText(isPres() ? `선거인단 ${T.all} · 당선선 ${T.maj} · 경합 ${T.toss}` : `총 ${T.all}석 · 과반 ${T.maj}석 · 경합 ${T.toss}석`, 28, 120);
    x.font = `500 19px ${fBody}`;
    leg.forEach(([p, s, lx, ly]) => { x.fillStyle = p.colors[0]; x.fillRect(lx, ly - 16, 20, 20); x.fillStyle = THEME.text; x.fillText(s, lx + 28, ly); });
    x.shadowBlur = 0;
    const S = hemiSeats(T.all), cols = seatColors(T), R = 95, cx = W2 - 130, cy = 200;
    S.forEach((s, i) => { x.beginPath(); x.arc(cx + s.x * R, cy + s.y * R, s.rad * R, 0, Math.PI * 2); x.fillStyle = cols[i] || TOSS; x.fill(); });
    x.fillStyle = THEME.text; x.font = `700 28px ${fLat}`; x.textAlign = 'center'; x.fillText(T.all, cx, cy - 8); x.textAlign = 'left';
    if (D.top) D.top(x, W2, H2); else if (scan) scanlines(x, W2, H2, .13);
    const url = c.toDataURL('image/png');
    $('#imgOut').src = url; $('#mExport').classList.remove('open'); $('#mImg').classList.add('open');
    $('#pngDl').onclick = () => { const a = document.createElement('a'); a.href = url; a.download = fileBase() + '.png'; document.body.appendChild(a); a.click(); a.remove(); };
  };
  // SVG를 2배 크기로 그려서 선과 글자가 또렷하게 나오게 해요
  const end = str.indexOf('>'), head = str.slice(0, end).replace(/\swidth="[^"]*"/, ` width="${W * 2}"`).replace(/\sheight="[^"]*"/, ` height="${Hm * 2}"`);
  const big = head + str.slice(end);
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(big);
}

function importJSON(file) {
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const j = JSON.parse(rd.result);
      const s = j.store || j;
      if (!s.parties || !s.seats) throw 0;
      const mapId = j.map || s.map;
      if (mapId && mapId !== MAP.id) { $('#exMsg').textContent = `다른 지도(${mapId})의 파일이에요. 그 지도를 열고 불러오세요.`; return; }
      store = normalize(s); save();
      $('#mExport').classList.remove('open');
      const v = (j.view && viewOf(j.view)) || curView;
      if (v !== curView) location.hash = MAP.id + '--' + v.key; else openView(v);
      toast('JSON을 불러왔어요.');
    } catch (e) { $('#exMsg').textContent = 'editor에서 저장한 JSON 파일이 아니에요.'; }
  };
  rd.readAsText(file);
}

function initExport() {
  $('#imgBtn').onclick = () => { $('#exMsg').textContent = ''; $('#mExport').classList.add('open'); };
  $('#exPng').onclick = showPNG;
  $('#exSvg').onclick = () => download(fileBase() + '.svg', '<?xml version="1.0" encoding="UTF-8"?>\n' + mapSVG().str, 'image/svg+xml');
  $('#exJson').onclick = () => download(fileBase() + '.json', JSON.stringify(resultJSON(), null, 1), 'application/json');
  $('#exSvgCopy').onclick = () => copyText(mapSVG().str, 'SVG');
  $('#exJsonCopy').onclick = () => copyText(JSON.stringify(resultJSON(), null, 1), 'JSON');
  $('#exLoad').onclick = () => $('#exFile').click();
  $('#exFile').onchange = e => { const f = e.target.files[0]; if (f) importJSON(f); e.target.value = ''; };
}
