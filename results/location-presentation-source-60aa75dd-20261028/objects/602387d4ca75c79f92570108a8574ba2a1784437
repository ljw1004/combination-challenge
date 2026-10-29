import {applyChapterPolicies} from './campaign-reactivity.ts';
import type {Milestone, Scenario} from '../schema/scenario.ts';

/** Optional presentation rewards, kept outside frozen authored recipe graphs.
 * Only these two current worlds opt in. No uniform quota, predecessor backfill or cooking rewards. */
export const campaignMilestones:Record<string,Milestone[]> = {
  "mars-connected-survival-v4-return-cargo-research": [
    {
      "id": "mars-rover",
      "item": "rover",
      "when": "functional",
      "capability": "solar-travel",
      "title": "The horizon opens",
      "text": "Sunlight becomes motion. The ground beyond camp is no longer only something to look at; we can go there."
    },
    {
      "id": "mars-water",
      "item": "camp-water-system",
      "when": "created",
      "title": "Water, on tap",
      "text": "A reserve becomes a working water circuit. What we once carried by hand can now flow through the camp."
    },
    {
      "id": "mars-oxygen",
      "item": "oxygen-plant",
      "when": "functional",
      "capability": "oxygen-production",
      "title": "From this world, a way home",
      "text": "The plant is ready to turn the air of Mars into oxygen. What once had to come from Earth can now begin here."
    }
  ],
  "elements-house-and-craft-v1": [
    {
      "id": "elements-plant",
      "item": "plant",
      "when": "created",
      "title": "The world takes root",
      "text": "Fruits of the orchard, grain of the field, flowers of the meadow. From one green beginning, a world of living possibilities."
    },
    {
      "id": "elements-wheel",
      "item": "wheel",
      "when": "created",
      "title": "The world begins to turn",
      "text": "Loads can roll, clay can turn, and motion can pass from one mechanism to another. A circle opens a thousand paths."
    },
    {
      "id": "elements-grain-mill",
      "item": "grain-mill",
      "when": "created",
      "title": "The river lends its strength",
      "text": "The wheel, gearing and stones are joined. The river can now lend its strength to the work of feeding a village."
    },
    {
      "id": "elements-iron",
      "item": "iron",
      "when": "created",
      "title": "A new age in our hands",
      "text": "From stubborn rock comes metal we can shape. Edges, hinges, fastenings and ringing bells lie within reach."
    },
    {
      "id": "elements-sailboat",
      "item": "sailboat",
      "when": "created",
      "title": "The wind becomes a road",
      "text": "A craft ready to catch the wind. Across the water, distant neighbours no longer seem so far away."
    },
    {
      "id": "elements-printed-invitations",
      "item": "printed-invitations",
      "when": "created",
      "title": "One voice, many pages",
      "text": "One carved message, many impressions. An invitation can now reach far beyond the hand that made it."
    },
    {
      "id": "elements-microscope",
      "item": "microscope",
      "when": "created",
      "title": "Beyond the naked eye",
      "text": "A new window opens onto the very small. Even a drop of pond water may hold a world worth exploring."
    },
    {
      "id": "elements-soap",
      "item": "soap",
      "when": "created",
      "title": "Care, made tangible",
      "text": "Not every great invention towers over us. Some wait beside a basin, changing the small rituals of everyday life."
    },
    {
      "id": "elements-clock",
      "item": "clock",
      "when": "created",
      "title": "A rhythm we can share",
      "text": "Turning wheels give the hours a face. Journeys and meetings can now keep time together."
    }
  ]
};

/** Never mutate a registered scenario or overwrite directly authored metadata. */
export function applyMilestones(s:Scenario):Scenario {
 const milestones=s.milestones??campaignMilestones[s.id];
 return applyChapterPolicies(milestones?{...s,milestones}:s);
}

/** Shared entry point for UI, a logical playtester or any headless replay. */
export function getPlayableScenario(id:string,catalog:readonly Scenario[]):Scenario|undefined {
 const scenario=catalog.find(s=>s.id===id);return scenario?applyMilestones(scenario):undefined;
}
