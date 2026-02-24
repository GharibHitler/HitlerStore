/**
 * متجر هتلر — app.js  v4
 * ══════════════════════════════════════════════
 *  لتغيير رقم الواتساب  → عدّل CFG.wa
 *  لتغيير سعر الصرف     → عدّل CFG.rate
 *  لتغيير الأسعار       → عدّل DATA.uc / DATA.pros / DATA.mem
 * ══════════════════════════════════════════════
 */

// ════════════════════════════════════════
// ⚙️ CONFIG
// ════════════════════════════════════════
const CFG = {
  wa:   "201278443292",   // ← رقم الواتساب (بدون + أو مسافات)
  rate: 50,               // ← سعر الصرف: 1 USD = كم جنيه
  cur:  "EGP",
};

// ════════════════════════════════════════
// 📦 DATA — الباقات والأسعار
// ════════════════════════════════════════
const DATA = {
  uc: [
    { id:1, uc:60,   egp:55,   badge:"",             hot:false, icon:"💠" },
    { id:2, uc:325,  egp:240,  badge:"",             hot:false, icon:"💎" },
    { id:3, uc:385,  egp:290,  badge:"جديد",         hot:false, icon:"⭐" },
    { id:4, uc:660,  egp:450,  badge:"",             hot:true,  icon:"🔥" },
    { id:5, uc:1845, egp:1200, badge:"الأكثر مبيعاً", hot:true, icon:"🏆" },
    { id:6, uc:3940, egp:2300, badge:"خصم",          hot:false, icon:"💰" },
    { id:7, uc:8100, egp:4450, badge:"VIP",          hot:false, icon:"👑" },
  ],
  pros: [
    { id:1, name:"عرض الازدهار الأول",   egp:60,  badge:"",      icon:"🌸" },
    { id:2, name:"عرض الازدهار الثاني",  egp:150, badge:"شعبي",  icon:"🌺" },
    { id:3, name:"عرض الازدهار الثالث",  egp:240, badge:"",      icon:"🌹" },
  ],
  mem: [
    {
      id:1, name:"PRIME العادية", egp:55, prime:false, icon:"⭐",
      feats:["مكافآت يومية","تجربة حصرية","مكافأة الولاء"]
    },
    {
      id:2, name:"PRIME المميزة", egp:485, prime:true, icon:"👑",
      feats:["كل مميزات العادية","مكافآت إضافية","أولوية الدعم","عناصر حصرية"]
    },
  ],
  steps: [
    { icon:"🛒", num:"01", title:"اختر باقتك",    desc:"اختر الباقة المناسبة من شدات UC أو العروض أو العضويات" },
    { icon:"📱", num:"02", title:"واتساب فوري",    desc:"اضغط اشترِ وسيفتح واتساب برسالة جاهزة تلقائياً" },
    { icon:"💳", num:"03", title:"ادفع بأمان",     desc:"أرسل ID حسابك وادفع بأي طريقة تناسبك" },
    { icon:"⚡", num:"04", title:"استلم فوراً",    desc:"تُشحن الشدات فورياً على حسابك بعد التأكيد" },
  ],
  names: [
    "أحمد من القاهرة","محمد من الإسكندرية","علي من الجيزة",
    "يوسف من المنصورة","عمر من الإسماعيلية","خالد من أسيوط",
    "مصطفى من سوهاج","سامي من المنيا","كريم من دمياط","ياسر من الفيوم",
  ],
};

// ════════════════════════════════════════
// 🔄 LOADER
// ════════════════════════════════════════
(function() {
  const pctEl  = document.getElementById("ldPct");
  const fillEl = document.getElementById("ldFill");
  let pct = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) { pct = 100; clearInterval(iv); }
    if (pctEl)  pctEl.textContent  = Math.floor(pct) + "%";
    if (fillEl) fillEl.style.width = pct + "%";
  }, 100);
  setTimeout(() => document.getElementById("loader")?.classList.add("out"), 1900);
})();

// ════════════════════════════════════════
// 🖱️ CURSOR
// ════════════════════════════════════════
(function() {
  const dot  = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener("mousemove", e => {
    mx=e.clientX; my=e.clientY;
    dot.style.left=mx+"px"; dot.style.top=my+"px";
  });
  (function animRing() {
    rx += (mx-rx)*.11; ry += (my-ry)*.11;
    ring.style.left=rx+"px"; ring.style.top=ry+"px";
    requestAnimationFrame(animRing);
  })();
  document.addEventListener("mouseover", e => {
    if (e.target.closest("a,button,.pkg-card,.pros-card,.mem-card,.step,.calc-card")) {
      dot.classList.add("big"); ring.classList.add("big");
    }
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest("a,button,.pkg-card,.pros-card,.mem-card,.step,.calc-card")) {
      dot.classList.remove("big"); ring.classList.remove("big");
    }
  });
})();

// ════════════════════════════════════════
// 📌 HEADER SCROLL
// ════════════════════════════════════════
window.addEventListener("scroll", () => {
  document.getElementById("hdr")?.classList.toggle("stuck", scrollY > 60);
}, { passive: true });

// ════════════════════════════════════════
// 📱 MOBILE MENU
// ════════════════════════════════════════
document.getElementById("burger")?.addEventListener("click", () => {
  const nav = document.getElementById("mobNav");
  nav?.classList.toggle("open");
  document.getElementById("burger").textContent = nav?.classList.contains("open") ? "✕" : "☰";
});
function closeMob() {
  document.getElementById("mobNav")?.classList.remove("open");
  document.getElementById("burger").textContent = "☰";
}

// ════════════════════════════════════════
// 💱 CURRENCY TOGGLE
// ════════════════════════════════════════
document.getElementById("curBtn")?.addEventListener("click", () => {
  CFG.cur = CFG.cur === "EGP" ? "USD" : "EGP";
  document.getElementById("curLabel").textContent = CFG.cur;
  refreshPrices();
});

function fmt(egp) {
  return CFG.cur === "USD"
    ? `$${(egp / CFG.rate).toFixed(2)}`
    : `${egp.toLocaleString("ar-EG")} جنيه`;
}

function refreshPrices() {
  DATA.uc.forEach(p => {
    const pr = document.getElementById("pr"+p.id);
    const q  = document.getElementById("q"+p.id);
    if (pr) pr.textContent = fmt((q ? Math.max(1,+q.value||1) : 1) * p.egp);
  });
  DATA.pros.forEach(p => {
    const el = document.getElementById("ppr"+p.id);
    if (el) el.textContent = fmt(p.egp);
  });
  DATA.mem.forEach(m => {
    const el = document.getElementById("mpr"+m.id);
    if (el) el.textContent = fmt(m.egp);
  });
  // Also refresh calculator result if active
  const inp = document.getElementById("calcInput");
  if (inp && inp.value) runCalc();
}

// ════════════════════════════════════════
// 🧮 UC CALCULATOR — SMART COMBO
// ════════════════════════════════════════

// Tab switching
function switchTab(mode) {
  document.getElementById("tabUC").classList.toggle("active",    mode==="uc");
  document.getElementById("tabMoney").classList.toggle("active", mode==="money");
  document.getElementById("panelUC").classList.toggle("hidden",    mode!=="uc");
  document.getElementById("panelMoney").classList.toggle("hidden", mode!=="money");
}

/**
 * findBestCombo — يجمع الباقات لتغطية العدد المطلوب بأقل تكلفة ممكنة
 * الخوارزمية: greedy من أكبر باقة للأصغر
 */
function findBestCombo(targetUC) {
  const sorted = [...DATA.uc].sort((a,b) => b.uc - a.uc); // كبير → صغير
  let remaining = targetUC;
  const combo = [];

  for (const pkg of sorted) {
    if (remaining <= 0) break;
    const qty = Math.floor(remaining / pkg.uc);
    if (qty > 0) {
      combo.push({ ...pkg, qty });
      remaining -= qty * pkg.uc;
    }
  }

  // لو تبقى شدات لم تُغطَّ، خذ أصغر باقة تغطيها
  if (remaining > 0) {
    const smallest = sorted[sorted.length - 1];
    const last = combo.find(c => c.id === smallest.id);
    if (last) { last.qty += 1; }
    else       { combo.push({ ...smallest, qty:1 }); }
  }

  const totalUC    = combo.reduce((s,c) => s + c.uc * c.qty, 0);
  const totalPrice = combo.reduce((s,c) => s + c.egp * c.qty, 0);
  return { combo, totalUC, totalPrice };
}

// حاسبة UC → سعر
function calcUC() {
  const inputEl  = document.getElementById("inpUC");
  const resultEl = document.getElementById("resUC");
  if (!inputEl || !resultEl) return;

  const wanted = parseInt(inputEl.value);
  if (!wanted || wanted < 1) {
    resultEl.innerHTML = `<div class="calc-placeholder"><span>🎮</span><span>أدخل العدد لتظهر النتيجة</span></div>`;
    return;
  }

  const { combo, totalUC, totalPrice } = findBestCombo(wanted);
  const isExact = totalUC === wanted;

  const comboHTML = combo.map(c => `
    <div class="combo-row">
      <span class="combo-name">${c.icon} ${c.uc.toLocaleString()} شدة</span>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="combo-qty">× ${c.qty}</span>
        <span class="combo-price">${fmt(c.egp * c.qty)}</span>
      </div>
    </div>`).join("");

  const noteText = isExact
    ? `✅ ستحصل على ${totalUC.toLocaleString()} شدة بالضبط`
    : `💡 ستحصل على ${totalUC.toLocaleString()} شدة — وهو أقرب عدد ممكن لـ ${wanted.toLocaleString()} شدة`;

  // Build wa message
  const waDetails = combo.map(c=>`${c.uc.toLocaleString()} UC × ${c.qty}`).join(" + ");

  resultEl.innerHTML = `
    <div class="calc-res-wrap">
      <div class="calc-res-label">الباقات المقترحة</div>
      <div class="calc-combo">${comboHTML}</div>
      <div class="calc-total-row">
        <div>
          <div class="calc-res-label">الإجمالي</div>
          <div class="calc-total-uc">${totalUC.toLocaleString()} UC</div>
        </div>
        <div class="calc-total-price">${fmt(totalPrice)}</div>
      </div>
      <div class="calc-res-note ${isExact?'exact':''}">${noteText}</div>
      <button class="calc-buy-btn" onclick="waOpen('📦 ${waDetails}\\n💰 الإجمالي: ${fmt(totalPrice)}')">
        🛒 اشترِ هذه التشكيلة
      </button>
    </div>`;
}

// حاسبة فلوس → UC
function calcMoney() {
  const inputEl  = document.getElementById("inpMoney");
  const resultEl = document.getElementById("resMoney");
  if (!inputEl || !resultEl) return;

  const budget = parseInt(inputEl.value);
  if (!budget || budget < 1) {
    resultEl.innerHTML = `<div class="calc-placeholder"><span>💰</span><span>أدخل المبلغ لتظهر النتيجة</span></div>`;
    return;
  }

  // اشتر أكبر قدر ممكن من الشدات بهذا المبلغ
  const sorted = [...DATA.uc].sort((a,b) => b.uc - a.uc);
  let remaining = budget;
  const combo = [];

  for (const pkg of sorted) {
    if (remaining < pkg.egp) continue;
    const qty = Math.floor(remaining / pkg.egp);
    if (qty > 0) {
      combo.push({ ...pkg, qty });
      remaining -= qty * pkg.egp;
    }
  }

  if (combo.length === 0) {
    resultEl.innerHTML = `
      <div class="calc-placeholder">
        <span>💸</span>
        <span>المبلغ لا يكفي لأي باقة<br/><small style="color:var(--muted)">أقل باقة بـ ${DATA.uc[0].egp} جنيه</small></span>
      </div>`;
    return;
  }

  const totalUC    = combo.reduce((s,c) => s + c.uc * c.qty, 0);
  const totalSpent = combo.reduce((s,c) => s + c.egp * c.qty, 0);
  const leftover   = budget - totalSpent;

  const comboHTML = combo.map(c => `
    <div class="combo-row">
      <span class="combo-name">${c.icon} ${c.uc.toLocaleString()} شدة</span>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="combo-qty">× ${c.qty}</span>
        <span class="combo-price">${fmt(c.egp * c.qty)}</span>
      </div>
    </div>`).join("");

  const leftoverNote = leftover > 0
    ? `💡 يتبقى معك ${fmt(leftover)} لا تكفي لباقة إضافية`
    : `✅ صرفت كل المبلغ بالضبط`;

  const waDetails = combo.map(c=>`${c.uc.toLocaleString()} UC × ${c.qty}`).join(" + ");

  resultEl.innerHTML = `
    <div class="calc-res-wrap">
      <div class="calc-res-label">أفضل استخدام لـ ${fmt(budget)}</div>
      <div class="calc-combo">${comboHTML}</div>
      <div class="calc-total-row">
        <div>
          <div class="calc-res-label">إجمالي الشدات</div>
          <div class="calc-total-uc">${totalUC.toLocaleString()} UC</div>
        </div>
        <div class="calc-total-price">${fmt(totalSpent)}</div>
      </div>
      <div class="calc-res-note ${leftover===0?'exact':''}">${leftoverNote}</div>
      <button class="calc-buy-btn" onclick="waOpen('📦 ${waDetails}\\n💰 الإجمالي: ${fmt(totalSpent)}')">
        🛒 اشترِ هذه التشكيلة
      </button>
    </div>`;
}

// ════════════════════════════════════════
// ⏳ COUNTDOWN TIMER (20 days from now)
// ════════════════════════════════════════
(function initTimer() {
  // احفظ تاريخ انتهاء العرض في localStorage حتى لا يتغير عند كل تحميل
  const storageKey = "hitlerstore_offer_end";
  let endTime = localStorage.getItem(storageKey);

  if (!endTime) {
    // 20 يوم من الآن
    endTime = Date.now() + 20 * 24 * 60 * 60 * 1000;
    localStorage.setItem(storageKey, endTime);
  } else {
    endTime = parseInt(endTime);
  }

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const diff = endTime - Date.now();
    if (diff <= 0) {
      document.getElementById("tDays").textContent  = "00";
      document.getElementById("tHours").textContent = "00";
      document.getElementById("tMins").textContent  = "00";
      document.getElementById("tSecs").textContent  = "00";
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById("tDays").textContent  = pad(d);
    document.getElementById("tHours").textContent = pad(h);
    document.getElementById("tMins").textContent  = pad(m);
    document.getElementById("tSecs").textContent  = pad(s);
  }

  tick();
  setInterval(tick, 1000);
})();

// ════════════════════════════════════════
// 🎮 RENDER — UC PACKAGES
// ════════════════════════════════════════
function renderUC() {
  const grid = document.getElementById("ucGrid");
  if (!grid) return;
  const bdgMap = {
    "الأكثر مبيعاً":"bdg-pop","VIP":"bdg-vip","جديد":"bdg-new","خصم":"bdg-sale"
  };
  grid.innerHTML = DATA.uc.map((p,i) => {
    const bdg = p.badge
      ? `<div class="pkg-bdg ${bdgMap[p.badge]||""}">${p.badge}</div>` : "";
    return `
    <div class="pkg-card${p.hot?" hot":""} reveal" style="transition-delay:${i*.055}s">
      ${bdg}
      <div class="pkg-top">
        <span class="pkg-emoji">${p.icon}</span>
        <div class="pkg-uc-row">
          <img class="uc-logo"
            src="https://img.icons8.com/fluency/48/coin.png"
            alt="UC" onerror="this.style.display='none'"/>
          <span class="pkg-uc-num">${p.uc.toLocaleString()}</span>
          <span class="pkg-uc-tag">UC</span>
        </div>
      </div>
      <div class="qty-wrap">
        <button class="qty-btn" onclick="chQty('q${p.id}','pr${p.id}',-1,${p.egp})">−</button>
        <input  class="qty-inp" id="q${p.id}" type="number" value="1" min="1" max="99"
          oninput="updPr('q${p.id}','pr${p.id}',${p.egp})"/>
        <button class="qty-btn" onclick="chQty('q${p.id}','pr${p.id}',1,${p.egp})">+</button>
      </div>
      <div class="pkg-price-box">
        <span class="pkg-price" id="pr${p.id}">${fmt(p.egp)}</span>
        <div class="pkg-price-note">السعر الإجمالي حسب الكمية</div>
      </div>
      <button class="btn-buy" onclick="buyUC('${p.uc} UC',${p.egp},'q${p.id}')">
        <span>🛒 اشترِ على واتساب</span>
      </button>
    </div>`;
  }).join("");
}

function chQty(qid, pid, d, base) {
  const inp = document.getElementById(qid);
  if (!inp) return;
  inp.value = Math.max(1, Math.min(99, (+inp.value||1) + d));
  updPr(qid, pid, base);
}
function updPr(qid, pid, base) {
  const el = document.getElementById(pid);
  const q  = document.getElementById(qid);
  if (el && q) el.textContent = fmt(Math.max(1,+q.value||1) * base);
}
function buyUC(name, base, qid) {
  const qty = Math.max(1, +document.getElementById(qid)?.value||1);
  waOpen(`📦 ${name}\n🔢 الكمية: ${qty}\n💰 الإجمالي: ${fmt(qty*base)}`);
}

// ════════════════════════════════════════
// 🌸 RENDER — PROSPERITY
// ════════════════════════════════════════
function renderPros() {
  const grid = document.getElementById("prosGrid");
  if (!grid) return;
  grid.innerHTML = DATA.pros.map((p,i) => {
    const bdg = p.badge
      ? `<div class="pkg-bdg bdg-pop" style="position:absolute;top:13px;left:13px">${p.badge}</div>` : "";
    return `
    <div class="pros-card reveal" style="transition-delay:${i*.07}s">
      <div class="pros-bg-num">${String(i+1).padStart(2,"0")}</div>
      ${bdg}
      <div class="pros-icon">${p.icon}</div>
      <div class="pros-name">${p.name}</div>
      <div class="pros-price" id="ppr${p.id}">${fmt(p.egp)}</div>
      <div class="pros-price-sub">للشخص الواحد</div>
      <button class="btn-buy-pros" onclick="waOpen('📦 ${p.name}\\n💰 ${fmt(p.egp)}')">
        🛒 اشترِ الآن
      </button>
    </div>`;
  }).join("");
}

// ════════════════════════════════════════
// 👑 RENDER — MEMBERSHIPS
// ════════════════════════════════════════
function renderMem() {
  const grid = document.getElementById("memGrid");
  if (!grid) return;
  grid.innerHTML = DATA.mem.map((m,i) => `
    <div class="mem-card${m.prime?" prime":""} reveal" style="transition-delay:${i*.1}s">
      <span class="mem-icon">${m.icon}</span>
      <div class="mem-name">${m.name}</div>
      <div class="mem-price-wrap">
        <span class="mem-price" id="mpr${m.id}">${fmt(m.egp)}</span>
        <div class="mem-period">/ شهر</div>
      </div>
      <ul class="mem-feats">
        ${m.feats.map(f=>`<li class="mem-feat">${f}</li>`).join("")}
      </ul>
      <button class="btn-buy-mem" onclick="waOpen('📦 عضوية ${m.name}\\n💰 ${fmt(m.egp)} / شهر')">
        👑 اشترك الآن
      </button>
    </div>`).join("");
}

// ════════════════════════════════════════
// 📋 RENDER — STEPS
// ════════════════════════════════════════
function renderSteps() {
  const grid = document.getElementById("stepsGrid");
  if (!grid) return;
  grid.innerHTML = DATA.steps.map((s,i) => `
    <div class="step reveal" style="transition-delay:${i*.06}s">
      <div class="step-bg-num">${s.num}</div>
      <div class="step-icon">${s.icon}</div>
      <div class="step-badge">${s.num}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </div>`).join("");
}

// ════════════════════════════════════════
// 🛒 SPECIAL OFFER BUY
// ════════════════════════════════════════
function buySpecial() {
  waOpen("📦 عرض شحن السيزون (QR Code)\n💰 السعر: 150 جنيه فقط\n⚠️ ملاحظة: الحساب سيكون مغلقاً لمدة أسبوع");
}

// ════════════════════════════════════════
// 📲 WHATSAPP HELPER
// ════════════════════════════════════════
function waOpen(details) {
  const msg = `مرحباً 👋\nأريد شراء:\n${details}\n\nID اللاعب: [أكتب هنا]\nاسم اللعبة: [اسمك]\n\n📦 متجر هتلر`;
  window.open(`https://wa.me/${CFG.wa}?text=${encodeURIComponent(msg)}`, "_blank");
}

// ════════════════════════════════════════
// 👁️ INTERSECTION OBSERVER
// ════════════════════════════════════════
function initObserver() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}

// ════════════════════════════════════════
// 🔔 FAKE PURCHASE POPUPS
// ════════════════════════════════════════
function initPopups() {
  const container = document.getElementById("live-pop");
  if (!container) return;
  const purchases = [
    "660 UC — 450 جنيه","325 UC — 240 جنيه","PRIME المميزة — 485 جنيه",
    "1845 UC — 1200 جنيه","عرض الازدهار الثاني","8100 UC — 4450 جنيه",
    "عرض شحن السيزون — 150 جنيه","60 UC — 55 جنيه","PRIME العادية — 55 جنيه",
  ];
  const emojis = ["😊","👍","✅","🎮","⚡","🔥","💪","🏆"];
  const times  = ["للتو","منذ دقيقة","منذ دقيقتين","منذ 3 دقائق"];
  let busy = false;

  function show() {
    if (busy) return; busy = true;
    const name  = DATA.names[Math.random()*DATA.names.length|0];
    const item  = purchases[Math.random()*purchases.length|0];
    const em    = emojis[Math.random()*emojis.length|0];
    const time  = times[Math.random()*times.length|0];
    const div   = document.createElement("div");
    div.className = "pop-item";
    div.innerHTML = `
      <div class="pop-av">${em}</div>
      <div class="pop-text">
        <strong>${name}</strong>
        <span>اشترى ${item} • ${time}</span>
      </div>`;
    container.appendChild(div);
    setTimeout(() => { div.remove(); busy = false; }, 5200);
  }

  setTimeout(() => { show(); setInterval(show, Math.random()*6000+9000); }, 4000);
}

// ════════════════════════════════════════
// 🚀 INIT
// ════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  renderUC();
  renderPros();
  renderMem();
  renderSteps();
  setTimeout(initObserver, 180);
  initPopups();
});
