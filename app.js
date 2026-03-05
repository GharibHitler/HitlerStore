/* ══════════════════════════════════════════════
   Hitler Store — main.js
   الحاسبة + شراء واتساب + Popups + كل حاجة
══════════════════════════════════════════════ */

// ══ CONFIG — يُحمَّل من data.json ══
let WA_NUMBER = '201270139747';
let USD_RATE = 50;
let STORE_DATA = null;

// تحميل البيانات من data.json عند بدء التشغيل
async function loadData() {
  try {
    const res = await fetch('data.json');
    STORE_DATA = await res.json();
    WA_NUMBER = STORE_DATA.store.whatsapp;
    USD_RATE   = STORE_DATA.store.usd_rate;
    // تحديث calcData من الـ JSON
    STORE_DATA.games.forEach(game => {
      calcData[game.id] = {
        rates: game.packages.map(p => ({ uc: p.amount, egp: p.price_egp })),
        currency: game.currency,
        gemLabel: `عدد الـ ${game.currency}`,
      };
    });
  } catch(e) {
    console.warn('data.json not found, using defaults', e);
  }
}
loadData();

let isUSD = false;

// ══ CURSOR ══
const cur = document.getElementById('cursor');
const curR = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
if (window.innerWidth > 600) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  setInterval(() => {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    if(cur){ cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
    if(curR){ curR.style.left = rx + 'px'; curR.style.top = ry + 'px'; }
  }, 12);
  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('big'); curR.classList.add('big'); });
    el.addEventListener('mouseleave', () => { cur.classList.remove('big'); curR.classList.remove('big'); });
  });
}

// ══ LOADER ══
window.addEventListener('load', () => {
  const fill = document.getElementById('ld-fill');
  const pct = document.getElementById('ld-pct');
  let p = 0;
  const t = setInterval(() => {
    p += Math.random() * 18;
    if (p >= 100) { p = 100; clearInterval(t); setTimeout(hideLoader, 400); }
    fill.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
  }, 80);
});
function hideLoader() {
  document.getElementById('loader').classList.add('out');
  initReveal();
  startPopups();
}

// ══ HEADER SCROLL ══
window.addEventListener('scroll', () => {
  document.getElementById('hdr').classList.toggle('stuck', window.scrollY > 50);
});

// ══ MOBILE MENU ══
function toggleMenu() {
  const nav = document.getElementById('mob-nav');
  nav.classList.toggle('open');
}
function closeMenu() {
  document.getElementById('mob-nav').classList.remove('open');
}

// ══ SCROLL REVEAL ══
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// ══ CURRENCY TOGGLE ══
function toggleCurrency() {
  isUSD = !isUSD;
  const btn = document.getElementById('cur-toggle');
  btn.textContent = isUSD ? '🇪🇬 EGP' : '💵 USD';
  updateAllPrices();
}
function updateAllPrices() {
  document.querySelectorAll('[data-egp]').forEach(el => {
    const egp = parseFloat(el.getAttribute('data-egp'));
    const valEl = el.querySelector('.price-val');
    const curEl = el.querySelector('.price-cur');
    if (!valEl) return;
    if (isUSD) {
      const usd = (egp / USD_RATE).toFixed(2);
      valEl.textContent = usd;
      if(curEl) curEl.textContent = 'USD';
    } else {
      valEl.textContent = egp >= 1000 ? egp.toLocaleString() : egp;
      if(curEl) curEl.textContent = 'جنيه';
    }
  });
  // update mem-prices too
  document.querySelectorAll('.mem-price[data-egp]').forEach(el => {
    const egp = parseFloat(el.getAttribute('data-egp'));
    const valEl = el.querySelector('.price-val');
    if (!valEl) return;
    valEl.textContent = isUSD ? (egp / USD_RATE).toFixed(2) : egp.toLocaleString();
  });
  // update scard-price
  document.querySelectorAll('.scard-price[data-egp]').forEach(el => {
    const egp = parseFloat(el.getAttribute('data-egp'));
    const valEl = el.querySelector('.price-val');
    if (!valEl) return;
    valEl.textContent = isUSD ? (egp / USD_RATE).toFixed(2) : egp;
    el.querySelector('span:last-child').textContent = isUSD ? 'USD' : 'جنيه';
  });
}

// ══ BUY VIA WHATSAPP ══
function buyItem(itemName, priceEGP) {
  const priceText = isUSD
    ? `${(priceEGP / USD_RATE).toFixed(2)} USD`
    : `${priceEGP} جنيه`;
  const msg = `مرحباً 👋\nأريد شراء:\n🎮 ${itemName}\n💰 السعر: ${priceText}\n\nالرجاء إكمال الشحن.`;
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ══ CALCULATOR DATA ══
const calcData = {
  pubg: {
    rates: [
      {uc:60,   egp:55},
      {uc:325,  egp:240},
      {uc:385,  egp:290},
      {uc:660,  egp:450},
      {uc:1845, egp:1200},
      {uc:3940, egp:2300},
      {uc:8280, egp:4450},
    ],
    currency: 'UC',
    gemLabel: 'عدد الـ UC',
  },
  ff: {
    rates: [
      {uc:110,  egp:60},
      {uc:231,  egp:110},
      {uc:583,  egp:245},
      {uc:1088, egp:490},
      {uc:2420, egp:950},
    ],
    currency: 'جوهرة',
    gemLabel: 'عدد الجواهر',
  },
  ef: {
    rates: [
      {uc:137,   egp:80},
      {uc:315,   egp:170},
      {uc:578,   egp:280},
      {uc:788,   egp:370},
      {uc:1092,  egp:500},
      {uc:2237,  egp:1000},
      {uc:3413,  egp:1450},
      {uc:5985,  egp:2450},
      {uc:13440, egp:5200},
      {uc:32200, egp:12300},
    ],
    currency: 'كوين',
    gemLabel: 'عدد الكوين',
  }
};
let currentGame = 'pubg';

function switchCalcGame(game, btn) {
  currentGame = game;
  document.querySelectorAll('.cgt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const d = calcData[game];
  document.getElementById('calc-gem-label').textContent = d.gemLabel;
  document.getElementById('gem-badge').textContent = d.currency;
  document.getElementById('calc-egp').value = '';
  document.getElementById('calc-gem').value = '';
  document.getElementById('calc-result').innerHTML = '';
  document.getElementById('calc-hint-egp').textContent = '';
  document.getElementById('calc-hint-gem').textContent = '';
}

function calcFromEGP() {
  const egp = parseFloat(document.getElementById('calc-egp').value);
  const d = calcData[currentGame];
  if (!egp || egp <= 0) { clearCalc(); return; }

  // Find best matching package
  let best = null, bestDiff = Infinity;
  d.rates.forEach(r => {
    const diff = Math.abs(r.egp - egp);
    if (diff < bestDiff) { bestDiff = diff; best = r; }
  });

  // Interpolate approximate UC
  const approxUC = Math.round((egp / best.egp) * best.uc);
  document.getElementById('calc-gem').value = '';
  document.getElementById('calc-hint-egp').textContent = `≈ ${egp.toLocaleString()} EGP`;

  const resultDiv = document.getElementById('calc-result');
  const displayPrice = isUSD ? `${(egp/USD_RATE).toFixed(2)} USD` : `${egp.toLocaleString()} جنيه`;
  resultDiv.innerHTML = `
    💰 بـ <strong style="color:var(--gold3)">${displayPrice}</strong>
    تحصل على حوالي <strong style="color:var(--gold3)">${approxUC.toLocaleString()} ${d.currency}</strong>
    <br><span style="color:var(--muted);font-size:.78rem">أقرب باقة: ${best.uc} ${d.currency} بـ ${best.egp} EGP</span>
  `;
}

function calcFromGem() {
  const gem = parseFloat(document.getElementById('calc-gem').value);
  const d = calcData[currentGame];
  if (!gem || gem <= 0) { clearCalc(); return; }

  // Find best matching package
  let best = null, bestDiff = Infinity;
  d.rates.forEach(r => {
    const diff = Math.abs(r.uc - gem);
    if (diff < bestDiff) { bestDiff = diff; best = r; }
  });

  const approxEGP = Math.round((gem / best.uc) * best.egp);
  document.getElementById('calc-egp').value = '';
  document.getElementById('calc-hint-gem').textContent = `≈ ${gem.toLocaleString()} ${d.currency}`;

  const resultDiv = document.getElementById('calc-result');
  const displayPrice = isUSD ? `${(approxEGP/USD_RATE).toFixed(2)} USD` : `${approxEGP.toLocaleString()} جنيه`;
  resultDiv.innerHTML = `
    🎮 لتحصل على <strong style="color:var(--gold3)">${gem.toLocaleString()} ${d.currency}</strong>
    ستدفع حوالي <strong style="color:var(--gold3)">${displayPrice}</strong>
    <br><span style="color:var(--muted);font-size:.78rem">أقرب باقة: ${best.uc} ${d.currency} بـ ${best.egp} EGP</span>
  `;
}

function clearCalc() {
  document.getElementById('calc-result').innerHTML = '';
}

// ══ QUANTITY CALCULATOR ══
function calcQty() {
  const pkg = document.getElementById('qty-pkg').value;
  const qty = parseInt(document.getElementById('qty-num').value) || 1;
  if (!pkg) return;
  const [price, gems] = pkg.split(',').map(Number);
  const totalPrice = price * qty;
  const totalGems = gems * qty;
  const displayPrice = isUSD ? `${(totalPrice/USD_RATE).toFixed(2)} USD` : `${totalPrice.toLocaleString()} جنيه`;
  document.getElementById('qty-result').textContent =
    `${qty}x = ${totalGems.toLocaleString()} عملة · إجمالي: ${displayPrice}`;
}

// ══ LIVE PURCHASE POPUPS ══
const popNames = ['Ahmed','Mohamed','Omar','Youssef','Kareem','Hassan','Ali','Mina','Ziad','Tamer','Sara','Nour'];
const popItems = [
  'اشترى 660 UC',
  'اشترى 325 UC',
  'اشترى 385 UC',
  'اشترى 583 جوهرة',
  'اشترى 1088 جوهرة',
  'اشترى 788 كوين',
  'اشترى 1092 كوين',
  'جدد عضوية PRIME',
  'اشترى 1845 UC',
  'اشترى 231 جوهرة',
  'اشترى 2237 كوين',
  'اشترى عرض الازدهار الثاني',
];
const popEmojis = ['🎯','🔥','⚽','💎','🏆','👑','⚡','🌟'];
let popInterval = null;

function startPopups() {
  setTimeout(showPop, 3000);
  popInterval = setInterval(showPop, 7000);
}

function showPop() {
  const container = document.getElementById('live-pop');
  if (!container) return;
  const name = popNames[Math.floor(Math.random() * popNames.length)];
  const item = popItems[Math.floor(Math.random() * popItems.length)];
  const emoji = popEmojis[Math.floor(Math.random() * popEmojis.length)];
  const mins = Math.floor(Math.random() * 55) + 1;
  const pop = document.createElement('div');
  pop.className = 'pop-item';
  pop.innerHTML = `
    <div class="pop-av">${emoji}</div>
    <div class="pop-text">
      <strong>${name}</strong>
      <span>${item} · منذ ${mins} دقيقة</span>
    </div>
  `;
  container.appendChild(pop);
  setTimeout(() => { if(pop.parentNode) pop.parentNode.removeChild(pop); }, 5000);
  // Keep max 3 popups
  while (container.children.length > 3) container.removeChild(container.firstChild);
}

// ══ BATISTUTA TIMER (154 days) ══
function updateBatiTimer() {
  const el = document.getElementById('batiDays');
  if (!el) return;
  // Count down from 154 days (just display, update daily)
  const stored = localStorage.getItem('bati_start');
  const start = stored ? parseInt(stored) : Date.now();
  if (!stored) localStorage.setItem('bati_start', start);
  const elapsed = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
  const remaining = Math.max(0, 154 - elapsed);
  el.textContent = remaining;
}
updateBatiTimer();

// ══ SMOOTH SCROLL for nav links ══
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
