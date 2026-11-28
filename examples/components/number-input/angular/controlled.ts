import { Component, signal } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
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
      <div data-slot="controls">
        <button type="button" (click)="value.set(4)">Reset to 4</button>
        <button type="button" (click)="value.set(null)">Clear</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Servings</label>
        <div
          uiNumberInput
          [(value)]="value"
          (beforeValueChange)="
            log(
              'Value ' + ($event.value ?? 'empty') + ' (' + $event.reason + ')'
            )
          "
          (valueCommit)="
            log(
              'Committed ' +
                ($event.value ?? 'empty') +
                ' (' +
                $event.reason +
                ')'
            )
          "
          [min]="1"
          [max]="12"
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
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly value = signal<number | null>(4)
}

export { Example }
