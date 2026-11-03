<script setup lang="ts">
import { TextAlignCenterIcon, TextAlignEndIcon, TextAlignStartIcon } from "@lucide/vue"
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/vue/toggle"

const alignments = [
  { value: "left", label: "Align left", icon: TextAlignStartIcon },
  { value: "center", label: "Align center", icon: TextAlignCenterIcon },
  { value: "right", label: "Align right", icon: TextAlignEndIcon },
]
</script>

<template>
  <ToggleGroup :default-value="['left']" aria-label="Text alignment">
    <Toggle v-for="item in alignments" :key="item.value" :value="item.value" :aria-label="item.label">
      <ToggleIcon>
        <component :is="item.icon" />
      </ToggleIcon>
    </Toggle>
  </ToggleGroup>
</template>
