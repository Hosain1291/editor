"""maps/catalog.json(메뉴용 가벼운 목록)과 썸네일(thumb.svg)을 만들어요.
지도를 추가·수정한 뒤 이 파일을 한 번 실행하세요:  python3 tools/build-catalog.py"""
import json,os,re,hashlib
R=os.path.join(os.path.dirname(__file__),'..','maps')
HEAVY={'names','labels','regionOf','seats','presets','seatNotes','partyNotes'}
def thumb(svgpath,out,w):
    s=open(svgpath).read()
    tol=max(1.5,w/320)
    def simp(d):
        out=[];
        for part in re.split(r'(?=[Mm])',d):
            nums=re.findall(r'-?\d+\.?\d*',part)
            if not part.strip(): continue
            if part[0]!='M' or not re.fullmatch(r'[MLZ\d\s.,\-]*',part): return None
            pts=list(zip(map(float,nums[0::2]),map(float,nums[1::2])))
            if len(pts)<3: continue
            from shapely.geometry import LineString
            ring=LineString(pts+[pts[0]]).simplify(tol,preserve_topology=False)
            keep=list(ring.coords)[:-1]
            if len(keep)>=3 and LineString(keep+[keep[0]]).length>tol*2: out.append('M'+' '.join(f'{x:.0f} {y:.0f}' for x,y in keep)+'Z')
        return ''.join(out)
    head=s[:s.index('<path')] if '<path' in s else None
    if head is None: return False
    paths=re.findall(r'<path\b[^>]*?\bd="([^"]+)"[^>]*/?>',s)
    ds=[simp(d) for d in paths]
    if any(x is None for x in ds): return False
    m=re.search(r'viewBox="([^"]+)"',s); vb=m.group(1) if m else f'0 0 {w} {w}'
    g=re.search(r'<g\b[^>]*>',s); gopen=g.group(0) if g else '<g fill="#1a3a40" stroke="#d86a78" stroke-width="1">'
    open(out,'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{gopen}<path d="'+''.join(ds)+'"/></g></svg>')
    return True
idx=json.load(open(os.path.join(R,'index.json')))
cat=[];done={}
for e in idx['maps']:
    f=e['folder']; mp=os.path.join(R,f,'map.json'); m=json.load(open(mp))
    svgrel=m.get('svg','map.svg'); svgp=os.path.normpath(os.path.join(R,f,svgrel))
    h=hashlib.md5(open(mp,'rb').read()+open(svgp,'rb').read()).hexdigest()[:8]
    light={k:v for k,v in m.items() if k not in HEAVY}
    # 메뉴의 '선거구 n · n석' 계산값
    seats=m.get('seats',{}); ds=m.get('defaultSeats',1); hid=set(m.get('hideIds',[]))
    vs={}
    for v in m.get('views',[]):
        n=t=0
        for i in m.get('names',{}):
            if i in hid: continue
            r=(m.get('regionOf') or {}).get(i)
            if r and r not in v['regions']: continue
            n+=1; t+=seats.get(i) or ds or 1
        vs[v['key']]=[n,t]
    light['vstat']=vs
    tp=svgp[:-len('map.svg')]+'thumb.svg' if svgp.endswith('map.svg') else None
    if tp:
        if tp not in done: done[tp]=thumb(svgp,tp,m.get('width',1000))
        if done[tp]: light['thumb']=os.path.relpath(tp,os.path.join(R,f)).replace(os.sep,'/')
    cat.append({'id':m.get('id',e['id']),'folder':f,'v':h,'meta':light})
json.dump({'maps':cat},open(os.path.join(R,'catalog.json'),'w'),ensure_ascii=False,separators=(',',':'))
print(len(cat),'maps', sum(1 for c in cat if 'thumb' in c['meta']),'thumbs', os.path.getsize(os.path.join(R,'catalog.json'))//1024,'KB')
