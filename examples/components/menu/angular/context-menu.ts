import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Menu,
  MenuContent,
  MenuContextTrigger,
  MenuItem,
  MenuSeparator,
} from "@ui-sdk/angular/menu"

@Component({
  imports: [Menu, MenuContent, MenuContextTrigger, MenuItem, MenuSeparator],
  template: `
    <ng-container uiMenu (action)="log('Chose ' + $event.value)">
      <div uiMenuContextTrigger [tabindex]="0">
        Right-click or long-press here
      </div>
      <div *uiMenuContent>
        <div uiMenuItem value="back">Back</div>
        <div uiMenuItem value="forward" disabled>Forward</div>
        <div uiMenuItem value="reload">Reload</div>
        <div uiMenuSeparator></div>
        <div uiMenuItem value="save">Save page as…</div>
        <div uiMenuItem value="print">Print…</div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
