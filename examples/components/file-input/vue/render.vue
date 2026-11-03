<script setup lang="ts">
import { CheckIcon, ImageIcon, XIcon } from "@lucide/vue"
import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from "@ui-sdk/vue/file-input"
</script>

<template>
  <FileInput multiple accept="image/*" :max-files="4">
    <FileInputDropzone>
      <template #render="{ props, state }">
        <section v-bind="props" aria-label="Gallery upload">
          <XIcon v-if="state.dragReject" />
          <CheckIcon v-else-if="state.dragAccept" />
          <ImageIcon v-else />
          <p>
            {{
              state.dragReject
                ? "Only up to 4 images"
                : state.dragAccept
                  ? "Release to add"
                  : "Drag up to 4 images here"
            }}
          </p>
          <FileInputTrigger v-if="!state.dragging">Browse</FileInputTrigger>
        </section>
      </template>
    </FileInputDropzone>
    <FileInputList aria-label="Images" data-variant="chips">
      <template #render="{ props, children }">
        <ul v-bind="props">
          <component :is="children" />
        </ul>
      </template>
      <FileInputItem>
        <template #render="{ props, state }">
          <li v-bind="props">
            <span v-if="state.index === 0" data-show="first">Cover:</span>
            <span>{{ state.file.name }}</span>
            <FileInputItemRemove>
              <template #render="{ props: removeProps }">
                <button v-bind="removeProps">
                  <XIcon />
                </button>
              </template>
            </FileInputItemRemove>
          </li>
        </template>
      </FileInputItem>
    </FileInputList>
  </FileInput>
</template>
