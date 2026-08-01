<template>
  <Badge :variant="badgeVariant">
    <Sprout v-if="stage === 'Vegetatif'" class="mr-1 h-3 w-3 inline" />
    <Flower2 v-else-if="stage === 'Generatif'" class="mr-1 h-3 w-3 inline" />
    <Wheat v-else-if="stage === 'Pra-Panen'" class="mr-1 h-3 w-3 inline" />
    <CheckCircle2 v-else class="mr-1 h-3 w-3 inline" />
    {{ stage }}
  </Badge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GrowthStage } from '../../types'
import Badge from '../ui/Badge.vue'
import { Sprout, Flower2, Wheat, CheckCircle2 } from '@lucide/vue'

interface Props {
  stage: GrowthStage
}

const props = defineProps<Props>()

const badgeVariant = computed(() => {
  switch (props.stage) {
    case 'Vegetatif':
      return 'default'
    case 'Generatif':
      return 'secondary'
    case 'Pra-Panen':
      return 'warning'
    case 'Panen':
      return 'outline'
    default:
      return 'default'
  }
})
</script>
