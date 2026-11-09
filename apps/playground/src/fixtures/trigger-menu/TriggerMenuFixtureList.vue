<script setup lang="ts">
import {
  TriggerMenuItem,
  TriggerMenuList,
  type TriggerMenuDataItem,
} from "@ui-sdk/vue"
</script>

<!-- The list, with an item for each suggestion the trigger shows. -->
<template>
  <TriggerMenuList v-slot="{ state }">
    <TriggerMenuItem
      v-for="item in state.items as TriggerMenuDataItem[]"
      :key="item.value"
      class="item"
      :value="item.value"
      :label="item.label"
      :disabled="item.disabled"
    >
      {{ item.label }}
    </TriggerMenuItem>
  </TriggerMenuList>
</template>
