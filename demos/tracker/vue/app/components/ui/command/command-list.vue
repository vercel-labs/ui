<script setup lang="ts">
import { CommandList } from "@ui-sdk/vue/command"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <CommandList
    :class="cn('max-h-80 min-h-0 scroll-py-1 overflow-y-auto overscroll-contain p-1', props.class)"
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </CommandList>
</template>
