"""Loopback-only static server for optional browser checks; no writes.

Use a second port with --fixture to expose explicitly synthetic Memory data.
Never use this development server for public hosting.
"""
import argparse,hashlib,json,mimetypes,re,struct,threading,time
mimetypes.add_type('model/gltf-binary','.glb')
mimetypes.add_type('model/gltf+json','.gltf')
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs,unquote,urlsplit

parser=argparse.ArgumentParser()
parser.add_argument('--port',type=int,default=8910)
parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1])
parser.add_argument('--fixture',action='store_true')
parser.add_argument('--media-fixture',action='store_true',help='Expose a synthetic PCM WAV at /__test_pcm.wav for native media backends')
parser.add_argument('--test-api',action='store_true',help='Explicitly enable loopback-only identity, ledger and controlled media failures')
parser.add_argument('--request-log',type=Path,help='Append diagnostic request records as JSON lines')
args=parser.parse_args();root=args.root.resolve()
lock=threading.Lock();ledger=[];recovered=set()
public_sources=['index.html','style.css','v3.css','v4.css','editor.css','script.js','music.js','music-museum.js','music-museum.css','room-drawer.js','home-hero.js','projects-data.js','moments-data.js','memory-gallery-data.json','memory-gallery-loader.js','memory-gallery.js','project-lab.js','project-lab-data.js','project-media-data.json']
identity={'contract':'rinsora-browser-check-v1','fixture':args.fixture,'testAPI':args.test_api,'mediaFixture':args.media_fixture,'capabilities':{'roomGLB':True,'media503':args.test_api,'requestLedger':args.test_api},'files':{n:hashlib.sha256((root/n).read_bytes()).hexdigest() for n in public_sources if (root/n).is_file() and (root/n).resolve().is_relative_to(root)}}
def record(row):
 if not args.test_api:return
 with lock:
  row={'sequence':len(ledger)+1,'monotonic':time.monotonic(),**row};ledger.append(row)
  if args.request_log:
   args.request_log.parent.mkdir(parents=True,exist_ok=True)
   with args.request_log.open('a',encoding='utf-8')as f:f.write(json.dumps(row,ensure_ascii=False)+'\n')
class Handler(BaseHTTPRequestHandler):
 def log_message(self,*unused):pass
 def send_error(self,code,message=None,explain=None):
  record({'path':self.path,'status':code,'range':self.headers.get('Range')})
  super().send_error(code,message,explain)
 def do_HEAD(self):self.send(False)
 def do_GET(self):self.send(True)
 def send(self,body):
  parsed=urlsplit(self.path);name=unquote(parsed.path).lstrip('/')or'index.html';query=parse_qs(parsed.query)
  if '\\' in name or '..' in Path(name).parts or any(p.startswith('.') for p in Path(name).parts) or name.lower().startswith('docs/'):
   self.send_error(403);return
  parts=Path(name).parts
  if len(parts)>1 and(parts[0]not in {'assets','posts','room','tests'}or parts[0]=='tests'and not name.startswith('tests/fixtures/')):
   self.send_error(403);return
  if not name.startswith('__')and len(parts)==1 and(Path(name).suffix=='.txt'and name!='robots.txt'or Path(name).suffix=='.json'and name not in {'memory-gallery-data.json','project-media-data.json'}):
   self.send_error(403);return
  if name.startswith('__') and name!='__test_pcm.wav':
   if not args.test_api:self.send_error(404);return
   if name=='__identity.json':data=json.dumps(identity).encode()
   elif name=='__requests.json':
    with lock:data=json.dumps(ledger).encode()
   elif name=='__test_recover':
    token=query.get('token',[''])[0]
    if not re.fullmatch(r'[A-Za-z0-9_-]{1,100}',token):self.send_error(400);return
    with lock:recovered.add(token)
    data=json.dumps({'recovered':token,'scope':'test-server memory only'}).encode()
   else:self.send_error(404);return
   self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(data)));self.send_header('Cache-Control','no-store');self.end_headers()
   if body:self.wfile.write(data)
   return
  if args.fixture and(name=='memory-gallery-data.json'or name.startswith('assets/memories/')):name='tests/fixtures/memory-gallery/'+name
  file=(root/name).resolve()
  if args.media_fixture and name=='__test_pcm.wav':
   data=b'RIFF'+struct.pack('<I',480036)+b'WAVEfmt '+struct.pack('<IHHIIHH',16,1,1,8000,16000,2,16)+b'data'+struct.pack('<I',480000)+bytes(480000)
  else:
   if not file.is_relative_to(root) or not file.is_file():self.send_error(404);return
   if name.startswith('__')or file.suffix.lower()not in {'.html','.js','.css','.json','.svg','.png','.jpg','.jpeg','.webp','.ico','.mp3','.ogg','.wav','.webm','.woff','.woff2','.txt','.lrc','.glb','.gltf','.bin','.hdr','.wasm'}:self.send_error(403);return
   data=file.read_bytes()
  token=query.get('fu3-offline',[''])[0]
  if args.test_api and(name.startswith('assets/music/')or name=='__test_pcm.wav')and token and token not in recovered:
   self.send_error(503);return
  start=0;end=len(data)-1;status=200
  if self.headers.get('Range'):
   m=re.fullmatch(r'bytes=(\d+)-(\d*)',self.headers['Range'])
   if not m:self.send_error(416);return
   start=int(m[1]);end=min(end,int(m[2]))if m[2]else end;status=206
   if start>end:self.send_error(416);return
  record({'path':self.path,'status':status,'range':self.headers.get('Range')})
  mime=mimetypes.guess_type(name)[0]or'application/octet-stream'
  self.send_response(status);self.send_header('Content-Type',mime+('; charset=utf-8'if mime.startswith('text/')else''));self.send_header('Content-Length',str(end-start+1));self.send_header('Accept-Ranges','bytes');self.send_header('Cache-Control','no-cache')
  if status==206:self.send_header('Content-Range',f'bytes {start}-{end}/{len(data)}')
  self.end_headers()
  if body:
   try:self.wfile.write(data[start:end+1])
   except(ConnectionError,BrokenPipeError):pass
server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
print(json.dumps({'url':f'http://127.0.0.1:{server.server_port}/',**{k:v for k,v in identity.items()if k!='files'}}),flush=True)
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
