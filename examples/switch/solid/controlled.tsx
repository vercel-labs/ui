import { createSwitchController } from "@ui-sdk/core/switch"
import { Switch, SwitchThumb } from "@ui-sdk/solid/switch"
import { createSignal } from "solid-js"

function Example() {
  const wifi = createSwitchController()
  const [checked, setChecked] = createSignal(true)
  const [reason, setReason] = createSignal("")

  return (
    <div data-slot="stack">
      <label data-slot="label">
        <Switch
          checked={checked()}
          onCheckedChange={(next, details) => {
            setChecked(next)
            setReason(details.reason)
          }}
          controller={wifi}
        >
          <SwitchThumb />
        </Switch>
        Wi-Fi
      </label>
      <button type="button" onClick={() => wifi.toggle()}>
        Toggle from outside
      </button>
      <output data-slot="output">
        Wi-Fi: {checked() ? "on" : "off"}
        {reason() && `, last change: ${reason()}`}
      </output>
    </div>
  )
}

export { Example }
