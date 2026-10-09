import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const context=vm.createContext({window:{}});
vm.runInContext(read('data.js'),context);
const data=context.window.GUIDE;
assert.equal(data.sources.length,60);
assert.equal(new Set(data.sources.map(s=>s.url)).size,60);
assert.equal(new Set(data.items.map(s=>s.id)).size,data.items.length);
data.sources.forEach((s,i)=>{assert.equal(s.id,i);for(const k of ['title','status','summary','scope'])assert.ok(s[k]);assert.ok(/^https?:\/\//.test(s.url));});
const html=read('index.html');
const categories=['food','shopping','glasses','events'];
for(const item of data.items){assert.ok(categories.includes(item.category));assert.ok(html.includes('<option>'+item.area+'</option>'));assert.match(item.id,/^[a-z0-9-]+$/);assert.ok(item.sources.length);for(const id of item.sources)assert.ok(data.sources[id]);for(const k of ['title','summary','review','caution'])assert.ok(item[k]);}
for(const group of [...data.items,...data.days,...data.practical])for(const link of group.links||[])assert.ok(/^https:\/\//.test(link.url));
assert.equal(data.days.length,5);
assert.equal(new Date(data.trip.arrival+'T12:00:00+09:00').getUTCDay(),5);
assert.equal(new Date(data.trip.departure+'T12:00:00+09:00').getUTCDay(),2);
assert.deepEqual(JSON.parse(JSON.stringify(data.sources)),JSON.parse(read('research/source-audit.json')).sources);
const app=read('app.js');
const prefix=app.slice(0,app.indexOf("document.querySelectorAll('[data-category]')"));
for(const raw of ['[]','["optic"]','broken']){
 const ctx=vm.createContext({window:{GUIDE:data},localStorage:{getItem:()=>raw},document:{getElementById:()=>null}});
 vm.runInContext(prefix,ctx);
 assert.equal(vm.runInContext("matches(data.items[0],'OpTiC','all','glasses')",ctx),true);
 assert.equal(vm.runInContext("matches(data.items[0],'','明洞','all')",ctx),false);
 assert.equal(vm.runInContext("matches(data.items[0],'','all','saved')",ctx),raw==='["optic"]');
 assert.equal(vm.runInContext("escapeHTML('<img a=\"x\">&')",ctx),'&lt;img a=&quot;x&quot;&gt;&amp;');
 assert.equal(vm.runInContext('storageOK',ctx),raw!=='broken');
}
console.log(`PASS: ${data.sources.length} sources, ${data.items.length} cards, ${data.days.length} trip days; filters, saved state, escaping, source audit.`);

assert.equal(data.wishlist.length,19);
assert.equal(new Set(data.wishlist.map(x=>x.id)).size,19);
for(const item of data.wishlist){assert.match(item.id,/^[a-z0-9-]+$/);assert.ok(item.title&&item.when&&item.note);for(const link of item.links)assert.ok(/^https:\/\//.test(link.url));}
assert.equal(data.trip.outboundDeparture,'2026-10-09T17:30:00+08:00');
assert.equal(data.trip.returnDeparture,'2026-10-13T07:55:00+09:00');
assert.equal(data.trip.appointment.time,'2026-10-11T11:00:00+09:00');
assert.equal(data.trip.hotel.nights,3);
assert.ok(data.days[2].steps.some(x=>x.includes('11:00 ODE')));
assert.ok(data.days[3].route.includes('仁川 T2'));
assert.ok(html.includes('id="shopping-list"'));
assert.ok(!html.includes('尚未提供住宿、航班'));
console.log('PASS: 19-item purchase list; confirmed flights, clinic and three hotel nights.');

// Exercise the actual checklist handler and reload path without a browser dependency.
function runApp(storage){
  const nodes=new Map();
  const get=id=>{if(!nodes.has(id))nodes.set(id,{value:id==='area'?'all':'',innerHTML:'',textContent:'',classList:{add(){},remove(){}},handlers:{},addEventListener(event,fn){this.handlers[event]=fn;}});return nodes.get(id);};
  const ctx=vm.createContext({window:{GUIDE:data,addEventListener(){}},localStorage:storage,document:{getElementById:get,querySelectorAll:()=>[]},location:{hash:'#wishlist'},setTimeout:()=>1,clearTimeout(){}});
  vm.runInContext(app,ctx);
  return get;
}
let stored='["optic"]';
const storage={getItem:()=>stored,setItem:(_,v)=>{stored=v;}};
let get=runApp(storage);
assert.equal(get('shopping-count').textContent,'已完成 0 / 19 項');
get('shopping-list').handlers.change({target:{closest:()=>({dataset:{buy:'glasses'},checked:true})}});
assert.deepEqual(JSON.parse(stored),['optic','buy-glasses']);
get=runApp(storage);
assert.equal(get('shopping-count').textContent,'已完成 1 / 19 項');
assert.match(get('shopping-list').innerHTML,/data-buy="glasses" checked/);
assert.match(get('cards').innerHTML,/data-save="optic"[^>]*aria-pressed="true"/);
get('shopping-list').handlers.change({target:{closest:()=>({dataset:{buy:'glasses'},checked:false})}});
assert.deepEqual(JSON.parse(stored),['optic']);
const blocked=runApp({getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}});
blocked('shopping-list').handlers.change({target:{closest:()=>({dataset:{buy:'glasses'},checked:true})}});
assert.match(blocked('toast').textContent,/無法儲存/);
assert.equal(blocked('shopping-count').textContent,'已完成 1 / 19 項');
console.log('PASS: checklist toggle, reload persistence, favorite compatibility, storage-denied fallback.');
