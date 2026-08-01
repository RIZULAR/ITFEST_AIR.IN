<template>
  <div class="space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Manajemen Lahan Pertanian</h1>
        <p class="text-sm text-slate-500">Kelola pemetaan polygon lahan, tipe tanah, fase tanaman, dan riwayat penyiraman.</p>
      </div>

      <Button variant="agri" @click="showAddModal = true">
        <Plus class="h-4 w-4 mr-2" />
        Tambah Lahan Baru
      </Button>
    </div>

    <!-- Map Full Width View with Interactive Polygon Drawing -->
    <Card class="p-5 space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MapPin class="h-5 w-5 text-emerald-600" />
          Peta Persebaran &amp; Editor Poligon Lahan
        </h3>
        <span class="text-xs text-slate-500 font-semibold">{{ fieldStore.fields.length }} Lahan Terdaftar</span>
      </div>
      <div class="w-full h-[450px]">
        <InteractiveMap @polygonCreated="handlePolygonCreated" />
      </div>
    </Card>

    <!-- Table of Fields -->
    <Card class="overflow-hidden">
      <div class="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <h3 class="font-bold text-slate-900 dark:text-slate-100">Daftar Rincian Petak Lahan</h3>
        <div class="text-xs text-slate-500 font-medium">Total Luas: <span class="font-bold text-emerald-600">{{ fieldStore.totalAreaHa }} Ha</span></div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead class="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <tr>
              <th class="px-5 py-3.5">Nama Lahan</th>
              <th class="px-5 py-3.5">Pemilik</th>
              <th class="px-5 py-3.5">Jenis Tanaman</th>
              <th class="px-5 py-3.5">Tipe Tanah</th>
              <th class="px-5 py-3.5">Fase Tumbuh</th>
              <th class="px-5 py-3.5">Luas (Ha)</th>
              <th class="px-5 py-3.5">Skor Risiko</th>
              <th class="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200/80 dark:divide-slate-800">
            <tr v-for="field in fieldStore.fields" :key="field.id" class="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors">
              <td class="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">
                {{ field.name }}
              </td>
              <td class="px-5 py-4">{{ field.owner }}</td>
              <td class="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">{{ field.cropType }}</td>
              <td class="px-5 py-4">
                <span class="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {{ field.soilType }}
                </span>
              </td>
              <td class="px-5 py-4">
                <GrowthStageBadge :stage="field.growthStage" />
              </td>
              <td class="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">{{ field.areaHa }} Ha</td>
              <td class="px-5 py-4">
                <Badge :variant="getRisk(field.id)?.riskLevel === 'Kritis' ? 'danger' : getRisk(field.id)?.riskLevel === 'Tinggi' ? 'warning' : 'default'">
                  {{ getRisk(field.id)?.riskScore }}/100 ({{ getRisk(field.id)?.riskLevel }})
                </Badge>
              </td>
              <td class="px-5 py-4 text-right">
                <Button variant="ghost" size="sm" class="text-rose-600 hover:text-rose-700 hover:bg-rose-50" @click="fieldStore.deleteField(field.id)">
                  <Trash2 class="h-4 w-4" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Modal Form Tambah Lahan Baru -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Tambah Lahan Baru</h3>
            <p v-if="drawnCoordinates" class="text-xs text-emerald-600 font-semibold mt-0.5">
              ✓ Koordinat &amp; Luas Poligon dari Peta Telah Terisi Otomatis
            </p>
          </div>
          <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="handleAddSubmit" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Lahan</label>
            <input v-model="form.name" required type="text" placeholder="Contoh: Lahan Padi Blok C" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Pemilik</label>
              <input v-model="form.owner" required type="text" placeholder="Pak Slamet" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Jenis Tanaman</label>
              <input v-model="form.cropType" required type="text" placeholder="Padi Hibrida" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tipe Tanah</label>
              <select v-model="form.soilType" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800">
                <option value="Berpasir">Berpasir (Daya Simpan Rendah)</option>
                <option value="Lempung Berpasir">Lempung Berpasir</option>
                <option value="Lempung">Lempung (Sedang)</option>
                <option value="Organik">Organik</option>
                <option value="Liat">Liat (Daya Simpan Tinggi)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Fase Pertumbuhan</label>
              <select v-model="form.growthStage" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800">
                <option value="Vegetatif">Vegetatif (Air Kritis)</option>
                <option value="Generatif">Generatif (Air Kritis)</option>
                <option value="Pra-Panen">Pra-Panen (Air Sedang)</option>
                <option value="Panen">Panen (Air Minimal)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Luas Lahan (Hektar)</label>
            <input v-model.number="form.areaHa" required type="number" step="0.01" min="0.01" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800" />
          </div>

          <div class="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" @click="showAddModal = false">Batal</Button>
            <Button type="submit" variant="agri">Simpan Lahan</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFieldStore } from '../stores/fieldStore'
import { SoilType, GrowthStage } from '../types'
import Button from '../components/ui/Button.vue'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import GrowthStageBadge from '../components/common/GrowthStageBadge.vue'
import InteractiveMap from '../components/map/InteractiveMap.vue'
import { MapPin, Plus, Trash2, X } from '@lucide/vue'

const fieldStore = useFieldStore()
const showAddModal = ref(false)
const drawnCoordinates = ref<Array<{ lat: number; lng: number }> | null>(null)

const form = ref({
  name: '',
  owner: '',
  cropType: '',
  soilType: 'Lempung' as SoilType,
  growthStage: 'Vegetatif' as GrowthStage,
  areaHa: 1.5,
})

function getRisk(fieldId: string) {
  return fieldStore.fieldRisks.find((r) => r.fieldId === fieldId)
}

function handlePolygonCreated(data: { coordinates: Array<{ lat: number; lng: number }>; areaHa: number }) {
  drawnCoordinates.value = data.coordinates
  form.value.areaHa = data.areaHa
  showAddModal.value = true
}

function handleAddSubmit() {
  const coords = drawnCoordinates.value || [
    { lat: -7.250 + (Math.random() - 0.5) * 0.02, lng: 112.760 + (Math.random() - 0.5) * 0.02 },
    { lat: -7.253 + (Math.random() - 0.5) * 0.02, lng: 112.763 + (Math.random() - 0.5) * 0.02 },
    { lat: -7.256 + (Math.random() - 0.5) * 0.02, lng: 112.759 + (Math.random() - 0.5) * 0.02 },
  ]
  const centerLat = coords.reduce((acc, c) => acc + c.lat, 0) / coords.length
  const centerLng = coords.reduce((acc, c) => acc + c.lng, 0) / coords.length

  fieldStore.addField({
    ...form.value,
    coordinates: coords,
    center: { lat: centerLat, lng: centerLng },
    lastIrrigated: new Date().toISOString().split('T')[0],
  })

  showAddModal.value = false
  drawnCoordinates.value = null
  form.value = {
    name: '',
    owner: '',
    cropType: '',
    soilType: 'Lempung',
    growthStage: 'Vegetatif',
    areaHa: 1.5,
  }
}
</script>
