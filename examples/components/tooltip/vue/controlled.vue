<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"
import { ref } from "vue"
import { useLog } from "../../../shared/vue/log"

const log = useLog()
const open = ref(false)
</script>

<template>
  <div data-slot="stack">
    <div data-slot="controls">
      <label data-slot="label">
        <Checkbox v-model:checked="open">
          <CheckboxIndicator>
            <CheckIcon aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        Open
      </label>
    </div>
    <Tooltip
      v-model:open="open"
      @open-change="(next, details) => log(`${next ? 'Opened' : 'Closed'} (${details.reason})`)"
    >
      <TooltipTrigger>Export</TooltipTrigger>
      <TooltipContent>Download as CSV</TooltipContent>
    </Tooltip>
  </div>
</template>
