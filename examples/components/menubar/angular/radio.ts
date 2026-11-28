import { Component, signal } from "@angular/core"
import {
  Menu,
  MenuContent,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import { Menubar } from "@ui-sdk/angular/menubar"

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuItemIndicator,
    MenuRadioGroup,
    MenuRadioItem,
    MenuTrigger,
    Menubar,
  ],
  template: `
    <div data-slot="stack">
      <div uiMenubar>
        <ng-container uiMenu>
          <button uiMenuTrigger>Profiles</button>
          <div *uiMenuContent>
            <div uiMenuRadioGroup defaultValue="ines">
              @for (profile of profiles; track profile.value) {
                <div uiMenuRadioItem [value]="profile.value">
                  <span *uiMenuItemIndicator></span>
                  {{ profile.label }}
                </div>
              }
            </div>
          </div>
        </ng-container>
        <ng-container uiMenu>
          <button uiMenuTrigger>Theme</button>
          <div *uiMenuContent>
            <div uiMenuRadioGroup [(value)]="theme">
              @for (option of themes; track option.value) {
                <div uiMenuRadioItem [value]="option.value">
                  <span *uiMenuItemIndicator></span>
                  {{ option.label }}
                </div>
              }
            </div>
          </div>
        </ng-container>
      </div>
      <output data-slot="output">Theme: {{ theme() }}</output>
    </div>
  `,
})
class Example {
  readonly profiles = [
    { value: "hollis", label: "Hollis" },
    { value: "ines", label: "Inès" },
    { value: "kofi", label: "Kofi" },
  ]

  readonly themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ]

  readonly theme = signal("system")
}

export { Example }
