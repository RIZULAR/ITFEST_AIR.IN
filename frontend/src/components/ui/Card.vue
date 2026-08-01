<template>
  <div :class="cn('rounded-xl border border-slate-200/80 bg-white text-slate-950 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50', $attrs.class as string)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '../../lib/utils'
</script>
