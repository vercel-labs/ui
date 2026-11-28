import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Toolbar, ToolbarButton } from "@ui-sdk/angular/toolbar"

@Component({
  imports: [Toolbar, ToolbarButton],
  template: `
    <div uiToolbar aria-label="Message">
      <button uiToolbarButton (click)="log('Reply')">Reply</button>
      <button uiToolbarButton disabled (click)="log('Archive')">Archive</button>
      <button
        uiToolbarButton
        disabled
        [focusableWhenDisabled]="false"
        (click)="log('Delete')"
      >
        Delete
      </button>
    </div>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
