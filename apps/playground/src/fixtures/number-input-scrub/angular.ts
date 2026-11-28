import { Component } from "@angular/core"
import {
  createNumberInputController,
  NumberInput,
  NumberInputControl,
  NumberInputGroup,
  NumberInputScrubArea,
} from "@ui-sdk/angular/number-input"
import { numberInputScrubFixture } from "../../../../../tests/fixtures/number-input-scrub"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    NumberInput,
    NumberInputControl,
    NumberInputGroup,
    NumberInputScrubArea,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div role="toolbar" class="row" [attr.aria-label]="f.toolbarLabel">
        <span
          uiNumberInputScrubArea
          class="number-input-scrub"
          [controller]="controller"
          [textContent]="f.toolbarScrub"
        ></span>
      </div>
      <table>
        <thead>
          <tr>
            <th
              uiNumberInputScrubArea
              class="number-input-scrub"
              [controller]="controller"
              [textContent]="f.headerScrub"
            ></th>
          </tr>
        </thead>
      </table>
      <div
        uiNumberInput
        locale="en-US"
        [id]="f.id"
        [controller]="controller"
        [defaultValue]="f.defaultValue"
        [min]="f.min"
        [max]="f.max"
        (valueChange)="action.set('' + $event)"
        (valueCommit)="commits.set(commits().concat('' + $event.value))"
      >
        <div uiNumberInputGroup class="number-input-group">
          <span
            uiNumberInputScrubArea
            class="number-input-scrub"
            [textContent]="f.letterScrub"
          ></span>
          <input
            uiNumberInputControl
            class="number-input-control"
            [attr.aria-label]="f.label"
          />
        </div>
        <div>
          <div>
            <div>
              <span
                uiNumberInputScrubArea
                class="number-input-scrub"
                [textContent]="f.nestedScrub"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Committed">{{
        commits().join(" ")
      }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = numberInputScrubFixture
  readonly controller = createNumberInputController()
  readonly action = state("")
  readonly commits = state<string[]>([])
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
