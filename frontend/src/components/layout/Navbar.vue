<template>
  <header class="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
    <div class="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
      <!-- Brand Logo -->
      <router-link to="/dashboard" class="flex items-center gap-3 group">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
          <Droplets class="h-6 w-6" />
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <span class="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">air.in</span>
            <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">v2.0</span>
          </div>
          <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400">Smart Water Allocation Platform</p>
        </div>
      </router-link>

      <!-- Weather & Quick Status Pill -->
      <div class="hidden md:flex items-center gap-4">
        <div class="flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1.5 border border-slate-200/60 text-xs dark:bg-slate-900 dark:border-slate-800">
          <Sun v-if="fieldStore.weather.weatherCode <= 1" class="h-4 w-4 text-amber-500 animate-pulse" />
          <CloudRain v-else-if="fieldStore.weather.rain > 0" class="h-4 w-4 text-sky-500" />
          <Cloud v-else class="h-4 w-4 text-slate-500" />
          <span class="font-semibold text-slate-700 dark:text-slate-300">{{ fieldStore.weather.weatherDesc }}</span>
          <span class="text-slate-300 dark:text-slate-700">|</span>
          <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ fieldStore.weather.temperature }}°C</span>
          <span class="text-slate-300 dark:text-slate-700">|</span>
          <span class="text-slate-500">ET0: {{ fieldStore.weather.et0 }} mm/d</span>
        </div>

        <!-- El Nino Status Indicator -->
        <div class="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 border border-amber-200 text-xs dark:bg-amber-950/40 dark:border-amber-900">
          <Flame class="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span class="font-medium text-amber-800 dark:text-amber-300">El Niño: Level {{ fieldStore.elNinoSeverity }}</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex items-center gap-1 sm:gap-2">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
          :class="[route.path === item.to ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400']"
        >
          <component :is="item.icon" class="h-4 w-4" />
          <span class="hidden sm:inline">{{ item.label }}</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useFieldStore } from '../../stores/fieldStore'
import { Droplets, LayoutDashboard, MapPin, Scale, Calendar, Sun, Cloud, CloudRain, Flame } from '@lucide/vue'

const route = useRoute()
const fieldStore = useFieldStore()

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/fields', label: 'Manajemen Lahan', icon: MapPin },
  { to: '/allocation', label: 'Alokasi Air', icon: Scale },
  { to: '/schedule', label: 'Jadwal', icon: Calendar },
]
</script>
