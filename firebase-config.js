// ════════════════════════════════════════════════
//  firebase-config.js
//  ⚠️  حط هنا الـ config بتاعك من Firebase Console
//  شوف ملف SETUP.md عشان تعرف تجيب الـ config
// ════════════════════════════════════════════════

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBQvpk9u4SfrZw-TgL6AWf8MeuwZuUmqVY",
  authDomain:        "hitler-store-74008.firebaseapp.com",
  projectId:         "hitler-store-74008",
  storageBucket:     "hitler-store-74008.firebasestorage.app",
  messagingSenderId: "1013000792954",
  appId:             "1:1013000792954:web:f35f2dfd42338fee0244c3"
};

// ════════════════════════════════════════════════
//  إعدادات المتجر — عدّل هنا
// ════════════════════════════════════════════════
const STORE_CONFIG = {
  name:          "Hitler Store",
  adminPassword: "OmarGharib",        // ← غيّر الباسورد
  packages: [
    { id:"uc60",   label:"60 UC",   price:55   },
    { id:"uc325",  label:"325 UC",  price:240  },
    { id:"uc385",  label:"385 UC",  price:290  },
    { id:"uc660",  label:"660 UC",  price:450  },
    { id:"uc1845", label:"1845 UC", price:1200 },
    { id:"uc3940", label:"3940 UC", price:2300 },
    { id:"uc8100", label:"8100 UC", price:4450 },
    { id:"season", label:"شحن السيزون (QR)", price:150 },
  ]
};
