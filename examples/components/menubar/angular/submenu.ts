import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import { Menubar } from "@ui-sdk/angular/menubar"

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuItem,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
    Menubar,
    LucideChevronRight,
  ],
  template: `
    <div uiMenubar>
      <ng-container uiMenu>
        <button uiMenuTrigger>File</button>
        <div *uiMenuContent>
          <div uiMenuItem>New File</div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger>
              Share
              <svg lucideChevronRight></svg>
            </div>
            <div *uiMenuSubContent>
              <div uiMenuItem>Email link</div>
              <div uiMenuItem>Messages</div>
            </div>
          </ng-container>
        </div>
      </ng-container>
      <ng-container uiMenu>
        <button uiMenuTrigger>Edit</button>
        <div *uiMenuContent>
          <div uiMenuItem>Undo</div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger>
              Find
              <svg lucideChevronRight></svg>
            </div>
            <div *uiMenuSubContent>
              <div uiMenuItem>Find…</div>
              <div uiMenuItem>Find Next</div>
            </div>
          </ng-container>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
