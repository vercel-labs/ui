import { Component } from "@angular/core"
import { LucideMoveHorizontal } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  NumberInput,
  NumberInputControl,
  NumberInputGroup,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
} from "@ui-sdk/angular/number-input"

let nextId = 0

@Component({
  imports: [
    NumberInput,
    NumberInputControl,
    NumberInputGroup,
    NumberInputScrubArea,
    NumberInputScrubAreaCursor,
    LucideMoveHorizontal,
  ],
  template: `
    <div data-slot="card" role="group" [attr.aria-labelledby]="title">
      <h3 [id]="title">Frame</h3>
      <div data-slot="grid">
        @for (item of fields; track item.label) {
          <div
            uiNumberInput
            [defaultValue]="item.defaultValue"
            [min]="item.min"
            (valueCommit)="log(item.label + ' ' + ($event.value ?? 'empty'))"
          >
            <div uiNumberInputGroup>
              <span uiNumberInputScrubArea [pixelsPerStep]="1">
                <span aria-hidden="true">{{ item.handle }}</span>
                <span uiNumberInputScrubAreaCursor>
                  <svg lucideMoveHorizontal></svg>
                </span>
              </span>
              <input uiNumberInputControl [aria-label]="item.label" />
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly fields = [
    { label: "X position", handle: "X", defaultValue: 120 },
    { label: "Y position", handle: "Y", defaultValue: 48 },
    { label: "Width", handle: "W", defaultValue: 320, min: 0 },
    { label: "Height", handle: "H", defaultValue: 240, min: 0 },
  ]

  readonly log = useLog()

  readonly title = `frame-title-${nextId++}`
}

export { Example }
