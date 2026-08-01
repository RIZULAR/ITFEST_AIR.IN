<template>
  <div class="space-y-6 pb-12">
    <!-- Header Banner -->
    <div class="relative overflow-hidden rounded-2xl bg-slate-900 p-6 md:p-8 text-white shadow-md">
      <div class="relative z-10 max-w-3xl space-y-2">
        <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
          <Sparkles class="h-3.5 w-3.5 text-emerald-300" />
          <span>Sistem Cerdas Pengelolaan Irigasi Lahan Pertanian</span>
        </div>
        <h1 class="text-2xl md:text-4xl font-extrabold tracking-tight">Dashboard Alokasi Air &amp; Pemantauan Lahan</h1>
        <p class="text-sm md:text-base text-emerald-100/90 leading-relaxed">
          Optimalkan distribusi air pertanian secara presisi dengan perhitungan skor risiko kekeringan berbasis kondisi tanah, fase tanaman, dan data cuaca Open-Meteo real-time.
        </p>
      </div>

      <!-- Decorative Background Circle -->
      <div class="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"></div>
      <div class="absolute right-32 -bottom-16 h-48 w-48 rounded-full bg-teal-400/20 blur-2xl"></div>
    </div>

    <!-- Key Metrics Section -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Skor Ketahanan Klaster (air.in Score)"
        :value="fieldStore.harveyScore + ' / 100'"
        :subtext="fieldStore.harveyScore >= 60 ? 'Resiliensi Klaster Baik' : 'Klaster Rentan Kekeringan'"
        :icon="ShieldCheck"
        variant="emerald"
      />
      <MetricCard
        title="Total Luas Lahan Terdaftar"
        :value="fieldStore.totalAreaHa + ' Ha'"
        :subtext="fieldStore.fields.length + ' Petak Lahan Aktif'"
        :icon="Map"
        variant="sky"
      />
      <MetricCard
        title="Lahan Risiko Tinggi / Kritis"
        :value="fieldStore.highRiskCount + ' Lahan'"
        :subtext="fieldStore.highRiskCount > 0 ? 'Membutuhkan Irigasi Segera' : 'Semua Lahan Aman'"
        :icon="AlertTriangle"
        :variant="fieldStore.highRiskCount > 0 ? 'rose' : 'emerald'"
      />
      <MetricCard
        title="Total Pasokan Air Irigasi"
        :value="formatLiters(fieldStore.totalWaterSupply)"
        subtext="Alokasi Air Terdistribusi"
        :icon="Droplets"
        variant="indigo"
      />
    </div>

    <!-- El Niño Simulator & Weather Forecast Row -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- El Nino Live Slider Card -->
      <Card class="p-5 flex flex-col justify-between border-amber-200/80 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900/60">
        <div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Flame class="h-5 w-5" />
              </div>
              <div>
                <h3 class="font-bold text-slate-900 dark:text-slate-100">Simulator Keparahan El Niño</h3>
                <p class="text-xs text-slate-500">Geser untuk simulasi dampak ancaman kekeringan</p>
              </div>
            </div>
            <span class="rounded-full bg-amber-600 text-white px-2.5 py-0.5 text-xs font-bold shadow-sm">
              Level {{ fieldStore.elNinoSeverity }} / 10
            </span>
          </div>

          <div class="mt-6 space-y-4">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              :value="fieldStore.elNinoSeverity"
              @input="(e: any) => fieldStore.setElNinoSeverity(Number(e.target.value))"
              class="w-full h-2.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600 dark:bg-amber-900"
            />
            <div class="flex justify-between text-[11px] font-semibold text-slate-500">
              <span>Level 1 (Normal)</span>
              <span>Level 5 (Sedang)</span>
              <span>Level 10 (Ekstrem)</span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-amber-200/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span>Efek Simulasi:</span>
          <span class="font-semibold">+{{ (fieldStore.elNinoSeverity - 1) * 8 }}% Tambahan Defisit Air</span>
        </div>
      </Card>

      <!-- Weather 5-Day Forecast Card -->
      <Card class="p-5 lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <CloudSun class="h-5 w-5" />
            </div>
            <div>
              <h3 class="font-bold text-slate-900 dark:text-slate-100">Prakiraan Cuaca 5 Hari (Open-Meteo)</h3>
              <p class="text-xs text-slate-500">Data presipitasi &amp; suhu wilayah pertanian</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" @click="fieldStore.loadWeather()" :loading="fieldStore.isLoadingWeather">
            <RefreshCw class="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            v-for="(fc, idx) in fieldStore.weather.forecast5Days"
            :key="idx"
            class="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-center transition-all hover:bg-emerald-50/50 hover:border-emerald-200 dark:bg-slate-900/60 dark:border-slate-800"
          >
            <span class="text-xs font-semibold text-slate-500">{{ fc.date }}</span>
            <Sun v-if="fc.rainSum === 0" class="h-6 w-6 text-amber-500 my-2" />
            <CloudRain v-else-if="fc.rainSum > 2" class="h-6 w-6 text-sky-500 my-2" />
            <Cloud v-else class="h-6 w-6 text-slate-400 my-2" />
            <span class="text-sm font-extrabold text-slate-800 dark:text-slate-200">{{ fc.maxTemp }}° / {{ fc.minTemp }}°C</span>
            <span class="text-[11px] font-medium text-sky-600 dark:text-sky-400 mt-1">{{ fc.rainSum }} mm hujan</span>
          </div>
        </div>
      </Card>
    </div>

    <!-- Map & Priority Allocation Ranking Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Interactive Leaflet Map Preview -->
      <Card class="p-5 lg:col-span-2 flex flex-col justify-between space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MapPin class="h-5 w-5" />
            </div>
            <div>
              <h3 class="font-bold text-slate-900 dark:text-slate-100">Peta Poligon Lahan &amp; Visualisasi Risiko</h3>
              <p class="text-xs text-slate-500">Klik polygon lahan untuk melihat popup detail</p>
            </div>
          </div>
          <router-link to="/fields">
            <Button variant="outline" size="sm">
              Kelola Lahan &rarr;
            </Button>
          </router-link>
        </div>

        <div class="w-full h-[510px] rounded-xl overflow-hidden flex-1">
          <InteractiveMap />
        </div>
      </Card>

      <!-- Priority Water Allocation List -->
      <Card class="p-5 flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <ArrowUpRight class="h-5 w-5" />
              </div>
              <div>
                <h3 class="font-bold text-slate-900 dark:text-slate-100">Prioritas Irigasi Utamakan</h3>
                <p class="text-xs text-slate-500">Lahan dengan skor risiko paling kritis</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="(fr, idx) in fieldStore.fieldRisks.slice(0, 4)"
              :key="fr.fieldId"
              class="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-slate-400">#{{ idx + 1 }}</span>
                <Badge
                  :variant="fr.riskLevel === 'Kritis' ? 'danger' : fr.riskLevel === 'Tinggi' ? 'warning' : 'default'"
                >
                  Risk: {{ fr.riskScore }}/100
                </Badge>
              </div>

              <div>
                <h4 class="font-bold text-sm text-slate-900 dark:text-slate-100">{{ fr.fieldName }}</h4>
                <div class="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>{{ fr.owner }}</span>
                  <span>•</span>
                  <span>{{ fr.cropType }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                <span class="text-slate-600 dark:text-slate-400">Kuota Irigasi:</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ formatLiters(fr.recommendedWaterLiters) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-3">
          <router-link to="/allocation" class="w-full block">
            <Button variant="agri" class="w-full">
              Lihat Detail Alokasi Air &rarr;
            </Button>
          </router-link>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFieldStore } from '../stores/fieldStore'
import { formatLiters } from '../lib/utils'
import MetricCard from '../components/common/MetricCard.vue'
import InteractiveMap from '../components/map/InteractiveMap.vue'
import Button from '../components/ui/Button.vue'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import {
  Sparkles,
  ShieldCheck,
  Map,
  AlertTriangle,
  Droplets,
  Flame,
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  RefreshCw,
  MapPin,
  ArrowUpRight,
} from '@lucide/vue'

const fieldStore = useFieldStore()

onMounted(() => {
  fieldStore.loadWeather()
})
</script>
