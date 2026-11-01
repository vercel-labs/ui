import { Switch, SwitchThumb } from "@ui-sdk/solid/switch"

export function Example() {
  return (
    <div dir="rtl">
      <label data-slot="label">
        <Switch>
          <SwitchThumb />
        </Switch>
        وضع الطيران
      </label>
    </div>
  )
}
