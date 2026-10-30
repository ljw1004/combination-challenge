import { storyIds } from '../story/load.ts';
import {createSession,openSession,step,saveSession} from './session.ts';
import {observe} from './observe.ts';
const [command,id,...args]=process.argv.slice(2);
try{
  if(command==='list'||!command)console.log(JSON.stringify({stories:storyIds(),commands:['init SESSION STORY','view SESSION','act SESSION ACTION_JSON [ACCOUNT_JSON]','report SESSION REPORT_JSON','stop SESSION REPORT_JSON']},null,2));
  else if(command==='init'){const session=createSession(id,args[0]);const {story}=openSession(id);console.log(JSON.stringify(observe(story,session.state),null,2));}
  else{const {session,story}=openSession(id);if(command==='view')console.log(JSON.stringify(observe(story,session.state),null,2));else if(command==='act')console.log(JSON.stringify(step(session,story,JSON.parse(args[0]),args[1]?JSON.parse(args[1]):undefined),null,2));else if(command==='report'||command==='stop'){session.report=JSON.parse(args[0]);if(command==='stop')session.outcome=session.state.completed?'completed':'stopped';saveSession(session);console.log(JSON.stringify({saved:true,outcome:session.outcome}));}else throw new Error('Unknown command. Use npm run play -- list.');}
}catch(error){console.error((error as Error).message);process.exitCode=1;}
