import { Component } from "@angular/core"
import { Dialog, DialogContent, DialogTrigger } from "@ui-sdk/angular/dialog"
import { Drawer, DrawerContent, DrawerTrigger } from "@ui-sdk/angular/drawer"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import {
  createPopoverController,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"
import {
  contentFor,
  describeChange,
  payloadOf,
  popupPayloadsFixture,
} from "../../../../../tests/fixtures/popup-payloads"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Dialog,
    DialogContent,
    DialogTrigger,
    Drawer,
    DrawerContent,
    DrawerTrigger,
    Menu,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuTrigger,
    Popover,
    PopoverContent,
    PopoverTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiMenu
        (beforeOpenChange)="opened('menu', $event)"
        (beforePayloadChange)="handed('menu', $event)"
      >
        @for (label of f.menu.triggers; track label) {
          <button uiMenuTrigger [payload]="payloadOf(label)">
            {{ label }}
          </button>
        }
        <div *uiMenuContent="let menu" class="popup">
          <div uiMenuGroup>
            <div
              uiMenuGroupLabel
              [textContent]="contentFor(menu.payload)"
            ></div>
            <div uiMenuItem class="item" value="open">{{ f.menu.item }}</div>
          </div>
        </div>
      </ng-container>
      <ng-container
        uiPopover
        [controller]="people"
        (beforeOpenChange)="opened('popover', $event)"
        (beforePayloadChange)="handed('popover', $event)"
      >
        @for (label of f.popover.triggers; track label) {
          <button uiPopoverTrigger [payload]="payloadOf(label)">
            {{ label }}
          </button>
        }
        <div *uiPopoverContent="let popover" class="popup">
          {{ contentFor(popover.payload) }}
          <button (click)="people.open({ payload: f.popover.show.payload })">
            {{ f.popover.show.label }}
          </button>
        </div>
      </ng-container>
      <ng-container
        uiDialog
        [modal]="false"
        (beforeOpenChange)="opened('dialog', $event)"
        (beforePayloadChange)="handed('dialog', $event)"
      >
        @for (label of f.dialog.triggers; track label) {
          <button uiDialogTrigger [payload]="payloadOf(label)">
            {{ label }}
          </button>
        }
        <div
          *uiDialogContent="let dialog"
          class="dialog"
          [textContent]="contentFor(dialog.payload)"
        ></div>
      </ng-container>
      <ng-container
        uiDrawer
        [modal]="false"
        (beforeOpenChange)="opened('drawer', $event)"
        (beforePayloadChange)="handed('drawer', $event)"
      >
        @for (label of f.drawer.triggers; track label) {
          <button uiDrawerTrigger [payload]="payloadOf(label)">
            {{ label }}
          </button>
        }
        <div
          *uiDrawerContent="let drawer"
          class="drawer"
          [textContent]="contentFor(drawer.payload)"
        ></div>
      </ng-container>
      <output role="status" aria-label="Last open">{{ lastOpen() }}</output>
      <output role="status" aria-label="Last payload">{{
        lastPayload()
      }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = popupPayloadsFixture
  readonly contentFor = contentFor
  readonly payloadOf = payloadOf
  readonly people = createPopoverController<string>()
  readonly lastOpen = state("")
  readonly lastPayload = state("")

  opened(name: string, change: { value: boolean; event?: Event }) {
    if (change.value) {
      this.lastOpen.set(describeChange(name, "open", change.event))
    }
  }

  handed(name: string, change: { value: unknown; event?: Event }) {
    this.lastPayload.set(
      describeChange(name, `payload ${change.value}`, change.event)
    )
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
