"""Optional browser PNG contrast gate. Requires Pillow; no public runtime dependency.
Run after tests/browser/theme-contrast.cjs captures. --all checks adjacent text too.
Decorative title stars and disabled controls are reported separately.
"""
from pathlib import Path
from PIL import Image
import json,re,sys,statistics
D=Path(sys.argv[1]);a=json.loads((D/'results.json').read_text(encoding='utf8'));out=[]
def rgb(s):
 v=[float(x)for x in re.findall(r'[\d.]+',s)];return v[:3]+[v[3]if len(v)>3 else 1]
def lum(c):
 s=[v/255 for v in c];s=[v/12.92 if v<=.04045 else((v+.055)/1.055)**2.4 for v in s];return sum(v*w for v,w in zip(s,[.2126,.7152,.0722]))
def ratio(f,b):
 x,y=sorted([lum(f),lum(b)]);return(y+.05)/(x+.05)
for row in a['checks']:
 for sample in row['samples']:
  if sample.get('geometryStable')is False:continue
  im=Image.open(D/sample['background']).convert('RGB')
  for e in sample['elements']:
   if e.get('blendOverlays'):
    out.append({'scene':row['name'],'state':sample['label'],'primary':False,'text':e['text'],'class':e['cls'],'status':'UNMEASURED_BLEND_OVERLAY','overlays':e['blendOverlays'],'reason':'CSS foreground plus final background alone cannot model an overlay that blends with both. Original pixels retained.'})
    continue
   pixels=[]
   for r in e['textRects']:
    if r['width']<3 or r['height']<3:continue
    for i in range(1,8):
     for j in range(1,5):
      x=int(r['left']+r['width']*i/8);y=int(r['top']+r['height']*j/5)
      if 0<=x<im.width and 0<=y<im.height:pixels.append(im.getpixel((x,y)))
   if not pixels:continue
   c=rgb(e['color']);alpha=c[3]*e['opacity'];rs=[ratio([c[i]*alpha+b[i]*(1-alpha)for i in range(3)],b)for b in pixels];size=float(e['fontSize'].replace('px',''));large=size>=24 or(size>=18.6667 and int(e['fontWeight'])>=700);required=3 if large else 4.5
   primary=(row['page']=='ui02'and e['href']=='#moments')or(row['page']=='projectMedia'and(e['id']=='themeToggle'or'editor-back'in e['cls']or e['href']=='index.html?ui02=1&lab=1#projects'))
   result={'scene':row['name'],'state':sample['label'],'primary':primary,'tag':e['tag'],'id':e['id'],'class':e['cls'],'text':e['text'],'href':e['href'],'foreground':e['color'],'opacity':e['opacity'],'fontSize':e['fontSize'],'fontWeight':e['fontWeight'],'backgroundWorst':pixels[rs.index(min(rs))],'backgroundMedianRGB':[statistics.median(p[i]for p in pixels)for i in range(3)],'ratioMin':min(rs),'ratioMedian':statistics.median(rs),'required':required,'status':'DECORATIVE'if e['cls']=='editor-title'and e['tag']=='SPAN'and e['text']=='★'else'EXEMPT_DISABLED'if e['disabled']else'PASS'if min(rs)>=required else'FAIL','outline':e['outline']}
   if (e.get('focused')and e.get('focusVisible')or e.get('selected'))and e['outline']['style']not in ['none','hidden']and float(e['outline']['width'].replace('px','')or 0)>0:
    r=e['rect'];gap=float(e['outline']['width'].replace('px',''))+float(e['outline']['offset'].replace('px',''))+2
    points=[(r['x']+r['width']/2,r['y']-gap),(r['x']+r['width']/2,r['bottom']+gap),(r['x']-gap,r['y']+r['height']/2),(r['right']+gap,r['y']+r['height']/2)]
    def unrelated_control(x,y):
     return any(other['rect']!=r and other['rect']['x']<=x<=other['rect']['right']and other['rect']['y']<=y<=other['rect']['bottom']for other in sample['elements'])
    rejected=[(x,y)for x,y in points if unrelated_control(x,y)]
    ps=[im.getpixel((int(x),int(y)))for x,y in points if 0<=int(x)<im.width and 0<=int(y)<im.height and not unrelated_control(x,y)]
    if ps:
     c=rgb(e['outline']['color']);alpha=c[3]*e['opacity'];scores=[ratio([c[i]*alpha+b[i]*(1-alpha)for i in range(3)],b)for b in ps]
     key='focusRing'if e.get('focused')and e.get('focusVisible')else'selectionIndicator'
     result[key]={'color':e['outline']['color'],'backgroundWorst':ps[scores.index(min(scores))],'ratioMin':min(scores),'required':3,'excludedOtherControlPoints':len(rejected),'status':'PASS'if min(scores)>=3 else'FAIL','method':'Adjacent outer pixels beyond actual computed outline width and offset; focus and selected state classified independently.'}
   out.append(result)
(D/'measured-contrast.json').write_text(json.dumps({'engine':a['engine'],'version':a.get('version'),'method':'Actual transparent-text background PNG samples within Range text boxes; computed CSS solid foreground composited with effective opacity. Antialiased glyph edges not used. Retains gradients/backdrop/textures.','measurements':out,'errors':[x for x in a['checks']if x['status']!='CAPTURED']},ensure_ascii=False,indent=2),encoding='utf8')
print(a['engine'],'primary',[(x['scene'],x['state'],x['text'],round(x['ratioMin'],2))for x in out if x['primary']and 'ratioMin'in x])

selected=[x for x in out if x['primary']] if '--all'not in sys.argv else out
checked=[x for x in selected if x['status']not in ['DECORATIVE','EXEMPT_DISABLED']]
fail=[x for x in checked if x['status']=='FAIL'or x.get('focusRing',{}).get('status')=='FAIL'or x.get('selectionIndicator',{}).get('status')=='FAIL']
if not checked or any(x['status']!='CAPTURED'for x in a['checks']):raise SystemExit(2)
if any(x['status'].startswith('UNMEASURED')for x in checked):raise SystemExit(2)
if fail:raise SystemExit(1)
print('PASS rendered contrast',len(checked),'measurements; actual composite background pixels')
