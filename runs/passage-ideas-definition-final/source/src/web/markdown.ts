export function escape(text: string): string { return text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!)); }
/** Deliberately small, escaped presentation Markdown. Author HTML never executes. */
export function markdown(text: string, asset: (path:string)=>string = p=>p): string {
  function inline(raw:string): string {
    const held:string[]=[];
    const hold=(html:string)=>{const key=`\u0000${held.length}\u0000`;held.push(html);return key;};
    raw=raw.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(_,alt,src)=>hold(`<img src="${escape(asset(src))}" alt="${escape(alt)}">`));
    raw=raw.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>/^https?:\/\//.test(url)?hold(`<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)}</a>`):label);
    return escape(raw).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\u0000(\d+)\u0000/g,(_,index)=>held[+index]);
  }
  return text.trim().split(/\n\s*\n/).filter(Boolean).map(p=>`<p>${inline(p).replace(/\n/g,'<br>')}</p>`).join('');
}
