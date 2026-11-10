/* 시작: 지도 목록 불러오기, 메뉴(지도 선택) 그리기, 주소(#)에 따라 화면 바꾸기
   주소 예: #tno-japan--all  (지도 id -- 보기 key) */

function viewProgress(entry, v) {
  const meta = entry.meta;
  let s = null; try { s = JSON.parse(localStorage.getItem(storeKey(meta.id))); } catch (e) { }
  if (!s && meta.id === 'tno-japan') { try { s = JSON.parse(localStorage.getItem('tno-japan-map-v2')); } catch (e) { } }
  if (entry.full === false) {   // 가벼운 목록: 미리 계산한 선거구 수·의석수 사용
    const [n, tot] = (meta.vstat && meta.vstat[v.key]) || [0, 0];
    const d = (s && s.maps && s.maps[v.key] && s.maps[v.key].d) || {}; let asg = 0;
    for (const id in d) { const x = d[id]; if (!x || x.off) continue; const S = (s.seats && s.seats[id]) || 1; asg += Math.min(S, Object.values(x.a || {}).reduce((a, b) => a + b, 0)); }
    return { n, tot, asg: Math.min(asg, tot) };
  }
  const seats = id => (s && s.seats && s.seats[id] != null) ? s.seats[id] : (meta.seats && meta.seats[id] != null) ? meta.seats[id] : (meta.defaultSeats || 1);
  const d = (s && s.maps && s.maps[v.key] && s.maps[v.key].d) || {};
  let tot = 0, asg = 0, n = 0;
  for (const id in meta.names) {
    // 지역 정보는 SVG에만 있어서, 메뉴에서는 map.json의 regionOf(있으면)로 셉니다
    const r = meta.regionOf ? meta.regionOf[id] : null;
    if (r && !v.regions.includes(r)) continue;
    n++; const S = seats(id); tot += S; const x = d[id];
    if (x && !x.off) asg += Math.min(S, Object.values(x.a || {}).reduce((a, b) => a + b, 0));
  }
  return { n, tot, asg };
}

function renderMenu() {
  const wrap = $('#mapGroups'); wrap.innerHTML = '';
  // menuCountry(나라) → menuGroup(연도별 묶음) 순서로 모아요
  const groups = {}, order = [], countries = {}, corder = [];
  MAP_LIST.forEach(entry => { const g = entry.meta.menuGroup || entry.meta.id, k = entry.meta.menuCountry || g;
    if (!groups[g]) { groups[g] = []; if (!countries[k]) { countries[k] = []; corder.push(k); } countries[k].push(g); } groups[g].push(entry); });
  const thumbOf = entry => {
    if (entry.custom && !entry.thumb) entry.thumb = URL.createObjectURL(new Blob([entry.svgText], { type: 'image/svg+xml' }));
    return entry.custom ? entry.thumb : (entry.folder ? `maps/${entry.folder}/` : '') + (entry.meta.thumb || entry.meta.svg || 'map.svg') + (entry.v ? '?v=' + entry.v : '');
  };
  const thumbSVG = (entry, v) => { const [bx, by, bw, bh] = v.box, p = Math.max(bw, bh) * .06;
    return `<svg class="thumb" viewBox="${bx - p} ${by - p} ${bw + 2 * p} ${bh + 2 * p}" preserveAspectRatio="xMidYMid meet"><image href="${thumbOf(entry)}" width="${entry.meta.width}" height="${entry.meta.height}"/></svg>`; };
  const metaLine = (meta, v, n, tot) => [v.sub ? esc(v.sub) : '', meta.labelName ? '' : (meta.layout === 'presidential' ? `주 ${n} · 선거인단 ${tot}` : `선거구 ${n} · ${tot}석`)].filter(Boolean).join(' · ');
  corder.forEach(ckey => { const gl = countries[ckey], m0 = groups[gl[0]][0].meta, isC = !!m0.menuCountry;
    const sec = document.createElement('div'); sec.className = 'mgroup';
    sec.innerHTML = `<div class="msec"><h2>${esc(isC ? ckey : (m0.menuGroup || m0.name))}</h2><span class="label">${esc(isC ? '지도와 연도를 고르세요' : (m0.menuLabel || (m0.menuGroup ? '연도를 고르세요' : (m0.subtitle || ''))))}</span></div><div class="cards"></div>`;
    wrap.appendChild(sec);
    const box = sec.querySelector('.cards');
  gl.forEach(gkey => {
    const list = groups[gkey], meta0 = list[0].meta;
    // YAPms처럼: 모양틀 하나 + 텍스트 링크로 고르기 (연도별 지도 묶음, 또는 주·지역 보기가 여러 개인 지도)
    const linkCard = (title, items, cur) => {
      const c = document.createElement('div'); c.className = 'card win ycard big';
      const yl = items.map((it, i) => `<a href="#${it.e.meta.id}--${it.v.key}" data-i="${i}" class="ylink${viewProgress(it.e, it.v).asg ? ' wip' : ''}" title="${esc(it.e.meta.name)}">${esc(it.label)}</a>`).join('');
      c.innerHTML = `<div class="tb"><span class="t">${esc(title)}</span><span class="ctl"><i>—</i><i>❐</i><i>✕</i></span></div><div class="ythumb"></div><div class="cb"><div class="meta ymeta"></div><div class="ylinks">${yl}</div></div>`;
      const show = i => { const { e, v, label } = items[i], pr = viewProgress(e, v), ml = metaLine(e.meta, v, pr.n, pr.tot); cur = i;
        c.querySelector('.ythumb').innerHTML = thumbSVG(e, v);
        c.querySelector('.ymeta').innerHTML = `<b>${esc(e.meta.name)}</b> · ${esc(label)}${ml ? ' · ' + ml : ''}${pr.asg ? ' · <span class="wipt">진행 중</span>' : ''}`;
        c.querySelectorAll('.ylink').forEach(a => a.classList.toggle('cur', +a.dataset.i === i)); };
      c.querySelectorAll('.ylink').forEach(a => { a.onmouseenter = a.onfocus = () => show(+a.dataset.i); });
      c.querySelector('.ythumb').onclick = () => { const it = items[cur]; location.hash = it.e.meta.id + '--' + it.v.key; };
      show(cur); box.appendChild(c);
    };
    if (meta0.menuGroup && list.length > 1 && list.every(e => e.meta.views.length === 1)) {
      linkCard(meta0.menuGroup, list.map(e => ({ e, v: e.meta.views[0], label: e.meta.cardName || e.meta.views[0].name })), list.length - 1); return;
    }
    list.forEach(entry => { const meta = entry.meta;
      if (meta.linkViews && meta.views.length > 1) { linkCard(meta.name, meta.views.map(v => ({ e: entry, v, label: v.name })), 0); return; }
      meta.views.forEach(v => {
        const { n, tot, asg } = viewProgress(entry, v);
        const c = document.createElement('button'); c.className = 'card win' + (v.big ? ' big' : '');
        c.innerHTML = `<div class="tb"><span class="t">${esc(meta.cardName && meta.views.length === 1 ? meta.cardName : v.name)}</span><span class="ctl"><i>—</i><i>❐</i><i>✕</i></span></div>` +
          thumbSVG(entry, v) + (asg ? `<span class="tag">진행 중</span>` : '') +
          `<div class="cb"><div class="meta">${metaLine(meta, v, n, tot)}</div><div class="prog"><i style="width:${tot ? asg / tot * 100 : 0}%"></i></div></div>`;
        c.onclick = e => { if (e.target.closest('.cdel')) { deleteCustom(meta.id); return; } location.hash = meta.id + '--' + v.key; };
        if (entry.custom) c.querySelector('.ctl').innerHTML = '<i class="cdel" title="지우기">✕</i>';
        box.appendChild(c);
      });
    });
  });
  });
  // 내 지도 올리기 (YAPms의 Custom)
  const up = document.createElement('div'); up.className = 'mgroup';
  up.innerHTML = `<div class="msec"><h2>내 지도</h2><span class="label">Custom map · SVG · GeoJSON · SHP</span></div><div class="cards"><button class="card win upcard"><div class="tb"><span class="t">지도 파일 올리기</span></div><div class="upin"><b>＋</b><span>SVG · GeoJSON · Shapefile을 올리면 바로 칠할 수 있어요.<br>Shapefile은 .zip 하나, 또는 .shp와 .dbf를 함께 고르세요.<br>이 브라우저에 저장돼요.</span></div></button></div>`;
  up.querySelector('.upcard').onclick = () => $('#cuFile').click();
  wrap.appendChild(up);
}

function showMenu() {
  curView = null; curHash = null; hideTip();
  $('#editor').classList.remove('open'); $('#menu').style.display = 'block';
  renderMenu(); scrollTo(0, 0);
}

/* 지도에서 나갈 때: 물어보기 / 항상 초기화 / 항상 저장 (옵션) */
let curHash = null, leaveOK = false, skipRoute = false;
const hasWork = () => M && Object.values(M.d || {}).some(x => x.off || x.lock || Object.values(x.a || {}).some(v => v > 0));
function resetCurrentView() { if (!M) return; M.d = {}; save(); }
function leaveTo(target) {
  leaveOK = true;
  if (location.hash.replace('#', '') === target) { route(); } else location.hash = target;
}
function askLeave(target) {
  $('#lvTarget').value = target; $('#lvRemember').checked = false;
  $('#lvInfo').textContent = `'${curView.key === 'all' ? MAP.name : MAP.name + ' · ' + curView.name}'에 칠한 내용이 있어요.`;
  $('#mLeave').classList.add('open');
}
function initLeave() {
  const go = mode => {
    if ($('#lvRemember').checked) { OPT.leave = mode; saveOpt(); }
    if (mode === 'reset') resetCurrentView();
    $('#mLeave').classList.remove('open'); leaveTo($('#lvTarget').value);
  };
  $('#lvReset').onclick = () => go('reset');
  $('#lvKeep').onclick = () => go('keep');
}

async function route() {
  if (skipRoute) { skipRoute = false; return; }
  let h = location.hash.replace('#', '');
  // 편집 중인 지도에서 다른 곳으로 나갈 때
  if (curView && curHash && h !== curHash && !leaveOK && hasWork()) {
    const mode = OPT.leave || 'ask';
    if (mode === 'ask') { skipRoute = true; location.replace('#' + curHash); askLeave(h); return; }
    if (mode === 'reset') resetCurrentView();
  }
  leaveOK = false;
  if (h.startsWith('map-')) { location.replace('#tno-japan--' + h.slice(4)); return; } // 예전 주소
  const i = h.indexOf('--');
  if (i < 0) return showMenu();
  const mapId = h.slice(0, i), key = h.slice(i + 2);
  if (!mapEntry(mapId)) return showMenu();
  if (!MAP || MAP.id !== mapId) {
    $('#loading').style.display = 'flex';
    await useMap(mapId); loadStore(); buildMap();
    $('#loading').style.display = 'none';
  }
  const v = viewOf(key); if (!v) return showMenu();
  openView(v); curHash = h;
}

(async function init() {
  initModals(); initEditor(); initChart(); initCode(); initExport(); initPres(); initMobile(); initColorPicker(); initOptions(); initTools(); initPresent(); initCustom(); initPartyManager(); initLeave();
  $('#back').onclick = () => { location.hash = 'menu'; };
  try { await loadMapList(); await loadCustomMaps(); }
  catch (e) { $('#mapGroups').innerHTML = '<div class="hint">지도 목록(maps/index.json)을 불러오지 못했어요.</div>'; return; }
  addEventListener('hashchange', route);
  route();
})();
