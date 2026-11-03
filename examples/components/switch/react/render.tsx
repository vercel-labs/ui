import { Switch, SwitchThumb } from "@ui-sdk/react/switch"
import { MoonIcon, SunIcon } from "lucide-react"

export function Example() {
  return (
    <label data-slot="label">
      <Switch>
        <SwitchThumb
          render={(props, state) => <span {...props}>{state.checked ? <MoonIcon /> : <SunIcon />}</span>}
        />
      </Switch>
      Dark mode
    </label>
  )
}
