"""터미널 테마 CSS 만들기: python3 tools/make-term.py  (css/style.css → css/theme-term.css)
옛날 컴퓨터 녹색 인광 모니터: 검은 화면 · 초록 글씨 · 빛번짐 · 주사선 · 깜빡이는 커서 (VT323 + 갈무리)."""
import re,json,sys
sys.path.insert(0,'tools')
from importlib import import_module
BASE=import_module('make-mono').BASE
P='#33ff66';T='#7dff9a'
cm=dict(zip(BASE,[T,P,'#020a04','#010502',P,'#062a10','#04160a','#010401','#1f7a38','#000000','#ffcc33','#ff5555','#0d4a1e',T,'#1f9e40',T,'#2fae52','#0f3a1a','#0f3a1a','#0a2a12','#0a2812','#062010','#051a0c','#04160a','#03130a','#051a0c','#04160a','#062010','#020a04','#020a04','#04160a','#1f7a38']))
EXTRA=f"""
@font-face{{font-family:'Galmuri11';src:url('../fonts/Galmuri11.woff2') format('woff2');font-display:swap}}
:root{{--title:'VT323','Galmuri11',monospace;--lat:'VT323','Galmuri11',monospace}}
html,body,button,input,select,textarea{{font-family:'VT323','Galmuri11',monospace}}
/* ===== 터미널 ===== */
body::after{{content:"";position:fixed;inset:0;pointer-events:none;z-index:50;display:block!important;
 background:repeating-linear-gradient(transparent 0 2px,#00000055 2px 3px),radial-gradient(ellipse at center,transparent 60%,#000000aa 100%)}}
html,body{{color:{T};background:#000;background-image:radial-gradient(ellipse at center,#04220c 0,#000 75%);background-attachment:fixed;text-shadow:0 0 3px {P}88}}
*{{border-radius:0!important}}
.mhead h1{{color:{P};font-weight:400;letter-spacing:.03em;text-shadow:0 0 6px {P},0 0 18px {P}66!important}}
.mhead h1::before{{content:'C:\\\\> ';color:{T}}}
.mhead h1::after{{content:'█';margin-left:.1em;animation:tmBlink 1s steps(1) infinite}}
.mhead h1 span{{color:#ffcc33;text-shadow:0 0 6px #ffcc33aa!important}}
@keyframes tmBlink{{50%{{opacity:0}}}}
.win{{background:#010401;border:1px solid {P};box-shadow:0 0 10px {P}33,inset 0 0 18px {P}14!important}}
.tb{{background:{P};color:#000;border-bottom:0;font-weight:400;letter-spacing:.06em;text-shadow:none}}
.tb .t::before{{content:'[ '}}.tb .t::after{{content:' ]'}}
.ctl i{{border-color:#000;color:#000}}
button{{background:#000;border:1px solid #1f9e40;color:{T};box-shadow:none!important}}
button:hover{{border-color:{P};color:#fff;background:#062a10}}
button.on{{background:{P};color:#000;border-color:{P};text-shadow:none}}
.label{{color:#2fae52;letter-spacing:.08em}}
.msec h2{{color:{P};font-weight:400}}.msec h2::before{{content:'> ';color:#2fae52}}
.card:hover{{box-shadow:0 0 14px {P}55!important;transform:none}}
.card .cb{{border-top:1px dashed #1f7a38}}
.card .prog i{{box-shadow:0 0 6px {P}}}
input,select,textarea{{background:#000;color:{P};border:1px solid #1f9e40;caret-color:{P}}}
#mapWrap{{background-color:#000!important;background-image:linear-gradient(#062010 1px,transparent 1px),linear-gradient(90deg,#062010 1px,transparent 1px)!important;background-size:22px 22px!important}}
#mapWrap::after{{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(transparent 0 2px,#00000040 2px 3px)}}
#mapWrap svg{{filter:drop-shadow(0 0 2px {P}66)}}
html .card .thumb image{{filter:grayscale(1) sepia(1) hue-rotate(75deg) saturate(5) brightness(.95)}}
.toast{{background:#000!important;color:{P}!important;border:1px solid {P}!important}}
"""
TH=dict(name='터미널',full='TERMINAL',desc='옛날 컴퓨터 녹색 화면에서 선거지도를 만들어보세요',toss='#0a2a12',ctx='#03130a',sea='#000000',grid='#04160a',head='#020a04',frame=P,text=T,mute='#2fae52',stroke=P,ctxStroke='#0f3a1a',off='#04160a',dark='#000000',css='termCss')
if __name__=='__main__':
    s=open('css/style.css').read()
    t=re.sub(r'#[0-9a-fA-F]{6}',lambda m:cm.get(m.group(0).lower(),m.group(0)),s)
    open('css/theme-term.css','w').write("/* 터미널 테마 — tools/make-term.py 로 만들어요 */\n"+t+EXTRA)
    print(json.dumps(TH,ensure_ascii=False))
