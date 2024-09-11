<template>
  <div class="grid grid-cols-3 gap-2 align-middle">
    <button @click="decrement()">
      <MinusIcon
        class="size-6"
        :class="{
          'text-blue-400 cursor-pointer': modelValue > min,
          'text-gray-400 cursor-default': modelValue === min
        }"
      />
    </button>
    <div class="text-center text-gray-600">{{ modelValue }}</div>
    <button @click="increment()">
      <PlusIcon class="size-6 text-blue-400" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import MinusIcon from './Icons/MinusIcon.vue'
import PlusIcon from './Icons/PlusIcon.vue'

const props = defineProps<{
  modelValue: number
  min: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const decrement = () => {
  const newValue = props.modelValue - 1
  if (newValue >= props.min) emit('update:modelValue', newValue)
}

const increment = () => {
  const newValue = props.modelValue + 1
  emit('update:modelValue', newValue)
}
</script>
