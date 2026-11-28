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
    <div uiField>
      <label uiFieldLabel>Temperature</label>
      <div
        uiNumberInput
        [defaultValue]="-2"
        [min]="-20"
        [max]="40"
        [format]="{ style: 'unit', unit: 'celsius' }"
      >
        <div uiNumberInputGroup>
          <button
            uiNumberInputDecrement
            #numberInputDecrement="uiNumberInputDecrement"
            aria-label="Colder"
            [title]="
              numberInputDecrement.state().atBound
                ? 'As cold as it goes'
                : 'Colder'
            "
          >
            <svg lucideMinus></svg>
          </button>
          <input uiNumberInputControl />
          <button
            uiNumberInputIncrement
            #numberInputIncrement="uiNumberInputIncrement"
            aria-label="Warmer"
          >
            @if (numberInputIncrement.state().atBound) {
              <span>Max</span>
            } @else {
              <svg lucidePlus></svg>
            }
          </button>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
