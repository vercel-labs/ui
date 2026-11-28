import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  createResizableController,
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/angular/resizable"

@Component({
  imports: [Resizable, ResizableHandle, ResizablePanel],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="editor.collapse('controller-sidebar')">
          Collapse
        </button>
        <button type="button" (click)="editor.expand('controller-sidebar')">
          Expand
        </button>
        <button
          type="button"
          (click)="editor.resize('controller-sidebar', '240px')"
        >
          240px
        </button>
        <button type="button" (click)="read()">Read</button>
      </div>
      <div uiResizable [controller]="editor">
        <div
          uiResizablePanel
          id="controller-sidebar"
          [defaultSize]="30"
          [minSize]="20"
          collapsible
        >
          <h3>Files</h3>
          <ul>
            <li>page.tsx</li>
            <li>layout.tsx</li>
            <li>globals.css</li>
          </ul>
        </div>
        <div uiResizableHandle aria-label="Resize files"></div>
        <div uiResizablePanel [minSize]="30">
          <h3>page.tsx</h3>
          <span data-slot="hint">Saved just now</span>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly editor = createResizableController()

  read() {
    this.log(
      `Layout ${this.editor.getLayout().map(Math.round).join(" / ")}${this.editor.isCollapsed("controller-sidebar") ? ", collapsed" : ""}`
    )
  }
}

export { Example }
