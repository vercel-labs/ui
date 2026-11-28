import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/angular/menu"

@Component({
  imports: [Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger],
  template: `
    <ng-container uiMenu (action)="log('Chose ' + $event.value)">
      <button uiMenuTrigger>File</button>
      <div *uiMenuContent>
        <div uiMenuItem value="new-tab" shortcut="mod+t">New tab</div>
        <div uiMenuItem value="new-window" shortcut="mod+n">New window</div>
        <div uiMenuItem value="open" shortcut="mod+o">Open…</div>
        <div uiMenuSeparator></div>
        <div uiMenuItem value="save" shortcut="mod+s">Save</div>
        <div uiMenuItem value="save-as" shortcut="mod+shift+s">Save as…</div>
        <div uiMenuSeparator></div>
        <div uiMenuItem value="print" shortcut="mod+p">Print…</div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
