<script setup lang="ts">
import { ComboboxChips } from "@ui-sdk/vue/combobox"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <ComboboxChips
    :class="
      cn(
        'relative flex min-h-8 w-full flex-wrap items-center gap-1 rounded-2xl border border-transparent bg-input/50 bg-clip-padding py-1 ps-1 pe-8 text-sm transition-[color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 motion-reduce:transition-none',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </ComboboxChips>
</template>
