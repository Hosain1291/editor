/* ---------- 연립정부 · 야당 · 여러 연합 만들기 ---------- */
(function () {
  const DEF = () => [{ id: 'g', name: '여당 연립' }, { id: 'o', name: '야당' }];
  let blocs = DEF(), role = {}, lead = {};
  const KEY = () => 'coal:' + (MAP && MAP.id || '');
  const popc = m => { let c = 0; while (m) { c += m & 1; m >>= 1; } return c; };
  const shortN = s => { const m = s.match(/\(([^)]+)\)\s*$/); return m ? m[1] : s; };
  function load() {
    blocs = DEF(); role = {}; lead = {};
    try {
      const s = JSON.parse(localStorage.getItem(KEY()) || 'null');
      if (s) {
        if (s.blocs) blocs = s.blocs; else { if (s.name) blocs[0].name = s.name; if (s.oname) blocs[1].name = s.oname; }
        role = s.role || {}; lead = s.lead || {};
      }
    } catch (e) {}
  }
  function save() { try { localStorage.setItem(KEY(), JSON.stringify({ blocs, role, lead })); } catch (e) {} }
  function render() {
    const T = totals(), all = T.all || 1, maj = T.maj;
    const ps = store.parties.filter(p => T.t[p.id] > 0).sort((a, b) => T.t[b.id] - T.t[a.id]);
    const bid = new Set(blocs.map(b => b.id));
    Object.keys(role).forEach(id => { if (!ps.find(p => p.id === id) || !bid.has(role[id])) delete role[id]; });
    const mem = b => ps.filter(p => role[p.id] === b.id), sum = a => a.reduce((s, p) => s + T.t[p.id], 0);
    blocs.forEach(b => { const m = mem(b); if (!m.find(p => p.id === lead[b.id])) lead[b.id] = m.length ? m[0].id : null; });
    const N = ps.filter(p => !role[p.id]), ns = sum(N);
    const pc = v => (v / all * 100).toFixed(1) + '%';
    const seg = p => `<i style="width:${T.t[p.id] / all * 100}%;background:${p.colors[0]}" title="${esc(p.name)} ${T.t[p.id]}"></i>`;
    // 막대: 첫 연합 왼쪽, 나머지 연합 오른쪽부터, 기타는 가운데
    const left = blocs[0] ? mem(blocs[0]) : [], rest = blocs.slice(1);
    const ls = sum(left), rs = rest.reduce((s, b) => s + sum(mem(b)), 0);
    $('#coBar').innerHTML = `<div class="cobar">${left.map(seg).join('')}<i class="gap" style="width:${(all - ls - rs) / all * 100}%">${N.map(p => `<i class="nt" style="width:${T.t[p.id] / Math.max(1, all - ls - rs) * 100}%;background:${p.colors[0]}"></i>`).join('')}</i>${rest.map(b => { const bs = sum(mem(b)); return bs ? `<span class="cob" style="width:${bs / all * 100}%">${mem(b).map(p => `<i style="width:${T.t[p.id] / bs * 100}%;background:${p.colors[0]}" title="${esc(p.name)} ${T.t[p.id]}"></i>`).join('')}</span>` : ''; }).reverse().join('')}<b class="maj" style="left:${maj / all * 100}%"></b></div>`;
    // 합계
    const sums = blocs.map(b => ({ b, s: sum(mem(b)) })), top = Math.max(0, ...sums.map(x => x.s));
    $('#coSum').innerHTML = sums.map(({ b, s }, i) => {
      const m = mem(b);
      return `<div><span class="g">${esc(b.name || '연합 ' + (i + 1))} <b>${s}</b>석 (${pc(s)})</span>` +
        (m.length ? (s >= maj ? `<span class="ok">과반 달성 · +${s - maj}</span>` : `<span class="no">과반까지 ${maj - s}석</span>`) : '<span class="o">정당 없음</span>') +
        (s && s === top && sums.filter(x => x.s === top).length === 1 ? '<span class="o">최대 연합</span>' : '') +
        `<span class="o">${m.map(p => esc(shortN(p.name))).join(' · ')}</span></div>`;
    }).join('') + `<div class="o">기타·무소속 ${ns}석${T.toss ? ` · 경합 ${T.toss}석` : ''} · 과반 ${maj} / ${T.all}</div>`;
    // 연합 목록
    const B = $('#coBlocs'); B.innerHTML = '';
    blocs.forEach((b, i) => {
      const r = document.createElement('div'); r.className = 'corow0';
      r.innerHTML = `<span class="bn">${i + 1}</span><input value="${esc(b.name)}" placeholder="연합 이름">` + (blocs.length > 1 ? '<button class="del" title="이 연합 지우기">삭제</button>' : '');
      r.querySelector('input').oninput = e => { b.name = e.target.value; save(); renderSumOnly(); };
      const d = r.querySelector('.del'); if (d) d.onclick = () => { blocs.splice(i, 1); save(); render(); };
      B.appendChild(r);
    });
    // 정당 목록
    const L = $('#coList'); L.innerHTML = '';
    ps.forEach(p => {
      const v = T.t[p.id], k = role[p.id] || '', r = document.createElement('div');
      const bi = blocs.findIndex(b => b.id === k), isLead = k && lead[k] === p.id;
      r.className = 'corow' + (bi === 0 ? ' r-g' : bi > 0 ? ' r-o' : '');
      r.innerHTML = `<span class="sw" style="background:${p.colors[0]}"></span><span class="n">${esc(p.name)}${isLead ? ' <em>주도</em>' : ''}</span><span class="v">${v}석</span><span class="pc">${pc(v)}</span>` +
        `<select class="cosel">${blocs.map((b, i) => `<option value="${b.id}"${b.id === k ? ' selected' : ''}>${esc(b.name || '연합 ' + (i + 1))}</option>`).join('')}<option value=""${!k ? ' selected' : ''}>기타</option></select>` +
        (k && !isLead ? '<button class="ld" title="이 연합의 주도 정당으로">주도</button>' : '<span class="ld-sp"></span>');
      r.querySelector('select').onchange = e => { const x = e.target.value; if (x) role[p.id] = x; else delete role[p.id]; save(); render(); };
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
      const mm = cand.filter((p, i) => c.m >> i & 1), b = document.createElement('button'); b.className = 'cowin';
      b.innerHTML = mm.map(p => `<span class="sw" style="background:${p.colors[0]}"></span>${esc(shortN(p.name))}`).join(' + ') + ` <b>${c.s}석</b>`;
      b.onclick = () => {
        if (blocs.length < 2) blocs.push({ id: 'b' + Date.now(), name: '야당' });
        role = {}; ps.forEach(p => role[p.id] = blocs[1].id); mm.forEach(p => role[p.id] = blocs[0].id);
        lead = { [blocs[0].id]: mm[0].id }; save(); render();
      };
      W.appendChild(b);
    });
    if (!res.length && ps.length) W.innerHTML = '<div class="j">칠해진 의석으로는 과반 연합을 만들 수 없어요.</div>';
  }
  let rt = null; function renderSumOnly() { clearTimeout(rt); rt = setTimeout(() => { const f = document.activeElement, i = [...$$('#coBlocs input')].indexOf(f), pos = f && f.selectionStart; render(); const n = $$('#coBlocs input')[i]; if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {} } }, 250); }
  function open() { load(); render(); $('#mCoal').classList.add('open'); }
  $('#coalBtn').onclick = open;
  $('#coAdd').onclick = () => { blocs.push({ id: 'b' + Date.now(), name: '연합 ' + (blocs.length + 1) }); save(); render(); };
  $('#coClear').onclick = () => { blocs = DEF(); role = {}; lead = {}; save(); render(); };
  $('#coRest').onclick = () => { const last = blocs[blocs.length - 1]; if (!last) return; store.parties.forEach(p => { if (!role[p.id]) role[p.id] = last.id; }); save(); render(); };
  window.openCoalition = open;
})();
