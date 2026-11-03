<script setup lang="ts">
import { SaveIcon, Share2Icon } from "@lucide/vue"
import { registerShortcut } from "@ui-sdk/core/shortcuts"
import { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger } from "@ui-sdk/vue/tooltip"
import { onMounted, onUnmounted, ref } from "vue"

const status = ref("Nothing yet")
const save = () => (status.value = "Saved")
const share = () => (status.value = "Shared")

const offs: (() => void)[] = []
onMounted(() => offs.push(registerShortcut("mod+s", save), registerShortcut("mod+shift+e", share)))
onUnmounted(() => offs.forEach((off) => off()))
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <Tooltip shortcut="mod+s">
        <TooltipTrigger @click="save">
          <SaveIcon />
        </TooltipTrigger>
        <TooltipContent>
          Save
          <TooltipShortcut />
        </TooltipContent>
      </Tooltip>
      <Tooltip shortcut="mod+shift+e">
        <TooltipTrigger @click="share">
          <Share2Icon />
          Share
        </TooltipTrigger>
        <TooltipContent>
          Share with your team
          <TooltipShortcut>
            <template #render="{ props }">
              <kbd v-bind="props" />
            </template>
          </TooltipShortcut>
        </TooltipContent>
      </Tooltip>
    </div>
    <output data-slot="output">{{ status }}</output>
  </div>
</template>
