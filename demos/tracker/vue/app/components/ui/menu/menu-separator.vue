<script setup lang="ts">
import { MenuSeparator } from "@ui-sdk/vue/menu"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <MenuSeparator :class="cn('-mx-1 my-1 h-px bg-border/50', props.class)" />
</template>
