import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
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
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          type="button"
          [attr.aria-disabled]="uploaded() >= total"
          (click)="uploadNext()"
        >
          Upload Next
        </button>
        <button type="button" (click)="reset()">Reset</button>
      </div>
      <div uiProgress [value]="(uploaded() / total) * 100">
        <span uiProgressLabel>Uploading photos</span>
        <span uiProgressValue></span>
        <div uiProgressTrack>
          <div uiProgressIndicator></div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly total = 5

  readonly log = useLog()

  readonly uploaded = signal(1)

  uploadNext() {
    if (this.uploaded() >= this.total) {
      return
    }
    this.uploaded.update((v) => v + 1)
    this.log(`Uploaded ${this.uploaded()} of ${this.total} photos`)
  }

  reset() {
    this.uploaded.set(0)
    this.log("Reset to 0 photos")
  }
}

export { Example }
