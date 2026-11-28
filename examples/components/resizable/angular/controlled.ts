import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
  type ResizableLayoutChange,
} from "@ui-sdk/angular/resizable"

@Component({
  imports: [Resizable, ResizableHandle, ResizablePanel],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="layout.set([50, 50])">
          Split Evenly
        </button>
        <button type="button" (click)="layout.set([30, 70])">Reset</button>
      </div>
      <div
        uiResizable
        [(layout)]="layout"
        (beforeLayoutChange)="onLayoutChange($event)"
      >
        <div uiResizablePanel [minSize]="20">
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
    </div>
  `,
})
class Example {
  readonly format = (layout: number[]) => layout.map(Math.round).join(" / ")

  readonly log = useLog()

  readonly layout = signal([30, 70])

  onLayoutChange(change: ResizableLayoutChange) {
    if (this.format(change.value) !== this.format(this.layout())) {
      this.log(`${this.format(change.value)} (${change.reason})`)
    }
  }
}

export { Example }
