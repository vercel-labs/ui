import { Component } from "@angular/core"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/angular/resizable"

@Component({
  imports: [Resizable, ResizableHandle, ResizablePanel],
  template: `
    <div uiResizable autoSaveId="docs-persistence">
      <div uiResizablePanel id="docs-sidebar" [defaultSize]="30" [minSize]="20">
        <h3>Outline</h3>
        <ul>
          <li>Introduction</li>
          <li>Installation</li>
          <li>Usage</li>
        </ul>
      </div>
      <div uiResizableHandle aria-label="Resize outline">
        <div></div>
      </div>
      <div uiResizablePanel id="docs-content" [minSize]="30">
        <h3>Introduction</h3>
        <span data-slot="hint">Last edited by Wren Takahashi</span>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
