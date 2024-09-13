<template>
  <div class="w-full">
    <div class="w-full bg-green-200 rounded-lg p-8 flex flex-col cursor-pointer" @click="emit('restart')">
      <div class="flex items-center justify-center text-green-700">
        <CheckIcon class="size-6 mr-4" />
        <span>Done!</span>
      </div>
      <span class="text-center text-sm italic text-gray-500 mt-4">Click here to restart</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Icons
import CheckIcon from '../components/Icons/CheckIcon.vue'

const emit = defineEmits<{
  (e: 'restart'): void
}>()
</script>
