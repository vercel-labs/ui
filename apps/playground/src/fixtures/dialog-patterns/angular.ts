import { Component, viewChild, type ElementRef } from "@angular/core"
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  type AlertDialogOpenChange,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui-sdk/angular/alert-dialog"
import {
  createDialogController,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  type DialogOpenChange,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/angular/menu"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"
import { useShortcut } from "@ui-sdk/angular/shortcuts"
import { dialogPatternsFixture } from "../../../../../tests/fixtures/dialog"
import { mountAngular, state } from "../../angular-mount"
import { pendingAction, recordOpenChange } from "./shared"

@Component({
  imports: [
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogShortcut,
    DialogTitle,
    DialogTrigger,
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    Popover,
    PopoverContent,
    PopoverTitle,
    PopoverTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiMenu>
        <button
          uiMenuTrigger
          [shortcut]="f.menu.shortcut"
          [textContent]="f.menu.trigger"
        ></button>
        <div *uiMenuContent class="menu">
          <div uiMenuItem value="rename" (select)="rename.open()">
            {{ f.menu.rename }}
          </div>
          <div uiMenuItem value="close">{{ f.menu.close }}</div>
        </div>
      </ng-container>
      <ng-container
        uiDialog
        [controller]="rename"
        [dismissible]="!dirty()"
        [persistentElements]="['#chat']"
        (dismissAttempt)="action.set('attempt:' + $event.reason)"
        (beforeOpenChange)="onRenameChange($event)"
      >
        <button uiDialogTrigger [shortcut]="f.rename.shortcut">
          {{ f.rename.trigger }} <kbd uiDialogShortcut class="shortcut"></kbd>
        </button>
        <div *uiDialogBackdrop class="dialog-backdrop"></div>
        <div *uiDialogContent class="dialog">
          <h2 uiDialogTitle class="title">{{ f.rename.title }}</h2>
          <label class="field">
            {{ f.rename.field }}
            <input
              #field
              [value]="f.rename.defaultValue"
              (input)="dirty.set(true)"
            />
          </label>
          <button uiDialogClose>{{ f.rename.cancel }}</button>
        </div>
      </ng-container>
      <ng-container uiAlertDialog (beforeOpenChange)="onDeleteChange($event)">
        <button uiAlertDialogTrigger>{{ f.remove.trigger }}</button>
        <div *uiAlertDialogBackdrop class="dialog-backdrop"></div>
        <div *uiAlertDialogContent class="dialog">
          <h2 uiAlertDialogTitle class="title">{{ f.remove.title }}</h2>
          <p uiAlertDialogDescription class="description">
            {{ f.remove.description }}
          </p>
          <button uiAlertDialogClose>{{ f.remove.cancel }}</button>
          <button
            uiAlertDialogClose
            value="confirm"
            (action)="$event.waitUntil(pendingAction())"
          >
            {{ f.remove.action }}
          </button>
        </div>
      </ng-container>
      <label>
        {{ f.search }}
        <input />
      </label>
      <button id="chat" (click)="action.set('chat')">{{ f.chat }}</button>
      <ng-container uiPopover [container]="popoverRoot">
        <button uiPopoverTrigger [shortcut]="f.share.shortcut">
          {{ f.share.trigger }}
        </button>
        <div *uiPopoverContent class="popover">
          <h2 uiPopoverTitle>{{ f.share.title }}</h2>
          <ng-container uiMenu>
            <button uiMenuTrigger>{{ f.share.menu }}</button>
            <div *uiMenuContent class="menu">
              <div uiMenuItem value="copy">{{ f.share.item }}</div>
            </div>
          </ng-container>
          <ng-container uiDialog>
            <button uiDialogTrigger>{{ f.share.dialog }}</button>
            <div *uiDialogContent class="dialog">
              <h2 uiDialogTitle class="title">{{ f.share.dialogTitle }}</h2>
              <button uiDialogClose>{{ f.share.done }}</button>
            </div>
          </ng-container>
        </div>
      </ng-container>
      <ng-container uiMenu (action)="onDetailsAction($event.value)">
        <button uiMenuTrigger>{{ f.details.menu }}</button>
        <div *uiMenuContent class="menu">
          <div uiMenuItem value="details">{{ f.details.item }}</div>
        </div>
      </ng-container>
      <ng-container
        uiDialog
        [open]="details()"
        (openChange)="details.set($event)"
      >
        <div *uiDialogContent class="dialog">
          <h2 uiDialogTitle class="title">{{ f.details.title }}</h2>
          <button uiDialogClose>{{ f.details.done }}</button>
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = dialogPatternsFixture
  readonly pendingAction = pendingAction
  readonly rename = createDialogController()
  readonly popoverRoot = document.getElementById("popover-root")
  readonly field = viewChild<ElementRef<HTMLInputElement>>("field")
  readonly action = state("")
  readonly dirty = state(false)
  readonly details = state(false)

  constructor() {
    useShortcut(this.f.pageShortcut, () => this.action.set("page shortcut"))
    useShortcut(this.f.slashShortcut, () => this.action.set("slash"))
    useShortcut(this.f.rename.save, () => this.action.set("saved"), {
      layer: () => this.field()?.nativeElement,
      allowInInput: true,
    })
  }

  onRenameChange(change: DialogOpenChange) {
    recordOpenChange("rename", change.value, change)
    if (!change.value) {
      this.dirty.set(false)
    }
  }

  onDeleteChange(change: AlertDialogOpenChange) {
    recordOpenChange("delete", change.value, change)
  }

  onDetailsAction(value: string) {
    if (value === "details") {
      this.details.set(true)
    }
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
