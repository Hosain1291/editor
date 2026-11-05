"""윈도우 테마 CSS 만들기: python3 tools/make-win.py  (css/style.css → css/theme-win31.css, theme-win95.css, theme-winxp.css)"""
import re
BASE=['#eaffff','#8fe3e8','#0a191d','#06100f','#6fd6dc','#123238','#0f262b','#071215','#2c6e74','#081619','#ff7a88','#e06070','#1d5a60','#e6ffff','#d86a78','#d3f1f2','#6f9ea2','#2c4f55','#1f4a50','#1d3a40','#1a3a40','#12313a','#10292e','#0f2429','#0e2125','#0d2328','#0d2227','#0b1f23','#0b1b1f','#0a1a1d','#0a171a']
def light(text,frame,win,face,title,titletext,hi,mute,line,sea,toss):
    # 순서대로 BASE 에 대응
    return dict(zip(BASE,[text,frame,win,face,frame,title,sea,face,line,sea,hi,'#c00000',title,titletext,'#808080',text,mute,line,line,toss,toss,face,win,win,'#e0e0e0',face,face,title,win,win,win]))
T={}
T['win31']=dict(cm=light('#000000','#000000','#ffffff','#c0c0c0','#000080','#ffffff','#000080','#555555','#808080','#ffffff','#d8d8d8'),extra="""
/* ===== Windows 3.1 ===== */
:root{--title:'Arial','IBM Plex Sans KR',sans-serif;--lat:'Arial','IBM Plex Sans KR',sans-serif}
html,body{background:#008080;background-image:none;color:#000}
body::after{display:none}
*{text-shadow:none!important;border-radius:0!important}
.win{background:#fff;border:4px solid #c0c0c0;outline:1px solid #000;box-shadow:inset 0 0 0 1px #000!important}
.tb{background:#000080;color:#fff;border-bottom:1px solid #000;font-weight:700;justify-content:center;text-align:center}
.tb .t{text-align:center}
.ctl i{border:1px solid #000;border-radius:0!important;background:#c0c0c0;color:#000;box-shadow:inset -1px -1px #808080,inset 1px 1px #fff}
button{background:#c0c0c0;color:#000;border:1px solid #000;border-radius:3px!important;box-shadow:inset -2px -2px #808080,inset 2px 2px #fff!important}
button:hover{border-color:#000}
button.on{background:#c0c0c0;color:#000;box-shadow:inset 2px 2px #808080,inset -1px -1px #fff!important;outline:1px dotted #000;outline-offset:-5px}
.label{color:#000080;letter-spacing:.04em}
.mhead h1{font-family:'Arial',sans-serif;font-weight:700;color:#000080}
.msec h2{color:#fff}.msec .label{color:#fff}
.card:hover{transform:none;box-shadow:none!important}
input,select,textarea{background:#fff;color:#000;border:1px solid #000}
html .card .thumb image{filter:grayscale(1) contrast(1.2) brightness(1.4)}
""",th=dict(name='윈도우 3.1',full='WINDOWS 3.1',desc='Windows 3.1 시절처럼 선거지도를 만들어보세요',toss='#d8d8d8',ctx='#eeeeee',sea='#ffffff',grid='#e8e8e8',head='#ffffff',frame='#000080',text='#000000',mute='#555555',stroke='#808080',ctxStroke='#c0c0c0',off='#f0f0f0',dark='#000000'))
T['win95']=dict(cm=light('#000000','#000000','#c0c0c0','#c0c0c0','#000080','#ffffff','#000080','#404040','#808080','#ffffff','#d4d0c8'),extra="""
/* ===== Windows 95 ===== */
:root{--title:'Tahoma','MS Sans Serif','IBM Plex Sans KR',sans-serif;--lat:'Tahoma','IBM Plex Sans KR',sans-serif}
html,body{background:#008080;background-image:none;color:#000;font-family:'Tahoma','IBM Plex Sans KR',sans-serif}
body::after{display:none}
*{text-shadow:none!important;border-radius:0!important}
.win{background:#c0c0c0;border:2px solid;border-color:#dfdfdf #000 #000 #dfdfdf;box-shadow:inset 1px 1px #fff,inset -1px -1px #808080!important;padding:2px}
.tb{background:#000080;color:#fff;border-bottom:none;font-weight:700;margin:1px}
.ctl i{width:16px;height:14px;border:none;background:#c0c0c0;color:#000;box-shadow:inset -1px -1px #000,inset 1px 1px #fff,inset -2px -2px #808080!important;font-weight:700}
button{background:#c0c0c0;color:#000;border:none;box-shadow:inset -1px -1px #000,inset 1px 1px #fff,inset -2px -2px #808080,inset 2px 2px #dfdfdf!important}
button:hover{background:#c0c0c0}
button.on{box-shadow:inset 1px 1px #000,inset -1px -1px #fff,inset 2px 2px #808080!important;background:#d4d0c8}
.label{color:#000080;letter-spacing:.04em}
.mhead h1{font-family:'Tahoma',sans-serif;font-weight:700;color:#000;font-style:italic}
.mhead h1::before{content:'⊞ ';color:#000080;font-style:normal}
.msec h2{color:#fff}.msec .label{color:#fff}
.card:hover{transform:none}
input,select,textarea{background:#fff;color:#000;border:none;box-shadow:inset 1px 1px #808080,inset -1px -1px #fff,inset 2px 2px #000}
#mapWrap{background-color:#fff!important;background-image:none!important;box-shadow:inset 1px 1px #808080,inset 2px 2px #000}
#menu::after{content:'⊞ 시작';display:block;position:fixed;left:0;right:0;bottom:0;height:30px;line-height:30px;padding-left:10px;background:#c0c0c0;color:#000;font-weight:700;box-shadow:inset 0 1px #fff;z-index:40}
#menu{padding-bottom:70px}
""",th=dict(name='윈도우 95',full='WINDOWS 95',desc='Windows 95 시절처럼 선거지도를 만들어보세요',toss='#d4d0c8',ctx='#e8e8e8',sea='#ffffff',grid='#ececec',head='#c0c0c0',frame='#000080',text='#000000',mute='#404040',stroke='#808080',ctxStroke='#c0c0c0',off='#ececec',dark='#000000'))
T['winxp']=dict(cm=light('#000000','#0a246a','#ece9d8','#ece9d8','#0058e6','#ffffff','#0058e6','#555555','#7f9db9','#ffffff','#d6dbe9'),extra="""
/* ===== Windows XP (Luna) ===== */
:root{--title:'Trebuchet MS','Tahoma','IBM Plex Sans KR',sans-serif;--lat:'Tahoma','IBM Plex Sans KR',sans-serif}
html,body{color:#000;font-family:'Tahoma','IBM Plex Sans KR',sans-serif;background:linear-gradient(#2f6ad4 0%,#6ea4f0 45%,#a9cef7 62%,#79b84a 63%,#4c9a2a 100%) fixed;background-image:linear-gradient(#2f6ad4 0%,#6ea4f0 45%,#a9cef7 62%,#79b84a 63%,#4c9a2a 100%)}
body::after{display:none}
*{text-shadow:none}
.win{background:#ece9d8;border:3px solid #0831d9;border-top:none;border-radius:8px 8px 0 0;box-shadow:2px 3px 8px #0006!important}
.tb{height:30px;background:linear-gradient(#0997ff,#0053ee 8%,#0050ee 40%,#06f 88%,#06f 93%,#005bff 95%,#003dd7 96%,#003dd7);color:#fff;border-bottom:none;font-family:'Trebuchet MS',Tahoma,sans-serif;font-weight:700;font-size:14px;text-shadow:1px 1px #0f1089!important}
.ctl i{width:21px;height:21px;border:1px solid #fff;border-radius:3px;background:linear-gradient(#3c8bff,#1b5ff0);color:#fff;font-weight:700}
.ctl i:last-child{background:linear-gradient(#e8806a,#d1401e)}
button{background:linear-gradient(#fff,#ecebe6 86%,#d6d0c5);color:#000;border:1px solid #003c74;border-radius:3px}
button:hover{box-shadow:inset 0 -1px #ffcf62,inset 0 1px #ffe8b0,inset 1px 0 #ffd889,inset -1px 0 #ffd889!important;border-color:#003c74}
button.on{background:linear-gradient(#e5e4dd,#e2e1da 86%,#f2f1ee);box-shadow:inset 0 2px 2px #0003!important;color:#000}
.label{color:#0a246a;letter-spacing:.03em}
.mhead h1{font-family:'Franklin Gothic Medium','Trebuchet MS',sans-serif;font-weight:700;color:#fff;font-style:italic;text-shadow:2px 2px 4px #0006!important}
.mhead .in{background:linear-gradient(90deg,#5a7edc,#99b5f0)}
.mhead .desc,.mhead .label{color:#fff}
.msec h2{color:#fff;text-shadow:1px 1px 2px #0008!important}.msec .label{color:#e8f0ff}
.card:hover{transform:translateY(-2px)}
input,select,textarea{background:#fff;color:#000;border:1px solid #7f9db9;border-radius:2px}
#mapWrap{background-color:#fff!important;background-image:none!important}
#menu::after{content:'start';display:block;position:fixed;left:0;right:0;bottom:0;height:30px;line-height:30px;padding-left:14px;background:linear-gradient(#1f2f86,#3165c4 8%,#3682e5 40%,#4490e6 88%,#3883e5);color:#fff;font-style:italic;font-weight:700;font-size:18px;z-index:40;background-repeat:no-repeat}
#menu{padding-bottom:70px}
""",th=dict(name='윈도우 XP',full='WINDOWS XP',desc='Windows XP 시절처럼 선거지도를 만들어보세요',toss='#d6dbe9',ctx='#eef0f6',sea='#ffffff',grid='#eef2fb',head='#ece9d8',frame='#0058e6',text='#000000',mute='#555555',stroke='#7f9db9',ctxStroke='#c5cee0',off='#eef0f6',dark='#000000'))
if __name__=='__main__':
    s=open('css/style.css').read()
    for k,c in T.items():
        t=re.sub(r'#[0-9a-fA-F]{6}',lambda m:c['cm'].get(m.group(0).lower(),m.group(0)),s)
        open(f'css/theme-{k}.css','w').write(f"/* {c['th']['name']} 테마 — tools/make-win.py 로 만들어요 */\n"+t+c['extra'])
    import json; print(json.dumps({k:c['th'] for k,c in T.items()},ensure_ascii=False))
