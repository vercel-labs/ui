// The segmented control every implementation renders. Labels, values and
// order are the contract the specs rely on, so change them here and nowhere else.
type SegmentedControlFixtureItem = { value: string; label: string; disabled?: boolean }

const segmentedControlFixture = {
  label: "View",
  name: "view",
  items: [
    { value: "list", label: "List" },
    { value: "grid", label: "Grid" },
    { value: "board", label: "Board", disabled: true },
    { value: "calendar", label: "Calendar" },
  ] satisfies SegmentedControlFixtureItem[] as SegmentedControlFixtureItem[],
}

export { segmentedControlFixture, type SegmentedControlFixtureItem }
