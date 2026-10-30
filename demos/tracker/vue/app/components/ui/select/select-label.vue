<script setup lang="ts">
import { SelectLabel } from "@ui-sdk/vue/select"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <SelectLabel :class="cn('text-sm leading-none font-medium', props.class)">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </SelectLabel>
</template>
