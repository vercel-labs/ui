import { Component, input } from "@angular/core"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteItemIcon,
  AutocompleteItemText,
  AutocompleteLabel,
  AutocompleteList,
} from "@ui-sdk/angular/autocomplete"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIcon,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  ComboboxValueIcon,
} from "@ui-sdk/angular/combobox"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandItemText,
  CommandList,
} from "@ui-sdk/angular/command"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuLinkIcon,
  NavigationMenuList,
} from "@ui-sdk/angular/navigation-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIcon,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectValueIcon,
} from "@ui-sdk/angular/select"
import { Tabs, TabsList, TabsTab, TabsTabIcon } from "@ui-sdk/angular/tabs"
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/angular/toggle"
import {
  type IconName,
  icons,
  iconsFixture,
  iconsOptions,
} from "../../../../../tests/fixtures/item-icons"
import { mountAngular, state } from "../../angular-mount"

// What an entry's icon part holds: its SVG or its emoji.
@Component({
  selector: "[fixtureGlyph]",
  template: `
    @if (entry().icon; as name) {
      <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
      >
        <title>{{ icons[name].title }}</title>
        <path [attr.d]="icons[name].path" />
      </svg>
    } @else {
      {{ entry().emoji }}
    }
  `,
})
class Glyph {
  readonly entry = input.required<{ icon?: IconName; emoji?: string }>({
    alias: "fixtureGlyph",
  })
  readonly icons = icons
}

@Component({
  imports: [
    Autocomplete,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteItemIcon,
    AutocompleteItemText,
    AutocompleteLabel,
    AutocompleteList,
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIcon,
    ComboboxItemText,
    ComboboxLabel,
    ComboboxList,
    ComboboxValueIcon,
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandItemIcon,
    CommandItemText,
    CommandList,
    Glyph,
    Menu,
    MenuContent,
    MenuItem,
    MenuItemIcon,
    MenuTrigger,
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuLinkIcon,
    NavigationMenuList,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIcon,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectValueIcon,
    Tabs,
    TabsList,
    TabsTab,
    TabsTabIcon,
    Toggle,
    ToggleGroup,
    ToggleIcon,
  ],
  template: `
    <div class="fixture icons-fixture">
      <button>Before</button>

      <ng-container uiMenu (action)="action.set('menu:' + $event.value)">
        <button uiMenuTrigger class="trigger">{{ f.menu.trigger }}</button>
        <div *uiMenuContent class="popup">
          @for (item of f.menu.items; track item.value) {
            <div uiMenuItem [value]="item.value">
              @if (item.icon || item.emoji) {
                <span
                  uiMenuItemIcon
                  [mirror]="item.mirror"
                  [fixtureGlyph]="item"
                ></span>
              }
              {{ item.label }}
            </div>
          }
          <div
            uiMenuItem
            [value]="f.menu.iconOnly.value"
            [attr.aria-label]="f.menu.iconOnly.label"
          >
            <span uiMenuItemIcon [fixtureGlyph]="f.menu.iconOnly"></span>
          </div>
          @if (options.unnamed) {
            <div uiMenuItem [value]="f.unnamed.value">
              <span uiMenuItemIcon [fixtureGlyph]="f.unnamed"></span>
            </div>
          }
        </div>
      </ng-container>

      <ng-container
        uiSelect
        [placeholder]="f.select.placeholder"
        [defaultValue]="options.select"
        (valueChange)="action.set('select:' + $event)"
      >
        <div uiSelectLabel class="label">{{ f.select.label }}</div>
        <button uiSelectTrigger class="trigger">
          <span *uiSelectValueIcon class="value-icon"></span>
          <span uiSelectValue class="value"></span>
        </button>
        <div *uiSelectContent class="popup list-popup">
          @for (item of f.select.items; track item.value) {
            <div uiSelectItem class="item" [value]="item.value">
              @if (item.icon || item.emoji) {
                <span uiSelectItemIcon [fixtureGlyph]="item"></span>
              }
              {{ item.label }}
            </div>
          }
        </div>
      </ng-container>

      <ng-container
        uiCombobox
        [defaultValue]="options.combobox"
        (valueChange)="action.set('combobox:' + $event)"
      >
        <label uiComboboxLabel class="label">{{ f.combobox.label }}</label>
        <span *uiComboboxValueIcon class="value-icon"></span>
        <input uiComboboxInput class="input" />
        <div *uiComboboxContent class="popup list-popup">
          <div uiComboboxList>
            @for (item of f.combobox.items; track item.value) {
              <div uiComboboxItem class="item" [value]="item.value">
                @if (item.icon || item.emoji) {
                  <span uiComboboxItemIcon [fixtureGlyph]="item"></span>
                }
                <span uiComboboxItemText>{{ item.label }}</span>
              </div>
            }
          </div>
        </div>
      </ng-container>

      <ng-container uiAutocomplete>
        <label uiAutocompleteLabel class="label">{{
          f.autocomplete.label
        }}</label>
        <input uiAutocompleteInput class="input" />
        <div *uiAutocompleteContent class="popup list-popup">
          <div uiAutocompleteEmpty class="empty">No results</div>
          <div uiAutocompleteList>
            @for (item of f.autocomplete.items; track item.value) {
              <div uiAutocompleteItem class="item" [value]="item.label">
                <span uiAutocompleteItemIcon [fixtureGlyph]="item"></span>
                <span uiAutocompleteItemText>{{ item.label }}</span>
              </div>
            }
          </div>
        </div>
      </ng-container>

      <div
        uiCommand
        class="command"
        (action)="action.set('command:' + $event.value)"
      >
        <input
          uiCommandInput
          class="input"
          [attr.aria-label]="f.command.label"
        />
        <div uiCommandEmpty class="empty">No results</div>
        <div uiCommandList class="command-list">
          @for (item of f.command.items; track item.value) {
            <div uiCommandItem class="item" [value]="item.value">
              @if (item.icon || item.emoji) {
                <span uiCommandItemIcon [fixtureGlyph]="item"></span>
              }
              <span uiCommandItemText>{{ item.label }}</span>
            </div>
          }
        </div>
      </div>

      <div uiTabs class="tabs">
        <div uiTabsList class="tablist" [attr.aria-label]="f.tabs.label">
          @for (tab of f.tabs.tabs; track tab.value) {
            <button uiTabsTab class="tab" [value]="tab.value">
              <span uiTabsTabIcon [fixtureGlyph]="tab"></span>
              {{ tab.label }}
            </button>
          }
          <button
            uiTabsTab
            class="tab"
            [value]="f.tabs.iconOnly.value"
            [attr.aria-label]="f.tabs.iconOnly.label"
          >
            <span uiTabsTabIcon [fixtureGlyph]="f.tabs.iconOnly"></span>
          </button>
        </div>
      </div>

      <div
        uiToggleGroup
        class="toggle-group"
        [attr.aria-label]="f.toggles.label"
      >
        <button uiToggle class="toggle" [value]="f.toggles.bold.value">
          <span uiToggleIcon [fixtureGlyph]="f.toggles.bold"></span>
          {{ f.toggles.bold.label }}
        </button>
        <button
          uiToggle
          class="toggle"
          [value]="f.toggles.iconOnly.value"
          [attr.aria-label]="f.toggles.iconOnly.label"
        >
          <span uiToggleIcon [fixtureGlyph]="f.toggles.iconOnly"></span>
        </button>
      </div>

      <nav
        uiNavigationMenu
        class="nav-menu"
        [attr.aria-label]="f.navigation.label"
      >
        <ul uiNavigationMenuList class="nav-list">
          @for (link of f.navigation.links; track link.value) {
            <li uiNavigationMenuItem [value]="link.value">
              <a
                uiNavigationMenuLink
                class="nav-link"
                [href]="'#' + link.value"
              >
                <span
                  uiNavigationMenuLinkIcon
                  [mirror]="link.mirror"
                  [fixtureGlyph]="link"
                ></span>
                {{ link.label }}
              </a>
            </li>
          }
        </ul>
      </nav>

      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = iconsFixture
  readonly options = iconsOptions()
  readonly action = state("")
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, Glyph, mount }
