import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/angular/radio"

@Component({
  imports: [Field, FieldLabel, Radio, RadioGroup, RadioIndicator],
  template: `
    <div dir="rtl">
      <div uiField>
        <label uiFieldLabel>سرعة الشحن</label>
        <div uiRadioGroup defaultValue="express">
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
    </div>
  `,
})
class Example {
  readonly speeds = [
    { value: "standard", label: "عادي" },
    { value: "express", label: "سريع" },
    { value: "overnight", label: "خلال ليلة" },
  ]
}

export { Example }
