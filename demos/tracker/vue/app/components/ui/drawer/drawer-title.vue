<script setup lang="ts">
import { DrawerTitle } from "@ui-sdk/vue/drawer"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <DrawerTitle :class="cn('text-base font-medium', props.class)">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </DrawerTitle>
</template>
