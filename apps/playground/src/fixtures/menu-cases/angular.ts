import { Component } from "@angular/core"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  type MenuItemSelect,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Menu,
    MenuCheckboxItem,
    MenuContent,
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
      <ng-container uiMenu (action)="action.set($event.value)">
        <button uiMenuTrigger>Edit</button>
        <div *uiMenuContent class="popup">
          <div uiMenuItem class="item" value="pin" (select)="onPin($event)">
            Pin
          </div>
          <div uiMenuItem class="item" value="zoom" [closeOnSelect]="false">
            Zoom in
          </div>
          <div uiMenuItem class="item" value="erase" shortcut="mod+backspace">
            Erase
            <span uiMenuShortcut></span>
          </div>
          <div uiMenuItem class="item" value="window" shortcut="alt+n">
            New window
            <span uiMenuShortcut></span>
          </div>
          <div uiMenuSeparator class="separator"></div>
          <div uiMenuCheckboxItem class="item" value="autosave" closeOnSelect>
            Autosave
          </div>
          <div uiMenuCheckboxItem class="item" value="pinned" checked>
            Pinned
          </div>
          <div
            uiMenuRadioGroup
            [value]="align()"
            (valueChange)="align.set($event)"
          >
            <div uiMenuGroupLabel class="label">Align</div>
            <div uiMenuRadioItem class="item" value="left">Left</div>
            <div uiMenuRadioItem class="item" value="right">Right</div>
          </div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger class="item" disabled>Share</div>
            <div *uiMenuSubContent class="popup">
              <div uiMenuItem class="item" value="email">Email</div>
            </div>
          </ng-container>
          <ng-container uiMenuSub [loop]="false">
            <div uiMenuSubTrigger class="item">More</div>
            <div *uiMenuSubContent class="popup">
              <div uiMenuItem class="item" value="first">First</div>
              <div uiMenuItem class="item" value="last">Last</div>
            </div>
          </ng-container>
        </div>
      </ng-container>
      <ng-container uiMenu>
        <button uiMenuTrigger>Offsets</button>
        <div
          *uiMenuContent="{
            sideOffset: 8,
            alignOffset: -4,
            collisionPadding: 24,
          }"
          class="popup"
        >
          <div uiMenuItem class="item" value="one">One</div>
          <div uiMenuItem class="item" value="two">Two</div>
        </div>
      </ng-container>
      <ng-container uiMenu [open]="open()" (openChange)="open.set($event)">
        <button uiMenuTrigger>Controlled</button>
        <div *uiMenuContent class="popup">
          <div uiMenuItem class="item" value="done" (select)="onDone($event)">
            Done
          </div>
          <div uiMenuItem class="item" value="later">Later</div>
        </div>
      </ng-container>
      <button (click)="align.set('right')">Align right</button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Selections">{{ selections() }}</output>
    </div>
  `,
})
class Fixture {
  readonly action = state("")
  readonly selections = state(0)
  readonly align = state("left")
  readonly open = state(false)

  constructor() {
    const target = window as unknown as { __closeControlled: () => void }
    target.__closeControlled = () => this.open.set(false)
  }

  onPin(selection: MenuItemSelect) {
    selection.event.preventDefault()
    this.selections.set(this.selections() + 1)
  }

  onDone(selection: MenuItemSelect) {
    selection.event.preventDefault()
    this.open.set(false)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
