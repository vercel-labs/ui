import { Component } from "@angular/core"
import {
  createMenuController,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import { menuOptions } from "../../../../../tests/fixtures/page"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuShortcut,
    MenuSub,
    MenuSubTrigger,
    MenuTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiMenu
        [controller]="controller"
        [defaultOpen]="options.defaultOpen"
        [container]="options.container"
        [modal]="options.modal"
        [presentation]="options.presentation"
        (action)="action.set($event.value)"
      >
        <button uiMenuTrigger>File</button>
        <div *uiMenuContent class="popup">
          <div uiMenuItem class="item" value="new" shortcut="mod+n">
            New file
            <span uiMenuShortcut></span>
          </div>
          <div uiMenuItem class="item" value="open" shortcut="mod+o">
            Open…
            <span uiMenuShortcut></span>
          </div>
          <div uiMenuItem class="item" value="save" disabled>Save</div>
          <div uiMenuSeparator class="separator"></div>
          <div uiMenuGroup>
            <div uiMenuGroupLabel class="label">View</div>
            <div uiMenuCheckboxItem class="item" value="sidebar" defaultChecked>
              Show sidebar
            </div>
            <div uiMenuCheckboxItem class="item" value="statusbar">
              Show status bar
            </div>
          </div>
          <div uiMenuSeparator class="separator"></div>
          <div uiMenuRadioGroup defaultValue="name">
            <div uiMenuGroupLabel class="label">Sort by</div>
            <div uiMenuRadioItem class="item" value="name">Name</div>
            <div uiMenuRadioItem class="item" value="date">Date</div>
            <div uiMenuRadioItem class="item" value="size">Size</div>
          </div>
          <div uiMenuSeparator class="separator"></div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger class="item">Share</div>
            <div *uiMenuSubContent class="popup">
              <div uiMenuItem class="item" value="email">Email</div>
              <div uiMenuItem class="item" value="link">Copy link</div>
              <ng-container uiMenuSub>
                <div uiMenuSubTrigger class="item">More</div>
                <div *uiMenuSubContent class="popup">
                  <div uiMenuItem class="item" value="embed">Embed</div>
                </div>
              </ng-container>
            </div>
          </ng-container>
          <div uiMenuItem class="item" value="delete">Delete</div>
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
