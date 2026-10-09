/* shortcut: 靜態資料只反映核對日；要提供即時庫存或價格時再接官方資料服務。 */
const data=window.GUIDE;
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let saved=new Set(),storageOK=true,category='all';
try{const raw=JSON.parse(localStorage.getItem('seoul-saved-v1')||'[]');if(Array.isArray(raw))saved=new Set(raw.filter(x=>typeof x==='string'));}catch{storageOK=false;}
const $=id=>document.getElementById(id);
const external=(url,label,cls='')=>`<a class="${cls}" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`;
const sourcesHTML=ids=>(ids||[]).map(id=>{const s=data.sources.find(s=>s.id===id);return s?external(s.url,`來源 ${String(id+1).padStart(2,'0')}`):'';}).join('');
function matches(item,query,area,selected){return(area==='all'||item.area===area)&&(selected==='all'||(selected==='saved'?saved.has(item.id):item.category===selected))&&JSON.stringify(item).toLocaleLowerCase().includes(query.toLocaleLowerCase());}
function card(item){return `<article class="card" id="item-${item.id}"><div class="card-main"><div class="card-top"><div><span class="tag">${escapeHTML(item.badge)}</span><div class="meta">${escapeHTML(item.area)}</div></div><button class="save" data-save="${item.id}" aria-label="收藏 ${escapeHTML(item.title)}" aria-pressed="${saved.has(item.id)}">${saved.has(item.id)?'★':'☆'}</button></div><h3>${escapeHTML(item.title)}</h3><p class="summary">${escapeHTML(item.summary)}</p><div class="review"><b>評價怎麼看</b>${escapeHTML(item.review)}</div><p class="caution">${escapeHTML(item.caution)}</p>${item.price||item.address?`<div class="facts">${item.price?`<p><b>價格／營業參考</b><br>${escapeHTML(item.price)}</p>`:''}${item.address?`<p class="ko"><b>韓文地址</b><br>${escapeHTML(item.address)}</p>`:''}</div>`:''}${item.details?`<details><summary>展開旅行筆記</summary><p>${escapeHTML(item.details)}</p></details>`:''}<div class="source-links">${sourcesHTML(item.sources)}${(item.links||[]).map(l=>external(l.url,l.label)).join(' ')}</div></div><div class="actions">${item.query?external('https://map.naver.com/p/search/'+encodeURIComponent(item.query),'NAVER 地圖搜尋','primary'):''}${item.address?`<button data-copy="${escapeHTML(item.address)}">複製地址</button>`:''}</div></article>`;}
function render(){const list=data.items.filter(item=>matches(item,$('search').value.trim(),$('area').value,category));$('cards').innerHTML=list.map(card).join('');$('count').textContent=`${list.length} 則口袋筆記`;$('empty').hidden=list.length>0;}
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3500);}
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.category;document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));
$('search').addEventListener('input',render);$('area').addEventListener('change',render);
$('reset').addEventListener('click',()=>{$('search').value='';$('area').value='all';document.querySelector('[data-category="all"]').click();});
$('cards').addEventListener('click',async event=>{const save=event.target.closest('[data-save]'),copy=event.target.closest('[data-copy]');if(save){const id=save.dataset.save;const active=!saved.has(id);active?saved.add(id):saved.delete(id);try{localStorage.setItem('seoul-saved-v1',JSON.stringify([...saved]));storageOK=true;}catch{storageOK=false;}save.setAttribute('aria-pressed',String(active));save.textContent=active?'★':'☆';if(category==='saved')render();toast(storageOK?(active?'已加入這台裝置的收藏':'已移除收藏'):'瀏覽器無法儲存，收藏僅在本次頁面有效');}if(copy){try{await navigator.clipboard.writeText(copy.dataset.copy);toast('已複製韓文地址');}catch{toast('無法自動複製，請長按卡片內的韓文地址');}}});
function showView(){const name=location.hash.slice(1)||'guide';const view=['guide','plan','wishlist','airport','sources'].includes(name)?name:'guide';document.querySelectorAll('.view').forEach(s=>s.hidden=s.id!==view);document.querySelectorAll('[data-view]').forEach(a=>{if(a.dataset.view===view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
window.addEventListener('hashchange',showView);
$('days').innerHTML=data.days.map(d=>`<article class="day"><div class="date">${escapeHTML(d.date)}<small>${escapeHTML(d.label)}</small></div><div><h3>${escapeHTML(d.title)}</h3><p class="route">${escapeHTML(d.route)}</p><ul>${d.steps.map(s=>`<li>${escapeHTML(s)}</li>`).join('')}</ul><p class="caution">${escapeHTML(d.note)}</p>${(d.links||[]).map(l=>external(l.url,l.label)).join(' · ')}</div></article>`).join('');
$('practical').innerHTML=data.practical.map(p=>`<article><span class="tag">${escapeHTML(p.badge)}</span><h3>${escapeHTML(p.title)}</h3><ol>${p.steps.map(s=>`<li>${escapeHTML(s)}</li>`).join('')}</ol><p class="caution">${escapeHTML(p.note)}</p><div class="source-links">${(p.links||[]).map(l=>external(l.url,l.label)).join(' ')}${sourcesHTML(p.sources)}</div></article>`).join('');
$('source-list').innerHTML=data.sources.map(s=>`<div class="source-row"><span class="number">${String(s.id+1).padStart(2,'0')}</span><details><summary>${escapeHTML(s.title)}<span class="status">${escapeHTML(s.status)}</span></summary><p>${escapeHTML(s.summary)}</p><p class="muted">閱讀範圍：${escapeHTML(s.scope)}</p>${external(s.url,'查看原始連結')}</details></div>`).join('');
const unavailable=data.sources.filter(s=>s.status==='無法取得'||s.status==='連結失效').length;
$('source-stats').textContent=`${data.sources.length} 個連結已嘗試開啟 · ${data.sources.length-unavailable} 則取得部分或完整內容 · ${unavailable} 則無法取得。另有 DUO 卸妝膏未附連結，尚未確認產品。`;

function renderShopping(){
  $('shopping-list').innerHTML=data.wishlist.map(item=>`<article class="check-row"><label><input type="checkbox" data-buy="${escapeHTML(item.id)}" ${saved.has('buy-'+item.id)?'checked':''}><span>${escapeHTML(item.title)}</span></label><p class="meta">${escapeHTML(item.when)}</p><p>${escapeHTML(item.note)}</p><div class="source-links">${item.links.map(l=>external(l.url,l.label)).join(' ')}</div></article>`).join('');
  $('shopping-count').textContent=`已完成 ${data.wishlist.filter(item=>saved.has('buy-'+item.id)).length} / ${data.wishlist.length} 項`;
}
$('shopping-list').addEventListener('change',event=>{
  const input=event.target.closest('[data-buy]');if(!input)return;
  const id='buy-'+input.dataset.buy;input.checked?saved.add(id):saved.delete(id);
  try{localStorage.setItem('seoul-saved-v1',JSON.stringify([...saved]));storageOK=true;}catch{storageOK=false;}
  $('shopping-count').textContent=`已完成 ${data.wishlist.filter(item=>saved.has('buy-'+item.id)).length} / ${data.wishlist.length} 項`;
  toast(storageOK?'採買進度已儲存':'瀏覽器無法儲存，勾選僅在本次頁面有效');
});
renderShopping();

showView();render();
