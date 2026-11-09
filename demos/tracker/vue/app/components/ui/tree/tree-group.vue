<script setup lang="ts">
import { TreeGroup } from "@ui-sdk/vue/tree"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <TreeGroup
    :class="
      cn(
        'h-(--tree-group-height) basis-full overflow-hidden ps-6 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none',
        props.class
      )
    "
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </TreeGroup>
</template>
