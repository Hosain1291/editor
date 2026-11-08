/* 테마: 라이트·다크(균명조 글꼴) / TNO (The New Order, 하늘색 홀로그램) / TFR (The Fire Rises, 네온 마젠타 신스웨이브) / PC통신 (파란 화면)
   head 에서 먼저 읽혀서 화면이 깜빡이지 않게 테마 CSS 를 바로 켜요. */
const THEMES = {
  tno: { name: 'TNO', full: 'THE NEW ORDER', desc: 'TNO의 선거지도를 만들어보세요', toss: '#1d3a40', ctx: '#0e2125', sea: '#081619', grid: '#0f262b', head: '#0a191d', frame: '#8fe3e8', text: '#eaffff', mute: '#6f9ea2', stroke: '#d86a78', ctxStroke: '#2c4f55', off: '#0a1a1d', dark: '#071215' },
  pc: { name: 'PC통신', full: 'PC통신', desc: 'PC통신 시절처럼 선거지도를 만들어보세요', toss: '#2a2ac8', ctx: '#000090', sea: '#000080', grid: '#0000a8', head: '#0000a8', frame: '#ffffff', text: '#ffffff', mute: '#c0c0c0', stroke: '#c0c0c0', ctxStroke: '#5555aa', off: '#000098', dark: '#000080', css: 'pcCss' },
  tfr: { name: 'TFR', full: 'THE FIRE RISES', desc: 'TFR의 선거지도를 만들어보세요', toss: '#2a1238', ctx: '#120620', sea: '#07010d', grid: '#2a0838', head: '#0d0416', frame: '#ff3ce6', text: '#ffffff', mute: '#b48ccc', stroke: '#d65cf0', ctxStroke: '#4a1e60', off: '#0e0518', dark: '#05000a', css: 'tfrCss' },
  win31: {"name": "윈도우 3.1", "full": "WINDOWS 3.1", "desc": "Windows 3.1 시절처럼 선거지도를 만들어보세요", "toss": "#d8d8d8", "ctx": "#eeeeee", "sea": "#ffffff", "grid": "#e8e8e8", "head": "#ffffff", "frame": "#000080", "text": "#000000", "mute": "#555555", "stroke": "#808080", "ctxStroke": "#c0c0c0", "off": "#f0f0f0", "dark": "#000000", "css": "win31Css", "btn": "Win 3.1"},
  win95: {"name": "윈도우 95", "full": "WINDOWS 95", "desc": "Windows 95 시절처럼 선거지도를 만들어보세요", "toss": "#d4d0c8", "ctx": "#e8e8e8", "sea": "#ffffff", "grid": "#ececec", "head": "#c0c0c0", "frame": "#000080", "text": "#000000", "mute": "#404040", "stroke": "#808080", "ctxStroke": "#c0c0c0", "off": "#ececec", "dark": "#000000", "css": "win95Css", "btn": "Win 95"},
  winxp: {"name": "윈도우 XP", "full": "WINDOWS XP", "desc": "Windows XP 시절처럼 선거지도를 만들어보세요", "toss": "#d6dbe9", "ctx": "#eef0f6", "sea": "#ffffff", "grid": "#eef2fb", "head": "#ece9d8", "frame": "#0058e6", "text": "#000000", "mute": "#555555", "stroke": "#7f9db9", "ctxStroke": "#c5cee0", "off": "#eef0f6", "dark": "#000000", "css": "winxpCss", "btn": "Win XP"},
  light: {"name": "라이트", "full": "LIGHT", "desc": "깔끔한 밝은 화면에서 선거지도를 만들어보세요", "toss": "#e3e1dc", "ctx": "#efede8", "sea": "#ffffff", "grid": "#f3f2ef", "head": "#ffffff", "frame": "#1a1a1a", "text": "#1a1a1a", "mute": "#777777", "stroke": "#9a968e", "ctxStroke": "#d6d3cc", "off": "#f3f2ef", "dark": "#1a1a1a", "css": "lightCss"},
  dark: {"name": "다크", "full": "DARK", "desc": "차분한 어두운 화면에서 선거지도를 만들어보세요", "toss": "#2a2a2e", "ctx": "#19191c", "sea": "#121214", "grid": "#1c1c1f", "head": "#18181a", "frame": "#ededed", "text": "#ededed", "mute": "#8a8a90", "stroke": "#55555c", "ctxStroke": "#2e2e33", "off": "#1b1b1e", "dark": "#0f0f10", "css": "darkCss"},
};
let THEME_ID = 'tno';
try { THEME_ID = localStorage.getItem('tnomap:theme') || 'tno'; } catch (e) { }
if (!THEMES[THEME_ID]) THEME_ID = 'tno';
let THEME = THEMES[THEME_ID];
function setThemeCss() {
  document.documentElement.dataset.theme = THEME_ID;
  for (const k in THEMES) { const c = THEMES[k].css; const l = c && document.getElementById(c); if (l) l.media = k === THEME_ID ? 'all' : 'not all'; }
}
setThemeCss();

/* 테마 글자 바꾸기 (메뉴 설명, 지도 꼬리표) */
function themeTexts() {
  const d = document.getElementById('menuDesc'); if (d) d.textContent = THEME.desc;
  const l = document.getElementById('menuLabel'); if (l) l.textContent = THEME.full + ' · 선거 지도 시뮬레이터';
  document.querySelectorAll('.themeSeg').forEach(seg => { if (!seg.dataset.built) { seg.innerHTML = themeButtons(); seg.dataset.built = 1; } });
  document.querySelectorAll('.themeSeg button').forEach(b => b.classList.toggle('on', b.dataset.theme === THEME_ID));
}
function themeButtons() { return Object.entries(THEMES).map(([k, t]) => `<button data-theme="${k}" class="${k === THEME_ID ? 'on' : ''}">${t.btn || t.name}</button>`).join(''); }
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
document.addEventListener('click', e => { const b = e.target.closest('.themeSeg button'); if (b) applyTheme(b.dataset.theme); });
document.addEventListener('DOMContentLoaded', themeTexts);
