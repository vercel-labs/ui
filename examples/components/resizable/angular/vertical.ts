import { Component } from "@angular/core"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/angular/resizable"

@Component({
  imports: [Resizable, ResizableHandle, ResizablePanel],
  template: `
    <div uiResizable orientation="vertical">
      <div uiResizablePanel [defaultSize]="45" [minSize]="25">
        <h3>Inbox</h3>
        <span data-slot="hint">3 unread messages</span>
      </div>
      <div uiResizableHandle aria-label="Resize inbox"></div>
      <div uiResizablePanel [defaultSize]="55" [minSize]="25">
        <h3>Quarterly report</h3>
        <span data-slot="hint">From Hollis Grant</span>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
