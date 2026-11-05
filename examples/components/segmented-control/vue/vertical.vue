<script setup lang="ts">
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/vue/segmented-control"
</script>

<template>
  <SegmentedControl aria-label="Vertical alignment" orientation="vertical" default-value="middle">
    <SegmentedControlIndicator />
    <SegmentedControlItem value="top">Top</SegmentedControlItem>
    <SegmentedControlItem value="middle">Middle</SegmentedControlItem>
    <SegmentedControlItem value="bottom">Bottom</SegmentedControlItem>
  </SegmentedControl>
</template>
