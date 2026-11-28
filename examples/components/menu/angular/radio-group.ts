import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/angular/menu"

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuGroupLabel,
    MenuItemIndicator,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuTrigger,
  ],
  template: `
    <ng-container uiMenu>
      <button uiMenuTrigger>Panel</button>
      <div *uiMenuContent>
        <div
          uiMenuRadioGroup
          name="position"
          defaultValue="bottom"
          (beforeValueChange)="log('Panel at the ' + $event.value)"
        >
          <div uiMenuGroupLabel>Position</div>
          @for (option of ["Top", "Bottom", "Right"]; track option) {
            <div uiMenuRadioItem [value]="option.toLowerCase()">
              <span *uiMenuItemIndicator></span>
              {{ option }}
            </div>
          }
        </div>
        <div uiMenuSeparator></div>
        <div
          uiMenuRadioGroup
          defaultValue="comfortable"
          (beforeValueChange)="log($event.value + ' density')"
        >
          <div uiMenuGroupLabel>Density</div>
          @for (option of ["Compact", "Comfortable"]; track option) {
            <div uiMenuRadioItem [value]="option.toLowerCase()">
              <span *uiMenuItemIndicator></span>
              {{ option }}
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
