import { Component } from "@angular/core"
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
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
    <div uiProgress [value]="60">
      <span uiProgressLabel>Exporting video</span>
      <span uiProgressValue></span>
      <div uiProgressTrack>
        <div uiProgressIndicator></div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
