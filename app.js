/* HITLERSTORE app.js v7 */

const CFG = { wa:"201278443292", rate:50, cur:"EGP" };

const PKG = [
  {id:1,uc:60,   egp:55,   badge:"",              hot:false,ico:"💠"},
  {id:2,uc:325,  egp:240,  badge:"",              hot:false,ico:"💎"},
  {id:3,uc:385,  egp:290,  badge:"جديد",          hot:false,ico:"⭐"},
  {id:4,uc:660,  egp:450,  badge:"",              hot:true, ico:"🔥"},
  {id:5,uc:1845, egp:1200, badge:"الأكثر مبيعاً", hot:true, ico:"🏆"},
  {id:6,uc:3940, egp:2300, badge:"خصم",           hot:false,ico:"💰"},
  {id:7,uc:8100, egp:4450, badge:"VIP",           hot:false,ico:"👑"},
];
const PROS = [
  {id:1,name:"عرض الازدهار الأول",  egp:60, ico:"🌸"},
  {id:2,name:"عرض الازدهار الثاني", egp:150,ico:"🌺"},
  {id:3,name:"عرض الازدهار الثالث", egp:240,ico:"🌹"},
];
const MEMS = [
  {id:1,name:"PRIME العادية",egp:55, prime:false,ico:"⭐",feats:["مكافآت يومية","تجربة حصرية","مكافأة الولاء"]},
  {id:2,name:"PRIME المميزة",egp:485,prime:true, ico:"👑",feats:["كل مميزات العادية","مكافآت إضافية","أولوية الدعم","عناصر حصرية"]},
];
const STEPS = [
  {ico:"🛒",n:"01",title:"اختر باقتك",  desc:"اختر الباقة من شدات UC أو العروض"},
  {ico:"📝",n:"02",title:"أدخل بياناتك",desc:"اكتب اسمك وPlayer ID في النموذج"},
  {ico:"💳",n:"03",title:"حوّل الفلوس", desc:"هنبعتلك رقم الكاش وتحوّل المبلغ"},
  {ico:"⚡",n:"04",title:"استلم فوراً", desc:"الشدات بتتشحن على حسابك فوراً"},
];
const NAMES = ["أحمد","محمد","علي","يوسف","عمر","خالد","مصطفى","سامي","كريم","ياسر"];

/* ── LOADER ── */
(function(){
  let p=0;
  const fill=document.getElementById("ldP"), txt=document.getElementById("ldTxt");
  const iv=setInterval(()=>{
    p+=Math.random()*18+6; if(p>=100){p=100;clearInterval(iv);}
    if(fill)fill.style.width=p+"%";
    if(txt)txt.textContent=Math.floor(p)+"%";
  },70);
  setTimeout(()=>document.getElementById("ld")?.classList.add("gone"),1100);
})();

/* ── CURSOR ── */
(function(){
  const d=document.getElementById("cur"),r=document.getElementById("cur-r");
  if(!d)return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;d.style.left=mx+"px";d.style.top=my+"px";});
  (function loop(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;if(r){r.style.left=rx+"px";r.style.top=ry+"px";}requestAnimationFrame(loop);})();
  document.addEventListener("mouseover",e=>{if(e.target.closest("a,button,.pkg,.pros-card,.mem,.step")){d.classList.add("big");r?.classList.add("big");}});
  document.addEventListener("mouseout", e=>{if(e.target.closest("a,button,.pkg,.pros-card,.mem,.step")){d.classList.remove("big");r?.classList.remove("big");}});
})();

/* ── NAV ── */
window.addEventListener("scroll",()=>document.getElementById("nav")?.classList.toggle("stuck",scrollY>55),{passive:true});
document.getElementById("burger")?.addEventListener("click",()=>{
  const n=document.getElementById("mobNav"); n?.classList.toggle("open");
  document.getElementById("burger").textContent=n?.classList.contains("open")?"✕":"☰";
});
function closeMob(){document.getElementById("mobNav")?.classList.remove("open");const b=document.getElementById("burger");if(b)b.textContent="☰";}

/* ── AUTH STATE ── */
const _user = JSON.parse(localStorage.getItem("hs_user")||"null");
if(_user){
  document.getElementById("navAuth")?.style.setProperty("display","none");
  const nu=document.getElementById("navUser"); if(nu)nu.style.display="flex";
  const na=document.getElementById("navAv");   if(na)na.textContent=_user.realName?.[0]||"؟";
  const nn=document.getElementById("navName"); if(nn)nn.textContent=_user.realName||"";
}
window.doLogout=function(){localStorage.removeItem("hs_user");location.reload();};

/* ── ORDER MODAL ── */
let _buyPkg=null;

window.openBuy=function(label,price,id){
  _buyPkg={label,price,id};
  const mo=document.getElementById("oMo");
  const pn=document.getElementById("moPkgN"),pp=document.getElementById("moPkgP"),pb=document.getElementById("moPkg");
  if(pn)pn.textContent=label;
  if(pp)pp.textContent=price.toLocaleString()+" جنيه";
  if(pb)pb.style.display="flex";
  const body=document.getElementById("moBody");
  if(!_user){
    document.getElementById("moUser").textContent="مش مسجّل دخول";
    body.innerHTML=`<div style="text-align:center;padding:14px 0">
      <p style="color:var(--mu);font-size:.88rem;margin-bottom:16px">لازم تسجّل دخول عشان تكمل الطلب</p>
      <a href="auth.html" class="mo-btn" style="display:block;text-align:center">سجّل دخول →</a>
      <a href="auth.html?tab=signup" style="display:block;text-align:center;margin-top:9px;font-size:.82rem;color:var(--v2)">أو أنشئ حساب جديد</a>
    </div>`;
  } else {
    document.getElementById("moUser").textContent="أهلاً، "+_user.realName;
    body.innerHTML=`
      <div class="mo-hint">⚡ بعد الإرسال هنبعتلك رقم الكاش مباشرة</div>
      <div style="background:var(--surface);border:1px solid var(--rim2);border-radius:var(--r);padding:11px 13px;margin-bottom:14px;font-size:.82rem;color:var(--mu)">
        <div style="display:flex;justify-content:space-between;margin-bottom:5px"><span>Player ID</span><strong style="color:var(--wh)">${_user.gameId}</strong></div>
        <div style="display:flex;justify-content:space-between"><span>اسم اللعبة</span><strong style="color:var(--wh)">${_user.gameName}</strong></div>
      </div>
      <button class="mo-btn" id="moSubmit" onclick="submitOrder()">إرسال الطلب ←</button>`;
  }
  mo?.classList.add("open");
};
window.closeMo=()=>document.getElementById("oMo")?.classList.remove("open");
window.closeSMo=()=>document.getElementById("sMo")?.classList.remove("open");
document.getElementById("oMo")?.addEventListener("click",e=>{if(e.target.id==="oMo")closeMo();});
document.getElementById("sMo")?.addEventListener("click",e=>{if(e.target.id==="sMo")closeSMo();});

window.submitOrder=async function(){
  if(!_buyPkg||!_user)return;
  const btn=document.getElementById("moSubmit");
  if(btn){btn.disabled=true;btn.textContent="جاري الإرسال...";}
  try{
    const {initializeApp,getApps,getApp}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const {getFirestore,addDoc,collection,serverTimestamp}=await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const app=getApps().length?getApp():initializeApp(FIREBASE_CONFIG);
    const db=getFirestore(app);
    const ref=await addDoc(collection(db,"orders"),{
      uid:_user.uid,
      customerName:_user.realName,
      phone:_user.phone,
      gameId:_user.gameId,
      gameName:_user.gameName,
      package:_buyPkg,
      status:"pending",
      createdAt:serverTimestamp(),
      messages:[{from:"system",text:`طلب جديد: ${_buyPkg.label} — ${_buyPkg.price} جنيه`,ts:Date.now()}]
    });
    localStorage.setItem("hs_last_order",ref.id);
    closeMo();
    document.getElementById("sOid").textContent="#"+ref.id.slice(-8).toUpperCase();
    document.getElementById("sMo")?.classList.add("open");
  }catch(e){
    console.error(e);alert("حصل خطأ، جرب تاني");
    if(btn){btn.disabled=false;btn.textContent="إرسال الطلب ←";}
  }
};

/* ── CALCULATOR ── */
function fmt(egp){return CFG.cur==="USD"?"$"+(egp/CFG.rate).toFixed(2):egp.toLocaleString("ar-EG")+" جنيه";}
function switchTab(m){
  document.getElementById("tabUC").classList.toggle("on",m==="uc");
  document.getElementById("tabM").classList.toggle("on",m==="m");
  document.getElementById("panUC").classList.toggle("off",m!=="uc");
  document.getElementById("panM").classList.toggle("off",m!=="m");
}
function findCombo(target){
  const s=[...PKG].sort((a,b)=>b.uc-a.uc);let rem=target;const c=[];
  for(const p of s){if(rem<=0)break;const q=Math.floor(rem/p.uc);if(q>0){c.push({...p,qty:q});rem-=q*p.uc;}}
  if(rem>0){const sm=s[s.length-1];const l=c.find(x=>x.id===sm.id);if(l)l.qty++;else c.push({...sm,qty:1});}
  return{combo:c,totalUC:c.reduce((s,x)=>s+x.uc*x.qty,0),totalEgp:c.reduce((s,x)=>s+x.egp*x.qty,0)};
}
function mkComboHTML(c){return c.map(x=>`<div class="cr-row"><span class="cr-name">${x.ico} ${x.uc.toLocaleString()} UC</span><div class="cr-right"><span class="cr-q">×${x.qty}</span><span class="cr-p">${fmt(x.egp*x.qty)}</span></div></div>`).join("");}
function mkResHTML(combo,tUC,tEgp,note,exact,lbl){
  return`<div class="cr">
    <div class="cr-lbl">الباقات المقترحة</div>
    <div class="cr-list">${mkComboHTML(combo)}</div>
    <div class="cr-total"><div><div class="cr-lbl">الإجمالي</div><div class="cr-uc">${tUC.toLocaleString()} UC</div></div><div class="cr-price">${fmt(tEgp)}</div></div>
    <div class="cr-note${exact?" ex":""}">${note}</div>
    <button class="cr-buy" onclick="openBuy('${lbl}',${tEgp},'combo')">🛒 اطلب هذه التشكيلة</button>
  </div>`;}

function calcUC(){
  const el=document.getElementById("resUC"),v=parseInt(document.getElementById("inUC").value);
  if(!v||v<1){el.innerHTML=`<div class="cph"><span>🎮</span><span>أدخل العدد</span></div>`;return;}
  const{combo,totalUC,totalEgp}=findCombo(v);
  const exact=totalUC===v;
  el.innerHTML=mkResHTML(combo,totalUC,totalEgp,exact?`✅ ستحصل على ${totalUC.toLocaleString()} شدة بالضبط`:`💡 أقرب عدد: ${totalUC.toLocaleString()} شدة`,exact,combo.map(c=>`${c.uc}UC×${c.qty}`).join("+"));
}
function calcM(){
  const el=document.getElementById("resM"),budget=parseInt(document.getElementById("inM").value);
  if(!budget||budget<1){el.innerHTML=`<div class="cph"><span>💰</span><span>أدخل المبلغ</span></div>`;return;}
  const s=[...PKG].sort((a,b)=>b.uc-a.uc);let rem=budget;const c=[];
  for(const p of s){if(rem<p.egp)continue;const q=Math.floor(rem/p.egp);if(q>0){c.push({...p,qty:q});rem-=q*p.egp;}}
  if(!c.length){el.innerHTML=`<div class="cph"><span>💸</span><span>المبلغ لا يكفي</span></div>`;return;}
  const tUC=c.reduce((s,x)=>s+x.uc*x.qty,0),spent=c.reduce((s,x)=>s+x.egp*x.qty,0),left=budget-spent;
  el.innerHTML=mkResHTML(c,tUC,spent,left>0?`💡 يتبقى ${fmt(left)} لا تكفي لباقة`:`✅ صرفت كل المبلغ`,left===0,c.map(x=>`${x.uc}UC×${x.qty}`).join("+"));
}

/* ── COUNTDOWN ── */
(function(){
  const key="hs_offer_end";let end=+localStorage.getItem(key)||0;
  if(!end||end<Date.now()){end=Date.now()+20*864e5;localStorage.setItem(key,end);}
  function pad(n){return String(n).padStart(2,"0");}
  function tick(){
    const d=end-Date.now();if(d<=0)return;
    document.getElementById("tD").textContent=pad(Math.floor(d/864e5));
    document.getElementById("tH").textContent=pad(Math.floor(d%864e5/36e5));
    document.getElementById("tM").textContent=pad(Math.floor(d%36e5/6e4));
    document.getElementById("tS").textContent=pad(Math.floor(d%6e4/1e3));
  }
  tick();setInterval(tick,1000);
})();

/* ── RENDER ── */
const BDGS = {"الأكثر مبيعاً":"bdg-p","VIP":"bdg-v","جديد":"bdg-n","خصم":"bdg-s"};

function renderUC(){
  const g=document.getElementById("ucGrid");if(!g)return;
  g.innerHTML=PKG.map((p,i)=>`
    <div class="pkg${p.hot?" hot":""} reveal" style="transition-delay:${i*.04}s">
      ${p.badge?`<div class="pkg-bdg ${BDGS[p.badge]||""}">${p.badge}</div>`:""}
      <span class="pkg-ico">${p.ico}</span>
      <div class="pkg-uc">
        <img class="uc-img" src="https://img.icons8.com/fluency/48/coin.png" alt="" onerror="this.style.display='none'"/>
        <span class="uc-num">${p.uc.toLocaleString()}</span>
        <span class="uc-tag">UC</span>
      </div>
      <div class="qty-row">
        <button class="qty-btn" onclick="chQ('q${p.id}','pr${p.id}',-1,${p.egp})">−</button>
        <input class="qty-in" id="q${p.id}" type="number" value="1" min="1" max="99" oninput="upPr('q${p.id}','pr${p.id}',${p.egp})"/>
        <button class="qty-btn" onclick="chQ('q${p.id}','pr${p.id}',1,${p.egp})">+</button>
      </div>
      <div class="pkg-price-box">
        <span class="pkg-pr" id="pr${p.id}">${fmt(p.egp)}</span>
        <div class="pkg-pr-note">الإجمالي حسب الكمية</div>
      </div>
      <button class="btn-buy" onclick="_buyUC(${p.id})">🛒 اشترِ الآن</button>
    </div>`).join("");
}
window._buyUC=function(id){
  const p=PKG.find(x=>x.id===id);
  const q=Math.max(1,+document.getElementById("q"+id)?.value||1);
  openBuy(`${p.uc} UC × ${q}`,p.egp*q,"uc"+id);
};
function chQ(qi,pi,d,b){const i=document.getElementById(qi);if(!i)return;i.value=Math.max(1,Math.min(99,(+i.value||1)+d));upPr(qi,pi,b);}
function upPr(qi,pi,b){const e=document.getElementById(pi),q=document.getElementById(qi);if(e&&q)e.textContent=fmt(Math.max(1,+q.value||1)*b);}

function renderPros(){
  const g=document.getElementById("prosGrid");if(!g)return;
  g.innerHTML=PROS.map((p,i)=>`
    <div class="pros-card reveal" style="transition-delay:${i*.07}s">
      <div class="pros-n">${String(i+1).padStart(2,"0")}</div>
      <div class="pros-ico">${p.ico}</div>
      <div class="pros-name">${p.name}</div>
      <div class="pros-price" id="ppr${p.id}">${fmt(p.egp)}</div>
      <div class="pros-sub">للشخص الواحد</div>
      <button class="btn-pros" onclick="openBuy('${p.name}',${p.egp},'pros${p.id}')">🛒 اشترِ</button>
    </div>`).join("");
}
function renderMems(){
  const g=document.getElementById("memGrid");if(!g)return;
  g.innerHTML=MEMS.map((m,i)=>`
    <div class="mem${m.prime?" prime":""} reveal" style="transition-delay:${i*.1}s">
      <span class="mem-ico">${m.ico}</span>
      <div class="mem-name">${m.name}</div>
      <span class="mem-price">${fmt(m.egp)}</span>
      <div class="mem-period">/ شهر</div>
      <ul class="mem-feats">${m.feats.map(f=>`<li class="mem-feat">${f}</li>`).join("")}</ul>
      <button class="btn-mem" onclick="openBuy('عضوية ${m.name}',${m.egp},'mem${m.id}')">👑 اشترك</button>
    </div>`).join("");
}
function renderSteps(){
  const g=document.getElementById("stepsGrid");if(!g)return;
  g.innerHTML=STEPS.map((s,i)=>`
    <div class="step reveal" style="transition-delay:${i*.06}s">
      <div class="step-bg">${s.n}</div>
      <div class="step-ico">${s.ico}</div>
      <div class="step-num">${s.n}</div>
      <h3>${s.title}</h3><p>${s.desc}</p>
    </div>`).join("");
}

/* ── OBSERVER ── */
function initObs(){
  const o=new IntersectionObserver(en=>en.forEach(e=>{if(e.isIntersecting)e.target.classList.add("on");}),{threshold:.1,rootMargin:"0px 0px -30px 0px"});
  document.querySelectorAll(".reveal").forEach(el=>o.observe(el));
}

/* ── POPUPS ── */
function initPops(){
  const c=document.getElementById("pop");if(!c)return;
  const items=["660 UC","1845 UC","شحن السيزون","325 UC","PRIME المميزة"];
  const emojis=["🎮","🔥","⚡","💎","🏆"];
  let busy=false;
  function show(){
    if(busy)return;busy=true;
    const name=NAMES[Math.random()*NAMES.length|0];
    const item=items[Math.random()*items.length|0];
    const em=emojis[Math.random()*emojis.length|0];
    const div=document.createElement("div");
    div.className="pop-item";
    div.innerHTML=`<div class="pop-av">${em}</div><div><strong>${name}</strong><span>اشترى ${item} • للتو</span></div>`;
    c.appendChild(div);
    setTimeout(()=>{div.remove();busy=false;},5200);
  }
  setTimeout(()=>{show();setInterval(show,Math.random()*8000+10000);},3500);
}

/* ── INIT ── */
document.addEventListener("DOMContentLoaded",()=>{
  renderUC();renderPros();renderMems();renderSteps();
  setTimeout(initObs,100);
  initPops();
});
