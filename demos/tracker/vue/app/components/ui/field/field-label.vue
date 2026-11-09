<script setup lang="ts">
import { FieldLabel } from "@ui-sdk/vue/field"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <FieldLabel
    :class="
      cn(
        'text-sm leading-none font-medium data-disabled:opacity-50',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </FieldLabel>
</template>
