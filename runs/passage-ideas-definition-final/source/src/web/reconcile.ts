/** Preserve connected art, scene and item nodes across game events. */
export function reconcile(parent:Element,html:string){
  const template=document.createElement('template');template.innerHTML=html;
  function key(node:Node,index:number):string{
    if(!(node instanceof Element))return `text:${index}`;
    for(const attr of ['data-item','data-chapter','data-hotspot','data-command'])if(node.hasAttribute(attr))return `${node.tagName}:${attr}:${node.getAttribute(attr)}`;
    return `${node.tagName}:${node.classList[0]??''}:${index}`;
  }
  function sync(target:Node,desired:Node){
    if(target.nodeType===Node.TEXT_NODE){if(target.textContent!==desired.textContent)target.textContent=desired.textContent;return;}
    if(target instanceof Element&&desired instanceof Element){
      for(const attr of [...target.attributes])if(!desired.hasAttribute(attr.name))target.removeAttribute(attr.name);
      for(const attr of [...desired.attributes])if(target.getAttribute(attr.name)!==attr.value)target.setAttribute(attr.name,attr.value);
    }
    const old=new Map([...target.childNodes].map((n,i)=>[key(n,i),n]));
    [...desired.childNodes].forEach((fresh,i)=>{
      const k=key(fresh,i),existing=old.get(k);const node=existing&&existing.nodeType===fresh.nodeType?existing:fresh.cloneNode(true);
      if(existing===node){sync(node,fresh);old.delete(k);}
      if(target.childNodes[i]!==node)target.insertBefore(node,target.childNodes[i]??null);
    });
    for(const node of old.values())if(node.parentNode===target)target.removeChild(node);
  }
  sync(parent,template.content);
}
