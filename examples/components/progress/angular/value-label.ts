import { Component } from "@angular/core"
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
  type GaugeLabelDetails,
} from "@ui-sdk/angular/progress"

@Component({
  imports: [
    Progress,
    ProgressIndicator,
    ProgressLabel,
    ProgressTrack,
    ProgressValue,
  ],
  template: `
    <div uiProgress [value]="3" [max]="12" [getValueLabel]="valueLabel">
      <span uiProgressLabel>Copying files</span>
      <span uiProgressValue>3 of 12</span>
      <div uiProgressTrack>
        <div uiProgressIndicator></div>
      </div>
    </div>
  `,
})
class Example {
  readonly valueLabel = (value: number | null, details: GaugeLabelDetails) =>
    `${value} of ${details.max} files, ${details.formatted}`
}

export { Example }
