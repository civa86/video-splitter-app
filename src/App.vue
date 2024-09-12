<template>
  <div class="flex h-screen w-screen p-6 bg-gray-700">
    <!-- TODO manage views -->
    <!-- INPUT STEP -->
    <FileDrop @file="onFile" v-if="appStatus === AppStatus.INPUT" />

    <!-- SPLIT STEP -->
    <div class="w-full" v-if="appStatus === AppStatus.SPLIT">
      <div class="w-full flex flex-col bg-gray-200 rounded-lg p-4 mb-6">
        <div class="flex align-middle text-gray-600">
          <FileVideoIcon class="size-6 mr-4" />
          <div class="grow" :title="video.name">{{ truncateInTheMiddle(video.name, 40) }}</div>
          <div>
            <LoaderSpinner v-if="isFetching" class="size-8 text-blue-400" />
            <span v-if="!isFetching && error" class="text-red-600">ERROR</span>
            <span v-if="!isFetching && !error">{{ video.sexagesimal }}</span>
          </div>
        </div>
      </div>
      <div v-if="!error" class="w-full flex flex-col bg-gray-200 rounded-lg p-4 mb-6">
        <div class="flex align-middle text-gray-600">
          <FileArrowDownIcon class="size-6 mr-4" />
          <LoaderSpinner v-if="isFetching" class="size-8 text-blue-400" />
          <div
            v-if="!isFetching"
            class="grow cursor-pointer hover:underline"
            @click="selectOutput()"
            :title="video.path"
          >
            {{ `${truncateInTheMiddle(video.prettyPath, 39)}/` }}
          </div>
          <NumberCounter v-if="!isFetching" v-model="parts" :min="2" />
        </div>
      </div>

      <!-- Operations Buttons -->
      <div v-if="!error" class="grid grid-cols-4 gap-2">
        <button
          @click="restart()"
          class="w-full bg-gray-500 text-white rounded-lg p-4 flex justify-center disabled:opacity-50"
          :disabled="isSplitting"
        >
          <ReloadIcon class="size-6 mr-2" />
        </button>
        <button
          @click="splitVideo()"
          class="col-span-3 w-full bg-blue-400 text-white rounded-lg p-4 flex justify-center disabled:opacity-50"
          :disabled="isFetching"
        >
          <LoaderSpinner v-if="isSplitting" class="size-6 text-white" />
          <ScissorsIcon v-if="!isSplitting" class="size-6 text-white mr-2" />
          <span v-if="!isSplitting">Split</span>
        </button>
      </div>

      <!-- Restart Button -->
      <button v-if="error" @click="restart()" class="w-full bg-red-500 text-white rounded-lg p-4 flex justify-center">
        <ReloadIcon class="size-6 mr-2" />
        <span>Restart</span>
      </button>
    </div>

    <!-- SUCCESS STEP -->
    <div class="w-full" v-if="appStatus === AppStatus.SUCCESS">ok...</div>
  </div>
</template>

<script lang="ts" setup>
declare const backend: typeof import('./preload').backend
// TODO add i386 binaries
// change app title and icons
import { computed, ref } from 'vue'
//Icons
import FileVideoIcon from './components/Icons/FileVideoIcon.vue'
import FileArrowDownIcon from './components/Icons/FileArrowDownIcon.vue'
import ReloadIcon from './components/Icons/ReloadIcon.vue'
import ScissorsIcon from './components/Icons/ScissorsIcon.vue'
//Components
import LoaderSpinner from './components/LoaderSpinner.vue'
import FileDrop from './components/FileDrop.vue'
import NumberCounter from './components/NumberCounter.vue'
import { AppStatus, VideoElement, VideoInfo } from './types'
import { truncateInTheMiddle } from './utils/utilsGeneric'

const appStatus = ref<AppStatus>(AppStatus.INPUT)
const video = ref<VideoElement | null>(null)
const isSplitting = ref<boolean>(false)
const isFetching = ref<boolean>(false)
const error = ref<boolean>(false)
const parts = ref<number>(2)

const restart = () => {
  appStatus.value = AppStatus.INPUT
  video.value = null
  isSplitting.value = false
  isFetching.value = false
  error.value = false
  parts.value = 2
}

const onFile = async (file: File) => {
  appStatus.value = AppStatus.SPLIT
  isFetching.value = true
  video.value = {
    name: file.name,
    sexagesimal: '',
    seconds: -1,
    path: '',
    inputPath: '',
    prettyPath: ''
  }
  const info: VideoInfo = await backend.getVideoInfo(file)
  if (info.seconds < 0) error.value = true
  video.value.sexagesimal = info.sexagesimal
  video.value.seconds = info.seconds
  video.value.path = info.path
  video.value.inputPath = info.inputPath
  video.value.prettyPath = await backend.prettyPath(video.value.path)
  isFetching.value = false
}

const selectOutput = async () => {
  const result = await backend.selectFolder(video.value.path)
  if (result) {
    video.value.path = result
    video.value.prettyPath = await backend.prettyPath(video.value.path)
  }
}

const splitVideo = async () => {
  if (isSplitting.value === false) {
    isSplitting.value = true
    const result = await backend.splitVideo({ ...video.value }, parts.value)
    isSplitting.value = false
    //TODO: get back splitted files path, time etc...?
    if (result) appStatus.value = AppStatus.SUCCESS
    else appStatus.value = AppStatus.ERROR
  }
}
</script>
