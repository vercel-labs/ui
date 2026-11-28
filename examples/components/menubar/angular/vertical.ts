import { Component } from "@angular/core"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/angular/menu"
import { Menubar } from "@ui-sdk/angular/menubar"

@Component({
  imports: [Menu, MenuContent, MenuItem, MenuTrigger, Menubar],
  template: `
    <div uiMenubar orientation="vertical">
      @for (label of ["Inbox", "Drafts", "Archive"]; track label) {
        <ng-container uiMenu>
          <button uiMenuTrigger>{{ label }}</button>
          <div *uiMenuContent>
            <div uiMenuItem>Open {{ label }}</div>
            <div uiMenuItem>Mark all as read</div>
          </div>
        </ng-container>
      }
    </div>
  `,
})
class Example {}

export { Example }
