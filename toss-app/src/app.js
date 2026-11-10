/* ================= 앱 제어 (화면 이동 · 저장 · 뒤로가기 · 공유) ================= */
const APP_NAME = 'saju-ohaeng';

function haptic(){ try{ generateHapticFeedback({type:'tap'}).catch(()=>{}); }catch(e){} }
let toastT=null;
function toast(msg){ const t=$('toast'); t.textContent=msg; t.hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>{t.hidden=true},2200); }

/* ---------- 저장 ---------- */
const PKEY='saju-profiles-v1', CKEY='saju-current-v1';
let profiles=[];
try{ profiles=JSON.parse(localStorage.getItem(PKEY)||'[]'); if(!Array.isArray(profiles)) profiles=[]; }catch(e){ profiles=[]; }
let curId=null; try{ curId=localStorage.getItem(CKEY); }catch(e){}
function persist(){ try{ localStorage.setItem(PKEY,JSON.stringify(profiles)); if(curId) localStorage.setItem(CKEY,curId); }catch(e){} }
const findP=id=>profiles.find(p=>p.id===id);
const profO=p=>({...p.o,name:p.name});

/* ---------- 화면 이동 ---------- */
let tab='saju';
const stacks={saju:['scr-home'],gh:['scr-gh'],ask:['scr-ask']};
const ROOT_TAB_SHOW={gh:onGhShow,ask:onAskShow,saju:renderSaved};
function paint(){
  document.querySelectorAll('.screen').forEach(s=>{s.hidden=true});
  const top=stacks[tab][stacks[tab].length-1];
  const el=$(top); el.hidden=false;
  const detail=stacks[tab].length>1;
  document.body.classList.toggle('detail',detail);
  el.classList.toggle('no-tab',detail);
  document.querySelectorAll('.tabbar button').forEach(b=>b.setAttribute('aria-current',b.dataset.tab===tab?'page':'false'));
}
function push(id){ stacks[tab].push(id); try{ history.pushState({ait:stacks[tab].length},''); }catch(e){} paint(); window.scrollTo(0,0); }
function popScreen(){ if(stacks[tab].length>1){ stacks[tab].pop(); paint(); if(stacks[tab].length===1){ const f=ROOT_TAB_SHOW[tab]; if(f) f(); } return true; } return false; }
function switchTab(t){ if(t===tab&&stacks[t].length===1) return; tab=t; paint(); window.scrollTo(0,0); const f=ROOT_TAB_SHOW[t]; if(f&&stacks[t].length===1) f(); }
function closeApp(){
  try{ if(Screen&&typeof Screen.close==='function'){ Screen.close().catch(()=>{}); return; } }catch(e){}
  try{ closeView().catch(()=>{}); }catch(e){}
}
// 시스템 뒤로가기: 하위 화면 → 이전 화면, 다른 탭 첫 화면 → 사주 탭, 사주 탭 첫 화면 → 미니앱 종료
function handleBack(){
  if(stacks[tab].length>1){ history.back(); return; }
  if(tab!=='saju'){ switchTab('saju'); return; }
  closeApp();
}
window.addEventListener('popstate',()=>{ popScreen(); });
try{ graniteEvent.addEventListener('backEvent',{ onEvent:handleBack, onError:()=>{} }); }catch(e){}

document.querySelectorAll('.tabbar button').forEach(b=>b.addEventListener('click',()=>{ haptic(); switchTab(b.dataset.tab); }));

/* ---------- 사주 탭: 저장 목록 ---------- */
let editMode=false;
function pillarStr(o){ try{ const r=compute(o), P=r.pillars; return ['year','month','day','hour'].map(k=>P[k]?hz(P[k].s,P[k].b):'').join(' '); }catch(e){ return ''; } }
function renderSaved(){
  $('savedCard').hidden=!profiles.length;
  $('editSaved').textContent=editMode?'완료':'편집';
  $('savedList').innerHTML=profiles.map(p=>{
    let dm=0; try{ dm=compute(p.o).pillars.day.s; }catch(e){}
    const [y,m,d]=p.o.date.split('-');
    const li=p.o.lunarIn;
    const dt=li?`음력 ${li.y}.${li.leap?'윤':''}${li.m}.${li.d}`:`양력 ${y}.${+m}.${+d}`;
    return `<li><span class="avatar el-${ELC[ST_EL[dm]]}">${ST[dm]}</span>
      <button type="button" class="pmain" data-id="${p.id}"><span class="pn">${escapeHtml(p.name)}</span><span class="pd">${dt} · ${p.o.hasTime?p.o.time:'시간 모름'} · ${p.o.g==='M'?'남':'여'}</span><span>${pillarStr(p.o)}</span></button>
      ${editMode?`<button type="button" class="del" data-id="${p.id}">삭제</button>`:''}</li>`;
  }).join('');
  $('savedList').querySelectorAll('.pmain').forEach(b=>b.addEventListener('click',()=>{ haptic(); openProfile(b.dataset.id); }));
  $('savedList').querySelectorAll('.del').forEach(b=>b.addEventListener('click',()=>{
    profiles=profiles.filter(p=>p.id!==b.dataset.id); if(curId===b.dataset.id) curId=profiles[0]?.id||null; persist(); renderSaved(); toast('삭제했어요');
  }));
}
const escapeHtml=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
$('editSaved').addEventListener('click',()=>{ editMode=!editMode; renderSaved(); });

/* ---------- 사주 탭: 입력 → 결과 ---------- */
$('f').addEventListener('submit',e=>{ e.preventDefault(); submitMine(); });
$('goBtn').addEventListener('click',()=>{ haptic(); submitMine(); });
function submitMine(){
  const o=readForm('');
  $('fErr').hidden=!o.err;
  if(o.err){ $('fErr').textContent=o.err+'. 날짜를 다시 확인해 주세요.'; return; }
  const name=($('pname').value||'').trim()||(profiles.length?`사주 ${profiles.length+1}`:'나');
  const same=profiles.find(p=>p.o.date===o.date&&p.o.time===o.time&&p.o.hasTime===o.hasTime&&p.o.g===o.g&&p.name===name);
  const clean={...o}; delete clean.err;
  let id;
  if(same){ same.o=clean; id=same.id; }
  else{ id=Date.now().toString(36)+Math.random().toString(36).slice(2,6); profiles.unshift({id,name,o:clean}); if(profiles.length>30) profiles.length=30; }
  curId=id; persist(); $('pname').value='';
  openProfile(id);
}
function openProfile(id){
  const p=findP(id); if(!p) return;
  curId=id; persist();
  const o=profO(p);
  try{ run(o); }catch(e){ console.error(e); toast('사주를 계산하지 못했어요. 입력을 다시 확인해 주세요.'); return; }
  renderHero(o);
  setPage('sum');
  if(stacks.saju[stacks.saju.length-1]!=='scr-result') push('scr-result'); else window.scrollTo(0,0);
}
function renderHero(o){
  const P=R.pillars, dm=A.dm, de=A.de;
  const [y,m,d]=o.date.split('-').map(Number), lu=solarToLunar(y,m,d);
  const cell=(k,label)=>{ const p=P[k]; return `<div><small>${label}</small><b>${p?`<span class="el-${ELC[ST_EL[p.s]]}">${ST[p.s]}</span><br><span class="el-${ELC[BR_EL[p.b]]}">${BR[p.b]}</span>`:'?<br>?'}</b></div>`; };
  const top2=[0,1,2,3,4].sort((a,b)=>A.g[b]-A.g[a]).slice(0,2).sort((a,b)=>a-b);
  $('rhero').innerHTML=`<div class="rn">${escapeHtml(o.name||'나')}</div>
    <div class="rd">양력 ${y}.${m}.${d}${lu?` · 음력 ${lu.y}.${lu.leap?'윤':''}${lu.m}.${lu.d}`:''} · ${o.hasTime?o.time:'시간 모름'} · ${ANIMAL[P.year.b]}띠 · ${o.g==='M'?'남':'여'}</div>
    <div class="r8">${cell('hour','시주')}${cell('day','일주')}${cell('month','월주')}${cell('year','년주')}</div>
    <div class="rk">${SEASONS[seasonIdx(P.month.b)]}의 <b class="hl el-${ELC[de]}">${ST[dm]}${EL[de]}</b>(${DM_TXT[dm][0]}) · ${PAIR_TYPE[top2.join('-')][0]} · ${A.level} · 용신 <b class="hl el-${ELC[A.Y]}">${EL[A.Y]}</b></div>`;
}
function setPage(pg){
  document.querySelectorAll('#subtabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.pg===pg));
  ['sum','won','ov','luck'].forEach(k=>{ $('pg-'+k).hidden=k!==pg; });
}
document.querySelectorAll('#subtabs button').forEach(b=>b.addEventListener('click',()=>{
  setPage(b.dataset.pg);
  const st=$('subtabs'); const y=st.getBoundingClientRect().top+window.scrollY-4;
  if(window.scrollY>y) window.scrollTo(0,y);
}));
document.querySelectorAll('input[name=mode]').forEach(r=>r.addEventListener('change',renderOhaeng));
$('toAskBtn').addEventListener('click',()=>{ haptic(); askFor=null; $('askWho').value=curId; switchTab('ask'); });

/* ---------- 공유 ---------- */
async function shareText(text){
  let link=`intoss://${APP_NAME}`;
  try{ link=await Share.createLink({path:`intoss://${APP_NAME}`}); }catch(e){}
  const message=`${text}\n\n나도 사주 보기: ${link}`;
  try{ await Share.sendMessage({message}); return; }catch(e){}
  try{ if(navigator.share){ await navigator.share({text:message}); return; } }catch(e){ return; }
  try{ await navigator.clipboard.writeText(message); toast('내용을 복사했어요'); }catch(e){ toast('공유하지 못했어요'); }
}
$('shareBtn').addEventListener('click',()=>{
  haptic();
  const o=R.o, P=R.pillars, dm=A.dm;
  const top2=[0,1,2,3,4].sort((a,b)=>A.g[b]-A.g[a]).slice(0,2).sort((a,b)=>a-b);
  shareText(`[사주 오행 판] ${o.name||'나'}의 사주\n${['year','month','day','hour'].map(k=>P[k]?ST[P[k].s]+BR[P[k].b]:'').join(' ')}\n${SEASONS[seasonIdx(P.month.b)]}의 ${DM_TXT[dm][0]}(${ST[dm]}${EL[A.de]}) · ${PAIR_TYPE[top2.join('-')][0]} · 용신 ${EL[A.Y]}`);
});

/* ---------- 궁합 탭 ---------- */
$('pf').innerHTML=partnerFormHTML('p');
$('pf').classList.add('card','fcard');
initForm('p',{y:1994,m:3,d:5,h:14,mi:0});
function fillWho(sel){
  sel.innerHTML=profiles.map(p=>`<option value="${p.id}">${escapeHtml(p.name)} · ${p.o.date.replace(/-/g,'.')}</option>`).join('');
  if(curId&&findP(curId)) sel.value=curId;
}
function onGhShow(){ fillWho($('ghMe')); $('ghMe').hidden=!profiles.length; $('ghMeHint').hidden=!!profiles.length; }
function ghMe(){ const p=findP($('ghMe').value); return p?profO(p):null; }
$('pf').addEventListener('submit',e=>{ e.preventDefault(); doGh(); });
$('ghBtn').addEventListener('click',()=>{ haptic(); doGh(); });
function doGh(){ if(runGh()) push('scr-ghres'); }
$('ghShare').addEventListener('click',()=>{
  haptic();
  const n=$('viewGh').querySelector('.ghnum'), g=$('viewGh').querySelector('.ghgrade'), h=$('viewGh').querySelector('h2');
  shareText(`[사주 오행 판] ${h?h.textContent:'궁합'}\n${n?n.textContent.replace(/\s+/g,' '):''}점 · ${g?g.textContent:''}`);
});

/* ---------- 상담 탭 ---------- */
let askFor=null;
function onAskShow(){
  fillWho($('askWho'));
  const has=!!profiles.length;
  $('askWho').hidden=!has; $('askWhoHint').hidden=has; $('askForm').hidden=!has;
  if(has) useAskProfile($('askWho').value);
}
function useAskProfile(id){
  if(askFor===id&&R) return;
  const p=findP(id); if(!p) return;
  try{ run(profO(p)); renderHero(profO(p)); }catch(e){ return; }
  curId=id; persist(); askFor=id; askReset();
}
$('askWho').addEventListener('change',()=>useAskProfile($('askWho').value));

/* ---------- 시작 ---------- */
initForm('',{y:1990,m:1,d:1,h:'x',mi:0});
$('mi').disabled=true;
renderSaved();
paint();
