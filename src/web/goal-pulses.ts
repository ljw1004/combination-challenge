import type {Story} from '../story/types.ts';
import type {State} from '../engine/types.ts';
import {chapterComplete} from '../engine/game.ts';
import {goalDistanceKey} from '../engine/nearest-goal.ts';
import {displayedGoals} from './chapter-session.ts';

interface Environment {blocked: boolean; tutorial: boolean; reducedMotion: boolean}
const reminderPickups = 6;
export const goalPulseDuration = 800;

/** Session-only attention feedback, concurrent with play and disposable on change. */
export class GoalPulses {
  private story?: Story;
  private state?: State;
  private signatures: string[] = [];
  private pending = new Set<number>();
  private animations = new Map<number, {animation: Animation; changed: boolean}>();
  private cancelSearch?: () => void;
  private rankingKey?: string;
  private rankedId?: string;
  private pickups = 0;
  private turn = 0;
  private eligibleTurn = 0;
  private wonderKey?: string;

  constructor(private root: HTMLElement, private environment: () => Environment) {}

  reset() {
    this.cancelSearch?.(); this.cancelSearch = undefined; this.stopAnimations();
    this.story = undefined; this.state = undefined; this.signatures = []; this.pending.clear();
    this.rankingKey = undefined; this.rankedId = undefined;
    this.pickups = 0; this.turn = 0; this.eligibleTurn = 0; this.wonderKey = undefined;
  }

  observe(story: Story, state: State) {
    if (this.story !== story || this.state?.chapter !== state.chapter) this.reset();
    const rows = displayedGoals(story,state), signatures = rows.map(({goal,done}) => `${goal.id}:${done}`);
    const changed = this.signatures.length ? signatures.flatMap((signature,index) => signature !== this.signatures[index] ? [index] : []) : [];
    if (changed.length) {
      // The latest change replaces older attention feedback, including on other rows.
      this.stopAnimations(); this.pending = new Set(changed);
    }
    this.story = story; this.state = state; this.signatures = signatures;
    const key = goalDistanceKey(state);
    if (key !== this.rankingKey) {
      this.cancelSearch?.(); this.cancelSearch = undefined;
      this.rankingKey = key; this.rankedId = undefined;
      if (!chapterComplete(story,state)) this.prepareReminder();
    }
    if (chapterComplete(story,state)) this.stopAnimations(true);
  }

  /** Count the pickup immediately. Later release or cancellation cannot postpone it. */
  pickup() { this.turn++; this.pickups++; this.update(); }

  resetCounter() { this.pickups = 0; this.pending.clear(); this.stopAnimations(); }

  refreshMotion() { this.stopAnimations(); this.update(); }

  wonder(key: string) {
    if (this.wonderKey === key) return;
    this.wonderKey = key; this.eligibleTurn = this.turn + 2;
    // A changed goal outranks a wonder. Only periodic reminders yield to it.
    this.stopAnimations(true);
  }

  update() {
    if (!this.story || !this.state) return;
    const env = this.environment();
    if (env.blocked || env.tutorial) {
      this.stopAnimations();
      if (chapterComplete(this.story,this.state)) this.pending.clear();
      return;
    }
    if (this.pending.size) {
      const indices = [...this.pending]; this.pending.clear(); this.stopAnimations();
      this.pulse(indices,true); return;
    }
    if (chapterComplete(this.story,this.state)) return;
    if (this.turn < this.eligibleTurn) {this.stopAnimations(true); return;}
    if (this.pickups < reminderPickups) return;
    const rows = displayedGoals(this.story,this.state);
    const ranked = rows.findIndex(row => !row.done && row.goal.id === this.rankedId);
    const index = ranked >= 0 ? ranked : rows.findIndex(row => !row.done);
    if (index >= 0) {this.stopAnimations(); this.pulse([index],false);}
  }

  private stopAnimations(remindersOnly = false) {
    for (const [index,{animation,changed}] of this.animations) {
      if (remindersOnly && changed) continue;
      this.animations.delete(index); animation.cancel();
    }
  }

  private prepareReminder() {
    const story = this.story!, state = this.state!, key = this.rankingKey;
    const rows = displayedGoals(story,state).filter(row => !row.done);
    this.rankedId = rows[0]?.goal.id;
    if (rows.length < 2) return;
    // Prepare the ranking before it is needed. A pickup never waits for a worker;
    // if the current state's result is not ready, it uses the top unfinished row.
    let worker: Worker;
    try { worker = new Worker(new URL('./goal-worker.ts',import.meta.url),{type:'module'}); }
    catch {return;}
    let active = true;
    const timeout = setTimeout(() => finish(),250);
    this.cancelSearch = () => {active = false; clearTimeout(timeout); worker.terminate();};
    const finish = (id?: string) => {
      if (!active) return;
      this.cancelSearch?.(); this.cancelSearch = undefined;
      if (this.story === story && this.rankingKey === key && rows.some(row => row.goal.id === id)) this.rankedId = id;
    };
    worker.onmessage = (event: MessageEvent<string | undefined>) => finish(event.data);
    worker.onerror = event => {event.preventDefault(); finish();};
    try {worker.postMessage({story,state:{...state,actions:[],pending:[],seen:[]}});}
    catch {finish();}
  }

  private pulse(indices: number[], changed: boolean) {
    const reduced = this.environment().reducedMotion;
    for (const index of indices) {
      const row = this.root.querySelector<HTMLElement>(`[data-goal-row="${index}"]`);
      if (!row) continue;
      const style = getComputedStyle(row), bounds = row.getBoundingClientRect(), host = this.root.getBoundingClientRect();
      // Long goals stay inside the game pane at full expansion; no text reflows.
      const room = Math.max(0,Math.min(bounds.left-host.left,host.right-bounds.right)-4);
      const scale = Math.min(1.2,1+2*room/Math.max(1,bounds.width));
      const rest: Keyframe = {backgroundColor:style.backgroundColor,color:style.color,boxShadow:style.boxShadow};
      const peak: Keyframe = {backgroundColor:'#ffd24a',color:'#302000',boxShadow:'0 0 18px 5px #ffc94d99'};
      if (!reduced) {rest.transform = 'scale(1)'; peak.transform = `scale(${scale})`;}
      const animation = row.animate([{...rest,offset:0,easing:'ease-out'},{...peak,offset:.22,easing:'ease-in-out'},{...rest,offset:1}],{duration:goalPulseDuration});
      animation.id = 'goal-pulse'; this.animations.set(index,{animation,changed});
      void animation.finished.then(() => {
        if (this.animations.get(index)?.animation !== animation) return;
        this.animations.delete(index); this.update();
      },() => {});
    }
    if (this.animations.size) this.pickups = 0;
  }
}
