<script setup lang="ts">
import { MenuItem } from "@ui-sdk/vue/menu"
import { cn } from "cn"
import { item } from "./styles"

const props = withDefaults(
  defineProps<{ variant?: "default" | "destructive"; class?: string }>(),
  {
    variant: "default",
  }
)
</script>

<template>
  <MenuItem
    :class="
      cn(
        item,
        props.variant === 'destructive' &&
          'text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </MenuItem>
</template>
