<template>
  <Card class="relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ title }}</p>
        <h3 class="text-2xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-slate-100">{{ value }}</h3>
        <p v-if="subtext" class="text-xs mt-1 font-medium" :class="subtextColorClass">{{ subtext }}</p>
      </div>

      <div :class="cn('flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md', iconBgClass)">
        <component :is="icon" class="h-6 w-6" />
      </div>
    </div>

    <!-- Bottom Accent Gradient Bar -->
    <div :class="cn('absolute bottom-0 left-0 right-0 h-1', accentClass)"></div>
  </Card>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import Card from '../ui/Card.vue'
import { cn } from '../../lib/utils'

interface Props {
  title: string
  value: string | number
  subtext?: string
  icon: Component
  variant?: 'emerald' | 'sky' | 'amber' | 'rose' | 'indigo'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'emerald',
})

const iconBgClass = computed(() => {
  switch (props.variant) {
    case 'emerald':
      return 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20'
    case 'sky':
      return 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/20'
    case 'amber':
      return 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20'
    case 'rose':
      return 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/20'
    case 'indigo':
      return 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20'
    default:
      return 'bg-emerald-600'
  }
})

const accentClass = computed(() => {
  switch (props.variant) {
    case 'emerald':
      return 'bg-gradient-to-r from-emerald-500 to-teal-500'
    case 'sky':
      return 'bg-gradient-to-r from-sky-500 to-blue-500'
    case 'amber':
      return 'bg-gradient-to-r from-amber-500 to-orange-500'
    case 'rose':
      return 'bg-gradient-to-r from-rose-500 to-red-500'
    case 'indigo':
      return 'bg-gradient-to-r from-indigo-500 to-purple-500'
    default:
      return 'bg-emerald-500'
  }
})

const subtextColorClass = computed(() => {
  switch (props.variant) {
    case 'rose':
      return 'text-rose-600 dark:text-rose-400'
    case 'amber':
      return 'text-amber-600 dark:text-amber-400'
    case 'sky':
      return 'text-sky-600 dark:text-sky-400'
    default:
      return 'text-emerald-600 dark:text-emerald-400'
  }
})
</script>
