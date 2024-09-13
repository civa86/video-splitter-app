<template>
  <button
    @click="emit('restart')"
    class="text-white rounded-lg p-4 flex justify-center disabled:opacity-50"
    :class="{
      'bg-red-500': mode === 'error',
      'bg-gray-500': mode === 'normal'
    }"
  >
    <ReloadIcon class="size-6" :class="{ 'mr-2': label === true }" />
    <span v-if="label">Restart</span>
  </button>
</template>

<script lang="ts" setup>
import ReloadIcon from './Icons/ReloadIcon.vue'

defineProps<{
  mode: 'normal' | 'error'
  label?: boolean
}>()

const emit = defineEmits<{
  (e: 'restart'): void
}>()
</script>
