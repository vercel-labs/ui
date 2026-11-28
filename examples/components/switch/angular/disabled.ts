import { Component } from "@angular/core"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"

@Component({
  imports: [Switch, SwitchThumb],
  template: `
    <div data-slot="stack">
      <label data-slot="label">
        Product updates
        <button uiSwitch>
          <span uiSwitchThumb></span>
        </button>
      </label>
      <label data-slot="label">
        Security alerts
        <button uiSwitch defaultChecked disabled>
          <span uiSwitchThumb></span>
        </button>
      </label>
    </div>
  `,
})
class Example {}

export { Example }
