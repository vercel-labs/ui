import { Component, DestroyRef, inject } from "@angular/core"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import { onItemsChange } from "../../../../../tests/fixtures/items"
import {
  changedMenuGroups,
  menuGroups,
} from "../../../../../tests/fixtures/menu-groups"
import { mountAngular, state } from "../../angular-mount"

// Groups of items the specs reorder while the menu is open.
@Component({
  imports: [
    Menu,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiMenu>
        <button uiMenuTrigger>Actions</button>
        <div *uiMenuContent class="popup">
          @for (group of groups(); track group.label) {
            <div uiMenuGroup>
              <div uiMenuGroupLabel class="label">{{ group.label }}</div>
              @for (item of group.items; track item.value) {
                <div uiMenuItem class="item" [value]="item.value">
                  {{ item.label }}
                </div>
              }
            </div>
          }
        </div>
      </ng-container>
    </div>
  `,
})
class Fixture {
  readonly groups = state(menuGroups)

  constructor() {
    inject(DestroyRef).onDestroy(
      onItemsChange(changedMenuGroups, (groups) => this.groups.set(groups))
    )
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
