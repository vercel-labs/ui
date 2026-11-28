import { Component } from "@angular/core"
import {
  Checkbox,
  type CheckboxCheckedChange,
  CheckboxGroup,
  CheckboxIndicator,
} from "@ui-sdk/angular/checkbox"
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/angular/radio"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"
import {
  formsFixture,
  formsOptions,
  serialize,
} from "../../../../../tests/fixtures/forms"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Checkbox,
    CheckboxGroup,
    CheckboxIndicator,
    Field,
    FieldControl,
    FieldDescription,
    FieldError,
    FieldLabel,
    Radio,
    RadioGroup,
    RadioIndicator,
    Switch,
    SwitchThumb,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        [id]="f.formId"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
      >
        <div uiField>
          <div class="row">
            <button
              uiCheckbox
              class="checkbox"
              required
              [name]="f.terms.name"
              [value]="f.terms.value"
              [readOnly]="options.readOnly"
              [checked]="options.controlled ? terms() : undefined"
              (beforeCheckedChange)="onTermsChange($event)"
            >
              <span *uiCheckboxIndicator class="checkbox-indicator"></span>
            </button>
            <label uiFieldLabel>{{ f.terms.label }}</label>
          </div>
          <p uiFieldDescription>{{ f.terms.description }}</p>
          <div *uiFieldError="'valueMissing'" class="field-error">
            {{ f.terms.error }}
          </div>
        </div>

        <fieldset>
          <legend [id]="f.toppings.legendId">{{ f.toppings.legend }}</legend>
          <div
            uiCheckboxGroup
            class="form"
            [attr.aria-labelledby]="f.toppings.legendId"
            [name]="f.toppings.name"
            [defaultValue]="f.toppings.defaultValue"
            [allValues]="all"
            [required]="options.toppingsRequired"
            (beforeValueChange)="
              report(f.toppings.name, $event.value.join(','), $event)
            "
          >
            <label>
              <button uiCheckbox class="checkbox" parent>
                <span *uiCheckboxIndicator class="checkbox-indicator"></span>
              </button>
              {{ f.toppings.parent }}
            </label>
            @for (item of f.toppings.items; track item.value) {
              <label>
                <button uiCheckbox class="checkbox" [value]="item.value">
                  <span *uiCheckboxIndicator class="checkbox-indicator"></span>
                </button>
                {{ item.label }}
              </label>
            }
          </div>
        </fieldset>

        @for (item of f.switches; track item.name) {
          <label>
            <button
              uiSwitch
              class="switch"
              [name]="item.name"
              [defaultChecked]="item.defaultChecked"
              (beforeCheckedChange)="report(item.name, $event.value, $event)"
            >
              <span uiSwitchThumb class="switch-thumb"></span>
            </button>
            {{ item.label }}
          </label>
        }

        <div uiField>
          <label uiFieldLabel>{{ f.plan.label }}</label>
          <div
            uiRadioGroup
            class="form"
            required
            [name]="f.plan.name"
            [defaultValue]="options.plan"
            [readOnly]="options.readOnly"
            [disabled]="options.disabled"
            [loop]="options.loop"
            (beforeValueChange)="report(f.plan.name, $event.value, $event)"
          >
            @for (item of plans; track item.value) {
              <label>
                <button
                  uiRadio
                  class="radio"
                  [value]="item.value"
                  [disabled]="item.disabled"
                >
                  <span *uiRadioIndicator class="radio-indicator"></span>
                </button>
                {{ item.label }}
              </label>
            }
          </div>
          <p uiFieldDescription>{{ f.plan.description }}</p>
          <div *uiFieldError class="field-error"></div>
        </div>

        <div uiField [invalid]="options.invalid">
          <label uiFieldLabel>{{ f.email.label }}</label>
          <input uiFieldControl type="email" required [name]="f.email.name" />
          <p uiFieldDescription>{{ f.email.description }}</p>
          <div *uiFieldError class="field-error"></div>
        </div>

        @if (options.nickname) {
          <div uiField>
            <label uiFieldLabel>{{ f.nickname.label }}</label>
            <input uiFieldControl required [name]="f.nickname.name" />
          </div>
        }

        <fieldset [disabled]="shipping()">
          <legend>{{ f.shipping.legend }}</legend>
          <label>
            <button uiCheckbox class="checkbox" [name]="f.shipping.name">
              <span *uiCheckboxIndicator class="checkbox-indicator"></span>
            </button>
            {{ f.shipping.label }}
          </label>
        </fieldset>

        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <label>
        <button
          uiCheckbox
          class="checkbox"
          [form]="f.formId"
          [name]="f.newsletter.name"
          [value]="f.newsletter.value"
        >
          <span *uiCheckboxIndicator class="checkbox-indicator"></span>
        </button>
        {{ f.newsletter.label }}
      </label>
      <button type="button" (click)="shipping.set(!shipping())">
        Toggle shipping
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Last source">{{ source() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = formsFixture
  readonly options = formsOptions()
  readonly all = formsFixture.toppings.items.map((item) => item.value)
  readonly plans: { value: string; label: string; disabled?: boolean }[] =
    formsFixture.plan.items
  readonly action = state("")
  readonly source = state("")
  readonly submitted = state("")
  readonly terms = state<boolean | "indeterminate">(false)
  readonly shipping = state(false)

  report(
    name: string,
    value: unknown,
    change: { cancel: () => void; source: string }
  ) {
    if (this.options.cancel === name) {
      return change.cancel()
    }
    this.action.set(`${name}:${String(value)}`)
    this.source.set(change.source)
  }

  onTermsChange(change: CheckboxCheckedChange) {
    this.report(formsFixture.terms.name, change.value, change)
    if (!change.canceled) {
      this.terms.set(change.value)
    }
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
