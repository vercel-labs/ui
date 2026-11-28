import { Component } from "@angular/core"
import { LucideCheck, LucideMessageSquare } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
} from "@ui-sdk/angular/toolbar"

@Component({
  imports: [
    Toolbar,
    ToolbarButton,
    ToolbarLink,
    ToolbarSeparator,
    LucideCheck,
    LucideMessageSquare,
  ],
  template: `
    <div uiToolbar aria-label="Pull request">
      <button uiToolbarButton aria-label="Approve" (click)="log('Approved')">
        <svg lucideCheck></svg>
      </button>
      <button uiToolbarButton aria-label="Comment" (click)="log('Comment')">
        <svg lucideMessageSquare></svg>
      </button>
      <div uiToolbarSeparator></div>
      <a uiToolbarLink href="#files" (click)="follow($event)">Files Changed</a>
      <a uiToolbarLink href="#checks" (click)="follow($event)">Checks</a>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  follow(event: MouseEvent) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    event.preventDefault()
    this.log(`Opened ${(event.currentTarget as HTMLAnchorElement).textContent}`)
  }
}

export { Example }
