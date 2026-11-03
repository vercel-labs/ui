<script setup lang="ts">
import { InfoIcon } from "@lucide/vue"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"
import { ref, useId } from "vue"

const id = useId()
const field = ref<HTMLDivElement | null>(null)
</script>

<template>
  <div data-slot="stack">
    <label data-slot="label" :for="id">Webhook URL</label>
    <div ref="field" data-slot="row">
      <input :id="id" placeholder="https://" />
      <Tooltip>
        <TooltipTrigger aria-label="About webhooks">
          <InfoIcon />
        </TooltipTrigger>
        <TooltipContent :anchor="field" align="start"
          >We send a POST request to this URL for every new order.</TooltipContent
        >
      </Tooltip>
    </div>
  </div>
</template>
