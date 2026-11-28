import { Component } from "@angular/core"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [Menu, MenuCheckboxItem, MenuContent, MenuItem, MenuTrigger],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiMenu (action)="action.set($event.value)">
        <button uiMenuTrigger>File</button>
        <div *uiMenuContent class="popup">
          <a uiMenuItem class="item" value="docs" href="#docs">Docs</a>
          <div
            uiMenuItem
            #watched="uiMenuItem"
            class="item"
            value="watched"
            [textContent]="
              (watched.state().highlighted ? '→ ' : '') + 'Watched'
            "
          ></div>
          <div uiMenuItem class="item" value="plain">Plain</div>
          <div
            uiMenuCheckboxItem
            #pinned="uiMenuCheckboxItem"
            class="item"
            value="pinned"
            [class.is-checked]="pinned.state().checked"
            [class.is-unchecked]="!pinned.state().checked"
          >
            Pinned
          </div>
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly action = state("")
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
