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
    <div uiField>
      <label uiFieldLabel>Hours</label>
      <div
        uiNumberInput
        [defaultValue]="1.5"
        [min]="0"
        [max]="24"
        [step]="0.25"
        [largeStep]="1"
        [smallStep]="0.05"
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
      <p uiFieldDescription>Logged in quarter hours.</p>
    </div>
  `,
})
class Example {}

export { Example }
