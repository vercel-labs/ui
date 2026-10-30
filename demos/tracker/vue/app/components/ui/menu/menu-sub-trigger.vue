<script setup lang="ts">
import { ChevronRight } from "@lucide/vue"
import { MenuSubTrigger } from "@ui-sdk/vue/menu"
import { cn } from "cn"
import { item } from "./styles"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <MenuSubTrigger :class="cn(item, 'data-open:bg-accent', props.class)">
    <slot />
    <ChevronRight aria-hidden="true" class="ms-auto text-muted-foreground rtl:rotate-180" />
  </MenuSubTrigger>
</template>
