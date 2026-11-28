import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@ui-sdk/angular/number-input"

@Component({
  imports: [
    Field,
    FieldLabel,
    NumberInput,
    NumberInputControl,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
    LucideMinus,
    LucidePlus,
  ],
  template: `
    <div data-slot="stack">
      @for (field of fields; track field.label) {
        <div uiField>
          <label uiFieldLabel>{{ field.label }}</label>
          <div
            uiNumberInput
            [defaultValue]="field.defaultValue"
            [step]="field.step"
            [format]="field.format"
            [min]="0"
          >
            <div uiNumberInputGroup>
              <button uiNumberInputDecrement aria-label="Decrease">
                <svg lucideMinus></svg>
              </button>
              <input uiNumberInputControl />
              <button uiNumberInputIncrement aria-label="Increase">
                <svg lucidePlus></svg>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly fields = [
    {
      label: "Price",
      defaultValue: 19.99,
      step: 0.01,
      format: { style: "currency", currency: "USD" },
    },
    {
      label: "Discount",
      defaultValue: 0.15,
      step: 0.01,
      format: { style: "percent" },
    },
    {
      label: "Weight",
      defaultValue: 2.5,
      step: 0.1,
      format: { style: "unit", unit: "kilogram" },
    },
  ] satisfies {
    label: string
    defaultValue: number
    step: number
    format: Intl.NumberFormatOptions
  }[]
}

export { Example }
