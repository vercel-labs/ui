import { Component } from "@angular/core"
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

let nextId = 0

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
      <form data-slot="stack" [id]="form" (submit)="onSubmit($event)">
        <div uiField>
          <label uiFieldLabel>Quantity</label>
          <div uiNumberInput name="quantity" [defaultValue]="2" [min]="1">
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
        <div uiField>
          <label uiFieldLabel>Tip</label>
          <div
            uiNumberInput
            name="tip"
            [defaultValue]="4.5"
            [min]="0"
            [step]="0.5"
            [format]="{ style: 'currency', currency: 'USD' }"
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
      </form>
      <div uiField>
        <label uiFieldLabel>Gift cards</label>
        <div
          uiNumberInput
          name="gift-cards"
          [form]="form"
          [defaultValue]="0"
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
      <div data-slot="row">
        <button type="reset" [attr.form]="form">Reset</button>
        <button type="submit" [attr.form]="form" data-variant="solid">
          Save
        </button>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly form = `order-form-${nextId++}`

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
      ([name, value]) => `${name}=${value}`
    )
    this.log(`Submitted ${data.join(", ")}`)
  }
}

export { Example }
