<template>
  <div class="w-full">
    <div class="w-full bg-gray-200 rounded-lg p-4 mb-6">
      <div class="flex items-center justify-center text-red-500">
        <AlertIcon class="size-6 mr-4" />
        <span>Something went wrong</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Icons
import AlertIcon from '../components/Icons/AlertIcon.vue'
</script>
