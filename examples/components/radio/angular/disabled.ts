import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/angular/radio"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldLabel,
    Radio,
    RadioGroup,
    RadioIndicator,
  ],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Theme</label>
        <p uiFieldDescription>Set by your organization.</p>
        <div uiRadioGroup defaultValue="light" disabled>
          @for (theme of themes; track theme.value) {
            <label data-slot="label">
              <button uiRadio [value]="theme.value">
                <span uiRadioIndicator></span>
              </button>
              {{ theme.label }}
            </label>
          }
        </div>
      </div>
      <div uiField>
        <label uiFieldLabel>Backups</label>
        <p uiFieldDescription>Hourly backups need the Pro plan.</p>
        <div uiRadioGroup defaultValue="daily">
          @for (backup of backups; track backup.value) {
            <label data-slot="label">
              <button
                uiRadio
                [value]="backup.value"
                [disabled]="backup.disabled"
              >
                <span uiRadioIndicator></span>
              </button>
              {{ backup.label }}
            </label>
          }
        </div>
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

  readonly backups = [
    { value: "hourly", label: "Hourly", disabled: true },
    { value: "daily", label: "Daily", disabled: false },
    { value: "weekly", label: "Weekly", disabled: false },
  ]
}

export { Example }
