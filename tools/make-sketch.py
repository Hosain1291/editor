"""스케치북 테마 CSS 만들기: python3 tools/make-sketch.py  (css/style.css → css/theme-sketch.css)
도톰한 스케치북 종이 + 연필 선 + 손글씨(개구체) + 마스킹테이프 + 스프링."""
import re,json,sys
sys.path.insert(0,'tools')
from importlib import import_module
BASE=import_module('make-mono').BASE
G='#2b2b2b'
cm=dict(zip(BASE,[G,G,'#fdfcf7','#f4f2ea','#5a5a5a','#f4f2ea','#efede4','#fbfaf4','#bdb9ad','#fdfcf7','#c0392b','#c0392b','#e8e5da',G,'#8a8a8a',G,'#6e6e6e','#cfcbbf','#cfcbbf','#dedbd0','#d6d2c6','#efede4','#f4f2ea','#f8f6ef','#f1efe6','#f4f2ea','#f8f6ef','#f4f2ea','#fdfcf7','#fdfcf7','#f8f6ef','#bdb9ad']))
GRAIN="url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .3 0 0 0 0 .3 0 0 0 0 .28 0 0 0 .07 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"
HAND="255px 12px 225px 12px/12px 225px 12px 255px"
EXTRA=f"""
:root{{--title:'Gaegu','Nanum Pen Script',cursive;--lat:'Gaegu','Nanum Pen Script',cursive}}
html,body,button,input,select,textarea{{font-family:'Gaegu','Nanum Pen Script',cursive;font-size-adjust:none}}
body{{font-size:17px}}
/* ===== 스케치북 ===== */
body::after{{display:none!important}}
#menu{{position:relative}}
#menu::before{{content:"";position:absolute;left:0;right:0;top:0;height:22px;pointer-events:none;z-index:5;
 background:radial-gradient(circle at 50% 70%,#55555c 0 3px,#c8c6bf 3.5px 5.5px,transparent 6px) 0 0/34px 22px repeat-x,linear-gradient(#e9e6dc,#e9e6dc00)}}
html,body{{color:{G};background-color:#f6f4ec;background-image:{GRAIN};background-size:240px 240px;background-attachment:fixed}}
.mhead h1,.mhead h1 span,.upcard .upin b{{text-shadow:none!important}}
.mhead h1{{color:{G};font-weight:700;letter-spacing:0}}.mhead h1 span{{color:#c0392b;background:linear-gradient(transparent 60%,#ffe06688 60% 90%,transparent 90%)}}
.win{{position:relative;background:#fdfcf7;background-image:{GRAIN};border:2px solid {G};border-radius:{HAND};box-shadow:3px 4px 0 #0000001a!important}}
#menu .win>.tb{{position:relative}}
#menu .win>.tb::before{{content:"";position:absolute;left:50%;top:-14px;width:92px;height:24px;transform:translateX(-50%) rotate(-3deg);background:#f3dc8acc;background-image:repeating-linear-gradient(90deg,#ffffff22 0 3px,transparent 3px 7px);box-shadow:0 1px 2px #0002;pointer-events:none;z-index:2}}
.tb{{background:transparent;color:{G};border-bottom:2px dashed #8a8a8a;font-weight:700;font-size:1.08em;border-radius:0}}
.ctl i{{border-color:{G};color:{G};border-radius:50%}}
button{{background:#fdfcf7;border:2px solid {G};color:{G};border-radius:{HAND};box-shadow:none!important}}
button:hover{{background:#fff7cf}}
button.on{{background:{G};color:#fdfcf7;border-color:{G}}}
.label{{color:#6e6e6e;letter-spacing:.04em}}
.msec h2{{font-weight:700;text-decoration:underline wavy #c0392b88;text-underline-offset:6px}}
.card{{border-radius:{HAND}!important}}
.card:hover{{transform:rotate(-.6deg);box-shadow:4px 6px 0 #00000022!important}}
.card .cb{{border-top:2px dashed #bdb9ad}}
.card .prog i{{box-shadow:none}}
input,select,textarea{{background:#fffef9;color:{G};border:0;border-bottom:2px solid {G};border-radius:0}}
#mapWrap{{background-color:#fdfcf7!important;background-image:linear-gradient(#e3e8f2 1px,transparent 1px),linear-gradient(90deg,#e3e8f2 1px,transparent 1px)!important;background-size:24px 24px!important}}
#map #g{{filter:url(#skCr)}}
#labels{{font-family:'Gaegu',cursive}}
#labels text{{fill:#2b2b2b!important;stroke:#fdfcf7!important;stroke-width:.22em!important;stroke-linejoin:round}}
#mapWrap::after{{content:"";position:absolute;inset:0;pointer-events:none;background-image:{GRAIN};background-size:240px 240px;mix-blend-mode:multiply;opacity:.9}}
html .card .thumb image{{filter:grayscale(1) invert(.86) contrast(1.2)}}
.toast{{background:{G}!important;color:#fdfcf7!important;border-color:{G}!important;border-radius:{HAND}!important}}
"""
TH=dict(name='스케치북',full='SKETCHBOOK',desc='스케치북에 연필로 선거지도를 그려보세요',toss='#dedbd0',ctx='#efede4',sea='#fdfcf7',grid='#f4f2ea',head='#fdfcf7',frame=G,text=G,mute='#6e6e6e',stroke='#8a8a8a',ctxStroke='#cfcbbf',off='#f4f2ea',dark=G,css='sketchCss')
if __name__=='__main__':
    s=open('css/style.css').read()
    t=re.sub(r'#[0-9a-fA-F]{6}',lambda m:cm.get(m.group(0).lower(),m.group(0)),s)
    open('css/theme-sketch.css','w').write("/* 스케치북 테마 — tools/make-sketch.py 로 만들어요 (글꼴 개구체는 index.html 에서 불러와요) */\n"+t+EXTRA)
    print(json.dumps(TH,ensure_ascii=False))
