<script lang="ts">
  import { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem } from "@ui-sdk/svelte/segmented-control"
</script>

<SegmentedControl aria-label="View" defaultValue="list">
  <SegmentedControlIndicator />
  <SegmentedControlItem value="list">List</SegmentedControlItem>
  <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
  <SegmentedControlItem value="board">Board</SegmentedControlItem>
</SegmentedControl>
