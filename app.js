/**
 * متجر هتلر - Main JavaScript
 * يتحكم في: عرض الباقات، الواتساب، التحويل العملات، الأنيميشن
 */

// ====================================
// DATA & CONFIG
// ====================================
const CONFIG = {
  whatsapp: "201278443292",
  currencyRate: 50, // 1 USD = 50 EGP (قابل للتعديل)
  currency: "EGP",  // العملة الحالية
};

// بيانات الباقات - يمكن تعديلها مباشرة هنا أو من data.json
const DATA = {
  uc_packages: [
    { id: 1, uc: 60,   price_egp: 55,   badge: "",           popular: false, icon: "💠" },
    { id: 2, uc: 325,  price_egp: 240,  badge: "",           popular: false, icon: "💎" },
    { id: 3, uc: 385,  price_egp: 290,  badge: "جديد",       popular: false, icon: "⭐" },
    { id: 4, uc: 660,  price_egp: 450,  badge: "",           popular: true,  icon: "🔥" },
    { id: 5, uc: 1845, price_egp: 1200, badge: "الأكثر مبيعاً", popular: true, icon: "🏆" },
    { id: 6, uc: 3940, price_egp: 2300, badge: "خصم",        popular: false, icon: "💰" },
    { id: 7, uc: 8100, price_egp: 4450, badge: "VIP",        popular: false, icon: "👑" },
  ],
  prosperity_packages: [
    { id: 1, name: "عرض الازدهار الأول",   price_egp: 60,  badge: "",      icon: "🌸" },
    { id: 2, name: "عرض الازدهار الثاني",  price_egp: 150, badge: "شعبي", icon: "🌺" },
    { id: 3, name: "عرض الازدهار الثالث",  price_egp: 240, badge: "",      icon: "🌹" },
  ],
  memberships: [
    {
      id: 1,
      name: "PRIME العادية",
      price_egp: 55,
      period: "شهر",
      premium: false,
      icon: "⭐",
      features: ["مكافآت يومية", "تجربة حصرية", "مكافأة الولاء"]
    },
    {
      id: 2,
      name: "PRIME المميزة",
      price_egp: 485,
      period: "شهر",
      premium: true,
      icon: "👑",
      features: ["كل مميزات العادية", "مكافآت إضافية", "أولوية الدعم", "عناصر حصرية"]
    }
  ],
};

// أسماء وهمية لعمليات الشراء المزيفة (لبناء الثقة)
const FAKE_NAMES = [
  "أحمد من القاهرة", "محمد من الإسكندرية", "علي من الجيزة",
  "يوسف من المنصورة", "عمر من الإسماعيلية", "خالد من أسيوط",
  "مصطفى من سوهاج", "إبراهيم من طنطا", "سامي من المنيا",
  "كريم من دمياط"
];

// ====================================
// LOADER
// ====================================
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  }, 2200);
});

// ====================================
// INIT
// ====================================
document.addEventListener("DOMContentLoaded", () => {
  renderUCPackages();
  renderProsperityPackages();
  renderMemberships();
  initParticles();
  initScrollEffects();
  initHeader();
  initIntersectionObserver();
  startFakePopups();
  initCurrencyToggle();
  initMobileMenu();
});

// ====================================
// RENDER UC PACKAGES
// ====================================
function renderUCPackages() {
  const grid = document.getElementById("ucGrid");
  if (!grid) return;

  grid.innerHTML = DATA.uc_packages.map((pkg, i) => {
    const badgeHTML = pkg.badge ? `<div class="pkg-badge ${getBadgeClass(pkg.badge)}">${pkg.badge}</div>` : "";
    const popularClass = pkg.popular ? "popular" : "";
    const usdPrice = (pkg.price_egp / CONFIG.currencyRate).toFixed(2);

    return `
      <div class="pkg-card ${popularClass} reveal" style="animation-delay:${i * 0.08}s">
        ${badgeHTML}
        <span class="pkg-icon">${pkg.icon}</span>
        <div class="pkg-uc">${pkg.uc.toLocaleString()}</div>
        <div class="pkg-uc-label">UC شدة</div>
        <div class="pkg-price-box">
          <span class="pkg-price" id="price-uc-${pkg.id}">
            ${pkg.price_egp} جنيه
          </span>
          <div class="pkg-price-usd" id="price-usd-uc-${pkg.id}">
            ≈ $${usdPrice}
          </div>
        </div>
        <button class="btn-buy" onclick="buyPackage('${pkg.uc} UC', ${pkg.price_egp})">
          🛒 اشتري الآن
        </button>
      </div>
    `;
  }).join("");
}

function getBadgeClass(badge) {
  if (badge === "الأكثر مبيعاً") return "popular-badge";
  if (badge === "VIP") return "vip-badge";
  if (badge === "جديد") return "new-badge";
  return "";
}

// ====================================
// RENDER PROSPERITY PACKAGES
// ====================================
function renderProsperityPackages() {
  const grid = document.getElementById("prosperityGrid");
  if (!grid) return;

  grid.innerHTML = DATA.prosperity_packages.map((pkg, i) => {
    const badgeHTML = pkg.badge ? `<div class="pros-badge">${pkg.badge}</div>` : "";
    const usdPrice = (pkg.price_egp / CONFIG.currencyRate).toFixed(2);

    return `
      <div class="pros-card reveal" style="animation-delay:${i * 0.1}s">
        ${badgeHTML}
        <div class="pros-icon">${pkg.icon}</div>
        <div class="pros-name">${pkg.name}</div>
        <div class="pros-price" id="price-pros-${pkg.id}">
          ${pkg.price_egp} <span>جنيه</span>
        </div>
        <button class="btn-buy-pros" onclick="buyPackage('${pkg.name}', ${pkg.price_egp})">
          🛒 اشتري الآن
        </button>
      </div>
    `;
  }).join("");
}

// ====================================
// RENDER MEMBERSHIPS
// ====================================
function renderMemberships() {
  const grid = document.getElementById("membershipGrid");
  if (!grid) return;

  grid.innerHTML = DATA.memberships.map((mem, i) => {
    const premiumClass = mem.premium ? "premium" : "";
    const usdPrice = (mem.price_egp / CONFIG.currencyRate).toFixed(2);
    const featuresHTML = mem.features.map(f => `<li>${f}</li>`).join("");

    return `
      <div class="mem-card ${premiumClass} reveal" style="animation-delay:${i * 0.15}s">
        <div class="mem-crown">${mem.icon}</div>
        <div class="mem-name">${mem.name}</div>
        <div class="mem-price" id="price-mem-${mem.id}">
          ${mem.price_egp} جنيه
        </div>
        <div class="mem-period">/ ${mem.period}</div>
        <ul class="mem-features">${featuresHTML}</ul>
        <button class="btn-buy-mem" onclick="buyPackage('عضوية ${mem.name}', ${mem.price_egp})">
          🛒 اشترك الآن
        </button>
      </div>
    `;
  }).join("");
}

// ====================================
// WHATSAPP BUY
// ====================================
function buyPackage(packageName, priceEGP) {
  const priceDisplay = CONFIG.currency === "USD"
    ? `$${(priceEGP / CONFIG.currencyRate).toFixed(2)}`
    : `${priceEGP} جنيه مصري`;

  const message = encodeURIComponent(
    `مرحباً، أريد شراء: ${packageName}\n` +
    `💰 السعر: ${priceDisplay}\n\n` +
    `ID اللاعب: [أكتب ID حسابك هنا]\n` +
    `الاسم في اللعبة: [اسمك في اللعبة]\n\n` +
    `📦 متجر هتلر للشدات`
  );

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${message}`, "_blank");
}

// ====================================
// CURRENCY TOGGLE
// ====================================
function initCurrencyToggle() {
  const btn = document.getElementById("currencyToggle");
  const label = document.getElementById("currencyLabel");
  if (!btn) return;

  btn.addEventListener("click", () => {
    CONFIG.currency = CONFIG.currency === "EGP" ? "USD" : "EGP";
    label.textContent = CONFIG.currency;
    updatePriceDisplay();
  });
}

function updatePriceDisplay() {
  const isUSD = CONFIG.currency === "USD";

  // UC Packages
  DATA.uc_packages.forEach(pkg => {
    const priceEl = document.getElementById(`price-uc-${pkg.id}`);
    const usdEl = document.getElementById(`price-usd-uc-${pkg.id}`);
    if (priceEl) {
      priceEl.textContent = isUSD
        ? `$${(pkg.price_egp / CONFIG.currencyRate).toFixed(2)}`
        : `${pkg.price_egp} جنيه`;
    }
    if (usdEl) usdEl.classList.toggle("show", false);
  });

  // Prosperity
  DATA.prosperity_packages.forEach(pkg => {
    const el = document.getElementById(`price-pros-${pkg.id}`);
    if (el) {
      el.innerHTML = isUSD
        ? `$${(pkg.price_egp / CONFIG.currencyRate).toFixed(2)} <span>USD</span>`
        : `${pkg.price_egp} <span>جنيه</span>`;
    }
  });

  // Memberships
  DATA.memberships.forEach(mem => {
    const el = document.getElementById(`price-mem-${mem.id}`);
    if (el) {
      el.textContent = isUSD
        ? `$${(mem.price_egp / CONFIG.currencyRate).toFixed(2)}`
        : `${mem.price_egp} جنيه`;
    }
  });
}

// ====================================
// PARTICLES
// ====================================
function initParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 3 + 2;
    const x = Math.random() * 100;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 8;
    const xEnd = (Math.random() - 0.5) * 200;
    const xStart = (Math.random() - 0.5) * 100;

    p.style.cssText = `
      left: ${x}%;
      width: ${size}px;
      height: ${size}px;
      --duration: ${duration}s;
      --delay: ${delay}s;
      --x-start: ${xStart}px;
      --x-end: ${xEnd}px;
      opacity: ${Math.random() * 0.6 + 0.2};
    `;

    // Some particles in different colors
    if (i % 5 === 0) p.style.background = "#ff4d00";
    if (i % 7 === 0) p.style.background = "#00d4ff";

    container.appendChild(p);
  }
}

// ====================================
// SCROLL EFFECTS (Header)
// ====================================
function initScrollEffects() {
  window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 60);
    }
  }, { passive: true });
}

// ====================================
// INTERSECTION OBSERVER (Reveal on scroll)
// ====================================
function initIntersectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  );

  // Observe all cards and section headers
  document.querySelectorAll(".reveal, .section-header, .step-card, .trust-item").forEach(el => {
    observer.observe(el);
  });
}

function initHeader() {
  // Re-observe after dynamic render
  setTimeout(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  }, 300);
}

// ====================================
// MOBILE MENU
// ====================================
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mobileNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.textContent = nav.classList.contains("open") ? "✕" : "☰";
  });
}

function closeMobileNav() {
  const nav = document.getElementById("mobileNav");
  const toggle = document.getElementById("menuToggle");
  if (nav) nav.classList.remove("open");
  if (toggle) toggle.textContent = "☰";
}

// ====================================
// FAKE PURCHASE POPUPS (Social Proof)
// ====================================
function startFakePopups() {
  const popupContainer = document.getElementById("livePopup");
  if (!popupContainer) return;

  const purchases = [
    { pkg: "660 UC", price: "450 جنيه" },
    { pkg: "325 UC", price: "240 جنيه" },
    { pkg: "PRIME المميزة", price: "485 جنيه/شهر" },
    { pkg: "1845 UC", price: "1200 جنيه" },
    { pkg: "عرض الازدهار الثاني", price: "150 جنيه" },
    { pkg: "8100 UC", price: "4450 جنيه" },
    { pkg: "60 UC", price: "55 جنيه" },
    { pkg: "PRIME العادية", price: "55 جنيه/شهر" },
  ];

  let popupActive = false;

  function showPopup() {
    if (popupActive) return;
    popupActive = true;

    const name = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
    const purchase = purchases[Math.floor(Math.random() * purchases.length)];
    const times = ["للتو", "منذ دقيقة", "منذ 2 دقيقة"];
    const timeStr = times[Math.floor(Math.random() * times.length)];
    const emoji = ["😊","👍","✅","🎮","⚡"][Math.floor(Math.random() * 5)];

    const item = document.createElement("div");
    item.className = "popup-item";
    item.innerHTML = `
      <div class="popup-avatar">${emoji}</div>
      <div class="popup-text">
        <strong>${name}</strong> اشترى ${purchase.pkg}
        <span>${purchase.price} • ${timeStr}</span>
      </div>
    `;

    popupContainer.appendChild(item);

    // Remove after 5 seconds
    setTimeout(() => {
      item.remove();
      popupActive = false;
    }, 5000);
  }

  // First popup after 3 seconds
  setTimeout(() => {
    showPopup();
    // Then every 7-15 seconds
    setInterval(() => {
      showPopup();
    }, Math.random() * 8000 + 7000);
  }, 3000);
}
