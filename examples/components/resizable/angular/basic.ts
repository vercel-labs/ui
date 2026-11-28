import { Component } from "@angular/core"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/angular/resizable"

@Component({
  imports: [Resizable, ResizableHandle, ResizablePanel],
  template: `
    <div uiResizable>
      <div uiResizablePanel [defaultSize]="35" [minSize]="20">
        <h3>Files</h3>
        <ul>
          <li>page.tsx</li>
          <li>layout.tsx</li>
          <li>globals.css</li>
        </ul>
      </div>
      <div uiResizableHandle aria-label="Resize files"></div>
      <div uiResizablePanel [defaultSize]="65" [minSize]="40">
        <div uiResizable orientation="vertical">
          <div uiResizablePanel [defaultSize]="60" [minSize]="30">
            <h3>page.tsx</h3>
            <span data-slot="hint">Saved just now</span>
          </div>
          <div uiResizableHandle aria-label="Resize editor"></div>
          <div uiResizablePanel [defaultSize]="40" [minSize]="30">
            <h3>Terminal</h3>
            <span data-slot="hint">Ready on port 3000</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
