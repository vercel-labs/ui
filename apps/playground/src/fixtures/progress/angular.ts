import { Component } from "@angular/core"
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/angular/progress"
import { progressFixture } from "../../../../../tests/fixtures/progress"
import { mountAngular, state } from "../../angular-mount"

const { upload, loading, files, disk } = progressFixture

@Component({
  imports: [
    Progress,
    ProgressIndicator,
    ProgressLabel,
    ProgressTrack,
    ProgressValue,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div uiProgress class="gauge" [value]="value()">
        <span uiProgressLabel>{{ upload.label }}</span>
        <span uiProgressValue class="gauge-value"></span>
        <div uiProgressTrack class="gauge-track">
          <div uiProgressIndicator class="gauge-indicator"></div>
        </div>
      </div>
      @for (item of bars; track item.label) {
        <div
          uiProgress
          class="gauge"
          [value]="item.value"
          [max]="item.max"
          [format]="item.format"
          [getValueLabel]="item.getValueLabel"
        >
          <span uiProgressLabel>{{ item.label }}</span>
          <span uiProgressValue class="gauge-value"></span>
          <div uiProgressTrack class="gauge-track">
            <div uiProgressIndicator class="gauge-indicator"></div>
          </div>
        </div>
      }
      <button (click)="advance()">Advance</button>
      <button (click)="value.set(upload.value)">Restart</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `,
})
class Fixture {
  readonly upload = upload
  readonly value = state(upload.value)
  readonly bars: {
    label: string
    value: number | null
    max?: number
    format?: Intl.NumberFormatOptions
    getValueLabel?: (value: number | null) => string
  }[] = [
    { label: loading.label, value: null },
    {
      label: files.label,
      value: files.value,
      max: files.max,
      getValueLabel: (value: number | null) => files.valueLabel(value!),
    },
    {
      label: disk.label,
      value: disk.value,
      max: disk.max,
      format: disk.format,
    },
  ]

  advance() {
    this.value.set(Math.min(100, this.value() + upload.step))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
