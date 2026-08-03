/** @format */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginBgImg from '@/assets/images/login-bg.jpg';
import LogoImg from '@/assets/logo/logo.png';
import { signInWithPassword } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

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
	const { loginAsDemo } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function handleEmailLogin(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		const { error } = await signInWithPassword(email, password);
		setLoading(false);
		if (error) {
			setError(error.message);
		} else {
			navigate("/dashboard/home");
		}
	}

	function handleDemoLogin() {
		loginAsDemo();
		navigate("/dashboard/home");
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
					<div className="flex items-center gap-3 mb-4">
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white overflow-hidden flex-shrink-0 p-0.5">
							<img src={LogoImg} className="w-full h-[140%] object-cover object-top" alt="air.in Logo" />
						</div>
						<div>
							<span className="text-3xl font-black tracking-tight text-white block leading-tight">air.in</span>
							<p className="text-[11px] font-bold text-emerald-200 uppercase tracking-widest leading-none mt-0.5">Agriculture Platform</p>
						</div>
					</div>
					<p className="max-w-md text-base text-white/90 font-medium">
						Decision Support System for Irrigation (air.in Platform)
					</p>
				</div>
			</div>

			{/* Right Section - Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-stone-50">
				<div className="w-full max-w-sm">
					<div className="mb-8">
						<div className="flex items-center gap-3 mb-6">
							<div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white overflow-hidden flex-shrink-0 p-0.5">
								<img src={LogoImg} className="w-full h-[140%] object-cover object-top" alt="air.in Logo" />
							</div>
							<div>
								<span className="text-xl font-black tracking-tight text-emerald-600 block leading-tight">air.in</span>
								<p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">Agriculture Platform</p>
							</div>
						</div>
						<h2 className="text-2xl font-bold text-stone-800">Masuk Platform</h2>
						<p className="text-stone-500 text-sm mt-1">
							Silakan masuk atau gunakan Mode Demo Instan.
						</p>
					</div>

					{/* Demo Mode Instant Access Button */}
					<div className="mb-6">
						<button
							type="button"
							onClick={handleDemoLogin}
							className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-emerald-500"
						>
							<span>🚀 Masuk Mode Demo (Langsung Coba Platform)</span>
						</button>
						<div className="relative my-6 text-center">
							<div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-300"></div></div>
							<span className="relative bg-stone-50 px-3 text-xs text-stone-400 font-medium">atau masuk dengan akun</span>
						</div>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
							{error}
						</div>
					)}

					<form onSubmit={handleEmailLogin} className="space-y-4">
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
								className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
								placeholder="••••••••"
							/>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-stone-800 hover:bg-stone-900 disabled:bg-stone-800 text-white font-semibold py-3 rounded-lg text-sm transition flex items-center justify-center gap-2"
						>
							{loading ? <Spinner /> : "Masuk dengan Email"}
						</button>
					</form>

					<p className="text-stone-400 text-xs text-center mt-6">
						Belum punya akun? Hubungi admin P3A Anda.
					</p>
				</div>
			</div>
		</div>
	);
}
