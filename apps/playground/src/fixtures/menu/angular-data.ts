import { Component } from "@angular/core"
import {
  createMenuController,
  Menu,
  MenuContent,
  MenuItems,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import { menuOptions } from "../../../../../tests/fixtures/page"
import { mountAngular, state } from "../../angular-mount"
import { menuData } from "./data"

@Component({
  imports: [Menu, MenuContent, MenuItems, MenuTrigger],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiMenu
        [items]="items"
        [controller]="controller"
        [defaultOpen]="options.defaultOpen"
        [container]="options.container"
        [modal]="options.modal"
        [presentation]="options.presentation"
        (action)="action.set($event.value)"
      >
        <button uiMenuTrigger>File</button>
        <div *uiMenuContent>
          <div uiMenuItems></div>
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.open({ focus: 'first' })">
        Open with controller
      </button>
    </div>
  `,
})
class Fixture {
  readonly items = menuData
  readonly controller = createMenuController()
  readonly options: {
    defaultOpen?: boolean
    container?: HTMLElement | null
    modal?: boolean | "pointer"
    presentation?: "auto" | "popover" | "sheet"
  } = menuOptions()
  readonly action = state("")
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
