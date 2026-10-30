<script setup lang="ts">
import { FieldDescription } from "@ui-sdk/vue/field"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <FieldDescription :class="cn('text-sm text-muted-foreground', props.class)">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </FieldDescription>
</template>
