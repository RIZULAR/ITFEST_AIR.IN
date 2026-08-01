import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Field, WeatherData, FieldRisk, IrrigationSchedule } from '../types'
import { fetchWeatherData } from '../services/weatherService'
import { calculateFieldRisk, allocateWaterEquitably } from '../services/riskCalculator'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const MOCK_FIELDS: Field[] = [
  {
    id: 'f-1',
    name: 'Lahan Padi Suka Maju (Blok A)',
    owner: 'Pak Sukirman',
    cropType: 'Padi Irigasi',
    soilType: 'Berpasir',
    growthStage: 'Vegetatif',
    areaHa: 2.4,
    coordinates: [
      { lat: -7.252, lng: 112.765 },
      { lat: -7.255, lng: 112.768 },
      { lat: -7.258, lng: 112.764 },
      { lat: -7.254, lng: 112.761 },
    ],
    center: { lat: -7.2547, lng: 112.7645 },
    lastIrrigated: '2026-07-30',
    notes: 'Kondisi tanah berpasir mudah kering, membutuhkan pasokan air rutin.',
  },
  {
    id: 'f-2',
    name: 'Lahan Jagung Subur (Blok B)',
    owner: 'Bu Kartini',
    cropType: 'Jagung Hibrida',
    soilType: 'Lempung Berpasir',
    growthStage: 'Generatif',
    areaHa: 1.8,
    coordinates: [
      { lat: -7.260, lng: 112.770 },
      { lat: -7.263, lng: 112.773 },
      { lat: -7.265, lng: 112.769 },
      { lat: -7.261, lng: 112.767 },
    ],
    center: { lat: -7.2622, lng: 112.7697 },
    lastIrrigated: '2026-07-28',
    notes: 'Memasuki tahap pembungaan, sangat responsif terhadap kelembaban.',
  },
  {
    id: 'f-3',
    name: 'Lahan Bawang Merah Makmur',
    owner: 'Pak Bambang',
    cropType: 'Bawang Merah',
    soilType: 'Lempung',
    growthStage: 'Pra-Panen',
    areaHa: 1.2,
    coordinates: [
      { lat: -7.245, lng: 112.755 },
      { lat: -7.248, lng: 112.758 },
      { lat: -7.250, lng: 112.754 },
      { lat: -7.246, lng: 112.752 },
    ],
    center: { lat: -7.2472, lng: 112.7547 },
    lastIrrigated: '2026-07-31',
    notes: 'Penyiapan menjelang panen, pengurangan volume siram.',
  },
  {
    id: 'f-4',
    name: 'Lahan Kedelai Mandiri',
    owner: 'Pak Ahmad',
    cropType: 'Kedelai',
    soilType: 'Liat',
    growthStage: 'Generatif',
    areaHa: 3.1,
    coordinates: [
      { lat: -7.268, lng: 112.775 },
      { lat: -7.271, lng: 112.778 },
      { lat: -7.273, lng: 112.774 },
      { lat: -7.269, lng: 112.772 },
    ],
    center: { lat: -7.2702, lng: 112.7747 },
    lastIrrigated: '2026-07-26',
    notes: 'Tanah liat tahan menyimpan air namun rentan retak jika kering panjang.',
  },
]

const MOCK_SCHEDULES: IrrigationSchedule[] = [
  {
    id: 'sch-1',
    fieldId: 'f-1',
    fieldName: 'Lahan Padi Suka Maju (Blok A)',
    scheduledDate: '2026-08-02',
    waterVolumeLiters: 42000,
    status: 'Dijadwalkan',
    notes: 'Penyiraman pagi jam 06:00 WIB (Prioritas Kritis)',
  },
  {
    id: 'sch-2',
    fieldId: 'f-2',
    fieldName: 'Lahan Jagung Subur (Blok B)',
    scheduledDate: '2026-08-02',
    waterVolumeLiters: 28000,
    status: 'Dijadwalkan',
    notes: 'Penyiraman sore jam 16:00 WIB',
  },
  {
    id: 'sch-3',
    fieldId: 'f-4',
    fieldName: 'Lahan Kedelai Mandiri',
    scheduledDate: '2026-08-03',
    waterVolumeLiters: 35000,
    status: 'Dijadwalkan',
    notes: 'Penyiraman berkala',
  },
]

function getInitialFields(): Field[] {
  const saved = localStorage.getItem('harvey_fields')
  return saved ? JSON.parse(saved) : MOCK_FIELDS
}

function getInitialSchedules(): IrrigationSchedule[] {
  const saved = localStorage.getItem('harvey_schedules')
  return saved ? JSON.parse(saved) : MOCK_SCHEDULES
}

export const useFieldStore = defineStore('fields', () => {
  const fields = ref<Field[]>(getInitialFields())
  const schedules = ref<IrrigationSchedule[]>(getInitialSchedules())

  const elNinoSeverity = ref<number>(1) // 1 - 10
  const totalWaterSupply = ref<number>(150000) // Total Liter pasokan air
  const isLoadingWeather = ref<boolean>(false)
  const isSyncingSupabase = ref<boolean>(false)

  const weather = ref<WeatherData>({
    temperature: 32,
    humidity: 70,
    rain: 0,
    windSpeed: 12,
    weatherCode: 1,
    weatherDesc: 'Cerah Berawan',
    forecast5Days: [],
    et0: 4.2,
  })

  // Save to localStorage fallback
  function saveToStorage() {
    localStorage.setItem('harvey_fields', JSON.stringify(fields.value))
    localStorage.setItem('harvey_schedules', JSON.stringify(schedules.value))
  }

  // Fetch from Supabase cloud database if configured
  async function syncWithSupabase() {
    if (!isSupabaseConfigured || !supabase) return

    isSyncingSupabase.value = true
    try {
      // 1. Fetch Fields
      const { data: dbFields, error: fieldErr } = await supabase.from('fields').select('*')
      if (!fieldErr && dbFields && dbFields.length > 0) {
        fields.value = dbFields.map((f: any) => ({
          id: f.id,
          name: f.name,
          owner: f.owner,
          cropType: f.crop_type,
          soilType: f.soil_type,
          growthStage: f.growth_stage,
          areaHa: Number(f.area_ha),
          coordinates: f.coordinates,
          center: f.center,
          lastIrrigated: f.last_irrigated,
          notes: f.notes,
        }))
      }

      // 2. Fetch Schedules
      const { data: dbSchedules, error: schErr } = await supabase.from('schedules').select('*')
      if (!schErr && dbSchedules && dbSchedules.length > 0) {
        schedules.value = dbSchedules.map((s: any) => ({
          id: s.id,
          fieldId: s.field_id,
          fieldName: s.field_name,
          scheduledDate: s.scheduled_date,
          waterVolumeLiters: Number(s.water_volume_liters),
          status: s.status,
          notes: s.notes,
        }))
      }
    } catch (e) {
      console.warn('Supabase sync warning:', e)
    } finally {
      isSyncingSupabase.value = false
    }
  }

  // Load weather
  async function loadWeather(lat?: number, lng?: number) {
    isLoadingWeather.value = true
    try {
      const data = await fetchWeatherData(lat, lng)
      weather.value = data
    } finally {
      isLoadingWeather.value = false
    }
  }

  // Calculated risks & water allocations
  const fieldRisks = computed<FieldRisk[]>(() => {
    const rawRisks = fields.value.map((f) => calculateFieldRisk(f, weather.value, totalWaterSupply.value, elNinoSeverity.value))
    return allocateWaterEquitably(rawRisks, totalWaterSupply.value)
  })

  // Metric Summaries
  const totalAreaHa = computed(() => {
    return Number(fields.value.reduce((acc, f) => acc + f.areaHa, 0).toFixed(2))
  })

  const highRiskCount = computed(() => {
    return fieldRisks.value.filter((fr) => fr.riskLevel === 'Kritis' || fr.riskLevel === 'Tinggi').length
  })

  const harveyScore = computed(() => {
    const avgRisk = fieldRisks.value.reduce((acc, fr) => acc + fr.riskScore, 0) / (fieldRisks.value.length || 1)
    return Math.max(0, Math.round(100 - avgRisk))
  })

  // Actions CRUD with Supabase + Local Storage
  async function addField(fieldData: Omit<Field, 'id'>) {
    const newId = 'f-' + Date.now()
    const newField: Field = {
      ...fieldData,
      id: newId,
    }
    fields.value.unshift(newField)
    saveToStorage()

    if (isSupabaseConfigured && supabase) {
      await supabase.from('fields').insert({
        id: newId,
        name: fieldData.name,
        owner: fieldData.owner,
        crop_type: fieldData.cropType,
        soil_type: fieldData.soilType,
        growth_stage: fieldData.growthStage,
        area_ha: fieldData.areaHa,
        coordinates: fieldData.coordinates,
        center: fieldData.center,
        last_irrigated: fieldData.lastIrrigated,
        notes: fieldData.notes,
      })
    }
  }

  async function deleteField(id: string) {
    fields.value = fields.value.filter((f) => f.id !== id)
    schedules.value = schedules.value.filter((s) => s.fieldId !== id)
    saveToStorage()

    if (isSupabaseConfigured && supabase) {
      await supabase.from('fields').delete().eq('id', id)
    }
  }

  async function addSchedule(scheduleData: Omit<IrrigationSchedule, 'id'>) {
    const newId = 'sch-' + Date.now()
    const newSchedule: IrrigationSchedule = {
      ...scheduleData,
      id: newId,
    }
    schedules.value.unshift(newSchedule)
    saveToStorage()

    if (isSupabaseConfigured && supabase) {
      await supabase.from('schedules').insert({
        id: newId,
        field_id: scheduleData.fieldId,
        field_name: scheduleData.fieldName,
        scheduled_date: scheduleData.scheduledDate,
        water_volume_liters: scheduleData.waterVolumeLiters,
        status: scheduleData.status,
        notes: scheduleData.notes,
      })
    }
  }

  async function toggleScheduleStatus(id: string) {
    const sch = schedules.value.find((s) => s.id === id)
    if (sch) {
      sch.status = sch.status === 'Selesai' ? 'Dijadwalkan' : 'Selesai'
      saveToStorage()

      if (isSupabaseConfigured && supabase) {
        await supabase.from('schedules').update({ status: sch.status }).eq('id', id)
      }
    }
  }

  function setElNinoSeverity(val: number) {
    elNinoSeverity.value = val
  }

  function setTotalWaterSupply(val: number) {
    totalWaterSupply.value = val
  }

  // Auto sync on mount if Supabase configured
  if (isSupabaseConfigured) {
    syncWithSupabase()
  }

  return {
    fields,
    schedules,
    elNinoSeverity,
    totalWaterSupply,
    weather,
    isLoadingWeather,
    isSyncingSupabase,
    fieldRisks,
    totalAreaHa,
    highRiskCount,
    harveyScore,
    loadWeather,
    syncWithSupabase,
    addField,
    deleteField,
    addSchedule,
    toggleScheduleStatus,
    setElNinoSeverity,
    setTotalWaterSupply,
  }
})
