/* 테마: 라이트·다크(균명조 글꼴) / 스케치북 (연필·손글씨) / CMYK (인쇄소) / 터미널 (옛날 컴퓨터 녹색 화면) / TNO (The New Order, 하늘색 홀로그램) / TFR (The Fire Rises, 네온 마젠타 신스웨이브) / PC통신 (파란 화면)
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
  tdb: {"name": "키캡", "full": "THE NEW ORDER · KEYCAP", "desc": "선거구가 키보드 키캡처럼 솟은 입체 지도를 칠해보세요", "toss": "#1d3a40", "ctx": "#0e2125", "sea": "#081619", "grid": "#0f262b", "head": "#0a191d", "frame": "#8fe3e8", "text": "#eaffff", "mute": "#6f9ea2", "stroke": "#d86a78", "ctxStroke": "#2c4f55", "off": "#0a1a1d", "dark": "#071215", "css": "tdbCss", "btn": "키캡"},
  tdd: {"name": "3D 다크", "full": "DARK · 3D", "desc": "어두운 화면에서 입체 지도를 칠해보세요", "toss": "#2a2a2e", "ctx": "#19191c", "sea": "#121214", "grid": "#1c1c1f", "head": "#18181a", "frame": "#ededed", "text": "#ededed", "mute": "#8a8a90", "stroke": "#55555c", "ctxStroke": "#2e2e33", "off": "#1b1b1e", "dark": "#0f0f10", "css": "darkCss tddCss", "btn": "3D 다크"},
  tdw: {"name": "3D 화이트", "full": "WHITE · 3D", "desc": "밝은 화면에서 입체 지도를 칠해보세요", "toss": "#e3e1dc", "ctx": "#efede8", "sea": "#ffffff", "grid": "#f3f2ef", "head": "#ffffff", "frame": "#1a1a1a", "text": "#1a1a1a", "mute": "#777777", "stroke": "#9a968e", "ctxStroke": "#d6d3cc", "off": "#f3f2ef", "dark": "#1a1a1a", "css": "lightCss tdwCss", "btn": "3D 화이트"},
  tdbd: {"name": "키캡 다크", "full": "DARK · KEYCAP", "desc": "어두운 화면에서 키캡 입체 지도를 칠해보세요", "toss": "#2a2a2e", "ctx": "#19191c", "sea": "#121214", "grid": "#1c1c1f", "head": "#18181a", "frame": "#ededed", "text": "#ededed", "mute": "#8a8a90", "stroke": "#55555c", "ctxStroke": "#2e2e33", "off": "#1b1b1e", "dark": "#0f0f10", "css": "darkCss tdbdCss", "btn": "키캡 다크"},
  tdbw: {"name": "키캡 화이트", "full": "WHITE · KEYCAP", "desc": "밝은 화면에서 키캡 입체 지도를 칠해보세요", "toss": "#e3e1dc", "ctx": "#efede8", "sea": "#ffffff", "grid": "#f3f2ef", "head": "#ffffff", "frame": "#1a1a1a", "text": "#1a1a1a", "mute": "#777777", "stroke": "#9a968e", "ctxStroke": "#d6d3cc", "off": "#f3f2ef", "dark": "#1a1a1a", "css": "lightCss tdbwCss", "btn": "키캡 화이트"},
  light: {"name": "라이트", "full": "LIGHT", "desc": "깔끔한 밝은 화면에서 선거지도를 만들어보세요", "toss": "#e3e1dc", "ctx": "#efede8", "sea": "#ffffff", "grid": "#f3f2ef", "head": "#ffffff", "frame": "#1a1a1a", "text": "#1a1a1a", "mute": "#777777", "stroke": "#9a968e", "ctxStroke": "#d6d3cc", "off": "#f3f2ef", "dark": "#1a1a1a", "css": "lightCss"},
  dark: {"name": "다크", "full": "DARK", "desc": "차분한 어두운 화면에서 선거지도를 만들어보세요", "toss": "#2a2a2e", "ctx": "#19191c", "sea": "#121214", "grid": "#1c1c1f", "head": "#18181a", "frame": "#ededed", "text": "#ededed", "mute": "#8a8a90", "stroke": "#55555c", "ctxStroke": "#2e2e33", "off": "#1b1b1e", "dark": "#0f0f10", "css": "darkCss"},
  sketch: {"name": "스케치북", "full": "SKETCHBOOK", "desc": "스케치북에 연필로 선거지도를 그려보세요", "toss": "#dedbd0", "ctx": "#efede4", "sea": "#fdfcf7", "grid": "#f4f2ea", "head": "#fdfcf7", "frame": "#2b2b2b", "text": "#2b2b2b", "mute": "#6e6e6e", "stroke": "#8a8a8a", "ctxStroke": "#cfcbbf", "off": "#f4f2ea", "dark": "#2b2b2b", "css": "sketchCss"},
  cmyk: {"name": "CMYK", "full": "CMYK PRESS", "desc": "인쇄소 교정지처럼 선거지도를 찍어보세요", "toss": "#e0e0e0", "ctx": "#efefef", "sea": "#ffffff", "grid": "#f2f2f2", "head": "#ffffff", "frame": "#111111", "text": "#111111", "mute": "#6b6b6b", "stroke": "#ffffff", "ctxStroke": "#cccccc", "off": "#f2f2f2", "dark": "#111111", "css": "cmykCss"},
  term: {"name": "터미널", "full": "TERMINAL", "desc": "옛날 컴퓨터 녹색 화면에서 선거지도를 만들어보세요", "toss": "#0a2a12", "ctx": "#03130a", "sea": "#000000", "grid": "#04160a", "head": "#020a04", "frame": "#33ff66", "text": "#7dff9a", "mute": "#2fae52", "stroke": "#33ff66", "ctxStroke": "#0f3a1a", "off": "#04160a", "dark": "#000000", "css": "termCss"},
};
let THEME_ID = 'tno';
try { THEME_ID = localStorage.getItem('tnomap:theme') || 'tno'; } catch (e) { }
if (THEME_ID === 'paper') THEME_ID = 'sketch';
if (!THEMES[THEME_ID]) THEME_ID = 'tno';
let THEME = THEMES[THEME_ID];
function setThemeCss() {
  document.documentElement.dataset.theme = THEME_ID;
  const on = new Set((THEMES[THEME_ID].css || '').split(' ').filter(Boolean));
  for (const k in THEMES) for (const c of (THEMES[k].css || '').split(' ').filter(Boolean)) { const l = document.getElementById(c); if (l) l.media = on.has(c) ? 'all' : 'not all'; }
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
  setThemeCss(); requestAnimationFrame(() => { if (window.kcTune) kcTune(); });
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


/* 키캡 테마: 볼록한 테두리·옆면 두께를 화면 픽셀 기준으로 맞춰요 (지도 크기·확대와 상관없이 같은 모양) */
function kcTune() {
  if (!/^tdb|^sketch/.test(THEME_ID)) return;
  const s = document.getElementById('map'); if (!s || !s.viewBox || !s.viewBox.baseVal) return;
  const w = s.getBoundingClientRect().width || s.clientWidth; if (!w) return;
  tuneFx(document, s.viewBox.baseVal.width / w);
}
/* 지도 필터 크기를 맞춰요 (u = 화면 1픽셀당 지도 좌표). PNG 내보내기에서도 같이 써요 */
function tuneFx(root, u) {
  /* 스케치북: 크레파스 결(줄무늬·거친 가장자리) */
  root.querySelectorAll('filter[id^="skCr"]').forEach(cr => {
    cr.querySelectorAll('feTurbulence').forEach(e => e.setAttribute('baseFrequency', e.dataset.bf.split(' ').map(v => (v / u).toFixed(5)).join(' ')));
    cr.querySelectorAll('feDisplacementMap').forEach(e => e.setAttribute('scale', (e.dataset.sc * u).toFixed(4)));
  });
  /* 키캡: 볼록한 테두리·옆면 두께 */
  root.querySelectorAll('filter[id^="kcF"]').forEach(f => {
    f.querySelectorAll('feGaussianBlur').forEach(e => e.setAttribute('stdDeviation', (1.5 * u).toFixed(4)));
    f.querySelectorAll('feOffset').forEach(e => e.setAttribute('dy', (3 * u).toFixed(4)));
  });
}
window.addEventListener('resize', () => { if (window.kcTune) kcTune(); });
