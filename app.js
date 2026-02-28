/**
 * HITLERSTORE app.js v6
 * Loader إصلاح + بنفسجي ذهبي
 */

const CFG = { wa:"201278443292", rate:50, cur:"EGP" };

const DATA = {
  uc:[
    {id:1,uc:60,   egp:55,   badge:"",              hot:false,icon:"💠"},
    {id:2,uc:325,  egp:240,  badge:"",              hot:false,icon:"💎"},
    {id:3,uc:385,  egp:290,  badge:"جديد",          hot:false,icon:"⭐"},
    {id:4,uc:660,  egp:450,  badge:"",              hot:true, icon:"🔥"},
    {id:5,uc:1845, egp:1200, badge:"الأكثر مبيعاً", hot:true, icon:"🏆"},
    {id:6,uc:3940, egp:2300, badge:"خصم",           hot:false,icon:"💰"},
    {id:7,uc:8100, egp:4450, badge:"VIP",           hot:false,icon:"👑"},
  ],
  pros:[
    {id:1,name:"عرض الازدهار الأول",  egp:60, icon:"🌸"},
    {id:2,name:"عرض الازدهار الثاني", egp:150,icon:"🌺"},
    {id:3,name:"عرض الازدهار الثالث", egp:240,icon:"🌹"},
  ],
  mem:[
    {id:1,name:"PRIME العادية",egp:55, prime:false,icon:"⭐",feats:["مكافآت يومية","تجربة حصرية","مكافأة الولاء"]},
    {id:2,name:"PRIME المميزة",egp:485,prime:true, icon:"👑",feats:["كل مميزات العادية","مكافآت إضافية","أولوية الدعم","عناصر حصرية"]},
  ],
  steps:[
    {icon:"🛒",num:"01",title:"اختر باقتك",  desc:"اختر الباقة المناسبة من شدات UC أو العروض"},
    {icon:"📝",num:"02",title:"أدخل بياناتك",desc:"اكتب اسمك وPlayer ID في النموذج البسيط"},
    {icon:"💳",num:"03",title:"حوّل الفلوس", desc:"هنبعتلك رقم الكاش وتحوّل المبلغ فوراً"},
    {icon:"⚡",num:"04",title:"استلم فوراً", desc:"الشدات بتتشحن على حسابك بعد التأكيد"},
  ],
  names:["أحمد","محمد","علي","يوسف","عمر","خالد","مصطفى","سامي","كريم","ياسر"],
};

// ══ LOADER — يشتغل فوراً بدون Firebase ══
(function(){
  const fill = document.getElementById("ldFill");
  let p = 0;
  const iv = setInterval(()=>{
    p += Math.random()*20 + 8;
    if(p >= 100){ p = 100; clearInterval(iv); }
    if(fill) fill.style.width = p + "%";
  }, 80);
  // يختفي بعد 1.2 ثانية بغض النظر عن أي حاجة
  setTimeout(()=>{
    const loader = document.getElementById("loader");
    if(loader) loader.classList.add("out");
  }, 1200);
})();

// ══ ORDER MODAL ══
let _pkg = null;

window.openModal = function(label, price, id){
  _pkg = {label, price, id};
  document.getElementById("moPkg").textContent = `${label} — ${price.toLocaleString()} جنيه`;
  document.getElementById("oModal").classList.add("open");
  setTimeout(()=> document.getElementById("mName")?.focus(), 80);
};
window.closeModal  = ()=> document.getElementById("oModal").classList.remove("open");
window.closeSModal = ()=> document.getElementById("sModal").classList.remove("open");
document.getElementById("oModal")?.addEventListener("click",e=>{ if(e.target.id==="oModal") closeModal(); });
document.getElementById("sModal")?.addEventListener("click",e=>{ if(e.target.id==="sModal") closeSModal(); });

window.submitOrder = async function(){
  const name = document.getElementById("mName").value.trim();
  const gid  = document.getElementById("mGameId").value.trim();
  const gn   = document.getElementById("mGameName").value.trim();
  const btn  = document.getElementById("moBtn");
  if(!name||!gid||!gn){ alert("من فضلك أكمل جميع البيانات"); return; }
  btn.disabled = true; btn.textContent = "جاري الإرسال...";
  try{
    const {initializeApp,getApps,getApp} = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const {getFirestore,addDoc,collection,serverTimestamp} = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const app = getApps().find(a=>a.name==="store") || initializeApp(FIREBASE_CONFIG,"store");
    const db  = getFirestore(app);
    const ref = await addDoc(collection(db,"orders"),{
      customerName:name, gameId:gid, gameName:gn,
      package:_pkg, status:"pending", createdAt:serverTimestamp(),
      messages:[{from:"system",text:`طلب جديد: ${_pkg.label} — ${_pkg.price} جنيه`,ts:Date.now()}]
    });
    localStorage.setItem("hs_order_id", ref.id);
    closeModal();
    document.getElementById("sId").textContent = "#" + ref.id.slice(-8).toUpperCase();
    document.getElementById("sModal").classList.add("open");
  } catch(e){
    console.error(e);
    alert("حصل خطأ أثناء الإرسال، تأكد من الاتصال بالإنترنت");
    btn.disabled = false; btn.textContent = "إرسال الطلب ←";
  }
};

// ══ CURSOR ══
(function(){
  const d=document.getElementById("cur"), r=document.getElementById("cur-r");
  if(!d||!r) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener("mousemove",e=>{ mx=e.clientX; my=e.clientY; d.style.left=mx+"px"; d.style.top=my+"px"; });
  (function loop(){ rx+=(mx-rx)*.1; ry+=(my-ry)*.1; r.style.left=rx+"px"; r.style.top=ry+"px"; requestAnimationFrame(loop); })();
  document.addEventListener("mouseover",e=>{ if(e.target.closest("a,button,.pkg-card,.pros-card,.mem-card,.step")){ d.classList.add("big"); r.classList.add("big"); } });
  document.addEventListener("mouseout", e=>{ if(e.target.closest("a,button,.pkg-card,.pros-card,.mem-card,.step")){ d.classList.remove("big"); r.classList.remove("big"); } });
})();

// ══ NAV ══
window.addEventListener("scroll",()=> document.getElementById("nav")?.classList.toggle("stuck",scrollY>60),{passive:true});
document.getElementById("burger")?.addEventListener("click",()=>{
  const n = document.getElementById("mobNav");
  n?.classList.toggle("open");
  document.getElementById("burger").textContent = n?.classList.contains("open") ? "✕" : "☰";
});
function closeMob(){
  document.getElementById("mobNav")?.classList.remove("open");
  const b = document.getElementById("burger"); if(b) b.textContent="☰";
}

// ══ CURRENCY ══
document.getElementById("curBtn")?.addEventListener("click",()=>{
  CFG.cur = CFG.cur==="EGP" ? "USD" : "EGP";
  document.getElementById("curBtn").textContent = CFG.cur + " ⇄";
  refreshPrices();
});
function fmt(egp){ return CFG.cur==="USD" ? "$"+(egp/CFG.rate).toFixed(2) : `${egp.toLocaleString("ar-EG")} جنيه`; }
function refreshPrices(){
  DATA.uc.forEach(p=>{ const pr=document.getElementById("pr"+p.id),q=document.getElementById("q"+p.id); if(pr) pr.textContent=fmt((q?Math.max(1,+q.value||1):1)*p.egp); });
  DATA.pros.forEach(p=>{ const e=document.getElementById("ppr"+p.id); if(e) e.textContent=fmt(p.egp); });
  DATA.mem.forEach(m=>{ const e=document.getElementById("mpr"+m.id); if(e) e.textContent=fmt(m.egp); });
}

// ══ CALCULATOR ══
function switchTab(m){
  document.getElementById("tabUC").classList.toggle("active", m==="uc");
  document.getElementById("tabMoney").classList.toggle("active", m==="money");
  document.getElementById("panelUC").classList.toggle("hidden", m!=="uc");
  document.getElementById("panelMoney").classList.toggle("hidden", m!=="money");
}
function findCombo(target){
  const s=[...DATA.uc].sort((a,b)=>b.uc-a.uc); let rem=target; const c=[];
  for(const p of s){ if(rem<=0) break; const q=Math.floor(rem/p.uc); if(q>0){c.push({...p,qty:q}); rem-=q*p.uc;} }
  if(rem>0){ const sm=s[s.length-1]; const l=c.find(x=>x.id===sm.id); if(l) l.qty++; else c.push({...sm,qty:1}); }
  return{combo:c,totalUC:c.reduce((s,x)=>s+x.uc*x.qty,0),totalPrice:c.reduce((s,x)=>s+x.egp*x.qty,0)};
}
function mkCombos(combo){ return combo.map(c=>`<div class="combo-row"><span class="combo-name">${c.icon} ${c.uc.toLocaleString()} شدة</span><div class="combo-right"><span class="combo-qty">×${c.qty}</span><span class="combo-price">${fmt(c.egp*c.qty)}</span></div></div>`).join(""); }
function mkRes(combo,totalUC,totalPrice,note,exact,lbl){
  return`<div class="cres">
    <div class="cres-lbl">الباقات المقترحة</div>
    <div class="combo-list">${mkCombos(combo)}</div>
    <div class="ctotal-row"><div><div class="cres-lbl">الإجمالي</div><div class="ctotal-uc">${totalUC.toLocaleString()} UC</div></div><div class="ctotal-price">${fmt(totalPrice)}</div></div>
    <div class="cres-note${exact?" exact":""}">${note}</div>
    <button class="calc-buy-btn" onclick="openModal('${lbl}',${totalPrice},'combo')">🛒 اطلب هذه التشكيلة</button>
  </div>`;
}
function calcUC(){
  const el=document.getElementById("resUC"),v=parseInt(document.getElementById("inpUC").value);
  if(!v||v<1){el.innerHTML=`<div class="cph"><span>🎮</span><span>أدخل العدد</span></div>`;return;}
  const{combo,totalUC,totalPrice}=findCombo(v);
  const exact=totalUC===v;
  el.innerHTML=mkRes(combo,totalUC,totalPrice,exact?`✅ ستحصل على ${totalUC.toLocaleString()} شدة بالضبط`:`💡 أقرب عدد: ${totalUC.toLocaleString()} شدة`,exact,combo.map(c=>`${c.uc}UC×${c.qty}`).join("+"));
}
function calcMoney(){
  const el=document.getElementById("resMoney"),budget=parseInt(document.getElementById("inpMoney").value);
  if(!budget||budget<1){el.innerHTML=`<div class="cph"><span>💰</span><span>أدخل المبلغ</span></div>`;return;}
  const s=[...DATA.uc].sort((a,b)=>b.uc-a.uc); let rem=budget; const c=[];
  for(const p of s){ if(rem<p.egp) continue; const q=Math.floor(rem/p.egp); if(q>0){c.push({...p,qty:q}); rem-=q*p.egp;} }
  if(!c.length){el.innerHTML=`<div class="cph"><span>💸</span><span>المبلغ لا يكفي لأي باقة</span></div>`;return;}
  const totalUC=c.reduce((s,x)=>s+x.uc*x.qty,0),spent=c.reduce((s,x)=>s+x.egp*x.qty,0),left=budget-spent;
  el.innerHTML=mkRes(c,totalUC,spent,left>0?`💡 يتبقى ${fmt(left)}`:`✅ صرفت كل المبلغ`,left===0,c.map(x=>`${x.uc}UC×${x.qty}`).join("+"));
}

// ══ COUNTDOWN ══
(function(){
  const key="hs_offer_end"; let end=+localStorage.getItem(key)||0;
  if(!end||end<Date.now()){end=Date.now()+20*864e5; localStorage.setItem(key,end);}
  function pad(n){return String(n).padStart(2,"0");}
  function tick(){
    const d=end-Date.now(); if(d<=0) return;
    document.getElementById("tD").textContent=pad(Math.floor(d/864e5));
    document.getElementById("tH").textContent=pad(Math.floor(d%864e5/36e5));
    document.getElementById("tM").textContent=pad(Math.floor(d%36e5/6e4));
    document.getElementById("tS").textContent=pad(Math.floor(d%6e4/1e3));
  }
  tick(); setInterval(tick,1000);
})();

// ══ RENDER ══
function renderUC(){
  const grid=document.getElementById("ucGrid"); if(!grid) return;
  const bdg={"الأكثر مبيعاً":"bdg-pop","VIP":"bdg-vip","جديد":"bdg-new","خصم":"bdg-sale"};
  grid.innerHTML=DATA.uc.map((p,i)=>`
    <div class="pkg-card${p.hot?" hot":""} reveal" style="transition-delay:${i*.05}s">
      ${p.badge?`<div class="pkg-bdg ${bdg[p.badge]||""}">${p.badge}</div>`:""}
      <span class="pkg-emoji">${p.icon}</span>
      <div class="pkg-uc-row">
        <img class="uc-logo" src="https://img.icons8.com/fluency/48/coin.png" alt="UC" onerror="this.style.display='none'"/>
        <span class="pkg-uc-num">${p.uc.toLocaleString()}</span>
        <span class="pkg-uc-tag">UC</span>
      </div>
      <div class="qty-wrap">
        <button class="qty-btn" onclick="chQ('q${p.id}','pr${p.id}',-1,${p.egp})">−</button>
        <input class="qty-inp" id="q${p.id}" type="number" value="1" min="1" max="99" oninput="upPr('q${p.id}','pr${p.id}',${p.egp})"/>
        <button class="qty-btn" onclick="chQ('q${p.id}','pr${p.id}',1,${p.egp})">+</button>
      </div>
      <div class="pkg-price-box">
        <span class="pkg-price" id="pr${p.id}">${fmt(p.egp)}</span>
        <div class="pkg-price-note">الإجمالي حسب الكمية</div>
      </div>
      <button class="btn-buy" onclick="window._buyUC(${p.id},${p.egp})">🛒 اشترِ الآن</button>
    </div>`).join("");
}
window._buyUC = function(id,base){
  const q=Math.max(1,+document.getElementById("q"+id)?.value||1);
  const p=DATA.uc.find(x=>x.id===id);
  openModal(`${p.uc} UC × ${q}`, base*q, "uc"+id);
};
function chQ(qi,pi,d,b){ const i=document.getElementById(qi); if(!i) return; i.value=Math.max(1,Math.min(99,(+i.value||1)+d)); upPr(qi,pi,b); }
function upPr(qi,pi,b){ const e=document.getElementById(pi),q=document.getElementById(qi); if(e&&q) e.textContent=fmt(Math.max(1,+q.value||1)*b); }

function renderPros(){
  const g=document.getElementById("prosGrid"); if(!g) return;
  g.innerHTML=DATA.pros.map((p,i)=>`
    <div class="pros-card reveal" style="transition-delay:${i*.07}s">
      <div class="pros-bg-num">${String(i+1).padStart(2,"0")}</div>
      <div class="pros-icon">${p.icon}</div>
      <div class="pros-name">${p.name}</div>
      <div class="pros-price" id="ppr${p.id}">${fmt(p.egp)}</div>
      <div class="pros-sub">للشخص الواحد</div>
      <button class="btn-buy-pros" onclick="openModal('${p.name}',${p.egp},'pros${p.id}')">🛒 اشترِ</button>
    </div>`).join("");
}
function renderMem(){
  const g=document.getElementById("memGrid"); if(!g) return;
  g.innerHTML=DATA.mem.map((m,i)=>`
    <div class="mem-card${m.prime?" prime":""} reveal" style="transition-delay:${i*.1}s">
      <span class="mem-icon">${m.icon}</span>
      <div class="mem-name">${m.name}</div>
      <span class="mem-price" id="mpr${m.id}">${fmt(m.egp)}</span>
      <div class="mem-period">/ شهر</div>
      <ul class="mem-feats">${m.feats.map(f=>`<li class="mem-feat">${f}</li>`).join("")}</ul>
      <button class="btn-mem" onclick="openModal('عضوية ${m.name}',${m.egp},'mem${m.id}')">👑 اشترك</button>
    </div>`).join("");
}
function renderSteps(){
  const g=document.getElementById("stepsGrid"); if(!g) return;
  g.innerHTML=DATA.steps.map((s,i)=>`
    <div class="step reveal" style="transition-delay:${i*.06}s">
      <div class="step-num">${s.num}</div>
      <div class="step-icon">${s.icon}</div>
      <div class="step-badge">${s.num}</div>
      <h3>${s.title}</h3><p>${s.desc}</p>
    </div>`).join("");
}

// ══ OBSERVER ══
function initObs(){
  const o=new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("on"); }),{threshold:.1,rootMargin:"0px 0px -40px 0px"});
  document.querySelectorAll(".reveal").forEach(el=>o.observe(el));
}

// ══ POPUPS ══
function initPops(){
  const c=document.getElementById("livePop"); if(!c) return;
  const items=["660 UC","1845 UC","شحن السيزون","325 UC","PRIME المميزة"];
  const emojis=["🎮","🔥","⚡","💎","🏆"];
  let busy=false;
  function show(){
    if(busy) return; busy=true;
    const name=DATA.names[Math.random()*DATA.names.length|0];
    const item=items[Math.random()*items.length|0];
    const em=emojis[Math.random()*emojis.length|0];
    const div=document.createElement("div");
    div.className="pop";
    div.innerHTML=`<div class="pop-av">${em}</div><div><strong>${name}</strong><span>اشترى ${item} • للتو</span></div>`;
    c.appendChild(div);
    setTimeout(()=>{ div.remove(); busy=false; },5200);
  }
  setTimeout(()=>{ show(); setInterval(show, Math.random()*7000+10000); },4000);
}

// ══ INIT ══
document.addEventListener("DOMContentLoaded",()=>{
  renderUC(); renderPros(); renderMem(); renderSteps();
  setTimeout(initObs,150);
  initPops();
});
