<script setup lang="ts">
import { ComboboxEmpty } from "@ui-sdk/vue/combobox"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <ComboboxEmpty
    :class="
      cn(
        'py-2 text-center text-sm text-muted-foreground empty:hidden',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </ComboboxEmpty>
</template>
