/** @format */

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import {
	CircleMarker,
	MapContainer,
	Polygon,
	TileLayer,
	useMap,
} from 'react-leaflet';
import { Link } from 'react-router-dom';

import AirIcon from '@mui/icons-material/Air';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GrassIcon from '@mui/icons-material/Grass';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapAltIcon from '@mui/icons-material/Map';
import TerrainIcon from '@mui/icons-material/Terrain';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import {
	Box,
	Button,
	Collapse,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	IconButton,
	InputLabel,
	OutlinedInput,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';

import { updateField } from '../services/fieldStore.js';
import { getGrowthStage } from '../utils/growthUtils';

export { getGrowthStage };

function MapAutoBounds({ points, center }) {
	const map = useMap();
	useEffect(() => {
		if (points && points.length >= 3) {
			try {
				const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
				if (bounds.isValid()) {
					map.fitBounds(bounds, { padding: [15, 15], animate: false });
				}
			} catch (err) {
				console.warn('fitBounds error:', err);
			}
		} else if (center) {
			map.setView(center, 13, { animate: false });
		}
	}, [points, center, map]);
	return null;
}

function PolygonMapPreview({ field }) {
	const pts = (field.polygonPoints || [])
		.map((p) => ({
			lat: Number(p.lat ?? p[0]),
			lng: Number(p.lng ?? p.lon ?? p[1]),
		}))
		.filter((p) => !isNaN(p.lat) && !isNaN(p.lng));

	const centerLat = field.lat ?? (pts[0]?.lat ?? -7.4478);
	const centerLng = field.lng ?? field.lon ?? (pts[0]?.lng ?? 112.7183);

	return (
		<MapContainer
			center={[centerLat, centerLng]}
			zoom={12}
			style={{ width: "100%", height: "100%" }}
			zoomControl={false}
			dragging={false}
			scrollWheelZoom={false}
		>
			<TileLayer
				url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
				maxZoom={19}
				attribution="&copy; Esri Satellite"
			/>
			<TileLayer
				url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
				maxZoom={19}
			/>
			<MapAutoBounds points={pts} center={[centerLat, centerLng]} />
			{pts.length >= 3 ? (
				<Polygon
					positions={pts}
					pathOptions={{
						color: "#2e7d32",
						fillColor: "#4caf50",
						fillOpacity: 0.45,
						weight: 3,
					}}
				/>
			) : (
				<CircleMarker
					center={[centerLat, centerLng]}
					radius={8}
					pathOptions={{
						color: "#2e7d32",
						fillColor: "#2e7d32",
						fillOpacity: 0.8,
					}}
				/>
			)}
		</MapContainer>
	);
}

export function FieldsPage({ fields, onDelete, onUpdate }) {
	const [editField, setEditField] = useState(null);
	const [expandedId, setExpandedId] = useState(null);
	const [confirmSave, setConfirmSave] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredFields = (fields || []).filter((f) => {
		const query = searchQuery.toLowerCase();
		return (
			(f.name || "").toLowerCase().includes(query) ||
			(f.owner || "").toLowerCase().includes(query) ||
			(f.crop_type || "").toLowerCase().includes(query) ||
			(f.soilType || "").toLowerCase().includes(query)
		);
	});

	const handleEditOpen = (field, e) => {
		e.stopPropagation();
		setEditField({ ...field });
	};

	const handleDelete = (id, e) => {
		e.stopPropagation();
		onDelete(id);
	};

	const handleEditSave = async () => {
		if (!editField?.name?.trim()) return;
		try {
			const updated = await updateField(editField.id, editField);
			onUpdate(updated);
			setEditField(null);
		} catch (e) {
			console.error(e);
		}
	};

	const handleSaveClick = () => {
		if (!editField?.name?.trim()) return;
		setConfirmSave(true);
	};

	const handleConfirmYes = async () => {
		setConfirmSave(false);
		await handleEditSave();
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: 0,
				overflow: "hidden",
			}}
		>
			<Box sx={{ p: { xs: 2, md: 3 }, pb: 1 }}>
				<Paper
					variant="outlined"
					elevation={0}
					sx={{
						p: { xs: 2.5, md: 3 },
						bgcolor: "background.paper",
						borderRadius: 3,
						border: "1px solid",
						borderColor: "divider",
						display: "flex",
						flexDirection: "column",
						gap: 1.5,
					}}
				>
					{/* Category Tag Badge */}
					<Box sx={{ display: "flex" }}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								px: 1.5,
								py: 0.5,
								borderRadius: 1.5,
								bgcolor: "rgba(4,120,87,0.06)",
								color: "#047857",
								border: "1px solid rgba(4,120,87,0.18)",
							}}
						>
							<MapAltIcon sx={{ fontSize: 16 }} />
							<Typography variant="caption" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
								Manajemen Wilayah
							</Typography>
						</Box>
					</Box>

					{/* Text Content */}
					<Stack spacing={0.5}>
						<Typography variant="h5" fontWeight={900} sx={{ color: "text.primary", letterSpacing: -0.5 }}>
							Daftar Lahan Pertanian
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
							Kelola pemetaan polygon lahan, tipe tanah, fase tanaman, dan riwayat penyiraman secara presisi.
						</Typography>
					</Stack>
				</Paper>
			</Box>

			<Paper variant="outlined" elevation={0}
				sx={{
					bgcolor: "background.paper",
					border: "1px solid",
					margin: 2,
					borderColor: "divider",
					borderRadius: 2,
					overflow: "hidden",
				}}
			>
				<Box
					sx={{
						p: 2.5,
						borderBottom: "1px solid",
						borderColor: "divider",
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						justifyContent: "space-between",
						alignItems: { xs: "stretch", sm: "center" },
						gap: 2,
					}}
				>
					<Box>
						<Typography variant="subtitle1" fontWeight={800} sx={{ color: "text.primary" }}>
							Rincian Petak Lahan
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Total Terdaftar: <b>{filteredFields.length} Lahan</b> ({fields.reduce((s, f) => s + (f.area_ha || 0), 0).toFixed(1)} Ha)
						</Typography>
					</Box>

					<Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: "100%", sm: "auto" } }}>
						{/* Search Input */}
						<TextField
							size="small"
							placeholder="Cari nama lahan atau pemilik..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							sx={{
								width: { xs: "100%", sm: 260 },
								"& .MuiOutlinedInput-root": {
									borderRadius: 3,
								}
							}}
						/>

						{/* Add Button */}
						<Button
							component={Link}
							to="/dashboard/map"
							variant="contained"
							size="small"
							startIcon={<MapAltIcon />}
							sx={{
								whiteSpace: "nowrap",
								bgcolor: "#047857",
								color: "#ffffff",
								px: 2.5,
								py: 1,
								borderRadius: 3,
								fontWeight: 700,
								"&:hover": { bgcolor: "#065f46" }
							}}
						>
							Tambah Lahan
						</Button>
					</Stack>
				</Box>

				{filteredFields.length === 0 ? (
					<Box sx={{ p: 6, textAlign: "center" }}>
						<MapAltIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
						<Typography color="text.secondary">Belum ada lahan cocok.</Typography>
						<Button component={Link} to="/dashboard/map" variant="outlined" sx={{ mt: 2 }}>
							Buat di Peta
						</Button>
					</Box>
				) : (
					<Box sx={{ overflowX: "auto" }}>
						<Stack spacing={0}>
							<Stack
								direction="row"
								alignItems="center"
								sx={{
									px: 2.5,
									py: 1.5,
									borderBottom: "1px solid",
									borderColor: "divider",
									bgcolor: "#f8fafc",
								}}
							>
								{/* Circle & Chevron Spacer */}
								<Box sx={{ width: 44, flexShrink: 0 }} />
								
								{[
									["Nama Lahan", 3],
									["Luas", 1],
									["Suhu", 1],
									["Humid", 1],
									["Angin", 1],
									["Tanam", 1],
									["Tahap", 1],
									["Aksi", 0.8],
								].map(([h, flexVal]) => (
									<Typography
										key={h}
										variant="caption"
										fontWeight={800}
										sx={{
											flex: flexVal,
											color: "text.secondary",
											textTransform: "uppercase",
											letterSpacing: 0.8,
											textAlign: h === "Aksi" ? "center" : "left",
										}}
									>
										{h}
									</Typography>
								))}
							</Stack>
							{filteredFields.map((f, idx) => {
								const g = getGrowthStage(f.plantingDate);
								const isExpanded = expandedId === f.id;
								return (
									<Box key={f.id}>
										<Stack
											direction="row"
											alignItems="center"
											onClick={() => setExpandedId(isExpanded ? null : f.id)}
											sx={{
												px: 2.5,
												py: 1.5,
												borderBottom: isExpanded ? "1px solid" : "none",
												borderColor: "divider",
												bgcolor: isExpanded
													? "rgba(45,106,79,0.04)"
													: "transparent",
												cursor: "pointer",
												"&:hover": {
													bgcolor: isExpanded
														? "rgba(45,106,79,0.06)"
														: "rgba(0,0,0,0.02)",
												},
												"&:last-child": {
													borderBottom: isExpanded ? "1px solid" : "none",
													borderColor: "divider",
												},
											}}
										>
											<Box
												sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1.5, flexShrink: 0 }}
											>
												<Box
													sx={{
														width: 24,
														height: 24,
														borderRadius: "50%",
														bgcolor: "rgba(4,120,87,0.06)",
														border: "1px solid rgba(4,120,87,0.18)",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														flexShrink: 0,
													}}
												>
													<Typography
														variant="caption"
														fontWeight={800}
														sx={{
															color: "#047857",
															fontSize: 10,
														}}
													>
														{idx + 1}
													</Typography>
												</Box>
												<ExpandMoreIcon
													sx={{
														fontSize: 16,
														color: "text.secondary",
														transform: isExpanded
															? "rotate(180deg)"
															: "rotate(0deg)",
														transition: "transform 0.2s",
													}}
												/>
											</Box>
											<Box sx={{ flex: 3, minWidth: 0 }}>
												<Typography
													variant="body2"
													fontWeight={700}
													sx={{ color: "text.primary", lineHeight: 1.2 }}
												>
													{f.name}
												</Typography>
												<Typography
													variant="caption"
													color="text.secondary"
													sx={{ display: "block", lineHeight: 1.2, mt: 0.25 }}
												>
													{f.crop_type ?? "Jenis tanaman belum diisi"}
												</Typography>
											</Box>
											<Typography variant="body2" sx={{ flex: 1 }}>
												{f.area_ha?.toFixed(2)} ha
											</Typography>
											<Typography variant="body2" sx={{ flex: 1 }}>
												{f.temp?.toFixed(1)}°C
											</Typography>
											<Typography variant="body2" sx={{ flex: 1 }}>
												{f.humidity}%
											</Typography>
											<Typography variant="body2" sx={{ flex: 1 }}>
												{f.windSpeed?.toFixed(1)} km/j
											</Typography>
											<Typography variant="body2" sx={{ flex: 1 }}>
												{f.plantingDate ?? "—"}
											</Typography>
											<Box sx={{ flex: 1 }}>
												{g && (
													<Box
														sx={{
															px: 1,
															py: 0.25,
															borderRadius: 1,
															bgcolor: `${g.color}20`,
															display: "inline-block",
														}}
													>
														<Typography
															variant="caption"
															fontWeight={700}
															sx={{ color: g.color }}
														>
															{g.stage}
														</Typography>
													</Box>
												)}
											</Box>
											<Stack direction="row" spacing={0.5} justifyContent="center" sx={{ flex: 0.8, flexShrink: 0 }}>
												<IconButton
													size="small"
													onClick={(e) => handleEditOpen(f, e)}
													sx={{ color: "primary.main" }}
												>
													<EditIcon sx={{ fontSize: 16 }} />
												</IconButton>
												<IconButton
													size="small"
													onClick={(e) => handleDelete(f.id, e)}
													sx={{ color: "error.main" }}
												>
													<DeleteIcon sx={{ fontSize: 16 }} />
												</IconButton>
											</Stack>
										</Stack>

										<Collapse in={isExpanded} timeout="auto" mountOnEnter unmountOnExit={false}>
											<Box
												sx={{
													display: { xs: "block", md: "flex" },
													gap: 2,
													p: 2,
													borderBottom: "1px solid",
													borderColor: "divider",
													bgcolor: "rgba(0,0,0,0.01)",
												}}
											>
												{/* Mini Map Preview with Drawn Polygon */}
												<Box
													sx={{
														width: { xs: "100%", md: 260 },
														height: { xs: 180, md: 200 },
														borderRadius: 1.5,
														overflow: "hidden",
														flexShrink: 0,
														bgcolor: "grey.100",
														mb: { xs: 1, md: 0 },
														border: "1px solid",
														borderColor: "divider",
													}}
												>
													<PolygonMapPreview field={f} />
												</Box>
												<Box
													sx={{
														flex: 1,
														display: "grid",
														gridTemplateColumns: {
															xs: "repeat(2, 1fr)",
															md: "repeat(3, 1fr)",
														},
														gap: 1.5,
													}}
												>
													<StatRow
														icon={<TerrainIcon sx={{ fontSize: 13 }} />}
														label="Luas"
														value={f.area_ha?.toFixed(2)}
														unit=" ha"
													/>
													<StatRow
														icon={<LocationOnIcon sx={{ fontSize: 13 }} />}
														label="Koordinat Pusar"
														value={
															f.lat != null
																? `${Number(f.lat).toFixed(4)}, ${Number(f.lng ?? f.lon).toFixed(4)}`
																: "—"
														}
													/>
													<StatRow
														icon={<WbSunnyIcon sx={{ fontSize: 13 }} />}
														label="Suhu"
														value={f.temp?.toFixed(1)}
														unit="°C"
													/>
													<StatRow
														icon={<WaterDropIcon sx={{ fontSize: 13 }} />}
														label="Humid"
														value={f.humidity}
														unit="%"
													/>
													<StatRow
														icon={<AirIcon sx={{ fontSize: 13 }} />}
														label="Angin"
														value={f.windSpeed?.toFixed(1)}
														unit=" km/j"
													/>
													<StatRow
														icon={<GrassIcon sx={{ fontSize: 13 }} />}
														label="Tanah"
														value={f.soilType ?? "—"}
													/>
													{f.clay_pct != null && (
														<StatRow
															icon={<GrassIcon sx={{ fontSize: 13 }} />}
															label="Clay/Sand/Silt"
															value={`${f.clay_pct}/${f.sand_pct}/${f.silt_pct}`}
															unit="%"
														/>
													)}
													<StatRow
														icon={<CalendarMonthIcon sx={{ fontSize: 13 }} />}
														label="Tanam"
														value={f.plantingDate ?? "—"}
													/>
													{f.rainfall30d?.avg_mm != null && (
														<StatRow
															icon={<WaterDropIcon sx={{ fontSize: 13 }} />}
															label="Hujan/hr"
															value={Number(f.rainfall30d.avg_mm).toFixed(1)}
															unit=" mm"
														/>
													)}
													{f.elevation != null && (
														<StatRow
															icon={<TerrainIcon sx={{ fontSize: 13 }} />}
															label="Elevasi"
															value={f.elevation}
															unit=" m"
														/>
													)}
												</Box>
											</Box>
										</Collapse>
									</Box>
								);
							})}
						</Stack>
					</Box>
				)}
			</Paper>

			{/* Edit modal */}
			<Dialog
				open={!!editField}
				onClose={() => setEditField(null)}
				maxWidth="xs"
				fullWidth
			>
				<DialogTitle fontWeight={700}>Edit Lahan</DialogTitle>
				<DialogContent>
					<Stack spacing={2.5} mt={2}>
						<FormControl variant="outlined" size="small" fullWidth>
							<InputLabel shrink htmlFor="edit-name">
								Nama Lahan
							</InputLabel>
							<OutlinedInput
								id="edit-name"
								value={editField?.name ?? ""}
								onChange={(e) =>
									setEditField((f) => ({ ...f, name: e.target.value }))
								}
								onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
								label="Nama Lahan"
								notched
							/>
						</FormControl>
						<FormControl variant="outlined" size="small" fullWidth>
							<InputLabel shrink htmlFor="edit-planting-date">
								Tanggal Tanam
							</InputLabel>
							<OutlinedInput
								id="edit-planting-date"
								type="date"
								value={editField?.plantingDate ?? ""}
								onChange={(e) =>
									setEditField((f) => ({ ...f, plantingDate: e.target.value }))
								}
								label="Tanggal Tanam"
							/>
						</FormControl>
					</Stack>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button
						onClick={() => setEditField(null)}
						color="inherit"
						size="small"
					>
						Batal
					</Button>
					<Button onClick={handleSaveClick} variant="contained" size="small">
						Simpan
					</Button>
				</DialogActions>
			</Dialog>

			{/* Confirmation dialog */}
			<Dialog
				open={confirmSave}
				onClose={() => setConfirmSave(false)}
				maxWidth="xs"
				fullWidth
			>
				<DialogTitle fontWeight={700}>Konfirmasi</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Simpan perubahan untuk "{editField?.name}"?
					</DialogContentText>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button
						onClick={() => setConfirmSave(false)}
						color="inherit"
						size="small"
					>
						Batal
					</Button>
					<Button onClick={handleConfirmYes} variant="contained" size="small">
						Ya
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

function StatRow({ icon, label, value, unit }) {
	return (
		<Stack direction="row" spacing={0.75} alignItems="center">
			<Box sx={{ color: "text.disabled", display: "flex" }}>{icon}</Box>
			<Box>
				<Typography variant="caption" color="text.secondary">
					{label}
				</Typography>
				<Typography variant="body2" fontWeight={600}>
					{value ?? "—"}
					{unit && (
						<Typography
							component="span"
							variant="caption"
							color="text.secondary"
						>
							{" "}
							{unit}
						</Typography>
					)}
				</Typography>
			</Box>
		</Stack>
	);
}

