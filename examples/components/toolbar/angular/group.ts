import { Component } from "@angular/core"
import {
  LucideClipboard,
  LucideCopy,
  LucideDynamicIcon,
  LucideRedo,
  LucideScissors,
  LucideUndo,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@ui-sdk/angular/toolbar"

@Component({
  imports: [
    Toolbar,
    ToolbarButton,
    ToolbarGroup,
    ToolbarSeparator,
    LucideDynamicIcon,
    LucideRedo,
    LucideUndo,
  ],
  template: `
    <div uiToolbar aria-label="Edit">
      <div uiToolbarGroup aria-label="Clipboard">
        @for (item of clipboard; track item.label) {
          <button
            uiToolbarButton
            [aria-label]="item.label"
            (click)="log(item.label)"
          >
            <svg [lucideIcon]="item.icon"></svg>
          </button>
        }
      </div>
      <div uiToolbarSeparator></div>
      <div uiToolbarGroup disabled aria-label="History">
        <button uiToolbarButton aria-label="Undo">
          <svg lucideUndo></svg>
        </button>
        <button uiToolbarButton aria-label="Redo">
          <svg lucideRedo></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {
  readonly clipboard = [
    { label: "Cut", icon: LucideScissors },
    { label: "Copy", icon: LucideCopy },
    { label: "Paste", icon: LucideClipboard },
  ]

  readonly log = useLog()
}

export { Example }
