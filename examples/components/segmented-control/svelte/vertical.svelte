<script lang="ts">
  import { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem } from "@ui-sdk/svelte/segmented-control"
</script>

<SegmentedControl aria-label="Vertical alignment" orientation="vertical" defaultValue="middle">
  <SegmentedControlIndicator />
  <SegmentedControlItem value="top">Top</SegmentedControlItem>
  <SegmentedControlItem value="middle">Middle</SegmentedControlItem>
  <SegmentedControlItem value="bottom">Bottom</SegmentedControlItem>
</SegmentedControl>
