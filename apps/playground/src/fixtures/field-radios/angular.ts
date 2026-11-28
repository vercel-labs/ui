import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/angular/radio"
import {
  fieldRadiosFixture,
  fieldRadiosOptions,
} from "../../../../../tests/fixtures/field"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [Field, FieldLabel, Radio, RadioGroup, RadioIndicator],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div uiField>
        <label uiFieldLabel>{{ f.label }}</label>
        <div uiRadioGroup class="form" [name]="f.name">
          @for (size of f.sizes; track size.value; let index = $index) {
            <div
              uiField
              class="row"
              [disabled]="index === 0 && options.disabledField"
            >
              <button
                uiRadio
                class="radio"
                [value]="size.value"
                [disabled]="index === 0 && firstDisabled()"
              >
                <span *uiRadioIndicator class="radio-indicator"></span>
              </button>
              <label uiFieldLabel>{{ size.label }}</label>
            </div>
          }
        </div>
      </div>
      <button>After</button>
      <button (click)="firstDisabled.set(!firstDisabled())">
        {{ f.disableFirst }}
      </button>
    </div>
  `,
})
class Fixture {
  readonly f = fieldRadiosFixture
  readonly options = fieldRadiosOptions()
  readonly firstDisabled = state(false)
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
