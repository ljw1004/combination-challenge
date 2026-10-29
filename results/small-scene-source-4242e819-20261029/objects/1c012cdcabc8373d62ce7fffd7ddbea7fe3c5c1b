// A deliberately small DOM for controller tests, not browser/layout evidence.
// Unlike the old flat parser, mutations affect only their own subtree. Tests can
// detect detached/replaced images and duplicate listeners instead of merely
// comparing repeated HTML strings.
export function syntheticDocument(width=360) {
 const doc:any={activeElement:null,elementFromPoint:()=>null};
 const decode=(s:string)=>s.replace(/&(amp|lt|gt|quot|#39);/g,(_,x)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[x as string]!));
 const escape=(s:string)=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 const voids=new Set(['BR','INPUT','META','LINK','IMG','HR','WBR']);
 const matches=(e:any,q:string):boolean=>q.split(',').some(part=>{
  const bits=part.trim().split(/\s+/),last=bits.pop()!;
  const simple=last.startsWith('#')?e.id===last.slice(1):last.startsWith('.')?e.classes?.has(last.slice(1)):(()=>{const m=/^\[([\w-]+)(?:="([^"]*)")?\]$/.exec(last);return m?e.hasAttribute(m[1])&&(m[2]===undefined||e.getAttribute(m[1])===m[2]):e.tagName===last.toUpperCase();})();
  if(!simple)return false;if(!bits.length)return true;
  for(let p=e.parentElement;p;p=p.parentElement)if(matches(p,bits.join(' ')))return true;
  return false;
 });
 class N {
  nodeType:number;nodeValue:string|null;tagName='';parentNode:N|null=null;childNodes:N[]=[];
  attrs:Record<string,string>={};dataset:Record<string,string>={};classes=new Set<string>();listeners:Record<string,Function[]>={};style:any;
  value='';clientWidth=width;clientHeight=500;scrollTop=0;scrollLeft=0;connectionBreaks=0;srcWrites=0;showCount=0;content?:N;
  [key:string]:any;
  constructor(type=1,tag='DIV',text:string|null=null){this.nodeType=type;this.tagName=type===1?tag.toUpperCase():'';this.nodeValue=text;this.style=new Proxy({} as Record<string,string>,{set:(o,k,v)=>{o[String(k)]=v;this.attrs.style=Object.entries(o).map(([k,v])=>`${k.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())}:${v}`).join(';');return true;}});if(this.tagName==='TEMPLATE')this.content=new N(11);}
  get ownerDocument(){return doc;}
  get id(){return this.attrs.id??'';}set id(v:string){this.attrs.id=v;}
  get attributes(){return Object.entries(this.attrs).map(([name,value])=>({name,value}));}
  get children(){return this.childNodes.filter(n=>n.nodeType===1);}
  get parentElement():N|null{return this.parentNode?.nodeType===1?this.parentNode:null;}
  get firstChild(){return this.childNodes[0]??null;}
  get nextSibling():N|null{if(!this.parentNode)return null;return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this)+1]??null;}
  get isConnected():boolean{return this===app||!!this.parentNode?.isConnected;}
  get classList(){return {add:(...xs:string[])=>{xs.forEach(x=>this.classes.add(x));this.attrs.class=[...this.classes].join(' ');},remove:(...xs:string[])=>{xs.forEach(x=>this.classes.delete(x));this.attrs.class=[...this.classes].join(' ');},contains:(x:string)=>this.classes.has(x)};}
  get hidden(){return 'hidden'in this.attrs;}set hidden(v:boolean){if(v)this.attrs.hidden='';else delete this.attrs.hidden;}
  get open(){return 'open'in this.attrs;}set open(v:boolean){if(v)this.attrs.open='';else delete this.attrs.open;}
  get href(){return this.attrs.href;}
  get textContent():string{return this.nodeType===3?this.nodeValue??'':this.childNodes.map(n=>n.textContent).join('');}
  set textContent(v:string){if(this.nodeType===3){this.nodeValue=v;return;}for(const n of [...this.childNodes])this.removeChild(n);if(v)this.appendChild(new N(3,'',v));}
  setAttribute(name:string,value:string){this.attrs[name]=String(value);if(name==='class')this.classes=new Set(value.split(/\s+/).filter(Boolean));if(name.startsWith('data-'))this.dataset[name.slice(5)]=value;if(name==='src')this.srcWrites++;if(name==='value')this.value=value;}
  getAttribute(name:string){return this.attrs[name]??null;}
  hasAttribute(name:string){return name in this.attrs;}
  removeAttribute(name:string){delete this.attrs[name];if(name==='class')this.classes.clear();if(name.startsWith('data-'))delete this.dataset[name.slice(5)];}
  appendChild(n:N){return this.insertBefore(n,null);}
  insertBefore(n:N,ref:N|null){if(n===ref)return n;if(n.parentNode)n.parentNode.removeChild(n);const index=ref?this.childNodes.indexOf(ref):this.childNodes.length;if(index<0)throw Error('Missing reference child');this.childNodes.splice(index,0,n);n.parentNode=this;return n;}
  removeChild(n:N){const index=this.childNodes.indexOf(n);if(index<0)throw Error('Missing removed child');if(n.isConnected){const mark=(x:N)=>{x.connectionBreaks++;x.childNodes.forEach(mark);};mark(n);}this.childNodes.splice(index,1);n.parentNode=null;return n;}
  get innerHTML():string{return (this.content??this).childNodes.map(n=>n.outerHTML).join('');}
  get outerHTML():string{if(this.nodeType===3)return escape(this.nodeValue??'');if(this.nodeType!==1)return this.innerHTML;const tag=this.tagName.toLowerCase(),attrs=Object.entries(this.attrs).map(([k,v])=>` ${k}="${escape(v)}"`).join('');return `<${tag}${attrs}>${voids.has(this.tagName)?'':this.innerHTML+`</${tag}>`}`;}
  set innerHTML(html:string){const root=this.content??this;for(const n of [...root.childNodes])root.removeChild(n);const stack=[root];for(const match of html.matchAll(/<!--[^]*?-->|<\/?[\w-]+\b[^>]*>|[^<]+/g)){const raw=match[0];if(raw.startsWith('<!--'))continue;if(raw.startsWith('</')){stack.pop();continue;}if(!raw.startsWith('<')){stack.at(-1)!.appendChild(new N(3,'',decode(raw)));continue;}const tag=/^<([\w-]+)/.exec(raw)![1],e=new N(1,tag);for(const a of raw.slice(tag.length+1,-1).matchAll(/([\w-]+)(?:="([^"]*)"|'([^']*)'|=([^\s>]+))?/g))e.setAttribute(a[1],decode(a[2]??a[3]??a[4]??''));stack.at(-1)!.appendChild(e);if(!voids.has(e.tagName)&&!raw.endsWith('/>'))stack.push(e);}}
  descendants():N[]{return this.children.flatMap(c=>[c,...c.descendants()]);}
  querySelectorAll(q:string){return this.descendants().filter(e=>matches(e,q));}
  querySelector(q:string){return this.querySelectorAll(q)[0]??null;}
  closest(q:string):N|null{return matches(this,q)?this:this.parentElement?.closest(q)??null;}
  focus(){doc.activeElement=this;}
  showModal(){this.open=true;this.showCount++;(this.querySelector('[autofocus]')??this.querySelector('button'))?.focus();}
  close(){this.open=false;}
  getBoundingClientRect(){return {left:0,top:0,right:this.clientWidth,bottom:500,width:this.clientWidth,height:500};}
  capturedPointers=new Set<number>();
  setPointerCapture(id:number){this.capturedPointers.add(id);}
  hasPointerCapture(id:number){return this.capturedPointers.has(id);}
  releasePointerCapture(id:number){this.capturedPointers.delete(id);this.onlostpointercapture?.({pointerId:id});}
  addEventListener(type:string,fn:Function){(this.listeners[type]??=[]).push(fn);}
 }
 const app=new N();app.id='app';
 Object.assign(doc,{createElement:(tag:string)=>new N(1,tag),querySelector:(q:string)=>q==='#app'?app:app.querySelector(q),querySelectorAll:(q:string)=>app.querySelectorAll(q),getElementById:(id:string)=>id==='app'?app:app.querySelector('#'+id)});
 return {app,doc};
}
