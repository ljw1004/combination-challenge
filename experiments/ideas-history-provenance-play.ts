import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createState,observe,preview,apply,next,offers} from './logical-ideas-history-provenance.ts';
import type {State} from './logical-ideas-history-provenance.ts';
const [cmd,id,arg]=process.argv.slice(2);
if(!id||!/^[a-zA-Z0-9_-]+$/.test(id))throw new Error('Use a simple session id.');
const folder='results/ideas-history-provenance-players',path=`${folder}/${id}.json`;
const hash=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const sourceHash=createHash('sha256').update(readFileSync(new URL('./logical-ideas-history-provenance.ts',import.meta.url))).digest('hex');
interface Session {id:string;sourceHash:string;state:State;events:unknown[];finished:boolean;}
let session:Session;
if(cmd==='init'){if(existsSync(path))throw new Error('Session exists; do not overwrite.');mkdirSync(folder,{recursive:true});session={id,sourceHash,state:createState(),events:[],finished:false};}
else {session=JSON.parse(readFileSync(path,'utf8'));if(session.sourceHash!==sourceHash)throw new Error('Source changed; frozen play cannot continue.');}
const before=structuredClone(session.state);let output:unknown;
try {
 if(cmd==='init'||cmd==='view')output=observe(session.state);
 else if(cmd==='preview')output=preview(session.state,JSON.parse(arg));
 else if(cmd==='offers')output=offers(session.state,arg);
 else if(cmd==='act'){if(session.finished)throw new Error('Session is finished.');const result=apply(session.state,JSON.parse(arg));session.state=result.state;output={accepted:result.accepted,reason:result.reason,observation:observe(session.state)};}
 else if(cmd==='next'){if(session.finished)throw new Error('Session is finished.');session.state=next(session.state);output=observe(session.state);}
 else if(cmd==='report'||cmd==='checkpoint')output={recorded:JSON.parse(arg)};
 else if(cmd==='finish'){session.finished=true;output={finished:true,observation:observe(session.state)};}
 else throw new Error('Commands: init/view ID; offers ID [IDEA]; preview/act ID JSON; next ID; report/checkpoint ID JSON; finish ID.');
} catch(e){output={error:e instanceof Error?e.message:String(e)};}
session.events.push({at:new Date().toISOString(),cmd,argument:arg??null,beforeHash:hash(before),afterHash:hash(session.state),before,after:session.state,output});
writeFileSync(path,JSON.stringify(session,null,2)+'\n');console.log(JSON.stringify(output,null,2));
