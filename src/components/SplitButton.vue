<template>
  <button
    @click="emit('split')"
    class="col-span-3 w-full bg-blue-400 text-white rounded-lg p-4 flex justify-center disabled:opacity-50"
    :disabled="isLoading"
  >
    <LoaderSpinner v-if="isSplitting" class="size-6 text-white" />
    <ScissorsIcon v-if="!isSplitting" class="size-6 text-white mr-2" />
    <span v-if="!isSplitting">Split</span>
  </button>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import ScissorsIcon from './Icons/ScissorsIcon.vue'
import LoaderSpinner from './LoaderSpinner.vue'

const props = defineProps<{
  loading: boolean
  splitting: boolean
}>()

const emit = defineEmits<{
  (e: 'split'): void
}>()

const { loading: isLoading, splitting: isSplitting } = toRefs(props)
</script>
