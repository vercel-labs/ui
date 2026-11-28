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
    <div dir="rtl">
      <div uiField>
        <label uiFieldLabel>الكمية</label>
        <div uiNumberInput [defaultValue]="1" [min]="0">
          <div uiNumberInputGroup>
            <button uiNumberInputDecrement aria-label="إنقاص">
              <svg lucideMinus></svg>
            </button>
            <input uiNumberInputControl />
            <button uiNumberInputIncrement aria-label="زيادة">
              <svg lucidePlus></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
