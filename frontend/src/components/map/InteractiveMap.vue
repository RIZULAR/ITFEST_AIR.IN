<template>
  <div class="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-slate-200 shadow-sm dark:border-slate-800">
    <div ref="mapContainer" class="w-full h-full min-h-[400px]" :class="{ 'cursor-crosshair': isDrawingMode }"></div>

    <!-- Drawing & Map Control Overlay (Top Right) -->
    <div class="absolute top-3 right-3 z-[600] flex flex-wrap items-center gap-2">
      <!-- Map Type Switcher Button (Satelit Earth vs Peta Jalan) -->
      <button
        type="button"
        @click="toggleMapType"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-slate-800 border border-slate-200 font-bold text-xs shadow-md hover:bg-slate-100 dark:bg-slate-900/95 dark:text-slate-100 dark:border-slate-800 transition-colors"
      >
        <span>{{ mapType === 'satellite' ? '🛰️ Mode Satelit (Earth)' : '🗺️ Mode Peta Vektor' }}</span>
      </button>

      <!-- Toggle Drawing Mode -->
      <button
        type="button"
        @click="toggleDrawingMode"
        :class="[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shadow-md transition-all backdrop-blur-md border',
          isDrawingMode
            ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700'
            : 'bg-white/95 text-slate-800 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-900/95 dark:text-slate-100 dark:border-slate-800'
        ]"
      >
        <span>✏️ {{ isDrawingMode ? 'Mode Gambar Aktif' : 'Gambar Poligon' }}</span>
      </button>

      <template v-if="isDrawingMode">
        <!-- Undo Button -->
        <button
          type="button"
          @click="undoLastPoint"
          :disabled="drawnPoints.length === 0"
          class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/95 text-slate-700 border border-slate-200 font-semibold text-xs shadow-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-slate-900/95 dark:text-slate-200 dark:border-slate-800"
        >
          ↩️ Undo
        </button>

        <!-- Clear Button -->
        <button
          type="button"
          @click="clearDrawnShape"
          :disabled="drawnPoints.length === 0"
          class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/95 text-slate-700 border border-slate-200 font-semibold text-xs shadow-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-slate-900/95 dark:text-slate-200 dark:border-slate-800"
        >
          🧹 Clear
        </button>

        <!-- Finish Button -->
        <button
          type="button"
          @click="finishDrawing"
          :disabled="drawnPoints.length < 3"
          class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ✅ Finish
        </button>
      </template>

      <!-- Locate Me Button -->
      <button
        type="button"
        @click="locateUser"
        :disabled="isLocating"
        class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/95 text-slate-800 border border-slate-200 font-bold text-xs shadow-md hover:bg-slate-100 disabled:opacity-50 dark:bg-slate-900/95 dark:text-slate-100 dark:border-slate-800"
      >
        <span v-if="!isLocating">📍 Lokasi Saya</span>
        <span v-else class="animate-spin">🌀</span>
      </button>
    </div>

    <!-- Live Drawing Indicator Chip (Bottom Left) -->
    <div v-if="isDrawingMode" class="absolute bottom-3 left-3 z-[600] flex flex-col gap-1.5">
      <div class="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-md text-xs font-semibold text-slate-800 dark:bg-slate-900/95 dark:text-slate-100 dark:border-slate-800 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>
          {{ drawnPoints.length }} Titik
          <template v-if="drawnPoints.length < 3"> (min {{ 3 - drawnPoints.length }} lagi)</template>
          <template v-else> (Luas: {{ calculatedAreaHa }} Ha)</template>
        </span>
      </div>
    </div>

    <!-- Map Legend Overlay (Bottom Right) -->
    <div class="absolute bottom-3 right-3 z-[500] bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 shadow-lg text-xs dark:bg-slate-900/90 dark:border-slate-800">
      <div class="font-semibold text-slate-800 dark:text-slate-200 mb-1">Tingkat Risiko Irigasi</div>
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
          <span class="text-slate-600 dark:text-slate-400">Kritis (75-100)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
          <span class="text-slate-600 dark:text-slate-400">Tinggi (55-74)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>
          <span class="text-slate-600 dark:text-slate-400">Sedang (35-54)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <span class="text-slate-600 dark:text-slate-400">Rendah (&lt; 35)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick, computed } from 'vue'
import L from 'leaflet'
import * as turf from '@turf/turf'
import { useFieldStore } from '../../stores/fieldStore'

const emit = defineEmits<{
  (e: 'polygonCreated', data: { coordinates: Array<{ lat: number; lng: number }>; areaHa: number }): void
}>()

const fieldStore = useFieldStore()
const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let polygonGroup: L.LayerGroup | null = null
let drawLayerGroup: L.LayerGroup | null = null
let tileLayer: L.TileLayer | null = null

const isDrawingMode = ref(false)
const isLocating = ref(false)
const mapType = ref<'satellite' | 'vector'>('satellite') // Default High-Res Satellite View!
const drawnPoints = ref<Array<[number, number]>>([]) // [lat, lng]

const TILE_URLS = {
  // Google Satellite Hybrid High-Res imagery with street labels
  satellite: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
  // CartoDB Voyager clean street map
  vector: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
}

const calculatedAreaHa = computed(() => {
  if (drawnPoints.value.length < 3) return '0.00'
  try {
    const coordinates = [...drawnPoints.value.map(([lat, lng]) => [lng, lat])]
    coordinates.push(coordinates[0]) // Close polygon ring
    const polygonFeature = turf.polygon([coordinates])
    const areaSqMeters = turf.area(polygonFeature)
    const areaHa = areaSqMeters / 10000
    return areaHa.toFixed(2)
  } catch {
    return '0.00'
  }
})

function toggleMapType() {
  if (!map) return
  mapType.value = mapType.value === 'satellite' ? 'vector' : 'satellite'

  if (tileLayer) {
    map.removeLayer(tileLayer)
  }

  tileLayer = L.tileLayer(TILE_URLS[mapType.value], {
    attribution: mapType.value === 'satellite' ? '&copy; Google Maps Satellite' : '&copy; CARTO & OpenStreetMap',
    maxZoom: 20,
  }).addTo(map)
}

function getRiskColor(score: number): string {
  if (score >= 75) return '#ef4444' // Red Critical
  if (score >= 55) return '#f59e0b' // Amber High
  if (score >= 35) return '#0ea5e9' // Sky Medium
  return '#10b981' // Emerald Low
}

function renderPolygons() {
  if (!map || !polygonGroup) return
  polygonGroup.clearLayers()

  fieldStore.fields.forEach((field) => {
    const risk = fieldStore.fieldRisks.find((r) => r.fieldId === field.id)
    const score = risk?.riskScore ?? 50
    const color = getRiskColor(score)

    const latLngs = field.coordinates.map((c) => [c.lat, c.lng] as [number, number])
    if (latLngs.length > 0) {
      const polygon = L.polygon(latLngs, {
        color: color,
        fillColor: color,
        fillOpacity: 0.45,
        weight: 3,
      })

      const popupContent = `
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <h4 style="font-weight: 700; font-size: 14px; margin: 0 0 4px 0; color: #0f172a;">${field.name}</h4>
          <p style="margin: 2px 0; font-size: 12px; color: #475569;">👤 <b>Pemilik:</b> ${field.owner}</p>
          <p style="margin: 2px 0; font-size: 12px; color: #475569;">🌾 <b>Tanaman:</b> ${field.cropType}</p>
          <p style="margin: 2px 0; font-size: 12px; color: #475569;">📐 <b>Luas:</b> ${field.areaHa} Ha</p>
          <p style="margin: 2px 0; font-size: 12px; color: #475569;">🌱 <b>Fase:</b> ${field.growthStage}</p>
          <div style="margin-top: 8px; padding: 4px 8px; background: ${color}20; border-radius: 6px; border: 1px solid ${color}; display: inline-block;">
            <span style="font-weight: 700; font-size: 12px; color: ${color};">Risiko: ${score}/100 (${risk?.riskLevel || 'Sedang'})</span>
          </div>
        </div>
      `

      polygon.bindPopup(popupContent)
      polygonGroup.addLayer(polygon)
    }
  })
}

function updateDrawPreview() {
  if (!drawLayerGroup) return
  drawLayerGroup.clearLayers()

  if (drawnPoints.value.length === 0) return

  // Render markers for vertices
  drawnPoints.value.forEach(([lat, lng], idx) => {
    const isFirst = idx === 0
    const marker = L.circleMarker([lat, lng], {
      radius: isFirst ? 9 : 6,
      color: '#ffffff',
      fillColor: isFirst ? '#10b981' : '#059669',
      fillOpacity: 1,
      weight: 2.5,
    })
    marker.bindTooltip(`Titik ${idx + 1}`, { permanent: false, direction: 'top' })
    drawLayerGroup!.addLayer(marker)
  })

  // Dashed Polyline connecting vertices
  if (drawnPoints.value.length >= 2) {
    const polyline = L.polyline(drawnPoints.value, {
      color: '#34d399',
      weight: 3,
      dashArray: '6, 4',
    })
    drawLayerGroup.addLayer(polyline)

    // Dashed closing polyline back to start point
    const closingPolyline = L.polyline([drawnPoints.value[drawnPoints.value.length - 1], drawnPoints.value[0]], {
      color: '#34d399',
      weight: 2,
      dashArray: '4, 4',
      opacity: 0.7,
    })
    drawLayerGroup.addLayer(closingPolyline)
  }

  // Filled polygon if >= 3 points
  if (drawnPoints.value.length >= 3) {
    const polygon = L.polygon(drawnPoints.value, {
      color: '#059669',
      fillColor: '#10b981',
      fillOpacity: 0.45,
      weight: 2.5,
    })
    drawLayerGroup.addLayer(polygon)
  }
}

function handleMapClick(e: L.LeafletMouseEvent) {
  if (!isDrawingMode.value) return
  drawnPoints.value.push([e.latlng.lat, e.latlng.lng])
  updateDrawPreview()
}

function toggleDrawingMode() {
  isDrawingMode.value = !isDrawingMode.value
  if (!isDrawingMode.value) {
    clearDrawnShape()
  }
}

function undoLastPoint() {
  if (drawnPoints.value.length > 0) {
    drawnPoints.value.pop()
    updateDrawPreview()
  }
}

function clearDrawnShape() {
  drawnPoints.value = []
  if (drawLayerGroup) drawLayerGroup.clearLayers()
}

function finishDrawing() {
  if (drawnPoints.value.length < 3) return

  const coords = drawnPoints.value.map(([lat, lng]) => ({ lat, lng }))
  const areaHa = parseFloat(calculatedAreaHa.value)

  emit('polygonCreated', {
    coordinates: coords,
    areaHa: areaHa > 0 ? areaHa : 1.5,
  })

  isDrawingMode.value = false
  clearDrawnShape()
}

function locateUser() {
  if (!map || !navigator.geolocation) return
  isLocating.value = true

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      map?.flyTo([latitude, longitude], 16, { duration: 1.2 })
      isLocating.value = false
    },
    (err) => {
      console.warn('Location error:', err)
      isLocating.value = false
    },
    { enableHighAccuracy: true, timeout: 5000 }
  )
}

onMounted(() => {
  if (!mapContainer.value) return

  // Default Center Surabaya/Sidoarjo agriculture region
  map = L.map(mapContainer.value).setView([-7.255, 112.765], 14)

  // Default Satellite Hybrid Layer (Google Earth high resolution!)
  tileLayer = L.tileLayer(TILE_URLS.satellite, {
    attribution: '&copy; Google Maps Satellite',
    maxZoom: 20,
  }).addTo(map)

  polygonGroup = L.layerGroup().addTo(map)
  drawLayerGroup = L.layerGroup().addTo(map)

  map.on('click', handleMapClick)

  renderPolygons()

  nextTick(() => {
    if (map) map.invalidateSize()
  })
})

watch(
  () => [fieldStore.fields, fieldStore.fieldRisks],
  () => {
    renderPolygons()
  },
  { deep: true }
)

onUnmounted(() => {
  if (map) {
    map.off('click', handleMapClick)
    map.remove()
    map = null
  }
})
</script>
