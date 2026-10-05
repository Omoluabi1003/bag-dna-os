import assert from 'node:assert/strict';
import { test } from 'node:test';
import { corridorDistanceKm, distanceKm, eventCurrent, filterRegionalEvents, parseRegionalEvents, sourceFresh, type ContextFeed } from '../lib/intelligence/regionalContext';
import { getRegionalContext } from '../lib/integrations/regionalContext';
const now=Date.now();
const quake=(id='q1',longitude=3.3212,latitude=6.5774)=>({id,properties:{time:now,mag:5,title:'Regional quake',url:'https://earthquake.usgs.gov/earthquakes/eventpage/q1'},geometry:{coordinates:[longitude,latitude]}});
test('reject malformed collections, invalid positions, null numbers and unsafe links',()=>{
 assert.throws(()=>parseRegionalEvents('earthquakes',{}));
 assert.equal(parseRegionalEvents('earthquakes',{features:[quake()]}).length,1);
 assert.equal(parseRegionalEvents('earthquakes',{features:[quake('bad',190)]}).length,0);
 const bad=quake();bad.properties.url='https://evil.example/';assert.equal(parseRegionalEvents('earthquakes',{features:[bad]}).length,0);
 assert.equal(parseRegionalEvents('earthquakes',{features:[{...quake(),geometry:{coordinates:[null,0]}}]}).length,0);
 assert.equal(parseRegionalEvents('earthquakes',{features:[quake(),quake()]}).length,1);
});
test('NASA uses latest valid point observation and never treats polygon as airport position',()=>{
 const e={id:'e1',title:'Storm',link:'https://eonet.gsfc.nasa.gov/api/v3/events/e1',categories:[{title:'Severe Storms'}],geometry:[{type:'Point',date:new Date(now-1000).toISOString(),coordinates:[0,0]},{type:'Point',date:new Date(now).toISOString(),coordinates:[3,6]},{type:'Polygon',date:new Date(now+100).toISOString(),coordinates:[[[1,2]]]}]};
 const out=parseRegionalEvents('natural-events',{events:[e]});assert.equal(out[0].longitude,3);assert.equal(out[0].category,'Severe Storms');
});
test('airport radius, magnitude filtering, endpoint clamps and dateline corridor work',()=>{
 const events=parseRegionalEvents('earthquakes',{features:[quake()]});
 assert.equal(filterRegionalEvents(events,{latitude:6.5774,longitude:3.3212},undefined,100,4).length,1);
 assert.equal(filterRegionalEvents(events,{latitude:25,longitude:-80},undefined,100,4).length,0);
 assert.equal(filterRegionalEvents(events,{latitude:6.5774,longitude:3.3212},undefined,100,6).length,0);
 assert(distanceKm({latitude:0,longitude:179},{latitude:0,longitude:-179})<225);
 assert(corridorDistanceKm({latitude:0,longitude:180},{latitude:0,longitude:170},{latitude:0,longitude:-170})<0.01);
 assert(corridorDistanceKm({latitude:0,longitude:30},{latitude:0,longitude:0},{latitude:0,longitude:10})>2200);
});
test('freshness separates retrieval from observations and excludes future or stale evidence',()=>{
 const event=parseRegionalEvents('earthquakes',{features:[quake()]})[0];
 const feed:ContextFeed={layer:'earthquakes',status:'available',retrievedAt:new Date(now).toISOString(),events:[event]};
 assert(sourceFresh(feed,now));assert(!sourceFresh(feed,now+900000));assert(!sourceFresh({...feed,status:'unavailable'},now));
 assert(eventCurrent(event,now));assert(!eventCurrent(event,now-1));assert(!eventCurrent(event,now+86400000));
});
test('deduplicate simultaneous requests and return honest unavailable state',async()=>{
 const original=globalThis.fetch;let calls=0;
 globalThis.fetch=async(url)=>{calls++;if(String(url).includes('nasa'))throw new Error('offline');return new Response(JSON.stringify({features:[quake()]}));};
 try {
 const [a,b]=await Promise.all([getRegionalContext('earthquakes'),getRegionalContext('earthquakes')]);assert.equal(calls,1);assert.equal(a,b);assert.equal(a.status,'available');
 const unavailable=await getRegionalContext('natural-events');assert.equal(unavailable.status,'unavailable');assert.deepEqual(unavailable.events,[]);
 }finally{globalThis.fetch=original;}
});
