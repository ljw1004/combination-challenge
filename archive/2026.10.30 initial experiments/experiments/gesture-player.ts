/** Client intentionally exposes only public screenshots and physical inputs. */
const [session,command='view',...raw]=process.argv.slice(2);
if(!session){console.log('Usage: node experiments/gesture-player.ts SESSION view|down|move|up|drag|click|key|wheel|finish [screen coordinates or key] [--constellation] [--mode=alchemy|forms|ideas]');process.exit(0);}
const args=raw.filter(a=>!a.startsWith('--'));
const annotation=raw.find(a=>a.startsWith('--prediction='))?.slice(13);
const response=await fetch('http://127.0.0.1:8788',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session,command,args,...(annotation?{annotation}:{}),mobile:raw.includes('--mobile'),experiment:raw.includes('--constellation')?'constellation':raw.includes('--joinery')?'joinery':'hands',mode:raw.find(x=>x.startsWith('--mode='))?.slice(7),level:raw.find(x=>x.startsWith('--level='))?.slice(8)})});
console.log(await response.text());if(!response.ok)process.exitCode=1;
export {};
