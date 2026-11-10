/* ================= 렌더링 ================= */
const $=id=>document.getElementById(id);
const tile=(ch,ko,e,yy)=>`<div class="g el-${ELC[e]}"><span class="hz">${ch}</span><span class="ko">${yy} ${ko}${ELK[e]}</span></div>`;
const stemTile=s=>tile(ST[s],STK[s],ST_EL[s],s%2===0?'양':'음');
const brTile=b=>tile(BR[b],BRK[b],BR_EL[b],b%2===0?'양':'음');
const hz=(s,b)=>`<span class="pz"><span class="el-${ELC[ST_EL[s]]}">${ST[s]}</span><span class="el-${ELC[BR_EL[b]]}">${BR[b]}</span></span>`;
const hlE=e=>`<span class="hl el-${ELC[e]}">${EL[e]}</span>`;
const roleChip=r=>`<span class="rolechip r-${r}">${r}</span>`;
const pct=v=>Math.round(v*100)+'%';
const NOW=new Date().getFullYear();
let R=null,A=null;
const REGIONS=[['서울특별시',[['서울',126.98]]],
['부산광역시',[['부산',129.08]]],
['대구광역시',[['대구',128.60],['군위군',128.57]]],
['인천광역시',[['인천',126.70],['강화군',126.49]]],
['광주광역시',[['광주',126.85]]],
['대전광역시',[['대전',127.38]]],
['울산광역시',[['울산',129.31]]],
['세종특별자치시',[['세종',127.29]]],
['경기도',[['수원',127.01],['성남',127.13],['고양',126.83],['용인',127.18],['부천',126.78],['안산',126.83],['안양',126.95],['남양주',127.22],['화성',126.83],['평택',127.11],['의정부',127.05],['시흥',126.80],['파주',126.78],['김포',126.72],['광명',126.86],['광주(경기)',127.26],['군포',126.94],['하남',127.21],['오산',127.08],['이천',127.44],['안성',127.28],['의왕',126.97],['양주',127.05],['구리',127.13],['포천',127.20],['여주',127.64],['동두천',127.06],['과천',126.99],['가평군',127.51],['양평군',127.49],['연천군',127.07]]],
['강원도',[['춘천',127.73],['원주',127.95],['강릉',128.88],['동해',129.11],['태백',128.99],['속초',128.59],['삼척',129.17],['홍천군',127.89],['횡성군',127.98],['영월군',128.46],['평창군',128.39],['정선군',128.66],['철원군',127.31],['화천군',127.71],['양구군',127.99],['인제군',128.17],['고성군(강원)',128.47],['양양군',128.62]]],
['충청북도',[['청주',127.49],['충주',127.93],['제천',128.19],['보은군',127.73],['옥천군',127.57],['영동군',127.78],['증평군',127.58],['진천군',127.44],['괴산군',127.79],['음성군',127.69],['단양군',128.37]]],
['충청남도',[['천안',127.11],['공주',127.12],['보령',126.61],['아산',127.00],['서산',126.45],['논산',127.10],['계룡',127.25],['당진',126.65],['금산군',127.49],['부여군',126.91],['서천군',126.69],['청양군',126.80],['홍성군',126.66],['예산군',126.85],['태안군',126.30]]],
['전라북도',[['전주',127.15],['군산',126.74],['익산',126.96],['정읍',126.86],['남원',127.39],['김제',126.88],['완주군',127.16],['진안군',127.43],['무주군',127.66],['장수군',127.52],['임실군',127.28],['순창군',127.14],['고창군',126.70],['부안군',126.73]]],
['전라남도',[['목포',126.39],['여수',127.66],['순천',127.49],['나주',126.71],['광양',127.70],['담양군',126.99],['곡성군',127.29],['구례군',127.46],['고흥군',127.28],['보성군',127.08],['화순군',126.99],['장흥군',126.91],['강진군',126.77],['해남군',126.60],['영암군',126.70],['무안군',126.48],['함평군',126.52],['영광군',126.51],['장성군',126.78],['완도군',126.75],['진도군',126.26],['신안군',126.35]]],
['경상북도',[['포항',129.34],['경주',129.22],['김천',128.11],['안동',128.73],['구미',128.34],['영주',128.62],['영천',128.94],['상주',128.16],['문경',128.19],['경산',128.74],['의성군',128.70],['청송군',129.06],['영양군',129.11],['영덕군',129.37],['청도군',128.73],['고령군',128.26],['성주군',128.28],['칠곡군',128.40],['예천군',128.45],['봉화군',128.73],['울진군',129.40],['울릉군',130.91]]],
['경상남도',[['창원',128.68],['진주',128.11],['통영',128.43],['사천',128.06],['김해',128.89],['밀양',128.75],['거제',128.62],['양산',129.04],['의령군',128.26],['함안군',128.41],['창녕군',128.49],['고성군(경남)',128.32],['남해군',127.89],['하동군',127.75],['산청군',127.87],['함양군',127.73],['거창군',127.91],['합천군',128.17]]],
['제주도',[['제주시',126.53],['서귀포',126.56]]]];
const minLbl=l=>{const m=Math.round((l-135)*4);return `${m<0?'−':'+'}${Math.abs(m)}분`};
function initPlace(p=''){
  const sd=$(p+'sido'),ct=$(p+'city');
  sd.innerHTML=REGIONS.map((r,i)=>`<option value="${i}">${r[0]}</option>`).join('')+'<option value="x">목록에 없음 · 해외 (경도 입력)</option><option value="n">보정 안 함</option>';
  const fill=()=>{const v=sd.value;$(p+'lngIn').hidden=v!=='x';ct.hidden=v==='x'||v==='n';
    if(v!=='x'&&v!=='n') ct.innerHTML=REGIONS[+v][1].map(([n,l])=>`<option value="${l}">${n} (${minLbl(l)})</option>`).join('')};
  sd.addEventListener('change',fill);fill();
}
const SIJIN=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const ANIMAL=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
const DOW='일월화수목금토';
const opt=(v,t,sel)=>`<option value="${v}"${sel?' selected':''}>${t}</option>`;
function initForm(p='',D={y:1992,m:8,d:17,h:10,mi:20}){
  let y='';for(let i=2030;i>=1920;i--) y+=opt(i,i+'년',i===D.y);
  $(p+'yy').innerHTML=y;
  $(p+'mm').innerHTML=[...Array(12)].map((_,i)=>opt(i+1,(i+1)+'월',i+1===D.m)).join('');
  let h=opt('x','모름',D.h==='x');
  for(let i=0;i<24;i++){const b=Math.floor((i+1)/2)%12;h+=opt(i,`${i}시 (${SIJIN[b]}시)`,i===D.h)}
  $(p+'hh').innerHTML=h;
  $(p+'mi').innerHTML=[...Array(60)].map((_,i)=>opt(i,String(i).padStart(2,'0')+'분',i===D.mi)).join('');
  fillDays(D.d,p);
  ['yy','mm','leap'].forEach(id=>$(p+id).addEventListener('change',()=>fillDays(0,p)));
  document.querySelectorAll(`input[name=${p}cal]`).forEach(r=>r.addEventListener('change',()=>{$(p+'leapWrap').hidden=!isLunar(p);fillDays(0,p)}));
  $(p+'hh').addEventListener('change',()=>{$(p+'mi').disabled=$(p+'hh').value==='x'});
  initPlace(p);
}
function isLunar(p=''){return document.querySelector(`input[name=${p}cal]:checked`).value==='L'}
function fillDays(keep,p=''){
  const y=+$(p+'yy').value,m=+$(p+'mm').value,cur=keep||+$(p+'dd').value||1;
  let n;
  if(isLunar(p)){const r=lunarToSolar(y,m,30,$(p+'leap').checked);n=r.err&&/(\d+)일까지/.test(r.err)?+r.err.match(/(\d+)일까지/)[1]:30}
  else n=new Date(Date.UTC(y,m,0)).getUTCDate();
  $(p+'dd').innerHTML=[...Array(n)].map((_,i)=>opt(i+1,(i+1)+'일',i+1===Math.min(cur,n))).join('');
}
function readForm(p=''){
  const sv=$(p+'sido').value, c=sv==='n'?'none':sv==='x'?$(p+'lngIn').value:$(p+'city').value;
  let y=+$(p+'yy').value,m=+$(p+'mm').value,d=+$(p+'dd').value, lunarIn=null;
  if(isLunar(p)){
    const r=lunarToSolar(y,m,d,$(p+'leap').checked);
    if(r.err) return {err:r.err};
    lunarIn={y,m,d,leap:$(p+'leap').checked};[y,m,d]=r.ymd;
  }
  const hasTime=$(p+'hh').value!=='x';
  const time=hasTime?`${String($(p+'hh').value).padStart(2,'0')}:${String($(p+'mi').value).padStart(2,'0')}`:'12:00';
  return {date:`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`,time,hasTime,lunarIn,
    lngManual:sv==='x',input:{cal:isLunar(p)?'L':'S',y:+$(p+'yy').value,m:+$(p+'mm').value,d:+$(p+'dd').value,leap:$(p+'leap').checked,h:$(p+'hh').value,mi:+$(p+'mi').value,sido:sv,city:$(p+'city').value,lng:$(p+'lngIn').value},
    g:document.querySelector(`input[name=${p}g]:checked`).value,lng:c==='none'?null:+c,ja:$(p+'ja').value,mbti:($(p+'mbti')&&$(p+'mbti').value)||null,
    place:sv==='n'?'보정 안 함':sv==='x'?`경도 ${(+c).toFixed(2)}°`:(REGIONS[+sv][1].length===1?REGIONS[+sv][0]:`${REGIONS[+sv][0]} ${$(p+'city').selectedOptions[0].textContent.replace(/ \(.*/,'')}`)};
}
let firstRun=true;
function run(o){
  R=compute(o); A=analyze(R); R.o=o;
  renderConfirm(o);
  renderSummary();renderPillars();renderOhaeng();renderStrength();renderYongsin();renderGyeok();renderRel();renderKeySum();renderOverall();renderDW();renderTotal();if(typeof askReset==='function')askReset();
}

function renderConfirm(o){
  const [y,m,d]=o.date.split('-').map(Number);
  const dow=DOW[new Date(Date.UTC(y,m-1,d)).getUTCDay()];
  const lu=solarToLunar(y,m,d);
  const P=R.pillars, yb=P.year.b;
  const sj=R.lmt?SIJIN[Math.floor((+R.lmt.slice(0,2)+1)/2)%12]:null;
  const sjRange=b=>{const s=(b*2+23)%24;return `${s}~${(s+2)%24}시`};
  const notes=[];
  if(R.z.note&&o.hasTime) notes.push(R.z.note+'을 반영했습니다');
  if(lu&&P.year.s!==mod(lu.y-4,10)) notes.push(`입춘(양력 2월 4일 무렵) 전에 태어나 띠와 년주는 ${y-1}년 기준입니다`);
  if(o.hasTime&&+R.lmt.slice(0,2)===23) notes.push(o.ja==='jo'?'23시 이후 출생이라 일주를 다음 날로 봤습니다(조자시)':'23시 이후 출생이지만 일주는 당일로 봤습니다(야자시)');
  if(!o.hasTime) notes.push('시간을 모르면 시주를 빼고 여섯 글자로 봅니다. 강약·용신 판단이 덜 정확해집니다');
  if(o.lngManual) notes.push('해외 출생이면 태어난 시각을 한국 시각으로 바꿔 입력하세요');
  $('confirm').innerHTML=`<div class="ch"><b>입력 확인</b><span class="muted" style="font-size:12.5px">${o.name?o.name+' · ':''}아래 내용이 맞는지 확인하세요</span></div>
    <div class="cgrid">
      <div><span>양력</span><strong>${y}년 ${m}월 ${d}일 (${dow})</strong></div>
      <div><span>음력</span><strong>${lu?`${lu.y}년 ${lu.leap?'윤':''}${lu.m}월 ${lu.d}일`:'-'}</strong></div>
      <div><span>띠 · 년주</span><strong>${ANIMAL[yb]}띠 · ${ST[P.year.s]}${BR[yb]}년</strong></div>
      <div><span>태어난 시각</span><strong>${o.hasTime?`${o.time} → ${sj}시 (보정 시각 ${sjRange(SIJIN.indexOf(sj))})`:'모름'}</strong></div>
      <div><span>시간 보정</span><strong>${o.hasTime?(o.lng==null?'보정 안 함':`${o.place} · ${R.corrMin>0?'+':''}${R.corrMin}분 → ${R.lmt}`):'-'}</strong></div>
      <div><span>성별 · 대운</span><strong>${o.g==='M'?'남자':'여자'} · ${R.fwd?'순행':'역행'} ${R.dsu}대운</strong></div>
    </div>${notes.length?`<p class="cnote">${notes.join(' · ')}</p>`:''}`;
}

function renderSummary(){
  const P=R.pillars, dm=A.dm, de=A.de;
  $('summary').innerHTML=`
    <div><span class="k">일간</span><b class="hl el-${ELC[de]}">${ST[dm]}${EL[de]}</b> <span class="muted">${DM_TXT[dm][0]}</span></div>
    <div><span class="k">일주</span><b>${ST[dm]}${BR[P.day.b]}</b> <span class="muted">${STK[dm]}${BRK[P.day.b]}일주</span></div>
    <div><span class="k">강약</span><b>${A.level}</b> <span class="muted mono">${Math.round(A.score)}점</span></div>
    <div><span class="k">격국</span><b>${A.jong?A.jong.type:A.gName}</b> <span class="muted">${A.gStatus}</span></div>
    <div><span class="k">용신 · 희신</span><b>${hlE(A.Y)} · ${hlE(mod(A.Y-1,5))}</b> <span class="muted">${A.method}</span></div>`;
}

function renderPillars(){
  const P=R.pillars, dm=A.dm;
  const cols=[['시주','hour'],['일주','day'],['월주','month'],['년주','year']];
  $('pillars').innerHTML=cols.map(([nm,k])=>{
    const p=P[k];
    if(!p) return `<div class="pl empty"><div class="pl-name">${nm}</div><div class="tg">&nbsp;</div><div class="g"><span class="hz">?</span></div><div class="g"><span class="hz">?</span></div><div class="tg muted">시간 모름</div></div>`;
    const top=k==='day'?'일간 (나)':tenGod(dm,p.s);
    const ss=[...new Set(A.perPos[k])].map(n=>`<span class="ss ${SINSAL_TXT[n][0]}">${n}</span>`).join('');
    return `<div class="pl ${k==='day'?'day':''}">
      <div class="pl-name">${nm} · ${PALACE[k]}</div>
      <div class="tg top">${top}</div>
      ${stemTile(p.s)}${brTile(p.b)}
      <div class="tg">${tenGod(dm,MAIN(p.b))}</div>
      <div class="hid" title="지장간">${HID[p.b].map(s=>`<span class="el-${ELC[ST_EL[s]]}">${ST[s]}</span>`).join('')}</div>
      <div class="ws">${twelve(dm,p.b)}</div>
      <div class="ssl">${ss}</div>
    </div>`}).join('');
  $('termInfo').textContent=`${JIE[R.prevT]} 후 ${Math.floor(R.daysSince)}일 · ${BR[P.month.b]}월(${A.season}) · 공망 ${A.gong.map(b=>BR[b]).join('')}`;
}

function renderOhaeng(){
  const mode=document.querySelector('input[name=mode]:checked').value;
  const sc=mode==='count'?A.cnt:A.ew;
  const tot=sc.reduce((a,b)=>a+b,0), max=Math.max(...sc,1), de=A.de;
  $('bars').innerHTML=sc.map((v,e)=>`<div class="bar el-${ELC[e]}">
      <div class="lb">${EL[e]}<small>${GRP[mod(e-de,5)]}</small></div>
      <div class="track"><div class="fill" style="width:${v/max*100}%"></div></div>
      <div class="v mono">${mode==='count'?v+'자':Math.round(v/tot*100)+'%'}${roleChip(A.role[e])}</div></div>`).join('');
  drawWheel(A.ew,de);
}
function drawWheel(sc,de){
  const cx=190,cy=182,R0=128, max=Math.max(...sc,1), tot=sc.reduce((a,b)=>a+b,0);
  const pos=[0,1,2,3,4].map(i=>{const a=rad(-90+i*72);return {x:cx+R0*Math.cos(a),y:cy+R0*Math.sin(a)}});
  const rr=sc.map(v=>16+26*Math.sqrt(v/max));
  let s=`<defs>
    <marker id="aS" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
    <marker id="aK" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--accent)"/></marker></defs>`;
  const trim=(a,b,ra,rb)=>{const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);return [{x:a.x+dx/L*(ra+5),y:a.y+dy/L*(ra+5)},{x:b.x-dx/L*(rb+7),y:b.y-dy/L*(rb+7)}]};
  for(let i=0;i<5;i++){const j=(i+2)%5;const[p,q]=trim(pos[i],pos[j],rr[i],rr[j]);
    s+=`<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" style="stroke:var(--accent)" stroke-width="1.4" stroke-dasharray="4 4" opacity=".7" marker-end="url(#aK)"/>`}
  for(let i=0;i<5;i++){const j=(i+1)%5;
    const a0=-90+i*72,a1=-90+j*72,off0=(rr[i]+6)/R0*180/Math.PI,off1=(rr[j]+9)/R0*180/Math.PI;
    const p={x:cx+R0*Math.cos(rad(a0+off0)),y:cy+R0*Math.sin(rad(a0+off0))},q={x:cx+R0*Math.cos(rad(a1-off1)),y:cy+R0*Math.sin(rad(a1-off1))};
    s+=`<path d="M${p.x},${p.y} A${R0},${R0} 0 0 1 ${q.x},${q.y}" fill="none" style="stroke:var(--muted)" stroke-width="2" marker-end="url(#aS)"/>`}
  for(let i=0;i<5;i++){const {x,y}=pos[i],r=rr[i],zero=A.cnt[i]===0;
    s+=`<g class="el-${ELC[i]}">
      ${i===de?`<circle cx="${x}" cy="${y}" r="${r+6}" fill="none" style="stroke:var(--accent)" stroke-width="2"/>`:''}
      <circle cx="${x}" cy="${y}" r="${r}" style="fill:color-mix(in srgb,var(--c) ${zero?6:22}%,var(--surface));stroke:var(--c)" stroke-width="1.5" ${zero?'stroke-dasharray="3 3"':''}/>
      <text x="${x}" y="${y+1}" text-anchor="middle" dominant-baseline="middle" style="fill:var(--c);font-family:var(--f-han);font-weight:700;font-size:${Math.max(17,r*.85)}px">${EL[i]}</text>
      <text x="${x}" y="${i===0?y-r-10:y+r+16}" text-anchor="middle" style="fill:var(--muted);font-family:var(--f-body);font-size:12px">${GRP[mod(i-de,5)]} ${Math.round(sc[i]/tot*100)}%</text>
    </g>`}
  $('wheel').innerHTML=s;
}

function renderStrength(){
  $('pin').style.left=`${Math.min(97,Math.max(3,A.score))}%`;
  $('strLabel').textContent=`${A.level} · ${Math.round(A.score)}점`;
  const P=R.pillars, dm=A.dm;
  const mm=MAIN(P.month.b), dmn=MAIN(P.day.b);
  $('deuk').innerHTML=[
    ['득령',A.deukryung,`월지 ${BR[P.month.b]}의 정기 ${ST[mm]}(${tenGod(dm,mm)})${A.deukryung?'가 나를 돕습니다':'는 나를 돕지 않습니다'}`],
    ['득지',A.deukji,`일지 ${BR[P.day.b]}의 정기 ${ST[dmn]}(${tenGod(dm,dmn)})${A.deukji?'에 뿌리를 내렸습니다':'에 뿌리가 약합니다'}`],
    ['득세',A.deukse,A.deukse?'나머지 글자 중 돕는 기운이 절반 이상입니다':'나머지 글자 중 돕는 기운이 절반에 못 미칩니다']
  ].map(([n,on,t])=>`<div class="dk ${on?'on':''}"><b>${n} ${on?'○':'×'}</b><span>${t}</span></div>`).join('');
}

const ROLE_DESC={'용신':'가장 필요한 기운','희신':'용신을 돕는 기운','기신':'가장 꺼리는 기운','구신':'기신을 돕는 기운','한신':'영향이 적은 기운'};
function renderYongsin(){
  const de=A.de;
  $('ysMethod').textContent=A.method;
  $('ysbox').innerHTML=`<div class="ysbig">용신 <span class="hl el-${ELC[A.Y]}">${EL[A.Y]}</span> <span class="muted" style="font-size:15px;font-family:var(--f-body);font-weight:400">${ELK[A.Y]} · ${GRP[mod(A.Y-de,5)]}</span></div>
    <ul class="why">${A.why.map(w=>`<li>${w}</li>`).join('')}</ul>`;
  const order=['용신','희신','한신','구신','기신'];
  $('roles').innerHTML=order.map(r=>{const e=A.role.indexOf(r);return `<div class="rc el-${ELC[e]} ${r==='용신'?'y':''}"><span class="n">${r}</span><span class="e">${EL[e]}</span><span class="d">${GRP[mod(e-de,5)]}<br>${ROLE_DESC[r]}</span></div>`}).join('');
  $('gtLabel').textContent=`${ST[A.dm]}일간 ${BR[R.pillars.month.b]}월`;
  $('gt').innerHTML=A.gtPresent.map(x=>`<span class="el-${ELC[ST_EL[x.s]]}"><b>${ST[x.s]}</b> ${x.tou?'천간에 있음':x.hid?'지장간에 있음':'원국에 없음'}</span>`).join('');
}

function renderGyeok(){
  const name=A.jong?A.jong.type:A.gName;
  const t=GYEOK_TXT[A.gName]||{d:'',job:''};
  let h=`<div class="gname">${name}<span class="pill ${A.gStatus}">${A.gStatus==='구응'?'파격 · 구응':A.gStatus}</span></div>`;
  if(A.jong) h+=`<p>${A.jong.why} ${STATUS_TXT['종격']}</p><p class="muted">일반 격으로 보면 ${A.gName}입니다.</p>`;
  else{
    h+=`<p>${t.d} ${STATUS_TXT[A.gStatus]}</p>`;
    if(A.ok.length||A.bad.length) h+=`<div class="okbad">${A.ok.length?`<div class="o"><b>격을 돕는 요소</b>${A.ok.map(x=>`<span>· ${x}</span>`).join('')}</div>`:''}${A.bad.length?`<div class="x"><b>격을 깨는 요소</b>${A.bad.map(x=>`<span>· ${x}</span>`).join('')}</div>`:''}</div>`;
  }
  $('gyeok').innerHTML=h;
}

function renderRel(){
  const posTxt=r=>r.a?[r,...(r.more||[])].map(x=>`${POSK[x.a]}주–${POSK[x.b]}주`).join(', '):'원국 전체';
  const merged=[];A.rel.forEach(r=>{const m=merged.find(x=>x.t===r.t&&x.txt===r.txt);if(m)m.more.push(r);else merged.push({...r,more:[]})});
  const items=merged.map(r=>{
    let m=REL_TXT[r.t];
    if(r.a){m=`${[r,...r.more].map(x=>PAIR_TXT[[x.a,x.b].join('-')]).join(', ')} 사이의 관계입니다. ${m}`;
      if(r.t==='천간합'&&(r.a==='day'||r.b==='day')){const o=r.a==='day'?r.b:r.a;const s=R.pillars[o].s;m+=` 일간이 ${tenGod(A.dm,s)}과 합하니 ${'정재편재'.includes(tenGod(A.dm,s))?'재물과 이성에 대한 애착이 큽니다':'정관편관'.includes(tenGod(A.dm,s))?'조직과 명예, 이성 인연에 마음이 묶입니다':'그 기운에 마음이 쏠립니다'}.`}}
    if(r.el!=null) m+=` 이 오행(${EL[r.el]})은 내게 ${A.role[r.el]}이라 ${['용신','희신'].includes(A.role[r.el])?'힘이 됩니다':['기신','구신'].includes(A.role[r.el])?'부담이 됩니다':'영향이 크지 않습니다'}.`;
    return `<div class="ri"><div class="t">${r.txt}<small>${posTxt(r)} · ${r.t}</small></div><p>${m}</p></div>`});
  $('rels').innerHTML=items.length?items.join(''):'<p>원국 안에 뚜렷한 합·충·형이 없습니다. 글자끼리 크게 부딪히지 않아 환경이 비교적 안정적입니다.</p>';
  const seen=new Set();
  const ss=A.ss.filter(x=>{const k=x.name+x.k;if(seen.has(k))return false;seen.add(k);return true}).map(x=>{
    const [cls,txt]=SINSAL_TXT[x.name];
    return `<div class="ri"><div class="t"><span class="ss ${cls}" style="font-size:13px">${x.name}</span><small>${POSK[x.k]}주 · ${PALACE[x.k]}</small></div><p>${txt}</p></div>`});
  $('sinsal').innerHTML=ss.length?ss.join(''):'<p>주요 신살이 없습니다. 신살은 보조 지표라 없어도 사주의 큰 흐름에는 영향이 없습니다.</p>';
}


/* ---------- 연도별 분석 ---------- */
function yearScan(n=10){
  const P=R.pillars, dm=A.dm, de=A.de, male=R.o.g==='M', out=[];
  const good=r=>r==='용신'||r==='희신', bad=r=>r==='기신'||r==='구신';
  const roleG=gi=>A.role[mod(de+gi,5)];
  const sg=male?2:3;
  for(let k=0;k<n;k++){
    const Y=NOW+k, i=mod(Y-4,60), s=i%10, b=i%12, e=evalLuck(A,R,s,b);
    const gs=grpOf(dm,ST_EL[s]), gb=mod(e.bEl-de,5), has=gi=>gs===gi||gb===gi;
    const ts=tenGod(dm,s), tb=tenGod(dm,MAIN(b));
    const ev=k=>e.ev.find(x=>x.k===k&&x.t==='충'), hap=k=>e.ev.find(x=>x.k===k&&x.t==='합');
    let money={m:'',t:''},work={m:'',t:''},love={m:'',t:''},move={m:'',t:''},hl={m:'',t:''};
    const age=Y-R.y, bd=band(age), young=bd==='kid'||bd==='teen';
    const [ygb]=[SAMHAP_GRP(P.year.b)], dgb=SAMHAP_GRP(P.day.b), dohwa=DOHWA[ygb]===b||DOHWA[dgb]===b;
    if(young){
      if(has(4)) money=good(roleG(4))?{m:'◎',t:'부모님 도움'}:{m:'△',t:'의존·게으름'};
      else if(has(2)) money=good(roleG(2))?{m:'○',t:'집안 형편 안정'}:{m:'△',t:'물건 욕심·산만'};
      if(has(4)&&good(roleG(4))) work={m:'◎',t:bd==='teen'?'성적·시험운 상승':'공부운 상승'};
      else if(has(3)) work=good(roleG(3))?{m:'○',t:bd==='teen'?'시험·상장·인정':'칭찬·상장'}:{m:'△',t:'학업 압박'};
      else if((ts==='상관'||tb==='상관')&&A.tou('정관')) work={m:'△',t:'선생님과 마찰'};
      else if(has(1)) work=good(roleG(1))?{m:'○',t:'재능·예체능 발휘'}:{m:'△',t:'집중력 저하'};
      else if(has(4)) work={m:'△',t:'공부 정체'};
      if(hap('day')) love={m:'♡',t:'좋은 친구·인연'};
      else if(has(0)) love=good(roleG(0))?{m:'○',t:'친구 복'}:{m:'△',t:'친구와 다툼'};
      else if(bd==='teen'&&(gs===sg||gb===sg)) love={m:'○',t:'이성 친구'};
      else if(dohwa) love={m:'○',t:'인기'};
      if(ev('day')) love={m:'△',t:'이사·환경 변화'};
      if(YEOKMA[ygb]===b||YEOKMA[dgb]===b) move={m:'↗',t:'이사·전학 가능'};
      if(ev('month')) move={m:'↗',t:'학교·환경 변화'};
    }else{
      if(has(2)) money=good(roleG(2))?{m:'◎',t:'재물 유입'}:bad(roleG(2))?{m:'△',t:'욕심·손재'}:{m:'○',t:'돈 흐름 활발'};
      else if(has(1)&&good(roleG(2))) money={m:'○',t:'재능이 돈으로'};
      else if(has(0)&&A.g[2]>0.1) money=good(roleG(0))?{m:'○',t:'협력으로 이익'}:{m:'△',t:'경쟁·지출'};
      if(bd==='senior'){
        if(has(3)) work=good(roleG(3))?{m:'○',t:'명예·대접받음'}:{m:'△',t:'관재·건강 주의'};
        else if(has(4)) work=good(roleG(4))?{m:'○',t:'문서·부동산'}:{m:'△',t:'고집·정체'};
        else if(has(1)) work={m:'○',t:'취미·자녀 경사'};
      }else{
        if(has(3)) work=good(roleG(3))?{m:'◎',t:bd==='young'?'취업·승진·인정':'승진·인정'}:{m:'△',t:'압박·책임'};
        else if(ts==='상관'||tb==='상관') work=A.tou('정관')?{m:'△',t:'직장 마찰'}:{m:'○',t:'새 일 시도'};
        else if(has(4)) work=good(roleG(4))?{m:'○',t:'문서·자격·계약'}:{m:'△',t:'정체·망설임'};
        else if(has(1)) work={m:'○',t:'일거리 증가'};
      }
      let lv=(gs===sg?1:0)+(gb===sg?1.5:0)+(hap('day')?2:0)+(e.ev.some(x=>x.t==='간합')?1.5:0)+(dohwa?0.5:0);
      const lt=age<45?'이성·결혼 인연':age<60?'부부 정 깊어짐':'가족 화합';
      if(lv>=2) love={m:'♡',t:hap('day')?(age<45?'인연·결합(일지 합)':'부부 화합'):e.ev.some(x=>x.t==='간합')?'인연·계약':lt};
      else if(dohwa) love={m:'○',t:age<45?'인기·만남':'대인관계 활발'};
      if(ev('day')) love={m:'△',t:'관계·거주 변동'};
      if(YEOKMA[ygb]===b||YEOKMA[dgb]===b) move={m:'↗',t:'이동·이사·출장'};
      if(ev('month')) move={m:'↗',t:bd==='senior'?'생활 환경 변화':'직장·환경 변화'};
    }
    const bh=BAEKHO.some(([x,y])=>x===s&&y===b);
    if((e.rs==='기신'&&e.rb==='기신')||bh||(ev('day')&&bad(e.rb))) hl={m:'!',t:bh?(young?'다침 주의':'사고·수술 주의'):'건강·체력 관리'};
    out.push({Y,s,b,e,rate:rateOf(e.v),ts,tb,money,work,love,move,hl});
  }
  return out;
}
function renderYears(){
  const YS=yearScan(), young0=['kid','teen'].includes(band(NOW-R.y));
  const cell=x=>x.m?`<span class="ym ym-${x.m==='◎'||x.m==='♡'?'g':x.m==='○'||x.m==='↗'?'n':'w'}">${x.m}</span> ${x.t}`:'<span class="muted">-</span>';
  $('seun').innerHTML=`<div class="ytbl-wrap"><table class="ytbl"><thead><tr><th>연도</th><th>간지 · 십성</th><th>종합</th>${young0?'<th>가정·지원</th><th>학업·활동</th><th>친구·관계</th>':'<th>재물</th><th>일·직장</th><th>관계</th>'}<th>이동·주의</th></tr></thead><tbody>${
    YS.map((x,i)=>`<tr class="${i===0?'now':''}"><td class="mono yc-y"><b>${x.Y}</b><br><span class="muted">${x.Y-R.y}세</span></td><td class="yc-g">${hz(x.s,x.b)}<br><span class="muted">${x.ts} · ${x.tb}</span></td><td class="yc-r"><span class="rate ${x.rate[1]}">${x.rate[0]}</span></td><td data-l="${young0?'가정':'재물'}">${cell(x.money)}</td><td data-l="${young0?'학업':'일'}">${cell(x.work)}</td><td data-l="${young0?'친구':'관계'}">${cell(x.love)}</td><td data-l="주의">${[x.move.m?cell(x.move):'',x.hl.m?cell(x.hl):''].filter(Boolean).join('<br>')||'<span class="muted">-</span>'}</td></tr>`).join('')
  }</tbody></table></div><p class="how" style="font-size:12px">◎ 매우 좋음 · ○ 좋음 · △ 조심 · ♡ 인연 · ↗ 변동 · ! 주의</p>`;
}
function renderKeySum(){
  const P=R.pillars, dm=A.dm, de=A.de, g=A.g;
  const yg=mod(A.Y-de,5), gi=A.role.indexOf('기신');
  const top2=[0,1,2,3,4].sort((a,b)=>g[b]-g[a]).slice(0,2).sort((a,b)=>a-b);
  const YS=yearScan(), best=YS.filter(x=>x.rate[1].startsWith('up')).map(x=>x.Y).slice(0,3);
  const age=NOW-R.y, curI=R.dw.findIndex((d,i)=>age>=d.age&&(!R.dw[i+1]||age<R.dw[i+1].age));
  const cur=curI>=0?R.dw[curI]:null;
  const items=[
    ['나는',`${SEASONS[seasonIdx(P.month.b)]}의 ${DM_TXT[dm][0]}(${ST[dm]}${EL[de]}), ${PAIR_TYPE[top2.join('-')][0]}입니다.`],
    ['성향',(()=>{const st=mbtiFromSaju(A).map(x=>x.letter).join('');return R.o.mbti?`사주로는 ${st}, 실제 MBTI는 ${R.o.mbti}`:`사주로 본 MBTI는 ${st}(${MBTI_NAME[st]})`})()],
    ['타고난 틀',`${A.jong?A.jong.type:A.gName}(${A.gStatus}) · ${A.level} · 용신 ${EL[A.Y]}(${GRP[yg]})`],
    ['강점',['kid','teen'].includes(band(age))?`${KID_KEY[yg]}입니다. ${EL_STUDY[A.Y]} 쪽에 소질이 있습니다.`:`${['사람과 협력하는 일','재능을 드러내는 일','성과를 숫자로 내는 일','책임 있는 자리를 맡는 일','배우고 자격을 쌓는 일'][yg]}에서 힘이 납니다. 맞는 업종은 ${EL_JOB[A.Y].split(', ').slice(0,3).join(', ')}입니다.`],
    ['약점',`기신 ${EL[gi]}(${GRP[mod(gi-de,5)]}) — ${(['kid','teen'].includes(band(age))?KID_GI:GI_GRP)[mod(gi-de,5)].split('.')[0]}.`],
    ['지금 운',cur?`${cur.age}~${cur.age+9}세 ${ST[cur.s]}${BR[cur.b]} 대운(${rateOf(evalLuck(A,R,cur.s,cur.b).v)[0]}) · 올해 ${NOW}년 ${YS[0].rate[0]}`:`첫 대운(${R.dsu}세) 전`],
    ['좋은 해',best.length?best.join(', ')+'년':'앞으로 10년은 큰 기복 없이 실력으로 가는 시기']
  ];
  $('keysum').innerHTML=`<h3>핵심 요약</h3><dl>${items.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
}


const toPresent=t=>t.replace(/물려받았습니다/g,'물려받았습니다').replace(/듣곤 했습니다/g,'듣곤 합니다').replace(/자랐습니다/g,'자랍니다').replace(/받았습니다/g,'받습니다').replace(/있었습니다/g,'있습니다').replace(/겪었습니다/g,'겪습니다').replace(/됐습니다/g,'됩니다').replace(/보냈습니다/g,'보냅니다').replace(/보였습니다/g,'보입니다').replace(/늦었습니다/g,'늦어질 수 있습니다').replace(/있었을 수 있습니다/g,'있을 수 있습니다').replace(/이었습니다/g,'입니다').replace(/였습니다/g,'입니다').replace(/했습니다/g,'합니다').replace(/서야 했습니다/g,'서야 합니다');
const OPEN_NOW=['따뜻한 울타리 안에서 사랑받으며 자라는 시기입니다.','큰 굴곡 없이 무난하게 자라는 시기입니다.','마음대로 되지 않는 일이 많아 일찍 철이 드는 시기입니다.'];
/* ---------- 종합 풀이 ---------- */
function renderOverall(){
  const P=R.pillars, dm=A.dm, de=A.de, g=A.g, male=R.o.g==='M';
  const rows=[];
  const roleOfG=gi=>A.role[mod(de+gi,5)];
  const good=r=>r==='용신'||r==='희신', bad=r=>r==='기신'||r==='구신';
  const ssNames=new Set(A.ss.map(x=>x.name));
  const yg=mod(A.Y-de,5);
  const ilju=ST[dm]+BR[P.day.b];
  const ageNow=NOW-R.y, bdNow=band(ageNow), youngNow=bdNow==='kid'||bdNow==='teen';

  // 1 타고난 기질
  const si=seasonIdx(P.month.b);
  const top2=[0,1,2,3,4].sort((a,b)=>g[b]-g[a]).slice(0,2).sort((a,b)=>a-b);
  const pt=PAIR_TYPE[top2.join('-')];
  rows.push(['타고난 기질',`${SEASONS[si]}의 ${ST[dm]}${EL[de]} · ${ilju}일주`,
    `<p><b>${SEASONS[si]}에 태어난 ${DM_TXT[dm][0]}</b> · ${DM_SEASON[dm][si]}</p>
     <p><b>${ilju} 일주</b> · ${ILJU[ilju]}</p>
     <p><b>${pt[0]}</b> · 사주에서 가장 강한 두 기운이 ${GRP[top2[0]]}(${pct(g[top2[0]])})과 ${GRP[top2[1]]}(${pct(g[top2[1]])})입니다. ${pt[1]}</p>`,
    `일간 ${ST[dm]} · 월지 ${BR[P.month.b]}(${SEASONS[si]}) · 일지 ${tenGod(dm,MAIN(P.day.b))} · 상위 십성군 ${GRP[top2[0]]}·${GRP[top2[1]]}`]);

  // 1-2 초년·청년·중년·말년
  let gw='';
  const RV=r=>r==='용신'?2:r==='희신'?1:r==='구신'?-1:r==='기신'?-2:0;
  const relW={충:'부딪혀 큰 변동이 있습니다',형:'갈등과 조정할 일이 생깁니다',원진:'애증이 얽힙니다',육합:'좋은 인연으로 묶입니다',해:'은근한 서운함이 쌓입니다',파:'계획이 중간에 틀어지기 쉽습니다'};
  [['year'],['month'],['day'],['hour']].forEach(([k])=>{
    const p=P[k]; if(!p) return;
    const sT=k==='day'?null:tenGod(dm,p.s), bT=tenGod(dm,MAIN(p.b));
    const rs=k==='day'?null:A.role[ST_EL[p.s]], rb=A.role[BR_EL[p.b]];
    const sc=(k==='day'?0:RV(rs))+RV(rb)*1.5, lvl=sc>=1.5?0:sc<=-1.5?2:1;
    const [nm,age]=STAGE_NAME[k];
    const sents=[STAGE_OPEN[k][lvl]];
    const gb=Math.floor(TGN.indexOf(bT)/2);
    if(k==='day'||rb==='한신') sents.push(TG_POS[bT][k]);
    if(rb!=='한신') sents.push(STAGE_EFFECT[gb][RV(rb)>0?'good':'bad'][k]+'.');
    if(sT&&sT!==bT){const gs=Math.floor(TGN.indexOf(sT)/2);
      sents.push(rs==='한신'?`천간의 ${jo(sT,'은','는')} ${TG_POS[sT][k]}`:`천간에 ${jo(sT,'이','가')} 드러나 있어 ${STAGE_EFFECT[gs][RV(rs)>0?'good':'bad'][k]}.`)}
    const ws=twelve(dm,p.b);
    sents.push(`이 시기 일간은 ${ws}의 자리에 놓여 ${WS_FULL[ws]}`);
    const ss=[...new Set(A.perPos[k])].filter(n=>SS_STAGE[n]).slice(0,2);
    ss.forEach(n=>sents.push(`${jo(n,'이','가')} 있어 ${SS_STAGE[n]}.`));
    const rl=A.rel.filter(r=>(r.a===k||r.b===k)&&relW[r.t]);
    if(rl.length){const r=rl[0],o=r.a===k?r.b:r.a;sents.push(`${STAGE_NAME[o][0].replace("운","")}의 기둥과 ${r.txt.replace(/\(.\)/,"")}을 이뤄 ${relW[r.t]}.`)}
    if(k==='year'&&ageNow<=15){sents[0]=OPEN_NOW[lvl];for(let i=1;i<sents.length;i++)sents[i]=toPresent(sents[i])}
    gw+=`<div class="stg"><div class="stg-h"><b>${nm}</b><span>${age}</span>${hz(p.s,p.b)}<span class="stg-l s${lvl}">${['순탄','보통','굴곡'][lvl]}</span></div><p>${sents.join(' ')}</p></div>`;
  });
  rows.push(['인생 시기별 운','초년 · 청년 · 중년 · 말년',gw,null]);

  // 2 성격
  const PERS={0:'비겁이 강해 자존심과 독립심이 크고 지기 싫어합니다.',1:'식상이 강해 말과 표현이 풍부하고 아이디어가 많습니다.',2:'재성이 강해 현실 감각과 계산이 빠르고 결과를 중시합니다.',3:'관성이 강해 책임감과 체면을 중시하고 스스로에게 엄격합니다.',4:'인성이 강해 생각이 깊고 배우기를 좋아하지만 실행이 늦어질 수 있습니다.'};
  const topG=[0,1,2,3,4].sort((a,b)=>g[b]-g[a])[0];
  let pers=`<p>${PERS[topG]} `;
  pers+=A.lv3==='strong'?'일간이 강해 주관이 뚜렷하고 밀어붙이는 힘이 있습니다.':A.lv3==='weak'?'일간이 약해 상황과 사람에 맞추는 유연함이 있지만 쉽게 지치고 휘둘릴 수 있습니다.':'일간이 균형 잡혀 있어 극단으로 치우치지 않습니다.';
  pers+='</p>';
  const add=[];
  if(ssNames.has('괴강')) add.push('괴강이 있어 한번 마음먹으면 끝을 보는 극단적인 강인함이 있습니다');
  if(ssNames.has('양인')) add.push('양인이 있어 결단이 빠르고 승부욕이 강합니다');
  if(ssNames.has('화개')) add.push('화개가 있어 혼자만의 세계와 정신적인 것을 중시합니다');
  if(ssNames.has('도화')||ssNames.has('홍염')) add.push('도화·홍염이 있어 사람을 끄는 매력이 있습니다');
  if(A.cnt.some(v=>v===0)) add.push(`${A.cnt.map((v,i)=>v===0?EL[i]:null).filter(Boolean).join('·')} 기운이 없어 ${A.cnt.map((v,i)=>v===0?['계획과 시작','표현과 열정','중심과 신용','결단과 정리','휴식과 유연함'][i]:null).filter(Boolean).join(', ')}이 부족해지기 쉽습니다`);
  if(add.length) pers+=`<p>${add.join('. ')}.</p>`;
  rows.push(['성격','기질과 성향',pers,`가장 강한 십성 ${GRP[topG]} ${pct(g[topG])} · 강약 ${A.level}${add.length?' · 신살·오행 결핍':''}`]);
  rows.push(['MBTI로 본 성격','타고난 기질과 지금의 모습',mbtiRow(A,R.o.mbti,youngNow),null]);

  // 3 적성
  const gt=GYEOK_TXT[A.gName];
  let job=youngNow?`<p>${A.gName}의 소질을 타고나 커서 <b>${gt.job}</b> 쪽에서 재능을 펼치기 좋습니다. 지금은 <b>${EL_STUDY[A.Y]}</b> 과목이 잘 맞고, ${EL_STUDY[mod(A.Y-1,5)]} 쪽도 도움이 됩니다.</p><p>${RAISE[yg]}.</p>`:`<p>${A.gName}의 특성상 <b>${gt.job}</b> 분야가 맞습니다. 용신이 ${GRP[yg]}이므로 <b>${YONG_GRP[yg].job}</b>에서 운이 잘 풀립니다.</p>`;
  const jx=[];
  if(ssNames.has('역마')) jx.push('역마가 있어 이동이 많은 일, 무역, 해외 관련 일이 잘 맞습니다');
  if(ssNames.has('문창귀인')) jx.push('문창귀인이 있어 글, 강의, 시험을 거치는 직업에 유리합니다');
  if(ssNames.has('화개')) jx.push('화개가 있어 예술, 종교, 학문, 연구 분야에 재능이 있습니다');
  if(ssNames.has('양인')||ssNames.has('백호')) jx.push('양인·백호의 강한 기운은 의료, 군경, 기술직처럼 칼과 기계를 다루는 일에서 좋게 쓰입니다');
  if(ssNames.has('도화')) jx.push('도화가 있어 대중을 상대하는 일, 방송, 서비스업에 유리합니다');
  if(youngNow){jx.length=0;const Y2={역마:'활동적이고 새로운 곳에 가는 것을 좋아합니다',문창귀인:'글과 공부에 재주가 있습니다',화개:'그림·음악처럼 혼자 몰입하는 활동에 빠져듭니다',양인:'운동 신경과 승부욕이 좋습니다',백호:'활동적이라 운동에 소질이 있습니다',도화:'사람들 앞에 서는 것을 좋아하고 인기가 많습니다'};Object.keys(Y2).forEach(n=>{if(ssNames.has(n))jx.push(Y2[n])})}
  if(jx.length) job+=`<p>${jx.join('. ')}.</p>`;
  if(!youngNow) job+=`<p>오행으로 보면 용신 ${hlE(A.Y)}의 업종(<b>${EL_JOB[A.Y]}</b>)과 희신 ${hlE(mod(A.Y-1,5))}의 업종(${EL_JOB[mod(A.Y-1,5)]})이 유리하고, 기신 ${hlE(A.role.indexOf('기신'))}의 업종은 피하는 편이 좋습니다.</p>`;
  if(A.cnt[mod(de+3,5)]===0) job+=youngNow?'<p>관성이 없어 정해진 틀과 규칙을 답답해합니다. 스스로 계획을 세우게 하면 더 잘합니다.</p>':'<p>관성이 없어 조직의 틀에 묶이는 것을 답답해합니다. 자유로운 근무 형태가 편합니다.</p>';
  rows.push([youngNow?'적성과 진로':'적성과 직업',youngNow?'공부와 장래':'맞는 일의 방향',job,`격국 ${A.gName} · 용신 ${GRP[yg]}(${EL[A.Y]})${jx.length?' · 신살':''}`]);

  // 4 재물
  const jr=roleOfG(2), gpJ=g[2];
  let mon='';
  if(A.cnt[mod(de+2,5)]===0&&gpJ<0.05) mon+='<p>원국에 재성이 드러나지 않습니다. 돈 자체를 좇기보다 실력과 명예를 쌓으면 돈이 따라오는 구조입니다. 돈 관리에 무심하기 쉬우니 자동 저축 같은 장치를 두세요.</p>';
  if(good(jr)) mon+=`<p>재성이 내게 <b>${jr}</b>입니다. 돈을 벌고 다루는 일이 곧 운을 여는 길이라 재물로 일어설 수 있는 사주입니다.</p>`;
  else if(bad(jr)) mon+=`<p>재성이 내게 <b>${jr}</b>입니다. 돈을 좇을수록 몸과 마음이 상하기 쉬우니, 돈보다 실력·명예·관계를 먼저 쌓을 때 재물이 따라옵니다.</p>`;
  else mon+='<p>재성이 한신이라 재물이 크게 돕지도 해치지도 않습니다. 꾸준한 수입과 저축으로 쌓는 편이 맞습니다.</p>';
  if(g[1]>=0.15&&gpJ>=0.1) mon+='<p>식상이 재성을 생하는 <b>식상생재</b>가 있어 재능과 기술이 돈이 됩니다.</p>';
  if(g[0]>=0.3&&gpJ<0.15&&gpJ>0) mon+='<p>비겁이 강하고 재성이 약한 <b>군겁쟁재</b> 경향이 있어 돈이 사람을 통해 새기 쉽습니다. 동업과 보증은 피하세요.</p>';
  if(A.lv3==='weak'&&gpJ>=0.3) mon+='<p>재성은 많은데 몸이 약한 <b>재다신약</b>입니다. 돈이 보여도 감당하느라 고생할 수 있으니 무리한 투자보다 실력과 체력을 먼저 키우세요.</p>';
  const GO={0:7,1:10,2:10,3:1,4:4};
  const jEl=mod(de+2,5);
  if([P.year,P.month,P.day,P.hour].filter(Boolean).some(p=>p.b===GO[jEl])) mon+=`<p>재성의 창고(${BR[GO[jEl]]})가 있어 돈을 모아 두는 힘이 있습니다.</p>`;
  const YS=yearScan();
  const mY=YS.filter(x=>x.money.m==='◎'||x.money.m==='○').map(x=>x.Y), lY=YS.filter(x=>x.money.m==='△').map(x=>x.Y);
  if(!youngNow) mon+=`<p><b>앞으로 10년</b> · 재물이 들어오는 해: ${mY.length?mY.join(', ')+'년':'뚜렷한 해 없음'}${lY.length?` / 지출·손재를 조심할 해: ${lY.join(', ')}년`:''}</p>`;
  if(youngNow) mon='<p class="muted">어른이 된 뒤의 재물 그릇입니다.</p>'+mon;
  rows.push([youngNow?'타고난 재물 그릇':'재물운','돈이 들어오고 나가는 구조',mon,`재성 ${pct(gpJ)} · 재성은 ${jr} · 강약 ${A.level}`]);

  // 5 배우자
  const sg=male?2:3, sKey=male?'재성(아내의 별)':'관성(남편의 별)';
  const dRole=A.role[BR_EL[P.day.b]];
  let sp=`<p>배우자 자리(일지)에 ${BR[P.day.b]}(${tenGod(dm,MAIN(P.day.b))})가 있습니다. `;
  const SPOUSE={'비견':'친구 같은 대등한 관계입니다.','겁재':'자기주장이 강한 배우자와 인연이 있어 경제는 각자 관리하는 편이 좋습니다.','식신':'편안하고 다정한 관계입니다.','상관':'표현이 풍부하고 감정 기복이 있는 관계라 말을 부드럽게 해야 합니다.','편재':'사교적이고 활동적인 배우자와 인연이 있습니다.','정재':'알뜰하고 성실한 배우자와 인연이 있습니다.','편관':'강하고 카리스마 있는 배우자와 인연이 있습니다.','정관':'반듯하고 책임감 있는 배우자와 인연이 있습니다.','편인':'생각이 깊고 독특한 배우자와 인연이 있습니다.','정인':'나를 보살피는 배우자와 인연이 있습니다.'};
  sp+=SPOUSE[tenGod(dm,MAIN(P.day.b))]+` 일지 오행이 내게 ${dRole}이라 ${good(dRole)?'<b>배우자의 덕</b>을 보는 구조입니다.':bad(dRole)?'배우자와 맞춰 가는 데 노력이 필요한 구조입니다.':'배우자 관계가 무난한 편입니다.'}</p>`;
  const sCnt=A.cnt[mod(de+sg,5)], sG=g[sg];
  if(sCnt===0) sp+=`<p>${sKey}이 원국에 없어 인연이 늦거나 기준이 까다로울 수 있습니다. ${sKey.slice(0,2)}이 들어오는 대운·세운에 인연이 잘 닿습니다.</p>`;
  else if(sG>=0.3) sp+=`<p>${sKey}이 많아 이성의 관심을 많이 받습니다. 관계가 복잡해지지 않게 선을 분명히 하세요.</p>`;
  if(!male&&A.tou('정관')&&A.tou('편관')) sp+='<p>정관과 편관이 함께 드러난 관살혼잡이라 이성 인연이 복잡해질 수 있습니다.</p>';
  if(male&&A.tou('정재')&&A.tou('편재')) sp+='<p>정재와 편재가 함께 드러나 이성 인연이 복잡해질 수 있습니다.</p>';
  const dayRel=A.rel.filter(r=>r.a==='day'||r.b==='day');
  const dr=[];
  dayRel.forEach(r=>{if(r.t==='충')dr.push('일지가 충을 받아 배우자 관계나 거주지에 변동이 생기기 쉽습니다');if(r.t==='원진')dr.push('일지에 원진이 있어 가까울수록 서운함이 쌓이기 쉽습니다');if(r.t==='형')dr.push('일지에 형이 있어 다툼이 생기면 길어지기 쉽습니다');if(r.t==='육합')dr.push('일지가 합을 이뤄 배우자와 정이 깊습니다')});
  if(A.gong.includes(P.day.b)) dr.push('일지가 공망이라 배우자와 마음이 엇갈리기 쉽습니다');
  if(dr.length) sp+=`<p>${[...new Set(dr)].join('. ')}.</p>`;
  const age=NOW-R.y, loveY=YS.filter(x=>x.love.m==='♡').map(x=>x.Y), chgY=YS.filter(x=>x.love.m==='△').map(x=>x.Y);
  if(!youngNow) sp+=`<p><b>앞으로 10년</b> · ${age<55?'인연·결혼운이 강한 해':'관계가 깊어지는 해'}: ${loveY.length?loveY.join(', ')+'년':'뚜렷한 해 없음'}${chgY.length?` / 관계 변동을 조심할 해: ${chgY.join(', ')}년`:''}</p>`;
  if(youngNow) sp='<p class="muted">커서 만나게 될 배우자 인연입니다.</p>'+sp;
  rows.push([youngNow?'장래의 배우자':'배우자 · 인연',male?'아내 자리와 재성':'남편 자리와 관성',sp,`일지 ${BR[P.day.b]}(${dRole}) · ${sKey} ${pct(sG)}${dr.length?' · 일지 합충':''}`]);

  // 6 육친
  const inR=roleOfG(4), jaeR=roleOfG(2), chG=male?3:1, chR=roleOfG(chG);
  const yR=A.role[BR_EL[P.year.b]], mR=A.role[BR_EL[P.month.b]];
  let yk=`<p><b>부모</b>: 어머니(인성)는 내게 ${inR}, 아버지(재성)는 ${jaeR}입니다. ${good(inR)?'어머니의 도움과 정서적 지지를 받습니다. ':''}${good(jaeR)?'아버지와의 인연이 힘이 됩니다. ':''}${bad(inR)&&bad(jaeR)?'부모에게 기대기보다 일찍 독립하는 편이 낫습니다. ':''}초년(년·월주)의 지지가 ${yR}·${mR}이라 ${youngNow?(good(mR)?'자라는 환경의 도움을 받습니다.':bad(mR)?'자라는 동안 마음고생을 할 수 있어 곁의 지지가 중요합니다.':'자라는 환경은 무난합니다.'):(good(mR)?'성장 환경의 도움을 받았습니다.':bad(mR)?'성장기에 어려움을 겪었을 수 있습니다.':'성장 환경은 무난합니다.')}</p>`;
  if(P.hour){const hR=A.role[BR_EL[P.hour.b]];
    yk+=`<p><b>자녀·말년</b>: 자녀의 별(${male?'관성':'식상'})은 ${chR}, 자녀 자리(시지)는 ${hR}입니다. ${good(chR)||good(hR)?'자녀 덕이 있고 말년이 편안한 편입니다.':bad(chR)&&bad(hR)?'자녀 문제로 마음 쓸 일이 있으니 말년 준비를 스스로 해 두세요.':'자녀와의 관계는 무난합니다.'}${A.gong.includes(P.hour.b)?' 시지가 공망이라 자녀 인연이 늦거나 약할 수 있습니다.':''}</p>`}
  else yk+='<p class="muted">시간을 모르면 자녀·말년 자리는 판단하지 않습니다.</p>';
  if(g[0]>=0.3) yk+='<p><b>형제·동료</b>: 비겁이 강해 형제·동료가 많고 경쟁도 많습니다.</p>';
  rows.push(['육친','부모·형제·자녀',yk,`인성 ${inR} · 재성 ${jaeR} · ${male?'관성':'식상'} ${chR} · 궁성(년·월·시주)`]);

  // 7 건강
  let hl='';
  const lack=[0,1,2,3,4].filter(e=>A.cnt[e]===0), much=[0,1,2,3,4].filter(e=>A.ep[e]>=0.35);
  lack.forEach(e=>hl+=`<p>${hlE(e)} 기운이 없어 <b>${ORGAN[e]}</b> 쪽이 약할 수 있습니다.</p>`);
  much.forEach(e=>{const t=mod(e+2,5);hl+=`<p>${hlE(e)} 기운이 과해(${pct(A.ep[e])}) ${ORGAN[e]}에 무리가 오기 쉽고, 이 기운이 누르는 ${hlE(t)}(${ORGAN[t]})도 함께 살피세요.</p>`});
  const gi=A.role.indexOf('기신');
  if(!much.includes(gi)&&!lack.includes(gi)) hl+=`<p>기신인 ${hlE(gi)} 운이 올 때 ${ORGAN[gi]} 쪽 컨디션이 떨어지기 쉽습니다.</p>`;
  {const k=[ssNames.has('백호')&&'백호',ssNames.has('양인')&&'양인',A.rel.some(r=>r.t==='형')&&'형'].filter(Boolean);if(k.length) hl+=`<p>${jo(k.join('·'),'이','가')} 있어 ${youngNow?'뛰어놀다 다치는 일을':'사고, 수술, 다침을'} 조심해야 합니다.</p>`;}
  rows.push(['건강','오행으로 보는 체질',hl,null]);

  $('overall').innerHTML=rows.map(([t,s,b])=>`<div class="ov-row"><h3>${t}<small>${s}</small></h3><div>${b}</div></div>`).join('');
}

/* ---------- 대운·세운 ---------- */
const CHUNG_TXT={day:'배우자·거주지에 변동이 생기기 쉽습니다(이사, 관계 변화)',month:'직장·사회 환경이 크게 바뀌기 쉽습니다(이직, 부서 이동)',year:'집안 어른이나 고향과 관련된 변화가 있을 수 있습니다',hour:'자녀나 아랫사람, 장래 계획에 변동이 생깁니다'};
const HAP_TXT={day:'좋은 인연이 들어오거나 결혼·동업 같은 결합의 기회가 생깁니다',month:'직장·사회에서 협력자와 기회가 생깁니다',year:'윗사람과 집안의 도움이 있습니다',hour:'자녀 경사나 아랫사람의 도움이 있습니다'};
function renderDW(){
  const dm=A.dm, age=NOW-R.y;
  $('dwInfo').textContent=`대운수 ${R.dsu} · ${R.fwd?'순행':'역행'} · 만 ${Math.floor(R.startYears)}세 ${Math.round((R.startYears%1)*12)}개월부터`;
  const L=R.dw.map(d=>evalLuck(A,R,d.s,d.b));
  const curI=R.dw.findIndex((d,i)=>age>=d.age&&(!R.dw[i+1]||age<R.dw[i+1].age));
  $('dw').innerHTML=R.dw.map((d,i)=>{const [rt,rc]=rateOf(L[i].v);return `<div class="dc ${i===curI?'now':''}">
      <span class="age mono">${d.age}세</span>${stemTile(d.s)}${brTile(d.b)}<span class="rate ${rc}">${rt}</span><span class="yr mono">${d.year}~</span></div>`}).join('');
  $('dwDetail').innerHTML=R.dw.map((d,i)=>{
    const e=L[i], [rt,rc]=rateOf(e.v), next=R.dw[i+1], past=next&&age>=next.age;
    const ts=tenGod(dm,d.s), tb=tenGod(dm,MAIN(d.b));
    return `<div class="dr ${i===curI?'now':''} ${past?'past':''}">
      <div class="dr-l">${hz(d.s,d.b).replace('class="pz"','class="pz" style="font-size:26px"')}<span class="ag">${d.age}~${d.age+9}세</span><span class="yy mono">${d.year}~${d.year+9}</span></div>
      <div class="dr-r"><div class="top">${i===curI?'<span class="nowtag">지금</span>':''}<span class="rate ${rc}">${rt}</span><span class="chip">${ts} · ${tb}</span></div>${luckText(d,e,i===0?null:R.dw[i-1])}</div></div>`}).join('');
  renderYears();
}


/* 대운 한 칸 풀이 */
const bj=(b,a,c)=>`${BR[b]}(${BRK[b]})${hasJong(BRK[b])?a:c}`;
const gj=(st,b,a,c)=>`${ST[st]}${BR[b]}(${STK[st]}${BRK[b]})${hasJong(BRK[b])?a:c}`;
function luckText(d,e,prev){
  const P=R.pillars, dm=A.dm, de=A.de;
  const ts=tenGod(dm,d.s), tb=tenGod(dm,MAIN(d.b));
  const sEl=ST_EL[d.s], gS=grpOf(dm,sEl), gB=mod(e.bEl-de,5);
  const pk=[['year',P.year],['month',P.month],['day',P.day],['hour',P.hour]].filter(x=>x[1]);
  const out=[];
  const PAL=d.age<18?{...PALACE,day:'내 생활',hour:'장래 계획'}:PALACE;
  // 1. 천간: 드러나는 일
  let sl=(d.age<18?STEM_LUCK_YOUTH:STEM_LUCK)[ts][roleIdx(e.rs)]; if(d.age>=50) sl=sl.replace(/\s?[^.]*결혼[^.]*\./,'');
  let st=`<p><b>천간 ${ST[d.s]}(${ts})</b> ${roleChip(e.rs)} 앞 5년, 겉으로 드러나는 일 · ${sl}`;
  const sx=[];
  pk.forEach(([k,p])=>{
    const t2=k==='day'?'일간':`${POSK[k]}간 ${ST[p.s]}(${tenGod(dm,p.s)})`, t2j=k==='day'?'일간과':t2+(hasJong(STK[p.s])?'과':'와');
    if(mod(d.s-p.s,10)===5){
      if(k==='day') sx.push(`일간과 ${ST[d.s]}${ST[p.s]}합을 이뤄 ${ts} 쪽으로 마음이 묶입니다. ${'정재편재'.includes(ts)?'재물이나 이성과 인연이 맺어집니다':'정관편관'.includes(ts)?'직장·조직이나 이성과 인연이 맺어집니다':'새로운 인연과 계약이 생깁니다'}`);
      else sx.push(`원국 ${t2j} 합해 그 기운을 묶어 둡니다. ${['용신','희신'].includes(A.role[ST_EL[p.s]])?'원국의 좋은 기운이 묶여 아쉬움이 생깁니다':'원국의 꺼리는 기운이 묶여 오히려 홀가분해집니다'}`)}
    if([[0,6],[1,7],[2,8],[3,9]].some(([x,y])=>(d.s===x&&p.s===y)||(d.s===y&&p.s===x)))
      sx.push(`원국 ${t2j} 충해 ${k==='day'?'나 자신의 생각과 방향이 크게 흔들립니다':`${tenGod(dm,p.s)}에 해당하는 일(${PALACE[k]})이 흔들립니다`}`);
  });
  if(A.cnt[sEl]===0) sx.push(`원국에 없던 ${elJo(sEl,'이','가')} 들어와 ${GRP[gS]}에 관한 일이 새로 생깁니다`);
  if(sx.length) st+=` <span class="muted">${[...new Set(sx)].join('. ')}.</span>`;
  out.push(st+'</p>');
  // 2. 지지: 생활 환경 + 지장간
  const hid=HID[d.b].map(s=>`${ST[s]}(${tenGod(dm,s)})`).join('·');
  let bt=`<p><b>지지 ${BR[d.b]}(${tb})</b> ${roleChip(e.rb)} 뒤 5년, 생활 환경 · `;
  if(gS===gB&&e.rs===e.rb) bt+=`천간과 같은 ${EL[e.bEl]} 기운이 지지에도 깔려 있어 이 흐름이 10년 내내 이어집니다. ${(d.age<18?BR_ENV_YOUTH:BR_ENV)[gB][roleIdx(e.rb)]}`;
  else bt+=(d.age<18?BR_ENV_YOUTH:BR_ENV)[gB][roleIdx(e.rb)];
  bt+=` 지장간은 ${hid}이라 ${HID[d.b].length>2?`${tenGod(dm,HID[d.b][0])}·${tenGod(dm,HID[d.b][1])}의 일도 섞여 나타납니다`:`${tenGod(dm,HID[d.b][0])}의 기운도 함께 작용합니다`}.`;
  if(e.bNote) bt+=` ${e.bNote}.`;
  out.push(bt+'</p>');
  // 3. 원국 지지와의 관계
  const bx=[];
  const kk=(a,b)=>[Math.min(a,b),Math.max(a,b)].join(',');
  const XING=['2,5','5,8','2,8','1,10','7,10','1,7','0,3'],PA=['0,9','1,4','2,11','3,6','5,8','7,10'],HAE=['0,7','1,6','2,5','3,4','8,11','9,10'],WJ=['0,7','1,6','2,9','3,8','4,11','5,10'];
  pk.forEach(([k,p])=>{const q=kk(d.b,p.b),w=`${POSK[k]}지 ${bj(p.b,'과','와')}`;
    if(mod(d.b-p.b,12)===6){let t=`${w} 충: ${d.age<18?{day:'가족 분위기나 사는 곳이 바뀌기 쉽습니다(이사·전학)',month:'학교나 주변 환경이 크게 바뀌기 쉽습니다',year:'집안 어른과 관련된 변화가 있을 수 있습니다',hour:'계획했던 일이 바뀌기 쉽습니다'}[k]:CHUNG_TXT[k]}`;if([1,4,7,10].includes(d.b)&&[1,4,7,10].includes(p.b))t+=' 창고(묘고)가 열리는 충이라 묻혀 있던 재물이나 일이 드러나기도 합니다';bx.push(t)}
    if(mod(d.b+p.b,12)===1) bx.push(`${w} 합: ${HAP_TXT[k]}`);
    if(XING.includes(q)||(d.b===p.b&&[4,6,9,11].includes(d.b))) bx.push(`${w} 형: ${PAL[k]} 쪽에 다툼이나 수술·소송 같은 조정할 일이 생깁니다`);
    if(PA.includes(q)) bx.push(`${w} 파: ${PAL[k]} 쪽 일이 중간에 틀어지기 쉽습니다`);
    if(HAE.includes(q)) bx.push(`${w} 해: ${PAL[k]} 쪽에 서운함과 은근한 방해가 생깁니다`);
    if(WJ.includes(q)) bx.push(`${w} 원진: ${PAL[k]} 쪽 관계에 애증이 생깁니다`);
  });
  // 4. 대운 신살
  if(GOEGANG.some(([s,b])=>s===d.s&&b===d.b)) bx.push(`${gj(d.s,d.b,'은','는')} 괴강이라 이 10년은 결단과 변화가 크고 성패의 폭이 넓습니다`);
  if(BAEKHO.some(([s,b])=>s===d.s&&b===d.b)) bx.push(`${gj(d.s,d.b,'은','는')} 백호라 사고, 수술, 건강을 특히 조심해야 합니다`);
  if(CHEONEUL[dm].includes(d.b)) bx.push(`${bj(d.b,'은','는')} 천을귀인이라 어려울 때 도와주는 사람이 나타납니다`);
  [['year',P.year.b],['day',P.day.b]].forEach(([k,bb])=>{const gi=SAMHAP_GRP(bb);
    if(YEOKMA[gi]===d.b) bx.push(`역마가 들어와 이사, 이직, 해외 등 이동이 많아집니다`);
    if(DOHWA[gi]===d.b) bx.push(`도화가 들어와 인기와 이성 인연이 늘어납니다`);});
  if(A.gong.includes(d.b)) bx.push(`${bj(d.b,'은','는')} 공망이라 지지의 영향이 약해지고 노력에 비해 결과가 허전할 수 있습니다`);
  if(A.cnt[BR_EL[d.b]]===0&&BR_EL[d.b]!==sEl) bx.push(`원국에 없던 ${elJo(BR_EL[d.b],'이','가')} 지지로 들어와 ${GRP[mod(BR_EL[d.b]-de,5)]}의 환경이 새로 갖춰집니다`);
  if(bx.length) out.push(`<p class="muted">${[...new Set(bx)].join('<br>')}</p>`);
  // 5. 단계 · 결론
  const stg=stageOf(d.age+5);
  const ws=e.ws, strongWs=['장생','관대','건록','제왕'].includes(ws), weakWs=['병','사','묘','절'].includes(ws);
  let fin=`<p>일간이 ${BR[d.b]}에서 <b>${ws}</b> 단계로 ${WS_TXT[ws]} 때입니다.`;
  fin+=strongWs&&A.lv3==='weak'?' 약한 일간이 힘을 얻어 하고 싶은 일을 밀어붙일 수 있습니다.':strongWs&&A.lv3==='strong'?' 원래 강한 일간이 더 강해져 고집과 과욕을 조심해야 합니다.':weakWs&&A.lv3==='weak'?' 원래 약한 일간이 더 약해지니 무리하지 말고 체력을 아끼세요.':weakWs&&A.lv3==='strong'?' 강한 일간의 힘이 빠져 오히려 균형이 잡힙니다.':'';
  fin+=` ${STAGE[stg]}에 ${GRP[gB]} 환경이 오니 ${STAGE_TXT[stg][gB]}`;
  if(prev){const pv=evalLuck(A,R,prev.s,prev.b).v;
    if(e.v-pv>=1.2) fin+=' 앞 대운보다 흐름이 확 좋아지는 전환점입니다.';
    else if(pv-e.v>=1.2) fin+=' 앞 대운보다 흐름이 꺾이니 미리 대비하세요.';}
  out.push(fin+'</p>');
  return out.join('');
}

/* ---------- 총운 ---------- */
const CLOSE=[
 '혼자 버티는 것보다 함께 가는 길이 멀리 갑니다. 좋은 사람을 곁에 두는 것이 당신의 가장 큰 재산입니다.',
 '당신 안에 있는 것을 꺼내 보이세요. 세상은 보여 주는 만큼 알아보고, 알아보는 만큼 돌려줍니다.',
 '생각은 충분합니다. 이제 숫자로 남기세요. 작게라도 손에 잡히는 결과가 다음 문을 엽니다.',
 '책임을 피하지 마세요. 무게를 감당하는 만큼 자리가 커지고, 자리가 커지는 만큼 운도 커집니다.',
 '서두르지 마세요. 배운 것은 사라지지 않고, 쌓인 실력은 때가 되면 반드시 쓰입니다.'
];
function renderTotal(){
  const P=R.pillars, de=A.de, age=NOW-R.y;
  const yg=mod(A.Y-de,5), gi=A.role.indexOf('기신'), gg=mod(gi-de,5);
  const Y=YONG_GRP[yg];
  const lvTxt=A.lv3==='strong'?'일간이 강해 에너지를 밖으로 써야 하는 구조이고':A.lv3==='weak'?'일간이 약해 먼저 힘을 길러야 하는 구조이고':'일간이 균형 잡힌 구조이고';
  const stTxt={'성격':'격이 바로 서 있어 타고난 틀을 믿고 가면 됩니다.','파격':'격을 깨는 요소가 있어 정해진 길보다 스스로 길을 고쳐 가는 인생입니다.','구응':'흔들림이 있어도 결국 바로잡히는 구조입니다.','보통':'운의 흐름을 잘 타는 것이 중요합니다.','종격':'강한 흐름을 거스르지 않을 때 크게 됩니다.'}[A.gStatus];

  const yN=['kid','teen'].includes(band(age));
  let think=yN?`<p>${RAISE[yg]}. ${DM_TXT[A.dm][0]}의 기질이라 ${['억지로 고치기보다 장점을 살려 주는','타고난 성향을 믿고 기다려 주는','따뜻한 환경을 만들어 주는','작은 성취를 자주 칭찬해 주는','스스로 해낼 기회를 주는'][A.dm%5]} 것이 가장 좋습니다.</p>`:`<p>${Y.think}</p>`;
  if(yN) think+=A.lv3==='strong'?'<p>기운이 넘치는 아이라 가만히 두면 고집이 됩니다. 운동이나 예체능처럼 에너지를 쏟을 곳을 마련해 주세요.</p>':A.lv3==='weak'?'<p>기운이 여린 아이라 쉽게 지칩니다. 많은 것을 시키기보다 한두 가지를 꾸준히 하게 하고 충분히 쉬게 해 주세요.</p>':'<p>균형 잡힌 기질이라 어떤 환경에도 잘 적응합니다.</p>';
  else think+=A.lv3==='strong'?'<p>힘이 넘치는 사주라 참기만 하면 고집과 답답함이 됩니다. 일, 운동, 창작처럼 에너지를 쏟을 곳을 늘 두세요.</p>':A.lv3==='weak'?'<p>내 힘이 약한 사주라 모든 기회를 다 잡으려 하면 탈이 납니다. 할 수 있는 만큼만 고르고, 쉬는 것도 실력이라고 생각하세요.</p>':'<p>균형 잡힌 사주라 극단적인 선택보다 중간을 지키는 판단이 잘 맞습니다.</p>';

  const warn=[`<b>${GRP[gg]}(${EL[gi]})이 기신입니다</b>: ${yN?KID_GI[gg]:GI_GRP[gg]}`];
  if(!yN) A.bad.forEach(b=>warn.push(`<b>${b.split(' ').slice(-1)[0]}</b>: 격을 깨는 구조이니 이 부분이 문제될 때 특히 신중하세요.`));
  const ch=A.rel.filter((r,i,a)=>(r.t==='충'||r.t==='형')&&a.findIndex(x=>x.txt===r.txt)===i);
  if(ch.length&&!yN) warn.push(`<b>원국의 ${ch.map(r=>r.txt).join(', ')}</b>: ${[...new Set(A.rel.filter(r=>r.t==='충'||r.t==='형').map(r=>PAIR_TXT[[r.a,r.b].join('-')]))].filter(Boolean).join(', ')} 사이에 갈등과 변동이 생기기 쉽습니다. 큰 변화는 한 번에 하나씩 하세요.`);
  const ssN=new Set(A.ss.map(x=>x.name));
  ['양인','백호','괴강'].filter(n=>ssN.has(n)).forEach(n=>warn.push(`<b>${n}</b>: ${yN?'기운이 강해 다치거나 부딪히는 일을 조심해야 합니다. 활동적인 운동으로 기운을 풀어 주세요.':SINSAL_TXT[n][1]}`));

  const L=R.dw.map(d=>evalLuck(A,R,d.s,d.b).v);
  const curI=R.dw.findIndex((d,i)=>age>=d.age&&(!R.dw[i+1]||age<R.dw[i+1].age));
  let fut=R.dw.map((d,i)=>({d,v:L[i],i})).filter(x=>x.d.age+9>=age&&x.d.age<=age+30);
  if(!fut.length) fut=R.dw.map((d,i)=>({d,v:L[i],i})).filter(x=>x.d.age+9>=age);
  const best=fut.slice().sort((a,b)=>b.v-a.v||a.i-b.i)[0], worst=fut.slice().sort((a,b)=>a.v-b.v||a.i-b.i)[0];
  const nextChange=R.dw.find(d=>d.age>age);
  let flow='';
  if(curI>=0){const c=R.dw[curI],[rt]=rateOf(L[curI]);
    flow+=`<p>지금은 <b>${c.age}~${c.age+9}세 ${ST[c.s]}${BR[c.b]} 대운</b>으로 운의 평가는 <b>${rt}</b>입니다. ${yN?(L[curI]>=0.4?'배우고 자라는 힘이 좋은 시기입니다.':L[curI]>-0.4?'무난하게 자라는 시기입니다.':'마음고생이 있을 수 있으니 곁에서 많이 다독여 주세요.'):(L[curI]>=0.4?'준비해 온 일을 밀고 나가기 좋습니다.':L[curI]>-0.4?'큰 승부보다 기반을 다지는 데 집중하세요.':'지키는 게 버는 것이니 무리한 확장은 미루세요.')}</p>`}
  else flow+=`<p>아직 첫 대운(${R.dsu}세) 전입니다.</p>`;
  if(best&&best.v>=0.4) flow+=`<p>앞으로 30년 중 가장 힘을 받는 때는 <b>${best.d.age}~${best.d.age+9}세(${best.d.year}~${best.d.year+9}년)</b>입니다. ${best.d.age<20?'이 시기에 공부와 재능이 크게 자랍니다.':yN?'지금 쌓은 기초가 이때 크게 꽃핍니다.':'이 시기를 목표로 지금부터 실력과 자금을 준비해 두세요.'}</p>`;
  else flow+='<p>앞으로 30년 안에 용신이 크게 들어오는 대운이 없습니다. 운에 기대기보다 실력과 습관으로 만들어 가는 인생입니다.</p>';
  if(worst&&worst.v<=-0.4&&worst!==best) flow+=`<p><b>${worst.d.age}~${worst.d.age+9}세(${worst.d.year}~${worst.d.year+9}년)</b>는 조심할 시기입니다. ${worst.d.age<20?'학업 스트레스와 건강을 잘 살펴 주세요.':'확장보다 건강, 관계, 현금 확보에 힘쓰세요.'}</p>`;
  if(nextChange) flow+=`<p class="muted">다음 대운 교체는 ${nextChange.year}년 전후입니다. ${yN?'이 무렵 전학·이사 같은 환경 변화가 생기기 쉽습니다.':'앞뒤 1~2년은 큰 결정을 신중하게 하세요.'}</p>`;
  const bars=R.dw.map((d,i)=>{const [rt,rc]=rateOf(L[i]);return `<div class="fb ${rc} ${i===curI?'now':''}" title="${d.age}세 ${ST[d.s]}${BR[d.b]} ${rt}"><i style="height:${14+Math.max(0,L[i]+2)/4*76}px"></i><span>${d.age}</span></div>`}).join('');

  const acts=yN?[`${EL_STUDY[A.Y]} 과목을 즐겁게 접할 기회를 만들어 주세요`,RAISE[mod(mod(A.Y-1,5)-de,5)]]:[...Y.act];
  [A.Y,mod(A.Y-1,5)].forEach((e,i)=>acts.push(`${elName(e)} 기운 채우기(${i?'희신':'용신'}): ${yN?['숲 체험, 화분 키우기','햇볕 아래 뛰어놀기, 발표 연습','규칙적인 생활, 흙 만지기 놀이','정리정돈 습관, 악기 연습','충분한 잠, 독서, 물놀이'][e]:BOOST[e].a}. 색은 ${BOOST[e].c}이 도움이 됩니다.`));

  $('total').innerHTML=`
    <div><p class="tot-key">${yN?`<em>${KID_KEY[yg].split(' ')[0]}</em> ${KID_KEY[yg].split(' ').slice(1).join(' ')}`:Y.key.replace(/(\S+)(\s)/,'<em>$1</em>$2')}</p>
      <p class="tot-sub">용신이 ${GRP[yg]}(${EL[A.Y]})인 ${A.jong?A.jong.type:A.gName} 사주입니다. ${lvTxt}, ${stTxt}</p></div>
    <div class="tot-2">
      <div><h3>${yN?'이렇게 키워 주세요':'어떻게 생각하며 살까'}</h3>${think}</div>
      <div><h3>이것만은 주의하세요</h3><ul>${warn.slice(0,4).map(x=>`<li>${x}</li>`).join('')}</ul></div>
    </div>
    <div class="tot-2">
      <div><h3>인생의 흐름</h3>${flow}</div>
      <div><h3>대운별 운의 높낮이</h3><div class="flow" role="img" aria-label="대운별 운세 흐름">${bars}</div>
        <p class="how" style="font-size:12px;margin-top:8px">막대 아래 숫자는 대운이 시작되는 나이입니다. 초록은 좋은 운, 회색은 보통, 빨강은 주의할 운이고 테두리가 지금입니다.</p></div>
    </div>
    <div><h3>${yN?'생활 속에서 해 줄 것':'오늘부터 실천할 것'}</h3><ol>${acts.map(x=>`<li>${x}</li>`).join('')}</ol></div>
    <div class="tot-close">${yN?'아이는 사주대로 크는 것이 아니라 사주를 알아봐 주는 어른 곁에서 큽니다. 타고난 결을 살려 주세요.':CLOSE[yg]}</div>`;
}

/* ================= 궁합 ================= */
const REL_OPT=[['love','연인 · 부부'],['biz','사업 · 동업 파트너'],['child','내 자녀'],['parent','내 부모']];
function partnerFormHTML(p){
  return `<div class="who">상대</div>
  <div class="frow">
    <label class="fld"><span>관계</span><select id="${p}rel">${REL_OPT.map(([v,t])=>opt(v,t,v==='love')).join('')}</select></label>
    <div class="fld"><span>달력</span>
      <div class="seg"><input type="radio" name="${p}cal" id="${p}cS" value="S" checked><label for="${p}cS">양력</label><input type="radio" name="${p}cal" id="${p}cL" value="L"><label for="${p}cL">음력</label></div></div>
    <div class="fld"><span>생년월일</span>
      <div class="ymd"><select id="${p}yy" aria-label="년"></select><select id="${p}mm" aria-label="월"></select><select id="${p}dd" aria-label="일"></select>
      <label class="chk sm" id="${p}leapWrap" hidden><input type="checkbox" id="${p}leap"> 윤달</label></div></div>
    <div class="fld"><span>태어난 시각</span><div class="ymd"><select id="${p}hh" aria-label="시"></select><select id="${p}mi" aria-label="분"></select></div></div>
    <div class="fld"><span>성별</span>
      <div class="seg"><input type="radio" name="${p}g" id="${p}gM" value="M"><label for="${p}gM">남</label><input type="radio" name="${p}g" id="${p}gF" value="F" checked><label for="${p}gF">여</label></div></div>
    <label class="fld"><span>MBTI (선택)</span><select id="${p}mbti"><option value="">모름</option>${MBTI_LIST.map(t=>`<option>${t}</option>`).join('')}</select></label>
  </div>
  <div class="frow">
    <div class="fld"><span>출생지 (시간 보정)</span><div class="place"><select id="${p}sido" aria-label="시·도"></select><select id="${p}city" aria-label="시·군"></select>
      <input type="number" id="${p}lngIn" step="0.01" min="-180" max="180" value="127.00" aria-label="경도" hidden></div></div>
    <label class="fld"><span>자시 처리</span><select id="${p}ja"><option value="jo" selected>23시부터 다음날 (조자시)</option><option value="ya">자정까지 당일 (야자시)</option></select></label>
    <button type="submit" class="go">궁합 보기</button>
  </div>
  <p class="err" id="${p}fErr" role="alert" hidden></p>`;
}


/* ---------- 판정 도구 ---------- */
const elsJo=(arr,a,b)=>arr.map(e=>EL[e]).join('·')+(hasJong(ELK[arr[arr.length-1]])?a:b);
const kk2=(a,b)=>[Math.min(a,b),Math.max(a,b)].join(',');
function brRel(a,b){ // 두 지지 관계 목록
  const r=[],q=kk2(a,b);
  if(mod(a+b,12)===1) r.push('육합');
  if(SAMHAP_GRP(a)===SAMHAP_GRP(b)&&a!==b) r.push('삼합');
  if(mod(a-b,12)===6) r.push('충');
  if(['2,5','5,8','2,8','1,10','7,10','1,7','0,3'].includes(q)||(a===b&&[4,6,9,11].includes(a))) r.push('형');
  if(['0,9','1,4','2,11','3,6','5,8','7,10'].includes(q)) r.push('파');
  if(['0,7','1,6','2,5','3,4','8,11','9,10'].includes(q)) r.push('해');
  if(['0,7','1,6','2,9','3,8','4,11','5,10'].includes(q)) r.push('원진');
  if(a===b&&!r.length) r.push('같음');
  return r;
}
const BR_SCORE={육합:1,삼합:0.85,같음:0.6,파:0.4,해:0.35,형:0.25,원진:0.2,충:0.1};
const brScore=rels=>rels.length?Math.min(...rels.map(x=>BR_SCORE[x])):0.6;
const STEM_CHUNG=(a,b)=>[[0,6],[1,7],[2,8],[3,9]].some(([x,y])=>(a===x&&b===y)||(a===y&&b===x));

function ghAnalyze(R1,A1,R2,A2,rel){
  const d1=A1.dm,d2=A2.dm,e1=A1.de,e2=A2.de;
  const items=[];
  const add=(key,name,sub,max,ratio,verdict,txt,basis)=>items.push({key,name,sub,max,score:Math.round(max*Math.max(0,Math.min(1,ratio))),verdict,txt,basis});
  const me='나',you={love:'상대',biz:'파트너',child:'자녀',parent:'부모'}[rel];

  // 1. 일간 관계
  {let r,v,t;
    const g12=grpOf(d1,e2), g21=grpOf(d2,e1);
    if(mod(d1-d2,10)===5){r=1;v='천간합';t=`두 일간 ${ST[d1]}·${ST[d2]}(${STK[d1]}·${STK[d2]})${hasJong(STK[d2])?'이':'가'} 합을 이룹니다. ${rel==='love'?'처음부터 강하게 끌리고 서로를 놓기 어려운 인연입니다.':rel==='biz'?'처음부터 뜻이 잘 맞고 손발이 맞아 의기투합하기 쉽습니다.':'정이 깊고 서로를 끈끈하게 챙기는 관계입니다.'}`}
    else if(STEM_CHUNG(d1,d2)){r=0.15;v='천간충';t=`두 일간이 정면으로 부딪힙니다(${ST[d1]}${ST[d2]}충). 생각과 방식이 정반대라 자극은 크지만 충돌도 잦습니다.`}
    else if(e1===e2){r=0.6;v='비화';t=`같은 ${EL[e1]}(${ELK[e1]}) 일간이라 친구처럼 통하고 이해가 빠릅니다. ${rel==='biz'?'다만 같은 것을 원해 이익을 두고 경쟁하기 쉽습니다.':'다만 둘 다 고집을 세우면 양보가 어렵습니다.'}`}
    else if(mod(e2-e1,5)===1){r=0.8;v='내가 생함';t=`내 ${elJo(e1,'이','가')} ${you}의 ${elJo(e2,'을','를')} 생합니다. 내가 주고 챙기는 쪽이며, ${you}는 내 덕을 봅니다.`}
    else if(mod(e1-e2,5)===1){r=0.8;v='상대가 생함';t=`${you}의 ${elJo(e2,'이','가')} 내 ${elJo(e1,'을','를')} 생합니다. ${you}가 나를 받쳐 주고 챙기는 구조입니다.`}
    else if(mod(e2-e1,5)===2){r=0.4;v='내가 극함';t=`내 ${elJo(e1,'이','가')} ${you}의 ${elJo(e2,'을','를')} 극합니다. 내가 주도하고 ${you}는 맞춰 주는 관계가 되기 쉽습니다.`}
    else {r=0.4;v='상대가 극함';t=`${you}의 ${elJo(e2,'이','가')} 내 ${elJo(e1,'을','를')} 극합니다. ${you}가 주도하고 나는 맞춰 가는 관계가 되기 쉽습니다.`}
    add('ilgan','일간 관계','두 사람의 본성',20,r,v,t,`${ST[d1]}${EL[e1]} ↔ ${ST[d2]}${EL[e2]} · 천간합·상생·상극`);}

  // 2. 일지 관계
  {const b1=R1.pillars.day.b,b2=R2.pillars.day.b,rs=brRel(b1,b2),r=brScore(rs);
    const M={육합:'일지가 육합을 이뤄 함께 생활할 때 편안하고 정이 깊어집니다.',삼합:'일지가 삼합으로 묶여 생활의 방향과 가치관이 잘 맞습니다.',같음:'일지가 같아 생활 습관이 비슷하고 익숙한 편안함이 있습니다.',충:'일지가 충돌해 생활 방식이 크게 다르고, 함께 살면 부딪힘과 변동이 잦습니다.',형:'일지가 형을 이뤄 사소한 일로 다투고 감정이 상하기 쉽습니다.',원진:'일지가 원진이라 이유 없이 미운 감정이 들 때가 있어 서로 말을 아껴야 합니다.',해:'일지가 해를 이뤄 서운함이 쌓이기 쉬우니 그때그때 풀어야 합니다.',파:'일지가 파를 이뤄 함께 세운 계획이 중간에 틀어지기 쉽습니다.'};
    const t=rs.length?rs.map(x=>M[x]).join(' '):'일지끼리 특별한 합충이 없어 생활 면에서 크게 부딪히지 않습니다.';
    add('ilji',rel==='love'?'일지 관계':'생활 기반',rel==='love'?'배우자 자리끼리':'일지끼리',20,r,rs.join('·')||'무난',t,`${BR[b1]} ↔ ${BR[b2]} · 육합·삼합·충·형·원진·해·파`);}

  // 3. 띠
  {const b1=R1.pillars.year.b,b2=R2.pillars.year.b,rs=brRel(b1,b2),r=brScore(rs);
    add('tti','띠 궁합','년지끼리',10,r,rs.join('·')||'무난',`${ANIMAL[b1]}띠와 ${ANIMAL[b2]}띠는 ${rs.includes('삼합')?'삼합으로 잘 어울리는 띠입니다':rs.includes('육합')?'육합으로 잘 어울리는 띠입니다':rs.includes('충')?'서로 충하는 띠라 집안 분위기나 배경이 다를 수 있습니다':rs.includes('원진')?'원진 관계라 사소한 감정 싸움을 조심해야 합니다':'무난한 관계입니다'}. 띠는 집안·배경의 조화를 보는 보조 지표입니다.`,`${BR[b1]} ↔ ${BR[b2]}`);}

  // 4. 용신 보완
  {const y1=A1.Y,y2=A2.Y, a=A2.ep[y1], b=A1.ep[y2];
    const g1=A1.role.indexOf('기신'), g2=A2.role.indexOf('기신');
    let r=Math.min(1,a/0.25)*0.5+Math.min(1,b/0.25)*0.5;
    if(A2.ep[g1]>=0.35) r-=0.12; if(A1.ep[g2]>=0.35) r-=0.12;
    const t=`내 용신 ${elName(y1)}이 ${you}의 사주에 ${pct(a)} 있어 ${a>=0.2?'곁에 있으면 내가 힘을 얻습니다':a>=0.1?'어느 정도 힘이 됩니다':'나를 채워 주는 힘은 약합니다'}. ${you}의 용신 ${elName(y2)}은 내 사주에 ${pct(b)} 있어 ${b>=0.2?`${you}가 내게서 힘을 얻습니다`:b>=0.1?`${you}에게 어느 정도 도움이 됩니다`:`${you}를 채워 주는 힘은 약합니다`}.`
      +(A2.ep[g1]>=0.35?` 다만 ${you}의 사주에 내 기신 ${EL[g1]}이 많아 오래 붙어 있으면 내가 지치기 쉽습니다.`:'')
      +(A1.ep[g2]>=0.35?` 내 사주에는 ${you}의 기신 ${EL[g2]}이 많아 내가 ${you}에게 부담이 될 수 있습니다.`:'');
    add('yong','용신 보완','서로 필요한 기운을 채우나',25,r,a>=0.2&&b>=0.2?'상호 보완':a>=0.2||b>=0.2?'한쪽 보완':'보완 약함',t,`내 용신 ${EL[y1]}·기신 ${EL[g1]} / ${you} 용신 ${EL[y2]}·기신 ${EL[g2]}`);}

  // 5. 오행 보완
  {const m1=[0,1,2,3,4].filter(e=>A1.cnt[e]===0), m2=[0,1,2,3,4].filter(e=>A2.cnt[e]===0);
    const f1=m1.filter(e=>A2.cnt[e]>0), f2=m2.filter(e=>A1.cnt[e]>0);
    const comb=[0,1,2,3,4].map(e=>(A1.ep[e]+A2.ep[e])/2), sd=Math.sqrt(comb.reduce((s,v)=>s+(v-0.2)**2,0)/5);
    const r=(m1.length+m2.length?((f1.length+f2.length)/(m1.length+m2.length))*0.6:0.6)+Math.max(0,0.4-sd*2);
    let t='';
    if(m1.length) t+=`내게 없는 ${m1.map(e=>EL[e]).join('·')} 가운데 ${f1.length?elsJo(f1,'은','는')+' '+you+'가 갖고 있습니다':you+'도 갖고 있지 않습니다'}. `;
    if(m2.length) t+=`${you}에게 없는 ${m2.map(e=>EL[e]).join('·')} 가운데 ${f2.length?elsJo(f2,'은','는')+' 내가 갖고 있습니다':'나도 갖고 있지 않습니다'}. `;
    if(!m1.length&&!m2.length) t+='두 사람 모두 오행이 빠짐없이 있습니다. ';
    t+=`두 사주를 합치면 오행이 ${sd<0.06?'고르게 갖춰집니다':sd<0.1?'대체로 고르게 갖춰집니다':`${EL[comb.indexOf(Math.max(...comb))]} 쪽으로 치우칩니다`}.`;
    add('ohaeng','오행 보완','없는 기운을 채워 주나',10,r,(f1.length+f2.length)?'채워 줌':'보통',t,`합친 오행 ${comb.map((v,e)=>EL[e]+pct(v)).join(' ')}`);}

  // 6. 십성 관계 (관계 유형별)
  {const t12=tenGod(d1,d2), t21=tenGod(d2,d1), g12=Math.floor(TGN.indexOf(t12)/2), g21=Math.floor(TGN.indexOf(t21)/2);
    let r=0.6,t='',v=`${t12} · ${t21}`;
    const m1=R1.o.g==='M', m2=R2.o.g==='M';
    if(rel==='love'){
      const want=x=>x?['정재','편재']:['정관','편관'];
      const s1=want(m1).indexOf(t12), s2=want(m2).indexOf(t21);
      if(m1!==m2){
        r=(s1===0?0.5:s1===1?0.4:0.2)+(s2===0?0.5:s2===1?0.4:0.2);
        t=`내게 ${you}의 일간은 ${t12}, ${you}에게 나는 ${t21}입니다. `;
        t+=s1===0&&s2===0?'남자에게 정재, 여자에게 정관인 전형적인 부부의 짝으로, 서로를 배우자로 자연스럽게 받아들입니다.':
           (s1>=0&&s2>=0)?'서로가 서로의 배우자 별에 해당해 이성으로서의 끌림이 분명합니다.':
           (s1>=0||s2>=0)?`한쪽만 상대를 배우자 별로 느끼는 관계라 ${s1>=0?'내가':you+'가'} 더 적극적인 쪽이 되기 쉽습니다.`:
           '서로가 배우자 별에 해당하지 않아 연인보다 친구·동료 같은 관계로 흐르기 쉽습니다. 다른 항목의 조화가 중요합니다.';
        const sp1=mod(e1+(m1?2:3),5), sp2=mod(e2+(m2?2:3),5);
        if(sp1===e2&&sp2===e1) {r=Math.min(1,r+0.1);t+=' 두 사람의 오행이 정확히 서로의 배우자 오행이라 인연이 깊습니다.'}
      }else{
        r=[0.75,0.7,0.55,0.5,0.75][g12]*0.5+[0.75,0.7,0.55,0.5,0.75][g21]*0.5;
        t=`내게 ${you}는 ${t12}, ${you}에게 나는 ${t21}입니다. ${GRP[g12]}·${GRP[g21]} 관계로 ${g12===0?'친구처럼 대등한':g12===1?'내가 표현하고 아껴 주는':g12===2?'내가 이끌고 챙기는':g12===3?`${you}가 나를 잡아 주는`:`${you}가 나를 돌보는`} 관계입니다.`;
      }
    }else if(rel==='biz'){
      const B={0:[0.35,'이익을 나눠야 하는 경쟁자이기도 합니다. 역할과 지분을 처음부터 문서로 나눠야 합니다'],1:[0.8,'내 계획을 실행하고 밖으로 알려 주는 사람입니다'],2:[0.85,'내게 돈과 성과를 가져다주는 사람입니다'],3:[0.6,'나를 관리하고 통제하는 사람이라 규율은 서지만 답답할 수 있습니다'],4:[0.75,'나를 뒷받침하고 자원을 대 주는 후원자입니다']};
      r=B[g12][0]*0.6+B[g21][0]*0.4;
      const BR2={0:'나는 이익을 함께 나눌 경쟁자이기도 합니다',1:`나는 ${you}의 계획을 실행하고 알리는 사람입니다`,2:`나는 ${you}에게 돈과 성과를 가져다주는 사람입니다`,3:`나는 ${you}를 관리하고 잡아 주는 사람입니다`,4:`나는 ${you}를 뒷받침하는 후원자입니다`};
      t=`내게 ${you}는 ${jo(t12,'이라','라')} ${B[g12][1]}. ${you}에게 나는 ${jo(t21,'이라','라')} ${BR2[g21].replace(/^나는 /,'')}.`;
      if(g12===0&&A1.role[mod(e1+2,5)]!=='용신'&&A1.g[2]>0.15) t+=' 비겁끼리 재물을 두고 다투는 쟁재 구조라 공동 자금 관리에 특히 주의해야 합니다.';
    }else{
      const parent=rel==='child'?[R1,A1,d1,e1,m1]:[R2,A2,d2,e2,m2], kid=rel==='child'?[R2,A2,d2,e2]:[R1,A1,d1,e1];
      const pk=tenGod(parent[2],kid[2]), kp=tenGod(kid[2],parent[2]);
      const pkG=Math.floor(TGN.indexOf(pk)/2), kpG=Math.floor(TGN.indexOf(kp)/2);
      const want=parent[4]?3:1;
      r=(pkG===want?0.55:pkG===4||pkG===0?0.4:0.3)+(kpG===4?0.45:kpG===0?0.35:kpG===1?0.3:0.25);
      t=`부모에게 자녀의 일간은 ${pk}, 자녀에게 부모는 ${kp}입니다. `;
      t+=pkG===want?`${parent[4]?'아버지에게 관성':'어머니에게 식상'}은 자녀의 별이라 부모가 자연스럽게 자식으로 품는 관계입니다. `:`부모에게 자녀가 ${GRP[pkG]}에 해당해 ${pkG===0?'친구 같은 부모 자식':pkG===2?'부모가 이끌고 관리하는':pkG===4?'오히려 자녀가 부모를 챙기는':pkG===3?'자녀가 부모에게 긴장과 책임을 주는':'부모가 아끼며 표현하는'} 관계입니다. `;
      t+=kpG===4?'자녀에게 부모는 인성이라 부모의 보살핌과 가르침이 잘 전달됩니다.':kpG===3?'자녀에게 부모는 관성이라 부모의 말이 규율로 느껴져 엄하게 느끼기 쉽습니다.':kpG===2?'자녀에게 부모는 재성이라 자녀가 부모를 현실적으로 챙기려 합니다.':kpG===1?'자녀에게 부모는 식상이라 자녀가 부모 앞에서 자기 표현을 많이 합니다.':'자녀에게 부모는 비겁이라 친구처럼 지내지만 권위가 서기 어렵습니다.';
      v=`${pk} · ${kp}`;
    }
    add('sipsung',rel==='love'?'배우자 별':rel==='biz'?'역할 관계':'부모·자식 별','십성으로 본 서로의 의미',15,r,v,t,`나→${you} ${t12} / ${you}→나 ${t21}`);}

  const total=items.reduce((s,x)=>s+x.score,0);
  return {items,total,rel,you};
}
const ghGrade=t=>t>=85?['아주 잘 맞음','서로가 서로를 채워 주는 드문 궁합입니다.']:t>=70?['잘 맞음','큰 노력 없이도 편안하게 어울리는 궁합입니다.']:t>=55?['무난함','맞는 부분과 맞춰야 할 부분이 섞여 있습니다. 갈등 포인트만 알고 있으면 충분히 좋습니다.']:t>=40?['노력이 필요함','차이가 큰 만큼 서로의 방식을 이해하려는 노력이 관계를 결정합니다.']:['많이 맞춰야 함','기질이 많이 달라 부딪히기 쉽습니다. 역할과 거리를 분명히 하면 오히려 보완이 될 수 있습니다.'];

/* ---------- 관계별 풀이 ---------- */
function ghReading(G,R1,A1,R2,A2){
  const you=G.you, I=k=>G.items.find(x=>x.key===k);
  const P=[], d1=A1.dm,d2=A2.dm;
  const top=a=>[0,1,2,3,4].sort((x,y)=>a.g[y]-a.g[x])[0];
  const conflict=[];
  if(I('ilji').verdict.match(/충|형|원진|해|파/)) conflict.push(I('ilji').verdict.match(/충|형|원진|해|파/)[0]==='충'?'생활 방식 차이(일지 충)':'감정 다툼(일지 '+I('ilji').verdict+')');
  if(I('ilgan').verdict==='천간충') conflict.push('생각과 방향의 정면충돌(일간 충)');
  if(I('ilgan').verdict.includes('극함')) conflict.push(I('ilgan').verdict==='내가 극함'?'내가 주도권을 쥐려는 성향':`${you}가 주도권을 쥐려는 성향`);
  if(A2.ep[A1.role.indexOf('기신')]>=0.35) conflict.push(`${you}에게 많은 ${EL[A1.role.indexOf('기신')]} 기운이 나를 지치게 함`);
  const scan=(Rx,Ax)=>{const o=[];for(let k=0;k<10;k++){const Y=NOW+k,n=mod(Y-4,60),e=evalLuck(Ax,Rx,n%10,n%12);o.push(e.v)}return o};
  const s1=scan(R1,A1), s2=scan(R2,A2);
  const both=s1.map((v,i)=>v>=0.4&&s2[i]>=0.4?NOW+i:null).filter(Boolean), bad=s1.map((v,i)=>v<=-0.4&&s2[i]<=-0.4?NOW+i:null).filter(Boolean);
  const supp=s1.map((v,i)=>(v>=0.4&&s2[i]<=-0.4)||(v<=-0.4&&s2[i]>=0.4)?NOW+i:null).filter(Boolean);
  const T=['비겁','식상','재성','관성','인성'];
  const STYLE=['자기주장이 강하고 독립적인','표현이 많고 감정이 풍부한','현실적이고 결과를 중시하는','책임감 있고 원칙을 지키는','생각이 깊고 신중한'];

  if(G.rel==='love'){
    P.push(['끌림과 첫인상',`<p>${I('ilgan').txt}</p><p>나는 ${STYLE[top(A1)]} 사람(${T[top(A1)]} 강함)이고, ${you}는 ${STYLE[top(A2)]} 사람(${T[top(A2)]} 강함)입니다. ${top(A1)===top(A2)?'성향이 닮아 금방 가까워지지만 같은 지점에서 부딪히기도 합니다.':'성향이 달라 서로에게 없는 면에 끌립니다.'}</p>`]);
    P.push(['생활과 가정',`<p>${I('ilji').txt}</p><p>${I('sipsung').txt}</p>`]);
    P.push(['서로에게 주는 것',`<p>${I('yong').txt}</p><p>${I('ohaeng').txt}</p>`]);
    P.push(['갈등 포인트',conflict.length?`<ul class="plain">${conflict.map(c=>`<li>${c}</li>`).join('')}</ul><p>이 부분이 드러날 때 감정으로 맞서기보다 규칙을 정해 두면 오래 갑니다.</p>`:'<p>구조적으로 크게 부딪히는 지점이 없습니다. 작은 서운함을 쌓아 두지 않는 것만으로 충분합니다.</p>']);
    const kidP=[R1.pillars.hour,R2.pillars.hour].every(Boolean)?brRel(R1.pillars.hour.b,R2.pillars.hour.b):null;
    P.push(['자녀 인연',`<p>${kidP?`두 사람의 자녀 자리(시지) ${BR[R1.pillars.hour.b]}·${BR[R2.pillars.hour.b]}는 ${kidP.length?kidP.join('·')+' 관계로 '+(brScore(kidP)>=0.6?'자녀 문제에서 뜻이 잘 맞습니다':'자녀 교육·양육 방식에서 의견이 갈리기 쉽습니다'):'특별한 합충이 없어 무난합니다'}. `:'두 사람 중 시간을 모르는 사람이 있어 자녀 자리는 비교하지 않았습니다. '}${R1.o.g==='M'?'남자는 관성, 여자는 식상':'여자는 식상, 남자는 관성'}이 자녀의 별인데, 내 쪽은 ${GRP[R1.o.g==='M'?3:1]} ${pct(A1.g[R1.o.g==='M'?3:1])}, ${you} 쪽은 ${GRP[R2.o.g==='M'?3:1]} ${pct(A2.g[R2.o.g==='M'?3:1])}입니다.</p>`]);
  }else if(G.rel==='biz'){
    const ext=a=>a.g[1]+a.g[2]+(a.ss.some(x=>x.name==='역마'||x.name==='도화')?0.08:0), inn=a=>a.g[3]+a.g[4];
    const out1=ext(A1)-inn(A1), out2=ext(A2)-inn(A2);
    P.push(['역할 분담',`<p>${out1>=out2?`내가 식상·재성이 더 강해 <b>영업·대외·확장</b>을, ${you}가 관성·인성 쪽으로 <b>관리·재무·내부 운영</b>을 맡는 것이 맞습니다.`:`${you}가 식상·재성이 더 강해 <b>영업·대외·확장</b>을, 내가 관성·인성 쪽으로 <b>관리·재무·내부 운영</b>을 맡는 것이 맞습니다.`}</p><p>${I('sipsung').txt}</p>`]);
    P.push(['돈의 흐름',`<p>내게 재성은 ${A1.role[mod(A1.de+2,5)]}, ${you}에게 재성은 ${A2.role[mod(A2.de+2,5)]}입니다. ${['용신','희신'].includes(A1.role[mod(A1.de+2,5)])&&['용신','희신'].includes(A2.role[mod(A2.de+2,5)])?'둘 다 돈을 다루는 일에서 운이 열려 함께 벌기 좋은 조합입니다.':['기신','구신'].includes(A1.role[mod(A1.de+2,5)])&&['기신','구신'].includes(A2.role[mod(A2.de+2,5)])?'둘 다 돈 욕심을 내면 탈이 나는 구조라 보수적인 자금 운용이 필요합니다.':'한쪽은 돈에서 운이 열리고 한쪽은 아니라, 자금 결정은 재성이 좋은 쪽이 주도하는 편이 낫습니다.'}</p><p>${I('yong').txt}</p>`]);
    P.push(['의사결정과 갈등',`<p>${I('ilgan').txt}</p>${conflict.length?`<ul class="plain">${conflict.map(c=>`<li>${c}</li>`).join('')}</ul>`:''}<p>동업이라면 지분, 의사결정권, 이익 배분, 정리 조건을 처음부터 계약서로 남기세요.</p>`]);
  }else{
    const [Rk,Ak]=G.rel==='child'?[R2,A2]:[R1,A1], [Rp,Ap]=G.rel==='child'?[R1,A1]:[R2,A2];
    const kidName=G.rel==='child'?'자녀':'나', parName=G.rel==='child'?'나':'부모';
    const yk=mod(Ak.Y-Ak.de,5);
    const RAISE=['스스로 해 보게 맡기고 친구·운동 같은 또래 활동을 넓혀 주세요','그림, 말하기, 만들기처럼 표현할 기회를 많이 주세요','용돈 관리나 작은 장사처럼 현실 감각을 키우는 경험이 좋습니다','규칙과 역할을 분명히 정해 주고 책임을 맡기면 자랍니다','책과 공부 환경, 믿고 기다려 주는 어른이 가장 큰 힘이 됩니다'];
    P.push([`${kidName}의 기질`,`<p>${SEASONS[seasonIdx(Rk.pillars.month.b)]}의 ${DM_TXT[Ak.dm][0]}(${ST[Ak.dm]}${EL[Ak.de]})입니다. ${DM_SEASON[Ak.dm][seasonIdx(Rk.pillars.month.b)]}</p><p>${STYLE[top(Ak)]} 성향(${T[top(Ak)]} 강함)이고 용신은 ${GRP[yk]}(${EL[Ak.Y]})입니다.</p>`]);
    P.push(['부모와의 관계',`<p>${I('sipsung').txt}</p><p>${I('ilgan').txt}</p>`]);
    P.push([G.rel==='child'?'키우는 방법':'부모님과 지내는 법',`<p>${G.rel==='child'?RAISE[yk]+'.':'부모님에게 필요한 기운이 '+EL[Ap.Y]+'('+GRP[mod(Ap.Y-Ap.de,5)]+')이니, '+['함께하는 시간과 대화','부모님이 즐길 거리','현실적인 도움','부모님의 체면과 역할을 세워 드리는 것','부모님 이야기를 들어 드리는 것'][mod(Ap.Y-Ap.de,5)]+'이 가장 큰 효도가 됩니다.'}</p><p>${I('yong').txt}</p>`]);
    if(conflict.length) P.push(['부딪히기 쉬운 지점',`<ul class="plain">${conflict.map(c=>`<li>${c}</li>`).join('')}</ul>`]);
  }
  P.push(['앞으로 10년 함께 보는 운',`<div class="ghy">${s1.map((v,i)=>{const Y=NOW+i,a=rateOf(v),b=rateOf(s2[i]);const tag=both.includes(Y)?'<span style="color:var(--good);font-weight:700">함께 도약</span>':bad.includes(Y)?'<span style="color:var(--fire);font-weight:700">함께 조심</span>':supp.includes(Y)?'<span style="font-weight:700">서로 받쳐 줄 해</span>':'';return `<div><b>${Y}</b> ${tag}<br>나 <span class="rate ${a[1]}">${a[0]}</span><br>${you} <span class="rate ${b[1]}">${b[0]}</span></div>`}).join('')}</div>
    <p class="how" style="margin-top:8px">${both.length?`두 사람 운이 함께 좋은 해는 ${both.join(', ')}년으로, ${G.rel==='love'?'결혼·이사·큰 결정':G.rel==='biz'?'사업 확장·투자':'함께하는 큰일'}을 잡기 좋습니다. `:''}${bad.length?`${bad.join(', ')}년은 둘 다 운이 약하니 큰 결정을 미루세요. `:''}${supp.length?`${supp.join(', ')}년은 한쪽이 힘들 때 다른 쪽이 받쳐 줄 수 있는 해입니다.`:''}</p>`]);
  return P;
}

function runGh(scroll){
  const o1=ghMe(), o2=readForm('p');
  if(!o1){$('pfErr').hidden=false;$('pfErr').textContent='먼저 내 사주를 입력해 주세요.';return false}
  $('pfErr').hidden=!o2.err; if(o2.err){$('pfErr').textContent=o2.err;return false}
  const rel=$('prel').value;
  const R1=compute(o1),A1=analyze(R1),R2=compute(o2),A2=analyze(R2);
  const G=ghAnalyze(R1,A1,R2,A2,rel), [gr,gt]=ghGrade(G.total);
  const pc=(Rx,o,nm)=>{const P=Rx.pillars;return `<div class="ghp"><b>${nm}</b><span>${o.date.replace(/-/g,'.')} ${o.hasTime?o.time:'시간 모름'} · ${o.g==='M'?'남':'여'} · ${ANIMAL[P.year.b]}띠</span><span>${['year','month','day','hour'].map(k=>P[k]?hz(P[k].s,P[k].b):'<span class="pz muted">??</span>').join(' ')}</span><span class="muted" style="font-size:12.5px">일간 ${ST[P.day.s]}${EL[ST_EL[P.day.s]]} · 용신 ${EL[analyze(Rx).Y]}</span></div>`};
  const relName=REL_OPT.find(x=>x[0]===rel)[1];
  const read=ghReading(G,R1,A1,R2,A2);
  const mg=mbtiGh(o1.mbti,o2.mbti,G.you); if(mg) read.splice(1,0,['성격 궁합 (MBTI)',`<p>${mg}</p>`]);
  $('viewGh').innerHTML=`
    <section class="panel">
      <div class="sec-h"><h2>${relName} 궁합</h2><span class="muted">四柱 八字</span></div>
      <div class="ghpair">${pc(R1,o1,o1.name||'나')}${pc(R2,o2,G.you)}</div>
      <div class="ghscore"><div class="ghnum">${G.total}<small> / 100</small></div><div><div class="ghgrade">${gr}</div><p>${gt}</p></div></div>
    </section>
    <section class="panel">
      <div class="sec-h"><h2>항목별 궁합</h2></div>
      <div>${G.items.map(x=>`<div class="ghi"><h4>${x.name}<small>${x.sub}</small></h4><div><p><b>${x.verdict}</b> · ${x.txt}</p></div><div class="sc">${x.score}/${x.max}<div class="sb"><i style="width:${x.score/x.max*100}%"></i></div></div></div>`).join('')}</div>
    </section>
    <section class="sec">
      <div class="sec-h"><h2>관계 풀이</h2></div>
      <div class="ov">${read.map(([t,b])=>`<div class="ov-row"><h3>${t}</h3><div>${b}</div></div>`).join('')}</div>
    </section>
`;
  return true;
}

/* ================= AI 사주 상담 ================= */
function sajuBrief(){
  const P=R.pillars, o=R.o, dm=A.dm, de=A.de, age=NOW-R.y;
  const [y,m,d]=o.date.split('-').map(Number), lu=solarToLunar(y,m,d);
  const pil=k=>P[k]?`${ST[P[k].s]}${BR[P[k].b]}(천간 ${k==='day'?'일간':tenGod(dm,P[k].s)}, 지지 ${tenGod(dm,MAIN(P[k].b))})`:'모름';
  const L=[];
  L.push(`기본: 양력 ${o.date}${o.hasTime?' '+o.time:' (시간 모름)'} / 음력 ${lu?`${lu.y}.${lu.leap?'윤':''}${lu.m}.${lu.d}`:'-'} / ${o.g==='M'?'남':'여'} / 올해(${NOW}) 만 ${age}세 / ${ANIMAL[P.year.b]}띠`);
  L.push(`사주: 년주 ${pil('year')}, 월주 ${pil('month')}, 일주 ${pil('day')}, 시주 ${pil('hour')}`);
  L.push(`일간: ${ST[dm]}${EL[de]} (${DM_TXT[dm][0]}), ${SEASONS[seasonIdx(P.month.b)]} 출생, 일주 ${ST[dm]}${BR[P.day.b]}`);
  L.push(`오행 세력: ${A.ep.map((v,e)=>`${EL[e]} ${Math.round(v*100)}%`).join(', ')} / 없는 오행: ${A.cnt.map((v,e)=>v===0?EL[e]:null).filter(Boolean).join('·')||'없음'}`);
  L.push(`십성군: ${GRP.map((n,i)=>`${n} ${Math.round(A.g[i]*100)}%`).join(', ')}`);
  L.push(`강약: ${A.level}(${Math.round(A.score)}점), 득령 ${A.deukryung?'O':'X'} 득지 ${A.deukji?'O':'X'} 득세 ${A.deukse?'O':'X'}`);
  L.push(`격국: ${A.jong?A.jong.type:A.gName} (${A.gStatus})${A.ok.length?' / 돕는 요소: '+A.ok.join(', '):''}${A.bad.length?' / 깨는 요소: '+A.bad.join(', '):''}`);
  L.push(`용신 ${EL[A.Y]}(${GRP[mod(A.Y-de,5)]}) · 희신 ${EL[A.role.indexOf('희신')]} · 기신 ${EL[A.role.indexOf('기신')]} · 구신 ${EL[A.role.indexOf('구신')]} · 한신 ${EL[A.role.indexOf('한신')]} (${A.method})`);
  if(A.rel.length) L.push(`원국 합충: ${[...new Set(A.rel.map(r=>`${r.txt}${r.a?`(${POSK[r.a]}-${POSK[r.b]})`:''}`))].join(', ')}`);
  if(A.ss.length) L.push(`신살: ${[...new Set(A.ss.map(s=>`${s.name}(${POSK[s.k]}주)`))].join(', ')} / 공망 ${A.gong.map(b=>BR[b]).join('')}`);
  const curI=R.dw.findIndex((x,i)=>age>=x.age&&(!R.dw[i+1]||age<R.dw[i+1].age));
  L.push(`대운(${R.fwd?'순행':'역행'}, 대운수 ${R.dsu}): `+R.dw.map((x,i)=>{const e=evalLuck(A,R,x.s,x.b);return `${x.age}~${x.age+9}세(${x.year}~) ${ST[x.s]}${BR[x.b]} ${tenGod(dm,x.s)}/${tenGod(dm,MAIN(x.b))} ${rateOf(e.v)[0]}${i===curI?' ←현재':''}`}).join('; '));
  L.push('향후 10년 세운: '+yearScan().map(x=>`${x.Y}(${x.Y-R.y}세) ${ST[x.s]}${BR[x.b]} ${x.ts}/${x.tb} ${x.rate[0]}`+[x.money,x.work,x.love,x.move,x.hl].filter(z=>z.m).map(z=>' · '+z.t).join('')).join('; '));
  const mb=mbtiFromSaju(A).map(x=>x.letter).join('');
  L.push(`MBTI: 사주로 본 성향 ${mb}${o.mbti?`, 실제 MBTI ${o.mbti}`:''}`);
  return L.join('\n');
}
var askHist=[], askBusy=false;
function askChips(){
  const age=NOW-R.y, b=band(age);
  const C=b==='kid'?['우리 아이는 어떤 공부가 잘 맞나요?','아이 성격의 장점과 단점은?','어떻게 키우면 좋을까요?','올해 아이의 운은 어떤가요?']
    :b==='teen'?['어떤 진로가 맞을까요?','올해 시험운은 어떤가요?','친구 관계는 어떤가요?','공부 방법은 어떻게 할까요?']
    :b==='senior'?['올해 건강은 무엇을 조심할까요?','자녀와의 관계는 어떤가요?','남은 재물운은 어떤가요?','노후를 어떻게 보내면 좋을까요?']
    :['올해 재물운은 어떤가요?','이직하거나 사업을 해도 될까요?',age<45?'결혼운은 언제 들어오나요?':'부부 관계는 어떤가요?','나에게 맞는 사업 분야는?','앞으로 10년 중 가장 좋은 해는?','건강은 무엇을 조심해야 하나요?'];
  $('askChips').innerHTML=C.map(q=>`<button type="button" class="achip">${q}</button>`).join('');
  $('askChips').querySelectorAll('.achip').forEach(bn=>bn.addEventListener('click',()=>{$('askIn').value=bn.textContent;sendAsk()}));
}
function askReset(){askHist=[];$('askLog').innerHTML='';askChips()}
const mdLite=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/^#{1,4}\s*(.+)$/gm,'<b>$1</b>').replace(/^[-•]\s+(.+)$/gm,'· $1').replace(/\n/g,'<br>');
function askAdd(role,html){const d=document.createElement('div');d.className='amsg '+role;d.innerHTML=html;$('askLog').appendChild(d);d.scrollIntoView({block:'nearest'});return d}
async function sendAsk(){
  if(askBusy) return;
  const q=$('askIn').value.trim(); if(!q) return;
  if(!R){askAdd('bot','먼저 사주를 입력해 주세요.');return}
  askBusy=true;$('askGo').disabled=true;$('askIn').value='';
  askAdd('me',mdLite(q));const w=askAdd('bot','<span class="adot">사주를 살펴보는 중…</span>');
  let code='';try{code=localStorage.getItem('saju-ask-code')||''}catch(e){}
  try{
    const r=await fetch(API_BASE+'/api/ask',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:q,brief:sajuBrief(),history:askHist,code})});
    const j=await r.json().catch(()=>({error:'응답을 읽지 못했습니다.'}));
    if(j.needCode){w.innerHTML='입장 코드가 필요합니다. 아래 칸에 코드를 넣고 다시 질문해 주세요.';$('askCodeWrap').hidden=false}
    else if(!r.ok||j.error){w.textContent=j.error||'잠시 후 다시 시도해 주세요.'}
    else{w.innerHTML=mdLite(j.answer);askHist.push({role:'user',content:q},{role:'assistant',content:j.answer});askHist=askHist.slice(-6);
      if(typeof j.left==='number') $('askLeft').textContent=`오늘 남은 질문 ${j.left}회`}
  }catch(e){w.textContent='연결에 실패했습니다. 인터넷 연결을 확인해 주세요.'}
  askBusy=false;$('askGo').disabled=false;$('askIn').focus();
}
$('askForm').addEventListener('submit',e=>{e.preventDefault();sendAsk()});
$('askCode').addEventListener('change',()=>{try{localStorage.setItem('saju-ask-code',$('askCode').value.trim())}catch(e){}});
if(typeof R!=='undefined'&&R) askReset();
