<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"
import { ref } from "vue"

const items = ["Inbox", "Drafts", "Sent"]
const status = ref("Closed")

function complete(item: string, open: boolean) {
  if (open) status.value = `${item} open`
  else if (status.value === `${item} closing`) status.value = `${item} closed`
}
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <Tooltip
        v-for="item in items"
        :key="item"
        @open-change="(open) => (status = open ? `${item} opening` : `${item} closing`)"
        @open-change-complete="(open) => complete(item, open)"
      >
        <TooltipTrigger>{{ item }}</TooltipTrigger>
        <TooltipContent>Open {{ item.toLowerCase() }}</TooltipContent>
      </Tooltip>
    </div>
    <output data-slot="output">{{ status }}</output>
  </div>
</template>
