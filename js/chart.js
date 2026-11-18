/* 의회 구성 차트: 반원 의석 배치도와 막대 */

let chart = 'hemi';

function hemiSeats(N) {
  if (N <= 0) return [];
  const rIn = .4; let R = 1, rows;
  for (; R < 40; R++) {
    const sp = R === 1 ? .6 : (1 - rIn) / (R - 1); rows = []; let cap = 0;
    for (let i = 0; i < R; i++) { const r = R === 1 ? 1 : rIn + (1 - rIn) * i / (R - 1); const c = Math.floor(Math.PI * r / sp) + 1; rows.push({ r, c }); cap += c; }
    if (cap >= N) break;
  }
  const sp = R === 1 ? .6 : (1 - rIn) / (R - 1), capT = rows.reduce((s, x) => s + x.c, 0);
  rows.forEach(x => { x.n = Math.floor(N * x.c / capT); x.f = N * x.c / capT - x.n; });
  let left = N - rows.reduce((s, x) => s + x.n, 0);
  [...rows].sort((a, b) => b.f - a.f).forEach(x => { if (left > 0 && x.n < x.c) { x.n++; left--; } });
  const out = [];
  rows.forEach(x => { for (let k = 0; k < x.n; k++) { const a = x.n === 1 ? Math.PI / 2 : Math.PI * (1 - k / (x.n - 1)); out.push({ x: x.r * Math.cos(a), y: -x.r * Math.sin(a), a }); } });
  out.sort((p, q) => q.a - p.a || (p.x - q.x));
  const rad = Math.min(sp * .42, .05); out.forEach(s => s.rad = rad);
  return out;
}

function seatColors(T) {
  const cols = [];
  store.parties.forEach(p => { T.mg[p.id].forEach((v, i) => { for (let k = 0; k < v; k++) cols.push(p.colors[OPT.leans ? i : 0]); }); });
  for (let k = 0; k < T.toss; k++) cols.push(TOSS);
  return cols;
}


/* 웨스트민스터식 좌석: 왼쪽 끝 의장, 위쪽 여당석(최다 의석 정당), 아래쪽 야당석, 오른쪽 끝 중립석(경합) */
function westHTML(T) {
  const ps = [...store.parties].filter(p => T.t[p.id]).sort((a, b) => T.t[b.id] - T.t[a.id]);
  const spk = ps.find(p => /의장|Speaker/.test(p.name));
  const rest = ps.filter(p => p !== spk), gov = rest[0], opp = rest.slice(1);
  const dots = p => { const o = []; T.mg[p.id].forEach((v, i) => { for (let k = 0; k < v; k++) o.push(p.colors[OPT.leans ? i : 0]); }); return o; };
  const G = gov ? dots(gov) : [], O = [].concat(...opp.map(dots)), X = Array(T.toss).fill(TOSS), S = spk ? dots(spk) : [];
  const rows = Math.max(3, Math.min(8, Math.ceil(Math.sqrt(Math.max(G.length, O.length, 1) / 7))));
  const xc = Math.ceil(X.length / (rows * 2)), cols = Math.max(Math.ceil(G.length / rows), Math.ceil(O.length / rows), 1);
  const x0 = -0.88, x1 = 1.02 - (xc ? 0.06 : 0), cell = Math.min((x1 - x0) / (cols + (xc ? xc + 1 : 0)), 0.42 / rows), r = cell * 0.4;
  let out = '';
  const bench = (arr, yTop, down) => arr.forEach((col, i) => { const cx = x0 + cell * (Math.floor(i / rows) + .5), ri = i % rows;
    const cy = down ? yTop + cell * (rows - 1 - ri + .5) : yTop + cell * (ri + .5);
    out += `<circle cx="${cx.toFixed(4)}" cy="${cy.toFixed(4)}" r="${r.toFixed(4)}" fill="${col}"/>`; });
  const aisle = 0.22, yTopB = -0.52 - aisle / 2 - rows * cell, yBotB = -0.52 + aisle / 2;
  bench(G, yTopB, true); bench(O, yBotB, false);
  // 중립석(경합): 오른쪽 끝, 가운데 통로를 가로질러
  const cxs = x0 + cell * (cols + 1);
  X.forEach((col, i) => { const cx = cxs + cell * (Math.floor(i / (rows * 2)) + .5), cy = yTopB + cell * ((i % (rows * 2)) + .5) + ((i % (rows * 2)) >= rows ? aisle : 0);
    out += `<circle cx="${cx.toFixed(4)}" cy="${cy.toFixed(4)}" r="${r.toFixed(4)}" fill="${col}"/>`; });
  S.forEach((col, i) => out += `<circle cx="${(x0 - cell * (1.2 + i)).toFixed(4)}" cy="-0.52" r="${(r * 1.15).toFixed(4)}" fill="${col}"/>`);
  out += `<text x="${((x0 + cell * cols) / 2 + x0 / 2).toFixed(3)}" y="-0.49" text-anchor="middle" font-family="Rajdhani,sans-serif" font-weight="700" font-size=".1" fill="${THEME.text}">${T.all}석 · 과반 ${T.maj}</text>`;
  return out;
}

function renderChart(T) {
  renderSeatBar(T);
  const hs = $('#hemi'), bar = $('#bar'), pie = $('#pie');
  hs.style.display = (chart === 'hemi' || chart === 'west') ? 'block' : 'none'; bar.style.display = chart === 'bar' ? 'flex' : 'none'; pie.style.display = chart === 'pie' ? 'block' : 'none';
  if (chart === 'pie') {
    // 원 차트: 정당(강도별) → 경합 순서로 조각
    const segs = []; store.parties.forEach(p => T.mg[p.id].forEach((v, i) => { if (v) segs.push([v, p.colors[OPT.leans ? i : 0]]); }));
    if (T.toss) segs.push([T.toss, TOSS]);
    let a0 = -Math.PI / 2, out = '';
    const R = 1, r0 = .52;
    segs.forEach(([v, c]) => {
      const a1 = a0 + v / T.all * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0;
      if (v === T.all) out += `<circle r="${(R + r0) / 2}" fill="none" stroke="${c}" stroke-width="${R - r0}"/>`;
      else out += `<path d="M${Math.cos(a0) * R} ${Math.sin(a0) * R}A${R} ${R} 0 ${big} 1 ${Math.cos(a1) * R} ${Math.sin(a1) * R}L${Math.cos(a1) * r0} ${Math.sin(a1) * r0}A${r0} ${r0} 0 ${big} 0 ${Math.cos(a0) * r0} ${Math.sin(a0) * r0}Z" fill="${c}"/>`;
      a0 = a1;
    });
    const mA = -Math.PI / 2 + T.maj / T.all * Math.PI * 2;
    out += `<line x1="${Math.cos(mA) * (r0 - .05)}" y1="${Math.sin(mA) * (r0 - .05)}" x2="${Math.cos(mA) * (R + .05)}" y2="${Math.sin(mA) * (R + .05)}" stroke="${THEME.text}" stroke-width=".025"/>`;
    out += `<text y=".08" text-anchor="middle" font-family="Rajdhani,sans-serif" font-weight="700" font-size=".32" fill="${THEME.text}">${T.all}</text><text y=".26" text-anchor="middle" font-size=".1" fill="${THEME.mute}">과반 ${T.maj}</text>`;
    pie.innerHTML = out;
  }
  if (chart === 'west') { hs.innerHTML = westHTML(T); }
  else if (chart === 'hemi') {
    const S = hemiSeats(T.all), cols = seatColors(T);
    hs.innerHTML = S.map((s, i) => `<circle cx="${s.x.toFixed(4)}" cy="${s.y.toFixed(4)}" r="${s.rad.toFixed(4)}" fill="${cols[i] || TOSS}"/>`).join('') +
      `<text x="0" y="-.08" text-anchor="middle" font-family="Rajdhani,sans-serif" font-weight="700" font-size=".28" fill="${THEME.text}">${T.all}</text><text x="0" y=".02" text-anchor="middle" font-size=".085" fill="${THEME.mute}">과반 ${T.maj}</text>`;
  } else if (chart === 'bar') {
    bar.innerHTML = bgHTML(T).replace(/<i /g, '<div ').replace(/<\/i>/g, '</div>');
    const m = document.createElement('div'); m.className = 'maj'; m.style.left = (T.maj / T.all * 100) + '%'; bar.appendChild(m);
  }
  const lead = [...store.parties].sort((a, b) => T.t[b.id] - T.t[a.id])[0];
  $('#chartMsg').innerHTML = lead && T.t[lead.id] >= T.maj
    ? `<b style="color:${lead.colors[1]}">${esc(lead.name)}</b> 과반 달성 · 경합 ${T.toss}`
    : `과반 <b>${T.maj}</b>석 · 경합 <b>${T.toss}</b>석`;
}

/* 배틀그라운드 막대: 1위 정당은 왼쪽 끝부터, 2위 정당은 오른쪽 끝부터 채우고
   나머지 정당·경합은 가운데에 둬요. 강도는 바깥(확정) → 안쪽(경합우세) 순서. */
function bgSegments(T) {
  const ps = [...store.parties].filter(p => T.t[p.id]).sort((a, b) => T.t[b.id] - T.t[a.id]);
  const segs = [], lean = (p, rev) => { const o = [0, 1, 2, 3].map(i => [T.mg[p.id][i], p.colors[OPT.leans ? i : 0], p.name + ' ' + MARGINS[i]]).filter(x => x[0]); return rev ? o.reverse() : o; };
  if (ps[0]) segs.push(...lean(ps[0]));
  ps.slice(2).forEach(p => segs.push(...lean(p)));
  if (T.toss) segs.push([T.toss, TOSS, '경합·미정']);
  if (ps[1]) segs.push(...lean(ps[1], true));
  return { ps, segs };
}
function bgHTML(T) {
  const { segs } = bgSegments(T);
  return segs.map(([v, c, t]) => `<i style="width:${v / T.all * 100}%;background:${c}" title="${esc(t)} ${v}"></i>`).join('');
}
/* 지도 위 의석 막대 (YAPms처럼) */
function renderSeatBar(T) {
  const box = $('#seatBar'); if (!box) return;
  const on = OPT.seatBar !== false && !(typeof isPres === 'function' && isPres());
  box.hidden = !on; if (!on) return;
  const { ps } = bgSegments(T);
  const nm = p => esc(isPres() && p.cand ? p.cand : p.name);
  $('#sbTrack').innerHTML = bgHTML(T) + `<b class="sbMaj" style="left:${T.maj / T.all * 100}%"><span>과반 ${T.maj}</span></b>`;
  const L = ps[0], R = ps[1], mid = ps.slice(2);
  $('#sbLeg').innerHTML =
    `<span class="sbL">${L ? `<i style="background:${L.colors[0]}"></i>${nm(L)} <b class="num">${T.t[L.id]}</b>` : ''}</span>` +
    `<span class="sbM">${mid.map(p => `<span><i style="background:${p.colors[0]}"></i>${nm(p)} <b class="num">${T.t[p.id]}</b></span>`).join('')}<span class="sbToss"><i style="background:${TOSS}"></i>경합 <b class="num">${T.toss}</b></span></span>` +
    `<span class="sbR">${R ? `<b class="num">${T.t[R.id]}</b> ${nm(R)}<i style="background:${R.colors[0]}"></i>` : ''}</span>`;
}

function setChart(c) { chart = c; $$('.ctog button').forEach(x => x.classList.toggle('on', x.dataset.c === c)); }
function initChart() {
  $$('.ctog button').forEach(b => b.onclick = () => { setChart(b.dataset.c); renderParties(); });
}
