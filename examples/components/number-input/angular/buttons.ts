import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@ui-sdk/angular/number-input"

@Component({
  imports: [
    NumberInput,
    NumberInputControl,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
    LucideMinus,
    LucidePlus,
  ],
  template: `
    <div uiNumberInput [defaultValue]="1" [min]="0">
      <div uiNumberInputGroup>
        <button uiNumberInputDecrement aria-label="Decrease">
          <svg lucideMinus></svg>
        </button>
        <input uiNumberInputControl aria-label="Quantity" />
        <button uiNumberInputIncrement aria-label="Increase">
          <svg lucidePlus></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
