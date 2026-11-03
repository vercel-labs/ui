<script setup lang="ts">
import { BoldIcon, ItalicIcon, Share2Icon, UnderlineIcon } from "@lucide/vue"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"

const formats = [
  { icon: BoldIcon, label: "Bold" },
  { icon: ItalicIcon, label: "Italic" },
  { icon: UnderlineIcon, label: "Underline" },
]
</script>

<template>
  <div data-slot="row">
    <Tooltip v-for="format in formats" :key="format.label">
      <TooltipTrigger>
        <component :is="format.icon" />
      </TooltipTrigger>
      <TooltipContent>{{ format.label }}</TooltipContent>
    </Tooltip>
    <Tooltip type="label">
      <TooltipTrigger>¶</TooltipTrigger>
      <TooltipContent>Show formatting marks</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger>
        <Share2Icon />
        Share
      </TooltipTrigger>
      <TooltipContent>Anyone with the link can view</TooltipContent>
    </Tooltip>
  </div>
</template>
