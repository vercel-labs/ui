import { Component } from "@angular/core"
import {
  LucideCircleHelp,
  LucideFile,
  LucideFolder,
  LucideRedo,
  LucideSave,
  LucideSettings,
  LucideTrash,
  LucideUndo,
} from "@lucide/angular"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import { Menubar } from "@ui-sdk/angular/menubar"

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuItem,
    MenuItemIcon,
    MenuSeparator,
    MenuTrigger,
    Menubar,
    LucideCircleHelp,
    LucideFile,
    LucideFolder,
    LucideRedo,
    LucideSave,
    LucideSettings,
    LucideTrash,
    LucideUndo,
  ],
  template: `
    <div uiMenubar>
      <ng-container uiMenu>
        <button uiMenuTrigger>File</button>
        <div *uiMenuContent>
          <div uiMenuItem>
            <span uiMenuItemIcon>
              <svg lucideFile></svg>
            </span>
            New File
          </div>
          <div uiMenuItem>
            <span uiMenuItemIcon>
              <svg lucideFolder></svg>
            </span>
            Open Folder
          </div>
          <div uiMenuItem>
            <span uiMenuItemIcon>
              <svg lucideSave></svg>
            </span>
            Save
          </div>
        </div>
      </ng-container>
      <ng-container uiMenu>
        <button uiMenuTrigger>Edit</button>
        <div *uiMenuContent>
          <div uiMenuItem>
            <span uiMenuItemIcon mirror>
              <svg lucideUndo></svg>
            </span>
            Undo
          </div>
          <div uiMenuItem>
            <span uiMenuItemIcon mirror>
              <svg lucideRedo></svg>
            </span>
            Redo
          </div>
        </div>
      </ng-container>
      <ng-container uiMenu>
        <button uiMenuTrigger>More</button>
        <div *uiMenuContent>
          <div uiMenuItem>
            <span uiMenuItemIcon>
              <svg lucideSettings></svg>
            </span>
            Settings
          </div>
          <div uiMenuItem>
            <span uiMenuItemIcon>
              <svg lucideCircleHelp></svg>
            </span>
            Help
          </div>
          <div uiMenuSeparator></div>
          <div uiMenuItem destructive>
            <span uiMenuItemIcon>
              <svg lucideTrash></svg>
            </span>
            Delete
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
