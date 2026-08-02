/** @format */

import { useState, useEffect } from 'react';
import {
	Box,
	Paper,
	Stack,
	Typography,
	Divider,
	Grid
} from '@mui/material';

import {
	TrendingUp,
	Droplets,
	Flame,
	ShieldCheck,
	Sprout,
	Thermometer,
	Droplet,
	Layers,
	BarChart3,
	AlertTriangle
} from 'lucide-react';

import { getGrowthStage } from '../utils/growthUtils';

export function AnalyticsPage({ fields = [] }) {
	const totalFields = fields.length;

	// 1. Calculations
	const totalArea = fields.reduce((s, f) => s + (f.area_ha || 0), 0);
	const avgTemp = fields.filter((f) => f.temp).length
		? (fields.reduce((s, f) => s + (f.temp || 0), 0) / fields.filter((f) => f.temp).length).toFixed(1)
		: "32.0";

	const avgHumid = fields.filter((f) => f.humidity).length
		? Math.round(fields.reduce((s, f) => s + (f.humidity || 0), 0) / fields.filter((f) => f.humidity).length)
		: 68;

	const elNinoSeverity = (() => {
		const saved = localStorage.getItem("elNinoSeverity");
		return saved !== null ? Number(saved) : 0;
	})();

	// Risk analysis
	const fieldsWithRisk = fields.map(f => {
		const score = f.temp ? Math.round(50 + (f.temp - 30) * 8) : 62;
		let category = "Sedang";
		let color = "#f59e0b"; // amber
		if (score < 40) {
			category = "Rendah";
			color = "#10b981"; // emerald
		} else if (score >= 70) {
			category = "Tinggi / Kritis";
			color = "#ef4444"; // rose
		}
		return { ...f, score, category, color };
	}).sort((a, b) => b.score - a.score);

	const avgRisk = fields.length > 0
		? Math.round(fieldsWithRisk.reduce((s, f) => s + f.score, 0) / fields.length)
		: 62;
	const harveyScore = Math.max(0, 100 - avgRisk);

	// Soil type distribution
	const soilDist = {};
	fields.forEach(f => {
		const t = f.soilType || "Tidak Diketahui";
		soilDist[t] = (soilDist[t] || 0) + (f.area_ha || 0);
	});
	const maxSoilArea = Math.max(...Object.values(soilDist), 1);

	// Crop type distribution
	const cropDist = {};
	fields.forEach(f => {
		const c = f.crop_type || "Lainnya";
		cropDist[c] = (cropDist[c] || 0) + 1;
	});

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: { xs: 2, md: 3 }, pb: 8 }}>
			
			{/* Top Header Banner Card */}
			<Paper variant="outlined" elevation={0}
				sx={{
					p: 3,
					bgcolor: "background.paper",
					border: "1px solid",
					borderColor: "divider",
					borderRadius: 3,
					display: "flex",
					alignItems: "center",
					gap: 2.5,
				}}
			>
				<Box sx={{ bgcolor: "rgba(4,120,87,0.08)", p: 2, borderRadius: 3, color: "#047857" }}>
					<BarChart3 className="h-6 w-6" />
				</Box>
				<Stack spacing={0.5}>
					<Typography variant="h5" fontWeight={900} sx={{ color: "text.primary", letterSpacing: -0.5 }}>
						Analisis Lahan &amp; Risiko Kekeringan
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Laporan statistik kumulatif, perbandingan indeks kerentanan sawah, serta status pasokan air irigasi.
					</Typography>
				</Stack>
			</Paper>

			{/* Mini Overview Metric Cards */}
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6} md={3}>
					<Paper variant="outlined" elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, borderRadius: 3 }}>
						<Stack spacing={0.5} sx={{ flex: 1 }}>
							<Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase" }}>
								Suhu Rata-rata
							</Typography>
							<Typography variant="h5" fontWeight={800}>{avgTemp}°C</Typography>
						</Stack>
						<Box sx={{ bgcolor: "rgba(249,115,22,0.08)", p: 1.2, borderRadius: 2, color: "#f97316" }}>
							<Thermometer className="h-5 w-5" />
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Paper variant="outlined" elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, borderRadius: 3 }}>
						<Stack spacing={0.5} sx={{ flex: 1 }}>
							<Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase" }}>
								Kelembaban Udara
							</Typography>
							<Typography variant="h5" fontWeight={800}>{avgHumid}%</Typography>
						</Stack>
						<Box sx={{ bgcolor: "rgba(14,165,233,0.08)", p: 1.2, borderRadius: 2, color: "#0ea5e9" }}>
							<Droplet className="h-5 w-5" />
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Paper variant="outlined" elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, borderRadius: 3 }}>
						<Stack spacing={0.5} sx={{ flex: 1 }}>
							<Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase" }}>
								Status El Niño
							</Typography>
							<Typography variant="h5" fontWeight={800}>Level {elNinoSeverity}</Typography>
						</Stack>
						<Box sx={{ bgcolor: "rgba(239,68,68,0.08)", p: 1.2, borderRadius: 2, color: "#ef4444" }}>
							<Flame className="h-5 w-5" />
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Paper variant="outlined" elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, borderRadius: 3 }}>
						<Stack spacing={0.5} sx={{ flex: 1 }}>
							<Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase" }}>
								Rata-rata Risiko
							</Typography>
							<Typography variant="h5" fontWeight={800}>{avgRisk} / 100</Typography>
						</Stack>
						<Box sx={{ bgcolor: "rgba(99,102,241,0.08)", p: 1.2, borderRadius: 2, color: "#6366f1" }}>
							<TrendingUp className="h-5 w-5" />
						</Box>
					</Paper>
				</Grid>
			</Grid>

			{/* Comparative Risk Charts */}
			<Grid container spacing={3}>
				
				{/* 1. Comparison of Risks (Horizontal Bar Chart Mockup) */}
				<Grid item xs={12} md={7}>
					<Paper variant="outlined" elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%", display: "flex", flexDirection: "column" }}>
						<Box sx={{ pb: 2, mb: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
							<Typography variant="subtitle1" fontWeight={800}>
								Indeks Kerentanan Per Lahan
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Perbandingan skor risiko kekeringan (semakin tinggi skor, semakin kritis prioritas airnya).
							</Typography>
						</Box>

						{fieldsWithRisk.length === 0 ? (
							<Box sx={{ py: 6, textAlign: "center", my: "auto" }}>
								<Typography color="text.secondary">Belum ada data lahan terdaftar.</Typography>
							</Box>
						) : (
							<Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
								{fieldsWithRisk.map((f, idx) => (
									<Box
										key={f.id}
										sx={{
											py: 1.75,
											borderBottom: idx === fieldsWithRisk.length - 1 ? 0 : "1px solid",
											borderColor: "divider",
											width: "100%",
										}}
									>
										<Stack spacing={1.25} sx={{ width: "100%" }}>
											{/* Top Row: Name/Crop on Left, Score/Badge on Right - Single Horizontal Line */}
											<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
												{/* Left side: Name & Crop Badge inline */}
												<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
													<Typography variant="body2" fontWeight={750} sx={{ color: "text.primary" }}>
														{f.name}
													</Typography>
													<Box
														sx={{
															px: 1,
															py: 0.25,
															borderRadius: 1,
															bgcolor: f.crop_type === "Padi" ? "rgba(16,185,129,0.06)" : (f.crop_type === "Tebu" ? "rgba(14,165,233,0.06)" : "rgba(245,158,11,0.06)"),
															color: f.crop_type === "Padi" ? "#10b981" : (f.crop_type === "Tebu" ? "#0ea5e9" : "#f59e0b"),
															border: f.crop_type === "Padi" ? "1px solid rgba(16,185,129,0.18)" : (f.crop_type === "Tebu" ? "1px solid rgba(14,165,233,0.18)" : "1px solid rgba(245,158,11,0.18)"),
															fontSize: 9,
															fontWeight: 800,
															textTransform: "uppercase",
															letterSpacing: 0.5,
														}}
													>
														{f.crop_type}
													</Box>
												</Box>
												
												{/* Right side: Score & Category Pill inline */}
												<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
													<Typography variant="body2" fontWeight={850} color="text.primary" sx={{ fontSize: 13 }}>
														{f.score} <span style={{ fontWeight: 500, color: "#94a3b8", fontSize: 11 }}>/ 100</span>
													</Typography>
													
													<Box
														sx={{
															px: 1.25,
															py: 0.5,
															borderRadius: 1,
															bgcolor: f.color === "#ef4444" ? "rgba(239,68,68,0.08)" : (f.color === "#f97316" || f.color === "#f59e0b" ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)"),
															color: f.color,
															border: `1px solid ${f.color}25`,
															fontWeight: 850,
															fontSize: 9.5,
															textTransform: "uppercase",
															letterSpacing: 0.5,
														}}
													>
														{f.category}
													</Box>
												</Box>
											</Box>
											
											{/* Bottom Row: Progress Bar */}
											<Box sx={{ height: 6, bgcolor: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
												<Box sx={{ width: `${f.score}%`, bgcolor: f.color, height: "100%", borderRadius: 3, transition: "width 0.5s ease" }} />
											</Box>
										</Stack>
									</Box>
								))}
							</Box>
						)}
					</Paper>
				</Grid>

				{/* 2. Crop Type Distribution (Visual Progress List) */}
				<Grid item xs={12} md={5}>
					<Paper variant="outlined" elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%", display: "flex", flexDirection: "column" }}>
						<Box sx={{ pb: 2, mb: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
							<Typography variant="subtitle1" fontWeight={800}>
								Sebaran Komoditas Tanam
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Distribusi jumlah petak lahan berdasarkan jenis komoditas tanaman pangan.
							</Typography>
						</Box>

						{Object.keys(cropDist).length === 0 ? (
							<Box sx={{ py: 6, textAlign: "center", my: "auto" }}>
								<Typography color="text.secondary">Belum ada komoditas terekam.</Typography>
							</Box>
						) : (
							<Stack spacing={2.5} sx={{ my: "auto" }}>
								{Object.entries(cropDist).map(([crop, count]) => {
									const pct = totalFields > 0 ? (count / totalFields) * 100 : 0;
									return (
										<Box key={crop}>
											<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
												<Stack direction="row" alignItems="center" spacing={1}>
													<Sprout className="h-4.5 w-4.5 text-emerald-600" />
													<Typography variant="body2" fontWeight={700}>
														{crop}
													</Typography>
												</Stack>
												<Typography variant="caption" fontWeight={800} color="text.secondary">
													{count} Petak ({Math.round(pct)}%)
												</Typography>
											</Stack>
											<Box sx={{ height: 6, bgcolor: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
												<Box sx={{ width: `${pct}%`, bgcolor: "#047857", height: "100%", borderRadius: 3 }} />
											</Box>
										</Box>
									);
								})}
							</Stack>
						)}
					</Paper>
				</Grid>
			</Grid>

			{/* Third Row: Soil Type Distribution & Water Demand Projection */}
			<Grid container spacing={3}>
				
				{/* 1. Hectares by Soil Type (Custom vertical SVG Bar Chart representation) */}
				<Grid item xs={12} md={6}>
					<Paper variant="outlined" elevation={0} sx={{ p: 3, borderRadius: 3 }}>
						<Box sx={{ pb: 2, mb: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
							<Typography variant="subtitle1" fontWeight={800}>
								Luas Lahan Berdasarkan Jenis Tanah
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Total luas sawah dalam hektar (Ha) dikelompokkan berdasarkan tekstur tanah.
							</Typography>
						</Box>

						{Object.keys(soilDist).length === 0 ? (
							<Box sx={{ py: 6, textAlign: "center" }}>
								<Typography color="text.secondary">Belum ada data tipe tanah.</Typography>
							</Box>
						) : (
							<Box sx={{ position: "relative", height: 160, width: "100%", mt: 2 }}>
								<svg viewBox="0 0 300 130" width="100%" height="100%" style={{ overflow: "visible" }}>
									{/* Baseline */}
									<line x1="10" y1="100" x2="290" y2="100" stroke="#cbd5e1" strokeWidth="1.5" />
									
									{/* Render Bars */}
									{Object.entries(soilDist).map(([soil, area], idx) => {
										const x = 30 + idx * 90; // 30, 120, 210
										const maxVal = maxSoilArea || 1;
										const barHeight = (area / maxVal) * 75; // max height 75px
										const y = 100 - barHeight;
										
										return (
											<g key={soil}>
												{/* Bar value text */}
												<text
													x={x + 16}
													y={y - 8}
													fill="#0f172a"
													fontSize="10"
													fontWeight="800"
													textAnchor="middle"
												>
													{area.toFixed(1)} Ha
												</text>
												
												{/* The Bar with clean gradient */}
												<defs>
													<linearGradient id={`soil-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
														<stop offset="0%" stopColor="#b45309" />
														<stop offset="100%" stopColor="#7c2d12" />
													</linearGradient>
												</defs>
												<rect
													x={x}
													y={y}
													width="32"
													height={barHeight}
													fill={`url(#soil-grad-${idx})`}
													rx="4"
												/>
												
												{/* Soil name text */}
												<text
													x={x + 16}
													y="118"
													fill="#64748b"
													fontSize="9"
													fontWeight="700"
													textAnchor="middle"
												>
													{soil}
												</text>
											</g>
										);
									})}
								</svg>
							</Box>
						)}
					</Paper>
				</Grid>

				{/* 2. Water Demand curve Projection (Custom SVG Line chart) */}
				<Grid item xs={12} md={6}>
					<Paper variant="outlined" elevation={0} sx={{ p: 3, borderRadius: 3 }}>
						<Box sx={{ pb: 2, mb: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
							<Typography variant="subtitle1" fontWeight={800}>
								Kurva Kebutuhan Air (Koefisien Kc)
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Proyeksi faktor pengali kebutuhan air tanaman sepanjang 4 fase tumbuh utama.
							</Typography>
						</Box>

						{/* Custom SVG Line Chart representation */}
						<Box sx={{ position: "relative", height: 160, width: "100%", mt: 2 }}>
							<svg viewBox="0 0 400 130" width="100%" height="100%" style={{ overflow: "visible" }}>
								{/* Gradients */}
								<defs>
									<linearGradient id="curve-grad" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
										<stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
									</linearGradient>
								</defs>

								{/* Grid Lines & Y-Axis Labels */}
								<g stroke="#f1f5f9" strokeWidth="1">
									<line x1="30" y1="20" x2="380" y2="20" strokeDasharray="4" />
									<line x1="30" y1="50" x2="380" y2="50" strokeDasharray="4" />
									<line x1="30" y1="80" x2="380" y2="80" strokeDasharray="4" />
									<line x1="30" y1="110" x2="380" y2="110" strokeDasharray="4" />
								</g>
								
								{/* Y-Axis text labels */}
								<g fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="end">
									<text x="22" y="23">1.2</text>
									<text x="22" y="53">0.8</text>
									<text x="22" y="83">0.4</text>
									<text x="22" y="113">0.0</text>
								</g>

								{/* Baseline */}
								<line x1="30" y1="110" x2="380" y2="110" stroke="#cbd5e1" strokeWidth="1.5" />
								
								{/* Area Curve Fill */}
								<path
									d="M 40 110 Q 120 70, 200 20 T 360 90 L 360 110 L 40 110 Z"
									fill="url(#curve-grad)"
								/>
								
								{/* Stroke Line Curve */}
								<path
									d="M 40 110 Q 120 70, 200 20 T 360 90"
									fill="none"
									stroke="#10b981"
									strokeWidth="3.5"
									strokeLinecap="round"
								/>

								{/* Dots along stages */}
								<circle cx="40" cy="110" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
								<circle cx="120" cy="74" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
								
								{/* Peak point (Red glowing ring) */}
								<circle cx="200" cy="20" r="9" fill="rgba(239,68,68,0.2)" />
								<circle cx="200" cy="20" r="5.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
								
								<circle cx="360" cy="90" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

								{/* Peak label tooltip box */}
								<g transform="translate(200, -5)">
									<rect x="-75" y="-18" width="150" height="20" rx="4" fill="#1e293b" />
									<text x="0" y="-5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
										Puncak Generatif (Kc = 1.15)
									</text>
								</g>
							</svg>

							{/* Axis labels */}
							<Box sx={{ display: "flex", justifyContent: "space-between", pl: 3.5, pr: 2, mt: 1.5 }}>
								<Typography variant="caption" sx={{ fontSize: 9, fontWeight: 700, color: "text.secondary" }}>Vegetatif (Awal)</Typography>
								<Typography variant="caption" sx={{ fontSize: 9, fontWeight: 700, color: "text.secondary" }}>Generatif (Berbunga)</Typography>
								<Typography variant="caption" sx={{ fontSize: 9, fontWeight: 700, color: "text.secondary" }}>Pra-Panen (Pematangan)</Typography>
								<Typography variant="caption" sx={{ fontSize: 9, fontWeight: 700, color: "text.secondary" }}>Panen (Kering)</Typography>
							</Box>
						</Box>
					</Paper>
				</Grid>
			</Grid>

		</Box>
	);
}

