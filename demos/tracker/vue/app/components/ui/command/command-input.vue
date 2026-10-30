<script setup lang="ts">
import { Search } from "@lucide/vue"
import { CommandInput } from "@ui-sdk/vue/command"
import { cn } from "cn"

defineOptions({ inheritAttrs: false })

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div class="flex items-center gap-2 border-b border-border px-4">
    <Search aria-hidden="true" class="size-4 shrink-0 text-muted-foreground" />
    <CommandInput
      v-bind="$attrs"
      :class="
        cn(
          'h-12 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm',
          props.class,
        )
      "
    />
  </div>
</template>
