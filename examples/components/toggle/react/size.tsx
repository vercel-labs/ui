import { Toggle } from "@ui-sdk/react/toggle"

export function Example() {
  return (
    <div data-slot="row">
      <Toggle data-variant="outline" data-size="sm">
        Small
      </Toggle>
      <Toggle data-variant="outline">Default</Toggle>
      <Toggle data-variant="outline" data-size="lg">
        Large
      </Toggle>
    </div>
  )
}
