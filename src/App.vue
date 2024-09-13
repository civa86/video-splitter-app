<template>
  <div class="flex h-screen w-screen p-6 bg-gray-700 items-center">
    <div class="w-full flex flex-col items-center">
      <InputView @file="store.setVideoElement" v-if="store.error === null && store.appStatus === AppStatus.INPUT" />
      <SplitView v-if="store.error === null && store.appStatus === AppStatus.SPLIT" />
      <SuccessView v-if="store.error === null && store.appStatus === AppStatus.SUCCESS" @restart="store.restart()" />
      <ErrorView v-if="store.error === AppError.SPLIT" />
      <RestartButton v-if="store.error !== null" class="w-full" mode="error" label @restart="store.restart()" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// TODO: change app icons

// Types
import { AppStatus, AppError } from './types'
// Store
import { useStore } from './store/mainStore'
// Views
import InputView from './views/InputView.vue'
import SplitView from './views/SplitView.vue'
import SuccessView from './views/SuccessView.vue'
import ErrorView from './views/ErrorView.vue'
//Components
import RestartButton from './components/RestartButton.vue'
const store = useStore()
</script>
