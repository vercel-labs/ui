<script setup lang="ts">
import { MenuItemIcon } from "@ui-sdk/vue/menu"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <MenuItemIcon
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
  </MenuItemIcon>
</template>
