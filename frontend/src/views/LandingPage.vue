<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden relative">
    <!-- Background Grid Effect (Kotak-kotak) -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

    <!-- Header Navbar -->
    <header class="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div class="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white border border-emerald-500/20">
            <Droplets class="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span class="text-2xl font-extrabold tracking-tight text-emerald-600">air.in</span>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Agriculture Platform</p>
          </div>
        </div>

        <!-- Navigation Links (Desktop) -->
        <nav class="hidden md:flex items-center gap-8">
          <a href="#fitur" class="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Fitur Utama</a>
          <a href="#skema" class="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Cara Kerja</a>
          <a href="#skor" class="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Resiliensi</a>
          <a href="#teknologi" class="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Teknologi</a>
        </nav>

        <!-- CTA Button -->
        <div>
          <router-link to="/dashboard" class="relative inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 text-sm font-bold text-white border border-emerald-700 transition-all hover:scale-[102%] active:scale-95">
            Buka Dashboard
            <ArrowRight class="ml-2 h-4 w-4" />
          </router-link>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative pt-12 pb-24 md:pt-20 md:pb-32 px-4 md:px-8">
      <div class="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Hero Left / Copywriting -->
        <div class="lg:col-span-7 space-y-8 text-left">
          <div class="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 backdrop-blur-md">
            <Sparkles class="h-4 w-4 text-emerald-600" />
            <span>Solusi Cerdas Irigasi Menghadapi El Niño</span>
          </div>

          <h1 class="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Optimalisasi Air,<br />
            <span class="text-emerald-600">Maksimalkan Hasil Panen</span>
          </h1>

          <p class="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            <strong class="text-emerald-600 font-semibold">air.in</strong> adalah platform pengelolaan air pertanian terpadu yang dirancang khusus untuk mendistribusikan pasokan air irigasi secara presisi, adil, dan efisien berbasis data cuaca, fase tanaman, dan tingkat keparahan kekeringan.
          </p>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-2">
            <router-link to="/dashboard" class="flex h-14 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 px-8 text-base font-bold text-white border border-emerald-700 transition-all hover:scale-[102%] active:scale-95">
              Mulai Manajemen Lahan
            </router-link>
            <a href="#fitur" class="flex h-14 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-8 text-base font-bold text-slate-700 transition-all hover:text-slate-900 active:scale-95">
              Pelajari Fitur
            </a>
          </div>

          <!-- Stats Badges -->
          <div class="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200">
            <div>
              <p class="text-3xl sm:text-4xl font-extrabold text-slate-950">40%+</p>
              <p class="text-xs sm:text-sm text-slate-500 font-semibold mt-1">Efisiensi Air</p>
            </div>
            <div>
              <p class="text-3xl sm:text-4xl font-extrabold text-slate-950">100%</p>
              <p class="text-xs sm:text-sm text-slate-500 font-semibold mt-1">Berbasis Data Riil</p>
            </div>
            <div>
              <p class="text-3xl sm:text-4xl font-extrabold text-slate-950">2.4x</p>
              <p class="text-xs sm:text-sm text-slate-500 font-semibold mt-1">Ketahanan Kekeringan</p>
            </div>
          </div>
        </div>

        <!-- Hero Right / Visual Graphic Mockup -->
        <div class="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
          <div class="relative w-full max-w-[450px] aspect-square rounded-3xl border border-slate-300 bg-white p-6 overflow-hidden group">
            <div class="relative h-full flex flex-col justify-between space-y-4">
              <!-- Simulated Widget Header -->
              <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                <div class="flex items-center gap-2.5">
                  <div class="h-3 w-3 rounded-full bg-emerald-600 animate-ping"></div>
                  <span class="text-xs font-bold text-slate-600 tracking-wide uppercase">Live Monitor: Klaster Lahan</span>
                </div>
                <div class="rounded-full bg-emerald-50 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  Resiliensi Baik
                </div>
              </div>

              <!-- Simulating Dashboard Content -->
              <div class="flex-grow space-y-4 py-2">
                <!-- Mini Weather Card -->
                <div class="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Sun class="h-7 w-7 text-amber-500 animate-pulse" />
                    <div>
                      <h4 class="text-xs font-bold text-slate-700">Cuaca Hari Ini</h4>
                      <p class="text-[10px] text-slate-500 font-semibold">Cerah Berawan</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-base font-black text-slate-900">32°C</p>
                    <p class="text-[9px] text-emerald-600 font-bold">ET0: 4.2 mm/d</p>
                  </div>
                </div>

                <!-- Live Risk Bar -->
                <div class="space-y-1.5">
                  <div class="flex justify-between text-xs">
                    <span class="font-bold text-slate-500">Skor Ketahanan</span>
                    <span class="font-black text-emerald-600">82 / 100</span>
                  </div>
                  <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div class="h-full bg-emerald-500 rounded-full" style="width: 82%"></div>
                  </div>
                </div>

                <!-- Simulated Map Snippet -->
                <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-3 relative overflow-hidden">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Persebaran Air Irigasi</span>
                    <span class="text-[10px] text-sky-600 font-bold">120.000 L Tersedia</span>
                  </div>
                  <!-- Simulated Bar Graph -->
                  <div class="space-y-1.5 pt-1.5">
                    <div class="flex items-center justify-between text-[10px]">
                      <span class="text-slate-600 font-semibold">Lahan Padi A</span>
                      <span class="text-slate-900 font-bold">42.000 L (Tinggi)</span>
                    </div>
                    <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div class="h-full bg-emerald-500" style="width: 85%"></div>
                    </div>

                    <div class="flex items-center justify-between text-[10px]">
                      <span class="text-slate-600 font-semibold">Lahan Jagung B</span>
                      <span class="text-slate-900 font-bold">28.000 L (Sedang)</span>
                    </div>
                    <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div class="h-full bg-teal-500" style="width: 60%"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Simulated Footer Widget -->
              <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div class="flex items-center gap-1.5">
                  <Flame class="h-3.5 w-3.5 text-amber-600" />
                  <span class="font-medium">El Niño: Level 1</span>
                </div>
                <span class="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-600">AKTIF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features Section -->
    <section id="fitur" class="py-24 border-t border-slate-200/80 bg-white relative px-4 md:px-8">
      <div class="container mx-auto">
        <!-- Section Header -->
        <div class="max-w-2xl mx-auto text-center space-y-4 mb-16">
          <span class="text-xs font-bold uppercase tracking-widest text-emerald-600">FITUR PILAR UTAMA</span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900">
            Solusi Presisi untuk Pertanian Modern
          </h2>
          <p class="text-slate-505 text-slate-500 text-sm md:text-base leading-relaxed">
            air.in mengintegrasikan data cuaca global, formula sains tanah-tanaman, dan algoritma alokasi air cerdas dalam satu antarmuka yang intuitif.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Feature 1 -->
          <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-emerald-500 hover:bg-white hover:-translate-y-1 duration-300 group">
            <div class="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 transition-transform group-hover:scale-110 border border-emerald-200/50">
              <Map class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Pemetaan Lahan GIS</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              Petakan poligon petak sawah menggunakan koordinat GIS yang akurat dengan integrasi Leaflet Map, memudahkan pemantauan kepemilikan dan batas lahan.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-sky-500 hover:bg-white hover:-translate-y-1 duration-300 group">
            <div class="h-12 w-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 transition-transform group-hover:scale-110 border border-sky-200/50">
              <Activity class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Perhitungan Evapotranspirasi</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              Memperkirakan Evapotranspirasi Potensial (ET0) secara real-time berdasarkan data suhu, kecepatan angin, kelembaban udara dari Open-Meteo API.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-teal-500 hover:bg-white hover:-translate-y-1 duration-300 group">
            <div class="h-12 w-12 rounded-xl bg-teal-55 bg-teal-50 text-teal-600 flex items-center justify-center mb-5 transition-transform group-hover:scale-110 border border-teal-200/50">
              <Scale class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Algoritma Alokasi Adil</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              Membagi debit air secara proporsional sesuai tingkat risiko kelangkaan air, tipe tanah, dan fase tumbuh tanaman demi mencegah gagal panen total.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-amber-500 hover:bg-white hover:-translate-y-1 duration-300 group">
            <div class="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 transition-transform group-hover:scale-110 border border-amber-200/50">
              <Calendar class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Jadwal Irigasi Otomatis</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              Membuat daftar jadwal penyiraman otomatis yang dikelompokkan berdasarkan tanggal, lengkap dengan kalkulasi volume liter air yang diperlukan.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="skema" class="py-24 border-t border-slate-200/80 bg-slate-50/50 relative px-4 md:px-8">
      <div class="container mx-auto">
        <!-- Section Header -->
        <div class="max-w-2xl mx-auto text-center space-y-4 mb-20">
          <span class="text-xs font-bold uppercase tracking-widest text-emerald-600">ALUR KERJA</span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900">
            Bagaimana air.in Melindungi Lahan Anda?
          </h2>
          <p class="text-slate-500 text-sm">
            Hanya butuh 4 langkah mudah untuk mengamankan kebutuhan air klaster pertanian Anda.
          </p>
        </div>

        <!-- Workflow Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <!-- Step 1 -->
          <div class="relative space-y-4 text-center md:text-left group">
            <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-xl font-black text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-500/40 transition-all">
              01
            </div>
            <h3 class="text-lg font-bold text-slate-950">Petakan Poligon Lahan</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              Gambar batas-batas petak lahan pertanian Anda secara visual menggunakan editor peta GIS yang mudah diakses.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="relative space-y-4 text-center md:text-left group">
            <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-xl font-black text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-500/40 transition-all">
              02
            </div>
            <h3 class="text-lg font-bold text-slate-950">Input Jenis &amp; Fase Tumbuh</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              Tentukan jenis tanah (liat, lempung, berpasir) serta fase tumbuh tanaman untuk disesuaikan dengan koefisien tanaman (Kc).
            </p>
          </div>

          <!-- Step 3 -->
          <div class="relative space-y-4 text-center md:text-left group">
            <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-xl font-black text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-500/40 transition-all">
              03
            </div>
            <h3 class="text-lg font-bold text-slate-950">Sinkronisasi Data Cuaca</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              Platform secara berkala mengambil prakiraan iklim eksternal dan menetapkan indeks ancaman keparahan El Niño saat ini.
            </p>
          </div>

          <!-- Step 4 -->
          <div class="relative space-y-4 text-center md:text-left group">
            <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-xl font-black text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-500/40 transition-all">
              04
            </div>
            <h3 class="text-lg font-bold text-slate-950">Alokasikan Air Secara Adil</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              Dapatkan rekomendasi volume distribusi air yang presisi beserta kalender jadwal irigasi adaptif.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Harvey/air.in Resilience Score highlight -->
    <section id="skor" class="py-24 border-t border-slate-200/80 bg-white relative overflow-hidden px-4 md:px-8">
      <div class="container mx-auto">
        <div class="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row gap-12 items-center">
          <!-- Left content -->
          <div class="space-y-6 lg:max-w-2xl text-left">
            <div class="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-50 px-3.5 py-1 text-xs font-bold text-sky-700">
              <ShieldCheck class="h-4 w-4" />
              <span>Resiliensi Klaster Pertanian</span>
            </div>
            <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              Ketahui Ketahanan Lahan Melalui <span class="text-emerald-600">air.in Score</span>
            </h2>
            <p class="text-slate-500 text-sm md:text-base leading-relaxed">
              Aplikasi kami secara otomatis mengkalkulasikan skor ketahanan kumulatif (skala 0-100) untuk seluruh klaster lahan Anda. Skor ini dihitung dari rasio kecukupan volume air terhadap kebutuhan transpirasi, dikalibrasi dengan kelembaban tanah dan dampak suhu udara ekstrem.
            </p>
            <div class="space-y-3 pt-2">
              <div class="flex items-center gap-3">
                <div class="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/50">
                  <span class="text-xs font-bold">✓</span>
                </div>
                <span class="text-sm font-semibold text-slate-600">Pemantauan risiko kekeringan (Kritis, Tinggi, Sedang, Rendah)</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/50">
                  <span class="text-xs font-bold">✓</span>
                </div>
                <span class="text-sm font-semibold text-slate-600">Simulasi El Niño real-time untuk penghematan air preventif</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/50">
                  <span class="text-xs font-bold">✓</span>
                </div>
                <span class="text-sm font-semibold text-slate-600">Optimalisasi pasokan terbatas tanpa mengorbankan pertumbuhan crop</span>
              </div>
            </div>
          </div>

          <!-- Right Content (Interactive representation) -->
          <div class="flex justify-center w-full lg:w-auto">
            <div class="rounded-2xl border border-slate-200 bg-white p-6 w-full max-w-[320px] text-center space-y-6">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Metrik Indeks Klaster</h3>
              <div class="relative flex items-center justify-center">
                <!-- Circular Indicator Simulator -->
                <svg class="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="#f1f5f9" stroke-width="12" fill="transparent" />
                  <circle cx="72" cy="72" r="60" stroke="#10b981" stroke-width="12" stroke-dasharray="377" stroke-dashoffset="67" fill="transparent" stroke-linecap="round" class="transition-all duration-1000" />
                </svg>
                <div class="absolute flex flex-col items-center">
                  <span class="text-4xl font-black text-slate-900">82</span>
                  <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Sangat Baik</span>
                </div>
              </div>
              <p class="text-xs text-slate-500 leading-relaxed px-2">
                Resiliensi tinggi berarti klaster sawah siap memitigasi dampak defisit curah hujan El Niño minggu ini.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section id="teknologi" class="py-24 border-t border-slate-200/80 bg-slate-50/50 relative px-4 md:px-8">
      <div class="container mx-auto text-center">
        <!-- Section Header -->
        <div class="max-w-2xl mx-auto text-center space-y-4 mb-16">
          <span class="text-xs font-bold uppercase tracking-widest text-emerald-600">STACK TEKNOLOGI</span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900">
            Dibangun dengan Infrastruktur Modern
          </h2>
          <p class="text-slate-505 text-slate-500 text-sm md:text-base leading-relaxed">
            Aplikasi pertanian pintar air.in ditenagai oleh pustaka andal untuk performa komputasi dan analisis spasial yang optimal.
          </p>
        </div>

        <!-- Tech Cards -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <!-- Vue 3 -->
          <div class="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center space-y-3 hover:border-emerald-500/20 transition-all duration-300">
            <svg class="h-10 w-10" viewBox="0 0 256 221" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path fill="#41B883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z"/><path fill="#35495E" d="M0 0h97.92L128 51.2L157.44 0h47.36L128 107.52L0 0Z"/></svg>
            <span class="text-sm font-bold text-slate-800">Vue 3</span>
            <span class="text-[10px] text-slate-400">Framework Reaktif</span>
          </div>

          <!-- Pinia -->
          <div class="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center space-y-3 hover:border-emerald-500/20 transition-all duration-300">
            <svg class="h-10 w-10" viewBox="0 0 256 313" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#FFE56C" d="M128 313c63.7 0 102-42.5 102-108.8 0-77.9-52.6-118-102-118S26 126.3 26 204.2C26 270.5 64.3 313 128 313z"/><path fill="#FAD126" d="M128 313c32 0 68-15 88-58-15 15-46 22-88 22s-73-7-88-22c20 43 56 58 88 58z"/><path fill="#3AA675" d="M128 86c0-20-10-48-26-68 0 0 18 16 26 40 8-24 26-40 26-40-16 20-26 48-26 68z"/></svg>
            <span class="text-sm font-bold text-slate-800">Pinia Store</span>
            <span class="text-[10px] text-slate-400">Manajemen State</span>
          </div>

          <!-- Tailwind CSS -->
          <div class="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center space-y-3 hover:border-emerald-500/20 transition-all duration-300">
            <svg class="h-10 w-10" viewBox="0 0 256 154" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#38BDF8" d="M128 0C93.1 0 71.3 17.5 62.5 52.5c13.1-17.5 28.4-24 45.9-19.7 10 2.5 17.2 9.8 25.1 17.9 12.9 13.1 27.8 28.3 58.5 28.3 34.9 0 56.7-17.5 65.5-52.5-13.1 17.5-28.4 24-45.9 19.7-10-2.5-17.2-9.8-25.1-17.9C173.6 15.2 158.7 0 128 0zm-96 77C14.3 77 1.8 84.8 0 119c13.1-17.5 28.4-24 45.9-19.7 10 2.5 17.2 9.8 25.1 17.9 12.9 13.1 27.8 28.3 58.5 28.3 34.9 0 56.7-17.5 65.5-52.5-13.1 17.5-28.4 24-45.9 19.7-10-2.5-17.2-9.8-25.1-17.9C111.1 92.2 96.2 77 65.5 77z"/></svg>
            <span class="text-sm font-bold text-slate-800">Tailwind CSS</span>
            <span class="text-[10px] text-slate-400">Desain Utility-First</span>
          </div>

          <!-- Leaflet GIS -->
          <div class="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center space-y-3 hover:border-emerald-500/20 transition-all duration-300">
            <svg class="h-10 w-10" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="#B5DE7E" d="M128 0C78.4 0 0 51.5 0 140c0 52 41 116 128 116 87 0 128-64 128-116C256 51.5 177.6 0 128 0z"/><path fill="#7FB83C" d="M128 256c71.2 0 113.8-52.5 125.8-98-15.8 45.5-62 76.5-125.8 76.5S18 203.5 2.2 158c12 45.5 54.6 98 125.8 98z"/><path fill="#FFFFFF" d="M117 38c11-9 24.5-16.5 38.5-21C122.5 29.5 99 64.5 99 105c0 58.5 44.5 106 99 106 10.5 0 20.5-2 30-5.5C201.5 222.5 166.5 238 128 238c-66.5 0-110-53-110-119C18 53 78.5 38 117 38z"/></svg>
            <span class="text-sm font-bold text-slate-800">Leaflet Maps</span>
            <span class="text-[10px] text-slate-400">Pemetaan Spasial</span>
          </div>

          <!-- Turf.js -->
          <div class="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center space-y-3 hover:border-emerald-500/20 transition-all duration-300">
            <svg class="h-10 w-10" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><polygon points="128,18 223,73 223,183 128,238 33,183 33,73" fill="#2ECC71"/><polygon points="128,38 206,83 206,173 128,218 50,173 50,83" fill="#27AE60"/><circle cx="128" cy="128" r="30" fill="#FFFFFF"/><line x1="128" y1="38" x2="128" y2="98" stroke="#FFFFFF" stroke-width="6"/><line x1="50" y1="173" x2="102" y2="143" stroke="#FFFFFF" stroke-width="6"/><line x1="206" y1="173" x2="154" y2="143" stroke="#FFFFFF" stroke-width="6"/></svg>
            <span class="text-sm font-bold text-slate-800">Turf.js</span>
            <span class="text-[10px] text-slate-400">Analisis Geospasial</span>
          </div>

          <!-- Supabase -->
          <div class="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center space-y-3 hover:border-emerald-500/20 transition-all duration-300">
            <svg class="h-10 w-10" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="#3ECF8E" d="M141.5 0l-102 121.7c-3.1 3.7-.4 9.3 4.5 9.3h80l-28.5 125c-1.3 5.7 6.1 9.4 9.9 4.9l102-121.7c3.1-3.7.4-9.3-4.5-9.3h-80l28.5-125c1.3-5.7-6.1-9.4-9.9-4.9z"/></svg>
            <span class="text-sm font-bold text-slate-800">Supabase</span>
            <span class="text-[10px] text-slate-400">Cloud Database</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-24 border-t border-slate-200/80 bg-white relative overflow-hidden px-4 md:px-8">
      <div class="container mx-auto max-w-4xl text-center">
        <!-- Solid background banner card inside light mode -->
        <div class="rounded-3xl bg-emerald-600 text-white p-12 md:p-16 relative overflow-hidden border border-emerald-700">
          <div class="relative z-10 space-y-8">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              Maksimalkan Efisiensi Air Sawah Anda Hari Ini
            </h2>
            <p class="text-emerald-50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Jangan biarkan dampak buruk El Niño dan kekeringan merusak hasil panen tanaman pangan Anda. Beralihlah ke keputusan irigasi berbasis sains bersama air.in.
            </p>
            <div>
              <router-link to="/dashboard" class="relative inline-flex h-14 items-center justify-center rounded-xl bg-white px-10 text-base font-bold text-emerald-700 border border-slate-200 transition-all hover:scale-[102%] hover:bg-slate-50 active:scale-95">
                Buka Dashboard air.in Sekarang
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Simple Footer for Landing Page -->
    <footer class="border-t border-slate-200/80 bg-white py-10 px-4 md:px-8 text-xs text-slate-500">
      <div class="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold text-emerald-600 tracking-wider">air.in</span>
          <span>&copy; 2026 - Smart Agriculture &amp; Water Allocation System</span>
        </div>
        <div class="flex items-center gap-6">
          <a href="#fitur" class="hover:text-slate-800 transition-colors">Fitur</a>
          <a href="#skema" class="hover:text-slate-800 transition-colors">Alur</a>
          <a href="#skor" class="hover:text-slate-800 transition-colors">Skor Resiliensi</a>
          <a href="#teknologi" class="hover:text-slate-800 transition-colors">Teknologi</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  Droplets,
  ArrowRight,
  Map,
  Activity,
  Scale,
  Calendar,
  Sparkles,
  Sun,
  Flame,
  ShieldCheck
} from '@lucide/vue'
</script>
