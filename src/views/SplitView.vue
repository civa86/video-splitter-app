<template>
  <div class="w-full">
    <div class="w-full flex flex-col bg-gray-200 rounded-lg p-4 mb-6">
      <div class="flex align-middle text-gray-600">
        <FileVideoIcon class="size-6 mr-4" />
        <div class="grow" :title="store.video.name">{{ store.videoName }}</div>
        <div>
          <LoaderSpinner v-if="store.isFetching" class="size-8 text-blue-400" />
          <span v-if="!store.isFetching && store.error === AppError.GET_INFO" class="text-red-600">Error</span>
          <span v-if="!store.isFetching && !store.error">{{ store.video.sexagesimal }}</span>
        </div>
      </div>
    </div>
    <div v-if="store.error === null" class="w-full flex flex-col bg-gray-200 rounded-lg p-4 mb-6">
      <div class="flex align-middle text-gray-600">
        <FileArrowDownIcon class="size-6 mr-4" />
        <LoaderSpinner v-if="store.isFetching" class="size-8 text-blue-400" />
        <div
          v-if="!store.isFetching"
          class="grow cursor-pointer hover:underline"
          @click="store.selectOutput()"
          :title="store.video.path"
        >
          {{ store.videoOutputPath }}
        </div>
        <NumberCounter v-if="!store.isFetching" v-model="store.parts" :min="2" />
      </div>
    </div>

    <!-- Operations Buttons -->
    <div v-if="store.error === null" class="grid grid-cols-4 gap-2">
      <RestartButton mode="normal" :disabled="store.isSplitting" @restart="store.restart()" />
      <SplitButton :loading="store.isFetching" :splitting="store.isSplitting" @split="store.splitVideo()" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// Types
import { AppError } from '../types'
// Store
import { useStore } from '../store/mainStore'
// Icons
import FileVideoIcon from '../components/Icons/FileVideoIcon.vue'
import FileArrowDownIcon from '../components/Icons/FileArrowDownIcon.vue'

// Components
import LoaderSpinner from '../components/LoaderSpinner.vue'
import NumberCounter from '../components/NumberCounter.vue'
import RestartButton from '../components/RestartButton.vue'
import SplitButton from '../components/SplitButton.vue'

const store = useStore()
</script>
