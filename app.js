/* ══════════════════════════════════════════
   HITLERSTORE - Core Logic v8.0
   تحكم كامل في الباقات، المودال، والطلبات
   ══════════════════════════════════════════ */

// 1. قاعدة بيانات الباقات (يمكنك تعديل الأسعار من هنا)
const PKG = [
    {id:1, uc:60,   egp:55,   badge:"",              hot:false, ico:"💠"},
    {id:2, uc:325,  egp:240,  badge:"",              hot:false, ico:"💎"},
    {id:3, uc:385,  egp:290,  badge:"جديد",          hot:false, ico:"⭐"},
    {id:4, uc:660,  egp:450,  badge:"",              hot:true,  ico:"🔥"},
    {id:5, uc:1845, egp:1200, badge:"الأكثر مبيعاً", hot:true,  ico:"🏆"},
    {id:6, uc:3940, egp:2300, badge:"خصم",           hot:false, ico:"💰"},
    {id:7, uc:8100, egp:4450, badge:"VIP",           hot:false, ico:"👑"},
];

// 2. حالة المتجر (State)
window.pkgActive = null;
window.methodActive = "فودافون كاش";

// 3. رسم الباقات في الصفحة عند التحميل
function renderPackages() {
    const grid = document.getElementById("pkgGrid");
    if (!grid) return;

    grid.innerHTML = PKG.map(p => `
        <div class="pkg-card ${p.hot ? 'hot' : ''}" onclick="selectPkg(${p.id}, this)">
            ${p.badge ? `<div class="pkg-badge">${p.badge}</div>` : ''}
            <div class="pkg-ico">${p.ico}</div>
            <div class="pkg-uc">${p.uc} <span>UC</span></div>
            <div class="pkg-price">${p.egp} EGP</div>
            <button class="pkg-btn">شحن الآن</button>
        </div>
    `).join('');
}

// 4. دالة اختيار الباقة وفتح المودال
window.selectPkg = (id, element) => {
    // تمييز الكارت المختار بصرياً
    document.querySelectorAll('.pkg-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');

    // تحديد الباقة المختارة برمجياً
    const selected = PKG.find(p => p.id === id);
    window.pkgActive = {
        label: selected.uc + " UC",
        price: selected.egp,
        id: selected.id
    };

    // تحديث بيانات نافذة التأكيد (Modal) قبل فتحها
    const moPkg = document.getElementById("moPkg");
    const moPrice = document.getElementById("moPrice");
    if(moPkg) moPkg.innerText = window.pkgActive.label;
    if(moPrice) moPrice.innerText = window.pkgActive.price + " جنيه";

    openMo();
};

// 5. وظائف التحكم في نافذة التأكيد (Modal)
window.openMo = () => {
    const modal = document.getElementById("oMo");
    if (modal) {
        modal.classList.add("on");
        document.body.style.overflow = "hidden"; // منع التمرير في الخلفية
    }
};

window.closeMo = () => {
    const modal = document.getElementById("oMo");
    if (modal) {
        modal.classList.remove("on");
        document.body.style.overflow = "";
    }
};

// 6. اختيار طريقة الدفع
window.setMethod = (methodName, element) => {
    window.methodActive = methodName;
    document.querySelectorAll('.met-card').forEach(card => card.classList.remove('on'));
    element.classList.add('on');
};

// 7. تحسينات تجربة المستخدم (UX) عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    renderPackages();

    // تغيير شكل زر الدخول إذا كان المستخدم مسجلاً
    const user = JSON.parse(localStorage.getItem("hs_user"));
    const navLoginBtn = document.querySelector(".nav-login");
    if (user && navLoginBtn) {
        navLoginBtn.innerText = "طلباتي 📋";
        navLoginBtn.href = "order.html";
    }

    // إخفاء شاشة التحميل (Loader)
    const loader = document.getElementById("ld");
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 500);
        }, 800);
    }
});

// 8. ميزة الماوس (Custom Cursor) إذا كنت تستخدمها في الـ CSS
document.addEventListener("mousemove", (e) => {
    const cur = document.getElementById("cur");
    const curR = document.getElementById("cur-r");
    if (cur) cur.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    if (curR) curR.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});
