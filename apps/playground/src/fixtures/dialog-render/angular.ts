import { Component } from "@angular/core"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"
import { mountAngular } from "../../angular-mount"

@Component({
  imports: [
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiDialog>
        <button
          uiDialogTrigger
          #trigger="uiDialogTrigger"
          [class]="trigger.state().open ? 'is-open' : 'is-closed'"
        >
          Shipping
          <span aria-hidden="true">{{ trigger.state().open ? "▲" : "▼" }}</span>
        </button>
        <section *uiDialogBackdrop class="dialog-backdrop"></section>
        <div
          *uiDialogContent="let dialog"
          class="dialog"
          [class.is-open]="dialog.open"
          [class.is-closed]="!dialog.open"
        >
          <h3 uiDialogTitle>Shipping</h3>
          <div uiDialogDescription>Arrives in two days.</div>
          <a uiDialogClose href="#done">Done</a>
        </div>
      </ng-container>
      <button>After</button>
    </div>
  `,
})
class Fixture {}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
