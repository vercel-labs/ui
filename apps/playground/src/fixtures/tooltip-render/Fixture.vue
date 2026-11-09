<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue"
</script>

<template>
  <div class="fixture tooltip-page">
    <button>Before</button>
    <Tooltip :delay="100">
      <TooltipTrigger href="#docs">
        <template #render="{ props }">
          <a v-bind="props">Docs</a>
        </template>
      </TooltipTrigger>
      <TooltipContent class="tooltip">Read the docs</TooltipContent>
    </Tooltip>
    <Tooltip :delay="100">
      <TooltipTrigger>
        <template #render="{ props, state }">
          <button v-bind="props" :class="state.open ? 'is-open' : 'is-closed'">
            Status <span aria-hidden="true">{{ state.open ? "●" : "○" }}</span>
          </button>
        </template>
      </TooltipTrigger>
      <TooltipContent>
        <template #render="{ props, state }">
          <div
            v-bind="props"
            :class="state.open ? 'tooltip is-open' : 'tooltip'"
          >
            All systems normal
          </div>
        </template>
      </TooltipContent>
    </Tooltip>
    <button>After</button>
  </div>
</template>
