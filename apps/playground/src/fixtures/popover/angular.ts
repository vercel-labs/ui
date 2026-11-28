import { Component } from "@angular/core"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/angular/menu"
import {
  createPopoverController,
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverShortcut,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"
import {
  popoverContentOptions,
  popoverFixture,
  popoverOptions,
  popoverParts,
  recordPopover,
} from "../../../../../tests/fixtures/popover"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    Popover,
    PopoverArrow,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverShortcut,
    PopoverTitle,
    PopoverTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiPopover
        [controller]="controller"
        [defaultOpen]="options.defaultOpen"
        [modal]="options.modal"
        [openOnHover]="options.openOnHover"
        [delay]="options.delay"
        [closeDelay]="options.closeDelay"
        [container]="options.container"
        [dismissible]="options.dismissible"
        [presentation]="options.presentation"
        (dismissAttempt)="record('attempt:' + $event.reason)"
      >
        @if (triggerShown()) {
          <button
            uiPopoverTrigger
            [shortcut]="parts.shortcut ? f.shortcut.trigger : undefined"
          >
            {{ f.trigger }}
            @if (parts.shortcut) {
              <kbd uiPopoverShortcut></kbd>
            }
          </button>
        }
        <div *uiPopoverContent="content" class="popup">
          <div uiPopoverArrow class="arrow"></div>
          @if (parts.title) {
            <h2 uiPopoverTitle class="title">{{ f.title }}</h2>
          }
          <p uiPopoverDescription class="description">{{ f.description }}</p>
          <label class="field">
            {{ f.field }}
            <input [defaultValue]="f.defaultValue" />
          </label>
          <div class="actions">
            <button (click)="action.set('save')">
              {{ f.action }}
              @if (parts.shortcut) {
                <kbd uiPopoverShortcut [shortcut]="f.shortcut.save"></kbd>
              }
            </button>
            <button uiPopoverClose>{{ f.close }}</button>
            @if (parts.removable) {
              <button (click)="triggerShown.set(false)">{{ f.remove }}</button>
            }
          </div>
          @if (parts.menu) {
            <ng-container
              uiMenu
              [container]="options.container"
              (action)="action.set($event.value)"
            >
              <button uiMenuTrigger>{{ f.menu.trigger }}</button>
              <div *uiMenuContent class="popup">
                @for (item of f.menu.items; track item.value) {
                  <div uiMenuItem class="item" [value]="item.value">
                    {{ item.label }}
                  </div>
                }
              </div>
            </ng-container>
          }
          @if (parts.nested) {
            <ng-container uiPopover>
              <button uiPopoverTrigger>{{ f.nested.trigger }}</button>
              <div *uiPopoverContent class="popup">
                <h2 uiPopoverTitle class="title">{{ f.nested.title }}</h2>
                <button (click)="action.set('archive')">
                  {{ f.nested.action }}
                </button>
              </div>
            </ng-container>
          }
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.open()">Open with controller</button>
      @if (parts.shortcut) {
        <button
          uiPopoverTrigger
          [controller]="controller"
          [shortcut]="f.shortcut.remote.keys"
        >
          {{ f.shortcut.remote.trigger }}
          <kbd uiPopoverShortcut></kbd>
        </button>
      }
    </div>
  `,
})
class Fixture {
  readonly f = popoverFixture
  readonly controller = createPopoverController()
  readonly parts = popoverParts()
  readonly options: {
    defaultOpen?: boolean
    modal?: boolean | "trap-focus"
    openOnHover?: boolean
    delay?: number
    closeDelay?: number
    container?: HTMLElement | null
    dismissible?: boolean
    presentation?: "auto" | "sheet"
  } = popoverOptions()
  readonly content = { sideOffset: 8, ...popoverContentOptions() }
  readonly record = recordPopover
  readonly action = state("")
  readonly triggerShown = state(true)
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
