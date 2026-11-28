import { Component } from "@angular/core"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"

@Component({
  imports: [Switch, SwitchThumb],
  template: `
    <label data-slot="label">
      Airplane mode
      <button uiSwitch>
        <span uiSwitchThumb></span>
      </button>
    </label>
  `,
})
class Example {}

export { Example }
