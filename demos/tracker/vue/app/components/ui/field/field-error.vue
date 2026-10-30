<script setup lang="ts">
import { FieldError } from "@ui-sdk/vue/field"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <FieldError :class="cn('text-sm text-destructive', props.class)">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </FieldError>
</template>
