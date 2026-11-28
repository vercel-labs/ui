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
        <h3>Channels</h3>
        <ul>
          <li>general</li>
          <li>design</li>
          <li>releases</li>
        </ul>
      </div>
      <div uiResizableHandle aria-label="Resize channels">
        <div></div>
      </div>
      <div uiResizablePanel [defaultSize]="65" [minSize]="20">
        <h3>general</h3>
        <span data-slot="hint">Kofi Mensah: The release notes are ready.</span>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
