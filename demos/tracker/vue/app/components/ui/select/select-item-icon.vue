<script setup lang="ts">
import { SelectItemIcon } from "@ui-sdk/vue/select"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <SelectItemIcon
    :class="
      cn(
        'flex text-muted-foreground group-data-highlighted:text-current',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </SelectItemIcon>
</template>
