/* ---------- 연립정부 · 야당 만들기 ---------- */
(function () {
  let role = {};            // pid -> 'g'(여당 연립) | 'o'(야당) | 없음(기타)
  let lead = { g: null, o: null };
  const KEY = () => 'coal:' + (MAP && MAP.id || '');
  const popc = m => { let c = 0; while (m) { c += m & 1; m >>= 1; } return c; };
  const shortN = s => { const m = s.match(/\(([^)]+)\)\s*$/); return m ? m[1] : s; };
  function load() {
    role = {}; lead = { g: null, o: null }; $('#coName').value = ''; $('#coOppName').value = '';
    try { const s = JSON.parse(localStorage.getItem(KEY()) || 'null'); if (s) { role = s.role || {}; lead = s.lead || lead; $('#coName').value = s.name || ''; $('#coOppName').value = s.oname || ''; } } catch (e) {}
  }
  function save() { try { localStorage.setItem(KEY(), JSON.stringify({ role, lead, name: $('#coName').value, oname: $('#coOppName').value })); } catch (e) {} }
  function render() {
    const T = totals(), all = T.all || 1, maj = T.maj;
    const ps = store.parties.filter(p => T.t[p.id] > 0).sort((a, b) => T.t[b.id] - T.t[a.id]);
    Object.keys(role).forEach(id => { if (!ps.find(p => p.id === id)) delete role[id]; });
    const grp = k => ps.filter(p => role[p.id] === k), sum = a => a.reduce((s, p) => s + T.t[p.id], 0);
    ['g', 'o'].forEach(k => { const g = grp(k); if (!g.find(p => p.id === lead[k])) lead[k] = g.length ? g[0].id : null; });
    const G = grp('g'), O = grp('o'), N = ps.filter(p => !role[p.id]);
    const gs = sum(G), os = sum(O), ns = sum(N);
    const pc = v => (v / all * 100).toFixed(1) + '%';
    const seg = (p) => `<i style="width:${T.t[p.id] / all * 100}%;background:${p.colors[0]}" title="${esc(p.name)} ${T.t[p.id]}"></i>`;
    $('#coBar').innerHTML = `<div class="cobar">${G.map(seg).join('')}<i class="gap" style="width:${(all - gs - os) / all * 100}%">${N.map(p => `<i class="nt" style="width:${T.t[p.id] / Math.max(1, all - gs - os) * 100}%;background:${p.colors[0]}"></i>`).join('')}</i>${O.slice().reverse().map(seg).join('')}<b class="maj" style="left:${maj / all * 100}%"></b></div>`;
    const st = (v, nm) => v >= maj ? `<span class="ok">${nm} 과반 달성 · +${v - maj}</span>` : `<span class="no">${nm} 과반까지 ${maj - v}석</span>`;
    const gN = $('#coName').value || '여당 연립', oN = $('#coOppName').value || '야당';
    $('#coSum').innerHTML =
      `<div><span class="g">${esc(gN)} <b>${gs}</b>석 (${pc(gs)})</span>${st(gs, '')}</div>` +
      `<div><span class="g">${esc(oN)} <b>${os}</b>석 (${pc(os)})</span>${st(os, '')}${os > gs && gs ? '<span class="no">야당이 더 큼</span>' : ''}</div>` +
      `<div class="o">기타·무소속 ${ns}석${T.toss ? ` · 경합 ${T.toss}석` : ''} · 과반 ${maj} / ${T.all}</div>`;
    const L = $('#coList'); L.innerHTML = '';
    ps.forEach(p => {
      const v = T.t[p.id], r = document.createElement('div'), k = role[p.id] || 'n';
      r.className = 'corow r-' + k;
      const isLead = k !== 'n' && lead[k] === p.id;
      r.innerHTML = `<span class="sw" style="background:${p.colors[0]}"></span><span class="n">${esc(p.name)}${isLead ? ' <em>주도</em>' : ''}</span><span class="v">${v}석</span><span class="pc">${pc(v)}</span>` +
        `<span class="coseg"><button data-r="g"${k === 'g' ? ' class="on"' : ''}>여당</button><button data-r="o"${k === 'o' ? ' class="on"' : ''}>야당</button><button data-r="n"${k === 'n' ? ' class="on"' : ''}>기타</button></span>` +
        (k !== 'n' && !isLead ? '<button class="ld" title="이 진영의 주도 정당으로">주도</button>' : '<span class="ld-sp"></span>');
      r.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { const x = b.dataset.r; if (x === 'n') delete role[p.id]; else role[p.id] = x; save(); render(); });
      const lb = r.querySelector('.ld'); if (lb) lb.onclick = () => { lead[k] = p.id; save(); render(); };
      L.appendChild(r);
    });
    if (!ps.length) L.innerHTML = '<div class="j">아직 칠한 의석이 없어요. 지도를 먼저 칠해 주세요.</div>';
    // 최소 승리 연합
    const W = $('#coWin'); W.innerHTML = '';
    const cand = ps.slice(0, 12), n = cand.length, res = [];
    for (let m = 1; m < (1 << n); m++) {
      let s = 0; for (let i = 0; i < n; i++) if (m >> i & 1) s += T.t[cand[i].id];
      if (s < maj) continue;
      let minimal = true; for (let i = 0; i < n; i++) if ((m >> i & 1) && s - T.t[cand[i].id] >= maj) { minimal = false; break; }
      if (minimal) res.push({ m, s, k: popc(m) });
    }
    res.sort((a, b) => a.k - b.k || a.s - b.s);
    res.slice(0, 10).forEach(c => {
      const mem = cand.filter((p, i) => c.m >> i & 1), b = document.createElement('button'); b.className = 'cowin';
      b.innerHTML = mem.map(p => `<span class="sw" style="background:${p.colors[0]}"></span>${esc(shortN(p.name))}`).join(' + ') + ` <b>${c.s}석</b>`;
      b.onclick = () => { role = {}; ps.forEach(p => role[p.id] = 'o'); mem.forEach(p => role[p.id] = 'g'); lead = { g: mem[0].id, o: null }; save(); render(); };
      W.appendChild(b);
    });
    if (!res.length && ps.length) W.innerHTML = '<div class="j">칠해진 의석으로는 과반 연합을 만들 수 없어요.</div>';
  }
  function open() { load(); render(); $('#mCoal').classList.add('open'); }
  $('#coalBtn').onclick = open;
  $('#coName').oninput = $('#coOppName').oninput = () => { save(); render(); };
  $('#coClear').onclick = () => { role = {}; lead = { g: null, o: null }; save(); render(); };
  $('#coRest').onclick = () => { totals(); store.parties.forEach(p => { if (!role[p.id]) role[p.id] = 'o'; }); save(); render(); };
  window.openCoalition = open;
})();
