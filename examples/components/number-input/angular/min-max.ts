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
      <label uiFieldLabel>Guests</label>
      <div uiNumberInput [defaultValue]="2" [min]="1" [max]="8">
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
      <p uiFieldDescription>Tables seat between 1 and 8 guests.</p>
    </div>
  `,
})
class Example {}

export { Example }
