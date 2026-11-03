import type {Frame,MenuChoice} from './adventure.ts';

export interface Reflection {effect:string; reaction:string}
export interface Decision {step:number; reason:string; choice:number; expectation:string; alternatives:{choice:MenuChoice;reason:string}[]}
export interface LookReply {step:number;choice:'L'}
export interface Evidence {text:string; steps:number[]}
export type Report = Record<'mostWorthwhile'|'leastWorthwhile'|'surprise'|'arbitrary'|'continue',Evidence>;
export type DecisionReply = Decision & Partial<Reflection>;
export type FinalReply = {step:number;report:Report} & Partial<Reflection>;
export type Reply = DecisionReply | FinalReply | LookReply;

export function object(value:unknown,where:string):Record<string,unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${where} must be an object.`);
  return value as Record<string,unknown>;
}
export function words(value:unknown,where:string):asserts value is string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${where} must be nonempty text.`);
}
export function keys(value:Record<string,unknown>,names:string[],where:string) {
  if (Object.keys(value).some(key => !names.includes(key)) || names.some(key => !(key in value))) throw new Error(`${where} must contain exactly: ${names.join(', ')}.`);
}
export function references(value:unknown,steps:number[],where:string):asserts value is number[] {
  if (!Array.isArray(value) || value.some(n => !steps.includes(n)) || new Set(value).size !== value.length) throw new Error(`${where} must cite existing gameplay steps without duplicates.`);
}
export function evidence(value:unknown,steps:number[],where:string) {
  const item = object(value,where); keys(item,['text','steps'],where); words(item.text,`${where}.text`); references(item.steps,steps,`${where}.steps`);
}
/** Validate the complete reply before either reflecting on or applying a move. */
export function validateReply(value:unknown,frame:Frame,steps:number[],final:boolean,reflectionRequired:boolean):Reply {
  const reply = object(value,'Reply'), reflection = reflectionRequired ? ['effect','reaction'] : [];
  if (reply.step !== frame.step) throw new Error(`Respond to step ${frame.step}; the supplied step is stale or missing.`);
  if (!final && reply.choice === 'L') {
    keys(reply,['step','choice'],'Look request');
    if (!frame.options.some(option => option.choice === 'L')) throw new Error('Choose an option from the current menu.');
    return {step:frame.step,choice:'L'};
  }
  keys(reply,[...reflection,'step',...(final ? ['report'] : ['reason','choice','expectation','alternatives'])],'Reply');
  for (const field of reflection) words(reply[field],field);
  if (final) {
    const report = object(reply.report,'report');
    const fields = ['mostWorthwhile','leastWorthwhile','surprise','arbitrary','continue'];
    keys(report,fields,'report'); for (const field of fields) evidence(report[field],steps,`report.${field}`);
  } else {
    words(reply.reason,'reason'); words(reply.expectation,'expectation');
    const valid = frame.options.map(o => o.choice);
    if (!valid.includes(reply.choice as MenuChoice)) throw new Error('Choose an option from the current menu.');
    if (!Array.isArray(reply.alternatives)) throw new Error('alternatives must be an array (it may be empty).');
    const considered = new Set<MenuChoice>();
    for (const value of reply.alternatives) {
      const alt = object(value,'alternative'); keys(alt,['choice','reason'],'alternative'); words(alt.reason,'alternative.reason');
      if (!valid.includes(alt.choice as MenuChoice) || alt.choice === reply.choice || considered.has(alt.choice as MenuChoice)) throw new Error('Alternatives must be distinct other choices from this menu.');
      considered.add(alt.choice as MenuChoice);
    }
  }
  return structuredClone(reply) as unknown as Reply;
}
