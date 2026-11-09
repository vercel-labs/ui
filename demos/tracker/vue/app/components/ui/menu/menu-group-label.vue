<script setup lang="ts">
import { MenuGroupLabel } from "@ui-sdk/vue/menu"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <MenuGroupLabel
    :class="
      cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', props.class)
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </MenuGroupLabel>
</template>
