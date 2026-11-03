<script setup lang="ts">
import { UserIcon } from "@lucide/vue"
import { FileInput, FileInputDropzone, FileInputTrigger } from "@ui-sdk/vue/file-input"
import { ref, watchEffect } from "vue"

const value = ref<File[]>([])
const url = ref<string | null>(null)

watchEffect((onCleanup) => {
  const [file] = value.value
  if (!file) {
    url.value = null
    return
  }
  const next = URL.createObjectURL(file)
  url.value = next
  onCleanup(() => URL.revokeObjectURL(next))
})
</script>

<template>
  <FileInput v-model:value="value" accept="image/*" :max-size="5_000_000">
    <FileInputDropzone data-variant="avatar">
      <img v-if="url" :src="url" alt="" />
      <UserIcon aria-hidden="true" v-else />
    </FileInputDropzone>
    <div data-slot="stack">
      <div data-slot="row">
        <FileInputTrigger>{{ url ? "Change photo" : "Upload photo" }}</FileInputTrigger>
        <button v-if="url" type="button" @click="value = []">Remove</button>
      </div>
      <p data-slot="hint">Or drop an image on the avatar. Up to 5 MB.</p>
    </div>
  </FileInput>
</template>
