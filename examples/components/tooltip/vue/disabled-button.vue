<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"
import { computed, ref } from "vue"

const title = ref("")
const status = ref("Draft")
const blocked = computed(() => !title.value.trim())

function publish() {
  if (!blocked.value) {
    status.value = `Published “${title.value.trim()}”`
  }
}
</script>

<template>
  <div data-slot="stack">
    <input v-model="title" placeholder="Post title" aria-label="Post title" />
    <div data-slot="row">
      <Tooltip :disabled="!blocked">
        <TooltipTrigger :aria-disabled="blocked || undefined" @click="publish">Publish</TooltipTrigger>
        <TooltipContent>Add a title to publish</TooltipContent>
      </Tooltip>
      <output data-slot="output">{{ status }}</output>
    </div>
  </div>
</template>
