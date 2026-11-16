/* 테마: 라이트·다크(균명조 글꼴) / 올드페이퍼 (옛 종이, 나눔명조) / TNO (The New Order, 하늘색 홀로그램) / TFR (The Fire Rises, 네온 마젠타 신스웨이브) / PC통신 (파란 화면)
   head 에서 먼저 읽혀서 화면이 깜빡이지 않게 테마 CSS 를 바로 켜요. */
const THEMES = {
  tno: { name: 'TNO', full: 'THE NEW ORDER', desc: 'TNO의 선거지도를 만들어보세요', toss: '#1d3a40', ctx: '#0e2125', sea: '#081619', grid: '#0f262b', head: '#0a191d', frame: '#8fe3e8', text: '#eaffff', mute: '#6f9ea2', stroke: '#d86a78', ctxStroke: '#2c4f55', off: '#0a1a1d', dark: '#071215' },
  pc: { name: 'PC통신', full: 'PC통신', desc: 'PC통신 시절처럼 선거지도를 만들어보세요', toss: '#2a2ac8', ctx: '#000090', sea: '#000080', grid: '#0000a8', head: '#0000a8', frame: '#ffffff', text: '#ffffff', mute: '#c0c0c0', stroke: '#c0c0c0', ctxStroke: '#5555aa', off: '#000098', dark: '#000080', css: 'pcCss' },
  tfr: { name: 'TFR', full: 'THE FIRE RISES', desc: 'TFR의 선거지도를 만들어보세요', toss: '#2a1238', ctx: '#120620', sea: '#07010d', grid: '#2a0838', head: '#0d0416', frame: '#ff3ce6', text: '#ffffff', mute: '#b48ccc', stroke: '#d65cf0', ctxStroke: '#4a1e60', off: '#0e0518', dark: '#05000a', css: 'tfrCss' },
  win31: {"name": "윈도우 3.1", "full": "WINDOWS 3.1", "desc": "Windows 3.1 시절처럼 선거지도를 만들어보세요", "toss": "#d8d8d8", "ctx": "#eeeeee", "sea": "#ffffff", "grid": "#e8e8e8", "head": "#ffffff", "frame": "#000080", "text": "#000000", "mute": "#555555", "stroke": "#808080", "ctxStroke": "#c0c0c0", "off": "#f0f0f0", "dark": "#000000", "css": "win31Css", "btn": "Win 3.1"},
  win95: {"name": "윈도우 95", "full": "WINDOWS 95", "desc": "Windows 95 시절처럼 선거지도를 만들어보세요", "toss": "#d4d0c8", "ctx": "#e8e8e8", "sea": "#ffffff", "grid": "#ececec", "head": "#c0c0c0", "frame": "#000080", "text": "#000000", "mute": "#404040", "stroke": "#808080", "ctxStroke": "#c0c0c0", "off": "#ececec", "dark": "#000000", "css": "win95Css", "btn": "Win 95"},
  tv80: {"name": "선거방송 1980", "full": "ELECTION NIGHT 1980", "desc": "1980년대 개표방송 스튜디오처럼 선거지도를 칠해보세요", "toss": "#d8c18a", "ctx": "#8a7c5a", "sea": "#050508", "grid": "#0b0d16", "head": "#141725", "frame": "#e9d7a8", "text": "#f2ead6", "mute": "#a59d86", "stroke": "#2a2116", "ctxStroke": "#5a4f38", "off": "#6e6450", "dark": "#0b0d16", "css": "tv80Css", "btn": "방송 1980"},
  tv00: {"name": "선거방송 2000", "full": "ELECTION NIGHT 2000", "desc": "2000년 개표방송 스튜디오처럼 선거지도를 칠해보세요", "toss": "#2b3068", "ctx": "#1c1f4c", "sea": "#14104a", "grid": "#1a1650", "head": "#1a1650", "frame": "#ffffff", "text": "#ffffff", "mute": "#b9bde8", "stroke": "#ffffff", "ctxStroke": "#5b62c4", "off": "#1c1f4c", "dark": "#120d38", "css": "tv00Css", "btn": "방송 2000"},
  td: {"name": "3D 지도", "full": "THE NEW ORDER · 3D", "desc": "지도를 비스듬히 눕혀 입체로 칠해보세요", "toss": "#1d3a40", "ctx": "#0e2125", "sea": "#081619", "grid": "#0f262b", "head": "#0a191d", "frame": "#8fe3e8", "text": "#eaffff", "mute": "#6f9ea2", "stroke": "#d86a78", "ctxStroke": "#2c4f55", "off": "#0a1a1d", "dark": "#071215", "css": "tdCss", "btn": "3D"},
  tdb: {"name": "3D 블록", "full": "THE NEW ORDER · 3D BLOCK", "desc": "선거구가 블록처럼 솟은 입체 지도를 칠해보세요", "toss": "#1d3a40", "ctx": "#0e2125", "sea": "#081619", "grid": "#0f262b", "head": "#0a191d", "frame": "#8fe3e8", "text": "#eaffff", "mute": "#6f9ea2", "stroke": "#d86a78", "ctxStroke": "#2c4f55", "off": "#0a1a1d", "dark": "#071215", "css": "tdbCss", "btn": "3D 블록"},
  tdd: {"name": "3D 다크", "full": "DARK · 3D", "desc": "어두운 화면에서 입체 지도를 칠해보세요", "toss": "#2a2a2e", "ctx": "#19191c", "sea": "#121214", "grid": "#1c1c1f", "head": "#18181a", "frame": "#ededed", "text": "#ededed", "mute": "#8a8a90", "stroke": "#55555c", "ctxStroke": "#2e2e33", "off": "#1b1b1e", "dark": "#0f0f10", "css": "darkCss tddCss", "btn": "3D 다크"},
  tdw: {"name": "3D 화이트", "full": "WHITE · 3D", "desc": "밝은 화면에서 입체 지도를 칠해보세요", "toss": "#e3e1dc", "ctx": "#efede8", "sea": "#ffffff", "grid": "#f3f2ef", "head": "#ffffff", "frame": "#1a1a1a", "text": "#1a1a1a", "mute": "#777777", "stroke": "#9a968e", "ctxStroke": "#d6d3cc", "off": "#f3f2ef", "dark": "#1a1a1a", "css": "lightCss tdwCss", "btn": "3D 화이트"},
  px8: {"name": "픽셀 8", "full": "PIXEL MAP · 8PX", "desc": "8픽셀 네모로 선거지도를 칠해보세요", "toss": "#3b4a6b", "ctx": "#20283b", "sea": "#0d1020", "grid": "#151a2e", "head": "#151a2e", "frame": "#f4f4f4", "text": "#f4f4f4", "mute": "#9aa3c0", "stroke": "#0d1020", "ctxStroke": "#2b3450", "off": "#181d33", "dark": "#0d1020", "css": "darkCss pxCss", "btn": "픽셀 8", "px": 8},
  px16: {"name": "픽셀 16", "full": "PIXEL MAP · 16PX", "desc": "16픽셀 네모로 선거지도를 칠해보세요", "toss": "#3b4a6b", "ctx": "#20283b", "sea": "#0d1020", "grid": "#151a2e", "head": "#151a2e", "frame": "#f4f4f4", "text": "#f4f4f4", "mute": "#9aa3c0", "stroke": "#0d1020", "ctxStroke": "#2b3450", "off": "#181d33", "dark": "#0d1020", "css": "darkCss pxCss", "btn": "픽셀 16", "px": 16},
  px24: {"name": "픽셀 24", "full": "PIXEL MAP · 24PX", "desc": "24픽셀 네모로 선거지도를 칠해보세요", "toss": "#3b4a6b", "ctx": "#20283b", "sea": "#0d1020", "grid": "#151a2e", "head": "#151a2e", "frame": "#f4f4f4", "text": "#f4f4f4", "mute": "#9aa3c0", "stroke": "#0d1020", "ctxStroke": "#2b3450", "off": "#181d33", "dark": "#0d1020", "css": "darkCss pxCss", "btn": "픽셀 24", "px": 24},
  light: {"name": "라이트", "full": "LIGHT", "desc": "깔끔한 밝은 화면에서 선거지도를 만들어보세요", "toss": "#e3e1dc", "ctx": "#efede8", "sea": "#ffffff", "grid": "#f3f2ef", "head": "#ffffff", "frame": "#1a1a1a", "text": "#1a1a1a", "mute": "#777777", "stroke": "#9a968e", "ctxStroke": "#d6d3cc", "off": "#f3f2ef", "dark": "#1a1a1a", "css": "lightCss"},
  dark: {"name": "다크", "full": "DARK", "desc": "차분한 어두운 화면에서 선거지도를 만들어보세요", "toss": "#2a2a2e", "ctx": "#19191c", "sea": "#121214", "grid": "#1c1c1f", "head": "#18181a", "frame": "#ededed", "text": "#ededed", "mute": "#8a8a90", "stroke": "#55555c", "ctxStroke": "#2e2e33", "off": "#1b1b1e", "dark": "#0f0f10", "css": "darkCss"},
  paper: {"name": "올드페이퍼", "full": "OLD PAPER", "desc": "누렇게 바랜 옛 종이 위에 선거지도를 그려보세요", "toss": "#d9c9a3", "ctx": "#e4d6b6", "sea": "#e9dcbd", "grid": "#e2d3b0", "head": "#efe4cc", "frame": "#3b2a1a", "text": "#3b2a1a", "mute": "#7a6548", "stroke": "#8c7556", "ctxStroke": "#c9b48c", "off": "#ece0c3", "dark": "#3b2a1a", "css": "paperCss"},
};
let THEME_ID = 'tno';
try { THEME_ID = localStorage.getItem('tnomap:theme') || 'tno'; } catch (e) { }
if (!THEMES[THEME_ID]) THEME_ID = 'tno';
let THEME = THEMES[THEME_ID];
function setThemeCss() {
  document.documentElement.dataset.theme = THEME_ID;
  const on = new Set((THEMES[THEME_ID].css || '').split(' ').filter(Boolean));
  for (const k in THEMES) for (const c of (THEMES[k].css || '').split(' ').filter(Boolean)) { const l = document.getElementById(c); if (l) l.media = on.has(c) ? 'all' : 'not all'; }
  if (typeof pxUpdate === 'function') pxUpdate();
}
setThemeCss();

/* 테마 글자 바꾸기 (메뉴 설명, 지도 꼬리표) */
function themeTexts() {
  const d = document.getElementById('menuDesc'); if (d) d.textContent = THEME.desc;
  const l = document.getElementById('menuLabel'); if (l) l.textContent = THEME.full + ' · 선거 지도 시뮬레이터';
  document.querySelectorAll('.themeSeg').forEach(seg => { seg.innerHTML = themeButtons(seg.classList.contains('flat')); seg.dataset.built = 1; });
}
/* 테마 고르기: 필터 창처럼 단추 하나 → 펼쳐지는 목록 */
function themeButtons(flat) {
  const sw = t => `<i class="tsw" style="background:linear-gradient(135deg,${t.sea} 0 33%,${t.toss} 33% 66%,${t.frame} 66%)"></i>`;
  const list = Object.entries(THEMES).map(([k, t]) => `<button type="button" data-theme="${k}" class="${k === THEME_ID ? 'on' : ''}">${sw(t)}<span>${t.name}</span></button>`).join('');
  if (flat) return `<div class="tlist">${list}</div>`;
  return `<button type="button" class="tdrop">${sw(THEME)}<b>${THEME.name}</b><span class="car">▾</span></button>`
    + `<div class="tpop win"><div class="tb"><span class="t">화면 테마</span><span class="ctl"><i class="tclose" style="cursor:pointer">✕</i></span></div><div class="tlist">`
    + Object.entries(THEMES).map(([k, t]) => `<button type="button" data-theme="${k}" class="${k === THEME_ID ? 'on' : ''}">${sw(t)}<span>${t.name}</span></button>`).join('') + `</div></div>`;
}
function applyTheme(id) {
  if (!THEMES[id]) return;
  THEME_ID = id; THEME = THEMES[id];
  try { localStorage.setItem('tnomap:theme', id); } catch (e) { }
  setThemeCss();
  TOSS = THEME.toss; CTX_FILL = THEME.ctx;
  if (typeof STROKE_COLORS !== 'undefined') { STROKE_COLORS.pink = THEME.stroke; STROKE_COLORS.bg = THEME.sea; STROKE_COLORS.cyan = THEME.frame; }
  themeTexts();
  if (typeof applyOptions === 'function') applyOptions();
  if (typeof MAP !== 'undefined' && MAP && typeof M !== 'undefined' && M) { paintAll(); refresh(); if (typeof updTag === 'function') updTag(); const t = document.getElementById('mapTag'); if (t) t.textContent = THEME.full + ' · ' + (MAP.tag || MAP.name); }
  if (typeof renderOptions === 'function' && document.getElementById('mOpt') && document.getElementById('mOpt').classList.contains('open')) renderOptions();
}
document.addEventListener('click', e => {
  const seg = e.target.closest('.themeSeg');
  document.querySelectorAll('.themeSeg.open').forEach(s => { if (s !== seg) s.classList.remove('open'); });
  if (!seg) return;
  if (e.target.closest('.tdrop')) { seg.classList.toggle('open'); return; }
  if (e.target.closest('.tclose')) { seg.classList.remove('open'); return; }
  const b = e.target.closest('.tlist button'); if (b) { applyTheme(b.dataset.theme); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.themeSeg.open').forEach(s => s.classList.remove('open')); });
document.addEventListener('DOMContentLoaded', themeTexts);

/* 픽셀 지도: 지금 보이는 지도를 N픽셀 칸으로 다시 그려요 (칸마다 한 색, 경계는 어두운 칸). 클릭은 원래 도형이 받아요 */
var pxT = 0, pxSeq = 0;
function pxUpdate() {
  const t = THEMES[THEME_ID], on = !!(t && t.px);
  if (!document.body) { document.addEventListener('DOMContentLoaded', pxUpdate, { once: true }); return; }
  document.body.classList.toggle('pxon', on);
  const im = document.getElementById('pxImg');
  if (!on) { if (im) im.remove(); return; }
  clearTimeout(pxT); pxT = setTimeout(pxRender, 30);
}
function pxRender() {
  const t = THEMES[THEME_ID]; if (!t || !t.px) return;
  const svg = document.getElementById('map'), g = document.getElementById('g');
  if (!svg || !g || !g.firstChild || !svg.clientWidth) return;
  const n = t.px, W = svg.clientWidth, H = svg.clientHeight, m = svg.getScreenCTM(); if (!m) return;
  const r = svg.getBoundingClientRect(), inv = m.inverse(), P = (x, y) => { const q = svg.createSVGPoint(); q.x = x; q.y = y; return q.matrixTransform(inv); };
  const a = P(r.left, r.top), b = P(r.left + W, r.top + H);
  const cw = Math.max(1, Math.ceil(W / n)), ch = Math.max(1, Math.ceil(H / n));
  const vw = (b.x - a.x) * cw * n / W, vh = (b.y - a.y) * ch * n / H;
  const defs = document.getElementById('defs');
  const src = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${a.x} ${a.y} ${vw} ${vh}" width="${cw}" height="${ch}" preserveAspectRatio="none"><style>path{stroke:none!important}</style><defs>${defs ? defs.innerHTML : ''}</defs><g shape-rendering="crispEdges">${g.innerHTML}</g></svg>`;
  /* 선거구마다 다른 색으로 한 번 더 그려서 경계를 찾아요 */
  let k = 0, idg = '';
  for (const el of g.children) { k++; const d = el.getAttribute('d'); if (!d) continue; const tr = el.getAttribute('transform'); idg += `<path d="${d}"${tr ? ` transform="${tr}"` : ''} fill="#${(k * 2654435761 % 16777215).toString(16).padStart(6, '0')}"/>`; }
  const src2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${a.x} ${a.y} ${vw} ${vh}" width="${cw}" height="${ch}" preserveAspectRatio="none"><g shape-rendering="crispEdges" stroke="none">${idg}</g></svg>`;
  const seq = ++pxSeq, img = new Image(), img2 = new Image(); let got = 0;
  const draw = (im) => { const c = document.createElement('canvas'); c.width = cw; c.height = ch; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(im, 0, 0, cw, ch); return [c, x, x.getImageData(0, 0, cw, ch).data]; };
  img.onload = img2.onload = () => { if (++got < 2) return;
    if (seq !== pxSeq) return;
    const [c, x, d] = draw(img), q = draw(img2)[2], o = new Uint8ClampedArray(d);
    const same = (i, j) => q[i] === q[j] && q[i + 1] === q[j + 1] && q[i + 2] === q[j + 2] && (d[i + 3] > 127) === (d[j + 3] > 127);
    for (let yy = 0; yy < ch; yy++) for (let xx = 0; xx < cw; xx++) {
      const i = (yy * cw + xx) * 4; if (d[i + 3] < 128) { o[i + 3] = 0; continue; }
      o[i + 3] = 255;
      const edge = (xx + 1 < cw && !same(i, i + 4)) || (yy + 1 < ch && !same(i, i + cw * 4)) || (xx > 0 && d[i - 1] < 128) || (yy > 0 && d[i - cw * 4 + 3] < 128);
      if (edge) { o[i] = d[i] * .55; o[i + 1] = d[i + 1] * .55; o[i + 2] = d[i + 2] * .55; }
    }
    x.putImageData(new ImageData(o, cw, ch), 0, 0);
    let el = document.getElementById('pxImg');
    if (!el) { el = document.createElementNS('http://www.w3.org/2000/svg', 'image'); el.id = 'pxImg'; el.setAttribute('preserveAspectRatio', 'none'); el.style.pointerEvents = 'none'; el.style.imageRendering = 'pixelated'; }
    const lab = document.getElementById('labels'); if (el.nextSibling !== lab) svg.insertBefore(el, lab);
    el.setAttribute('x', a.x); el.setAttribute('y', a.y); el.setAttribute('width', vw); el.setAttribute('height', vh);
    el.setAttribute('href', c.toDataURL());
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src); img2.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src2);
}
window.addEventListener('resize', () => pxUpdate());
