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
    <div uiProgress [value]="3" [min]="1" [max]="5">
      <span uiProgressLabel>Account setup, step 3 of 5</span>
      <span uiProgressValue></span>
      <div uiProgressTrack>
        <div uiProgressIndicator></div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
