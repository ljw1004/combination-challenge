import {scenario as reviewedPredecessor} from './atlas-civilization.ts';

/** Narrow source/Read repair after independent review; frozen v1 stays intact. */
export const scenario=structuredClone(reviewedPredecessor);
scenario.id='atlas-civilization-connected-v2-reviewed-20261029';
const cartography={
 id:'civ-usgs-projection-use',
 title:'USGS: How are different map projections used?',
 url:'https://www.usgs.gov/faqs/how-are-different-map-projections-used',
 note:'Authoritative support for navigation-oriented projections and Mercator high-latitude area distortion. This reference supports cartographic properties, not a claimed historical transmission from Renaissance painting.',
};
scenario.sources!.push(cartography);
for(const id of ['bearing-priority','bearing-chart','polar-stretch','projection-tradeoff']){
 const card=scenario.items.find(i=>i.id===id)!;
 card.sources=[cartography.id];
 card.reading={text:card.description!,attribution:'Authored cartographic teaching reconstruction; not a quotation. Source: '+cartography.title};
}
for(const id of ['civ-direct-bearing-chart','make-projection-tradeoff']){
 scenario.recipes.find(r=>r.id===id)!.sources=[cartography.id];
}
const coordinates={id:'civ-nga-coordinates',title:'NGA Office of Geomatics: Coordinate Systems, grids and geographic references',url:'https://earth-info.nga.mil/?action=coordsys&dir=coordsys',note:'Authoritative explanation of locating places by latitude and longitude. Supports the geographic reference concept, not the date or origin of historical coordinate systems.'};
scenario.sources!.push(coordinates);
for(const id of ['coordinate-grid','mapped-globe']){
 const card=scenario.items.find(i=>i.id===id)!;card.sources=[coordinates.id];
 card.reading={text:card.description!,attribution:'Authored geographic teaching reconstruction; not a quotation. Source: '+coordinates.title};
}
scenario.recipes.find(r=>r.id==='make-mapped-globe')!.sources=[coordinates.id];
const rights=scenario.items.find(i=>i.id==='universal-rights')!;
rights.description='A rights declaration can be compared with shared humanity or political consent: whom does its universal claim include in practice? These comparisons do not assert a single historical origin or automatic equal treatment.';
rights.sources=[...rights.sources!,'civ-locke'];
rights.reading={text:rights.description,attribution:'Authored comparative reconstruction; not a quotation. Sources: '+rights.sources.map(id=>scenario.sources!.find(source=>source.id===id)!.title).join('; ')};
// No new objective: preserve the independently tested graph and presentation.
scenario.notes!.push('Independent-review source repair: the chart/bearing/distortion branch cites cartography, not painting; the shared rights item describes both legitimate comparison routes and attributes Locke. Labels, tasks, graph, lifecycles, location stock and carry remain unchanged.');
