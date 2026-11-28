import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  Checkbox,
  CheckboxIndicator,
  type CheckedState,
} from "@ui-sdk/angular/checkbox"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/angular/resizable"

@Component({
  imports: [
    Checkbox,
    CheckboxIndicator,
    Resizable,
    ResizableHandle,
    ResizablePanel,
    LucideCheck,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <label data-slot="label">
          <button uiCheckbox [(checked)]="locked">
            <span uiCheckboxIndicator>
              <svg lucideCheck></svg>
            </span>
          </button>
          Lock layout
        </label>
      </div>
      <div uiResizable [disabled]="locked() === true">
        <div uiResizablePanel [minSize]="15">
          <h3>Pinned</h3>
          <span data-slot="hint">2 notes</span>
        </div>
        <div uiResizableHandle disabled aria-label="Resize pinned"></div>
        <div uiResizablePanel [minSize]="15">
          <h3>Inbox</h3>
          <span data-slot="hint">3 unread</span>
        </div>
        <div uiResizableHandle aria-label="Resize inbox"></div>
        <div uiResizablePanel [minSize]="15">
          <h3>Message</h3>
          <span data-slot="hint">From Kofi Mensah</span>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly locked = signal<CheckedState>(false)
}

export { Example }
