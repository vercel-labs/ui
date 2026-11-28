import { Component } from "@angular/core"
import { LucideCheck, LucideMinus } from "@lucide/angular"
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
} from "@ui-sdk/angular/checkbox"

@Component({
  imports: [
    Checkbox,
    CheckboxGroup,
    CheckboxIndicator,
    LucideCheck,
    LucideMinus,
  ],
  template: `
    <div data-slot="stack">
      <h3 id="parent-toppings">Toppings</h3>
      <div
        uiCheckboxGroup
        aria-labelledby="parent-toppings"
        [defaultValue]="['cheese', 'olives']"
        [allValues]="toppings.map((topping) => topping.value)"
      >
        <label data-slot="label">
          <button uiCheckbox parent>
            <span uiCheckboxIndicator>
              <svg lucideCheck></svg>
              <svg lucideMinus></svg>
            </span>
          </button>
          Select all
        </label>
        <div data-slot="stack">
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
