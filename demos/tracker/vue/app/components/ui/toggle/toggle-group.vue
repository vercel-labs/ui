<script setup lang="ts">
import { ToggleGroup } from "@ui-sdk/vue/toggle"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <ToggleGroup
    :class="
      cn(
        'flex w-fit items-center gap-0.5 rounded-2xl bg-muted p-0.5',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </ToggleGroup>
</template>
