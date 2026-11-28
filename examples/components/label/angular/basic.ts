import { Component } from "@angular/core"
import { Label } from "@ui-sdk/angular/label"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/angular/radio"

@Component({
  imports: [Label, Radio, RadioGroup, RadioIndicator],
  template: `
    <div data-slot="stack">
      <label uiLabel for="shipping-speed">Shipping speed</label>
      <div uiRadioGroup id="shipping-speed" defaultValue="standard">
        @for (speed of speeds; track speed.value) {
          <label uiLabel>
            <button uiRadio [value]="speed.value">
              <span uiRadioIndicator></span>
            </button>
            {{ speed.label }}
          </label>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly speeds = [
    { value: "standard", label: "Standard" },
    { value: "express", label: "Express" },
    { value: "overnight", label: "Overnight" },
  ]
}

export { Example }
