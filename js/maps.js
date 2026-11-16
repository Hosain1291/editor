/* 지도 불러오기
   maps/index.json 에 적힌 폴더마다 map.json(설정)과 map.svg(선거구 모양)를 읽어요.
   새 지도를 넣으려면 maps/ 아래에 폴더를 만들고 index.json 에 한 줄 추가하면 돼요. */

const MAP_LIST = [];          // [{id, folder, meta}]
let MAP = null;               // 지금 열린 지도의 map.json
let MAP_BASE = '';            // 지금 열린 지도의 폴더 경로
let DATA = [];                // [[id, region, d], ...]
let ids = [], region = {};
let FULL = { x: 0, y: 0, w: 1600, h: 1600 };
const svgCache = {};

async function loadMapList() {
  // 메뉴용 가벼운 목록(catalog.json)을 한 번에 받아요. 지도 하나의 전체 설정은 열 때 받아요.
  try {
    const cat = await (await fetch('maps/catalog.json', { cache: 'no-cache' })).json();
    cat.maps.forEach(m => MAP_LIST.push({ id: m.id, folder: m.folder, v: m.v, b: m.b, bv: m.bv, sk: m.sk, sp: m.sp, spv: m.spv, meta: m.meta, full: false }));
    return;
  } catch (e) { }
  const idx = await (await fetch('maps/index.json', { cache: 'no-cache' })).json();
  const metas = await Promise.all(idx.maps.map(m => fetch(`maps/${m.folder}/map.json`, { cache: 'no-cache' }).then(r => r.json())));
  idx.maps.forEach((m, i) => MAP_LIST.push({ id: metas[i].id || m.id, folder: m.folder, meta: metas[i], full: true }));
}
const bundleCache = {};
/* 지도 모양·썸네일 묶음(maps/packs/): 파일 하나에 여러 svg가 들어 있어요. 없으면 예전처럼 낱개 파일을 읽어요. */
const packCache = {};
function getPack(name, v) {
  if (!packCache[name]) packCache[name] = fetch(`maps/packs/${name}.json?v=${v}`).then(r => { if (!r.ok) throw 0; return r.json(); }).catch(er => { delete packCache[name]; throw er; });
  return packCache[name];
}
const THUMB_URL = {};
function thumbFromPack(entry) {
  const meta = entry.meta, tk = meta.tk || entry.sk, tp = meta.tk ? meta.tp : entry.sp, tv = meta.tk ? meta.tpv : entry.spv;
  if (!tk || !tp) return null;
  if (THUMB_URL[tk]) return THUMB_URL[tk];
  getPack(tp, tv).then(pk => {
    for (const k in pk) if (!THUMB_URL[k]) THUMB_URL[k] = URL.createObjectURL(new Blob([pk[k]], { type: 'image/svg+xml' }));
    document.querySelectorAll('image[data-tk]').forEach(im => { const u = THUMB_URL[im.dataset.tk]; if (u && im.getAttribute('href') !== u) im.setAttribute('href', u); });
  }).catch(() => { document.querySelectorAll(`image[data-tk="${tk}"]`).forEach(im => im.setAttribute('href', im.dataset.fb)); });
  return '';
}
async function fullMeta(e) {
  if (e.full !== false) return e.meta;
  // 같은 나라 지도들의 전체 설정은 maps/bundles/ 안의 묶음 파일 하나에 들어 있어요.
  if (e.b) {
    try {
      if (!bundleCache[e.b]) bundleCache[e.b] = fetch(`maps/bundles/${e.b}.json?v=${e.bv}`).then(r => { if (!r.ok) throw 0; return r.json(); });
      const b = await bundleCache[e.b];
      if (b[e.id]) { e.meta = b[e.id]; e.full = true; return e.meta; }
    } catch (er) { delete bundleCache[e.b]; }
  }
  e.meta = await (await fetch(`maps/${e.folder}/map.json?v=${e.v}`)).json(); e.full = true; return e.meta;
}

const mapEntry = id => MAP_LIST.find(m => m.id === id);

async function useMap(id) {
  const e = mapEntry(id); if (!e) return false;
  if (MAP && MAP.id === id) return true;
  await fullMeta(e);
  MAP = e.meta; MAP_BASE = e.folder ? `maps/${e.folder}/` : '';
  let txt = svgCache[id] || e.svgText;
  if (!txt && e.sp) { try { txt = (await getPack(e.sp, e.spv))[e.sk]; } catch (er) { } }
  if (!txt) { txt = await (await fetch(MAP_BASE + (MAP.svg || 'map.svg') + (e.v ? '?v=' + e.v : ''))).text(); }
  svgCache[id] = txt;
  const doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
  const alias = MAP.regionAlias || {}, hid = new Set(MAP.hideIds || []);
  DATA = [...doc.querySelectorAll('path[id]')].map(p => {
    const r = p.getAttribute('data-region') || 'default';
    return [p.id, hid.has(p.id) ? '_hidden' : (alias[r] || r), p.getAttribute('d'), p.getAttribute('transform') || null];
  });
  ids = DATA.map(d => d[0]);
  region = Object.fromEntries(DATA.map(d => [d[0], d[1]]));
  FULL = { x: 0, y: 0, w: MAP.width, h: MAP.height };
  return true;
}

const nameOf = id => (MAP.names && MAP.names[id]) || id;
const regionName = r => (MAP.regions && MAP.regions[r]) || r;
const defaultSeat = id => (MAP.seats && MAP.seats[id] != null) ? MAP.seats[id] : (MAP.defaultSeats || 1);
const viewOf = key => MAP.views.find(v => v.key === key);
const boxOf = v => ({ x: v.box[0], y: v.box[1], w: v.box[2], h: v.box[3] });
const idsOfView = v => ids.filter(id => v.regions.includes(region[id]));
