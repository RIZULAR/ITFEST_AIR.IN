import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginBgImg from '@/assets/images/login.webp';
import LogoImg from '@/assets/logo/logo.png';
import { signInWithPassword, signUp } from '../services/authService';

function Spinner() {
	return (
		<svg
			className="animate-spin h-5 w-5 text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			/>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
			/>
		</svg>
	);
}

export default function LoginPage() {
	const navigate = useNavigate();
	const [mode, setMode] = useState("login"); // 'login' | 'register'
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [successMsg, setSuccessMsg] = useState("");

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setSuccessMsg("");
		setLoading(true);

		if (mode === "login") {
			const { error } = await signInWithPassword(email, password);
			setLoading(false);
			if (error) {
				setError("Email atau Password salah/belum terdaftar.");
			} else {
				navigate("/dashboard/home");
			}
		} else {
			const { data, error } = await signUp(email, password);
			setLoading(false);
			if (error) {
				setError(error.message);
			} else if (data?.user?.identities?.length === 0) {
				setError("Email ini sudah terdaftar. Silakan pindah ke tab Masuk.");
			} else {
				setSuccessMsg("Pendaftaran berhasil! Silakan masuk dengan akun Anda.");
				setMode("login");
			}
		}
	}

	return (
		<div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
			{/* Background Image login.webp */}
			<img
				src={LoginBgImg}
				alt="Login Background"
				className="absolute inset-0 w-full h-full object-cover"
			/>

			{/* Overlay for contrast & readability */}
			<div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" />

			{/* Centered Glass Form Container without solid background */}
			<div className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl text-white">
				{/* Logo & Header */}
				<div className="flex items-center justify-center gap-3.5 mb-6">
					<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/90 p-1 flex-shrink-0 shadow-lg">
						<img src={LogoImg} className="h-full w-full object-contain" alt="air.in Logo" />
					</div>
					<div>
						<span className="text-3xl font-black tracking-tight text-white block leading-tight">air.in</span>
						<p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest leading-none mt-0.5">Agriculture Platform</p>
					</div>
				</div>

				{/* Tab Buttons */}
				<div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/10 mb-6">
					<button
						type="button"
						onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
						className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
							mode === "login"
								? "bg-emerald-600 text-white shadow-lg"
								: "text-white/70 hover:text-white hover:bg-white/5"
						}`}
					>
						Masuk Akun
					</button>
					<button
						type="button"
						onClick={() => { setMode("register"); setError(""); setSuccessMsg(""); }}
						className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
							mode === "register"
								? "bg-emerald-600 text-white shadow-lg"
								: "text-white/70 hover:text-white hover:bg-white/5"
						}`}
					>
						Daftar Baru
					</button>
				</div>

				{/* Subtitle */}
				<div className="mb-6 text-center">
					<h2 className="text-xl font-bold text-white">
						{mode === "login" ? "Masuk Platform" : "Daftar Akun air.in"}
					</h2>
					<p className="text-white/70 text-xs mt-1">
						{mode === "login"
							? "Masukkan Email & Password akun terdaftar Anda."
							: "Buat akun baru untuk mengakses platform irigasi air.in."}
					</p>
				</div>

				{error && (
					<div className="bg-red-500/20 border border-red-500/40 text-red-100 text-xs px-4 py-3 rounded-xl mb-4 backdrop-blur-sm">
						{error}
					</div>
				)}

				{successMsg && (
					<div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-100 text-xs px-4 py-3 rounded-xl mb-4 backdrop-blur-sm">
						{successMsg}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-xs font-semibold text-white/90 mb-1.5">
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
							placeholder="nama@email.com"
						/>
					</div>
					<div>
						<label className="block text-xs font-semibold text-white/90 mb-1.5">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={6}
							className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
							placeholder="••••••••"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer mt-2"
					>
						{loading ? <Spinner /> : mode === "login" ? "Masuk dengan Email" : "Daftar Akun Baru"}
					</button>
				</form>
			</div>
		</div>
	);
}
