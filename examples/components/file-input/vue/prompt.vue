<script setup lang="ts">
import { FileIcon, ImageIcon, PlusIcon, XIcon } from "@lucide/vue"
import {
  createFileInputController,
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from "@ui-sdk/vue/file-input"
import { ref } from "vue"

const controller = createFileInputController()
const text = ref("")
const input = ref<HTMLTextAreaElement | null>(null)

function onKeydown(event: KeyboardEvent, value: readonly File[]) {
  const last = value.at(-1)
  if (event.key !== "Backspace" || text.value !== "" || !last) return
  event.preventDefault()
  controller.removeFile(last, { reason: "remove-press" })
}

function send() {
  text.value = ""
  controller.clear()
}
</script>

<template>
  <FileInput
    v-slot="{ state }"
    multiple
    :accept="['image/*', '.pdf', '.txt', '.md']"
    :max-size="10_000_000"
    :controller="controller"
  >
    <FileInputDropzone :paste-target="() => input">
      <FileInputList aria-label="Attachments" data-variant="chips">
        <FileInputItem v-slot="{ state: item }">
          <ImageIcon aria-hidden="true" v-if="item.file.type.startsWith('image/')" />
          <FileIcon aria-hidden="true" v-else />
          <span>{{ item.file.name }}</span>
          <FileInputItemRemove>
            <XIcon aria-hidden="true" />
          </FileInputItemRemove>
        </FileInputItem>
      </FileInputList>
      <textarea
        ref="input"
        v-model="text"
        aria-label="Message"
        placeholder="Ask anything. Paste or drop files to attach them."
        @keydown="(event) => onKeydown(event, state.value)"
      />
      <div data-slot="row">
        <FileInputTrigger aria-label="Attach files">
          <PlusIcon aria-hidden="true" />
        </FileInputTrigger>
        <button type="button" :disabled="!text && !state.value.length" @click="send">Send</button>
      </div>
    </FileInputDropzone>
  </FileInput>
</template>
