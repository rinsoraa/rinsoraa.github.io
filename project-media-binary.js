/* Shared bounded binary metadata gates for CI and the manual media editor.
   Metadata is not a decoder; the editor separately decodes the selected file. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RinsoraMediaBinary=api;})(typeof window==='object'?window:globalThis,function(){
'use strict';
function bytes(input){
 const d=ArrayBuffer.isView(input)?new Uint8Array(input.buffer,input.byteOffset,input.byteLength):new Uint8Array(input),view=new DataView(d.buffer,d.byteOffset,d.byteLength);
 // Local byte-view methods, never a global Buffer polyfill.
 const sub=d.subarray.bind(d);d.subarray=(a,b)=>bytes(sub(a,b));
 d.equals=x=>d.length===x.length&&d.every((v,i)=>v===x[i]);
 d.toString=(encoding,a=0,b=d.length)=>encoding==='hex'?Array.from(sub(a,b),x=>x.toString(16).padStart(2,'0')).join(''):Array.from(sub(a,b),x=>String.fromCharCode(x)).join('');
 d.readUInt32BE=a=>view.getUint32(a);d.readUInt32LE=a=>view.getUint32(a,true);d.readUInt16BE=a=>view.getUint16(a);d.readUInt16LE=a=>view.getUint16(a,true);
 d.readUIntBE=(a,n)=>{let v=0;for(let i=0;i<n;i++)v=v*256+d[a+i];return v;};d.readUIntLE=(a,n)=>{let v=0;for(let i=n-1;i>=0;i--)v=v*256+d[a+i];return v;};
 d.readFloatBE=a=>view.getFloat32(a);d.readDoubleBE=a=>view.getFloat64(a);return d;
}
function imageSize(data) {
  data=bytes(data);
  const fail=()=>{throw Error('Invalid, truncated or unsupported raster file');};
  if(data.length>=33&&data.subarray(0,8).equals(new Uint8Array([137,80,78,71,13,10,26,10]))) {
    if(data.toString('ascii',12,16)!=='IHDR'||data.toString('ascii',data.length-8,data.length-4)!=='IEND')return fail();
    return {width:data.readUInt32BE(16),height:data.readUInt32BE(20),format:'png'};
  }
  if(data.length>=30&&data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP') {
    if(data.readUInt32LE(4)+8!==data.length)return fail();
    let size;
    for(let start=12;start+8<=data.length;) {
      const type=data.toString('ascii',start,start+4),length=data.readUInt32LE(start+4),at=start+8;
      if(at+length>data.length)return fail();
      if(type==='VP8X'&&length>=10)size={width:data.readUIntLE(at+4,3)+1,height:data.readUIntLE(at+7,3)+1,format:'webp'};
      else if(type==='VP8 '&&length>=10&&data.toString('hex',at+3,at+6)==='9d012a')size ||= {width:data.readUInt16LE(at+6)&16383,height:data.readUInt16LE(at+8)&16383,format:'webp'};
      else if(type==='VP8L'&&length>=5&&data[at]===47) {const bits=data.readUInt32LE(at+1);size ||= {width:(bits&16383)+1,height:((bits>>>14)&16383)+1,format:'webp'};}
      start=at+length+(length%2);
    }
    if(size?.width&&size?.height)return size;
    return fail();
  }
  if(data.length>12&&data[0]===255&&data[1]===216&&data[data.length-2]===255&&data[data.length-1]===217) {
    let at=2;
    while(at+4<data.length) {
      if(data[at++]!==255)return fail();
      while(data[at]===255)at++;
      const marker=data[at++];
      if(marker===217||marker===218)break;
      const length=data.readUInt16BE(at);if(length<2||at+length>data.length)return fail();
      if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)&&length>=8)return {width:data.readUInt16BE(at+5),height:data.readUInt16BE(at+3),format:'jpeg'};
      at+=length;
    }
  }
  return fail();
}
/* WebM structure/track metadata gate, not a frame decoder. Actual playback is
   validated separately in a real browser. No FFmpeg dependency is needed in CI. */
function videoInfo(data) {
  data=bytes(data);
  const fail=()=>{throw Error('Invalid, truncated or unsupported WebM/VP8 video');};
  function vint(at, id) {
    if(at>=data.length||!data[at])return fail();
    let length=1,mask=128;while(!(data[at]&mask)){length++;mask>>=1;}
    if(length>(id?4:8)||at+length>data.length)return fail();
    let value=BigInt(id?data[at]:data[at]&(mask-1));
    for(let i=1;i<length;i++)value=(value<<8n)|BigInt(data[at+i]);
    const unknown=!id&&value===(1n<<BigInt(7*length))-1n;
    if(!unknown&&value>BigInt(Number.MAX_SAFE_INTEGER))return fail();
    return {value:unknown?null:Number(value),length};
  }
  function children(start,end) {
    const list=[];let at=start;
    while(at<end){const id=vint(at,true),size=vint(at+id.length,false),from=at+id.length+size.length,to=size.value==null?end:from+size.value;
      if(from>end||to>end||to<=at||(size.value==null&&id.value!==0x18538067))return fail();
      list.push({id:id.value,from,to});at=to;}
    if(at!==end)return fail();return list;
  }
  const uint=x=>{const length=x.to-x.from;if(length<1||length>6)return fail();return data.readUIntBE(x.from,length);};
  if(data.length<40||data.readUInt32BE(0)!==0x1a45dfa3)return fail();
  const top=children(0,data.length),header=top.find(x=>x.id===0x1a45dfa3),segment=top.find(x=>x.id===0x18538067);
  if(!header||!segment)return fail();
  const doc=children(header.from,header.to).find(x=>x.id===0x4282);
  if(!doc||data.toString('ascii',doc.from,doc.to)!=='webm')return fail();
  const main=children(segment.from,segment.to),info=main.find(x=>x.id===0x1549a966),tracks=main.find(x=>x.id===0x1654ae6b);
  if(!info||!tracks||!main.some(x=>x.id===0x1f43b675&&x.to>x.from))return fail();
  let scale=1000000,duration;
  for(const x of children(info.from,info.to)){
    if(x.id===0x2ad7b1)scale=uint(x);
    if(x.id===0x4489)duration=x.to-x.from===8?data.readDoubleBE(x.from):x.to-x.from===4?data.readFloatBE(x.from):NaN;
  }
  const video=[];let audio=false;
  for(const entry of children(tracks.from,tracks.to).filter(x=>x.id===0xae)){
    const fields=children(entry.from,entry.to),type=fields.find(x=>x.id===0x83),codec=fields.find(x=>x.id===0x86);
    if(!type||!codec)return fail();
    if(uint(type)===2)audio=true;
    if(uint(type)!==1)continue;
    if(data.toString('ascii',codec.from,codec.to)!=='V_VP8')return fail();
    const dimensions=fields.find(x=>x.id===0xe0);if(!dimensions)return fail();
    const size=children(dimensions.from,dimensions.to),width=size.find(x=>x.id===0xb0),height=size.find(x=>x.id===0xba);
    if(!width||!height)return fail();video.push({width:uint(width),height:uint(height)});
  }
  const seconds=duration*scale/1e9;
  if(video.length!==1||!video[0].width||!video[0].height||!Number.isFinite(seconds)||seconds<=0||seconds>120)return fail();
  return {...video[0],duration:seconds,codec:'vp8',audio,format:'webm'};
}
return {imageSize,videoInfo};

});
