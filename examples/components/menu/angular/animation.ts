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
    <ng-container
      uiMenu
      (beforeOpenChange)="log($event.value ? 'Opening' : 'Closing')"
      (openChangeComplete)="
        log($event ? 'Finished opening' : 'Finished closing')
      "
    >
      <button uiMenuTrigger>Animated</button>
      <div *uiMenuContent="{ keepMounted: true }">
        <div uiMenuItem>Back</div>
        <div uiMenuItem>Forward</div>
        <div uiMenuItem>Reload</div>
        <div uiMenuSeparator></div>
        <ng-container uiMenuSub>
          <div uiMenuSubTrigger>
            More tools
            <svg lucideChevronRight></svg>
          </div>
          <div *uiMenuSubContent>
            <div uiMenuItem>Save page as…</div>
            <div uiMenuItem>Developer tools</div>
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
