/** Narrow additive successor to the frozen b93b1c97 wording overlay.
 * Apply after applyDivinityClarity; neither helper mutates its input. This
 * exposes missing premises and one already-required intermediate, not new recipes. */
import type {Scenario} from '../../schema/campaign.ts';
export const divinityClarityRepairLabels:Record<string,string>={
 'baptism-appointed':'Aquinas: God chose baptism with water to give inward grace, not just wash the body',
 'instituted-baptism':'Aquinas: God appointed baptism with water to give grace—new life within the soul',
 'nature-perfected-line':'Aquinas: “grace does not destroy nature, but perfects it” — gloss: God’s help develops human powers rather than erasing them',
 'unbelieving-guest':'Case: a Communion guest eats the bread without trusting Christ’s promise',
 'guest-not-maker':'Luther: even an unbelieving Communion guest receives Christ’s body with the bread',
 'faith-benefit':'Luther: Communion’s promised forgiveness is received only through faith—trust in Christ’s promise',
 'received-not-benefited':'Luther: the unbelieving Communion guest receives Christ’s body, not the promised forgiveness',
 'trent-no-price':'Council of Trent: being made right with God for the first time is not earned by faith or deeds',
 'response-not-price':'Trent council: an adult’s response does not earn being made right with God for the first time',
 'trent-growth':'Trent council: later deeds, helped by God, deepen received righteousness—our renewed inner life with God',
 'luther-fruit':'Luther: deeds can train us, but do not make a Christian more holy before God',
 'works-dispute':'Trent and Luther dispute how deeds affect holiness before God—not whether conduct can improve',
 'calvin-hearing':'Calvin: asking dead saints for prayer lacks biblical permission and obscures Christ’s unique role before God',
 'saint-warrant-question':'Calvin: what permits asking dead saints for prayer, when Christ already speaks for us before God?',
 'agency-not-permission':'God can use helpers; Calvin still says asking dead saints for prayer lacks biblical permission and sidelines Christ',
};
export const divinityClarityRepairReadings:Record<string,string>={
 'nature-perfected-line':'Here grace means God’s gift of help, and nature means human powers such as reasoning and willing—not the countryside. Aquinas says that help fulfils those powers rather than wiping them out.\n\nHis immediate example is reason serving faith, and he also compares willing and love. Perfecting is not a promise that a person becomes incapable of error. Comparing this with Augustine’s aided actor does not settle every question about free choice.',
 'guest-not-maker':'In Luther’s account of Communion, even the guest who does not believe receives Christ’s body with the bread. Christ’s words establish what is given; the guest’s disbelief does not undo it.\n\nThis answers what is received. Whether receiving it brings the promised forgiveness is a separate question.',
 'faith-benefit':'For Luther, the promised forgiveness in Communion is received through faith: trusting Christ’s promise that the gift is for you. Merely eating does not supply that trust.\n\nThe promised benefit also nourishes and strengthens faith. Luther distinguishes receiving Christ’s body from receiving that benefit; this card adds no claim about punishment.',
 'response-not-price':'The Council of Trent describes adults genuinely responding to God’s prior help. That response does not earn their first being made right with God.\n\nThis is the initial gift of justification, not a claim about infants or every later role of good deeds. The comparison concerns real response versus earning; it does not infer a requirement merely from the ability to refuse.',
 'trent-growth':'For Trent, righteousness includes God renewing the person within, not merely a change in reputation. After the initial gift, good deeds made possible by God’s help increase this received righteousness.\n\nThis is the council’s account of growth in justification. It is not just the observation that repeated practice can improve someone’s outward behaviour, and it does not say people begin by earning salvation.',
 'luther-fruit':'In Christian Liberty, Luther gives deeds a role in training the body and serving others, but denies that those deeds make an already-Christian person more holy before God.\n\nHis bishop comparison makes the distinction: doing the bishop’s work does not make the bishop more consecrated. The text allows growth of faith and love, so this is not a denial of all growth or better conduct.',
 'works-dispute':'Trent says grace-enabled deeds increase the righteousness God has already given, including inward renewal. Luther’s text denies that deeds make an already-Christian person more holy before God, while still valuing bodily training and service.\n\nThe dispute concerns how deeds contribute to a person’s life before God. It is not simply about whether behaviour can improve, and it does not assume their accounts of righteousness are identical in every other respect.',
 'agency-not-permission':'God’s working through baptism shows a possible role for created means; water is not a person being asked for prayer. That example does not authorize addressing departed saints.\n\nCalvin affirms Christ’s unique, continuing work of bringing people before God. He says asking departed saints lacks biblical permission and obscures that work. He is objecting to the practice, not doubting Christ’s role.',
};
export function applyDivinityClarityRepairs(source:Scenario):Scenario{
 if(source.items.find(i=>i.id==='gift-acceptance')?.label!=='Luther: faith (trust in Christ), not good deeds, makes us right with God')throw new Error('Apply Divinity clarity repairs after the frozen clarity overlay');
 const s=structuredClone(source);
 for(const [id,label]of Object.entries(divinityClarityRepairLabels)){const item=s.items.find(i=>i.id===id);if(!item)throw new Error(`Unknown Divinity repair item ${id}`);item.label=label;}
 for(const [id,text]of Object.entries(divinityClarityRepairReadings)){const item=s.items.find(i=>i.id===id);if(!item?.reading)throw new Error(`Missing Divinity repair reading ${id}`);item.reading.text=text;item.description=text.split('\n\n')[0];}
 const baptism=s.chapters.find(c=>c.id==='axe-and-water')!,comparison=baptism.objectives.find(o=>o.item==='rites-different')!;
 const intermediateId='axe-and-water-baptism-explained';
 if(baptism.objectives.some(o=>o.id===intermediateId))throw new Error('Divinity clarity repairs already applied');
 baptism.objectives.unshift({id:intermediateId,kind:'create',item:'instrumental-baptism',intermediate:true,text:'For Aquinas, how can baptism’s water give inward grace?'});
 comparison.after=[...comparison.after??[],intermediateId];
 const objectives:Record<string,string>={
  'received-not-benefited':'For Luther, what does an unbelieving Communion guest receive?',
  'response-not-price':'Does an adult’s response earn their first acceptance by God?',
  'works-dispute':'Do later deeds deepen holiness before God—not merely improve conduct?',
  'agency-not-permission':'Does God’s use of helpers authorize asking dead saints for prayer?',
 };
 for(const chapter of s.chapters)for(const objective of chapter.objectives)if(objective.item&&objectives[objective.item])objective.text=objectives[objective.item];
 return s;
}
