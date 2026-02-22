/**
 * متجر هتلر — app.js
 * ══════════════════════════════════════════════
 * لتغيير رقم الواتساب: عدّل CFG.wa بالأسفل
 * لتغيير سعر الصرف:   عدّل CFG.rate
 * لتغيير الأسعار:     عدّل DATA.uc أو DATA.pros أو DATA.mem
 * ══════════════════════════════════════════════
 */

// ════════════════════════════════════════════
// ⚙️  CONFIG — عدّل هنا
// ════════════════════════════════════════════
const CFG = {
  wa:   "201278443292",  // ← رقم الواتساب (بدون + أو مسافات)
  rate: 50,              // ← سعر الصرف: 1 دولار = كم جنيه
  cur:  "EGP",          // العملة الحالية (لا تغيّر هنا)
};

// ════════════════════════════════════════════
// 📦  DATA — الباقات والأسعار
// ════════════════════════════════════════════
const DATA = {

  // باقات UC
  uc: [
    { id:1, uc:60,   egp:55,   badge:"",            hot:false, icon:"💠" },
    { id:2, uc:325,  egp:240,  badge:"",            hot:false, icon:"💎" },
    { id:3, uc:385,  egp:290,  badge:"جديد",        hot:false, icon:"⭐" },
    { id:4, uc:660,  egp:450,  badge:"",            hot:true,  icon:"🔥" },
    { id:5, uc:1845, egp:1200, badge:"الأكثر مبيعاً", hot:true, icon:"🏆" },
    { id:6, uc:3940, egp:2300, badge:"خصم",         hot:false, icon:"💰" },
    { id:7, uc:8100, egp:4450, badge:"VIP",         hot:false, icon:"👑" },
  ],

  // عروض الازدهار
  pros: [
    { id:1, name:"عرض الازدهار الأول",   egp:60,  badge:"",      icon:"🌸" },
    { id:2, name:"عرض الازدهار الثاني",  egp:150, badge:"شعبي",  icon:"🌺" },
    { id:3, name:"عرض الازدهار الثالث",  egp:240, badge:"",      icon:"🌹" },
  ],

  // العضويات
  mem: [
    {
      id:1, name:"PRIME العادية", egp:55, prime:false, icon:"⭐",
      feats:["مكافآت يومية", "تجربة حصرية", "مكافأة الولاء"]
    },
    {
      id:2, name:"PRIME المميزة", egp:485, prime:true, icon:"👑",
      feats:["كل مميزات العادية", "مكافآت إضافية", "أولوية الدعم", "عناصر حصرية"]
    },
  ],

  // خطوات الشراء
  steps: [
    { icon:"🛒", num:"01", title:"اختر باقتك",   desc:"اختر الباقة المناسبة من UC أو العروض أو العضويات" },
    { icon:"📱", num:"02", title:"واتساب فوري",   desc:"اضغط اشتري وسيفتح واتساب برسالة جاهزة تلقائياً" },
    { icon:"💳", num:"03", title:"ادفع بأمان",    desc:"أرسل ID حسابك وادفع بأي طريقة تناسبك" },
    { icon:"⚡", num:"04", title:"استلم فوراً",   desc:"شدتك تُشحن فورياً على حسابك بعد التأكيد" },
  ],

  // أسماء لـ popups
  names: [
    "أحمد من القاهرة","محمد من الإسكندرية","علي من الجيزة",
    "يوسف من المنصورة","عمر من الإسماعيلية","خالد من أسيوط",
    "مصطفى من سوهاج","سامي من المنيا","كريم من دمياط","ياسر من الفيوم",
  ],
};

// ════════════════════════════════════════════
// 🔄  LOADER
// ════════════════════════════════════════════
(function initLoader() {
  const pctEl  = document.getElementById("ldPct");
  const fillEl = document.getElementById("ldFill");
  let pct = 0;

  const iv = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) { pct = 100; clearInterval(iv); }
    if (pctEl)  pctEl.textContent  = Math.floor(pct) + "%";
    if (fillEl) fillEl.style.width = pct + "%";
  }, 100);

  // إخفاء الـ loader بعد 1.9 ثانية مهما حدث
  setTimeout(() => {
    document.getElementById("loader")?.classList.add("out");
  }, 1900);
})();

// ════════════════════════════════════════════
// 🖱️  CUSTOM CURSOR
// ════════════════════════════════════════════
(function initCursor() {
  const dot  = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";
  });

  // Smooth ring follow
  (function animRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    requestAnimationFrame(animRing);
  })();

  // Hover effect on interactive elements
  document.addEventListener("mouseover", e => {
    if (e.target.closest("a, button, .pkg-card, .pros-card, .mem-card")) {
      dot.classList.add("big");
      ring.classList.add("big");
    }
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest("a, button, .pkg-card, .pros-card, .mem-card")) {
      dot.classList.remove("big");
      ring.classList.remove("big");
    }
  });
})();

// ════════════════════════════════════════════
// 📌  HEADER SCROLL
// ════════════════════════════════════════════
window.addEventListener("scroll", () => {
  document.getElementById("hdr")?.classList.toggle("stuck", scrollY > 60);
}, { passive: true });

// ════════════════════════════════════════════
// 📱  MOBILE MENU
// ════════════════════════════════════════════
document.getElementById("burger")?.addEventListener("click", () => {
  const nav    = document.getElementById("mobNav");
  const burger = document.getElementById("burger");
  nav?.classList.toggle("open");
  if (burger) burger.textContent = nav?.classList.contains("open") ? "✕" : "☰";
});

function closeMob() {
  document.getElementById("mobNav")?.classList.remove("open");
  const burger = document.getElementById("burger");
  if (burger) burger.textContent = "☰";
}

// ════════════════════════════════════════════
// 💱  CURRENCY TOGGLE
// ════════════════════════════════════════════
document.getElementById("curBtn")?.addEventListener("click", () => {
  CFG.cur = CFG.cur === "EGP" ? "USD" : "EGP";
  document.getElementById("curLabel").textContent = CFG.cur;
  refreshAllPrices();
});

function fmt(egp) {
  return CFG.cur === "USD"
    ? `$${(egp / CFG.rate).toFixed(2)}`
    : `${egp.toLocaleString("ar-EG")} جنيه`;
}

function refreshAllPrices() {
  // UC prices (respecting quantity)
  DATA.uc.forEach(p => {
    const prEl = document.getElementById(`pr${p.id}`);
    const qEl  = document.getElementById(`q${p.id}`);
    if (prEl) {
      const qty = qEl ? Math.max(1, +qEl.value || 1) : 1;
      prEl.textContent = fmt(qty * p.egp);
    }
  });
  // Prosperity prices
  DATA.pros.forEach(p => {
    const el = document.getElementById(`ppr${p.id}`);
    if (el) el.textContent = fmt(p.egp);
  });
  // Membership prices
  DATA.mem.forEach(m => {
    const el = document.getElementById(`mpr${m.id}`);
    if (el) el.textContent = fmt(m.egp);
  });
}

// ════════════════════════════════════════════
// 🎮  RENDER — UC PACKAGES
// ════════════════════════════════════════════
function renderUC() {
  const grid = document.getElementById("ucGrid");
  if (!grid) return;

  grid.innerHTML = DATA.uc.map((p, i) => {
    const bdgClass = {
      "الأكثر مبيعاً": "bdg-popular",
      "VIP":           "bdg-vip",
      "جديد":          "bdg-new",
      "خصم":           "bdg-sale",
    }[p.badge] || "";

    const bdgHTML = p.badge
      ? `<div class="pkg-bdg ${bdgClass}">${p.badge}</div>` : "";

    return `
      <div class="pkg-card${p.hot ? " hot" : ""} reveal" style="transition-delay:${i * 0.055}s">
        ${bdgHTML}
        <div class="pkg-top">
          <span class="pkg-emoji">${p.icon}</span>
          <div class="pkg-uc-row">
            <img class="uc-icon"
              src="https://img.icons8.com/fluency/48/coin.png"
              alt="UC"
              onerror="this.style.display='none'" />
            <span class="pkg-uc-num">${p.uc.toLocaleString()}</span>
            <span class="pkg-uc-tag">UC</span>
          </div>
        </div>

        <div class="qty-wrap">
          <button class="qty-btn" onclick="chQty('q${p.id}','pr${p.id}',-1,${p.egp})">−</button>
          <input  class="qty-inp" id="q${p.id}" type="number" value="1" min="1" max="99"
            oninput="updPr('q${p.id}','pr${p.id}',${p.egp})" />
          <button class="qty-btn" onclick="chQty('q${p.id}','pr${p.id}',1,${p.egp})">+</button>
        </div>

        <div class="pkg-price-box">
          <span class="pkg-price" id="pr${p.id}" data-base="${p.egp}">${fmt(p.egp)}</span>
          <div class="pkg-price-note">السعر الإجمالي حسب الكمية</div>
        </div>

        <button class="btn-buy" onclick="buyUC('${p.uc} UC',${p.egp},'q${p.id}')">
          <span>🛒 اشتري على واتساب</span>
        </button>
      </div>`;
  }).join("");
}

// Quantity helpers
function chQty(qid, pid, delta, base) {
  const inp = document.getElementById(qid);
  if (!inp) return;
  inp.value = Math.max(1, Math.min(99, (+inp.value || 1) + delta));
  updPr(qid, pid, base);
}
function updPr(qid, pid, base) {
  const el  = document.getElementById(pid);
  const inp = document.getElementById(qid);
  if (!el || !inp) return;
  el.textContent = fmt(Math.max(1, +inp.value || 1) * base);
}

// WhatsApp message for UC
function buyUC(name, base, qid) {
  const qty   = Math.max(1, +document.getElementById(qid)?.value || 1);
  const total = qty * base;
  const msg   = `مرحباً 👋\nأريد شراء:\n📦 الباقة: ${name}\n🔢 الكمية: ${qty}\n💰 الإجمالي: ${fmt(total)}\n\nID اللاعب: [أكتب هنا]\nاسم اللعبة: [اسمك]\n\n📦 متجر هتلر`;
  window.open(`https://wa.me/${CFG.wa}?text=${encodeURIComponent(msg)}`, "_blank");
}

// ════════════════════════════════════════════
// 🌸  RENDER — PROSPERITY
// ════════════════════════════════════════════
function renderPros() {
  const grid = document.getElementById("prosGrid");
  if (!grid) return;

  grid.innerHTML = DATA.pros.map((p, i) => {
    const bdg = p.badge
      ? `<div class="pkg-bdg bdg-popular" style="position:absolute;top:14px;left:14px">${p.badge}</div>` : "";
    return `
      <div class="pros-card reveal" style="transition-delay:${i * 0.07}s">
        <div class="pros-bg-num">${String(i + 1).padStart(2, "0")}</div>
        ${bdg}
        <div class="pros-icon">${p.icon}</div>
        <div class="pros-name">${p.name}</div>
        <div class="pros-price" id="ppr${p.id}">${fmt(p.egp)}</div>
        <div class="pros-price-sub">للشخص الواحد</div>
        <button class="btn-buy-pros" onclick="buySimple('${p.name}',${p.egp})">
          🛒 اشتري الآن
        </button>
      </div>`;
  }).join("");
}

// ════════════════════════════════════════════
// 👑  RENDER — MEMBERSHIPS
// ════════════════════════════════════════════
function renderMem() {
  const grid = document.getElementById("memGrid");
  if (!grid) return;

  grid.innerHTML = DATA.mem.map((m, i) => {
    const featsHTML = m.feats.map(f => `<li class="mem-feat">${f}</li>`).join("");
    return `
      <div class="mem-card${m.prime ? " prime" : ""} reveal" style="transition-delay:${i * 0.1}s">
        <span class="mem-icon">${m.icon}</span>
        <div class="mem-name">${m.name}</div>
        <div class="mem-price-wrap">
          <span class="mem-price" id="mpr${m.id}">${fmt(m.egp)}</span>
          <div class="mem-period">/ شهر</div>
        </div>
        <ul class="mem-feats">${featsHTML}</ul>
        <button class="btn-buy-mem" onclick="buySimple('عضوية ${m.name}',${m.egp})">
          👑 اشترك الآن
        </button>
      </div>`;
  }).join("");
}

// ════════════════════════════════════════════
// 📋  RENDER — STEPS
// ════════════════════════════════════════════
function renderSteps() {
  const grid = document.getElementById("stepsGrid");
  if (!grid) return;

  grid.innerHTML = DATA.steps.map((s, i) => `
    <div class="step reveal" style="transition-delay:${i * 0.06}s">
      <div class="step-bg-num">${s.num}</div>
      <div class="step-icon">${s.icon}</div>
      <div class="step-badge">${s.num}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </div>`).join("");
}

// Generic WhatsApp buy (for pros & memberships)
function buySimple(name, egp) {
  const msg = `مرحباً 👋\nأريد شراء:\n📦 ${name}\n💰 السعر: ${fmt(egp)}\n\nID اللاعب: [أكتب هنا]\nاسم اللعبة: [اسمك]\n\n📦 متجر هتلر`;
  window.open(`https://wa.me/${CFG.wa}?text=${encodeURIComponent(msg)}`, "_blank");
}

// ════════════════════════════════════════════
// 👁️  INTERSECTION OBSERVER (scroll reveal)
// ════════════════════════════════════════════
function initObserver() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}

// ════════════════════════════════════════════
// 🔔  LIVE PURCHASE POPUPS (social proof)
// ════════════════════════════════════════════
function initPopups() {
  const container = document.getElementById("live-pop");
  if (!container) return;

  const purchases = [
    "660 UC — 450 جنيه",
    "325 UC — 240 جنيه",
    "PRIME المميزة — 485 جنيه",
    "1845 UC — 1200 جنيه",
    "عرض الازدهار الثاني — 150 جنيه",
    "8100 UC — 4450 جنيه",
    "60 UC — 55 جنيه",
    "PRIME العادية — 55 جنيه",
    "عرض الازدهار الأول — 60 جنيه",
    "3940 UC — 2300 جنيه",
  ];
  const emojis = ["😊","👍","✅","🎮","⚡","🔥","💪","🏆"];
  const times  = ["للتو","منذ دقيقة","منذ دقيقتين","منذ 3 دقائق"];
  let busy = false;

  function showPop() {
    if (busy) return;
    busy = true;

    const name = DATA.names[Math.random() * DATA.names.length | 0];
    const item = purchases[Math.random() * purchases.length | 0];
    const em   = emojis[Math.random() * emojis.length | 0];
    const time = times[Math.random() * times.length | 0];

    const div = document.createElement("div");
    div.className = "pop-item";
    div.innerHTML = `
      <div class="pop-av">${em}</div>
      <div class="pop-text">
        <strong>${name}</strong>
        <span>اشترى ${item} • ${time}</span>
      </div>`;

    container.appendChild(div);
    setTimeout(() => { div.remove(); busy = false; }, 5000);
  }

  // أول popup بعد 3.5 ثانية ثم كل 8-14 ثانية
  setTimeout(() => {
    showPop();
    setInterval(showPop, Math.random() * 6000 + 8000);
  }, 3500);
}

// ════════════════════════════════════════════
// 🚀  INIT
// ════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  renderUC();
  renderPros();
  renderMem();
  renderSteps();

  // Observer بعد render
  setTimeout(initObserver, 150);

  initPopups();
});
