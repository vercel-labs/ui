import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
} from "@ui-sdk/angular/checkbox"

@Component({
  imports: [Checkbox, CheckboxGroup, CheckboxIndicator, LucideCheck],
  template: `
    <div data-slot="stack">
      <h3 id="basic-toppings">Toppings</h3>
      <div
        uiCheckboxGroup
        aria-labelledby="basic-toppings"
        [defaultValue]="['cheese']"
      >
        @for (topping of toppings; track topping.value) {
          <label data-slot="label">
            <button uiCheckbox [value]="topping.value">
              <span uiCheckboxIndicator>
                <svg lucideCheck></svg>
              </span>
            </button>
            {{ topping.label }}
          </label>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly toppings = [
    { value: "cheese", label: "Cheese" },
    { value: "mushrooms", label: "Mushrooms" },
    { value: "olives", label: "Olives" },
    { value: "peppers", label: "Peppers" },
  ]
}

export { Example }
