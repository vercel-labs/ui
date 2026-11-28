import { afterNextRender, Component } from "@angular/core"
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  createConfirm,
} from "@ui-sdk/angular/alert-dialog"
import {
  createDialogController,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
  type DialogOpenChange,
} from "@ui-sdk/angular/dialog"
import {
  alertDialogFixture,
  alertDialogOptions,
  dialogContentOptions,
  dialogFixture,
  dialogOptions,
  dialogParts,
} from "../../../../../tests/fixtures/dialog"
import { mountAngular, state } from "../../angular-mount"
import { exposeDialogFixture, recordOpenChange } from "./shared"

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
    DialogDescription,
    DialogShortcut,
    DialogTitle,
    DialogTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiDialog
        [controller]="controller"
        [defaultOpen]="options.defaultOpen"
        [modal]="options.modal"
        [closeOnOutsidePress]="options.closeOnOutsidePress"
        [container]="options.container"
        [presentation]="options.presentation"
        (beforeOpenChange)="onOpenChange($event)"
      >
        @if (triggerShown()) {
          <button uiDialogTrigger>{{ f.trigger }}</button>
        }
        @if (parts.backdrop) {
          <div *uiDialogBackdrop class="dialog-backdrop"></div>
        }
        <div *uiDialogContent="content" class="dialog">
          @if (parts.title) {
            <h2 uiDialogTitle class="title">{{ f.title }}</h2>
          }
          <p uiDialogDescription class="description">{{ f.description }}</p>
          <label class="field">
            {{ f.field }}
            <input [defaultValue]="f.defaultValue" />
          </label>
          @if (parts.long) {
            <p class="long">{{ f.long }}</p>
          }
          <div class="actions">
            <button (click)="action.set('save')">{{ f.action }}</button>
            <button uiDialogClose>{{ f.close }}</button>
            @if (parts.removable) {
              <button (click)="triggerShown.set(false)">{{ f.remove }}</button>
            }
          </div>
          @if (parts.form) {
            <form method="dialog">
              <button [value]="f.form.value">{{ f.form.label }}</button>
            </form>
          }
          @if (parts.nested) {
            <ng-container
              uiDialog
              [defaultOpen]="parts.nestedOpen"
              (beforeOpenChange)="record('nested', $event)"
            >
              <button uiDialogTrigger>{{ f.nested.trigger }}</button>
              @if (parts.backdrop) {
                <div *uiDialogBackdrop class="dialog-backdrop"></div>
              }
              <div *uiDialogContent class="dialog">
                <h2 uiDialogTitle class="title">{{ f.nested.title }}</h2>
                <button uiDialogClose>{{ f.nested.close }}</button>
              </div>
            </ng-container>
          }
        </div>
      </ng-container>
      <ng-container
        uiAlertDialog
        [controller]="confirm.controller"
        [defaultOpen]="alertOptions.defaultOpen"
        [container]="alertOptions.container"
      >
        <button uiAlertDialogTrigger>{{ alert.trigger }}</button>
        @if (parts.backdrop) {
          <div *uiAlertDialogBackdrop class="dialog-backdrop"></div>
        }
        <div *uiAlertDialogContent class="dialog">
          <h2 uiAlertDialogTitle class="title">{{ alert.title }}</h2>
          <p uiAlertDialogDescription class="description">
            {{ alert.description }}
          </p>
          <div class="actions">
            <button uiAlertDialogClose>{{ alert.cancel }}</button>
            <button
              uiAlertDialogClose
              [value]="'confirm'"
              (click)="action.set('delete')"
            >
              {{ alert.action }}
            </button>
          </div>
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.open()">Open with controller</button>
      @if (parts.shortcut) {
        <button
          uiDialogTrigger
          [controller]="controller"
          [shortcut]="f.shortcut.keys"
        >
          {{ f.shortcut.trigger }} <kbd uiDialogShortcut></kbd>
        </button>
      }
    </div>
  `,
})
class Fixture {
  readonly f = dialogFixture
  readonly alert = alertDialogFixture
  readonly controller = createDialogController()
  readonly confirm = createConfirm()
  readonly parts = dialogParts()
  readonly options: {
    defaultOpen?: boolean
    modal?: boolean | "trap-focus"
    closeOnOutsidePress?: boolean
    container?: HTMLElement | null
    presentation?: "auto" | "sheet"
  } = dialogOptions()
  readonly alertOptions: {
    defaultOpen?: boolean
    container?: HTMLElement | null
  } = alertDialogOptions()
  readonly content = dialogContentOptions()
  readonly action = state("")
  readonly triggerShown = state(true)
  readonly record = (name: string, change: DialogOpenChange) =>
    recordOpenChange(name, change.value, change)

  constructor() {
    // In the browser only: the server has no window.
    afterNextRender(() => exposeDialogFixture(this.controller, this.confirm))
  }

  onOpenChange(change: DialogOpenChange) {
    this.record("dialog", change)
    if (!change.value && change.returnValue) {
      this.action.set(change.returnValue)
    }
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
