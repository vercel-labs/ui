import { Component } from "@angular/core"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
  type ResizableStorage,
} from "@ui-sdk/angular/resizable"

@Component({
  imports: [Resizable, ResizableHandle, ResizablePanel],
  template: `
    <div uiResizable autoSaveId="docs-storage" [storage]="session">
      <div
        uiResizablePanel
        id="session-chats"
        [defaultSize]="35"
        [minSize]="20"
      >
        <h3>Messages</h3>
        <ul>
          <li>Inès Moreau</li>
          <li>Kofi Mensah</li>
          <li>Wren Takahashi</li>
        </ul>
      </div>
      <div uiResizableHandle aria-label="Resize messages"></div>
      <div uiResizablePanel id="session-thread" [minSize]="20">
        <h3>Inès Moreau</h3>
        <span data-slot="hint">Can we move the review to Friday?</span>
      </div>
    </div>
  `,
})
class Example {
  readonly session: ResizableStorage = {
    getItem: (key) => sessionStorage.getItem(key),
    setItem: (key, value) => sessionStorage.setItem(key, value),
  }
}

export { Example }
