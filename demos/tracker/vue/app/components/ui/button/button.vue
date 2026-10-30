<script setup lang="ts">
import { Button } from "@ui-sdk/vue/button"
import { cn } from "cn"
import { buttonVariants, type ButtonVariants } from "./variants"

const props = defineProps<ButtonVariants & { class?: string }>()
</script>

<template>
  <Button :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </Button>
</template>
