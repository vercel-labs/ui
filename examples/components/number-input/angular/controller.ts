import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  createNumberInputController,
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
        <button type="button" (click)="zoom.decrement({ large: true })">
          Zoom Out
        </button>
        <button type="button" (click)="zoom.increment({ large: true })">
          Zoom In
        </button>
        <button type="button" (click)="zoom.setValue(100)">Actual Size</button>
        <button type="button" (click)="log(\`Zoom is \${zoom.getValue()}%\`)">
          Read
        </button>
        <button type="button" (click)="zoom.focus()">Focus</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Zoom</label>
        <div
          uiNumberInput
          [defaultValue]="100"
          [min]="10"
          [max]="400"
          [step]="10"
          [format]="{ style: 'unit', unit: 'percent' }"
          [controller]="zoom"
          (beforeValueChange)="
            log(
              'Zoom ' + ($event.value ?? 'empty') + '% (' + $event.reason + ')'
            )
          "
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

  readonly zoom = createNumberInputController()
}

export { Example }
