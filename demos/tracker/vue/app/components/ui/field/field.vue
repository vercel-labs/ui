<script setup lang="ts">
import { Field } from "@ui-sdk/vue/field"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <Field :class="cn('flex min-w-0 flex-col gap-2', props.class)">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </Field>
</template>
