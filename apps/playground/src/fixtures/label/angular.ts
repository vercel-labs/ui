import { Component } from "@angular/core"
import { Checkbox } from "@ui-sdk/angular/checkbox"
import { Label } from "@ui-sdk/angular/label"
import { NumberInput, NumberInputControl } from "@ui-sdk/angular/number-input"
import { Radio, RadioGroup } from "@ui-sdk/angular/radio"
import {
  Slider,
  SliderControl,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/angular/slider"
import { labelFixture } from "../../../../../tests/fixtures/label"

import { mountAngular, state } from "../../angular-mount"

const { email, plan, volume, terms, region, delivery, quantity } = labelFixture

@Component({
  imports: [
    Checkbox,
    Label,
    NumberInput,
    NumberInputControl,
    Radio,
    RadioGroup,
    Slider,
    SliderControl,
    SliderThumb,
    SliderTrack,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <label uiLabel [attr.for]="email.id">{{ email.label }}</label>
      <input [id]="email.id" />
      <label uiLabel [attr.for]="plan.id">{{ plan.label }}</label>
      <div
        uiRadioGroup
        [id]="plan.id"
        class="radio-group"
        [defaultValue]="plan.defaultValue"
      >
        @for (item of plan.items; track item.value) {
          <button uiRadio class="radio" [value]="item.value">
            {{ item.label }}
          </button>
        }
      </div>
      <label uiLabel [attr.for]="volume.id">{{ volume.label }}</label>
      <div
        uiSlider
        [id]="volume.id"
        class="slider"
        [defaultValue]="volume.defaultValue"
      >
        <div uiSliderControl>
          <div uiSliderTrack class="slider-track">
            <div uiSliderThumb class="slider-thumb"></div>
          </div>
        </div>
      </div>
      <label uiLabel
        ><button uiCheckbox class="checkbox"></button>{{ terms.label }}</label
      >
      <label uiLabel [attr.for]="region.id">{{ region.label }}</label>
      <div uiRadioGroup [id]="region.id" class="radio-group" disabled>
        @for (item of region.items; track item.value) {
          <button uiRadio class="radio" [value]="item.value">
            {{ item.label }}
          </button>
        }
      </div>
      <label uiLabel [attr.for]="delivery.id">{{ delivery.label }}</label>
      <div
        uiRadioGroup
        [id]="delivery.id"
        class="radio-group"
        [attr.aria-label]="delivery.name"
      >
        @for (item of delivery.items; track item.value) {
          <button uiRadio class="radio" [value]="item.value">
            {{ item.label }}
          </button>
        }
      </div>
      <label uiLabel [attr.for]="quantity.id">{{ quantity.label }}</label>
      @if (shown()) {
        <div
          uiNumberInput
          [id]="quantity.id"
          [defaultValue]="quantity.defaultValue"
        >
          <input uiNumberInputControl />
        </div>
      } @else {
        <button (click)="shown.set(true)">{{ quantity.show }}</button>
      }
      <button>After</button>
    </div>
  `,
})
class Fixture {
  readonly email = email
  readonly plan = plan
  readonly volume = volume
  readonly terms = terms
  readonly region = region
  readonly delivery = delivery
  readonly quantity = quantity
  readonly shown = state(false)
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
