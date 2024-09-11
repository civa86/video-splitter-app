<template>
  <div class="flex items-center justify-center w-full h-full" ref="dropZone">
    <label
      for="dropzone-file"
      class="w-full h-full flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
        <FileVideoIcon class="size-24" v-if="!isDraggingOver" />
        <PlusIcon class="size-24 text-gray-200" v-if="isDraggingOver" />
        <p class="text-red-600 pt-4" v-if="error">{{ error }}</p>
      </div>
      <input
        id="dropzone-file"
        type="file"
        :accept="[...ALLOWED_MIMES, ...ALLOWED_EXTENSIONS].join(',')"
        class="hidden"
        @change="onFileSelect"
        @click="error = ''"
      />
    </label>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import FileVideoIcon from './Icons/FileVideoIcon.vue'
import PlusIcon from './Icons/PlusIcon.vue'

const ALLOWED_MIMES = ['video/*']
const ALLOWED_EXTENSIONS = ['.mkv']

const emit = defineEmits<{
  (e: 'file', file: File): unknown
}>()

const dropZone = ref<HTMLElement | null>(null)
const isDraggingOver = ref<boolean>(false)
const error = ref<string>('')

const isAllowedMime = (mime: string) => ALLOWED_MIMES.map(x => x.replace('*', '')).some(x => mime.startsWith(x))

const isAllowedExtension = (name: string) => ALLOWED_EXTENSIONS.some(x => name.endsWith(x))

const addItems = (files: FileList) => {
  const allowedFiles = Array.from(files).filter((x: File) => isAllowedMime(x.type || '') || isAllowedExtension(x.name))
  if (allowedFiles.length === 0) error.value = 'INVALID FILE TYPE'
  else emit('file', allowedFiles[0])
}

const onDragEnter = (e: Event) => {
  error.value = ''
  isDraggingOver.value = true
  e.preventDefault()
  e.stopPropagation()
}
const onDragLeave = () => (isDraggingOver.value = false)

const onDrop = (e: DragEvent) => {
  isDraggingOver.value = false
  e.preventDefault()
  e.stopPropagation()
  if (e.dataTransfer && e.dataTransfer.files.length) {
    addItems(e.dataTransfer.files)
  }
}

const onFileSelect = (e: Event) => {
  const elem = e.target as HTMLInputElement
  if (elem.files?.length) {
    addItems(elem.files)
    elem.value = ''
  }
}

onMounted(() => {
  const element = dropZone.value as HTMLElement
  if (element) {
    element.addEventListener('dragenter', onDragEnter, false)
    element.addEventListener('dragover', onDragEnter, false)
    element.addEventListener('dragleave', onDragLeave, false)
    element.addEventListener('drop', onDrop, false)
  }
})
</script>
