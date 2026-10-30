import {scenario as previous} from './purpose-copy-workroom.ts';
import {physicalLocationSuccessor} from './physical-location-plan.ts';
/** The existing two rooms, with both commissions sharing the unchanged workroom. */
export const scenario=physicalLocationSuccessor(previous,'copy','copy-workroom-locations-v2');
const chest=scenario.hotspots.find(h=>h.id==='printer-chest')!;
chest.label='Completed-orders chest';
chest.description='The workroom’s chest is ready for completed orders from the first arrival. Place the block that prints the travelling customer’s design here for delivery.';
scenario.locationPlan!.visits.find(v=>v.locationId==='P02')!.carry=['master','papers'];
