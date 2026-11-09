<script setup lang="ts">
import { TriggerMenuItem } from "@ui-sdk/vue/trigger-menu"
import { cn } from "cn"

const props = defineProps<{ value: string; class?: string }>()
</script>

<template>
  <TriggerMenuItem
    :value="props.value"
    :class="
      cn(
        'flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </TriggerMenuItem>
</template>
