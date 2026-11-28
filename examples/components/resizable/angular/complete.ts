import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
  type ResizableLayoutCommit,
} from "@ui-sdk/angular/resizable"

@Component({
  imports: [Resizable, ResizableHandle, ResizablePanel],
  template: `
    <div uiResizable (layoutCommit)="onLayoutCommit($event)">
      <div uiResizablePanel [defaultSize]="40" [minSize]="20">
        <h3>Files</h3>
        <ul>
          <li>page.tsx</li>
          <li>layout.tsx</li>
          <li>globals.css</li>
        </ul>
      </div>
      <div uiResizableHandle aria-label="Resize files"></div>
      <div uiResizablePanel [minSize]="20">
        <h3>page.tsx</h3>
        <span data-slot="hint">Saved just now</span>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  onLayoutCommit(commit: ResizableLayoutCommit) {
    this.log(
      `Saved ${commit.value.map(Math.round).join(" / ")} (${commit.reason})`
    )
  }
}

export { Example }
