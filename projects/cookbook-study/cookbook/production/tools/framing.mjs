// Browser-only pixel measurement. The raster is read, never rewritten: exports
// retain it as an SVG <image> clipped and framed around complete alpha marks.
export function measureAtlas(image, { columns, rows, count, alphaThreshold = 64, minimumComponentPixels = 12, padding = 5, overrides = {} }) {
  const width=image.naturalWidth,height=image.naturalHeight;
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
  const rgba=context.getImageData(0,0,width,height).data;
  const mask=new Uint8Array(width*height),queue=new Int32Array(width*height);
  let transparentPixels=0;
  for(let p=0;p<mask.length;p++){const a=rgba[p*4+3];if(a===0)transparentPixels++;mask[p]=a>alphaThreshold?1:0;}
  if(transparentPixels<mask.length*.01)throw new Error('Source is not a transparent atlas; refusing opaque-background extraction.');
  const groups=Array.from({length:columns*rows},()=>[]),components=[];
  for(let start=0;start<mask.length;start++){
    if(!mask[start])continue;
    let head=0,tail=1,left=width,top=height,right=0,bottom=0;
    queue[0]=start;mask[start]=0;
    while(head<tail){
      const p=queue[head++],x=p%width,y=Math.floor(p/width);
      left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
      if(x&&mask[p-1]){mask[p-1]=0;queue[tail++]=p-1;}
      if(x<width-1&&mask[p+1]){mask[p+1]=0;queue[tail++]=p+1;}
      if(y&&mask[p-width]){mask[p-width]=0;queue[tail++]=p-width;}
      if(y<height-1&&mask[p+width]){mask[p+width]=0;queue[tail++]=p+width;}
    }
    if(tail<minimumComponentPixels)continue;
    const column=Math.min(columns-1,Math.floor((left+right)/2/width*columns));
    const row=Math.min(rows-1,Math.floor((top+bottom)/2/height*rows));
    const component={index:components.length,left,top,right,bottom,pixels:tail,cell:row*columns+column};
    const lefts=new Map(),rights=new Map();
    for(let n=0;n<tail;n++){const p=queue[n],x=p%width,y=Math.floor(p/width);lefts.set(y,Math.min(lefts.get(y)??width,x));rights.set(y,Math.max(rights.get(y)??-1,x));}
    component.edges=[...lefts].flatMap(([y,x])=>[[x,y],[rights.get(y),y]]);
    components.push(component);groups[component.cell].push(component);
  }
  function hull(points){
    points.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
    const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
    const lower=[],upper=[];
    for(const p of points){while(lower.length>=2&&cross(lower.at(-2),lower.at(-1),p)<=0)lower.pop();lower.push(p);}
    for(const p of points.toReversed()){while(upper.length>=2&&cross(upper.at(-2),upper.at(-1),p)<=0)upper.pop();upper.push(p);}
    return lower.slice(0,-1).concat(upper.slice(0,-1)).map(p=>p.join(',')).join(' ');
  }
  const frames=groups.slice(0,count).map((parts,index)=>{
    const override=overrides[index]??{};
    if(override.componentIndices)parts=components.filter(c=>override.componentIndices.includes(c.index));
    if(override.largestOnly)parts=parts.toSorted((a,b)=>b.pixels-a.pixels).slice(0,1);
    if(override.rect){const {x,y,width:w,height:h}=override.rect;return {...override.rect,polygon:`${x},${y} ${x+w},${y} ${x+w},${y+h} ${x},${y+h}`,manual:true};}
    if(!parts.length)throw new Error(`No alpha subject found in cell ${index+1}`);
    const left=Math.min(...parts.map(c=>c.left)),top=Math.min(...parts.map(c=>c.top));
    const right=Math.max(...parts.map(c=>c.right)),bottom=Math.max(...parts.map(c=>c.bottom));
    const points=parts.flatMap(c=>c.edges.flatMap(([x,y])=>[[-padding,-padding],[-padding,padding],[padding,-padding],[padding,padding]].map(([dx,dy])=>[Math.max(0,Math.min(width,x+dx)),Math.max(0,Math.min(height,y+dy))])));
    const x=Math.max(0,left-padding),y=Math.max(0,top-padding),w=Math.min(width,right+padding+1)-x,h=Math.min(height,bottom+padding+1)-y;
    return {x,y,width:w,height:h,polygon:hull(points),pixels:parts.reduce((n,c)=>n+c.pixels,0),parts:parts.length,componentIndices:parts.map(c=>c.index),warnings:[...(w>width/columns*1.1?['Subject extends beyond nominal cell width; inspect neighbouring crops.']:[]),...(h>height/rows*1.1?['Subject extends beyond nominal cell height; inspect neighbouring crops.']:[])]};
  });
  return {width,height,transparentPixels,alphaThreshold,minimumComponentPixels,padding,columns,rows,count,frames,ignoredComponents:groups.slice(count).flat().map(({edges,...c})=>c),components:components.map(({edges,...c})=>c)};
}
