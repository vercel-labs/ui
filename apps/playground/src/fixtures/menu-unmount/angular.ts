import { Component } from "@angular/core"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/angular/menu"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [Menu, MenuContent, MenuItem, MenuTrigger],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiMenu [open]="open()" (openChange)="open.set($event)">
        <button uiMenuTrigger>Actions</button>
        @if (open()) {
          <div uiMenuContent class="popup fill-in">
            <div uiMenuItem class="item" value="rename">Rename</div>
            <div uiMenuItem class="item" value="delete">Delete</div>
          </div>
        }
      </ng-container>
    </div>
  `,
})
class Fixture {
  readonly open = state(false)
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
