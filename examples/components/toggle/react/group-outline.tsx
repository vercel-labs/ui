import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"

export function Example() {
  return (
    <ToggleGroup defaultValue={["all"]} aria-label="Calls">
      <Toggle value="all" data-variant="outline">
        All
      </Toggle>
      <Toggle value="missed" data-variant="outline">
        Missed
      </Toggle>
    </ToggleGroup>
  )
}
