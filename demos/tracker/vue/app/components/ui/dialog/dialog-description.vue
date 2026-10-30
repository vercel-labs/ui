<script setup lang="ts">
import { DialogDescription } from "@ui-sdk/vue/dialog"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <DialogDescription :class="cn('text-sm text-muted-foreground', props.class)">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </DialogDescription>
</template>
