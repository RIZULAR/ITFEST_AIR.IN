import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginBgImg from '@/assets/images/login-bg.jpg';
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
		<div className="min-h-screen flex">
			{/* Left Section - Image */}
			<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
				<img
					src={LoginBgImg}
					alt="Login Background"
					className="absolute inset-0 w-full h-full object-cover"
				/>

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-transparent" />

				{/* Content */}
				<div className="relative z-10 flex flex-col justify-end p-12 text-white">
					<h1 className="text-5xl font-bold mb-4">AIR.IN</h1>
					<p className="max-w-md text-lg text-white/90">
						Decision Support System for Irrigation (AIR.IN Platform)
					</p>
				</div>
			</div>

			{/* Right Section - Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-stone-50">
				<div className="w-full max-w-sm">
					<div className="flex bg-stone-200 p-1 rounded-xl mb-6">
						<button
							type="button"
							onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
							className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
								mode === "login" ? "bg-white text-emerald-800 shadow" : "text-stone-600 hover:text-stone-900"
							}`}
						>
							Masuk Akun
						</button>
						<button
							type="button"
							onClick={() => { setMode("register"); setError(""); setSuccessMsg(""); }}
							className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
								mode === "register" ? "bg-white text-emerald-800 shadow" : "text-stone-600 hover:text-stone-900"
							}`}
						>
							Daftar Baru
						</button>
					</div>

					<div className="mb-6">
						<h2 className="text-2xl font-bold text-stone-800">
							{mode === "login" ? "Masuk Platform" : "Daftar Akun AIR.IN"}
						</h2>
						<p className="text-stone-500 text-sm mt-1">
							{mode === "login"
								? "Masukkan Email & Password akun terdaftar Anda."
								: "Buat akun baru untuk mengakses platform irigasi AIR.IN."}
						</p>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
							{error}
						</div>
					)}

					{successMsg && (
						<div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg mb-4">
							{successMsg}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-stone-700 mb-1.5">
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
								placeholder="nama@email.com"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-stone-700 mb-1.5">
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={6}
								className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
								placeholder="••••••••"
							/>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-700 text-white font-semibold py-3 rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-sm"
						>
							{loading ? <Spinner /> : mode === "login" ? "Masuk dengan Email" : "Daftar Akun Baru"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
