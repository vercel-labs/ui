import { Switch, SwitchThumb } from "@ui-sdk/solid/switch"

function Example() {
  return (
    <label data-slot="label">
      <Switch>
        <SwitchThumb />
      </Switch>
      Airplane Mode
    </label>
  )
}

export { Example }
