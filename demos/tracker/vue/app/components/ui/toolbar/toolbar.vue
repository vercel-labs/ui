<script setup lang="ts">
import { Toolbar } from "@ui-sdk/vue/toolbar"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <Toolbar :class="cn('flex items-center gap-2', props.class)">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </Toolbar>
</template>
