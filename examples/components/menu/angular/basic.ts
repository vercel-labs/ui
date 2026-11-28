import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/angular/menu"

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuSeparator,
    MenuTrigger,
  ],
  template: `
    <ng-container uiMenu (action)="log('Chose ' + $event.value)">
      <button uiMenuTrigger>Open Menu</button>
      <div *uiMenuContent>
        <div uiMenuGroup>
          <div uiMenuGroupLabel>Project</div>
          <div uiMenuItem value="overview">Overview</div>
          <div uiMenuItem value="members">Members</div>
          <div uiMenuItem value="settings">Settings</div>
        </div>
        <div uiMenuSeparator></div>
        <div uiMenuGroup>
          <div uiMenuGroupLabel>Help</div>
          <div uiMenuItem value="docs">Documentation</div>
          <div uiMenuItem value="feedback">Send feedback</div>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
