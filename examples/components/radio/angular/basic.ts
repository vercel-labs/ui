import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/angular/radio"

@Component({
  imports: [Field, FieldLabel, Radio, RadioGroup, RadioIndicator],
  template: `
    <div uiField>
      <label uiFieldLabel>Shipping speed</label>
      <div uiRadioGroup defaultValue="standard">
        @for (speed of speeds; track speed.value) {
          <label data-slot="label">
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
