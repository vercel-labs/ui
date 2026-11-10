<script setup lang="ts">
import { AvatarFallback, Avatar as AvatarPrimitive } from "@ui-sdk/vue/avatar"
import { cn } from "cn"

const sizes = {
  sm: "size-5 text-[10px]",
  default: "size-7 text-xs",
  lg: "size-10 text-sm",
}

const props = withDefaults(
  defineProps<{
    name: string
    size?: keyof typeof sizes
    decorative?: boolean
    class?: string
  }>(),
  { size: "default" }
)

const initials = computed(() =>
  props.name
    .split(" ")
    .map((part) => part[0])
    .join("")
)
</script>

<template>
  <AvatarPrimitive
    :aria-hidden="decorative || undefined"
    :class="
      cn(
        'relative flex shrink-0 rounded-full select-none',
        sizes[props.size],
        props.class
      )
    "
  >
    <AvatarFallback
      class="flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground"
    >
      <span aria-hidden="true">{{ initials }}</span>
      <span v-if="!decorative" class="sr-only">{{ props.name }}</span>
    </AvatarFallback>
  </AvatarPrimitive>
</template>
