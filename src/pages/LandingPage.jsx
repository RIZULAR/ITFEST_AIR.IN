/** @format */

import {
	useEffect,
	useRef,
	useState,
} from 'react';

import { Link } from 'react-router-dom';
import LogoImg from '@/assets/logo/logo.png';
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
	ShieldCheck,
	MapPin,
	Sprout,
	CloudSun
} from 'lucide-react';

function AnimatedSection({ children, delay = 0, className = "" }) {
	const ref = useRef();
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.unobserve(el);
				}
			},
			{ threshold: 0.12 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return (
		<div
			ref={ref}
			className={`fade-up ${visible ? "visible" : ""} ${className}`}
			style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
		>
			{children}
		</div>
	);
}

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden relative">

			{/* Header Navbar */}
			<header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
				<div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
					{/* Logo */}
					<div className="flex items-center gap-3">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white p-0.5 flex-shrink-0">
							<img src={LogoImg} className="h-full w-full object-contain" alt="air.in Logo" />
						</div>
						<div>
							<span className="text-2xl font-black tracking-tight text-emerald-600 block leading-tight">air.in</span>
							<p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Agriculture Platform</p>
						</div>
					</div>

					{/* Navigation Links (Desktop) */}
					<nav className="hidden md:flex items-center gap-8">
						<a href="#fitur" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Fitur Utama</a>
						<a href="#skema" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Cara Kerja</a>
						<a href="#skor" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Resiliensi</a>
						<a href="#teknologi" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Teknologi</a>
					</nav>

					{/* CTA Button */}
					<div>
						<Link to="/dashboard" className="relative inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 text-sm font-bold text-white border border-emerald-700 transition-all hover:scale-[102%] active:scale-95">
							Buka Dashboard
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-4 md:px-8 bg-slate-100/60 border-b border-slate-200/50 overflow-hidden">
				{/* Background Grid Effect (Kotak-kotak) */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1.2px,transparent_1.2px),linear-gradient(to_bottom,#cbd5e1_1.2px,transparent_1.2px)] bg-[size:2.2rem_2.2rem] [mask-image:radial-gradient(ellipse_85%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60"></div>

				{/* Soft Gray Ambient Glow */}
				<div className="absolute top-1/2 -translate-y-1/2 left-0 w-[55%] h-[75%] bg-slate-100/95 rounded-full filter blur-3xl pointer-events-none"></div>

				<div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
					{/* Hero Left / Copywriting */}
					<div className="lg:col-span-7 space-y-8 text-left relative z-10">
						<div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
							<Sparkles className="h-4 w-4 text-emerald-600" />
							<span>Solusi Cerdas Irigasi Menghadapi El Niño</span>
						</div>

						<h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
							Optimalisasi Air,<br />
							<span className="text-emerald-600">Maksimalkan Hasil Panen</span>
						</h1>

						<p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
							<strong className="text-emerald-600 font-semibold">air.in</strong> adalah platform pengelolaan air pertanian terpadu yang dirancang khusus untuk mendistribusikan pasokan air irigasi secara presisi, adil, dan efisien berbasis data cuaca, fase tanaman, dan tingkat keparahan kekeringan.
						</p>

						{/* Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 pt-2">
							<Link to="/dashboard" className="flex h-14 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 px-8 text-base font-bold text-white border border-emerald-700 transition-all hover:scale-[102%] active:scale-95">
								Mulai Manajemen Lahan
							</Link>
							<a href="#fitur" className="flex h-14 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-8 text-base font-bold text-slate-700 transition-all hover:text-slate-900 active:scale-95">
								Pelajari Fitur
							</a>
						</div>

						{/* Stats Badges */}
						<div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200">
							<div>
								<p className="text-3xl sm:text-4xl font-extrabold text-slate-950">40%+</p>
								<p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">Efisiensi Air</p>
							</div>
							<div>
								<p className="text-3xl sm:text-4xl font-extrabold text-slate-950">100%</p>
								<p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">Berbasis Data Riil</p>
							</div>
							<div>
								<p className="text-3xl sm:text-4xl font-extrabold text-slate-950">2.4x</p>
								<p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">Ketahanan Kekeringan</p>
							</div>
						</div>
					</div>

					{/* Hero Right / Visual Graphic Mockup */}
					<div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
						<div className="relative w-full max-w-[450px] aspect-square rounded-3xl border border-slate-300 bg-white p-6 overflow-hidden group">
							<div className="relative h-full flex flex-col justify-between space-y-4">
								{/* Simulated Widget Header */}
								<div className="flex items-center justify-between border-b border-slate-100 pb-4">
									<div className="flex items-center gap-2.5">
										<div className="h-3 w-3 rounded-full bg-emerald-600 animate-ping"></div>
										<span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Live Monitor: Klaster Lahan</span>
									</div>
									<div className="rounded-full bg-emerald-50 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
										Resiliensi Baik
									</div>
								</div>

								{/* Simulating Dashboard Content */}
								<div className="flex-grow space-y-4 py-2">
									{/* Mini Weather Card */}
									<div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex items-center justify-between">
										<div className="flex items-center gap-3">
											<Sun className="h-7 w-7 text-amber-500 animate-pulse" />
											<div>
												<h4 className="text-xs font-bold text-slate-700">Cuaca Hari Ini</h4>
												<p className="text-[10px] text-slate-500 font-semibold">Cerah Berawan</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-base font-black text-slate-900">32°C</p>
											<p className="text-[9px] text-emerald-600 font-bold">ET0: 4.2 mm/d</p>
										</div>
									</div>

									{/* Live Risk Bar */}
									<div className="space-y-1.5">
										<div className="flex justify-between text-xs">
											<span className="font-bold text-slate-500">Skor Ketahanan</span>
											<span className="font-black text-emerald-600">82 / 100</span>
										</div>
										<div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
											<div className="h-full bg-emerald-500 rounded-full" style={{ width: "82%" }}></div>
										</div>
									</div>

									{/* Simulated Map Snippet */}
									<div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 relative overflow-hidden">
										<div className="flex justify-between items-center mb-1">
											<span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Persebaran Air Irigasi</span>
											<span className="text-[10px] text-sky-600 font-bold">120.000 L Tersedia</span>
										</div>
										{/* Simulated Bar Graph */}
										<div className="space-y-1.5 pt-1.5">
											<div className="flex items-center justify-between text-[10px]">
												<span className="text-slate-600 font-semibold">Lahan Padi A</span>
												<span className="text-slate-900 font-bold">42.000 L (Tinggi)</span>
											</div>
											<div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
												<div className="h-full bg-emerald-500" style={{ width: "85%" }}></div>
											</div>

											<div className="flex items-center justify-between text-[10px]">
												<span className="text-slate-600 font-semibold">Lahan Jagung B</span>
												<span className="text-slate-900 font-bold">28.000 L (Sedang)</span>
											</div>
											<div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
												<div className="h-full bg-teal-500" style={{ width: "60%" }}></div>
											</div>
										</div>
									</div>
								</div>

								{/* Simulated Footer Widget */}
								<div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
									<div className="flex items-center gap-1.5">
										<Flame className="h-3.5 w-3.5 text-amber-600" />
										<span className="font-medium">El Niño: Level 1</span>
									</div>
									<span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-600">AKTIF</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Key Features Section */}
			<section id="fitur" className="py-24 border-t border-slate-200/80 bg-white relative px-4 md:px-8 overflow-hidden">
				{/* Background Grid Effect (Kotak-kotak) */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1.2px,transparent_1.2px),linear-gradient(to_bottom,#cbd5e1_1.2px,transparent_1.2px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_65%,transparent_100%)] pointer-events-none opacity-50"></div>
				<div className="container mx-auto relative z-10">
					{/* Section Header */}
					<div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
						<span className="text-xs font-bold uppercase tracking-widest text-emerald-600">FITUR PILAR UTAMA</span>
						<h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
							Solusi Presisi untuk Pertanian Modern
						</h2>
						<p className="text-slate-500 text-sm md:text-base leading-relaxed">
							air.in mengintegrasikan data cuaca global, formula sains tanah-tanaman, dan algoritma alokasi air cerdas dalam satu antarmuka yang intuitif.
						</p>
					</div>

					{/* Features Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{/* Feature 1 */}
						<div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-emerald-500 hover:bg-white hover:-translate-y-1 duration-300 group">
							<div className="h-12 w-12 rounded-xl bg-emerald-55 bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 transition-transform group-hover:scale-110 border border-emerald-200/50">
								<Map className="h-6 w-6" />
							</div>
							<h3 className="text-lg font-bold text-slate-900 mb-2">Pemetaan Lahan GIS</h3>
							<p className="text-sm text-slate-500 leading-relaxed">
								Petakan poligon petak sawah menggunakan koordinat GIS yang akurat dengan integrasi Leaflet Map, memudahkan pemantauan kepemilikan dan batas lahan.
							</p>
						</div>

						{/* Feature 2 */}
						<div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-sky-500 hover:bg-white hover:-translate-y-1 duration-300 group">
							<div className="h-12 w-12 rounded-xl bg-sky-55 bg-sky-55/10 bg-sky-50 text-sky-600 flex items-center justify-center mb-5 transition-transform group-hover:scale-110 border border-sky-200/50">
								<Activity className="h-6 w-6" />
							</div>
							<h3 className="text-lg font-bold text-slate-900 mb-2">Perhitungan Evapotranspirasi</h3>
							<p className="text-sm text-slate-500 leading-relaxed">
								Memperkirakan Evapotranspirasi Potensial (ET0) secara real-time berdasarkan data suhu, kecepatan angin, kelembaban udara dari Open-Meteo API.
							</p>
						</div>

						{/* Feature 3 */}
						<div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-teal-500 hover:bg-white hover:-translate-y-1 duration-300 group">
							<div className="h-12 w-12 rounded-xl bg-teal-55/10 bg-teal-50 text-teal-600 flex items-center justify-center mb-5 transition-transform group-hover:scale-110 border border-teal-200/50">
								<Scale className="h-6 w-6" />
							</div>
							<h3 className="text-lg font-bold text-slate-900 mb-2">Algoritma Alokasi Adil</h3>
							<p className="text-sm text-slate-500 leading-relaxed">
								Membagi debit air secara proporsional sesuai tingkat risiko kelangkaan air, tipe tanah, dan fase tumbuh tanaman demi mencegah gagal panen total.
							</p>
						</div>

						{/* Feature 4 */}
						<div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-amber-500 hover:bg-white hover:-translate-y-1 duration-300 group">
							<div className="h-12 w-12 rounded-xl bg-amber-55/10 bg-amber-50 text-amber-600 flex items-center justify-center mb-5 transition-transform group-hover:scale-110 border border-amber-200/50">
								<Calendar className="h-6 w-6" />
							</div>
							<h3 className="text-lg font-bold text-slate-900 mb-2">Jadwal Irigasi Otomatis</h3>
							<p className="text-sm text-slate-500 leading-relaxed">
								Membuat daftar jadwal penyiraman otomatis yang dikelompokkan berdasarkan tanggal, lengkap dengan kalkulasi volume liter air yang diperlukan.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section id="skema" className="py-24 border-t border-slate-200/80 bg-slate-50/50 relative px-4 md:px-8 overflow-hidden">
				{/* Background Grid Effect (Kotak-kotak) */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1.2px,transparent_1.2px),linear-gradient(to_bottom,#cbd5e1_1.2px,transparent_1.2px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_65%,transparent_100%)] pointer-events-none opacity-50 z-0"></div>

				{/* Content Container */}
				<div className="container mx-auto relative z-10">
					{/* Section Header */}
					<div className="max-w-2xl mx-auto text-center space-y-4 mb-20">
						<span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200/40 px-3 py-1 rounded-full">ALUR KERJA</span>
						<h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
							Bagaimana air.in Melindungi Lahan Anda?
						</h2>
						<p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
							Hanya butuh 4 langkah mudah untuk mengamankan kebutuhan air irigasi klaster pertanian Anda secara presisi.
						</p>
					</div>

					{/* Workflow Grid with Solid White Cards to Block Out Grid Lines */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
						{/* Step 1 */}
						<div className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-emerald-500 hover:-translate-y-1 hover:shadow-xs">
							<div className="flex items-center justify-between mb-5">
								<span className="text-[10px] font-extrabold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/50 rounded-lg px-2 py-0.5 uppercase">Langkah 01</span>
								<div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
									<MapPin className="h-5 w-5" />
								</div>
							</div>
							<h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">Petakan Poligon Lahan</h3>
							<p className="text-xs text-slate-500 leading-relaxed">
								Gambar batas-batas petak lahan pertanian Anda secara visual menggunakan editor peta GIS yang mudah diakses di dasbor.
							</p>
						</div>

						{/* Step 2 */}
						<div className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-emerald-500 hover:-translate-y-1 hover:shadow-xs">
							<div className="flex items-center justify-between mb-5">
								<span className="text-[10px] font-extrabold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/50 rounded-lg px-2 py-0.5 uppercase">Langkah 02</span>
								<div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
									<Sprout className="h-5 w-5" />
								</div>
							</div>
							<h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">Input Jenis &amp; Fase Tumbuh</h3>
							<p className="text-xs text-slate-500 leading-relaxed">
								Tentukan tipe tanah (liat, lempung, berpasir) serta fase tumbuh tanaman untuk disesuaikan dengan koefisien tanaman (Kc).
							</p>
						</div>

						{/* Step 3 */}
						<div className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-emerald-500 hover:-translate-y-1 hover:shadow-xs">
							<div className="flex items-center justify-between mb-5">
								<span className="text-[10px] font-extrabold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/50 rounded-lg px-2 py-0.5 uppercase">Langkah 03</span>
								<div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
									<CloudSun className="h-5 w-5" />
								</div>
							</div>
							<h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">Sinkronisasi Data Cuaca</h3>
							<p className="text-xs text-slate-500 leading-relaxed">
								Platform secara berkala mengambil prakiraan iklim eksternal (Open-Meteo) dan menetapkan ancaman El Niño saat ini.
							</p>
						</div>

						{/* Step 4 */}
						<div className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-emerald-500 hover:-translate-y-1 hover:shadow-xs">
							<div className="flex items-center justify-between mb-5">
								<span className="text-[10px] font-extrabold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/50 rounded-lg px-2 py-0.5 uppercase">Langkah 04</span>
								<div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
									<Droplets className="h-5 w-5" />
								</div>
							</div>
							<h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">Alokasikan Air Secara Adil</h3>
							<p className="text-xs text-slate-500 leading-relaxed">
								Dapatkan rekomendasi volume distribusi air yang presisi beserta kalender jadwal irigasi adaptif bagi klaster pertanian.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Resiliensi Score Highlight */}
			<section id="skor" className="py-24 border-t border-slate-200/80 bg-white relative overflow-hidden px-4 md:px-8">
				{/* Background Grid Effect (Kotak-kotak) */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1.2px,transparent_1.2px),linear-gradient(to_bottom,#cbd5e1_1.2px,transparent_1.2px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_65%,transparent_100%)] pointer-events-none opacity-50"></div>
				<div className="container mx-auto relative z-10">
					<div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row gap-12 items-center">
						{/* Left content */}
						<div className="space-y-6 lg:max-w-2xl text-left">
							<div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-50 px-3.5 py-1 text-xs font-bold text-sky-700">
								<ShieldCheck className="h-4 w-4" />
								<span>Resiliensi Klaster Pertanian</span>
							</div>
							<h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
								Ketahui Ketahanan Lahan Melalui <span className="text-emerald-600">air.in Score</span>
							</h2>
							<p className="text-slate-500 text-sm md:text-base leading-relaxed">
								Aplikasi kami secara otomatis mengkalkulasikan skor ketahanan kumulatif (skala 0-100) untuk seluruh klaster lahan Anda. Skor ini dihitung dari rasio kecukupan volume air terhadap kebutuhan transpirasi, dikalibrasi dengan kelembaban tanah dan dampak suhu udara ekstrem.
							</p>
							<div className="space-y-3 pt-2">
								<div className="flex items-center gap-3">
									<div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/50">
										<span className="text-xs font-bold">✓</span>
									</div>
									<span className="text-sm font-semibold text-slate-600">Pemantauan risiko kekeringan (Kritis, Tinggi, Sedang, Rendah)</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/50">
										<span className="text-xs font-bold">✓</span>
									</div>
									<span className="text-sm font-semibold text-slate-600">Simulasi El Niño real-time untuk penghematan air preventif</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/50">
										<span className="text-xs font-bold">✓</span>
									</div>
									<span className="text-sm font-semibold text-slate-600">Optimalisasi pasokan terbatas tanpa mengorbankan pertumbuhan crop</span>
								</div>
							</div>
						</div>

						{/* Right Content */}
						<div className="flex justify-center w-full lg:w-auto">
							<div className="rounded-2xl border border-slate-200 bg-white p-6 w-full max-w-[320px] text-center space-y-6">
								<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metrik Indeks Klaster</h3>
								<div className="relative flex items-center justify-center">
									<svg className="w-36 h-36 transform -rotate-90">
										<circle cx="72" cy="72" r="60" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
										<circle cx="72" cy="72" r="60" stroke="#10b981" strokeWidth="12" strokeDasharray="377" strokeDashoffset="67" fill="transparent" strokeLinecap="round" className="transition-all duration-1000" />
									</svg>
									<div className="absolute flex flex-col items-center">
										<span className="text-4xl font-black text-slate-900">82</span>
										<span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Sangat Baik</span>
									</div>
								</div>
								<p className="text-xs text-slate-500 leading-relaxed px-2">
									Resiliensi tinggi berarti klaster sawah siap memitigasi dampak defisit curah hujan El Niño minggu ini.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Tech Stack Section */}
			<section id="teknologi" className="py-24 border-t border-slate-200/80 bg-slate-50/50 relative px-4 md:px-8 overflow-hidden">
				{/* Background Grid Effect (Kotak-kotak) */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1.2px,transparent_1.2px),linear-gradient(to_bottom,#cbd5e1_1.2px,transparent_1.2px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_65%,transparent_100%)] pointer-events-none opacity-50"></div>
				<div className="container mx-auto relative z-10 text-center">
					{/* Section Header */}
					<div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
						<span className="text-xs font-bold uppercase tracking-widest text-emerald-600">STACK TEKNOLOGI</span>
						<h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
							Dibangun dengan Infrastruktur Modern
						</h2>
						<p className="text-slate-500 text-sm md:text-base leading-relaxed">
							Aplikasi irigasi pintar air.in ditenagai oleh pustaka andal untuk performa komputasi dan analisis spasial yang optimal.
						</p>
					</div>

					{/* Tech Cards */}
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
						{/* React */}
						<div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center space-y-3 hover:border-emerald-500/20 transition-all duration-300">
							<svg className="h-10 w-10" viewBox="0 0 256 228" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path fill="#00D8FF" d="M217.6 113.8c0-3.3-.3-6.5-1-9.5 4.3-7.5 7.4-15.6 9-23.9 1.1-5.7.8-11.4-1-16.7-2.6-7.8-8.7-14-16.5-16.5-5.3-1.8-11-2.1-16.7-1-8.3 1.6-16.4 4.7-23.9 9-6.3-1.4-13-1.4-19.3 0-7.5-4.3-15.6-7.4-23.9-9-5.7-1.1-11.4-.8-16.7 1-7.8 2.6-14 8.7-16.5 16.5-1.8 5.3-2.1 11-1 16.7 1.6 8.3 4.7 16.4 9 23.9-1.4 6.3-1.4 13 0 19.3-4.3 7.5-7.4 15.6-9 23.9-1.1 5.7-.8 11.4 1 16.7 2.6 7.8 8.7 14 16.5 16.5 5.3 1.8 11 2.1 16.7 1 8.3-1.6 16.4-4.7 23.9-9 6.3 1.4 13 1.4 19.3 0 7.5 4.3 15.6 7.4 23.9 9 5.7 1.1 11.4.8 16.7-1 7.8-2.6 14-8.7 16.5-16.5 1.8-5.3 2.1-11 1-16.7-1.6-8.3-4.7-16.4-9-23.9 1.4-6.3 1.4-13 0-19.3zM128 92.4c11.8 0 21.4 9.6 21.4 21.4s-9.6 21.4-21.4 21.4-21.4-9.6-21.4-21.4 9.6-21.4 21.4-21.4zm68.2 46.8c-.8 3.3-2.3 6.3-4.4 8.8-3 3.6-7.5 5.8-12.2 6.1-5 .3-10-1-14.2-3.8-6.1-4-11.4-9.1-15.6-15-5.9 4.2-11 9.5-15 15.6-2.8 4.2-4.1 9.2-3.8 14.2.3 4.7 2.5 9.2 6.1 12.2 2.5 2.1 5.5 3.6 8.8 4.4 4.9 1.2 10 .8 14.6-1.2 5.5-2.4 10.3-6 14-10.7 4.7-5.9 8.3-12.5 10.7-19.5 2 4.6 2.4 9.7 1.2 14.6-2.4 5.5-6 10.3-10.7 14-5.9 4.7-12.5 8.3-19.5 10.7z"/></svg>
							<span className="text-sm font-bold text-slate-800">React 19</span>
							<span className="text-[10px] text-slate-400">Library UI</span>
						</div>

						{/* Material-UI */}
						<div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center space-y-3 hover:border-emerald-500/20 transition-all duration-300">
							<svg className="h-10 w-10" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="#0081CB" d="M0 256l128-73.88L256 256V108.24L128 34.36 0 108.24z"/></svg>
							<span className="text-sm font-bold text-slate-800">Material UI</span>
							<span className="text-[10px] text-slate-400">Komponen UI</span>
						</div>

						{/* Tailwind CSS */}
						<div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center space-y-3 hover:border-emerald-500/20 transition-all duration-300">
							<svg className="h-10 w-10" viewBox="0 0 256 154" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#38BDF8" d="M128 0C93.1 0 71.3 17.5 62.5 52.5c13.1-17.5 28.4-24 45.9-19.7 10 2.5 17.2 9.8 25.1 17.9 12.9 13.1 27.8 28.3 58.5 28.3 34.9 0 56.7-17.5 65.5-52.5-13.1 17.5-28.4 24-45.9 19.7-10-2.5-17.2-9.8-25.1-17.9C173.6 15.2 158.7 0 128 0zm-96 77C14.3 77 1.8 84.8 0 119c13.1-17.5 28.4-24 45.9-19.7 10 2.5 17.2 9.8 25.1 17.9 12.9 13.1 27.8 28.3 58.5 28.3 34.9 0 56.7-17.5 65.5-52.5-13.1 17.5-28.4 24-45.9 19.7-10-2.5-17.2-9.8-25.1-17.9C111.1 92.2 96.2 77 65.5 77z"/></svg>
							<span className="text-sm font-bold text-slate-800">Tailwind CSS</span>
							<span className="text-[10px] text-slate-400">Desain Utility-First</span>
						</div>

						{/* Leaflet GIS */}
						<div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center space-y-3 hover:border-emerald-500/20 transition-all duration-300">
							<svg className="h-10 w-10" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="#B5DE7E" d="M128 0C78.4 0 0 51.5 0 140c0 52 41 116 128 116 87 0 128-64 128-116C256 51.5 177.6 0 128 0z"/><path fill="#7FB83C" d="M128 256c71.2 0 113.8-52.5 125.8-98-15.8 45.5-62 76.5-125.8 76.5S18 203.5 2.2 158c12 45.5 54.6 98 125.8 98z"/><path fill="#FFFFFF" d="M117 38c11-9 24.5-16.5 38.5-21C122.5 29.5 99 64.5 99 105c0 58.5 44.5 106 99 106 10.5 0 20.5-2 30-5.5C201.5 222.5 166.5 238 128 238c-66.5 0-110-53-110-119C18 53 78.5 38 117 38z"/></svg>
							<span className="text-sm font-bold text-slate-800">Leaflet Maps</span>
							<span className="text-[10px] text-slate-400">Pemetaan Spasial</span>
						</div>

						{/* Turf.js */}
						<div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center space-y-3 hover:border-emerald-500/20 transition-all duration-300">
							<svg className="h-10 w-10" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><polygon points="128,18 223,73 223,183 128,238 33,183 33,73" fill="#2ECC71"/><polygon points="128,38 206,83 206,173 128,218 50,173 50,83" fill="#27AE60"/><circle cx="128" cy="128" r="30" fill="#FFFFFF"/><line x1="128" y1="38" x2="128" y2="98" stroke="#FFFFFF" strokeWidth="6"/><line x1="50" y1="173" x2="102" y2="143" stroke="#FFFFFF" strokeWidth="6"/><line x1="206" y1="173" x2="154" y2="143" stroke="#FFFFFF" strokeWidth="6"/></svg>
							<span className="text-sm font-bold text-slate-800">Turf.js</span>
							<span className="text-[10px] text-slate-400">Analisis Geospasial</span>
						</div>

						{/* Supabase */}
						<div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center space-y-3 hover:border-emerald-500/20 transition-all duration-300">
							<svg className="h-10 w-10" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="#3ECF8E" d="M141.5 0l-102 121.7c-3.1 3.7-.4 9.3 4.5 9.3h80l-28.5 125c-1.3 5.7 6.1 9.4 9.9 4.9l102-121.7c3.1-3.7.4-9.3-4.5-9.3h-80l28.5-125c1.3-5.7-6.1-9.4-9.9-4.9z"/></svg>
							<span className="text-sm font-bold text-slate-800">Supabase</span>
							<span className="text-[10px] text-slate-400">Cloud Database</span>
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action Section */}
			<section className="py-24 border-t border-slate-200/80 bg-white relative overflow-hidden px-4 md:px-8">
				{/* Background Grid Effect (Kotak-kotak) */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1.2px,transparent_1.2px),linear-gradient(to_bottom,#cbd5e1_1.2px,transparent_1.2px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_65%,transparent_100%)] pointer-events-none opacity-50"></div>
				<div className="container mx-auto max-w-4xl relative z-10 text-center">
					<div className="rounded-3xl bg-emerald-600 text-white p-12 md:p-16 relative overflow-hidden border border-emerald-700">
						<div className="relative z-10 space-y-8">
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
								Maksimalkan Efisiensi Air Sawah Anda Hari Ini
							</h2>
							<p className="text-emerald-50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
								Jangan biarkan dampak buruk El Niño dan kekeringan merusak hasil panen tanaman pangan Anda. Beralihlah ke keputusan irigasi berbasis sains bersama air.in.
							</p>
							<div>
								<Link to="/dashboard" className="relative inline-flex h-14 items-center justify-center rounded-xl bg-white px-10 text-base font-bold text-emerald-700 border border-slate-200 transition-all hover:scale-[102%] hover:bg-slate-50 active:scale-95">
									Buka Dashboard air.in Sekarang
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Simple Footer for Landing Page */}
			<footer className="border-t border-slate-200/80 bg-white py-10 px-4 md:px-8 text-xs text-slate-500 relative z-10">
				<div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-2">
						<span className="text-sm font-bold text-emerald-600 tracking-wider">air.in</span>
						<span>&copy; 2026 - Smart Agriculture &amp; Water Allocation System</span>
					</div>
					<div className="flex items-center gap-6">
						<a href="#fitur" className="hover:text-slate-800 transition-colors">Fitur</a>
						<a href="#skema" className="hover:text-slate-800 transition-colors">Alur</a>
						<a href="#skor" className="hover:text-slate-800 transition-colors">Skor Resiliensi</a>
						<a href="#teknologi" className="hover:text-slate-800 transition-colors">Teknologi</a>
					</div>
				</div>
			</footer>
		</div>
	);
}

