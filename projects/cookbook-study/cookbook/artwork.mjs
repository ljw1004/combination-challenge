// Shared presentation for the gallery and exported game assets. The source
// raster is untouched; framing and the optional silhouette halo are native SVG.
export function createArtwork({source, geometry, frame, extent, halo=false, unit=1, id='asset', label=''}) {
 const ns='http://www.w3.org/2000/svg';
 const el=(tag,attrs)=>{const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n;};
 const ratio=extent/Math.max(frame.width,frame.height),aw=frame.width*ratio,ah=frame.height*ratio;
 const padding=halo?6*unit:0,w=Math.ceil(aw+padding*2),h=Math.ceil(ah+padding*2);
 const svg=el('svg',{xmlns:ns,width:w,height:h,viewBox:`0 0 ${w} ${h}`,id,role:'img','aria-label':label});
 svg.style.display='block';
 const defs=el('defs',{}),clipId=id+'-clip',filterId=id+'-halo';
 const clip=el('clipPath',{id:clipId});clip.append(el('polygon',{points:frame.polygon}));defs.append(clip);
 if(halo){
  const filter=el('filter',{id:filterId,filterUnits:'userSpaceOnUse',x:0,y:0,width:w,height:h,'color-interpolation-filters':'sRGB'});
  filter.append(el('feGaussianBlur',{in:'SourceAlpha',stdDeviation:1.5*unit,result:'soft-alpha'}));
  const transfer=el('feComponentTransfer',{in:'soft-alpha',result:'halo-alpha'});
  // A blurred silhouette is approximately half opaque at its boundary. Map
  // that to 10%, cap it there, and fade continuously to zero outside the edge.
  transfer.append(el('feFuncA',{type:'table',tableValues:'0 .1 .1'}));filter.append(transfer);
  filter.append(el('feFlood',{'flood-color':'#666',result:'grey'}));
  filter.append(el('feComposite',{in:'grey',in2:'halo-alpha',operator:'in',result:'halo'}));
  const merge=el('feMerge',{});merge.append(el('feMergeNode',{in:'halo'}),el('feMergeNode',{in:'SourceGraphic'}));filter.append(merge);defs.append(filter);
 }
 svg.append(defs);
 const group=el('g',halo?{filter:`url(#${filterId})`}:{});
 const inner=el('svg',{x:(w-aw)/2,y:(h-ah)/2,width:aw,height:ah,viewBox:`${frame.x} ${frame.y} ${frame.width} ${frame.height}`});
 inner.append(el('image',{href:source,width:geometry.width,height:geometry.height,'clip-path':`url(#${clipId})`}));
 group.append(inner);svg.append(group);return svg;
}
