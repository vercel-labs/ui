<script setup lang="ts">
import { CommandItemIcon } from "@ui-sdk/vue/command"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <CommandItemIcon
    :class="cn('flex text-muted-foreground group-data-highlighted:text-current [&_svg]:size-4', props.class)"
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </CommandItemIcon>
</template>
