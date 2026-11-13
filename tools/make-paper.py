"""올드페이퍼 테마 CSS 만들기: python3 tools/make-paper.py  (css/style.css → css/theme-paper.css)
누렇게 바랜 옛 종이 + 먹색 명조 글씨 + 살짝 번진 지도 색."""
import re,json,sys
sys.path.insert(0,'tools')
from importlib import import_module
mono=import_module('make-mono')
BASE=mono.BASE
INK='#3b2a1a'
cm=dict(zip(BASE,[INK,INK,'#f3e8cf','#e9dcbc','#6b5436','#efe3c6','#e6d7b3','#efe4cc','#b9a37e','#e9dcbd','#8b2a1e','#8b2a1e','#e3d3ab',INK,'#8c7556',INK,'#7a6548','#c9b48c','#c9b48c','#d9c9a3','#d6c49c','#e6d7b3','#ece0c3','#efe4ca','#e9dcbc','#ece0c3','#efe4ca','#ece0c3','#f3e8cf','#f3e8cf','#efe4ca','#b9a37e']))
NOISE="url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35 0 0 0 0 .25 0 0 0 0 .12 0 0 0 .09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"
EXTRA=f"""
:root{{--title:'Nanum Myeongjo','Noto Serif KR','Batang','AppleMyungjo',serif;--lat:'Nanum Myeongjo','Noto Serif KR','Times New Roman',serif}}
html,body,button,input,select,textarea{{font-family:'Nanum Myeongjo','Noto Serif KR','Batang','AppleMyungjo',serif}}
/* ===== 올드페이퍼 ===== */
body::after{{content:"";position:fixed;inset:0;pointer-events:none;z-index:50;display:block!important;
 background:radial-gradient(ellipse at center,transparent 55%,#6b4a2033 85%,#4a2f1255 100%)}}
html,body{{color:{INK};background-color:#efe4cc;background-image:{NOISE},radial-gradient(circle at 18% 22%,#d9c39a55 0,transparent 38%),radial-gradient(circle at 82% 70%,#cfb48555 0,transparent 42%);background-size:220px 220px,100% 100%,100% 100%;background-attachment:fixed}}
.mhead h1,.mhead h1 span,.upcard .upin b{{text-shadow:none!important}}
.mhead h1{{color:{INK};letter-spacing:.02em}}.mhead h1 span{{color:#8b2a1e}}
.win{{background:#f3e8cfee;background-image:{NOISE};border:1px solid #8c7556;border-radius:2px;box-shadow:2px 3px 0 #b9a37e66,0 0 18px #6b4a2022 inset!important;outline:1px solid #c9b48c;outline-offset:-5px}}
.tb{{background:transparent;color:{INK};border-bottom:3px double #8c7556;font-weight:800;letter-spacing:.06em}}
.ctl i{{border-color:#8c7556;color:#8c7556}}
button{{background:#f3e8cf;border:1px solid #8c7556;color:{INK};border-radius:2px;box-shadow:none!important}}
button:hover{{background:#e9dcbc;border-color:{INK}}}
button.on{{background:{INK};color:#f3e8cf;border-color:{INK}}}
.label{{color:#7a6548;letter-spacing:.12em}}
.card:hover{{box-shadow:3px 4px 0 #b9a37e88!important}}
.card .cb{{border-top:1px dashed #b9a37e}}
.card .prog i{{box-shadow:none}}
input,select,textarea{{background:#f7eed9;color:{INK};border:1px solid #b9a37e;border-radius:2px}}
#mapWrap{{background-color:#e9dcbd!important;background-image:{NOISE}!important}}
#mapWrap svg{{filter:sepia(.28) saturate(.82) contrast(.96)}}
html .card .thumb image{{filter:grayscale(1) invert(.62) sepia(.85) saturate(1.3) contrast(1.15)}}
.toast{{background:{INK}!important;color:#f3e8cf!important;border-color:{INK}!important}}
"""
TH=dict(name='올드페이퍼',full='OLD PAPER',desc='누렇게 바랜 옛 종이 위에 선거지도를 그려보세요',toss='#d9c9a3',ctx='#e4d6b6',sea='#e9dcbd',grid='#e2d3b0',head='#efe4cc',frame=INK,text=INK,mute='#7a6548',stroke='#8c7556',ctxStroke='#c9b48c',off='#ece0c3',dark=INK,css='paperCss')
if __name__=='__main__':
    s=open('css/style.css').read()
    t=re.sub(r'#[0-9a-fA-F]{6}',lambda m:cm.get(m.group(0).lower(),m.group(0)),s)
    # @import 는 맨 앞에 와야 해요
    open('css/theme-paper.css','w').write("/* 올드페이퍼 테마 — tools/make-paper.py 로 만들어요 (글꼴 나눔명조는 index.html 에서 불러와요) */\n"+t+EXTRA)
    print(json.dumps(TH,ensure_ascii=False))
