<script setup lang="ts">
import { DialogTitle } from "@ui-sdk/vue/dialog"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <DialogTitle :class="cn('text-base leading-none font-medium', props.class)">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </DialogTitle>
</template>
