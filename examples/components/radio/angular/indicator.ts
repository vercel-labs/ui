import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/angular/radio"

@Component({
  imports: [Field, FieldLabel, Radio, RadioGroup, RadioIndicator],
  template: `
    <div uiField>
      <label uiFieldLabel>Theme</label>
      <div uiRadioGroup defaultValue="system">
        @for (theme of themes; track theme.value) {
          <label data-slot="label">
            <button uiRadio [value]="theme.value">
              <span uiRadioIndicator keepMounted></span>
            </button>
            {{ theme.label }}
          </label>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ]
}

export { Example }
