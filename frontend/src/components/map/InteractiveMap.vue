<template>
  <div class="relative w-full h-full min-h-[380px] rounded-xl overflow-hidden border border-slate-200 shadow-sm dark:border-slate-800">
    <div ref="mapContainer" class="w-full h-full min-h-[380px]" :class="{ 'cursor-crosshair': isDrawingMode }"></div>

    <!-- Drawing Controls Overlay (Top Left) -->
    <div class="absolute top-4 left-4 z-[500] flex flex-col gap-2">
      <button
        type="button"
        @click="toggleDrawingMode"
        :class="[
          'flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold text-xs shadow-md transition-all backdrop-blur-md border',
          isDrawingMode
            ? 'bg-rose-600 text-white border-rose-500 hover:bg-rose-700 animate-pulse'
            : 'bg-white/90 text-slate-800 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-900/90 dark:text-slate-100 dark:border-slate-800'
        ]"
      >
        <span v-if="!isDrawingMode">✏️ Gambar Poligon Lahan Baru</span>
        <span v-else>✖️ Batal Menggambar</span>
      </button>

      <!-- Drawing Stats Bar (When Active) -->
      <div
        v-if="isDrawingMode"
        class="bg-white/95 backdrop-blur-md p-3 rounded-lg border border-emerald-500/30 shadow-lg text-xs space-y-2 dark:bg-slate-900/95 dark:border-emerald-500/40 max-w-xs"
      >
        <div class="flex items-center justify-between text-slate-700 dark:text-slate-200">
          <span>📍 Jumlah Titik:</span>
          <span class="font-extrabold text-emerald-600 dark:text-emerald-400">{{ drawnPoints.length }} Titik</span>
        </div>
        <div class="flex items-center justify-between text-slate-700 dark:text-slate-200">
          <span>📐 Luas Area:</span>
          <span class="font-extrabold text-emerald-600 dark:text-emerald-400">{{ calculatedAreaHa }} Ha</span>
        </div>
        <p class="text-[11px] text-slate-500 leading-tight">Klik pada peta untuk menambah sudut poligon (min 3 titik).</p>

        <div class="flex items-center gap-2 pt-1">
          <button
            type="button"
            @click="clearDrawnShape"
            class="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          >
            Reset
          </button>
          <button
            type="button"
            :disabled="drawnPoints.length < 3"
            @click="finishDrawing"
            class="flex-1 px-3 py-1 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Simpan Lahan Ini &rarr;
          </button>
        </div>
      </div>
    </div>

    <!-- Map Legend Overlay (Bottom Right) -->
    <div class="absolute bottom-4 right-4 z-[500] bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 shadow-lg text-xs dark:bg-slate-900/90 dark:border-slate-800">
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

const isDrawingMode = ref(false)
const drawnPoints = ref<Array<[number, number]>>([]) // [lat, lng]

const calculatedAreaHa = computed(() => {
  if (drawnPoints.value.length < 3) return '0.00'
  try {
    // Turf uses [longitude, latitude] format
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
        weight: 2.5,
      })

      const popupContent = `
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <h4 style="font-weight: 700; font-size: 14px; margin: 0 0 4px 0; color: #0f172a;">${field.name}</h4>
          <p style="margin: 2px 0; font-size: 12px; color: #475569;">👤 <b>Pemilik:</b> ${field.owner}</p>
          <p style="margin: 2px 0; font-size: 12px; color: #475569;">🌾 <b>Tanaman:</b> ${field.cropType}</p>
          <p style="margin: 2px 0; font-size: 12px; color: #475569;">📐 <b>Luas:</b> ${field.areaHa} Ha</p>
          <p style="margin: 2px 0; font-size: 12px; color: #475569;">🌱 <b>Fase:</b> ${field.growthStage}</p>
          <div style="margin-top: 8px; padding: 4px 8px; background: ${color}20; border-radius: 6px; border: 1px solid ${color}; display: inline-block;">
            <span style="font-weight: 700; font-size: 12px; color: ${color};">Risko: ${score}/100 (${risk?.riskLevel || 'Sedang'})</span>
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
    const marker = L.circleMarker([lat, lng], {
      radius: 6,
      color: '#059669',
      fillColor: '#10b981',
      fillOpacity: 1,
      weight: 2,
    })
    marker.bindTooltip(`Titik ${idx + 1}`, { permanent: false, direction: 'top' })
    drawLayerGroup!.addLayer(marker)
  })

  // Render polyline / polygon
  if (drawnPoints.value.length === 2) {
    const polyline = L.polyline(drawnPoints.value, {
      color: '#059669',
      weight: 3,
      dashArray: '5, 5',
    })
    drawLayerGroup.addLayer(polyline)
  } else if (drawnPoints.value.length >= 3) {
    const polygon = L.polygon(drawnPoints.value, {
      color: '#059669',
      fillColor: '#34d399',
      fillOpacity: 0.5,
      weight: 3,
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

onMounted(() => {
  if (!mapContainer.value) return

  // Default Center Surabaya/Sidoarjo agriculture region
  map = L.map(mapContainer.value).setView([-7.255, 112.765], 13)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap',
    maxZoom: 19,
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
