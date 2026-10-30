/** Single-label successor to the frozen de237893 clarity-repairs helper.
 * Calvin's explicit objection is a premise, not an unanswered rhetorical question. */
import type {Scenario} from '../../schema/campaign.ts';
export const calvinQuestionBefore='Calvin: what permits asking dead saints for prayer, when Christ already speaks for us before God?';
export const calvinObjectionAfter='Calvin: asking dead saints for prayer lacks biblical permission and obscures Christ’s unique work of speaking for us before God';
export function applyDivinityCalvinAssertion(source:Scenario):Scenario{
 const s=structuredClone(source),item=s.items.find(i=>i.id==='saint-warrant-question');
 if(item?.label!==calvinQuestionBefore)throw new Error('Apply the Calvin assertion only after the frozen Divinity clarity repairs');
 item.label=calvinObjectionAfter;
 return s;
}
