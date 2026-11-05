"""PC통신 테마 CSS 만들기: python3 tools/make-pc.py  (css/style.css → css/theme-pc.css)
하이텔·천리안 느낌: 파란 바탕 · 흰 겹선 테두리 · 하늘색 제목줄 · 노란 강조 · 갈무리 픽셀 글꼴(OFL)"""
import re
CM = {'#eaffff':'#ffffff','#8fe3e8':'#ffffff','#0a191d':'#0000a8','#06100f':'#000060','#6fd6dc':'#55ffff','#123238':'#00a8a8',
 '#0f262b':'#0000a8','#071215':'#000080','#2c6e74':'#a8a8a8','#081619':'#000080','#ff7a88':'#ffff55','#e06070':'#ff5555',
 '#1d5a60':'#00a8a8','#e6ffff':'#ffffff','#d86a78':'#a8a8a8','#d3f1f2':'#ffffff','#6f9ea2':'#c0c0c0','#2c4f55':'#5555aa',
 '#1f4a50':'#5555ff','#1d3a40':'#2a2ac8','#1a3a40':'#1818b0','#12313a':'#0000c0','#10292e':'#0000b8','#0f2429':'#0000b0',
 '#0e2125':'#000090','#0d2328':'#0000b4','#0d2227':'#0000a8','#0b1f23':'#00008a','#0b1b1f':'#0000a0','#0a1a1d':'#000098','#0a171a':'#00009c'}
EXTRA = """
/* ===== PC통신 덧칠 ===== */
@font-face{font-family:'Galmuri11';src:url('../fonts/Galmuri11.woff2') format('woff2');font-display:swap}
:root{--title:'Galmuri11',monospace;--lat:'Galmuri11',monospace}
html,body{background:#0000a8;background-image:none;font-family:'Galmuri11','DungGeunMo',monospace}
body::after{display:none}
*{box-shadow:none!important;text-shadow:none!important;border-radius:0!important}
.win{background:#0000a8;border:4px double #fff}
.tb{background:#00a8a8;color:#000;border-bottom:2px solid #fff;font-family:var(--title)}
.ctl i{border-color:#000;color:#000;border-radius:0!important}
button{background:#0000a8;border:1px solid #a8a8a8;color:#fff}
button:hover{background:#0000ff;border-color:#fff}
button.on{background:#00a8a8;color:#000;border-color:#fff}
.label{color:#ffff55;letter-spacing:.06em}
.mhead h1{font-family:'Galmuri11',monospace;font-weight:400;color:#ffff55;letter-spacing:.04em}
.mhead h1::before{content:'▶ ';color:#55ffff}
.mhead h1::after{content:'_';color:#fff;animation:pcBlink 1s steps(1) infinite}
@keyframes pcBlink{50%{opacity:0}}
.mhead .desc{color:#fff}
.msec h2{font-family:var(--title);font-weight:400;color:#ffff55}
.msec h2::before{content:'■ ';color:#55ffff}
.card:hover{background:#0000c8;transform:none}
html .card .thumb image{filter:hue-rotate(50deg) saturate(1.6) brightness(1.1)}
#menu::after{content:'[F1] 도움말   [ESC] 나가기   [숫자] 정당 고르기          9600 bps · 접속 중';display:block;position:sticky;bottom:0;margin:24px -5vw -40px;padding:3px 12px;background:#a8a8a8;color:#000;white-space:pre;overflow:hidden}
input,select,textarea{background:#000080;color:#fff;border:1px solid #a8a8a8}
"""
s = open('css/style.css').read()
t = re.sub(r'#[0-9a-fA-F]{6}', lambda m: CM.get(m.group(0).lower(), m.group(0)), s)
hdr = "/* PC통신 테마 — style.css 를 바탕으로 색을 파란 화면(하이텔·천리안)으로 바꾼 파일.\n   style.css 를 고치면 tools/make-pc.py 로 다시 만들어요. */\n"
open('css/theme-pc.css', 'w').write(hdr + t + EXTRA)
