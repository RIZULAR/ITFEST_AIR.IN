<template>
  <div class="space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Jadwal Irigasi Terjadwal</h1>
        <p class="text-sm text-slate-500">Rencana eksekusi penyiraman lahan berdasarkan rekomendasi alokasi air.</p>
      </div>

      <Button variant="agri" @click="showAddModal = true">
        <Plus class="h-4 w-4 mr-2" />
        Tambah Jadwal Irigasi
      </Button>
    </div>

    <!-- Schedule List Table -->
    <Card class="overflow-hidden">
      <div class="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <h3 class="font-bold text-slate-900 dark:text-slate-100">Daftar Agenda Penyiraman</h3>
        <Badge variant="default">{{ fieldStore.schedules.length }} Agenda</Badge>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead class="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <tr>
              <th class="px-5 py-3.5">Tanggal Execution</th>
              <th class="px-5 py-3.5">Nama Lahan</th>
              <th class="px-5 py-3.5">Volume Air</th>
              <th class="px-5 py-3.5">Status</th>
              <th class="px-5 py-3.5">Catatan</th>
              <th class="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200/80 dark:divide-slate-800">
            <tr
              v-for="sch in fieldStore.schedules"
              :key="sch.id"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors"
              :class="{ 'opacity-60 line-through bg-slate-50/40': sch.status === 'Selesai' }"
            >
              <td class="px-5 py-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar class="h-4 w-4 text-emerald-600" />
                {{ sch.scheduledDate }}
              </td>
              <td class="px-5 py-4 font-bold text-slate-800 dark:text-slate-200">{{ sch.fieldName }}</td>
              <td class="px-5 py-4 font-semibold text-emerald-600 dark:text-emerald-400">{{ formatLiters(sch.waterVolumeLiters) }}</td>
              <td class="px-5 py-4">
                <button
                  @click="fieldStore.toggleScheduleStatus(sch.id)"
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer"
                  :class="sch.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 hover:scale-105'"
                >
                  <CheckCircle2 v-if="sch.status === 'Selesai'" class="h-3.5 w-3.5" />
                  <Clock v-else class="h-3.5 w-3.5" />
                  {{ sch.status }}
                </button>
              </td>
              <td class="px-5 py-4 text-xs text-slate-500">{{ sch.notes }}</td>
              <td class="px-5 py-4 text-right">
                <Button variant="ghost" size="sm" class="text-rose-600 hover:bg-rose-50" @click="fieldStore.schedules = fieldStore.schedules.filter(s => s.id !== sch.id)">
                  <Trash2 class="h-4 w-4" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Modal Form Tambah Jadwal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Tambah Jadwal Irigasi Baru</h3>
          <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="handleAddSchedule" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pilih Lahan Target</label>
            <select v-model="form.fieldId" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800">
              <option v-for="f in fieldStore.fields" :key="f.id" :value="f.id">{{ f.name }} ({{ f.owner }})</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tanggal Eksekusi</label>
              <input v-model="form.scheduledDate" required type="date" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Volume Air (Liter)</label>
              <input v-model.number="form.waterVolumeLiters" required type="number" step="1000" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Catatan Instuksi</label>
            <input v-model="form.notes" type="text" placeholder="Contoh: Siram jam 06:00 WIB pagi" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800" />
          </div>

          <div class="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" @click="showAddModal = false">Batal</Button>
            <Button type="submit" variant="agri">Simpan Jadwal</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFieldStore } from '../stores/fieldStore'
import { formatLiters } from '../lib/utils'
import Button from '../components/ui/Button.vue'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import { Calendar, Plus, Trash2, CheckCircle2, Clock, X } from '@lucide/vue'

const fieldStore = useFieldStore()
const showAddModal = ref(false)

const form = ref({
  fieldId: fieldStore.fields[0]?.id || '',
  scheduledDate: new Date().toISOString().split('T')[0],
  waterVolumeLiters: 30000,
  notes: 'Penyiraman rutin',
})

function handleAddSchedule() {
  const targetField = fieldStore.fields.find((f) => f.id === form.value.fieldId)
  if (!targetField) return

  fieldStore.addSchedule({
    fieldId: targetField.id,
    fieldName: targetField.name,
    scheduledDate: form.value.scheduledDate,
    waterVolumeLiters: form.value.waterVolumeLiters,
    status: 'Dijadwalkan',
    notes: form.value.notes,
  })

  showAddModal.value = false
}
</script>
