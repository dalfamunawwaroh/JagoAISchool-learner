# 🌌 JagoAI School Monorepo

Selamat datang di monorepo **JagoAI School**! Proyek ini telah direstrukturisasi sepenuhnya ke dalam arsitektur decoupled monorepo yang modern, memisahkan klien antarmuka pengguna (frontend) dan server logika bisnis (backend).

Kedua bagian ditulis menggunakan tipe aman **TypeScript** dan dirancang dengan estetika premium yang memikat mata (Harmonious colors, outfit typography, dan smooth animations).

---

## 📂 Struktur Folder Proyek

```bash
JagoAISchool-students/
├── backend/               # Server API Node.js + Express + MySQL + TypeScript
│   ├── src/
│   │   ├── routes/        # Router modular (auth, courses, discussions, dll.)
│   │   ├── db.ts          # Koneksi MySQL pool global
│   │   └── index.ts       # Entry point server Express
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/              # Client App React + Vite + CSS + TypeScript
│   ├── src/
│   │   ├── components/    # Komponen visual premium & Sidebar & Header
│   │   ├── pages/         # Halaman fungsional (Dashboard, LMS, Forum, dll.)
│   │   └── services/      # API Service client (JWT session handlers)
│   ├── tsconfig.json
│   ├── vite.config.ts     # Proxy konfigurasi ke backend port 5000
│   └── package.json
│
├── jagoaischool.sql       # Berkas migrasi database lokal
├── package.json           # Monorepo Orchestration Script (Concurrently)
└── README.md              # Dokumentasi ini
```

---

## ⚡ Cara Menjalankan Aplikasi Secara Bersamaan

Kami telah menyediakan orchestrator monorepo khusus di berkas root `package.json`. Anda hanya perlu menjalankan satu perintah dari direktori utama untuk mengaktifkan **Frontend** dan **Backend** secara konkuren:

### 1. Pemasangan Dependensi
Pastikan dependensi untuk kedua folder telah diinstal terlebih dahulu. Jalankan perintah berikut di folder utama:
```bash
npm run install:all
```

### 2. Jalankan Mode Pengembangan (Dev Server)
Gunakan perintah utama di bawah ini untuk memulai server backend (port `5000`) dan klien frontend (port `3000` dengan proxy `/api` otomatis):
```bash
npm run dev
```
Perintah ini akan secara dinamis menjalankan backend di tab konsol cyan dan frontend di tab konsol hijau menggunakan `concurrently`.

---

## 🗄️ Konfigurasi Database & Lingkungan (.env)

### Backend (`/backend/.env`)
Pastikan database MySQL lokal Anda aktif dan database `jagoaischool` telah diimpor menggunakan file `jagoaischool.sql`.
```ini
PORT=5000
DATABASE_URL="mysql://root:@localhost:3306/jagoaischool"
JWT_SECRET="jagoai_school_neural_secret_key_2026"
```
*Catatan: Secara default, kata sandi diatur kosong (`""`) untuk MySQL lokal standard.*

### Frontend (`/frontend/.env`)
Konfigurasi environment frontend telah diatur untuk menggunakan proxy Vite `/api` menuju backend port `5000` secara aman.
```ini
VITE_API_URL=/api
```

---

## 🛠️ Modul & Fitur yang Terintegrasi
Semua modul frontend telah terikat secara penuh (100% real data fetching) ke MySQL database:
1. **Premium LMS Engine**: Pelacakan progres belajar per modul silabus lengkap dengan XP kalkulator terintegrasi.
2. **Community Forum (Discussion Hub)**: Saluran obrolan real-time dengan multi-channel, emoji reaksi, thread likes, dan thread creation.
3. **Smart Mentorship**: Formulir booking mentor real, audit portofolio, penjadwalan mock-interview, dan technical blockers ticket.
4. **Events & Certifications**: Registrasi webinar dengan visual ticket dan sertifikat riwayat belajar dinamis.
5. **AIToolkit & News Feed**: Direktori perkakas kecerdasan buatan, ticker berita berjalan, dan artikel blog informatif.
6. **Autentikasi & Profil**: Pendaftaran, login dengan enkripsi bcrypt & session token JWT, pembaruan biodata personal, dan pengubahan preferensi profil.

---

## 🧪 Validasi Kualitas Kode
Monorepo ini dikembangkan dengan kontrol kualitas yang sangat ketat:
* **Frontend Compile**: `npm run lint` di folder `frontend` sukses 100% tanpa kesalahan kompilasi TypeScript.
* **Backend Build**: `npm run build` di folder `backend` sukses 100% mengkompilasi file TS ke JS ESModules secara bersih.
