<script setup lang="ts">
import { TabsIndicator, TabsList } from "@ui-sdk/vue/tabs"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <TabsList
    :class="
      cn(
        'relative inline-flex h-8 w-fit items-center rounded-2xl bg-muted p-[3px] text-muted-foreground',
        props.class,
      )
    "
  >
    <slot />
    <TabsIndicator
      class="pointer-events-none absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-2xl bg-background shadow-xs transition-[top,left,width,height] duration-300 ease-out data-[activation-direction=none]:transition-none motion-reduce:transition-none dark:bg-input/50"
    />
  </TabsList>
</template>
