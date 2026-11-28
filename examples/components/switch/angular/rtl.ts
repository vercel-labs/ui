import { Component } from "@angular/core"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"

@Component({
  imports: [Switch, SwitchThumb],
  template: `
    <div dir="rtl">
      <label data-slot="label">
        وضع الطيران
        <button uiSwitch>
          <span uiSwitchThumb></span>
        </button>
      </label>
    </div>
  `,
})
class Example {}

export { Example }
