import { afterNextRender, Component } from "@angular/core"
import {
  Menu,
  MenuCheckboxItem,
  type MenuCheckedChange,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import { createMenubarController, Menubar } from "@ui-sdk/angular/menubar"
import {
  menubarFixture,
  menubarOptions,
} from "../../../../../tests/fixtures/menubar"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuItem,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuShortcut,
    MenuSub,
    MenuSubTrigger,
    MenuTrigger,
    Menubar,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiMenubar
        class="menubar"
        [attr.aria-label]="f.label"
        [controller]="controller"
        [orientation]="options.orientation"
        [loop]="options.loop"
        [disabled]="options.disabled"
        [modal]="options.modal"
      >
        <ng-container uiMenu (action)="action.set($event.value)">
          <button uiMenuTrigger>{{ f.file.trigger }}</button>
          <div *uiMenuContent class="popup">
            @for (item of f.file.items; track item.value) {
              <div
                uiMenuItem
                class="item"
                [value]="item.value"
                [shortcut]="item.shortcut"
              >
                {{ item.label }}
                @if (item.shortcut) {
                  <span uiMenuShortcut></span>
                }
              </div>
            }
            <ng-container uiMenuSub>
              <div uiMenuSubTrigger class="item">
                {{ f.file.share.trigger }}
              </div>
              <div *uiMenuSubContent class="popup">
                @for (item of f.file.share.items; track item.value) {
                  <div uiMenuItem class="item" [value]="item.value">
                    {{ item.label }}
                  </div>
                }
              </div>
            </ng-container>
            <div uiMenuSeparator class="separator"></div>
            <div uiMenuItem class="item" [value]="f.file.print.value">
              {{ f.file.print.label }}
            </div>
          </div>
        </ng-container>
        <ng-container uiMenu (action)="action.set($event.value)">
          <button uiMenuTrigger>{{ f.edit.trigger }}</button>
          <div *uiMenuContent class="popup">
            @for (item of f.edit.items; track item.value) {
              <div
                uiMenuItem
                class="item"
                [value]="item.value"
                [disabled]="item.disabled"
              >
                {{ item.label }}
              </div>
            }
          </div>
        </ng-container>
        <ng-container uiMenu (checkedChange)="onCheckedChange($event)">
          <button uiMenuTrigger [shortcut]="f.view.shortcut">
            {{ f.view.trigger }}
          </button>
          <div *uiMenuContent class="popup">
            @for (item of f.view.checkboxes; track item.value) {
              <div
                uiMenuCheckboxItem
                class="item"
                [value]="item.value"
                [defaultChecked]="item.defaultChecked"
              >
                {{ item.label }}
              </div>
            }
          </div>
        </ng-container>
        <ng-container uiMenu>
          <button uiMenuTrigger>{{ f.profiles.trigger }}</button>
          <div *uiMenuContent class="popup">
            <div
              uiMenuRadioGroup
              [defaultValue]="f.profiles.defaultValue"
              (valueChange)="action.set('profile: ' + $event)"
            >
              @for (item of f.profiles.items; track item.value) {
                <div uiMenuRadioItem class="item" [value]="item.value">
                  {{ item.label }}
                </div>
              }
            </div>
          </div>
        </ng-container>
        <ng-container uiMenu (action)="action.set($event.value)">
          <button uiMenuTrigger disabled>{{ f.help.trigger }}</button>
          <div *uiMenuContent class="popup">
            @for (item of f.help.items; track item.value) {
              <div uiMenuItem class="item" [value]="item.value">
                {{ item.label }}
              </div>
            }
          </div>
        </ng-container>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f: {
    [Key in keyof typeof menubarFixture]: (typeof menubarFixture)[Key]
  } & {
    file: { items: { value: string; label: string; shortcut?: string }[] }
    edit: { items: { value: string; label: string; disabled?: boolean }[] }
    view: {
      checkboxes: { value: string; label: string; defaultChecked?: boolean }[]
    }
  } = menubarFixture
  readonly controller = createMenubarController()
  readonly options: {
    orientation?: "horizontal" | "vertical"
    loop?: boolean
    disabled?: boolean
    modal?: boolean | "pointer"
  } = menubarOptions()
  readonly action = state("")

  constructor() {
    // In the browser only: the server has no window.
    afterNextRender(() => Object.assign(window, { __menubar: this.controller }))
  }

  onCheckedChange({ value, checked }: MenuCheckedChange) {
    this.action.set(`${value}: ${checked ? "on" : "off"}`)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
