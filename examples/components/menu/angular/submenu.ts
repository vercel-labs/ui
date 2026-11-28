import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/angular/menu"

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuItem,
    MenuSeparator,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
    LucideChevronRight,
  ],
  template: `
    <ng-container uiMenu (action)="log('Chose ' + $event.value)">
      <button uiMenuTrigger>Edit</button>
      <div *uiMenuContent>
        <div uiMenuItem value="undo" shortcut="mod+z">Undo</div>
        <div uiMenuItem value="redo" shortcut="mod+shift+z">Redo</div>
        <div uiMenuSeparator></div>
        <ng-container uiMenuSub>
          <div uiMenuSubTrigger>
            Find
            <svg lucideChevronRight></svg>
          </div>
          <div *uiMenuSubContent>
            <div uiMenuItem value="find" shortcut="mod+f">Find…</div>
            <div uiMenuItem value="find-next" shortcut="mod+g">Find next</div>
            <div uiMenuItem value="find-previous" shortcut="mod+shift+g">
              Find previous
            </div>
          </div>
        </ng-container>
        <ng-container uiMenuSub>
          <div uiMenuSubTrigger>
            Transform
            <svg lucideChevronRight></svg>
          </div>
          <div *uiMenuSubContent>
            <ng-container uiMenuSub>
              <div uiMenuSubTrigger>
                Case
                <svg lucideChevronRight></svg>
              </div>
              <div *uiMenuSubContent>
                <div uiMenuItem value="uppercase">Uppercase</div>
                <div uiMenuItem value="lowercase">Lowercase</div>
              </div>
            </ng-container>
            <div uiMenuItem value="trim">Trim whitespace</div>
          </div>
        </ng-container>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
