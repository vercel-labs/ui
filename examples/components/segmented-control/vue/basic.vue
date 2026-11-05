<script setup lang="ts">
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/vue/segmented-control"
</script>

<template>
  <SegmentedControl aria-label="View" default-value="list">
    <SegmentedControlIndicator />
    <SegmentedControlItem value="list">List</SegmentedControlItem>
    <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
    <SegmentedControlItem value="board">Board</SegmentedControlItem>
  </SegmentedControl>
</template>
