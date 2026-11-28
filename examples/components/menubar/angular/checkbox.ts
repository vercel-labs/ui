import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItemIndicator,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import { Menubar } from "@ui-sdk/angular/menubar"

@Component({
  imports: [
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuItemIndicator,
    MenuTrigger,
    Menubar,
    LucideCheck,
  ],
  template: `
    <div data-slot="stack">
      <div uiMenubar>
        <ng-container uiMenu>
          <button uiMenuTrigger>View</button>
          <div *uiMenuContent>
            <div uiMenuCheckboxItem [(checked)]="statusBar" value="status-bar">
              <span *uiMenuItemIndicator>
                <svg lucideCheck></svg>
              </span>
              Status Bar
            </div>
            <div uiMenuCheckboxItem value="activity-bar" defaultChecked>
              <span *uiMenuItemIndicator>
                <svg lucideCheck></svg>
              </span>
              Activity Bar
            </div>
          </div>
        </ng-container>
        <ng-container uiMenu>
          <button uiMenuTrigger>Format</button>
          <div *uiMenuContent>
            <div uiMenuCheckboxItem value="strikethrough">
              <span *uiMenuItemIndicator>
                <svg lucideCheck></svg>
              </span>
              Strikethrough
            </div>
            <div uiMenuCheckboxItem value="code">
              <span *uiMenuItemIndicator>
                <svg lucideCheck></svg>
              </span>
              Code
            </div>
          </div>
        </ng-container>
      </div>
      <output data-slot="output"
        >Status bar {{ statusBar() ? "shown" : "hidden" }}</output
      >
    </div>
  `,
})
class Example {
  readonly statusBar = signal(true)
}

export { Example }
