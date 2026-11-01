import { Switch, SwitchThumb } from "@ui-sdk/react/switch"
import { Moon, Sun } from "lucide-react"

export function Example() {
  return (
    <label data-slot="label">
      <Switch>
        <SwitchThumb
          render={(props, state) => <span {...props}>{state.checked ? <Moon /> : <Sun />}</span>}
        />
      </Switch>
      Dark mode
    </label>
  )
}
