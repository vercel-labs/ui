import { Component } from "@angular/core"
import {
  LucideBold,
  LucideDynamicIcon,
  LucideItalic,
  LucideLink,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { useShortcut } from "@ui-sdk/angular/shortcuts"
import {
  createToolbarController,
  Toolbar,
  ToolbarButton,
} from "@ui-sdk/angular/toolbar"

@Component({
  imports: [Toolbar, ToolbarButton, LucideDynamicIcon],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="toolbar.focus()">Focus Toolbar</button>
      </div>
      <div uiToolbar [controller]="toolbar" aria-label="Notes formatting">
        @for (item of actions; track item.label) {
          <button
            uiToolbarButton
            [aria-label]="item.label"
            (click)="log(item.label)"
          >
            <svg [lucideIcon]="item.icon"></svg>
          </button>
        }
      </div>
      <textarea
        aria-label="Notes"
        placeholder="Type, then press Alt+F10"
      ></textarea>
    </div>
  `,
})
class Example {
  readonly actions = [
    { label: "Bold", icon: LucideBold },
    { label: "Italic", icon: LucideItalic },
    { label: "Insert link", icon: LucideLink },
  ]

  readonly log = useLog()

  readonly toolbar = createToolbarController()

  constructor() {
    useShortcut("alt+f10", () => this.toolbar.focus(), { allowInInput: true })
  }
}

export { Example }
