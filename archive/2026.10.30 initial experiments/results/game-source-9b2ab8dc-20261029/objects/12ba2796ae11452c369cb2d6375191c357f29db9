import {configureCampaignPage} from './campaign-page-catalogue.ts';
import {scenario as previous} from './stories/mars-creature-field-scenes.ts';
import {creature} from './stories/current-ux-content.ts';
// Optional launch data only. The exact old query/save still selects its snapshot.
configureCampaignPage({scenarios:[previous,creature],featuredScenarioIds:[creature.id],presentationFor:s=>({title:s===previous?'Snapshot: '+s.title:s.title,premise:s.premise})});
void import('./campaign-main.ts');
