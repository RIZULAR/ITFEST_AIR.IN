<template>
  <div class="relative w-full h-full min-h-[350px] rounded-xl overflow-hidden border border-slate-200 shadow-sm dark:border-slate-800">
    <div ref="mapContainer" class="w-full h-full min-h-[350px]"></div>

    <!-- Map Legend Overlay -->
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
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import { useFieldStore } from '../../stores/fieldStore'

const fieldStore = useFieldStore()
const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let polygonGroup: L.LayerGroup | null = null

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

onMounted(() => {
  if (!mapContainer.value) return

  // Default Center Surabaya/Sidoarjo agriculture region
  map = L.map(mapContainer.value).setView([-7.255, 112.765], 13)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap',
    maxZoom: 19,
  }).addTo(map)

  polygonGroup = L.layerGroup().addTo(map)
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
    map.remove()
    map = null
  }
})
</script>
