<script setup lang="ts">
import { BellIcon, ExternalLinkIcon } from "@lucide/vue"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"
</script>

<template>
  <div data-slot="row">
    <Popover>
      <Tooltip>
        <TooltipTrigger>
          <template #render="{ props }">
            <PopoverTrigger v-bind="props">
              <BellIcon />
            </PopoverTrigger>
          </template>
        </TooltipTrigger>
        <TooltipContent>Notifications</TooltipContent>
      </Tooltip>
      <PopoverContent :side-offset="8">
        <PopoverTitle>Notifications</PopoverTitle>
        <PopoverDescription>You're all caught up.</PopoverDescription>
      </PopoverContent>
    </Popover>
    <Tooltip>
      <TooltipTrigger href="https://example.com/changelog">
        <template #render="{ props }">
          <a v-bind="props" data-variant="link">
            Changelog
            <ExternalLinkIcon />
          </a>
        </template>
      </TooltipTrigger>
      <TooltipContent>
        <template #render="{ props }">
          <div v-bind="props">What's new in 2.0</div>
        </template>
      </TooltipContent>
    </Tooltip>
  </div>
</template>
