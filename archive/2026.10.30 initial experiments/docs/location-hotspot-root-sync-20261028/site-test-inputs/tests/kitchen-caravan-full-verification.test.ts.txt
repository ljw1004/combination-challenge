import test from 'node:test';import assert from 'node:assert/strict';
import {verify} from '../experiments/tangible-campaign/integration/kitchen-caravan-checks.ts';
test('Food: full 48 current-runtime routes, 189 recipes, 21 checkpoints and exhaustive supper-loading cases',()=>{const r=verify();assert.equal(r.summary.fullReplays,48);assert.equal(r.summary.totalAcceptedActions,10428);assert.equal(r.summary.stationarySameKitchenTransitions,480);assert.equal(r.summary.maxVisibleThingsAndLocations,37);});
