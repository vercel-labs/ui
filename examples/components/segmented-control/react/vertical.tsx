"use client"

import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control"

function Example() {
  return (
    <SegmentedControl aria-label="Vertical alignment" orientation="vertical" defaultValue="middle">
      <SegmentedControlIndicator />
      <SegmentedControlItem value="top">Top</SegmentedControlItem>
      <SegmentedControlItem value="middle">Middle</SegmentedControlItem>
      <SegmentedControlItem value="bottom">Bottom</SegmentedControlItem>
    </SegmentedControl>
  )
}

export { Example }
