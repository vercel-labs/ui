import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputScrubArea,
  type NumberInputValueChange,
  type NumberInputValueCommit,
} from "@ui-sdk/angular/number-input"
import {
  numberInputFixture,
  numberInputOptions,
  serialize,
} from "../../../../../tests/fixtures/number-input"
import { mountAngular, state } from "../../angular-mount"

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
    NumberInputScrubArea,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
      >
        <div uiField [name]="f.quantity.name">
          <label uiFieldLabel>{{ f.quantity.label }}</label>
          <div
            uiNumberInput
            [wheel]="options.wheel"
            [disabled]="options.disabled"
            [readOnly]="options.readOnly"
            [locale]="options.locale"
            [min]="f.quantity.min"
            [max]="f.quantity.max"
            [required]="options.required"
            [value]="options.controlled ? quantity() : undefined"
            [defaultValue]="options.controlled ? undefined : options.quantity"
            (beforeValueChange)="report(f.quantity.name, $event)"
            (valueChange)="quantity.set($event)"
            (valueCommit)="commit(f.quantity.name, $event)"
          >
            <div uiNumberInputGroup class="number-input-group">
              <button
                uiNumberInputDecrement
                [attr.aria-label]="f.quantity.decrement"
              >
                −
              </button>
              <input uiNumberInputControl class="number-input-control" />
              <button
                uiNumberInputIncrement
                [attr.aria-label]="f.quantity.increment"
                [disabled]="options.disabledIncrement"
              >
                +
              </button>
            </div>
          </div>
          <p uiFieldDescription>{{ f.quantity.description }}</p>
        </div>

        <div uiField>
          <label uiFieldLabel>{{ f.amount.label }}</label>
          <div
            uiNumberInput
            [wheel]="options.wheel"
            [disabled]="options.disabled"
            [readOnly]="options.readOnly"
            [locale]="options.locale"
            [name]="f.amount.name"
            [defaultValue]="f.amount.defaultValue"
            [min]="options.amountMin"
            [step]="f.amount.step"
            [format]="currency"
            (beforeValueChange)="report(f.amount.name, $event)"
            (valueCommit)="commit(f.amount.name, $event)"
          >
            <span uiNumberInputScrubArea class="number-input-scrub">{{
              f.amount.scrub
            }}</span>
            <div uiNumberInputGroup class="number-input-group">
              <button
                uiNumberInputDecrement
                [attr.aria-label]="f.amount.decrement"
              >
                −
              </button>
              <input uiNumberInputControl class="number-input-control" />
              <button
                uiNumberInputIncrement
                [attr.aria-label]="f.amount.increment"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Committed">{{
        commits().join(" ")
      }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = numberInputFixture
  readonly options = numberInputOptions()
  readonly currency = {
    style: "currency" as const,
    currency: numberInputFixture.amount.currency,
  }
  readonly action = state("")
  readonly commits = state<string[]>([])
  readonly submitted = state("")
  readonly quantity = state<number | null>(this.options.quantity)

  report(name: string, change: NumberInputValueChange) {
    if (this.options.cancel === name) {
      return change.cancel()
    }
    this.action.set(`${name}:${String(change.value)}`)
  }

  commit(name: string, change: NumberInputValueCommit) {
    this.commits.update((list) => [...list, `${name}:${String(change.value)}`])
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.submitted.set(serialize(event.currentTarget as HTMLFormElement))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
