import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"

@Component({
  imports: [Field, FieldDescription, FieldLabel, Switch, SwitchThumb],
  template: `
    <div data-slot="stack">
      @for (setting of settings; track setting.label) {
        <div uiField data-variant="card">
          <div data-slot="stack">
            <label uiFieldLabel>{{ setting.label }}</label>
            <p uiFieldDescription>{{ setting.description }}</p>
          </div>
          <button uiSwitch [defaultChecked]="setting.defaultChecked">
            <span uiSwitchThumb></span>
          </button>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly settings = [
    {
      label: "Public profile",
      description: "Anyone can see your name and photo.",
      defaultChecked: false,
    },
    {
      label: "Show activity status",
      description: "Teammates can see when you're online.",
      defaultChecked: true,
    },
  ]
}

export { Example }
