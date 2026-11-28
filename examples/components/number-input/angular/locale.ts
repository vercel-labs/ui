import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
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
    FieldDescription,
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
            [locale]="field.locale"
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
          <p uiFieldDescription>Formatted for {{ field.locale }}.</p>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly fields = [
    {
      label: "Preis",
      locale: "de-DE",
      defaultValue: 1234.5,
      step: 0.01,
      format: { style: "currency", currency: "EUR" },
    },
    {
      label: "Budget",
      locale: "en-IN",
      defaultValue: 1234567,
      step: 1000,
      format: { style: "currency", currency: "INR", maximumFractionDigits: 0 },
    },
  ] satisfies {
    label: string
    locale: string
    defaultValue: number
    step: number
    format: Intl.NumberFormatOptions
  }[]
}

export { Example }
