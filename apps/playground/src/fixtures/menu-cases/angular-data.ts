import { Component, computed } from "@angular/core"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"
import { Menu, MenuContent, MenuItems, MenuTrigger } from "@ui-sdk/angular/menu"
import { mountAngular, state } from "../../angular-mount"
import { casesData } from "./data"

@Component({
  imports: [
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    Menu,
    MenuContent,
    MenuItems,
    MenuTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiMenu
        [items]="items()"
        [itemShortcuts]="shortcuts()"
        (action)="action.set($event.value)"
      >
        <button uiMenuTrigger>Edit</button>
        <div *uiMenuContent>
          <div uiMenuItems></div>
        </div>
      </ng-container>
      <button (click)="align.set('right')">Align right</button>
      <button (click)="journal.set(true)">Add journal</button>
      <button (click)="shortcuts.set(false)">Turn off shortcuts</button>
      <button>After</button>
      <input aria-label="Notes" />
      <ng-container uiDialog>
        <button uiDialogTrigger>Open dialog</button>
        <div *uiDialogContent class="dialog">
          <h2 uiDialogTitle class="title">Settings</h2>
          <button uiDialogClose>Close</button>
        </div>
      </ng-container>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly action = state("")
  readonly align = state("left")
  readonly journal = state(false)
  readonly shortcuts = state(true)
  readonly items = computed(() =>
    casesData({ align: this.align(), journal: this.journal() })
  )
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
