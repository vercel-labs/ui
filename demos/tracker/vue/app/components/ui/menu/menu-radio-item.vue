<script setup lang="ts">
import { Check } from "@lucide/vue"
import { MenuItemIndicator, MenuRadioItem } from "@ui-sdk/vue/menu"
import { cn } from "cn"
import { item } from "./styles"

const props = defineProps<{ value: string; class?: string }>()
</script>

<template>
  <MenuRadioItem :value="props.value" :class="cn(item, 'pe-8', props.class)">
    <slot />
    <MenuItemIndicator class="absolute end-2 flex size-4 items-center justify-center">
      <Check aria-hidden="true" class="size-4" />
    </MenuItemIndicator>
  </MenuRadioItem>
</template>
