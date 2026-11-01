import { Switch, SwitchThumb } from "@ui-sdk/react/switch"

function Example() {
  return (
    <label data-slot="label">
      <Switch disabled>
        <SwitchThumb />
      </Switch>
      Disabled
    </label>
  )
}

export { Example }
