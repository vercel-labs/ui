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
    <div data-slot="stack" dir="rtl">
      <h3 id="rtl-toppings">الإضافات</h3>
      <div
        uiCheckboxGroup
        aria-labelledby="rtl-toppings"
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
    { value: "cheese", label: "جبن" },
    { value: "mushrooms", label: "فطر" },
    { value: "olives", label: "زيتون" },
    { value: "peppers", label: "فلفل" },
  ]
}

export { Example }
