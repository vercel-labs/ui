<script setup lang="ts">
import { RadioGroup } from "@ui-sdk/vue/radio"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <RadioGroup :class="cn('flex flex-col gap-3', props.class)">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </RadioGroup>
</template>
