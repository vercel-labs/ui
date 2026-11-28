import { Component } from "@angular/core"
import { LucideMinus, LucideMoveHorizontal, LucidePlus } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
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
    NumberInputScrubArea,
    NumberInputScrubAreaCursor,
    LucideMinus,
    LucideMoveHorizontal,
    LucidePlus,
  ],
  template: `
    <div uiField>
      <div
        uiNumberInput
        [defaultValue]="1"
        [min]="1"
        (valueCommit)="log('Quantity ' + ($event.value ?? 'empty'))"
      >
        <span uiNumberInputScrubArea [pixelsPerStep]="4">
          <label uiFieldLabel>Quantity</label>
          <span uiNumberInputScrubAreaCursor>
            <svg lucideMoveHorizontal></svg>
          </span>
        </span>
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
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
