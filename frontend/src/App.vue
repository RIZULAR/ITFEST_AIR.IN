<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased dark:bg-slate-950 dark:text-slate-50 flex flex-col justify-between">
    <div>
      <Navbar />
      <main class="container mx-auto px-4 md:px-6 pt-6">
        <router-view />
      </main>
    </div>

    <!-- Footer -->
    <footer class="border-t border-slate-200/80 bg-white py-6 dark:border-slate-800 dark:bg-slate-950">
      <div class="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div class="flex items-center gap-2">
          <span class="font-bold text-emerald-600 dark:text-emerald-400">HARVEY</span>
          <span>&copy; 2026 - Smart Agriculture &amp; Water Allocation System</span>
        </div>
        <div class="flex items-center gap-4">
          <span>Powered by Vue 3, Vite, Tailwind CSS, &amp; Open-Meteo</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/layout/Navbar.vue'
</script>
