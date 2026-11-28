import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItemIndicator,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/angular/menu"

@Component({
  imports: [
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItemIndicator,
    MenuSeparator,
    MenuTrigger,
    LucideCheck,
  ],
  template: `
    <ng-container
      uiMenu
      (checkedChange)="
        log($event.value + ' ' + ($event.checked ? 'on' : 'off'))
      "
    >
      <button uiMenuTrigger>View</button>
      <div *uiMenuContent>
        <div uiMenuGroup>
          <div uiMenuGroupLabel>Appearance</div>
          <div uiMenuCheckboxItem value="status-bar" defaultChecked>
            <span uiMenuItemIndicator keepMounted>
              <svg lucideCheck></svg>
            </span>
            Status bar
          </div>
          <div uiMenuCheckboxItem value="minimap">
            <span uiMenuItemIndicator keepMounted>
              <svg lucideCheck></svg>
            </span>
            Minimap
          </div>
        </div>
        <div uiMenuSeparator></div>
        <div uiMenuCheckboxItem value="line-numbers" defaultChecked>
          <span uiMenuItemIndicator keepMounted>
            <svg lucideCheck></svg>
          </span>
          Line numbers
        </div>
        <div uiMenuCheckboxItem value="word-wrap">
          <span uiMenuItemIndicator keepMounted>
            <svg lucideCheck></svg>
          </span>
          Word wrap
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
