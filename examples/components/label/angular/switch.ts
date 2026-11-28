import { Component } from "@angular/core"
import { Label } from "@ui-sdk/angular/label"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"

@Component({
  imports: [Label, Switch, SwitchThumb],
  template: `
    <div data-slot="row">
      <button uiSwitch id="updates">
        <span uiSwitchThumb></span>
      </button>
      <label uiLabel for="updates">Email me product updates</label>
    </div>
  `,
})
class Example {}

export { Example }
