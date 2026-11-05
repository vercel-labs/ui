import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/solid/segmented-control"

function Example() {
  return (
    <SegmentedControl aria-label="View" defaultValue="list">
      <SegmentedControlIndicator />
      <SegmentedControlItem value="list">List</SegmentedControlItem>
      <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
      <SegmentedControlItem value="board">Board</SegmentedControlItem>
    </SegmentedControl>
  )
}

export { Example }
