<script setup lang="ts">
import { CommandEmpty } from "@ui-sdk/vue/command"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <CommandEmpty :class="cn('py-10 text-center text-sm text-muted-foreground empty:hidden', props.class)">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </CommandEmpty>
</template>
