# 🌾 AIR.IN — Smart Irrigation Decision Support System

> Platform cerdas manajemen alokasi air irigasi pertanian berbasis data real-time untuk mitigasi risiko kekeringan dan fenomena El Niño.

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://itfest-air-in.vercel.app)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📌 Tentang Proyek

**AIR.IN** adalah sistem pendukung keputusan (*Decision Support System*) berbasis web yang dirancang untuk membantu pengurus irigasi desa (P3A) dalam membagi jatah air irigasi secara **presisi, adil, dan berbasis data sains** kepada para petani.

Sistem ini mengintegrasikan data cuaca real-time, karakteristik tanah, dan fase pertumbuhan tanaman menggunakan **Standar Agronomi Internasional FAO-56 Penman-Monteith** untuk menghasilkan rekomendasi alokasi air yang dapat dipertanggungjawabkan secara ilmiah.

---

## 🚀 Demo Langsung

🔗 **[https://itfest-air-in.vercel.app](https://itfest-air-in.vercel.app)**

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🗺️ **Pemetaan Lahan Interaktif** | Gambar batas polygon sawah langsung di atas peta satelit Esri |
| ☀️ **Cuaca Real-time** | Integrasi Open-Meteo API untuk suhu, curah hujan, dan ET₀ harian |
| 🤖 **Smart Risk Scoring** | Kalkulasi skor risiko kekeringan berbasis FAO-56 Penman-Monteith |
| 💧 **Alokasi Air Proporsional** | Pembagian kuota air otomatis berdasarkan prioritas risiko tiap sawah |
| 🌡️ **Simulasi El Niño** | Slider interaktif Level 0–10 untuk simulasi skenario kemarau parah |
| 📊 **Tren Risiko 30 Hari** | Grafik historis skor risiko kekeringan per lahan |
| 📱 **Notifikasi WhatsApp** | Kirim rekomendasi irigasi langsung ke HP petani via WhatsApp |

---

## 🛠️ Tech Stack

**Frontend:**
- [React.js](https://reactjs.org) + [Vite](https://vitejs.dev)
- [Material UI (MUI)](https://mui.com)
- [React Leaflet](https://react-leaflet.js.org) + Esri Satellite & CARTO Basemap
- [Lucide React](https://lucide.dev)

**Backend (API):**
- [Node.js](https://nodejs.org) + [Express.js](https://expressjs.com)
- Engine Kalkulasi FAO-56 Penman-Monteith (risk-engine.js)

**Database & Auth:**
- [Supabase](https://supabase.com) (PostgreSQL Cloud)

**External APIs:**
- [Open-Meteo](https://open-meteo.com) — Cuaca & Histori Curah Hujan
- [SoilGrids / ISRIC](https://www.isric.org) — Data Tipe Tanah
- WhatsApp Deep Link API

**Deployment:**
- [Vercel](https://vercel.com) (Frontend + Backend)

---

## ⚙️ Instalasi & Menjalankan Lokal

### Prasyarat
- Node.js v18+
- npm atau yarn

### Clone & Install

```bash
# Clone repository frontend
git clone https://github.com/RIZULAR/ITFEST_AIR.IN.git
cd ITFEST_AIR.IN

# Install dependencies
npm install
```

### Konfigurasi Environment

Buat file `.env` di root folder:

```env
VITE_API_URL=https://air-in-be.vercel.app
```

### Jalankan Development Server

```bash
npm run dev
```

Buka browser di `http://localhost:5173`

---

## 🧮 Algoritma Inti: FAO-56 Penman-Monteith

Sistem AIR.IN menggunakan standar internasional FAO-56 untuk menghitung kebutuhan air tanaman:

```
ET₀ = 0.0027 × Ra × ((Tmax + Tmin)/2 + 17.8) × √(Tmax - Tmin)
ETc = ET₀ × Kc

TAW = 1000 × (FC - WP) × Zr
RAW = p × TAW

Risk Score = (SoilWaterDeficit - RAW) / (TAW - RAW)
```

Keterangan:
- `ET₀` = Evapotranspirasi Referensi (mm/hari)
- `ETc` = Evapotranspirasi Aktual Tanaman (mm/hari)
- `TAW` = Total Available Water — Total kapasitas air tanah
- `RAW` = Readily Available Water — Batas aman air tanah
- `Kc` = Koefisien Tanaman sesuai fase pertumbuhan (FAO-56 Table)

---

## 📁 Struktur Proyek

```
ITFEST_AIR.IN/
├── src/
│   ├── components/         # Komponen UI reusable
│   ├── contexts/           # AuthContext (Supabase Auth)
│   ├── pages/
│   │   ├── LandingPage.jsx # Halaman utama
│   │   ├── LoginPage.jsx   # Halaman login
│   │   ├── Dashboard.jsx   # Layout dashboard utama
│   │   ├── HomePage.jsx    # Home dashboard + cuaca
│   │   ├── MapPage.jsx     # Peta interaktif & input lahan
│   │   ├── FieldsPage.jsx  # Manajemen daftar lahan
│   │   ├── WaterAllocationPage.jsx  # Alokasi air & El Niño
│   │   └── AnalyticsPage.jsx        # Analitik & statistik
│   ├── services/
│   │   ├── fieldStore.js   # CRUD lahan (Supabase + LocalStorage fallback)
│   │   ├── weatherService.js # Open-Meteo API
│   │   ├── soilService.js  # SoilGrids API
│   │   └── rainfallService.js # Histori curah hujan
│   └── utils/
│       └── growthUtils.js  # Utilitas fase pertumbuhan tanaman
├── .env                    # Konfigurasi environment
├── index.html
└── package.json
```

---

## 🔗 Repository Terkait

| Repo | Deskripsi | Link |
|------|-----------|------|
| **Frontend** | Aplikasi React.js AIR.IN | [ITFEST_AIR.IN](https://github.com/RIZULAR/ITFEST_AIR.IN) |
| **Backend** | REST API Node.js + Engine FAO-56 | [AIR.IN_BE](https://github.com/RIZULAR/AIR.IN_BE) |

---

## 👥 Tim Pengembang

Dikembangkan untuk keperluan kompetisi **ITFEST 2026**.

---

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan akademis dan kompetisi. © 2026 Tim AIR.IN.
