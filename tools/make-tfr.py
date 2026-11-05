"""TFR 테마 CSS 만들기: python3 tools/make-tfr.py  (css/style.css → css/theme-tfr.css)
TFR 로고 느낌: 검은 바탕 · 네온 마젠타 원근 격자 · 와이어프레임 지구 · 보라 불꽃 · 색이 어긋난(RGB) 흰 픽셀 글자"""
import re
CM = {'#eaffff':'#ffffff','#8fe3e8':'#ff3ce6','#0a191d':'#0d0416','#06100f':'#040008','#6fd6dc':'#e03cff','#123238':'#2a0a3c',
 '#0f262b':'#2a0838','#071215':'#05000a','#2c6e74':'#8a2bb0','#081619':'#07010d','#ff7a88':'#6ff2ff','#e06070':'#ff4d8d',
 '#1d5a60':'#5a1478','#e6ffff':'#ffffff','#d86a78':'#d65cf0','#d3f1f2':'#f6e9ff','#6f9ea2':'#b48ccc','#2c4f55':'#4a1e60',
 '#1f4a50':'#3a1050','#1d3a40':'#2a1238','#1a3a40':'#1c0a2a','#12313a':'#24083a','#10292e':'#1a0628','#0f2429':'#140820',
 '#0e2125':'#120620','#0d2328':'#16072a','#0d2227':'#150626','#0b1f23':'#10041c','#0b1b1f':'#0c0414','#0a1a1d':'#0e0518','#0a171a':'#0d0418'}
GLOBE = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%23ff6cf0' stroke-width='2.2'%3E"
 "%3Ccircle cx='100' cy='100' r='92'/%3E%3Cellipse cx='100' cy='100' rx='64' ry='92'/%3E%3Cellipse cx='100' cy='100' rx='30' ry='92'/%3E"
 "%3Cpath d='M100 8v184M8 100h184M20 55h160M20 145h160M40 26h120M40 174h120'/%3E%3C/g%3E"
 "%3Cpath d='M48 132c-8-30 14-40 10-66 18 16 18 34 16 46 6-16 4-38 18-58 10 22 2 40 10 54 4-14 14-24 14-40 18 24 14 46 8 64z' fill='%23b03cf0' opacity='.85'/%3E%3C/svg%3E")
EXTRA = """
/* ===== TFR 덧칠: 신스웨이브 네온 ===== */
:root{--title:'VT323','IBM Plex Sans KR',monospace;--lat:'Share Tech Mono','VT323','IBM Plex Sans KR',monospace}
html{background:#000}
body{background:transparent!important}
/* 원근 네온 격자 바닥 + 지평선 빛 */
body::before{content:"";position:fixed;left:-50%;right:-50%;bottom:-10vh;height:62vh;z-index:-1;pointer-events:none;
 background:linear-gradient(#ff2fe0 2px,transparent 2px) 0 0/100% 46px,linear-gradient(90deg,#ff2fe0 2px,transparent 2px) 0 0/58px 100%;
 transform:perspective(320px) rotateX(58deg);transform-origin:50% 100%;opacity:.55;
 -webkit-mask-image:linear-gradient(transparent,#000 35%);mask-image:linear-gradient(transparent,#000 35%);filter:drop-shadow(0 0 6px #ff2fe0)}
html::before{content:"";position:fixed;left:0;right:0;top:44vh;height:22vh;z-index:-2;pointer-events:none;background:radial-gradient(ellipse at 50% 100%,#c01ad855,transparent 70%)}
/* 창: 네온 테두리 */
.win{background:#0a0312ee;box-shadow:0 0 16px #ff3ce655,0 0 2px #ff3ce6,inset 0 0 0 2px #05000a,inset 0 0 0 3px #8a2bb0}
.tb{background:linear-gradient(#2a0a3c,#10041c);color:#fff;font-size:16px;letter-spacing:.04em;text-shadow:0 0 6px #ff3ce6aa}
.tb .t{font-family:var(--title)}
button{font-family:inherit}
button.on{background:#5a1478;box-shadow:0 0 12px #ff3ce6aa,inset 0 0 8px #ff3ce655;color:#fff}
.label{font-family:var(--lat);letter-spacing:.14em;color:#ff6cf0;text-shadow:0 0 6px #ff3ce688}
/* 제목: 검은 띠 위 흰 픽셀 글자, 빨강·하늘 색이 어긋나게 */
.mhead .in{background:url("GLOBE") no-repeat right 230px center/150px auto}
.mhead h1{font-family:'VT323',monospace;font-weight:400;font-size:clamp(52px,8vw,96px);letter-spacing:.06em;text-transform:uppercase;color:#fff;
 background:#000;display:inline-block;padding:2px 18px 0;border:1px solid #ffffff22;
 text-shadow:-3px 0 #ff2a6d,3px 0 #2af6ff,0 0 14px #ffffffaa}
.msec h2{font-family:var(--title);font-size:26px;font-weight:400;letter-spacing:.04em;color:#fff;text-shadow:-1.5px 0 #ff2a6d,1.5px 0 #2af6ff}
.card:hover{box-shadow:0 0 26px #ff3ce6aa,inset 0 0 0 2px #05000a,inset 0 0 0 3px #8a2bb0}
html .card .thumb image{filter:sepia(1) saturate(3) hue-rotate(245deg) brightness(.95)}
.num{font-family:var(--lat)}
#mapTag{font-family:var(--lat);color:#ff6cf0;text-shadow:0 0 6px #ff3ce6}
""".replace("GLOBE", GLOBE)
s = open('css/style.css').read()
t = re.sub(r'#[0-9a-fA-F]{6}', lambda m: CM.get(m.group(0).lower(), m.group(0)), s)
hdr = "/* TFR (The Fire Rises) 테마 — style.css 를 바탕으로 색을 네온 마젠타로 바꾼 파일.\n   style.css 를 고치면 tools/make-tfr.py 로 다시 만들어요. */\n"
open('css/theme-tfr.css', 'w').write(hdr + t + EXTRA)
