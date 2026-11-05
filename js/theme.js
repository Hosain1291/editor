/* 테마: TNO (The New Order, 하늘색 홀로그램) / TFR (The Fire Rises, 불씨·그을음)
   head 에서 먼저 읽혀서 화면이 깜빡이지 않게 테마 CSS 를 바로 켜요. */
const THEMES = {
  tno: { name: 'TNO', full: 'THE NEW ORDER', desc: 'TNO의 선거지도를 만들어보세요', toss: '#1d3a40', ctx: '#0e2125', sea: '#081619', grid: '#0f262b', head: '#0a191d', frame: '#8fe3e8', text: '#eaffff', mute: '#6f9ea2', stroke: '#d86a78', ctxStroke: '#2c4f55', off: '#0a1a1d', dark: '#071215' },
  tfr: { name: 'TFR', full: 'THE FIRE RISES', desc: 'TFR의 선거지도를 만들어보세요', toss: '#3b2b25', ctx: '#1c1411', sea: '#120d0b', grid: '#1d1310', head: '#1a1210', frame: '#f07a32', text: '#fff1e4', mute: '#a68b78', stroke: '#c98a6a', ctxStroke: '#5a3a2c', off: '#16100d', dark: '#0f0b0a' }
};
let THEME_ID = 'tno';
try { THEME_ID = localStorage.getItem('tnomap:theme') || 'tno'; } catch (e) { }
if (!THEMES[THEME_ID]) THEME_ID = 'tno';
let THEME = THEMES[THEME_ID];
function setThemeCss() {
  document.documentElement.dataset.theme = THEME_ID;
  const l = document.getElementById('tfrCss'); if (l) l.media = THEME_ID === 'tfr' ? 'all' : 'not all';
}
setThemeCss();

/* 테마 글자 바꾸기 (메뉴 설명, 지도 꼬리표) */
function themeTexts() {
  const d = document.getElementById('menuDesc'); if (d) d.textContent = THEME.desc;
  const l = document.getElementById('menuLabel'); if (l) l.textContent = THEME.full + ' · 선거 지도 시뮬레이터';
  document.querySelectorAll('.themeSeg button').forEach(b => b.classList.toggle('on', b.dataset.theme === THEME_ID));
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
document.addEventListener('click', e => { const b = e.target.closest('.themeSeg button'); if (b) applyTheme(b.dataset.theme); });
document.addEventListener('DOMContentLoaded', themeTexts);
