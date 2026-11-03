import {createChapterSession,needsReport,playerRequest,saveChapterSession,submitReply} from './chapter-session.ts';
import {argumentsFor,playtestTarget,positiveInteger,requiredGuidance} from './arguments.ts';
import {ask,transport} from './transport.ts';
import {createPlaytest} from './project-files.ts';
import {assemblePlaytestReport} from './report.ts';

try {
  const args=process.argv.slice(2);
  if (args[0] === 'start') {
    const {options,positional}=argumentsFor(args.slice(1),['--timezone']);
    if (positional.length !== 1) throw new Error('Usage: npm run playtest -- start PROJECT [--timezone America/Los_Angeles]');
    console.log(createPlaytest(positional[0],{timeZone:options['--timezone']}));
  } else if (args[0] === 'report') {
    const {positional}=argumentsFor(args.slice(1),[]);
    if (positional.length !== 1) throw new Error('Usage: npm run playtest -- report DIRECTORY');
    console.log(assemblePlaytestReport(positional[0]));
  } else {
    const {options,positional} = argumentsFor(args,['--story','--session','--model','--chapter','--agent','--endpoint','--max-turns','--timeout-seconds','--playtest','--player','--guidance']);
    if (positional.length || !options['--story'] || !options['--session']) throw new Error('Usage: npm run playtest -- --story PATH --session ID --guidance TEXT [--chapter N] --model LABEL --agent JSON_COMMAND_ARRAY [--max-turns 300]. Alternatively use --endpoint URL.');
    const guidance = requiredGuidance(options['--guidance']);
    const connection = transport(options), max = positiveInteger(options['--max-turns'],300,'--max-turns');
    const {session,story} = createChapterSession(options['--session'],options['--story'],{guidance,chapter:positiveInteger(options['--chapter'],1,'--chapter'),model:options['--model'] ?? 'unspecified agent',playtest:playtestTarget(options)});
    const started = performance.now();
    try {
      let invalid = 0, correction:string|undefined;
      while (!session.final) {
        if (session.turns.length >= max && !needsReport(session)) session.outcome = 'budget';
        const requestStarted = performance.now(), step = session.adventure.frame.step;
        let reply:unknown;
        try {reply = await ask({...playerRequest(session),...(correction ? {correction} : {})},connection);}
        catch (error) {session.requests.push({step,elapsedMs:performance.now()-requestStarted,error:(error as Error).message});throw error;}
        const timing = {step,elapsedMs:performance.now()-requestStarted};
        try {submitReply(session,story,reply);invalid=0;correction=undefined;session.requests.push(timing);}
        catch (error) {
          correction = (error as Error).message;session.requests.push({...timing,error:correction,reply});
          if (++invalid >= 3) throw new Error(`Three invalid replies at step ${step}: ${correction}`);
        }
        session.elapsedMs=performance.now()-started;saveChapterSession(session);
        console.log(JSON.stringify({step,requestMs:timing.elapsedMs,...(correction ? {rejected:correction} : {accepted:true})}));
      }
    } catch (error) {session.outcome='technical-interruption';throw error;}
    finally {session.elapsedMs=performance.now()-started;saveChapterSession(session);}
    console.log(JSON.stringify({session:session.id,outcome:session.outcome,decisions:session.turns.length,elapsedMs:session.elapsedMs}));
  }
} catch (error) {console.error((error as Error).message);process.exitCode=1;}
