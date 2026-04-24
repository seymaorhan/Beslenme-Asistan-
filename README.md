# ChefMind – Akıllı Yemek ve Beslenme Asistanı

React Native (Expo) + Node.js + SQLite ile geliştirilmiş AI destekli yemek uygulaması.

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm
- Expo Go (telefonda test için)

---

### 1. Repoyu klonla
```bash
git clone https://github.com/seymaorhan/Beslenme-Asistan-
cd Beslenme-Asistan-
```

---

### 2. Backend Kurulum
```bash
cd backend

# .env dosyası oluştur
cp .env.example .env
# .env içinde JWT_SECRET ve OPENAI_API_KEY düzenle

# Paketleri yükle
npm install

# Veritabanını oluştur
npx prisma generate
npx prisma db push

# Örnek tarifleri ekle
npx tsx prisma/seed.ts

# Backend başlat (http://localhost:3000)
npm run dev
```

---

### 3. Frontend Kurulum
```bash
cd frontend

# Paketleri yükle
npm install

# Uygulamayı başlat
npx expo start

# Web için
npx expo start --web

# Telefon için (aynı WiFi gerekli)
npx expo start
# QR kodu Expo Go ile tara
```

---

## 📱 Ekranlar
- Splash & Onboarding
- Kayıt Ol / Giriş Yap
- Ana Sayfa (tarif listesi)
- Malzeme Ekle → Tarif Bul
- Tarif Detayı
- AI Chat
- Alışveriş Listesi
- Profil
- Haftalık Plan

## 🛠 Teknoloji
- **Frontend:** React Native, Expo Router
- **Backend:** Node.js, Express, Prisma
- **Veritabanı:** SQLite (geliştirme) → Azure SQL (production)
- **AI:** OpenAI GPT-4o-mini
