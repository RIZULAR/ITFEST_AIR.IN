import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
    MapContainer, TileLayer, Polyline, CircleMarker, Polygon,
    useMap, Popup
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import UndoIcon from '@mui/icons-material/Undo'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import LayersIcon from '@mui/icons-material/Layers'
import Paper from '@mui/material/Paper'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle';
import { getBrowserLocation, calcAreaFromPoints, calcCentroidFromPoints } from '../services/geoService.js'
import { getWeatherSummary } from '../services/weatherService.js'
import { getSoilSummary } from '../services/soilService.js'
import { getLast30DaysRainfall } from '../services/rainfallService.js'
import { riskColor, riskLabel } from './WaterAllocationPage.jsx'
import { getGrowthStage } from '../utils/growthUtils'

function MapUpdater({ center, zoom }) {
    const map = useMap()
    useEffect(() => {
        if (center) map.flyTo(center, zoom, { duration: 1.2 })
    }, [center, zoom, map])
    return null
}

function MapClicker({ onClick }) {
    const map = useMap()
    useEffect(() => {
        const h = (e) => onClick({ lat: e.latlng.lat, lng: e.latlng.lng })
        map.on('click', h)
        return () => map.off('click', h)
    }, [map])
    return null
}

const DEFAULT_CENTER = [-7.4478, 112.7183]
const DEFAULT_ZOOM = 13

export default function MapPage({ fields, onFieldCreate }) {
    const [center, setCenter] = useState(DEFAULT_CENTER)
    const [zoom, setZoom] = useState(DEFAULT_ZOOM)
    const [drawPoints, setDrawPoints] = useState([])
    const [showFieldModal, setShowFieldModal] = useState(false)
    const [fieldForm, setFieldForm] = useState({ name: '', plantingDate: '' })
    const [saving, setSaving] = useState(false)
    const [highlightedField, setHighlightedField] = useState(null)
    const [mapType, setMapType] = useState('satellite') // 'satellite' or 'vector'
    const nameInputRef = useRef(null)

    useEffect(() => {
        if (showFieldModal && nameInputRef.current) {
            setTimeout(() => nameInputRef.current?.focus(), 100)
        }
    }, [showFieldModal])

    const handleModalConfirm = async () => {
        if (!fieldForm.name.trim()) return
        setSaving(true)
        try {
            const { lat, lon } = calcCentroidFromPoints(drawPoints)
            const area_ha = calcAreaFromPoints(drawPoints)

            const [weather, soil, rainfallArr] = await Promise.all([
                getWeatherSummary(lat, lon),
                getSoilSummary(lat, lon),
                getLast30DaysRainfall(lat, lon),
            ])

            const rainfall30d = rainfallArr?.length > 0
                ? {
                    total_mm: Number(rainfallArr.reduce((a, b) => a + b, 0)).toFixed(1),
                    avg_mm: Number(rainfallArr.reduce((a, b) => a + b, 0) / rainfallArr.length).toFixed(1),
                }
                : null

            const finalField = {
                name: fieldForm.name,
                lat,
                lng: lon,
                lon,
                area_ha,
                plantingDate: fieldForm.plantingDate || null,
                polygonPoints: drawPoints,
                ...(weather ?? {}),
                ...(soil ?? {}),
                rainfall30d,
            }

            if (onFieldCreate) onFieldCreate(finalField)
            setHighlightedField(drawPoints)
            setTimeout(() => setHighlightedField(null), 4000)
            setShowFieldModal(false)
            setFieldForm({ name: '', plantingDate: '' })
            setDrawPoints([])
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    const finishedPolygons = fields
        .filter(f => f.polygonPoints && Array.isArray(f.polygonPoints))
        .map(f => f.polygonPoints.map(p => ({
            lat: Number(p.lat ?? p[0]),
            lng: Number(p.lng ?? p.lon ?? p[1])
        })).filter(p => !isNaN(p.lat) && !isNaN(p.lng)))

    const validDrawPoints = drawPoints
        .map(p => ({
            lat: Number(p.lat ?? p[0]),
            lng: Number(p.lng ?? p.lon ?? p[1])
        }))
        .filter(p => !isNaN(p.lat) && !isNaN(p.lng))

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Map */}
            <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <MapContainer
                    center={center}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                >
                    {mapType === 'satellite' ? (
                        <>
                            <TileLayer
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                maxZoom={19}
                                attribution="&copy; Esri Satellite"
                            />
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                                maxZoom={19}
                            />
                        </>
                    ) : (
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            maxZoom={19}
                            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                        />
                    )}
                    <MapUpdater center={center} zoom={zoom} />
                    <MapClicker onClick={pt => setDrawPoints(p => [...p, pt])} />

                    {/* Saved field polygons */}
                    {fields.filter(f => f.polygonPoints && Array.isArray(f.polygonPoints)).map((f, i) => {
                        const pts = f.polygonPoints.map(p => ({
                            lat: Number(p.lat ?? p[0]),
                            lng: Number(p.lng ?? p.lon ?? p[1])
                        })).filter(p => !isNaN(p.lat) && !isNaN(p.lng));
                        
                        if (pts.length < 3) return null;
                        
                        const score = f.temp ? Math.round(50 + (f.temp - 30) * 8) : 62;
                        const color = riskColor(score);
                        const stage = getGrowthStage(f.plantingDate)?.stage || 'Pra-Panen';
                        
                        return (
                            <Polygon
                                key={f.id || i}
                                positions={pts}
                                pathOptions={{
                                    color: color,
                                    weight: 2.5,
                                    fillColor: color,
                                    fillOpacity: 0.25,
                                }}
                            >
                                <Popup>
                                    <div style={{ fontFamily: "'Inter', sans-serif", minWidth: "220px", padding: "2px" }}>
                                        {/* Header */}
                                        <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "8px" }}>
                                            <h4 style={{ fontWeight: 800, fontSize: "13px", margin: 0, color: "#0f172a", lineHeight: 1.2 }}>
                                                {f.name}
                                            </h4>
                                        </div>
                                        
                                        {/* Info Rows */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                                                <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Pemilik</span>
                                                <span style={{ color: "#334155", fontWeight: 700 }}>{f.owner}</span>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                                                <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Komoditas</span>
                                                <span style={{ color: "#334155", fontWeight: 700 }}>{f.crop_type}</span>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                                                <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Luas Lahan</span>
                                                <span style={{ color: "#334155", fontWeight: 700 }}>{f.area_ha} Ha</span>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                                                <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Fase Tumbuh</span>
                                                <span style={{ color: "#334155", fontWeight: 700 }}>{stage}</span>
                                            </div>
                                        </div>

                                        {/* Risk Level */}
                                        <div style={{ padding: "6px 8px", background: `${color}10`, borderRadius: "6px", border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11px" }}>
                                            <span style={{ fontWeight: 700, color: "#475569" }}>Skor Risiko</span>
                                            <span style={{ fontWeight: 800, color: color, fontSize: "11px", padding: "1px 5px", background: "white", border: `1px solid ${color}30`, borderRadius: "4px" }}>
                                                {score}/100 ({riskLabel(score)})
                                            </span>
                                        </div>
                                    </div>
                                </Popup>
                            </Polygon>
                        );
                    })}

                    {/* Drawing preview */}
                    {validDrawPoints.length > 0 && (
                        <>
                            <Polyline
                                positions={validDrawPoints}
                                pathOptions={{ color: '#76ff03', weight: 3, dashArray: '6 4' }}
                            />
                            {validDrawPoints.map((p, i) => (
                                <CircleMarker
                                    key={i}
                                    center={[p.lat, p.lng]}
                                    radius={i === 0 ? 8 : 5}
                                    pathOptions={{
                                        color: '#00e676',
                                        fillColor: i === 0 ? '#76ff03' : '#ffffff',
                                        fillOpacity: 1,
                                        weight: 2.5,
                                    }}
                                />
                            ))}
                            {validDrawPoints.length >= 2 && (
                                <Polyline
                                    positions={[validDrawPoints[validDrawPoints.length - 1], validDrawPoints[0]]}
                                    pathOptions={{ color: '#76ff03', weight: 2, dashArray: '4 4', opacity: 0.7 }}
                                />
                            )}
                        </>
                    )}

                    {/* Highlighted newly-created polygon */}
                    {highlightedField && (
                        <Polygon
                            positions={highlightedField}
                            pathOptions={{
                                color: '#00b0ff',
                                weight: 3.5,
                                fillColor: '#40c4ff',
                                fillOpacity: 0.35,
                                dashArray: '8 4',
                            }}
                        />
                    )}
                </MapContainer>

                {/* Map mode switcher top-left */}
                <Box sx={{ position: 'absolute', top: { xs: 8, md: 16 }, left: { xs: 8, md: 16 }, zIndex: 600 }}>
                    <Button
                        startIcon={<LayersIcon />}
                        onClick={() => setMapType(m => m === 'satellite' ? 'vector' : 'satellite')}
                        size="small"
                        variant="contained"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.92)',
                            color: 'text.primary',
                            fontWeight: 700,
                            border: '1px solid #cbd5e1',
                            backdropFilter: 'blur(4px)',
                            '&:hover': { bgcolor: '#ffffff' }
                        }}
                    >
                        {mapType === 'satellite' ? '🛰️ Mode Satelit' : '🗺️ Mode Peta Jalan'}
                    </Button>
                </Box>

                {/* Controls top-right */}
                <Box sx={{
                    position: 'absolute', top: { xs: 8, md: 16 }, right: { xs: 8, md: 16 }, zIndex: 600, display: 'flex', gap: 0.5, flexWrap: 'wrap',
                }}>
                    <Button
                        startIcon={<UndoIcon />}
                        onClick={() => setDrawPoints(p => p.slice(0, -1))}
                        disabled={drawPoints.length === 0}
                        size="small"
                        variant="contained"
                        sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' }, minWidth: { xs: 36, md: 'auto' } }}
                    >
                       Undo
                    </Button>
                    <Button
                        startIcon={<ClearIcon />}
                        onClick={() => setDrawPoints([])}
                        disabled={drawPoints.length === 0}
                        size="small"
                        variant="contained"
                        sx={{ bgcolor: 'white', color: 'error.main', '&:hover': { bgcolor: '#f5f5f5' }, minWidth: { xs: 36, md: 'auto' } }}
                    >
                        Clear
                    </Button>
                    <Button
                        startIcon={<CheckIcon />}
                        onClick={() => drawPoints.length >= 3 && setShowFieldModal(true)}
                        disabled={drawPoints.length < 3}
                        size="small"
                        variant="contained"
                    >
                        Finish
                    </Button>
                </Box>

                {/* Controls bottom-right */}
                <Box sx={{
                    position: 'absolute', bottom: { xs: 16, md: 16 }, right: { xs: 8, md: 16 }, zIndex: 600, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end',
                }}>
                    {highlightedField && (
                        <Paper
                            variant="outlined"
                            elevation={0}
                            component={Link}
                            to="/dashboard/fields"
                            sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'primary.main', color: 'white', borderRadius: 2, textDecoration: 'none', cursor: 'pointer' }}
                        >
                            <CheckCircleOutlineIcon fontSize="small" />
                            <Typography variant="body2" fontWeight={600}>Lahan disimpan!</Typography>
                        </Paper>
                    )}
                    <Button
                        startIcon={<MyLocationIcon />}
                        onClick={async () => {
                            try {
                                const loc = await getBrowserLocation()
                                setCenter([loc.lat, loc.lon])
                                setZoom(16)
                            } catch (e) { console.error(e) }
                        }}
                        size="small"
                        variant="contained"
                        sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                    >
                        Lokasi Saya
                    </Button>
                </Box>

                {/* Point counter */}
                {validDrawPoints.length > 0 && (
                    <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 600 }}>
                        <Chip
                            label={`${validDrawPoints.length} titik${validDrawPoints.length < 3 ? ` (min ${3 - validDrawPoints.length} lagi)` : ''}`}
                            size="small"
                            sx={{ bgcolor: 'white', fontWeight: 600, border: '1px solid #cbd5e1' }}
                        />
                    </Box>
                )}

                {/* Legend */}
                <Box sx={{
                    position: 'absolute', bottom: { xs: 60, md: 16 }, left: { xs: 8, md: 16 }, zIndex: 600,
                    bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 1.5, px: 1.5, py: 1,
                    border: '1px solid #cbd5e1', backdropFilter: 'blur(4px)',
                    display: { xs: 'none', sm: 'block' },
                }}>
                    <Stack spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 14, height: 14, border: '2px solid #00e676', borderRadius: '2px', bgcolor: 'rgba(0,230,118,0.25)' }} />
                            <Typography variant="caption" fontWeight={600}>Lahan tersimpan</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 14, height: 14, border: '2px dashed #76ff03', borderRadius: '2px' }} />
                            <Typography variant="caption" fontWeight={600}>Gambar baru</Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Box>

            {/* Save field modal */}
            <Dialog open={showFieldModal} onClose={() => !saving && setShowFieldModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={700}>Simpan Lahan</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {saving ? 'Mengambil data lahan...' : 'Lengkapi info lahan sebelum menyimpan.'}
                    </DialogContentText>
                    <Box mt={1}>
                        <Stack spacing={2}>
                            <TextField
                                inputRef={nameInputRef}
                                label="Nama Lahan"
                                value={fieldForm.name}
                                onChange={e => setFieldForm(f => ({ ...f, name: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && !saving && handleModalConfirm()}
                                disabled={saving}
                                fullWidth size="small"
                            />
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel shrink htmlFor="map-planting-date">Tanggal Tanam</InputLabel>
                                <OutlinedInput
                                    id="map-planting-date"
                                    type="date"
                                    value={fieldForm.plantingDate}
                                    onChange={e => setFieldForm(f => ({ ...f, plantingDate: e.target.value }))}
                                    label="Tanggal Tanam"
                                    disabled={saving}
                                />
                            </FormControl>
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setShowFieldModal(false)} color="inherit" size="small" disabled={saving}>Batal</Button>
                    <Button onClick={handleModalConfirm} variant="contained" size="small" disabled={saving}>
                        {saving ? <CircularProgress size={16} color="inherit" /> : 'Simpan'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
