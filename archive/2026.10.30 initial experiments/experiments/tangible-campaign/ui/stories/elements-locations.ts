import {scenario as previous} from './elements-house-and-craft.ts';
import {physicalLocationSuccessor} from './physical-location-plan.ts';
/** Geography-only successor: map/float/tower proposals are not silently enacted. */
export const scenario=physicalLocationSuccessor(previous,'elements','elements-river-locations-v2');
scenario.notes!.push('Retains the original map, ceramic-float and tower recipe families. Their separately recorded forward-naturalness concerns remain unresolved; this presentation overlay does not claim to fix them.');
