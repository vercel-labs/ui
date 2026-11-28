import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/angular/menu"
import { Toolbar, ToolbarButton } from "@ui-sdk/angular/toolbar"

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    Toolbar,
    ToolbarButton,
    LucideChevronDown,
  ],
  template: `
    <div uiToolbar aria-label="Document">
      <button uiToolbarButton (click)="log('Saved')">Save</button>
      <ng-container uiMenu (action)="log('Shared by ' + $event.value)">
        <button uiMenuTrigger uiToolbarButton>
          Share
          <svg lucideChevronDown></svg>
        </button>
        <div *uiMenuContent>
          <div uiMenuItem value="email">Email</div>
          <div uiMenuItem value="link">Copy Link</div>
        </div>
      </ng-container>
      <button uiToolbarButton (click)="log('Printed')">Print</button>
    </div>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
