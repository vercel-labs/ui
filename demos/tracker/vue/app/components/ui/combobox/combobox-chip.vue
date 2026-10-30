<script setup lang="ts">
import { X } from "@lucide/vue"
import { ComboboxChip, ComboboxChipRemove } from "@ui-sdk/vue/combobox"
import { cn } from "cn"

const props = defineProps<{ value: string; label: string; class?: string }>()
</script>

<template>
  <ComboboxChip
    :value="props.value"
    :class="
      cn(
        'flex h-5.5 w-fit items-center gap-1 rounded-2xl bg-input ps-1.5 pe-0.5 text-xs font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/30',
        props.class,
      )
    "
  >
    <slot />
    {{ props.label }}
    <ComboboxChipRemove
      :aria-label="`Remove ${props.label}`"
      class="-ms-0.5 flex size-4.5 cursor-default items-center justify-center rounded-full opacity-50 outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <X aria-hidden="true" class="size-3" />
    </ComboboxChipRemove>
  </ComboboxChip>
</template>
