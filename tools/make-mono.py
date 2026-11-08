"""라이트 / 다크 테마 CSS 만들기: python3 tools/make-mono.py  (css/style.css → css/theme-light.css, theme-dark.css)
이 두 테마에서만 균명조(GyunMyeongjo) 글꼴을 써요."""
import re,json
BASE=['#eaffff','#8fe3e8','#0a191d','#06100f','#6fd6dc','#123238','#0f262b','#071215','#2c6e74','#081619','#ff7a88','#e06070','#1d5a60','#e6ffff','#d86a78','#d3f1f2','#6f9ea2','#2c4f55','#1f4a50','#1d3a40','#1a3a40','#12313a','#10292e','#0f2429','#0e2125','#0d2328','#0d2227','#0b1f23','#0b1b1f','#0a1a1d','#0a171a','#2c5a60']
FONT="""
@font-face{font-family:'GyunMyeongjo';src:url('https://cdn.jsdelivr.net/gh/Project-Noonnu/2611080026@gyunmyeongjo-regular/gyunmyeongjo-regular/GyunMyeongjo-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'GyunMyeongjo';src:url('https://cdn.jsdelivr.net/gh/Project-Noonnu/2611080026@gyunmyeongjo-regular/gyunmyeongjo-regular/GyunMyeongjo-Bold.woff2') format('woff2');font-weight:700;font-display:swap}
:root{--title:'GyunMyeongjo',serif;--lat:'GyunMyeongjo',serif}
html,body,button,input,select,textarea{font-family:'GyunMyeongjo','Noto Serif KR',serif}
body::after{display:none}
*{text-shadow:none!important}
.label{letter-spacing:.06em;text-transform:none}
.mhead h1{font-weight:700;letter-spacing:-.01em}
.card:hover{transform:translateY(-2px)}
"""
T={
 'light':dict(cm=dict(zip(BASE,['#1a1a1a','#1a1a1a','#ffffff','#f3f2ef','#555555','#f3f2ef','#eceae5','#faf9f6','#c9c6bf','#ffffff','#b3261e','#b3261e','#e8e6e1','#1a1a1a','#9a9a9a','#1a1a1a','#777777','#d6d3cc','#d6d3cc','#e3e1dc','#d9d6cf','#eceae5','#f3f2ef','#f7f6f3','#efede8','#f3f2ef','#f7f6f3','#f3f2ef','#ffffff','#ffffff','#f7f6f3','#c9c6bf'])),extra="""
/* ===== 라이트 ===== */
html,body{background-color:#faf9f6;background-image:none;color:#1a1a1a}
.win{background:#fff;border:1px solid #d6d3cc;border-radius:10px;box-shadow:0 1px 3px #0000000d!important}
.tb{background:#fff;color:#1a1a1a;border-bottom:1px solid #e3e1dc;border-radius:10px 10px 0 0;font-weight:700}
.ctl{display:none}
button{background:#fff;border:1px solid #d6d3cc;color:#1a1a1a;border-radius:6px;box-shadow:none!important}
button:hover{border-color:#1a1a1a}
button.on{background:#1a1a1a;color:#fff;border-color:#1a1a1a}
.label{color:#777}
.mhead h1{color:#1a1a1a}.mhead h1 span{color:#b3261e}
.card:hover{box-shadow:0 6px 18px #00000014!important}
.card .cb{border-top:1px solid #e3e1dc}
.card .prog i{box-shadow:none}
input,select,textarea{background:#fff;color:#1a1a1a;border:1px solid #d6d3cc;border-radius:6px}
#mapWrap{background-color:#fff!important;background-image:none!important}
html .card .thumb image{filter:grayscale(1) invert(.82) contrast(1.1)}
""",th=dict(name='라이트',full='LIGHT',desc='깔끔한 밝은 화면에서 선거지도를 만들어보세요',toss='#e3e1dc',ctx='#efede8',sea='#ffffff',grid='#f3f2ef',head='#ffffff',frame='#1a1a1a',text='#1a1a1a',mute='#777777',stroke='#9a968e',ctxStroke='#d6d3cc',off='#f3f2ef',dark='#1a1a1a',css='lightCss')),
 'dark':dict(cm=dict(zip(BASE,['#ededed','#ededed','#18181a','#111113','#a0a0a0','#1f1f22','#1c1c1f','#0f0f10','#3a3a3f','#121214','#ff6b6b','#e05555','#2a2a2e','#ededed','#55555c','#ededed','#8a8a90','#2e2e33','#2e2e33','#2a2a2e','#26262a','#1f1f22','#1d1d20','#1b1b1e','#19191c','#1d1d20','#1b1b1e','#1f1f22','#18181a','#18181a','#1b1b1e','#3a3a3f'])),extra="""
/* ===== 다크 ===== */
html,body{background-color:#0f0f10;background-image:none;color:#ededed}
.win{background:#18181a;border:1px solid #2e2e33;border-radius:10px;box-shadow:none!important}
.tb{background:#18181a;color:#ededed;border-bottom:1px solid #2e2e33;border-radius:10px 10px 0 0;font-weight:700}
.ctl{display:none}
button{background:#1f1f22;border:1px solid #3a3a3f;color:#ededed;border-radius:6px;box-shadow:none!important}
button:hover{border-color:#ededed}
button.on{background:#ededed;color:#111;border-color:#ededed}
.label{color:#8a8a90}
.mhead h1{color:#ededed}.mhead h1 span{color:#ff6b6b}
.card:hover{box-shadow:0 6px 18px #00000066!important}
.card .cb{border-top:1px solid #2e2e33}
.card .prog i{box-shadow:none}
input,select,textarea{background:#121214;color:#ededed;border:1px solid #3a3a3f;border-radius:6px}
#mapWrap{background-color:#121214!important;background-image:none!important}
html .card .thumb image{filter:grayscale(1) brightness(1.15)}
""",th=dict(name='다크',full='DARK',desc='차분한 어두운 화면에서 선거지도를 만들어보세요',toss='#2a2a2e',ctx='#19191c',sea='#121214',grid='#1c1c1f',head='#18181a',frame='#ededed',text='#ededed',mute='#8a8a90',stroke='#55555c',ctxStroke='#2e2e33',off='#1b1b1e',dark='#0f0f10',css='darkCss'))}
if __name__=='__main__':
    s=open('css/style.css').read()
    for k,c in T.items():
        t=re.sub(r'#[0-9a-fA-F]{6}',lambda m:c['cm'].get(m.group(0).lower(),m.group(0)),s)
        open(f'css/theme-{k}.css','w').write(f"/* {c['th']['name']} 테마 — tools/make-mono.py 로 만들어요 */\n"+t+FONT+c["extra"])
    print(json.dumps({k:c['th'] for k,c in T.items()},ensure_ascii=False))
