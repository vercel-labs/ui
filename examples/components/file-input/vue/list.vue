<script setup lang="ts">
import { PlusIcon, XIcon } from "@lucide/vue"
import {
  FileInput,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
} from "@ui-sdk/vue/file-input"
import { defineComponent, h, ref, watchEffect, type PropType } from "vue"

const Preview = defineComponent({
  props: { file: { type: Object as PropType<File>, required: true } },
  setup(props) {
    const url = ref<string>()
    watchEffect((onCleanup) => {
      const next = URL.createObjectURL(props.file)
      url.value = next
      onCleanup(() => URL.revokeObjectURL(next))
    })
    return () => (url.value ? h("img", { src: url.value, alt: "" }) : null)
  },
})
</script>

<template>
  <FileInput multiple accept="image/*">
    <FileInputTrigger>
      <PlusIcon aria-hidden="true" />
      Add images
    </FileInputTrigger>
    <FileInputList aria-label="Images" data-variant="grid">
      <FileInputItem v-slot="{ state }">
        <Preview :file="state.file" />
        <span> {{ state.index + 1 }}. {{ state.file.name }}, {{ formatFileSize(state.file.size) }} </span>
        <FileInputItemRemove>
          <XIcon aria-hidden="true" />
        </FileInputItemRemove>
      </FileInputItem>
    </FileInputList>
  </FileInput>
</template>
