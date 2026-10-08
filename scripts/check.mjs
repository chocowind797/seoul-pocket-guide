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
