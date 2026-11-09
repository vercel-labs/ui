<script setup lang="ts">
import { CommandGroupLabel } from "@ui-sdk/vue/command"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <CommandGroupLabel
    :class="
      cn(
        'px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </CommandGroupLabel>
</template>
