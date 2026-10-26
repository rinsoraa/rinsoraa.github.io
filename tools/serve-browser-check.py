"""Loopback-only static server for optional browser checks; no writes.

Use a second port with --fixture to expose explicitly synthetic Memory data.
Never use this development server for public hosting.
"""
import argparse,mimetypes,re
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote,urlsplit

parser=argparse.ArgumentParser()
parser.add_argument('--port',type=int,default=8910)
parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1])
parser.add_argument('--fixture',action='store_true')
args=parser.parse_args();root=args.root.resolve()
class Handler(BaseHTTPRequestHandler):
 def do_HEAD(self):self.send(False)
 def do_GET(self):self.send(True)
 def send(self,body):
  name=unquote(urlsplit(self.path).path).lstrip('/')or'index.html'
  if '\\' in name or '..' in Path(name).parts or any(p.startswith('.') for p in Path(name).parts) or name.lower().startswith('docs/'):
   self.send_error(403);return
  if args.fixture and(name=='memory-gallery-data.json'or name.startswith('assets/memories/')):name='tests/fixtures/memory-gallery/'+name
  file=(root/name).resolve()
  if not file.is_relative_to(root) or not file.is_file():self.send_error(404);return
  data=file.read_bytes();start=0;end=len(data)-1;status=200
  if self.headers.get('Range'):
   m=re.fullmatch(r'bytes=(\d+)-(\d*)',self.headers['Range'])
   if not m:self.send_error(416);return
   start=int(m[1]);end=min(end,int(m[2]))if m[2]else end;status=206
   if start>end:self.send_error(416);return
  self.send_response(status);self.send_header('Content-Type',mimetypes.guess_type(name)[0]or'application/octet-stream');self.send_header('Content-Length',str(end-start+1));self.send_header('Accept-Ranges','bytes');self.send_header('Cache-Control','no-cache')
  if status==206:self.send_header('Content-Range',f'bytes {start}-{end}/{len(data)}')
  self.end_headers()
  if body:
   try:self.wfile.write(data[start:end+1])
   except(ConnectionError,BrokenPipeError):pass
print(f'LOCAL browser test server http://127.0.0.1:{args.port}/ fixture={args.fixture}',flush=True)
ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
