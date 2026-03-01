/* ── HITLER STORE app.js ── */

/* LOADER */
(function(){
  let p=0;
  const fill=document.getElementById("ldP"),txt=document.getElementById("ldTxt");
  const iv=setInterval(()=>{
    p+=Math.random()*18+6;if(p>=100){p=100;clearInterval(iv);}
    if(fill)fill.style.width=p+"%";
    if(txt)txt.textContent=Math.floor(p)+"%";
  },65);
  setTimeout(()=>document.getElementById("ld")?.classList.add("gone"),1100);
})();

/* CURSOR */
(function(){
  const d=document.getElementById("cur"),r=document.getElementById("cur-r");
  if(!d||window.matchMedia("(pointer:coarse)").matches)return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;d.style.left=mx+"px";d.style.top=my+"px";});
  (function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;if(r){r.style.left=rx+"px";r.style.top=ry+"px";}requestAnimationFrame(loop);})();
  document.addEventListener("mouseover",e=>{if(e.target.closest("a,button,.pkg,.offer-card,.step")){d.classList.add("big");r?.classList.add("big");}});
  document.addEventListener("mouseout",e=>{if(e.target.closest("a,button,.pkg,.offer-card,.step")){d.classList.remove("big");r?.classList.remove("big");}});
})();

/* NAV */
window.addEventListener("scroll",()=>document.getElementById("nav")?.classList.toggle("stuck",scrollY>55),{passive:true});
document.getElementById("burger")?.addEventListener("click",()=>{
  const n=document.getElementById("mobNav");n?.classList.toggle("open");
  document.getElementById("burger").textContent=n?.classList.contains("open")?"✕":"☰";
});
function closeMob(){document.getElementById("mobNav")?.classList.remove("open");const b=document.getElementById("burger");if(b)b.textContent="☰";}

/* TICKER */
(function(){
  const items=FAKE_NAMES.map((n,i)=>`<div class="ticker-item"><strong>${n}</strong> اشترى ${FAKE_ITEMS[i%FAKE_ITEMS.length]} <span class="ticker-dot">●</span></div>`);
  const all=[...items,...items];
  document.getElementById("ticker").innerHTML=all.join("");
})();

/* RENDER PACKAGES */
function fmt(n){return n.toLocaleString("ar-EG")+" جنيه";}
const BDGS={
  "الأكثر مبيعاً":"top",
  "VIP":"vip",
  "جديد":"new",
  "خصم":"sale"
};

document.getElementById("ucGrid").innerHTML=PKG.map((p,i)=>`
  <div class="pkg${p.hot?" hot":""} reveal" style="transition-delay:${i*.04}s">
    ${p.badge?`<div class="pkg-bdg ${BDGS[p.badge]||""}">${p.badge}</div>`:""}
    <span class="pkg-ico">${p.ico}</span>
    <div class="pkg-uc">${p.uc.toLocaleString()} <span>UC</span></div>
    <div class="pkg-price">${fmt(p.egp)}</div>
    <button class="pkg-btn" onclick="openMo('${p.uc} UC',${p.egp})">🛒 اشتري دلوقتي</button>
  </div>
`).join("");

document.getElementById("offersGrid").innerHTML=OFFERS.map((o,i)=>`
  <div class="offer-card reveal" style="transition-delay:${i*.06}s">
    <div class="offer-ico">${o.ico}</div>
    <div class="offer-name">${o.name}</div>
    <div class="offer-price">${fmt(o.egp)}</div>
    <button class="offer-btn" onclick="openMo('${o.name}',${o.egp})">🛒 اشتري</button>
  </div>
`).join("");

/* OBSERVER */
setTimeout(()=>{
  const obs=new IntersectionObserver(en=>en.forEach(e=>{if(e.isIntersecting)e.target.classList.add("on");}),{threshold:.1});
  document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));
},100);

/* POPUP NOTIFS */
(function(){
  const c=document.getElementById("pop");if(!c)return;
  let busy=false;
  function show(){
    if(busy)return;busy=true;
    const name=FAKE_NAMES[Math.random()*FAKE_NAMES.length|0];
    const item=FAKE_ITEMS[Math.random()*FAKE_ITEMS.length|0];
    const div=document.createElement("div");
    div.className="pop-item";
    div.innerHTML=`<div class="pop-av">${name[0]}</div><div><strong>${name}</strong><span>اشترى ${item} • للتو</span></div>`;
    c.appendChild(div);
    setTimeout(()=>{div.remove();busy=false;},5000);
  }
  setTimeout(()=>{show();setInterval(show,Math.random()*9000+9000);},4000);
})();

/* ORDER MODAL */
let _pkg=null;

window.openMo=function(label,price){
  _pkg={label,price};
  document.getElementById("moPkgN").textContent=label;
  document.getElementById("moPkgP").textContent=price.toLocaleString()+" جنيه";
  document.getElementById("moErr").classList.remove("show");
  document.getElementById("inName").value="";
  document.getElementById("inPID").value="";
  document.getElementById("inPhone").value="";
  document.getElementById("oMo").classList.add("open");
};
window.closeMo=()=>document.getElementById("oMo").classList.remove("open");
window.closeSMo=()=>document.getElementById("sMo").classList.remove("open");
document.getElementById("oMo").addEventListener("click",e=>{if(e.target.id==="oMo")closeMo();});
document.getElementById("sMo").addEventListener("click",e=>{if(e.target.id==="sMo")closeSMo();});

/* SUBMIT */
window.submitOrder=async function(){
  const name=document.getElementById("inName").value.trim();
  const pid=document.getElementById("inPID").value.trim();
  const phone=document.getElementById("inPhone").value.trim();
  const err=document.getElementById("moErr");
  const btn=document.getElementById("moSubmit");

  if(!name||!pid||!phone){err.textContent="⚠️ أكمل جميع الحقول";err.classList.add("show");return;}
  if(!/^[0-9]{10,11}$/.test(phone.replace(/\s/g,""))){err.textContent="⚠️ رقم الموبايل غير صحيح";err.classList.add("show");return;}

  err.classList.remove("show");
  btn.disabled=true;btn.textContent="جاري الإرسال...";

  const orderId="HS"+Date.now().toString().slice(-6);
  const waNum="2"+phone.replace(/^0/,"");

  const msg=
`🛒 *طلب جديد — ${orderId}*

👤 *الاسم:* ${name}
📱 *الموبايل:* ${phone}
🎮 *Player ID:* ${pid}
📦 *الباقة:* ${_pkg.label}
💰 *السعر:* ${_pkg.price.toLocaleString()} جنيه`;

  try{
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        chat_id:TG_CHAT,
        text:msg,
        parse_mode:"Markdown",
        reply_markup:{
          inline_keyboard:[[
            {text:"📞 واتساب العميل",url:`https://wa.me/${waNum}`},
            {text:"💬 تليجرام العميل",url:`https://t.me/+${waNum}`}
          ]]
        }
      })
    });

    // Save to localStorage for dashboard
    const allOrders=JSON.parse(localStorage.getItem("hs_orders")||"[]");
    allOrders.unshift({
      id:orderId,name,phone,gameId:pid,
      pkg:_pkg.label,price:_pkg.price,
      status:"pending",createdAt:new Date().toISOString(),
      msgs:[{from:"system",text:`طلب جديد: ${_pkg.label} — ${_pkg.price.toLocaleString()} جنيه`,ts:Date.now()}]
    });
    localStorage.setItem("hs_orders",JSON.stringify(allOrders));

    closeMo();
    document.getElementById("tgLink").href=`https://t.me/${TG_BOT}?start=${orderId}`;
    document.getElementById("sMo").classList.add("open");

  }catch(e){
    err.textContent="❌ حصل خطأ، جرب تاني";
    err.classList.add("show");
  }

  btn.disabled=false;btn.textContent="إرسال الطلب ⚡";
};
