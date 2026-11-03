import { Toggle } from "@ui-sdk/react/toggle"

function Example() {
  return (
    <div data-slot="row">
      <Toggle disabled>Disabled</Toggle>
      <Toggle defaultPressed disabled>
        Disabled
      </Toggle>
    </div>
  )
}

export { Example }
