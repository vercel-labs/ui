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
    <div dir="rtl">
      <div uiProgress [value]="56" locale="ar-EG">
        <span uiProgressLabel>تقدم الرفع</span>
        <span uiProgressValue></span>
        <div uiProgressTrack>
          <div uiProgressIndicator></div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
