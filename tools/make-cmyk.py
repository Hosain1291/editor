"""CMYK 테마 CSS 만들기: python3 tools/make-cmyk.py  (css/style.css → css/theme-cmyk.css)
인쇄소 느낌: 흰 종이 · 먹(K) 테두리 · 시안/마젠타/노랑 강조 · 망점 · 판 어긋남 · 재단선."""
import re,json,sys
sys.path.insert(0,'tools')
from importlib import import_module
BASE=import_module('make-mono').BASE
K='#111111';C='#00aeef';M='#ec008c';Y='#fff200'
cm=dict(zip(BASE,[K,K,'#ffffff','#f2f2f2',C,'#f2f2f2','#ececec','#fafafa',K,'#ffffff',M,M,'#e6e6e6',K,'#888888',K,'#6b6b6b','#cccccc','#cccccc','#e0e0e0','#d8d8d8','#ececec','#f2f2f2','#f6f6f6','#efefef','#f2f2f2','#f6f6f6','#f2f2f2','#ffffff','#ffffff','#f6f6f6',K]))
DOTS=f"radial-gradient({C}26 1.2px,transparent 1.7px) 0 0/9px 9px,radial-gradient({M}1f 1.2px,transparent 1.7px) 4px 3px/11px 11px"
EXTRA=f"""
:root{{--title:'Black Han Sans','IBM Plex Sans KR',sans-serif;--lat:'Rajdhani','IBM Plex Sans KR',sans-serif}}
html,body,button,input,select,textarea{{font-family:'IBM Plex Sans KR',sans-serif}}
/* ===== CMYK ===== */
body::after{{content:"";position:fixed;left:0;right:0;bottom:0;height:8px;pointer-events:none;z-index:50;display:block!important;
 background:linear-gradient(90deg,{C} 0 25%,{M} 25% 50%,{Y} 50% 75%,{K} 75%)}}
html,body{{color:{K};background:#fbfbf8;background-image:none}}
#menu{{background:{DOTS};background-attachment:fixed}}
.mhead h1,.upcard .upin b{{text-shadow:-2px 0 {C}cc,2px 1px {M}cc!important}}
.mhead h1{{color:{K};font-weight:400;letter-spacing:.01em}}.mhead h1 span{{color:{M};text-shadow:-2px 0 {C}cc,2px 1px {Y}!important}}
.win{{background:#fff;border:2px solid {K};border-radius:0;box-shadow:5px 5px 0 {C},10px 10px 0 {M}55!important}}
.tb{{background:{K};color:#fff;border-bottom:0;font-family:var(--title);font-weight:400;letter-spacing:.04em;border-radius:0}}
.tb::after{{content:"";display:inline-block;width:42px;height:10px;margin-left:auto;background:linear-gradient(90deg,{C} 0 25%,{M} 25% 50%,{Y} 50% 75%,#fff 75%)}}
.ctl i{{border-color:#fff;color:#fff;border-radius:0}}
button{{background:#fff;border:2px solid {K};color:{K};border-radius:0;box-shadow:none!important;font-weight:700}}
button:hover{{background:{Y}}}
button.on{{background:{M};color:#fff;border-color:{K};box-shadow:3px 3px 0 {K}!important}}
.label{{color:{M};letter-spacing:.14em;font-weight:700}}
.msec h2{{font-family:var(--title);font-weight:400;text-shadow:-1.5px 0 {C}aa,1.5px 1px {M}aa}}
.card{{border-radius:0!important}}
.card:hover{{box-shadow:6px 6px 0 {M}!important}}
.card .cb{{border-top:2px solid {K}}}
.card .prog i{{box-shadow:none}}
input,select,textarea{{background:#fff;color:{K};border:2px solid {K};border-radius:0}}
#mapWrap{{background-color:#fff!important;background-image:none!important}}
#mapWrap::before,#mapWrap::after{{content:"";position:absolute;width:26px;height:26px;pointer-events:none;z-index:3;border:0 solid {K}}}
#mapWrap::before{{left:8px;top:8px;border-left-width:1px;border-top-width:1px}}
#mapWrap::after{{right:8px;bottom:8px;border-right-width:1px;border-bottom-width:1px}}
#mapWrap svg{{filter:drop-shadow(1.5px 1px 0 {M}55) drop-shadow(-1px 0 0 {C}44)}}
html .card .thumb image{{filter:grayscale(1) invert(.85) sepia(1) hue-rotate(270deg) saturate(3) contrast(1.1)}}
.toast{{background:{K}!important;color:#fff!important;border-color:{K}!important;box-shadow:4px 4px 0 {M}!important}}
"""
TH=dict(name='CMYK',full='CMYK PRESS',desc='인쇄소 교정지처럼 선거지도를 찍어보세요',toss='#e0e0e0',ctx='#efefef',sea='#ffffff',grid='#f2f2f2',head='#ffffff',frame=K,text=K,mute='#6b6b6b',stroke='#ffffff',ctxStroke='#cccccc',off='#f2f2f2',dark=K,css='cmykCss')
if __name__=='__main__':
    s=open('css/style.css').read()
    t=re.sub(r'#[0-9a-fA-F]{6}',lambda m:cm.get(m.group(0).lower(),m.group(0)),s)
    open('css/theme-cmyk.css','w').write("/* CMYK 테마 — tools/make-cmyk.py 로 만들어요 */\n"+t+EXTRA)
    print(json.dumps(TH,ensure_ascii=False))
