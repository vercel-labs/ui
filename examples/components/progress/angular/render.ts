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
    <div uiProgress [value]="18">
      <span uiProgressLabel>Battery</span>
      <span uiProgressValue #progressValue="uiProgressValue">
        {{
          progressValue.state().status === "complete"
            ? "Charged"
            : progressValue.state().text + " charged"
        }}
      </span>
      <span uiProgressTrack>
        <div
          uiProgressIndicator
          #indicator="uiProgressIndicator"
          [attr.data-variant]="
            (indicator.state().percent ?? 0) < 20 ? 'destructive' : null
          "
        ></div>
      </span>
    </div>
  `,
})
class Example {}

export { Example }
