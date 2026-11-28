import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
  type SliderValueChange,
  type SliderValueCommit,
} from "@ui-sdk/angular/slider"
import {
  serialize,
  sliderFixture,
  sliderOptions,
} from "../../../../../tests/fixtures/slider"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldLabel,
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    SliderValue,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
      >
        <div uiField>
          <label uiFieldLabel>{{ f.volume.label }}</label>
          <div
            uiSlider
            [orientation]="options.orientation"
            [disabled]="options.disabled"
            [largeStep]="options.largeStep"
            [locale]="options.locale"
            [name]="f.volume.name"
            [format]="options.volumeFormat"
            [value]="options.controlled ? volume() : undefined"
            [defaultValue]="options.controlled ? undefined : options.volume"
            (beforeValueChange)="report(f.volume.name, $event)"
            (valueChange)="volume.set($event)"
            (valueCommit)="commit(f.volume.name, $event)"
          >
            <output uiSliderValue class="slider-value"></output>
            <div uiSliderControl class="slider-control">
              <div uiSliderTrack class="slider-track">
                <div uiSliderIndicator class="slider-indicator"></div>
                <div uiSliderThumb class="slider-thumb"></div>
              </div>
            </div>
          </div>
          <p uiFieldDescription>{{ f.volume.description }}</p>
        </div>

        <div uiField>
          <label uiFieldLabel>{{ f.price.label }}</label>
          <div
            uiSlider
            [orientation]="options.orientation"
            [disabled]="options.disabled"
            [largeStep]="options.largeStep"
            [locale]="options.locale"
            [name]="f.price.name"
            [defaultValue]="options.price"
            [minStepsBetweenThumbs]="options.minSteps"
            [format]="options.format"
            (beforeValueChange)="report(f.price.name, $event)"
            (valueCommit)="commit(f.price.name, $event)"
          >
            <output uiSliderValue class="slider-value"></output>
            <div uiSliderControl class="slider-control">
              <div uiSliderTrack class="slider-track">
                <div uiSliderIndicator class="slider-indicator"></div>
                @for (
                  label of f.price.thumbs;
                  track label;
                  let index = $index
                ) {
                  <div
                    uiSliderThumb
                    class="slider-thumb"
                    [index]="index"
                    [aria-label]="label"
                  ></div>
                }
              </div>
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
  readonly f = sliderFixture
  readonly options = sliderOptions()
  readonly action = state("")
  readonly commits = state<string[]>([])
  readonly submitted = state("")
  readonly volume = state<number | number[]>(this.options.volume)

  report(name: string, change: SliderValueChange) {
    if (this.options.cancel === name) {
      return change.cancel()
    }
    this.action.set(`${name}:${String(change.value)}`)
  }

  commit(name: string, change: SliderValueCommit) {
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
