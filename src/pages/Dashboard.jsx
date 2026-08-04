/** @format */

import {
	useEffect,
	useRef,
	useState,
} from 'react';

import {
	Link,
	useParams,
} from 'react-router-dom';

import LogoImg from '@/assets/logo/logo.png';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import MapAltIcon from '@mui/icons-material/Map';
import MenuIcon from '@mui/icons-material/Menu';
import {
	Box,
	Button,
	CircularProgress,
	createTheme,
	CssBaseline,
	Drawer,
	IconButton,
	Menu,
	Stack,
	ThemeProvider,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';

import {
	deleteField,
	getFields,
	storeField,
} from '../services/fieldStore.js';
import { AnalyticsPage } from './AnalyticsPage.jsx';
import { FieldsPage } from './FieldsPage.jsx';
import { HomePage } from './HomePage.jsx';
import MapPage from './MapPage.jsx';
import {
	calcRiskScore,
	WaterAllocationPage,
} from './WaterAllocationPage.jsx';
import { getWeatherSummary } from '../services/weatherService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Sun, Flame } from 'lucide-react';


const theme = createTheme({
	palette: {
		primary: { main: "#047857" },
		background: { default: "#f8fafc", paper: "#ffffff" },
		text: { primary: "#0f172a", secondary: "#64748b" },
		divider: "#e2e8f0",
	},
	typography: {
		fontFamily: '"Inter", "Roboto", sans-serif',
	},
	shadows: Array(25).fill("none"),
	shape: { borderRadius: 12 },
	components: {
		MuiPaper: {
			defaultProps: {
				elevation: 0,
				variant: "outlined",
			},
			styleOverrides: {
				root: {
					boxShadow: "none !important",
					border: "1px solid #e2e8f0 !important",
				}
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					boxShadow: "none !important",
					borderRadius: 12,
					textTransform: "none",
				}
			}
		}
	},
});

const SIDEBAR_W = 240;

const NAV = [
	{ key: "home", icon: <DashboardIcon />, label: "Home" },
	{ key: "fields", icon: <ListIcon />, label: "Daftar Lahan" },
	{ key: "water", icon: <LeaderboardIcon />, label: "Alokasi Air" },
	{ key: "map", icon: <MapAltIcon />, label: "Peta" },
	{ key: "analytics", icon: <BarChartIcon />, label: "Analisis" },
];

const PAGE_TITLES = {
	home: "Home",
	fields: "Daftar Lahan",
	water: "Alokasi Air",
	map: "Peta",
	analytics: "Analisis",
};

function Sidebar({ page, anchorEl, setAnchorEl, isMobile, onClose }) {
	const { user, signOut } = useAuth();
	return (
		<Box
			sx={{
				width: SIDEBAR_W,
				bgcolor: "background.paper",
				borderRight: "1px solid",
				borderColor: "divider",
				display: "flex",
				flexDirection: "column",
				flexShrink: 0,
			}}
		>
			<Box
				sx={{
					px: 2.5,
					py: 3,
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
			>
				<Stack direction="row" sx={{ alignItems: "center" }} spacing={2}>
					<div className="flex items-center gap-3">
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white p-0.5 flex-shrink-0">
							<img src={LogoImg} className="h-full w-full object-contain" alt="air.in Logo" />
						</div>
						<div>
							<span className="text-xl font-black tracking-tight text-emerald-600 block leading-tight">air.in</span>
							<p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Agriculture Platform</p>
						</div>
					</div>
				</Stack>
			</Box>

			<Box sx={{ px: 1.5, py: 2, flex: 1 }}>
				<Stack spacing={0.5}>
					{NAV.map((n) => (
						<Button
							key={n.key}
							component={Link}
							to={`/dashboard/${n.key}`}
							onClick={isMobile ? onClose : undefined}
							startIcon={
								<Box
									sx={{
										color: page === n.key ? "#ffffff" : "text.secondary",
										display: "flex",
										"& svg": { fontSize: 20 },
									}}
								>
									{n.icon}
								</Box>
							}
							sx={{
								justifyContent: "flex-start",
								px: 2,
								py: 1.2,
								borderRadius: 2,
								color: page === n.key ? "#ffffff" : "text.secondary",
								bgcolor: page === n.key ? "#047857" : "transparent",
								fontWeight: page === n.key ? 700 : 500,
								fontSize: "0.875rem",
								textTransform: "none",
								"&:hover": {
									bgcolor: page === n.key ? "#047857" : "rgba(0,0,0,0.04)",
									color: page === n.key ? "#ffffff" : "text.secondary"
								},
							}}
						>
							{n.label}
						</Button>
					))}
				</Stack>
			</Box>

			<Box
				sx={{
					px: 1.5,
					py: 2,
					borderTop: "1px solid",
					borderColor: "divider",
				}}
			>
				<Button
					onClick={(e) => setAnchorEl(e.currentTarget)}
					endIcon={<ExpandMoreIcon sx={{ fontSize: 16 }} />}
					startIcon={<MapAltIcon sx={{ fontSize: 20 }} />}
					sx={{
						justifyContent: "flex-start",
						px: 2,
						py: 1,
						borderRadius: 1.5,
						color: "text.secondary",
						fontWeight: 500,
						fontSize: "0.875rem",
						textTransform: "none",
						"&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
						width: "100%",
					}}
				>
					{user?.email ? user.email.split("@")[0] : "User"}
				</Button>
				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={() => setAnchorEl(null)}
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
					transformOrigin={{ vertical: "bottom", horizontal: "center" }}
					sx={{ mb: 0.5 }}
				>
					<Button
						component={Link}
						to="/app"
						onClick={() => setAnchorEl(null)}
						startIcon={<MapAltIcon sx={{ fontSize: 18 }} />}
						sx={{
							justifyContent: "flex-start",
							px: 2,
							py: 1,
							borderRadius: 0,
							color: "text.primary",
							fontWeight: 500,
							fontSize: "0.875rem",
							textTransform: "none",
							width: "100%",
							"&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
						}}
					>
						Buka Peta
					</Button>
					<Button
						onClick={async () => {
							setAnchorEl(null);
							if (onClose) onClose();
							await signOut();
							window.location.href = "/login";
						}}
						startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
						sx={{
							justifyContent: "flex-start",
							px: 2,
							py: 1,
							borderRadius: 0,
							color: "text.primary",
							fontWeight: 500,
							fontSize: "0.875rem",
							textTransform: "none",
							width: "100%",
							"&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
						}}
					>
						Logout
					</Button>
				</Menu>
			</Box>
		</Box>
	);
}

export default function Dashboard() {
	const { page = "home" } = useParams();
	const [fields, setFields] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showInfo, setShowInfo] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const harveyBoxRef = useRef(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const avgRisk =
		fields.length > 0
			? Math.round(
					fields.reduce((s, f) => s + calcRiskScore(f), 0) / fields.length,
				)
			: null;

	const [elNinoSeverity, setElNinoSeverity] = useState(() => {
		const saved = localStorage.getItem("elNinoSeverity");
		return saved !== null ? Number(saved) : 0;
	});
	const [weather, setWeather] = useState({ temp: 27.6, desc: "Cerah Berawan", et0: 5.13 });

	useEffect(() => {
		const handleStorageChange = () => {
			const saved = localStorage.getItem("elNinoSeverity");
			if (saved !== null) setElNinoSeverity(Number(saved));
		};
		window.addEventListener("storage", handleStorageChange);
		const interval = setInterval(handleStorageChange, 1000);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		getFields()
			.then((data) => {
				setFields(data);
				if (data.length > 0) {
					const lat = data[0].lat ?? -7.4478;
					const lon = data[0].lon ?? data[0].lng ?? 112.7183;
					getWeatherSummary(lat, lon)
						.then((wData) => {
							setWeather({
								temp: wData?.temp ?? 27.6,
								desc: wData?.description ?? "Cerah Berawan",
								et0: wData?.windSpeed ? Number((4.5 + wData.windSpeed * 0.1).toFixed(2)) : 5.13,
							});
						})
						.catch(console.error);
				}
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	async function handleDelete(id) {
		try {
			await deleteField(id);
			setFields((prev) => prev.filter((f) => f.id !== id));
		} catch (e) {
			console.error(e);
		}
	}

	async function handleFieldCreate(fieldData) {
		try {
			const saved = await storeField(fieldData);
			setFields((prev) => [...prev, saved]);
		} catch (e) {
			console.error(e);
		}
	}

	function handleUpdate(updated) {
		setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{ height: "100vh", display: "flex", bgcolor: "background.default" }}
			>
				{isMobile ? (
					<Drawer
						open={drawerOpen}
						onClose={() => setDrawerOpen(false)}
						PaperProps={{ sx: { width: SIDEBAR_W } }}
					>
						<Sidebar
							page={page}
							anchorEl={anchorEl}
							setAnchorEl={setAnchorEl}
							isMobile
							onClose={() => setDrawerOpen(false)}
						/>
					</Drawer>
				) : (
					<Sidebar page={page} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
				)}
				<Box
					sx={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						minHeight: 0,
					}}
				>
					<Box
						sx={{
							px: isMobile ? 1.5 : 3,
							py: 1.5,
							borderBottom: "1px solid",
							borderColor: "divider",
							bgcolor: "background.paper",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							flexShrink: 0,
							gap: 2,
						}}
					>
						<Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
							{isMobile && (
								<IconButton
									onClick={() => setDrawerOpen(true)}
									size="small"
									sx={{ color: "text.primary" }}
								>
									<MenuIcon />
								</IconButton>
							)}
							<Stack spacing={0.2}>
								<Typography
									variant="h6"
									fontWeight={700}
									sx={{ fontSize: isMobile ? "1rem" : "h6", whiteSpace: "nowrap", lineHeight: 1.2 }}
								>
									{PAGE_TITLES[page] ?? "Dashboard"}
								</Typography>
								{!isMobile && (
									<Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary", fontWeight: 500 }}>
										Smart Agriculture &amp; Water Allocation Platform
									</Typography>
								)}
							</Stack>
						</Stack>

						{!isMobile && (
							<Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
								{/* Weather Pill */}
								<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
									<Sun className="h-4.5 w-4.5 text-slate-500" />
									<Stack spacing={0.25}>
										<Stack direction="row" spacing={1} sx={{ alignItems: "center", leading: "none" }}>
											<Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: 11 }}>
												{weather.desc}
											</Typography>
											<Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>|</Typography>
											<Typography variant="caption" fontWeight={800} color="text.primary" sx={{ fontSize: 11 }}>
												{weather.temp}°C
											</Typography>
										</Stack>
										<Typography variant="caption" sx={{ fontSize: 9, color: "text.secondary", fontWeight: 500 }}>
											Evapotranspirasi ET0: {weather.et0} mm/d
										</Typography>
									</Stack>
								</Box>

								{/* El Nino Pill */}
								<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
									<Flame className="h-4.5 w-4.5 text-slate-500" />
									<Stack spacing={0.25}>
										<Stack direction="row" spacing={1} sx={{ alignItems: "center", leading: "none" }}>
											<Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: 11 }}>
												El Niño Status
											</Typography>
											<Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>|</Typography>
											<Typography variant="caption" fontWeight={800} color="text.primary" sx={{ fontSize: 11 }}>
												Level {elNinoSeverity} / 10
											</Typography>
										</Stack>
										<Typography variant="caption" sx={{ fontSize: 9, color: "text.secondary", fontWeight: 500 }}>
											Defisit Pasokan Irigasi
										</Typography>
									</Stack>
								</Box>
							</Stack>
						)}
					</Box>

					<Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
						{loading ? (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "100%",
								}}
							>
								<CircularProgress sx={{ color: "primary.main" }} />
							</Box>
						) : page === "home" ? (
							<HomePage fields={fields} onDelete={handleDelete} />
						) : page === "fields" ? (
							<FieldsPage
								fields={fields}
								onDelete={handleDelete}
								onUpdate={handleUpdate}
							/>
						) : page === "water" ? (
							<WaterAllocationPage fields={fields} />
						) : page === "map" ? (
							<MapPage fields={fields} onFieldCreate={handleFieldCreate} />
						) : page === "analytics" ? (
							<AnalyticsPage fields={fields} />
						) : null}
					</Box>
				</Box>
			</Box>
		</ThemeProvider>
	);
}
