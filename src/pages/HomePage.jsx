/** @format */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import GrassIcon from '@mui/icons-material/Grass';
import LayersIcon from '@mui/icons-material/Layers';
import TerrainIcon from '@mui/icons-material/Terrain';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
	Box,
	Button,
	IconButton,
	Paper,
	Stack,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';

import {
	Sparkles,
	ShieldCheck,
	Map,
	Flame,
	Droplets,
	Sun,
	CloudRain,
	AlertTriangle,
	TrendingUp,
	Wind,
	Navigation
} from 'lucide-react';

import { WeatherTrendsChart } from '../components/WeatherTrendsChart';
import { getGrowthStage } from '../utils/growthUtils';
import { getWeatherSummary } from '../services/weatherService.js';

export { getGrowthStage };

function MetricTile({ icon, label, value, subtext, iconBg, iconColor }) {
	return (
		<Paper variant="outlined" elevation={0}
			sx={{
				p: 2.5,
				bgcolor: "background.paper",
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 3,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 2,
				transition: "transform 0.2s ease, border-color 0.2s ease",
				"&:hover": {
					borderColor: "primary.main",
					transform: "translateY(-2px)"
				}
			}}
		>
			<Stack spacing={0.5} sx={{ flex: 1 }}>
				<Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontSize: 10 }}>
					{label}
				</Typography>
				<Typography variant="h4" fontWeight={900} sx={{ color: "text.primary", lineHeight: 1.1 }}>
					{value}
				</Typography>
				<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
					{subtext}
				</Typography>
			</Stack>
			<Box
				sx={{
					bgcolor: iconBg,
					color: iconColor,
					borderRadius: 2.5,
					p: 1.5,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{icon}
			</Box>
		</Paper>
	);
}

function GrowthCard({ fields }) {
	const stages = ["Vegetatif", "Generatif", "Pra-Panen", "Panen"];
	const colors = {
		Vegetatif: "#10b981",
		Generatif: "#0ea5e9",
		"Pra-Panen": "#f59e0b",
		Panen: "#ef4444",
	};
	const counts = {};
	stages.forEach((s) => {
		counts[s] = 0;
	});
	fields.forEach((f) => {
		const g = getGrowthStage(f.plantingDate);
		if (g) counts[g.stage]++;
	});
	const total = fields.filter((f) => f.plantingDate).length;

	return (
		<Paper variant="outlined" elevation={0}
			sx={{
				p: 0,
				bgcolor: "background.paper",
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 3,
				height: "100%",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Title Header */}
			<Box sx={{ p: 2.5, pb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
				<Typography
					variant="subtitle2"
					fontWeight={800}
					sx={{
						color: "text.primary",
						textTransform: "uppercase",
						letterSpacing: 1,
						fontSize: 11,
					}}
				>
					Tahap Pertumbuhan
				</Typography>
			</Box>
			
			{/* Stages List */}
			<Box sx={{ display: "flex", flexDirection: "column" }}>
				{stages.map((stage, idx) => {
					const count = counts[stage];
					const pct = total > 0 ? Math.round((count / total) * 100) : 0;
					const color = colors[stage];
					
					return (
						<Box
							key={stage}
							sx={{
								py: 2.25,
								px: 3,
								borderBottom: idx === stages.length - 1 ? 0 : "1px solid",
								borderColor: "divider",
								"&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
							}}
						>
							<Stack spacing={1.5}>
								{/* Header row: Stage Name & Count info */}
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Stack direction="row" alignItems="center" spacing={1.5}>
										<Box
											sx={{
												width: 10,
												height: 10,
												borderRadius: "50%",
												bgcolor: color,
											}}
										/>
										<Typography variant="subtitle2" fontWeight={750} sx={{ fontSize: 13.5 }}>
											{stage}
										</Typography>
									</Stack>
									
									<Typography variant="body2" fontWeight={850} color="text.primary" sx={{ fontSize: 13 }}>
										{count} <span style={{ fontWeight: 500, color: "#64748b", fontSize: 11.5 }}>/ {total} Lahan</span>
									</Typography>
								</Stack>
								
								{/* Progress Bar & Percentage row */}
								<Stack direction="row" alignItems="center" spacing={2.5}>
									<Box sx={{ flex: 1, height: 6, bgcolor: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
										<Box
											sx={{
												height: "100%",
												width: `${pct}%`,
												bgcolor: color,
												borderRadius: 3,
												transition: "width 0.6s ease",
											}}
										/>
									</Box>
									<Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ minWidth: 28, textAlign: "right" }}>
										{pct}%
									</Typography>
								</Stack>
							</Stack>
						</Box>
					);
				})}
			</Box>
		</Paper>
	);
}

export function HomePage({ fields, onDelete }) {
	const totalArea = fields.reduce((s, f) => s + (f.area_ha || 0), 0);
	const avgTemp = fields.filter((f) => f.temp).length
		? (
				fields.reduce((s, f) => s + (f.temp || 0), 0) /
				fields.filter((f) => f.temp).length
			).toFixed(1)
		: "32.0";

	const avgHumid = fields.filter((f) => f.humidity).length
		? Math.round(
				fields.reduce((s, f) => s + (f.humidity || 0), 0) /
					fields.filter((f) => f.humidity).length,
			)
		: 68;

	const [elNinoSeverity, setElNinoSeverity] = useState(() => {
		const saved = localStorage.getItem("elNinoSeverity");
		return saved !== null ? Number(saved) : 0;
	});
	const [totalWaterSupply, setTotalWaterSupply] = useState(() => {
		const saved = localStorage.getItem("totalWaterSupply");
		return saved !== null ? Number(saved) : 150000;
	});

	const [weatherForecast, setWeatherForecast] = useState([]);
	const [weatherInfo, setWeatherInfo] = useState({ temp: 32, desc: "Cerah Berawan", et0: 4.2, wind: 12 });
	const [waModalOpen, setWaModalOpen] = useState(false);

	useEffect(() => {
		localStorage.setItem("elNinoSeverity", elNinoSeverity);
	}, [elNinoSeverity]);

	useEffect(() => {
		localStorage.setItem("totalWaterSupply", totalWaterSupply);
	}, [totalWaterSupply]);

	useEffect(() => {
		const lat = fields[0]?.lat ?? -7.4478;
		const lon = fields[0]?.lon ?? fields[0]?.lng ?? 112.7183;
		getWeatherSummary(lat, lon)
			.then((data) => {
				if (data?.forecast) {
					setWeatherForecast(data.forecast.slice(0, 5));
				}
				setWeatherInfo({
					temp: data?.temp ?? 32.0,
					desc: data?.description ?? "Cerah Berawan",
					et0: data?.windSpeed ? Number((4.5 + data.windSpeed * 0.1).toFixed(2)) : 4.2,
					wind: data?.windSpeed ?? 12,
				});
			})
			.catch(console.error);
	}, [fields]);

	const avgRisk = fields.length > 0
		? Math.round(
				fields.reduce((s, f) => s + (f.temp ? Math.round(50 + (f.temp - 30) * 8) : 62), 0) / fields.length
			)
		: 62;
	const harveyScore = Math.max(0, 100 - avgRisk);

	// Risk classification counts
	const lowRiskCount = fields.filter(f => (f.temp ? Math.round(50 + (f.temp - 30) * 8) : 62) < 40).length;
	const medRiskCount = fields.filter(f => {
		const s = f.temp ? Math.round(50 + (f.temp - 30) * 8) : 62;
		return s >= 40 && s < 70;
	}).length;
	const highRiskCount = fields.filter(f => (f.temp ? Math.round(50 + (f.temp - 30) * 8) : 62) >= 70).length;

	const lowPct = fields.length > 0 ? (lowRiskCount / fields.length) * 100 : 0;
	const medPct = fields.length > 0 ? (medRiskCount / fields.length) * 100 : 0;
	const highPct = fields.length > 0 ? (highRiskCount / fields.length) * 100 : 0;

	return (
		<Box sx={{ display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden", pb: 6 }}>
			{/* Top Header Banner Card */}
			<Box
				sx={{
					p: { xs: 2.5, md: 4 },
					mx: { xs: 1.5, md: 2 },
					mt: 2,
					borderRadius: 3,
					border: "1px solid #e2e8f0",
					bgcolor: "background.paper",
					position: "relative",
					overflow: "hidden",
				}}
			>
				<Box sx={{ position: "relative", zIndex: 1, maxWidth: 720 }}>
					<Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
						<Box sx={{ bgcolor: "rgba(4,120,87,0.08)", px: 1.5, py: 0.5, borderRadius: 5, display: "inline-flex", alignItems: "center", gap: 1 }}>
							<Sparkles className="h-3.5 w-3.5 text-emerald-600" />
							<Typography variant="caption" fontWeight={700} color="#047857">
								Sistem Cerdas Pengelolaan Irigasi Lahan Pertanian
							</Typography>
						</Box>
					</Stack>
					<Typography variant="h4" fontWeight={900} sx={{ letterSpacing: -0.8, color: "text.primary", mb: 1 }}>
						Dashboard Alokasi Air &amp; Pemantauan Lahan
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
						Optimalkan distribusi air pertanian secara presisi dengan perhitungan skor risiko kekeringan berbasis kondisi tanah, fase tanaman, dan data cuaca Open-Meteo real-time.
					</Typography>
				</Box>
			</Box>

			{/* Key Metrics Row */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
					gap: 2,
					p: { xs: 1.5, md: 2 },
				}}
			>
				<MetricTile
					icon={<ShieldCheck className="h-5 w-5" />}
					label="Skor Ketahanan Klaster (air.in Score)"
					value={`${harveyScore} / 100`}
					subtext={harveyScore >= 60 ? "Resiliensi Klaster Baik" : "Klaster Rentan Kekeringan"}
					iconBg="rgba(4,120,87,0.08)"
					iconColor="#047857"
				/>
				<MetricTile
					icon={<Map className="h-5 w-5" />}
					label="Total Luas Lahan Terdaftar"
					value={`${totalArea.toFixed(1)} Ha`}
					subtext={`${fields.length} Petak Lahan Aktif`}
					iconBg="rgba(14,165,233,0.08)"
					iconColor="#0ea5e9"
				/>
				<MetricTile
					icon={<AlertTriangle className="h-5 w-5" />}
					label="Lahan Risiko Tinggi / Kritis"
					value={`${highRiskCount} Lahan`}
					subtext={highRiskCount > 0 ? "Butuh Irigasi Segera" : "Semua Lahan Aman"}
					iconBg={highRiskCount > 0 ? "rgba(244,63,94,0.08)" : "rgba(4,120,87,0.08)"}
					iconColor={highRiskCount > 0 ? "#f43f5e" : "#047857"}
				/>
				<MetricTile
					icon={<Droplets className="h-5 w-5" />}
					label="Total Pasokan Air Irigasi"
					value={`${totalWaterSupply.toLocaleString("id-ID")} L`}
					subtext="Alokasi Air Terdistribusi"
					iconBg="rgba(99,102,241,0.08)"
					iconColor="#6366f1"
				/>
			</Box>

			{/* Interactive Quick Actions & Risk Distribution Cards */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" },
					gap: 2,
					px: { xs: 1.5, md: 2 },
					pb: 2,
				}}
			>
				{/* Quick Actions Card */}
				<Paper variant="outlined" elevation={0} sx={{ p: 2.5, borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
					<Box>
						<Typography variant="subtitle2" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 0.5, mb: 1, color: "text.secondary", fontSize: 10 }}>
							Aksi Cepat &amp; Pintar
						</Typography>
						<Typography variant="h6" fontWeight={800} sx={{ color: "text.primary", mb: 1 }}>
							Tindakan Rekomendasi Hari Ini
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							Lakukan pemetaan wilayah sawah baru atau distribusikan informasi alokasi air irigasi ke WhatsApp petani.
						</Typography>
					</Box>
					<Stack spacing={1.5}>
						<Button
							component={Link}
							to="/dashboard/map"
							variant="contained"
							color="primary"
							endIcon={<ArrowForwardIcon />}
							sx={{ py: 1.2, fontWeight: 700, borderRadius: 2 }}
						>
							Petakan Batas Lahan Baru
						</Button>
						<Button
							variant="outlined"
							color="success"
							onClick={() => setWaModalOpen(true)}
							endIcon={<SendIcon />}
							sx={{ py: 1.2, fontWeight: 700, borderRadius: 2 }}
						>
							Kirim Rekomendasi Irigasi via WhatsApp
						</Button>
					</Stack>
				</Paper>

				{/* Risk distribution analysis card */}
				<Paper variant="outlined" elevation={0} sx={{ p: 2.5, borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
					<Box sx={{ mb: 1 }}>
						<Typography variant="subtitle2" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 0.5, mb: 0.5, color: "text.secondary", fontSize: 10 }}>
							Status Kerentanan
						</Typography>
						<Typography variant="h6" fontWeight={800} sx={{ color: "text.primary", mb: 0.5 }}>
							Analisis Distribusi Risiko Sawah
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Proporsi lahan berdasarkan indeks kerentanan kekeringan kumulatif.
						</Typography>
					</Box>

					{/* Horizontal Bar Chart representation */}
					<Stack spacing={1.75} sx={{ mt: 1 }}>
						{/* Low Risk Bar */}
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Stack direction="row" alignItems="center" spacing={1} sx={{ width: 65, flexShrink: 0 }}>
								<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981" }} />
								<Typography variant="caption" fontWeight={700} color="text.secondary">Rendah</Typography>
							</Stack>
							<Box sx={{ flex: 1, height: 8, bgcolor: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
								<Box sx={{ height: "100%", width: `${lowPct}%`, bgcolor: "#10b981", borderRadius: 4, transition: "width 0.5s ease" }} />
							</Box>
							<Typography variant="caption" fontWeight={800} color="text.primary" sx={{ width: 110, textAlign: "right", flexShrink: 0 }}>
								{lowRiskCount} Lahan ({Math.round(lowPct)}%)
							</Typography>
						</Box>

						{/* Medium Risk Bar */}
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Stack direction="row" alignItems="center" spacing={1} sx={{ width: 65, flexShrink: 0 }}>
								<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f59e0b" }} />
								<Typography variant="caption" fontWeight={700} color="text.secondary">Sedang</Typography>
							</Stack>
							<Box sx={{ flex: 1, height: 8, bgcolor: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
								<Box sx={{ height: "100%", width: `${medPct}%`, bgcolor: "#f59e0b", borderRadius: 4, transition: "width 0.5s ease" }} />
							</Box>
							<Typography variant="caption" fontWeight={800} color="text.primary" sx={{ width: 110, textAlign: "right", flexShrink: 0 }}>
								{medRiskCount} Lahan ({Math.round(medPct)}%)
							</Typography>
						</Box>

						{/* High Risk Bar */}
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Stack direction="row" alignItems="center" spacing={1} sx={{ width: 65, flexShrink: 0 }}>
								<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#ef4444" }} />
								<Typography variant="caption" fontWeight={700} color="text.secondary">Tinggi</Typography>
							</Stack>
							<Box sx={{ flex: 1, height: 8, bgcolor: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
								<Box sx={{ height: "100%", width: `${highPct}%`, bgcolor: "#ef4444", borderRadius: 4, transition: "width 0.5s ease" }} />
							</Box>
							<Typography variant="caption" fontWeight={800} color="text.primary" sx={{ width: 110, textAlign: "right", flexShrink: 0 }}>
								{highRiskCount} Lahan ({Math.round(highPct)}%)
							</Typography>
						</Box>
					</Stack>
				</Paper>
			</Box>

			{/* Simulator & Forecast Row */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" },
					gap: 2,
					px: { xs: 1.5, md: 2 },
					pb: 2,
				}}
			>
				{/* Simulator El Nino Card */}
				<Paper variant="outlined" elevation={0} sx={{ p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: 3, height: "100%" }}>
					<Stack spacing={2.5}>
						<Box sx={{ pb: 1.5, mb: 0.5, borderBottom: "1px solid", borderColor: "divider" }}>
							<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
								<Typography variant="subtitle1" fontWeight={800}>
									Simulator El Niño
								</Typography>
								<Typography
									variant="caption"
									fontWeight={800}
									sx={{
										color: "#0369a1",
										bgcolor: "#f0f9ff",
										px: 2,
										py: 0.5,
										borderRadius: 2,
										border: "1px solid #bae6fd",
									}}
								>
									Level {elNinoSeverity} / 10
								</Typography>
							</Box>
							
							<Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
								Makin tinggi level, makin tinggi faktor penalti kelangkaan air tanah.
							</Typography>
						</Box>

						<Box>
							<input
								type="range"
								min="0"
								max="10"
								step="1"
								value={elNinoSeverity}
								onChange={(e) => setElNinoSeverity(Number(e.target.value))}
								style={{
									width: "100%",
									height: "6px",
									background: "#e2e8f0",
									borderRadius: "10px",
									appearance: "none",
									outline: "none",
									cursor: "pointer",
								}}
							/>
							<Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "text.secondary", mt: 1 }}>
								<span>Level 0 (Normal)</span>
								<span>Level 5</span>
								<span>Level 10 (Ekstrem)</span>
							</Box>
						</Box>
					</Stack>

					{/* Impact box wrapper */}
					<Box
						sx={{
							mt: 4,
							p: 2,
							borderRadius: 2.5,
							bgcolor: "#ffffff",
							border: "1px solid #bae6fd",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Typography variant="body2" fontWeight={750} sx={{ color: "text.primary" }}>
							Dampak Defisit Air:
						</Typography>
						<Typography
							variant="caption"
							fontWeight={850}
							sx={{
								color: "#0369a1",
								bgcolor: "#f0f9ff",
								border: "1px solid #bae6fd",
								px: 1.5,
								py: 0.5,
								borderRadius: 1.5,
							}}
						>
							+{Math.round(elNinoSeverity * 8)}% Defisit
						</Typography>
					</Box>
				</Paper>

				{/* 5-Day Weather Forecast Card */}
				<Paper variant="outlined" elevation={0} sx={{ p: 2.5, borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
					<Box sx={{ pb: 1.5, mb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
						<Typography variant="subtitle1" fontWeight={800}>
							Prakiraan Cuaca 5 Hari
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Prakiraan cuaca regional Jawa Timur &amp; Evapotranspirasi ET0
						</Typography>
					</Box>

					{weatherForecast.length > 0 ? (
						<Box sx={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", gap: 1.5 }}>
							{weatherForecast.map((fc, i) => {
								const dayName = new Date(fc.date).toLocaleDateString('id-ID', { weekday: 'long' });
								return (
									<Stack
										key={i}
										spacing={1.25}
										alignItems="center"
										sx={{
											p: 2,
											borderRight: i === 4 ? 0 : "1px solid #e2e8f0",
											flex: 1,
											minWidth: 90,
										}}
									>
										<Typography variant="caption" fontWeight={750} color="text.secondary" sx={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
											{dayName}
										</Typography>
										
										<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 28 }}>
											{fc.weatherCode <= 1 ? (
												<Sun className="h-6 w-6 text-amber-500" />
											) : (
												<CloudRain className="h-6 w-6 text-sky-500" />
											)}
										</Box>
										
										<Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: 10, textAlign: "center", minHeight: 28, display: "flex", alignItems: "center" }}>
											{fc.description}
										</Typography>
										
										<Typography variant="caption" fontWeight={850} color="text.primary" sx={{ fontSize: 12 }}>
											{fc.tempMax}° / <span style={{ color: "#94a3b8" }}>{fc.tempMin}°</span>
										</Typography>
										
										<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, bgcolor: fc.precipMm > 0 ? "rgba(14,165,233,0.08)" : "transparent", px: 1, py: 0.25, borderRadius: 1.5 }}>
											<Typography variant="caption" fontWeight={700} sx={{ fontSize: 10, color: fc.precipMm > 0 ? "sky.700" : "text.secondary" }}>
												💧 {fc.precipMm} mm
											</Typography>
										</Box>
									</Stack>
								);
							})}
						</Box>
					) : (
						<Box sx={{ display: "flex", flexWrap: "nowrap", gap: 1.5 }}>
							{[0, 1, 2, 3, 4].map((i) => {
								const today = new Date();
								today.setDate(today.getDate() + i);
								const dayName = today.toLocaleDateString('id-ID', { weekday: 'long' });
								return (
									<Stack
										key={i}
										spacing={1.25}
										alignItems="center"
										sx={{
											p: 2,
											borderRight: i === 4 ? 0 : "1px solid #e2e8f0",
											flex: 1,
											minWidth: 90,
										}}
									>
										<Typography variant="caption" fontWeight={750} color="text.secondary" sx={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
											{dayName}
										</Typography>
										
										<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 28 }}>
											<Sun className="h-6 w-6 text-amber-500" />
										</Box>
										
										<Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: 10, textAlign: "center", minHeight: 28, display: "flex", alignItems: "center" }}>
											Cerah
										</Typography>
										
										<Typography variant="caption" fontWeight={850} color="text.primary" sx={{ fontSize: 12 }}>
											32° / <span style={{ color: "#94a3b8" }}>24°</span>
										</Typography>
										
										<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.25, borderRadius: 1.5 }}>
											<Typography variant="caption" fontWeight={700} sx={{ fontSize: 10, color: "text.secondary" }}>
												💧 0 mm
											</Typography>
										</Box>
									</Stack>
								);
							})}
						</Box>
					)}
				</Paper>
			</Box>

			{/* Chart & Growth / Latest Fields Container */}
			<Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, px: { xs: 1.5, md: 2 } }}>
				<Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
					{fields.length > 0 && <WeatherTrendsChart fields={fields} />}
					<GrowthCard fields={fields} />
				</Box>
				
				<Paper variant="outlined" elevation={0}
					sx={{
						flex: 1,
						bgcolor: "background.paper",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: 3,
						overflow: "hidden",
						display: "flex",
						flexDirection: "column",
						minHeight: 350,
					}}
				>
					<Box
						sx={{
							px: 2.5,
							py: 2,
							borderBottom: "1px solid",
							borderColor: "divider",
						}}
					>
						<Typography
							variant="subtitle2"
							fontWeight={700}
							sx={{ textTransform: "uppercase", letterSpacing: 1 }}
						>
							Lahan Terbaru
						</Typography>
					</Box>
					{fields.length === 0 ? (
						<Box sx={{ p: 4, textAlign: "center", my: "auto" }}>
							<Typography color="text.secondary">Belum ada lahan.</Typography>
							<Button
								component={Link}
								to="/dashboard/map"
								variant="outlined"
								size="small"
								sx={{ mt: 2 }}
							>
								Buat di Peta
							</Button>
						</Box>
					) : (
						<Box sx={{ overflow: "auto", flex: 1 }}>
							{[...fields]
								.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
								.slice(0, 6)
								.map((f) => (
									<FieldItem key={f.id} field={f} onDelete={onDelete} />
								))}
						</Box>
					)}
				</Paper>
			</Box>

			{/* WhatsApp Preview Dialog */}
			<Dialog open={waModalOpen} onClose={() => setWaModalOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle sx={{ fontWeight: 800 }}>Pratinjau Pesan WhatsApp</DialogTitle>
				<DialogContent dividers>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						Rekomendasi alokasi air irigasi berikut akan dikirimkan ke grup petani.
					</Typography>
					<Box sx={{ p: 2, bgcolor: "#efeae2", borderRadius: 2, border: "1px solid #dcd8d0", fontFamily: "monospace", fontSize: 12 }}>
						<p style={{ margin: 0, fontWeight: "bold" }}>🌾 *REKOMENDASI IRIGASI AIR.IN* 🌾</p>
						<p style={{ margin: "5px 0 0 0" }}>Status El Niño: *Level {elNinoSeverity}/10*</p>
						<p style={{ margin: "5px 0 0 0" }}>Total Pasokan Air: *{(totalWaterSupply/1000).toFixed(0)} Ribu L*</p>
						<p style={{ margin: "10px 0 0 0" }}>----------------------------------</p>
						{fields.slice(0, 3).map((f, i) => {
							const riskVal = f.temp ? Math.round(50 + (f.temp - 30) * 8) : 62;
							const stage = getGrowthStage(f.plantingDate)?.stage || "Pra-Panen";
							return (
								<p key={f.id} style={{ margin: "5px 0 0 0" }}>
									{i+1}. *{f.name}* ({f.crop_type})<br />
									&nbsp;&nbsp;&nbsp;Fase: {stage}<br />
									&nbsp;&nbsp;&nbsp;Risiko: *{riskVal}/100*<br />
									&nbsp;&nbsp;&nbsp;Alokasi Air: *{Math.round(totalWaterSupply * (riskVal / (fields.length * 62))).toLocaleString("id-ID")} L*
								</p>
							);
						})}
						{fields.length > 3 && <p style={{ margin: "5px 0 0 0" }}>... Dan {fields.length - 3} sawah lainnya.</p>}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setWaModalOpen(false)} color="inherit">Batal</Button>
					<Button
						variant="contained"
						color="success"
						onClick={() => {
							setWaModalOpen(false);
							// Trigger whatsapp send url
							const text = `🌾 *REKOMENDASI IRIGASI AIR.IN* 🌾\nStatus El Niño: *Level ${elNinoSeverity}/10*\nTotal Pasokan: *${(totalWaterSupply/1000).toFixed(0)} Ribu L*\n\n${fields.slice(0, 5).map((f, i) => `${i+1}. *${f.name}* (${f.crop_type}) - Risiko: ${f.temp ? Math.round(50 + (f.temp - 30) * 8) : 62}/100`).join("\n")}`;
							window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
						}}
					>
						Kirim Sekarang
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

function FieldItem({ field, onDelete }) {
	const g = getGrowthStage(field.plantingDate);
	return (
		<Box
			sx={{
				py: 2.25,
				px: 3,
				borderBottom: "1px solid",
				borderColor: "divider",
				"&:last-child": { borderBottom: 0 },
				"&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
			}}
		>
			<Stack spacing={1.75}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Stack direction="row" alignItems="center" spacing={1.5}>
						<Box
							sx={{
								width: 10,
								height: 10,
								borderRadius: "50%",
								bgcolor: g?.color ?? "#64748b",
								border: "2px solid",
								borderColor: g?.color ?? "#64748b",
								opacity: 0.3,
							}}
						/>
						<Typography variant="subtitle2" fontWeight={750} sx={{ fontSize: 13.5 }}>
							{field.name}
						</Typography>
					</Stack>
					<IconButton
						size="small"
						onClick={() => onDelete(field.id)}
						sx={{ color: "error.main" }}
					>
						<DeleteIcon sx={{ fontSize: 16 }} />
					</IconButton>
				</Stack>
				<Stack direction="row" spacing={2.5} flexWrap="wrap">
					<Stack direction="row" spacing={0.75} alignItems="center">
						<TerrainIcon sx={{ fontSize: 13, color: "text.disabled" }} />
						<Typography variant="caption" color="text.secondary" fontWeight={550}>
							{field.area_ha?.toFixed(2)} ha
						</Typography>
					</Stack>
					<Stack direction="row" spacing={0.75} alignItems="center">
						<WbSunnyIcon sx={{ fontSize: 13, color: "text.disabled" }} />
						<Typography variant="caption" color="text.secondary" fontWeight={550}>
							{field.temp?.toFixed(1)}°C
						</Typography>
					</Stack>
					<Stack direction="row" spacing={0.75} alignItems="center">
						<WaterDropIcon sx={{ fontSize: 13, color: "text.disabled" }} />
						<Typography variant="caption" color="text.secondary" fontWeight={550}>
							{field.humidity}%
						</Typography>
					</Stack>
					{g && (
						<Box
							sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: `${g.color}15`, border: `1px solid ${g.color}30` }}
						>
							<Typography
								variant="caption"
								fontWeight={750}
								sx={{ color: g.color, fontSize: 10.5 }}
							>
								{g.stage} · {g.days}h
							</Typography>
						</Box>
					)}
				</Stack>
			</Stack>
		</Box>
	);
}

