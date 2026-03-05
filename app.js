/**
 * متجر هتلر — app.js  v5
 * ══════════════════════════════════════════════
 *  لتغيير رقم الواتساب  → عدّل CFG.wa
 *  لتغيير سعر الصرف     → عدّل CFG.rate
 *  لتغيير الأسعار       → عدّل data.json
 * ══════════════════════════════════════════════
 */

// ═══════════════════════════════════
// ⚙️ CONFIG
// ═══════════════════════════════════
const CFG = {
  wa:   "201270139747",
  rate: 50,
  cur:  "EGP",
};

// ═══════════════════════════════════
// 📦 DATA — يُحمَّل من data.json
// ═══════════════════════════════════
let GAMES = [];
let STEPS = [];
let POPUPS = {};

async function loadData() {
  try {
    const res = await fetch("data.json");
    const d   = await res.json();
    CFG.wa    = d.store.whatsapp;
    CFG.rate  = d.store.usd_rate;
    GAMES     = d.games;
    STEPS     = d.steps;
    POPUPS    = d.popups;
  } catch(e) {
    console.warn("data.json not loaded, using fallback", e);
    // ── FALLBACK DATA ──
    GAMES = [
      {
        id:"pubg", label:"PUBG Mobile", emoji:"🎯", currency:"UC", currency_label:"شدة",
        packages:[
          {id:1,amount:60,  price_egp:55,  badge:"",              hot:false},
          {id:2,amount:325, price_egp:240, badge:"",              hot:false},
          {id:3,amount:385, price_egp:290, badge:"جديد",          hot:false},
          {id:4,amount:660, price_egp:450, badge:"",              hot:true},
          {id:5,amount:1845,price_egp:1200,badge:"الأكثر مبيعاً", hot:true},
          {id:6,amount:3940,price_egp:2300,badge:"خصم",           hot:false},
          {id:7,amount:8280,price_egp:4450,badge:"VIP",           hot:false},
        ],
        prosperity:[
          {id:"p1",name:"عرض الازدهار الأول",  price_egp:60, icon:"🌸"},
          {id:"p2",name:"عرض الازدهار الثاني", price_egp:150,icon:"🌺",badge:"شعبي"},
          {id:"p3",name:"عرض الازدهار الثالث", price_egp:240,icon:"🌹"},
        ],
        memberships:[
          {id:"m1",name:"PRIME العادية",price_egp:55, prime:false,icon:"⭐",features:["مكافآت يومية","تجربة حصرية","مكافأة الولاء"]},
          {id:"m2",name:"PRIME المميزة",price_egp:485,prime:true, icon:"👑",features:["كل مميزات العادية","مكافآت إضافية","أولوية الدعم","عناصر حصرية"]},
        ]
      },
      {
        id:"freefire",label:"Free Fire",emoji:"🔥",currency:"جوهرة",currency_label:"جوهرة",
        packages:[
          {id:1,amount:110, price_egp:60, badge:"",hot:false},
          {id:2,amount:231, price_egp:110,badge:"",hot:false},
          {id:3,amount:583, price_egp:245,badge:"الأكثر مبيعاً",hot:true},
          {id:4,amount:1088,price_egp:490,badge:"",hot:false},
          {id:5,amount:2420,price_egp:950,badge:"VIP",hot:false},
        ]
      },
      {
        id:"efootball",label:"eFootball Mobile",emoji:"⚽",currency:"Coin",currency_label:"Coin",
        charge_note:"الشحن عبر Konami ID",
        special:{name:"باتيستوتا — عرض خاص",price_egp:50,days:154},
        packages:[
          {id:1, amount:137,  price_egp:80,   badge:"",hot:false},
          {id:2, amount:315,  price_egp:170,  badge:"",hot:false},
          {id:3, amount:578,  price_egp:280,  badge:"",hot:false},
          {id:4, amount:788,  price_egp:370,  badge:"الأكثر مبيعاً",hot:true},
          {id:5, amount:1092, price_egp:500,  badge:"",hot:false},
          {id:6, amount:2237, price_egp:1000, badge:"",hot:false},
          {id:7, amount:3413, price_egp:1450, badge:"",hot:false},
          {id:8, amount:5985, price_egp:2450, badge:"",hot:false},
          {id:9, amount:13440,price_egp:5200, badge:"",hot:false},
          {id:10,amount:32200,price_egp:12300,badge:"VIP",hot:false},
        ]
      }
    ];
    STEPS = [
      {num:"01",icon:"🎮",title:"اختر لعبتك",  desc:"اختر اللعبة والباقة المناسبة من التبويبات"},
      {num:"02",icon:"📱",title:"واتساب فوري",  desc:"اضغط اشترِ وهيفتح واتساب برسالة جاهزة تلقائياً"},
      {num:"03",icon:"💳",title:"ادفع بأمان",   desc:"أرسل ID حسابك وادفع بأي طريقة تناسبك"},
      {num:"04",icon:"⚡",title:"استلم فوراً",  desc:"تُشحن العملات فورياً على حسابك بعد التأكيد"},
    ];
    POPUPS = {
      names:["أحمد من القاهرة","محمد من الإسكندرية","علي من الجيزة","يوسف من المنصورة"],
      purchases:["660 UC — 450 جنيه","583 جوهرة — 245 جنيه","788 Coin — 370 جنيه","PRIME المميزة — 485 جنيه"]
    };
  }
}

// ═══════════════════════════════════
// 💱 FORMAT PRICE
// ═══════════════════════════════════
function fmt(egp) {
  return CFG.cur === "USD"
    ? `$${(egp / CFG.rate).toFixed(2)}`
    : `${egp.toLocaleString("ar-EG")} جنيه`;
}

// ═══════════════════════════════════
// 🎯 GAME ICON — SVG للشدات أو emoji
// ═══════════════════════════════════
function gameIcon(gameId, size = 36) {
  if (gameId === "pubg") {
    // شكل نجمة يشبه شكل شدات ببجي
    return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#C9A84C" opacity="0.15"/>
      <polygon points="24,6 29,19 43,19 32,28 36,41 24,32 12,41 16,28 5,19 19,19" fill="#C9A84C"/>
    </svg>`;
  }
  if (gameId === "freefire") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22" fill="#ff6b35" opacity="0.15"/>
      <text x="24" y="32" text-anchor="middle" font-size="24">💎</text>
    </svg>`;
  }
  // efootball
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill="#22c55e" opacity="0.15"/>
    <text x="24" y="32" text-anchor="middle" font-size="22">🪙</text>
  </svg>`;
}

// ═══════════════════════════════════
// 🎮 GAME TABS
// ═══════════════════════════════════
let activeGame = "pubg";

function switchGame(gameId, btn) {
  activeGame = gameId;
  // Update tab buttons
  document.querySelectorAll(".gtab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  // Show/hide panels
  document.querySelectorAll(".game-panel").forEach(p => p.classList.add("hidden"));
  document.getElementById("panel-" + gameId)?.classList.remove("hidden");
  // Update calculator game too
  document.querySelectorAll(".cgs").forEach(b => {
    b.classList.toggle("active", b.dataset.cg === gameId);
  });
  calcGame = gameId;
  clearCalcResults();
  updateCalcLabels();
}

// ═══════════════════════════════════
// 🛒 BUY BUTTON HELPER
// ═══════════════════════════════════
function waOpen(details) {
  const msg = `مرحباً 👋\nأريد شراء:\n${details}\n\nID اللاعب: [أكتب هنا]\n\n📦 متجر هتلر`;
  window.open(`https://wa.me/${CFG.wa}?text=${encodeURIComponent(msg)}`, "_blank");
}

// badge class map
const BADGE_MAP = {
  "الأكثر مبيعاً":"bdg-pop","VIP":"bdg-vip","جديد":"bdg-new","خصم":"bdg-sale","شعبي":"bdg-pop"
};

// ═══════════════════════════════════
// 🎮 RENDER UC PACKAGES (shared)
// ═══════════════════════════════════
function renderPackages(containerId, game) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  const isPubg = game.id === "pubg";
  const isFF   = game.id === "freefire";
  const isEF   = game.id === "efootball";

  const accentColor = isPubg ? "#C9A84C" : isFF ? "#ff6b35" : "#22c55e";

  grid.innerHTML = game.packages.map((p, i) => {
    const bdg = p.badge
      ? `<div class="pkg-bdg ${BADGE_MAP[p.badge]||""}">${p.badge}</div>` : "";

    // Icon for the package
    let iconHTML = "";
    if (isPubg) {
      // شدة ببجي SVG مصغّرة
      iconHTML = `<svg class="pkg-uc-icon" width="38" height="38" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" fill="#C9A84C" opacity="0.1"/>
        <polygon points="24,8 28,20 40,20 30,28 34,40 24,32 14,40 18,28 8,20 20,20" fill="#C9A84C"/>
      </svg>`;
    } else if (isFF) {
      iconHTML = `<span class="pkg-emoji" style="font-size:2rem">💎</span>`;
    } else {
      iconHTML = `<span class="pkg-emoji" style="font-size:2rem">🪙</span>`;
    }

    const unitLabel = game.currency;
    const pkgKey    = `${game.id}-${p.id}`;

    return `
    <div class="pkg-card${p.hot ? " hot" : ""} reveal" style="transition-delay:${i * .05}s;--accent:${accentColor}">
      ${bdg}
      <div class="pkg-top">
        ${iconHTML}
        <div class="pkg-uc-row">
          <span class="pkg-uc-num">${p.amount.toLocaleString()}</span>
          <span class="pkg-uc-tag">${unitLabel}</span>
        </div>
      </div>
      <div class="qty-wrap">
        <button class="qty-btn" onclick="chQty('q${pkgKey}','pr${pkgKey}',-1,${p.price_egp})">−</button>
        <input  class="qty-inp" id="q${pkgKey}" type="number" value="1" min="1" max="99"
          oninput="updPr('q${pkgKey}','pr${pkgKey}',${p.price_egp})"/>
        <button class="qty-btn" onclick="chQty('q${pkgKey}','pr${pkgKey}',1,${p.price_egp})">+</button>
      </div>
      <div class="pkg-price-box">
        <span class="pkg-price" id="pr${pkgKey}">${fmt(p.price_egp)}</span>
        <div class="pkg-price-note">السعر حسب الكمية</div>
      </div>
      <button class="btn-buy" onclick="buyPkg('${p.amount} ${unitLabel}','${game.label}',${p.price_egp},'q${pkgKey}')">
        🛒 اشترِ على واتساب
      </button>
    </div>`;
  }).join("");
}

function chQty(qid, pid, d, base) {
  const inp = document.getElementById(qid);
  if (!inp) return;
  inp.value = Math.max(1, Math.min(99, (+inp.value || 1) + d));
  updPr(qid, pid, base);
}
function updPr(qid, pid, base) {
  const el = document.getElementById(pid);
  const q  = document.getElementById(qid);
  if (el && q) el.textContent = fmt(Math.max(1, +q.value || 1) * base);
}
function buyPkg(amount, gameName, base, qid) {
  const qty = Math.max(1, +document.getElementById(qid)?.value || 1);
  waOpen(`🎮 اللعبة: ${gameName}\n📦 الباقة: ${amount}\n🔢 الكمية: ${qty}\n💰 الإجمالي: ${fmt(qty * base)}`);
}

// ═══════════════════════════════════
// 🌸 RENDER PROSPERITY
// ═══════════════════════════════════
function renderPros(containerId, pros) {
  const grid = document.getElementById(containerId);
  if (!grid || !pros) return;
  grid.innerHTML = pros.map((p, i) => {
    const bdg = p.badge
      ? `<div class="pkg-bdg bdg-pop" style="position:absolute;top:13px;left:13px">${p.badge}</div>` : "";
    return `
    <div class="pros-card reveal" style="transition-delay:${i * .07}s">
      <div class="pros-bg-num">${String(i + 1).padStart(2, "0")}</div>
      ${bdg}
      <div class="pros-icon">${p.icon}</div>
      <div class="pros-name">${p.name}</div>
      <div class="pros-price" id="ppr${p.id}">${fmt(p.price_egp)}</div>
      <div class="pros-price-sub">للشخص الواحد</div>
      <button class="btn-buy-pros" onclick="waOpen('📦 ${p.name}\\n💰 ${fmt(p.price_egp)}')">
        🛒 اشترِ الآن
      </button>
    </div>`;
  }).join("");
}

// ═══════════════════════════════════
// 👑 RENDER MEMBERSHIPS
// ═══════════════════════════════════
function renderMem(containerId, mems) {
  const grid = document.getElementById(containerId);
  if (!grid || !mems) return;
  grid.innerHTML = mems.map((m, i) => `
    <div class="mem-card${m.prime ? " prime" : ""} reveal" style="transition-delay:${i * .1}s">
      <span class="mem-icon">${m.icon}</span>
      <div class="mem-name">${m.name}</div>
      <div class="mem-price-wrap">
        <span class="mem-price" id="mpr${m.id}">${fmt(m.price_egp)}</span>
        <div class="mem-period">/ شهر</div>
      </div>
      <ul class="mem-feats">
        ${m.features.map(f => `<li class="mem-feat">${f}</li>`).join("")}
      </ul>
      <button class="btn-buy-mem" onclick="waOpen('📦 عضوية ${m.name}\\n💰 ${fmt(m.price_egp)} / شهر')">
        👑 اشترك الآن
      </button>
    </div>`).join("");
}

// ═══════════════════════════════════
// ⚽ RENDER EFOOTBALL SPECIAL
// ═══════════════════════════════════
function renderEFSpecial(special) {
  const wrap = document.getElementById("ef-special-wrap");
  if (!wrap || !special) return;
  wrap.innerHTML = `
    <div class="panel-sec-head">
      <div class="panel-sec-title">⭐ عرض خاص محدود</div>
    </div>
    <div class="ef-special-card reveal">
      <div class="ef-special-badge">⏰ متوفر حتى ${special.days} يوم</div>
      <div class="ef-special-body">
        <div class="ef-special-icon">⚽</div>
        <div class="ef-special-info">
          <div class="ef-special-name">${special.name}</div>
          <div class="ef-special-sub">Konami ID · شحن فوري</div>
        </div>
        <div class="ef-special-price" id="ef-sp-price">${fmt(special.price_egp)}</div>
        <button class="btn-buy ef-buy-btn" onclick="waOpen('📦 ${special.name}\\n💰 ${fmt(special.price_egp)}')">
          🛒 اشترِ الآن
        </button>
      </div>
    </div>`;
}

// ═══════════════════════════════════
// 📋 RENDER STEPS
// ═══════════════════════════════════
function renderSteps() {
  const grid = document.getElementById("stepsGrid");
  if (!grid) return;
  grid.innerHTML = STEPS.map((s, i) => `
    <div class="step reveal" style="transition-delay:${i * .06}s">
      <div class="step-bg-num">${s.num}</div>
      <div class="step-icon">${s.icon}</div>
      <div class="step-badge">${s.num}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </div>`).join("");
}

// ═══════════════════════════════════
// 💱 REFRESH ALL PRICES
// ═══════════════════════════════════
function refreshPrices() {
  // pkg prices
  GAMES.forEach(game => {
    game.packages.forEach(p => {
      const key = `${game.id}-${p.id}`;
      const prEl = document.getElementById("pr" + key);
      const qEl  = document.getElementById("q" + key);
      if (prEl && qEl) prEl.textContent = fmt(Math.max(1, +qEl.value || 1) * p.price_egp);
    });
    if (game.prosperity) game.prosperity.forEach(p => {
      const el = document.getElementById("ppr" + p.id);
      if (el) el.textContent = fmt(p.price_egp);
    });
    if (game.memberships) game.memberships.forEach(m => {
      const el = document.getElementById("mpr" + m.id);
      if (el) el.textContent = fmt(m.price_egp);
    });
    if (game.special) {
      const el = document.getElementById("ef-sp-price");
      if (el) el.textContent = fmt(game.special.price_egp);
    }
  });
  clearCalcResults();
}

// ═══════════════════════════════════
// 🧮 CALCULATOR
// ═══════════════════════════════════
let calcGame = "pubg";

function setCalcGame(gameId, btn) {
  calcGame = gameId;
  document.querySelectorAll(".cgs").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  clearCalcResults();
  updateCalcLabels();
  // Also switch main game panel
  const tabBtn = document.querySelector(`.gtab[data-game="${gameId}"]`);
  if (tabBtn) switchGame(gameId, tabBtn);
}

function updateCalcLabels() {
  const game = GAMES.find(g => g.id === calcGame);
  if (!game) return;
  const lbl  = document.getElementById("calc-lbl-uc");
  const unit = document.getElementById("calc-unit-uc");
  if (lbl)  lbl.textContent  = `كم ${game.currency_label} تحتاج؟`;
  if (unit) unit.textContent = game.currency;
}

function switchTab(mode) {
  document.getElementById("tabUC").classList.toggle("active",    mode === "uc");
  document.getElementById("tabMoney").classList.toggle("active", mode === "money");
  document.getElementById("panelUC").classList.toggle("hidden",    mode !== "uc");
  document.getElementById("panelMoney").classList.toggle("hidden", mode !== "money");
}

function clearCalcResults() {
  const resUC = document.getElementById("resUC");
  const resMoney = document.getElementById("resMoney");
  if (resUC)    resUC.innerHTML    = `<div class="calc-placeholder"><span>🎮</span><span>أدخل العدد لتظهر النتيجة</span></div>`;
  if (resMoney) resMoney.innerHTML = `<div class="calc-placeholder"><span>💰</span><span>أدخل المبلغ لتظهر النتيجة</span></div>`;
  const inpUC = document.getElementById("inpUC");
  const inpMoney = document.getElementById("inpMoney");
  if (inpUC)    inpUC.value = "";
  if (inpMoney) inpMoney.value = "";
}

function getCalcPkgs() {
  return GAMES.find(g => g.id === calcGame)?.packages || [];
}
function getCalcCurrency() {
  return GAMES.find(g => g.id === calcGame)?.currency || "UC";
}
function getCalcGameLabel() {
  return GAMES.find(g => g.id === calcGame)?.label || "";
}

// خوارزمية greedy — تجمع الباقات بأقل تكلفة
function bestCombo(pkgs, targetAmount) {
  const sorted = [...pkgs].sort((a, b) => b.amount - a.amount);
  let rem = targetAmount;
  const combo = [];
  for (const p of sorted) {
    if (rem <= 0) break;
    const qty = Math.floor(rem / p.amount);
    if (qty > 0) { combo.push({...p, qty}); rem -= qty * p.amount; }
  }
  if (rem > 0) {
    const smallest = sorted[sorted.length - 1];
    const existing = combo.find(c => c.id === smallest.id);
    if (existing) existing.qty += 1;
    else          combo.push({...smallest, qty:1});
  }
  return {
    combo,
    totalAmount: combo.reduce((s,c) => s + c.amount * c.qty, 0),
    totalPrice:  combo.reduce((s,c) => s + c.price_egp * c.qty, 0),
  };
}

function comboHTML(combo, currency) {
  return combo.map(c => `
    <div class="combo-row">
      <span class="combo-name">${c.amount.toLocaleString()} ${currency}</span>
      <div class="combo-right">
        <span class="combo-qty">× ${c.qty}</span>
        <span class="combo-price">${fmt(c.price_egp * c.qty)}</span>
      </div>
    </div>`).join("");
}

// حاسبة عملة → سعر
function calcUC() {
  const inputEl  = document.getElementById("inpUC");
  const resultEl = document.getElementById("resUC");
  if (!inputEl || !resultEl) return;
  const wanted = parseInt(inputEl.value);
  if (!wanted || wanted < 1) {
    resultEl.innerHTML = `<div class="calc-placeholder"><span>🎮</span><span>أدخل العدد لتظهر النتيجة</span></div>`;
    return;
  }
  const pkgs     = getCalcPkgs();
  const currency = getCalcCurrency();
  const gameName = getCalcGameLabel();
  const {combo, totalAmount, totalPrice} = bestCombo(pkgs, wanted);
  const isExact  = totalAmount === wanted;
  const waDetails = combo.map(c => `${c.amount.toLocaleString()} ${currency} × ${c.qty}`).join(" + ");

  resultEl.innerHTML = `
    <div class="calc-res-wrap">
      <div class="calc-res-label">الباقات المقترحة</div>
      <div class="calc-combo">${comboHTML(combo, currency)}</div>
      <div class="calc-total-row">
        <div>
          <div class="calc-res-label">الإجمالي</div>
          <div class="calc-total-uc">${totalAmount.toLocaleString()} ${currency}</div>
        </div>
        <div class="calc-total-price">${fmt(totalPrice)}</div>
      </div>
      <div class="calc-res-note ${isExact ? "exact" : ""}">
        ${isExact
          ? `✅ ستحصل على ${totalAmount.toLocaleString()} ${currency} بالضبط`
          : `💡 ستحصل على ${totalAmount.toLocaleString()} ${currency} — أقرب عدد ممكن لـ ${wanted.toLocaleString()}`}
      </div>
      <button class="calc-buy-btn" onclick="waOpen('🎮 ${gameName}\\n📦 ${waDetails}\\n💰 الإجمالي: ${fmt(totalPrice)}')">
        🛒 اشترِ هذه التشكيلة
      </button>
    </div>`;
}

// حاسبة فلوس → عملة
function calcMoney() {
  const inputEl  = document.getElementById("inpMoney");
  const resultEl = document.getElementById("resMoney");
  if (!inputEl || !resultEl) return;
  const budget   = parseInt(inputEl.value);
  if (!budget || budget < 1) {
    resultEl.innerHTML = `<div class="calc-placeholder"><span>💰</span><span>أدخل المبلغ لتظهر النتيجة</span></div>`;
    return;
  }
  const pkgs     = getCalcPkgs();
  const currency = getCalcCurrency();
  const gameName = getCalcGameLabel();
  const sorted   = [...pkgs].sort((a, b) => b.amount - a.amount);
  let rem        = budget;
  const combo    = [];

  for (const p of sorted) {
    if (rem < p.price_egp) continue;
    const qty = Math.floor(rem / p.price_egp);
    if (qty > 0) { combo.push({...p, qty}); rem -= qty * p.price_egp; }
  }

  if (combo.length === 0) {
    resultEl.innerHTML = `
      <div class="calc-placeholder">
        <span>💸</span>
        <span>المبلغ لا يكفي لأي باقة<br/><small style="color:var(--muted)">أقل باقة بـ ${pkgs[0].price_egp} جنيه</small></span>
      </div>`;
    return;
  }

  const totalAmount = combo.reduce((s,c) => s + c.amount * c.qty, 0);
  const totalSpent  = combo.reduce((s,c) => s + c.price_egp * c.qty, 0);
  const leftover    = budget - totalSpent;
  const waDetails   = combo.map(c => `${c.amount.toLocaleString()} ${currency} × ${c.qty}`).join(" + ");

  resultEl.innerHTML = `
    <div class="calc-res-wrap">
      <div class="calc-res-label">أفضل استخدام لـ ${fmt(budget)}</div>
      <div class="calc-combo">${comboHTML(combo, currency)}</div>
      <div class="calc-total-row">
        <div>
          <div class="calc-res-label">إجمالي ${currency}</div>
          <div class="calc-total-uc">${totalAmount.toLocaleString()} ${currency}</div>
        </div>
        <div class="calc-total-price">${fmt(totalSpent)}</div>
      </div>
      <div class="calc-res-note ${leftover === 0 ? "exact" : ""}">
        ${leftover > 0
          ? `💡 يتبقى معك ${fmt(leftover)} لا تكفي لباقة إضافية`
          : `✅ صرفت كل المبلغ بالضبط`}
      </div>
      <button class="calc-buy-btn" onclick="waOpen('🎮 ${gameName}\\n📦 ${waDetails}\\n💰 الإجمالي: ${fmt(totalSpent)}')">
        🛒 اشترِ هذه التشكيلة
      </button>
    </div>`;
}

// ═══════════════════════════════════
// 🔔 FAKE POPUPS
// ═══════════════════════════════════
function initPopups() {
  const container = document.getElementById("live-pop");
  if (!container) return;
  const emojis = ["😊","👍","✅","🎮","⚡","🔥","💪","🏆"];
  const times  = ["للتو","منذ دقيقة","منذ دقيقتين","منذ 3 دقائق"];
  let busy = false;

  function show() {
    if (busy) return; busy = true;
    const name = POPUPS.names[Math.random() * POPUPS.names.length | 0];
    const item = POPUPS.purchases[Math.random() * POPUPS.purchases.length | 0];
    const em   = emojis[Math.random() * emojis.length | 0];
    const time = times[Math.random() * times.length | 0];
    const div  = document.createElement("div");
    div.className = "pop-item";
    div.innerHTML = `
      <div class="pop-av">${em}</div>
      <div class="pop-text">
        <strong>${name}</strong>
        <span>اشترى ${item} · ${time}</span>
      </div>`;
    container.appendChild(div);
    setTimeout(() => { div.remove(); busy = false; }, 5200);
  }

  setTimeout(() => { show(); setInterval(show, Math.random() * 6000 + 9000); }, 4000);
}

// ═══════════════════════════════════
// 🔄 LOADER
// ═══════════════════════════════════
(function () {
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

// ═══════════════════════════════════
// 🖱️ CURSOR
// ═══════════════════════════════════
(function () {
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
    if (e.target.closest("a,button,.pkg-card,.pros-card,.mem-card,.step")) {
      dot.classList.add("big"); ring.classList.add("big");
    }
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest("a,button,.pkg-card,.pros-card,.mem-card,.step")) {
      dot.classList.remove("big"); ring.classList.remove("big");
    }
  });
})();

// ═══════════════════════════════════
// 📌 HEADER + MENU
// ═══════════════════════════════════
window.addEventListener("scroll", () => {
  document.getElementById("hdr")?.classList.toggle("stuck", scrollY > 60);
}, { passive:true });

document.getElementById("burger")?.addEventListener("click", () => {
  const nav = document.getElementById("mobNav");
  nav?.classList.toggle("open");
  document.getElementById("burger").textContent = nav?.classList.contains("open") ? "✕" : "☰";
});
function closeMob() {
  document.getElementById("mobNav")?.classList.remove("open");
  document.getElementById("burger").textContent = "☰";
}

// ═══════════════════════════════════
// 💱 CURRENCY TOGGLE
// ═══════════════════════════════════
document.getElementById("curBtn")?.addEventListener("click", () => {
  CFG.cur = CFG.cur === "EGP" ? "USD" : "EGP";
  document.getElementById("curLabel").textContent = CFG.cur;
  refreshPrices();
});

// ═══════════════════════════════════
// 👁️ INTERSECTION OBSERVER
// ═══════════════════════════════════
function initObserver() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); });
  }, { threshold:0.1, rootMargin:"0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}

// ═══════════════════════════════════
// 🚀 INIT
// ═══════════════════════════════════
document.addEventListener("DOMContentLoaded", async () => {
  await loadData();

  // Render each game
  GAMES.forEach(game => {
    if (game.id === "pubg") {
      renderPackages("grid-pubg-uc",   game);
      renderPros("grid-pubg-pros",     game.prosperity);
      renderMem("grid-pubg-mem",       game.memberships);
    } else if (game.id === "freefire") {
      renderPackages("grid-ff-uc",     game);
    } else if (game.id === "efootball") {
      renderEFSpecial(game.special);
      renderPackages("grid-ef-uc",     game);
      const noteEl = document.getElementById("ef-charge-note");
      if (noteEl && game.charge_note) noteEl.textContent = game.charge_note;
    }
  });

  renderSteps();
  updateCalcLabels();
  setTimeout(initObserver, 180);
  initPopups();
});
