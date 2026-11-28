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
      <div
        uiResizablePanel
        #files="uiResizablePanel"
        [defaultSize]="35"
        [minSize]="20"
        collapsible
      >
        <h3>Files</h3>
        <span data-slot="hint">{{
          files.state().collapsed ? "Collapsed" : percent(files.state().size)
        }}</span>
      </div>
      <div uiResizableHandle aria-label="Resize files"></div>
      <div uiResizablePanel #editor="uiResizablePanel" [minSize]="30">
        <h3>Editor</h3>
        <span data-slot="hint">{{ percent(editor.state().size) }}</span>
      </div>
    </div>
  `,
})
class Example {
  percent(size: number) {
    return `${Math.round(size)}%`
  }
}

export { Example }
