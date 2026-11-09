<script setup lang="ts">
import { createTooltipController } from "@ui-sdk/core/tooltip"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipShortcut,
  TooltipTrigger,
} from "@ui-sdk/vue"
import {
  tooltipContentOptions,
  tooltipFixture,
  tooltipOptions,
  tooltipParts,
} from "tests/fixtures/tooltip.ts"
import { ref } from "vue"

const controller = createTooltipController()
const options = tooltipOptions()
const content = tooltipContentOptions()
const parts = tooltipParts()
const { save, toolbar, profile, info, publish, iconPopover } = tooltipFixture
const action = ref("")

function publishPress(event: MouseEvent) {
  if (
    (event.currentTarget as HTMLElement).getAttribute("aria-disabled") !==
    "true"
  ) {
    action.value = publish.action
  }
}
</script>

<template>
  <div class="fixture tooltip-page">
    <button>Before</button>
    <Tooltip
      v-bind="options"
      :controller="controller"
      :default-open="parts.open"
      :shortcut="save.shortcut"
    >
      <TooltipTrigger
        :disabled="parts.nativeDisabled || undefined"
        @click="action = 'save'"
      >
        {{ save.trigger }}
      </TooltipTrigger>
      <TooltipContent class="tooltip" v-bind="content">
        <TooltipArrow class="arrow" />
        {{ save.content }}
        <TooltipShortcut />
      </TooltipContent>
    </Tooltip>
    <div class="toolbar" role="group" aria-label="Formatting">
      <Tooltip v-for="item in toolbar" :key="item.content" v-bind="options">
        <TooltipTrigger>
          <span aria-hidden="true">{{ item.icon }}</span>
        </TooltipTrigger>
        <TooltipContent class="tooltip">{{ item.content }}</TooltipContent>
      </Tooltip>
    </div>
    <Popover :container="options.container">
      <Tooltip v-bind="options">
        <TooltipTrigger>
          <template #render="{ props }">
            <PopoverTrigger v-bind="props">{{
              profile.trigger
            }}</PopoverTrigger>
          </template>
        </TooltipTrigger>
        <TooltipContent class="tooltip">{{ profile.content }}</TooltipContent>
      </Tooltip>
      <PopoverContent class="popup" :side-offset="8">
        <PopoverTitle class="title">{{ profile.popover }}</PopoverTitle>
        <div class="actions">
          <Tooltip v-bind="options">
            <TooltipTrigger>{{ profile.help.trigger }}</TooltipTrigger>
            <TooltipContent class="tooltip">{{
              profile.help.content
            }}</TooltipContent>
          </Tooltip>
          <PopoverClose>{{ profile.close }}</PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
    <Tooltip v-bind="options" toggleable>
      <TooltipTrigger :aria-label="info.trigger">
        <span aria-hidden="true">i</span>
      </TooltipTrigger>
      <TooltipContent class="tooltip">{{ info.content }}</TooltipContent>
    </Tooltip>
    <Tooltip v-if="parts.disabled" v-bind="options">
      <TooltipTrigger aria-disabled="true" @click="publishPress">{{
        publish.trigger
      }}</TooltipTrigger>
      <TooltipContent class="tooltip">{{ publish.content }}</TooltipContent>
    </Tooltip>
    <template v-if="parts.iconPopover">
      <Popover :container="options.container">
        <Tooltip v-bind="options">
          <TooltipTrigger>
            <template #render="{ props }">
              <PopoverTrigger v-bind="props">
                <span aria-hidden="true">{{ iconPopover.icon }}</span>
              </PopoverTrigger>
            </template>
          </TooltipTrigger>
          <TooltipContent class="tooltip">{{
            iconPopover.content
          }}</TooltipContent>
        </Tooltip>
        <PopoverContent class="popup">{{ iconPopover.popover }}</PopoverContent>
      </Popover>
      <Popover :container="options.container">
        <PopoverTrigger>
          <span aria-hidden="true">{{ iconPopover.unnamed }}</span>
        </PopoverTrigger>
        <PopoverContent class="popup">{{ iconPopover.popover }}</PopoverContent>
      </Popover>
    </template>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <button @click="controller.open()">Open with controller</button>
    <TooltipTrigger v-if="parts.shortcut" :controller="controller">
      {{ tooltipFixture.shortcut.trigger }}
      <TooltipShortcut />
    </TooltipTrigger>
  </div>
</template>
