import { Component } from "@angular/core"
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
} from "@ui-sdk/angular/progress"

@Component({
  imports: [Progress, ProgressIndicator, ProgressLabel, ProgressTrack],
  template: `
    <div uiProgress [value]="null">
      <span uiProgressLabel>Connecting to server</span>
      <div uiProgressTrack>
        <div uiProgressIndicator></div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
