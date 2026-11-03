<script setup lang="ts">
import { FileIcon, XIcon } from "@lucide/vue"
import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
} from "@ui-sdk/vue/file-input"
import { ref, useId } from "vue"

const cover = new File(["Dear team,"], "cover-letter.txt", { type: "text/plain" })

const id = useId()
const sent = ref<string | null>(null)

function onSubmit(event: Event) {
  const files = new FormData(event.currentTarget as HTMLFormElement).getAll("attachments") as File[]
  sent.value =
    files
      .filter((file) => file.name)
      .map((file) => file.name)
      .join(", ") || "no files"
}
</script>

<template>
  <div data-slot="stack">
    <FileInput name="attachments" :form="id" multiple accept="image/*,.pdf,.txt" :default-value="[cover]">
      <FileInputDropzone>
        <span data-slot="hint">Images, PDFs and text</span>
        <FileInputTrigger>Attach</FileInputTrigger>
      </FileInputDropzone>
      <FileInputList aria-label="Attachments">
        <FileInputItem v-slot="{ state }">
          <FileIcon aria-hidden="true" />
          <span>{{ state.file.name }}</span>
          <span data-slot="hint">{{ formatFileSize(state.file.size) }}</span>
          <FileInputItemRemove>
            <XIcon aria-hidden="true" />
          </FileInputItemRemove>
        </FileInputItem>
      </FileInputList>
    </FileInput>
    <form :id="id" data-slot="row" @submit.prevent="onSubmit" @reset="sent = null">
      <button type="submit">Send</button>
      <button type="reset">Reset</button>
      <span data-slot="output">{{ sent ? `Sent ${sent}.` : "" }}</span>
    </form>
  </div>
</template>
