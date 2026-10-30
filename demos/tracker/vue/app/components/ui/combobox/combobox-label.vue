<script setup lang="ts">
import { ComboboxLabel } from "@ui-sdk/vue/combobox"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <ComboboxLabel :class="cn('text-sm leading-none font-medium', props.class)">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </ComboboxLabel>
</template>
