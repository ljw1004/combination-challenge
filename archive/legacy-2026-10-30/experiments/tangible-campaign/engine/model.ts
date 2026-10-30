/** @deprecated V1 logical API compatibility only. Current runtime/authoring uses
 * engine/campaign.ts and schema/campaign.ts. Every rule delegates to that one
 * canonical engine; this module only translates vocabulary and save shape. */
import * as C from './campaign.ts';
import * as V from '../compatibility/v1.ts';
import type {Action, Item, Objective, Scenario, Stage} from '../schema/scenario.ts';
export type Point={x:number;y:number};
export type Token=Point&{id:string;kind:string;area:string;location:string|null;slots:Record<string,string>;incorporated:string[];components?:string[]};
export type Place=Point&{id:string;area:string};
export type Area={id:string;label:string;enteredAtStage:number};
export type Metrics={attempts:number;accepted:number;combinations:number;creations:number;installations:number;moves:number;placements:number;advances:number;visits:number};
/** A bounded chapter-entry snapshot, not a reconstruction from the event log.
 * IDs remain here after use so the challenge can explain an arrival later. */
export type Arrival={stage:number;area:string;supplies:{item:string;cache:string;sourceStage?:number;area?:string}[];carried:{item:string;from:string}[];here:string[]};
export type ArrivalLayout={stage:number;area:string;dividerY:number;active:boolean};
export type State={stage:number;currentArea:string;areas:Area[];places:Place[];tokens:Token[];discovered:string[];recipesUsed:string[];openedCaches:string[];width:number;metrics:Metrics;completed:boolean;arrival?:Arrival;arrivalLayout?:ArrivalLayout;arrivalLayouts?:ArrivalLayout[];chapterEntry?:{stage:number;alreadyComplete:boolean};skippedChapters?:string[];milestones?:MilestoneAchievement[]};
export type MilestoneAchievement={id:string;components:string[]};
export type Event={seq:number;action:Action|{type:'undo'};accepted:boolean;message:string;stage:number;recipe?:string;created?:string;installed?:boolean;retired?:string[];transfers?:{item:string;from:string;to:string}[];skippedChapters?:string[]};
/** lifecycleVersion 2 records event-local removals and immutable construction snapshots. */
export type Game={version:1;lifecycleVersion?:2;scenarioId:string;state:State;history:State[];events:Event[];milestonesSeen?:string[];bridgesSeen?:string[]};
export type Result={accepted:boolean;game:Game;message:string;created?:string;updated?:string;recipe?:string;origin?:Point;retired?:string[]};

const scenario=V.fromLegacyScenario, state=V.fromLegacyState, game=V.fromLegacyGame;
const result=(r:C.Result,original?:Game,converted?:C.Game):Result=>({...r,message:V.toLegacyMessage(r.message),game:original&&r.game===converted?original:V.toLegacyGame(r.game)});
const returned=(g:C.Game,original:Game,converted:C.Game):Game=>g===converted?original:V.toLegacyGame(g);
export const item=(s:Scenario,id:string)=>s.items.find(x=>x.id===id);
export const token=(s:State,id:string)=>s.tokens.find(x=>x.id===id);
export const validateScenario=(s:Scenario)=>C.validateScenario(scenario(s));
export const functional=(s:Scenario,t:Token)=>C.functional(scenario(s),V.fromLegacyToken(t));
export const capabilities=(s:Scenario,t:Token)=>C.capabilities(scenario(s),V.fromLegacyToken(t));
export const matches=(s:Scenario,t:Token,o:Objective)=>C.matches(scenario(s),V.fromLegacyToken(t),V.fromLegacyObjective(o));
export const objectiveStates=(s:Scenario,st:State)=>C.objectiveStates(scenario(s),state(st)).map(V.toLegacyObjectiveState);
export const visibleObjectives=(s:Scenario,st:State)=>C.visibleObjectives(scenario(s),state(st)).map(V.toLegacyObjectiveState);
export const gold=(s:Scenario,st:State)=>{const g=C.gold(scenario(s),state(st));return {items:g.items,places:g.hotspots};};
export const stageComplete=(s:Scenario,st:State)=>C.chapterComplete(scenario(s),state(st));
export const componentLabels=(s:Scenario,t:Token,st?:Pick<State,'discovered'>)=>C.componentLabels(scenario(s),V.fromLegacyToken(t),st);
export const itemDisplayLabel=(s:Scenario,st:Pick<State,'discovered'>,kind:string)=>C.itemDisplayLabel(scenario(s),st,kind);
export const itemLabelLines=C.itemLabelLines;
export const itemLabelLayout=(def:Item)=>C.itemLabelLayout(def);
export const tokenHeight=(s:Scenario,t:Token)=>C.tokenHeight(scenario(s),V.fromLegacyToken(t));
export const sceneCarry=(s:Scenario,st:State,ch:Stage)=>C.sceneCarry(scenario(s),state(st),V.fromLegacyChapter(ch));
export const arrivalDivisions=(st:State)=>C.arrivalDivisions(state(st)).map(V.toLegacyArrivalLayout);
export const resolveChapterEntry=(s:Scenario,g:Game)=>{const c=game(g);return returned(C.resolveChapterEntry(scenario(s),c),g,c);};
export const pendingChapterBridges=(s:Scenario,g:Game)=>C.pendingChapterBridges(scenario(s),game(g));
export const acknowledgeChapterBridges=(s:Scenario,g:Game,ids:string[])=>{const c=game(g);return returned(C.acknowledgeChapterBridges(scenario(s),c,ids),g,c);};
export const createGame=(s:Scenario,width=360)=>V.toLegacyGame(C.createGame(scenario(s),width));
export const dropAction=(s:Scenario,st:State,a:string,b:string)=>V.toLegacyAction(C.dropAction(scenario(s),state(st),a,b));
export const applyAction=(s:Scenario,g:Game,a:Action)=>{const c=game(g);return result(C.applyAction(scenario(s),c,V.fromLegacyAction(a)),g,c);};
export const pendingMilestone=(s:Scenario,g:Game)=>C.pendingMilestone(scenario(s),game(g));
export const acknowledgeMilestone=(s:Scenario,g:Game,id:string)=>{const c=game(g);return returned(C.acknowledgeMilestone(scenario(s),c,id),g,c);};
export const undo=(g:Game)=>{const c=game(g);return result(C.undo(c),g,c);};
export const arrivalCue=(st:State,id:string)=>C.arrivalCue(state(st),id);
export const arrivalView=(s:Scenario,st:State)=>{const v=C.arrivalView(scenario(s),state(st));if(!v)return null;const {location,...rest}=v;return {area:location,...rest};};
export const partners=(s:Scenario,st:State,id:string)=>V.toLegacyPartners(C.partners(scenario(s),state(st),id));
export const playerView=(s:Scenario,g:Game)=>V.toLegacyPlayerView(C.playerView(scenario(s),game(g)));
export const replay=(s:Scenario,actions:Action[],width=360)=>V.toLegacyGame(C.replay(scenario(s),actions.map(V.fromLegacyAction),width));
export const checkpoint=(s:Scenario,id:string,width=360)=>V.toLegacyGame(C.checkpoint(scenario(s),id,width));
export const restore=(s:Scenario,raw:string)=>V.toLegacyGame(C.restore(scenario(s),raw));
export const resizeGame=(g:Game,width:number)=>V.toLegacyGame(C.resizeGame(game(g),width));
export const cumulativeMetrics=(events:Event[])=>C.cumulativeMetrics(events.map(V.fromLegacyEvent));
