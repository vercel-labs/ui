<script setup lang="ts">
import { CollapsiblePanel } from "@ui-sdk/vue/collapsible"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <CollapsiblePanel
    :class="
      cn(
        'h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </CollapsiblePanel>
</template>
