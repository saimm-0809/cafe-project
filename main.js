import {ic} from './sprites.js';
import {CONFIG as C} from './config.js';
import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
const sb=createClient(C.SUPABASE_URL,C.SUPABASE_KEY);
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const R={coffee:{n:'Coffee',i:'coffee',g:{beans:1},p:8},iced:{n:'Iced coffee',i:'iced',g:{beans:1,milk:1},p:12},smilk:{n:'Strawberry milk',i:'smilk',g:{berry:1,milk:1},p:12},choc:{n:'Hot chocolate',i:'choc',g:{cocoa:1,milk:1},p:11},cup:{n:'Cupcake',i:'cup',g:{flour:1,berry:1},p:14},cook:{n:'Cookie',i:'cook',g:{flour:1,cocoa:1},p:10},cake:{n:'Strawberry cake',i:'cake',g:{flour:2,berry:2},p:34,lv:2,cost:120},heart:{n:'Heart cookie',i:'hrt',g:{flour:1,berry:1,cocoa:1},p:26,lv:3,cost:150},waffle:{n:'Waffle',i:'waffle',g:{flour:2,berry:1},p:28,lv:3,cost:130},latte:{n:'Matcha latte',i:'latte',g:{matcha:1,milk:1},p:32,lv:4,cost:200}};
const G={beans:['beans',2],milk:['milk',2],berry:['berry',3],cocoa:['cocoa',3],flour:['flour',2],matcha:['matcha',5]};
const D={table:['table','Table & chair',40],plant:['plant','Plant',30],lamp:['lamp','Lamp',45],fairy:['fairy','Fairy lights',60],window:['window','Window',70],paint:['paint','Painting',80],plush:['plush','Plushie',55],disp:['disp','Dessert display',90],sakura:['sakura','Sakura tree',110],pumpkin:['pumpkin','Pumpkin',50],xtree:['xtree','Holiday tree',120],bunting:['bunting','Bunting',65]};
const PPL=[{n:'Mina (student)',e:'p1',f:'iced',s:'Exam week... coffee please!'},{n:'Mr. Oak',e:'p2',f:'cup',s:'Your cupcakes are my weakness.'},{n:'Shy Pip',e:'p3',f:'smilk',s:'um... strawberry milk, please?'},{n:'Cat Lady',e:'p4',f:'cook',s:'Is the cat in today? Cookie, please!'}];
const THEMES=[['Strawberry','','#f9c9d4','#f4b6c2',0],['Mint','','#d5ecd9','#bfe0c6',60],['Lavender','','#e4dcf5','#d3c7ee',60],['Sunset','','#ffd9b0','#ffc28a',90]].map(x=>[x[0],0,x[2],x[3],x[4]]);
let paused=false,dayServed=0,dayEarn=0,rush=0,XY=[200,200],star=0,starX=50,mute=localStorage.getItem('hlc_mute')==='1',ac;
function sfx(k){if(mute)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const q={coin:[[880,.07],[1320,.1]],ok:[[660,.08]],bad:[[160,.15]],up:[[523,.1],[659,.1],[784,.1],[1047,.2]],star:[[1047,.06],[1319,.06],[1568,.12]]}[k]||[];let at=ac.currentTime;q.forEach(([f,d])=>{const o=ac.createOscillator(),g=ac.createGain();o.type='square';o.frequency.value=f;g.gain.value=.04;o.connect(g);g.connect(ac.destination);o.start(at);o.stop(at+d);at+=d})}catch(e){}}
function pop(s){try{const d=document.createElement('div');d.className='pop';d.textContent=s;d.style.left=XY[0]+'px';d.style.top=XY[1]+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),900)}catch(e){}}
const THX={p1:['Thanks! Perfect for studying.','You are a lifesaver!'],p2:['Delicious, as always.','Back in my day we had no treats like this.'],p3:['...thank you. It is really good.','You remembered my order!'],p4:['Say hi to the cat for me!','Purrfect service!'],p5:['Worth the trip.','A fine treat indeed.']};
const CATS=[['Orange tabby','Cozy and calm',0,1],['Pearl','Fluffy and proud',80,1],['Shadow','Sneaky night cat',120,2],['Berry','Loves strawberries',160,3],['Luna','Dreamy star cat',220,4]];
const ACH=[['Serve 10 customers',s=>s.served>=10,20],['Serve 50 customers',s=>s.served>=50,50],['Serve 100 customers',s=>s.served>=100,100],['Earn 500 coins',s=>s.earn>=500,50],['Cat family (3 cats)',s=>s.cats.length>=3,40],['Decorator (5 items)',s=>s.decor.length>=5,40],['Reach level 5',s=>1+Math.floor(s.xp/60)>=5,60],['Combo of 5',s=>s.best>=5,40],['Find the hidden heart',s=>s.flags.heart,25],['Collector (all 5 cats)',s=>s.cats.length>=5,80],['Best friend (max hearts)',s=>Object.values(s.fr).some(n=>n>=25),60]];
const spec=()=>S.rec[S.day%S.rec.length];let combo=0;
function achs(){ACH.forEach((a,i)=>{if(!S.ach.includes(i)&&a[1](S)){S.ach.push(i);S.coins+=a[2];toast('Achievement: '+a[0]+' +'+a[2]+' coins')}})}
function login(){const d=new Date(),f=x=>x.toISOString().slice(0,10),today=f(d),y=f(new Date(d-864e5));
 if(S.last===today)return;S.streak=S.last===y?S.streak+1:1;S.last=today;const b=10+5*Math.min(S.streak,7);S.coins+=b;
 setTimeout(()=>modal('Daily visit bonus!\nDay streak: '+S.streak+'\n+'+b+' coins'),400)}
const POS={table:12,plant:3,lamp:26,fairy:40,window:55,paint:68,plush:78,disp:88,sakura:92,pumpkin:20,xtree:46,bunting:30};
const MIS=[['Serve 5 customers','served',5],['Earn 50 coins','earned',50],['Pet the cat','petted',1],['Serve a VIP customer','vip',1],['Buy 3 ingredients','bought',3]];
const fresh=()=>({v:1,coins:100,xp:0,day:1,served:0,earn:0,tips:0,rec:['coffee','iced','smilk','choc','cup','cook'],inv:{beans:3,milk:3,berry:3,cocoa:3,flour:3,matcha:0},decor:[],placed:[],cat:{name:'Mochi',fed:0,pets:0,cur:0},mis:{day:1,served:0,earned:0,petted:0,vip:0,bought:0,done:[]},flags:{},cats:[0],fav:{},spin:'',fr:{p1:0,p2:0,p3:0,p4:0,p5:0},th:[0],thc:0,ach:[],up:{fast:0,jar:0,tray:0},streak:0,last:'',best:0,t:0});
const num=(x,d=0)=>Number.isFinite(+x)?Math.max(0,Math.floor(+x)):d;
function clean(raw){const f=fresh();if(!raw||typeof raw!=='object')return f;
 for(const k of ['coins','xp','served','earn','tips'])f[k]=num(raw[k],f[k]);f.day=Math.max(1,num(raw.day,1));f.t=num(raw.t);
 if(Array.isArray(raw.rec))f.rec=[...new Set([...f.rec,...raw.rec.filter(r=>R[r])])];
 if(Array.isArray(raw.decor))f.decor=raw.decor.filter(d=>D[d]);
 if(Array.isArray(raw.placed))f.placed=raw.placed.filter(d=>D[d]&&f.decor.includes(d));
 if(raw.inv&&typeof raw.inv==='object')for(const k in G)f.inv[k]=num(raw.inv[k],f.inv[k]);
 if(raw.cat&&typeof raw.cat==='object'){f.cat.name=String(raw.cat.name||'Mochi').slice(0,20);f.cat.fed=num(raw.cat.fed);f.cat.pets=num(raw.cat.pets)}
 if(raw.mis&&typeof raw.mis==='object'){f.mis.day=num(raw.mis.day,1);for(const m of MIS)f.mis[m[1]]=num(raw.mis[m[1]]);f.mis.done=Array.isArray(raw.mis.done)?raw.mis.done.filter(i=>i>=0&&i<MIS.length):[]}
 if(raw.flags&&typeof raw.flags==='object')f.flags={heart:!!raw.flags.heart,note:!!raw.flags.note};
 if(Array.isArray(raw.cats))f.cats=[...new Set([0,...raw.cats.filter(i=>Number.isInteger(i)&&i>=0&&i<CATS.length)])];
 if(Array.isArray(raw.ach))f.ach=[...new Set(raw.ach.filter(i=>Number.isInteger(i)&&i>=0&&i<ACH.length))];
 if(raw.up&&typeof raw.up==='object'){f.up.fast=Math.min(2,num(raw.up.fast));f.up.jar=Math.min(3,num(raw.up.jar));f.up.tray=Math.min(2,num(raw.up.tray))}
 f.th=Array.isArray(raw.th)?[...new Set([0,...raw.th.filter(i=>Number.isInteger(i)&&i>=0&&i<THEMES.length)])]:[0];f.thc=f.th.includes(num(raw.thc))?num(raw.thc):0;f.spin=typeof raw.spin==='string'?raw.spin.slice(0,10):'';if(raw.fr&&typeof raw.fr==='object')for(const k in f.fr)f.fr[k]=Math.min(25,num(raw.fr[k]));if(raw.fav&&typeof raw.fav==='object')for(const k in R)if(raw.fav[k])f.fav[k]=num(raw.fav[k]);f.streak=num(raw.streak);f.best=num(raw.best);f.last=typeof raw.last==='string'?raw.last.slice(0,10):'';
 const cu=raw.cat&&num(raw.cat.cur);f.cat.cur=f.cats.includes(cu)?cu:0;
 return f}
let S=fresh(),user=null,tab='cafe',cust=[],tray=[],busy=false,clock=0,uid=0,tm=null,status='',msg='';
const lvl=()=>1+Math.floor(S.xp/60),cap=()=>2+lvl();
const toast=t=>{const e=$('#toast');e.textContent=t;e.style.opacity=1;setTimeout(()=>e.style.opacity=0,2200)};
const modal=t=>{const m=$('#modal');m.innerHTML=`<div>${esc(t)}<br><br><button data-a="close">Close ♡</button></div>`;m.hidden=false};
const stat=t=>{status=t;const e=$('#st');if(e)e.textContent=t};
// ---------- save manager ----------
const key=()=>'hlc_'+(user?user.id:'guest');
const rd=k=>{try{const j=localStorage.getItem(k);return j?clean(JSON.parse(j)):null}catch{return null}};
function queue(){achs();S.t=Date.now();localStorage.setItem(key(),JSON.stringify(S));
 if(!user)return stat('💾 Saved on this device (guest)');
 stat('Saving…');clearTimeout(tm);tm=setTimeout(()=>push(0),1500)}
async function push(n){try{
 const {error}=await sb.from('game_saves').upsert({user_id:user.id,schema_version:1,coins:S.coins,cafe_level:lvl(),save_data:S,updated_at:new Date().toISOString()});
 if(error)throw error;stat('☁️ Saved to cloud')}
 catch(e){if(n<3){stat('Retrying…');setTimeout(()=>push(n+1),2000*(n+1))}else stat('⚠️ Cloud save failed: '+(e.message||'network')+' (kept on device)')}}
const when=s=>s.t?new Date(s.t).toLocaleString():'unknown time';
async function load(){const local=rd(key()),guest=rd('hlc_guest');
 const {data,error}=await sb.from('game_saves').select('save_data').eq('user_id',user.id).maybeSingle();
 if(error){S=local||fresh();stat('⚠️ Cloud unreachable, using device copy');return}
 const cloud=data?clean(data.save_data):null;
 if(cloud&&local&&cloud.t!==local.t)S=confirm(`Two saves found.\nCloud: ${when(cloud)} (level ${1+Math.floor(cloud.xp/60)}, ${cloud.coins} coins)\nThis device: ${when(local)} (level ${1+Math.floor(local.xp/60)}, ${local.coins} coins)\n\nOK = use THIS DEVICE, Cancel = use CLOUD`)?local:cloud;
 else if(cloud)S=cloud;
 else if(guest&&confirm('Move your guest progress into this account?\nOK = yes, Cancel = start fresh'))S=guest;
 else S=local||fresh();
 push(0)}
function dayReset(){if(S.mis.day!==S.day)S.mis={day:S.day,served:0,earned:0,petted:0,vip:0,bought:0,done:[]}}
// ---------- game logic ----------
const pay=c=>{if(!Number.isInteger(c)||c<0||S.coins<c)return false;S.coins-=c;return true};
function missions(){MIS.forEach((m,i)=>{if(S.mis[m[1]]>=m[2]&&!S.mis.done.includes(i)){S.mis.done.push(i);S.coins+=20;toast('Mission done: '+m[0]+' +20 🪙')}})}
function gain(c){S.coins+=c;S.earn+=c;S.mis.earned+=c;dayEarn+=c}
function spawn(){const sp=lvl()>=3&&!S.flags.note&&!cust.some(c=>c.sp)&&Math.random()<.3;
 const p=sp?{n:'Mystery Guest',e:'p5',f:'heart',s:'I came a long way for a certain cookie...'}:PPL[Math.floor(Math.random()*PPL.length)];
 let o=S.rec.includes(p.f)&&Math.random()<.6?p.f:S.rec[Math.floor(Math.random()*S.rec.length)];if(sp&&S.rec.includes('heart'))o='heart';
 const mx=45+3*S.cat.cur;cust.push({id:++uid,p,o,pat:mx,max:mx,sp,vip:!sp&&Math.random()<.1,done:false})}
function tick(){if(paused)return;clock++;if(rush>0)rush--;else if(clock===25&&Math.random()<.6){rush=15;toast('RUSH HOUR! More customers, +50% pay');if(tab==='cafe')render()}const ps=star;if(star>0)star--;else if(Math.random()<.025){star=7;starX=10+Math.random()*75}if((ps>0)!==(star>0)&&tab==='cafe')render();
 if(clock<60&&cust.length<cap()+(rush>0?2:0)&&Math.random()<(rush>0?.9:.4))spawn();
 cust.forEach(c=>c.pat--);if(cust.some(c=>c.pat<=0))combo=0;cust=cust.filter(c=>c.pat>0&&!c.done);
 if(clock>=90&&!cust.length){modal('Day '+S.day+' complete!\n\nCustomers served: '+dayServed+'\nCoins earned: '+dayEarn);dayServed=0;dayEarn=0;S.day++;clock=0;dayReset();queue();toast('☀️ Day '+S.day+' begins')}
 cust.forEach(c=>{const b=$('#b'+c.id);if(b){b.style.width=100*c.pat/c.max+'%';if(b.parentElement)b.parentElement.classList.toggle('hurry',c.pat<10)}});
 const d=$('#clk');if(d)d.textContent=clock<60?'Open 🟢':'Closing 🔴'}
function serve(id){const c=cust.find(x=>x.id==id);if(!c||c.done)return;
 const i=tray.indexOf(c.o);if(i<0){sfx('bad');msg=`${c.p.n} wants ${R[c.o].n}. Make it first!`;return render()}
 c.done=true;tray.splice(i,1);
 combo++;S.best=Math.max(S.best,combo);const base=Math.round(R[c.o].p*(c.o===spec()?1.5:1)*(1+.1*S.up.jar)*(c.vip?2:1)*(rush>0?1.5:1));const tip=(c.pat>c.max/2?Math.ceil(R[c.o].p*.25)+(S.cat.fed+S.cat.pets>=3?1:0):0)+Math.min(combo-1,5)+(S.fr[c.p.e]>=15?1:0);
 gain(base+tip);S.tips+=tip;S.fav[c.o]=(S.fav[c.o]||0)+1;S.served++;S.mis.served++;if(c.vip)S.mis.vip++;dayServed++;{const fk=c.p.e,o0=S.fr[fk];if(o0<25){S.fr[fk]=o0+1;if((o0+1)%5===0){S.coins+=20;toast(c.p.n+' likes you more! +20 coins')}}}
 const l0=lvl();S.xp+=10;if(lvl()>l0){S.coins+=25;sfx('up');toast('Level '+lvl()+'! +25 coin bonus')}
 pop('+'+(base+tip));sfx('coin');if(window.navigator&&window.navigator.vibrate)window.navigator.vibrate(30);cust=cust.filter(x=>x.id!=id);msg=`${c.p.n} says "${THX[c.p.e][Math.floor(Math.random()*2)]}" +${base}${tip?' +'+tip+' tip':''} 🪙`;
 if(c.sp){S.flags.note=true;modal(`A folded note is left on the table:\n\n"${C.MY_NAME} thinks you are the best part of every day ♡"`)}
 missions();queue();render()}
function make(id){const r=R[id];if(busy||!S.rec.includes(id))return;if(tray.length>=3+2*S.up.tray){msg='Tray is full! Serve a customer first.';sfx('bad');return render()}
 for(const k in r.g)if(S.inv[k]<r.g[k]){msg='Not enough ingredients! Visit the shop.';return render()}
 for(const k in r.g)S.inv[k]-=r.g[k];busy=true;msg='Preparing '+r.n+'…';queue();render();
 setTimeout(()=>{busy=false;tray.push(id);sfx('ok');msg=r.n+' is ready!';render()},1200-400*S.up.fast)}
function act(a,v){
 if(a==='close')$('#modal').hidden=true;
 else if(a==='tab'){tab=v;msg=''}
 else if(a==='serve')return serve(v);
 else if(a==='make')return make(v);
 else if(a==='ing'){if(!G[v])return;if(pay(G[v][1])){S.inv[v]++;S.mis.bought++;missions();queue()}else msg='Not enough coins!'}
 else if(a==='unlock'){const r=R[v];if(!r||!r.lv||S.rec.includes(v))return;if(lvl()<r.lv)msg='Reach café level '+r.lv;else if(pay(r.cost)){S.rec.push(v);toast('Recipe unlocked: '+r.n);queue()}else msg='Not enough coins!'}
 else if(a==='buy'){if(!D[v]||S.decor.includes(v))return;if(pay(D[v][2])){S.decor.push(v);S.placed.push(v);queue()}else msg='Not enough coins!'}
 else if(a==='pause'){paused=!paused;msg=paused?'Game paused.':''}
 else if(a==='notes'){const n=C.LOVE_NOTES||[],k=Math.min(n.length,Math.floor(lvl()/2));const m=k?n.slice(0,k).map((x,i)=>'#'+(i+1)+'  '+x).join('\n\n'):'Reach cafe level 2 to unlock the first love note.';modal(m+(k&&k<n.length?'\n\n(Next note at level '+2*(k+1)+')':''))}
 else if(a==='spin'){const d=new Date().toISOString().slice(0,10);if(S.spin===d)msg='Already spun today. Come back tomorrow!';else{S.spin=d;const r=Math.random();let m;if(r<.4){S.coins+=15;m='15 coins'}else if(r<.7){S.coins+=30;m='30 coins'}else if(r<.85){const k=Object.keys(G)[Math.floor(Math.random()*Object.keys(G).length)];S.inv[k]+=4;m='4x '+k}else if(r<.95){S.coins+=75;m='75 coins'}else{S.coins+=200;m='JACKPOT! 200 coins'}sfx('star');modal('Daily spin!\n\nYou won: '+m);queue()}}
 else if(a==='star'){if(star>0){star=0;const b=10+Math.floor(Math.random()*21);S.coins+=b;S.earn+=b;sfx('star');pop('+'+b+' lucky!');queue()}}
 else if(a==='mute'){mute=!mute;localStorage.setItem('hlc_mute',mute?'1':'0')}
 else if(a==='upg'){const u={fast:[100,250],jar:[150,300,500],tray:[120,300]}[v],c=u&&u[S.up[v]];if(!c)return;if(pay(c)){S.up[v]++;queue()}else msg='Not enough coins!'}
 else if(a==='pick'){const i=+v;if(S.cats.includes(i)){S.cat.cur=i;queue()}}
 else if(a==='adopt'){const i=+v,c=CATS[i];if(!c||S.cats.includes(i))return;if(lvl()<c[3])msg='Reach café level '+c[3];else if(pay(c[2])){S.cats.push(i);S.cat.cur=i;toast(c[0]+' joined your café!');queue()}else msg='Not enough coins!'}
 else if(a==='theme'){const i=+v,h=THEMES[i];if(!h)return;if(S.th.includes(i))S.thc=i;else if(pay(h[4])){S.th.push(i);S.thc=i}else msg='Not enough coins!';queue()}
 else if(a==='place'){S.placed=S.placed.includes(v)?S.placed.filter(x=>x!==v):[...S.placed,v];queue()}
 else if(a==='pet'){S.cat.pets++;S.mis.petted++;toast(S.cat.name+' purrs 💕');missions();queue()}
 else if(a==='feed'){if(pay(2)){S.cat.fed++;toast(S.cat.name+' enjoyed the snack 🐟');queue()}else msg='Not enough coins!'}
 else if(a==='name'){const n=prompt('Name your cat:',S.cat.name);if(n&&n.trim()){S.cat.name=n.trim().slice(0,20);queue()}}
 else if(a==='heart'){modal(C.SECRET_LETTER)}
 else if(a==='hidden'){if(!S.flags.heart){S.flags.heart=true;S.coins+=10;queue();modal('You found a hidden heart! 💝 +10 🪙')}}
 else if(a==='final'){modal(C.FINAL_MESSAGE)}
 else if(a==='save'){clearTimeout(tm);user?push(0):queue()}
 else if(a==='logout'){(async()=>{await sb.auth.signOut();user=null;S=fresh();clearInterval(window._t);window._t=null;render()})();return}
 else if(a==='reset'){if(confirm('Erase ALL progress on this device'+(user?' and in the cloud':'')+'?')){S=fresh();cust=[];tray=[];queue()}}
 render()}
// ---------- auth ----------
async function authDo(kind){const email=$('#em').value.trim(),pw=$('#pw').value;const e=$('#ae');e.textContent='Working…';
 try{let r;
  if(kind==='guest'){user=null;S=rd('hlc_guest')||fresh();return enter()}
  if(kind==='reset'){r=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});if(r.error)throw r.error;e.textContent='Reset email sent (check spam).';return}
  if(kind==='up'){r=await sb.auth.signUp({email,password:pw,options:{emailRedirectTo:location.origin+location.pathname}});if(r.error)throw r.error;if(!r.data.session){e.textContent='Check your email to confirm, then log in.';return}}
  else{r=await sb.auth.signInWithPassword({email,password:pw});if(r.error)throw r.error}
  user=r.data.user;await load();enter()}
 catch(x){e.textContent='⚠️ '+(x.message||'Network error')}}
function enter(){dayReset();login();tab='cafe';msg=`${new Date().getHours()<12?'Good morning':new Date().getHours()<18?'Good afternoon':'Good evening'}! Welcome to your little café, ${C.HER_NAME} ♡ ${C.WELCOME_MESSAGE}`;queue();render();clearInterval(window._t);window._t=setInterval(tick,1000)}
// ---------- views ----------
function auth(){$('#app').innerHTML=`<div class="card"><h1>Her Little Café</h1><div>${ic('coffee',48)}${ic('cup',48)}${ic('cat',48)}${ic('hrt',48)}</div><p>Log in to save across devices, or play as a guest.</p>
<input id="em" type="email" placeholder="Email" autocomplete="email"><input id="pw" type="password" placeholder="Password (6+ chars)" autocomplete="current-password">
<button data-a="in">Log in</button><button class="alt" data-a="up">Register</button><button class="sage" data-a="guest">Play as guest</button><button class="alt" data-a="rst">Forgot password</button><p id="ae"></p></div>`}
function view(){const L=lvl();
 if(tab==='cafe')return `<div class="scene" style="--w1:${THEMES[S.thc][2]};--w2:${THEMES[S.thc][3]};filter:${(h=>h>=19||h<6)(new Date().getHours())?'brightness(.8) sepia(.25)':'none'}"><button class="tiny" data-a="hidden">♡</button>${S.placed.map(d=>`<span class="dc" style="left:${POS[d]}%">${ic(d,44)}</span>`).join('')}${star>0?`<span class="star" data-a="star" style="left:${starX}%">${ic('star',36)}</span>`:''}<span class="hr h1">${ic('hrt',16)}</span><span class="hr h2">${ic('hrt',12)}</span><span class="cat" data-a="pet">${ic('cat'+S.cat.cur,52)}</span></div>
 ${S.served<2?'<div class="card hint"><b>How to play:</b> 1) Tap a recipe to make it. 2) Tap the customer who ordered it. A green outline means it is ready to serve!</div>':''}<div class="card">Day ${S.day} · <span id="clk">${clock<60?'Open 🟢':'Closing 🔴'}</span> · Capacity ${cap()}${rush>0?' · RUSH HOUR!':''}<br>Special today: ${ic(R[spec()].i,16)} ${R[spec()].n} (+50%)${combo>1?` · Combo x${combo}!`:''}<div class="row">${cust.map(c=>`<div class="cust${tray.includes(c.o)?' ready':''}${c.vip?' vip':''}" data-a="serve" data-v="${c.id}">${ic(c.p.e,48)}<br><b>${c.vip?'★VIP ':''}${esc(c.p.n)}</b><br><small>${esc(c.p.s)}</small><br>${ic(R[c.o].i,20)} ${R[c.o].n}<div class="bar" id="b${c.id}" style="width:${100*c.pat/c.max}%"></div></div>`).join('')||'<i>Waiting for customers…</i>'}</div></div>
 <div class="card"><button class="alt" data-a="spin">Daily spin</button> <b>Make:</b><div class="row">${S.rec.map(r=>`<button data-a="make" data-v="${r}" ${busy?'disabled':''}>${ic(R[r].i,20)} ${R[r].n}</button>`).join('')}</div><b>Tray ${tray.length}/${3+2*S.up.tray} (tap a customer to serve):</b> ${tray.map(t=>ic(R[t].i,24)).join('')||'empty'}</div>`;
 if(tab==='book')return `<div class="card"><h3>Recipe book</h3>${Object.entries(R).map(([k,r])=>{const has=S.rec.includes(k);return `<p>${ic(r.i,24)} <b>${r.n}</b> · sells ${r.p}🪙 · needs ${Object.entries(r.g).map(([a,n])=>ic(G[a][0],16)+'×'+n).join(' ')} ${has?'✅':`<button data-a="unlock" data-v="${k}">Unlock ${r.cost}🪙 (lvl ${r.lv})</button>`}</p>`}).join('')}</div>`;
 if(tab==='shop')return `<div class="card"><h3>Upgrades</h3>${[['fast','Fast hands','faster cooking',[100,250]],['jar','Tip jar','+10% prices',[150,300,500]],['tray','Bigger tray','holds 2 more dishes',[120,300]]].map(u=>{const l=S.up[u[0]],c=u[3][l];return c?`<button data-a="upg" data-v="${u[0]}">${u[1]} Lv${l+1}: ${u[2]} ${c} ${ic('coin',14)}</button>`:`<button class="sage" disabled>${u[1]} MAX</button>`}).join('')}</div><div class="card"><h3>Wallpapers</h3>${THEMES.map((h,i)=>`<button class="${S.thc===i?'sage':''}" data-a="theme" data-v="${i}">${h[0]}${S.th.includes(i)?(S.thc===i?' (on)':''):' '+h[4]+' coins'}</button>`).join('')}</div><div class="card"><h3>Ingredients</h3>${Object.entries(G).map(([k,g])=>`<button data-a="ing" data-v="${k}">${ic(g[0],20)} ${g[1]} ${ic('coin',14)} (have ${S.inv[k]})</button>`).join('')}</div>
 <div class="card"><h3>Decorations</h3>${Object.entries(D).map(([k,d])=>S.decor.includes(k)?`<button class="sage" data-a="place" data-v="${k}">${ic(d[0],20)} ${S.placed.includes(k)?'Remove':'Place'}</button>`:`<button data-a="buy" data-v="${k}">${ic(d[0],20)} ${d[1]} ${d[2]} ${ic('coin',14)}</button>`).join('')}</div>`;
 if(tab==='cat')return `<div class="card"><h3>${esc(S.cat.name)}</h3>${ic('cat'+S.cat.cur,64)}<p>Pets: ${S.cat.pets} · Snacks: ${S.cat.fed}${S.cat.fed+S.cat.pets>=3?' · Happy cat = bigger tips':''}</p><button data-a="pet">Pet</button><button data-a="feed">Feed (2 coins)</button><button class="alt" data-a="name">Rename</button></div><div class="card"><h3>Cat collection</h3>${CATS.map((c,i)=>`<p>${ic('cat'+i,40)} <b>${c[0]}</b> · ${c[1]} · +${3*i}s patience ${S.cats.includes(i)?(S.cat.cur===i?'(active)':`<button class="sage" data-a="pick" data-v="${i}">Choose</button>`):`<button data-a="adopt" data-v="${i}">Adopt ${c[2]} ${ic('coin',14)} (lvl ${c[3]})</button>`}</p>`).join('')}</div>`;
 if(tab==='stats')return `<div class="card"><h3>Daily missions</h3>${MIS.map((m,i)=>`<p>${S.mis.done.includes(i)?'✅':'⬜'} ${m[0]} (${Math.min(S.mis[m[1]],m[2])}/${m[2]}) · +20🪙</p>`).join('')}<h3>Regulars</h3>${[['p1','Mina'],['p2','Mr. Oak'],['p3','Shy Pip'],['p4','Cat Lady'],['p5','Mystery Guest']].map(r=>`<p>${ic(r[0],24)} ${r[1]} ${ic('hrt',12).repeat(Math.floor(S.fr[r[0]]/5))}${'.'.repeat(5-Math.floor(S.fr[r[0]]/5))} (${S.fr[r[0]]}/25)</p>`).join('')}<h3>Achievements</h3>${ACH.map((a,i)=>`<p>${S.ach.includes(i)?'[x]':'[ ]'} ${a[0]} · +${a[2]}</p>`).join('')}<h3>Stats</h3><p>Customers served: ${S.served}<br>Login streak: ${S.streak} days<br>Best combo: ${S.best}<br>Favorite recipe: ${(()=>{const e=Object.entries(S.fav).sort((a,b)=>b[1]-a[1])[0];return e?R[e[0]].n+' ('+e[1]+')':'none yet'})()}<br>Coins earned: ${S.earn} (tips ${S.tips})<br>Recipes: ${S.rec.length}<br>Decorations: ${S.decor.length}<br>Café level: ${L}<br>Day: ${S.day}</p></div>`;
 return `<div class="card"><h3>Menu</h3><p><small>Tip: on a phone, tap Share (iPhone) or the browser menu (Android), then Add to Home Screen to play it like an app.</small></p><p>${user?'Signed in: '+esc(user.email):'Guest mode (progress only on this device)'}</p><button data-a="pause" class="alt">${paused?'Resume':'Pause'}</button><button data-a="notes">Love notes</button><button data-a="mute" class="alt">Sound: ${mute?'OFF':'ON'}</button><button data-a="save">Save now</button>${user?'<button class="alt" data-a="logout">Log out</button>':'<button class="alt" data-a="logout">Log in / register</button>'}<button class="alt" data-a="reset">Erase progress</button></div>`}
function render(){if(!user&&!window._t)return auth();
 $('#app').innerHTML=`<div class="card">Her Little Café · ${ic('coin',16)} ${S.coins} · Lv ${lvl()} <button class="alt" data-a="heart" title="Secret letter">${ic('hrt',14)}</button>${lvl()>=5?'<button data-a="final">★</button>':''}<br><small id="st">${esc(status)}</small></div>
 <div class="tabs">${[['cafe','Café'],['book','Recipes'],['shop','Shop'],['cat','Cat'],['stats','Missions'],['menu','Menu']].map(t=>`<button class="${tab===t[0]?'':'alt'}" data-a="tab" data-v="${t[0]}">${t[1]}</button>`).join('')}</div>
 ${msg?`<div class="card">${esc(msg)}</div>`:''}${view()}`}
document.addEventListener('click',e=>{XY=[e.clientX,e.clientY];const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
 if(a==='in')authDo('in');else if(a==='up')authDo('up');else if(a==='guest')authDo('guest');else if(a==='rst')authDo('reset');else act(a,b.dataset.v)});
sb.auth.onAuthStateChange(ev=>{if(ev==='PASSWORD_RECOVERY')setTimeout(async()=>{const p=prompt('New password (6+ chars):');if(p){const r=await sb.auth.updateUser({password:p});alert(r.error?r.error.message:'Password updated!')}},300)});
window.addEventListener('online',()=>{if(user)push(0)});
(async()=>{const {data}=await sb.auth.getSession();if(data.session){user=data.session.user;await load();enter()}else auth()})();
