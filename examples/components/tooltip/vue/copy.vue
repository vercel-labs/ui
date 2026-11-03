<script setup lang="ts">
import { CheckIcon, CopyIcon } from "@lucide/vue"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"
import { ref } from "vue"

const command = "pnpm add @ui-sdk/vue"
const copied = ref(false)

function copy() {
  navigator.clipboard?.writeText(command).catch(() => {})
  copied.value = true
}
</script>

<template>
  <div data-slot="row">
    <code>{{ command }}</code>
    <Tooltip :close-on-press="false" @open-change-complete="(open) => !open && (copied = false)">
      <TooltipTrigger @click="copy">
        <CheckIcon v-if="copied" />
        <CopyIcon v-else />
      </TooltipTrigger>
      <TooltipContent>{{ copied ? "Copied" : "Copy" }}</TooltipContent>
    </Tooltip>
  </div>
</template>
