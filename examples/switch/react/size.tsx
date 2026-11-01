import { Switch, SwitchThumb } from "@ui-sdk/react/switch"

export function Example() {
  return (
    <div data-slot="row">
      <label data-slot="label">
        <Switch data-size="sm">
          <SwitchThumb />
        </Switch>
        Small
      </label>
      <label data-slot="label">
        <Switch>
          <SwitchThumb />
        </Switch>
        Default
      </label>
    </div>
  )
}
