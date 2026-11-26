import { Component } from "@angular/core"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/angular/menu"
import { NumberInput, NumberInputControl } from "@ui-sdk/angular/number-input"
import { Toggle, ToggleGroup } from "@ui-sdk/angular/toggle"
import {
  createToolbarController,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
} from "@ui-sdk/angular/toolbar"
import {
  toolbarFixture,
  toolbarLocked,
  toolbarOptions,
  toolbarRenderedToggle,
} from "../../../../../tests/fixtures/toolbar"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    NumberInput,
    NumberInputControl,
    Toggle,
    ToggleGroup,
    Toolbar,
    ToolbarButton,
    ToolbarGroup,
    ToolbarInput,
    ToolbarLink,
    ToolbarSeparator,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiToolbar
        class="toolbar"
        [attr.aria-label]="f.label"
        [controller]="controller"
        [orientation]="options.orientation"
        [loop]="options.loop"
        [disabled]="options.disabled"
      >
        @if (lockable) {
          <div uiToolbarGroup aria-label="Locked style" [disabled]="locked()">
            <div
              uiToggleGroup
              class="toggle-group"
              [attr.aria-label]="f.style.label"
              multiple
              [defaultValue]="f.style.defaultValue"
              (beforeValueChange)="changed(f.style.label, $event.value)"
            >
              @for (item of f.style.items; track item.value) {
                <button
                  uiToggle
                  class="toggle"
                  [value]="item.value"
                  [disabled]="item.disabled"
                >
                  {{ item.label }}
                </button>
              }
            </div>
          </div>
        } @else {
          <div
            uiToggleGroup
            class="toggle-group"
            [attr.aria-label]="f.style.label"
            multiple
            [defaultValue]="f.style.defaultValue"
            (beforeValueChange)="changed(f.style.label, $event.value)"
          >
            @for (item of f.style.items; track item.value) {
              <button
                uiToggle
                class="toggle"
                [value]="item.value"
                [disabled]="item.disabled"
              >
                {{ item.label }}
              </button>
            }
          </div>
        }
        <div uiToolbarSeparator></div>
        <div
          uiToggleGroup
          class="toggle-group"
          [attr.aria-label]="f.alignment.label"
          [defaultValue]="f.alignment.defaultValue"
          (beforeValueChange)="changed(f.alignment.label, $event.value)"
        >
          @for (item of f.alignment.items; track item.value) {
            <button uiToggle class="toggle" [value]="item.value">
              {{ item.label }}
            </button>
          }
        </div>
        <div uiToolbarSeparator></div>
        <ng-container uiMenu (action)="action.set('font: ' + $event.value)">
          <button uiMenuTrigger uiToolbarButton>{{ f.font.trigger }}</button>
          <div *uiMenuContent class="popup">
            @for (item of f.font.items; track item) {
              <div uiMenuItem class="item" [value]="item">{{ item }}</div>
            }
          </div>
        </ng-container>
        <div
          uiNumberInput
          [defaultValue]="f.size.defaultValue"
          (beforeValueChange)="action.set('size: ' + $event.value)"
        >
          <input
            uiNumberInputControl
            uiToolbarInput
            [attr.aria-label]="f.size.label"
          />
        </div>
        <input
          uiToolbarInput
          [attr.aria-label]="f.comment.label"
          [defaultValue]="f.comment.defaultValue"
        />
        <div
          uiToolbarGroup
          class="toolbar-group"
          [attr.aria-label]="f.history.label"
          [disabled]="lockable && locked()"
        >
          @for (item of f.history.items; track item.label) {
            <button
              uiToolbarButton
              [disabled]="item.disabled"
              (click)="action.set(item.label.toLowerCase())"
            >
              {{ item.label }}
            </button>
          }
        </div>
        @if (lockable) {
          <div
            uiToolbarGroup
            aria-label="Locked proofing"
            [disabled]="locked()"
          >
            @if (renderedToggle) {
              <button
                uiToolbarButton
                uiToggle
                class="toggle"
                (beforePressedChange)="spellcheck($event.value)"
              >
                {{ f.spellcheck.label }}
              </button>
            } @else {
              <button
                uiToggle
                class="toggle"
                (beforePressedChange)="spellcheck($event.value)"
              >
                {{ f.spellcheck.label }}
              </button>
            }
          </div>
          <div uiToolbarGroup aria-label="Locked help" [disabled]="locked()">
            <a uiToolbarLink [href]="f.help.href">{{ f.help.label }}</a>
          </div>
        } @else {
          @if (renderedToggle) {
            <button
              uiToolbarButton
              uiToggle
              class="toggle"
              (beforePressedChange)="spellcheck($event.value)"
            >
              {{ f.spellcheck.label }}
            </button>
          } @else {
            <button
              uiToggle
              class="toggle"
              (beforePressedChange)="spellcheck($event.value)"
            >
              {{ f.spellcheck.label }}
            </button>
          }
          <a uiToolbarLink [href]="f.help.href">{{ f.help.label }}</a>
        }
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.focus()">Focus toolbar</button>
      <button (click)="locked.set(false)">Unlock</button>
    </div>
  `,
})
class Fixture {
  readonly f = toolbarFixture
  readonly controller = createToolbarController()
  readonly options: ReturnType<typeof toolbarOptions> & {
    orientation?: "horizontal" | "vertical"
    loop?: boolean
    disabled?: boolean
  } = toolbarOptions()
  readonly lockable = toolbarLocked()
  readonly renderedToggle = toolbarRenderedToggle()
  readonly locked = state(this.lockable)
  readonly action = state("")

  changed(label: string, value: string[]) {
    this.action.set(`${label}: ${value.join(", ") || "none"}`)
  }

  spellcheck(pressed: boolean) {
    this.action.set(`spellcheck: ${pressed ? "on" : "off"}`)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
