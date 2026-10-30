import {readSiteSourceForRootTests,writeRootTestOutput} from '../scripts/site-source-test-context.ts';
const readFileSync=readSiteSourceForRootTests;
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync as originalReadFileSync} from 'node:fs';
import {locationHarness} from '../experiments/tangible-campaign/ui/location-controller-harness.ts';import {fixture} from './location-story-model.test.ts';
const css=readFileSync(new URL('../experiments/tangible-campaign/ui/campaign.css',import.meta.url),'utf8');
test('objective text remains full-strength through pointer down, move, cancel and successful drop; tiles alone may cover it',()=>{
 const h=locationHarness(fixture());h.click(h.button('close'));const board=()=>h.doc.querySelector('.board');
 // This authored-rule/DOM assertion is not a browser computed-style claim.
 // A separate source-owned CUA check inspects actual computed styles.
 for(const [,selectors,decl]of css.matchAll(/([^{}]+)\{([^{}]*)\}/g))if(selectors.includes('.is-dragging')&&(selectors.includes('.hud-stack')||selectors.includes('.objective')||selectors.trim()==='.is-dragging *'))assert(!/\b(opacity|visibility|display|filter|color)\s*:/.test(decl),selectors+' must not visually suppress the HUD');
 const initial=h.button('purpose').textContent;assert(initial.trim());
 const visible=(dragging:boolean)=>{const purpose=h.button('purpose'),hud=purpose.closest('.hud-stack');assert(hud);assert.equal(h.app.classList.contains('is-dragging'),dragging);assert.equal(purpose.textContent.replace(/^[○✓] /,''),initial.replace(/^[○✓] /,''),'objective wording stays readable; only legitimate completion marker may change');for(const e of [purpose,hud]){assert(!e.hidden);assert(!e.classList.contains('hidden'));assert(!/opacity:\s*(?:0(?:\.\d+)?|\.\d+)\b|visibility:\s*hidden|display:\s*none/.test(e.getAttribute('style')??''));}assert.match(css,/\.hud-stack\{position:fixed;z-index:2;/);assert.match(css,/\.thing\{[^}]*z-index:3;/);assert(purpose.closest('.board'));};
 const press=()=>board().onpointerdown({target:h.thing('a'),button:0,clientX:52,clientY:100,pointerId:1,preventDefault(){}}),move=()=>board().onpointermove({clientX:210,clientY:220,pointerId:1});
 visible(false);press();visible(false);h.setHit(h.thing('b'));move();visible(true);board().onpointercancel({pointerId:1});visible(false);assert(!h.thing('c'));
 h.advanceTime(500);press();visible(false);h.setHit(h.thing('b'));move();visible(true);board().onpointerup({clientX:210,clientY:220,pointerId:1});visible(false);assert(h.thing('c'));assert(h.button('chapter-next'));assert.equal(h.state().state.stage,0,'drop does not automatically leave the readable objectives');
});
