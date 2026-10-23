/* Small binary metadata reader for CI. Full decode is separately verified by
   the asset conversion tool and actual browser; this is not an image decoder. */
'use strict';
function imageSize(data) {
  const fail=()=>{throw Error('Invalid, truncated or unsupported raster file');};
  if(data.length>=33&&data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
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
module.exports={imageSize};
