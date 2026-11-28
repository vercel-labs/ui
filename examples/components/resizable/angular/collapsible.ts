import { Component } from "@angular/core"
import { LucideFolder, LucideSearch, LucideSettings } from "@lucide/angular"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/angular/resizable"

@Component({
  imports: [
    Resizable,
    ResizableHandle,
    ResizablePanel,
    LucideFolder,
    LucideSearch,
    LucideSettings,
  ],
  template: `
    <div uiResizable>
      <div
        uiResizablePanel
        [defaultSize]="30"
        [minSize]="25"
        collapsible
        collapsedSize="48px"
      >
        <ul>
          <li data-slot="row">
            <svg lucideFolder></svg>
            <span>Files</span>
          </li>
          <li data-slot="row">
            <svg lucideSearch></svg>
            <span>Search</span>
          </li>
          <li data-slot="row">
            <svg lucideSettings></svg>
            <span>Settings</span>
          </li>
        </ul>
      </div>
      <div uiResizableHandle aria-label="Resize sidebar">
        <div></div>
      </div>
      <div uiResizablePanel [minSize]="40">
        <h3>README.md</h3>
        <span data-slot="hint">Edited by Inès Moreau</span>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
