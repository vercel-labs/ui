<script setup lang="ts">
import { TokenInputToken } from "@ui-sdk/vue/token-input"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <TokenInputToken
    :class="
      cn(
        'inline-flex items-center rounded-2xl bg-input px-1.5 align-baseline font-medium data-selected:ring-3 data-selected:ring-ring/30 dark:bg-input/60',
        props.class,
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </TokenInputToken>
</template>
