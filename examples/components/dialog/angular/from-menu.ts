import { Component } from "@angular/core"
import { LucideCopy, LucideEllipsis, LucidePencil } from "@lucide/angular"
import {
  createDialogController,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@ui-sdk/angular/dialog"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/angular/menu"

@Component({
  imports: [
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    Field,
    FieldLabel,
    Input,
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    LucideCopy,
    LucideEllipsis,
    LucidePencil,
  ],
  template: `
    <ng-container uiMenu>
      <button uiMenuTrigger aria-label="File actions">
        <svg lucideEllipsis></svg>
      </button>
      <div *uiMenuContent>
        <div uiMenuItem (select)="rename.open()">
          <svg lucidePencil></svg>
          Rename…
        </div>
        <div uiMenuItem>
          <svg lucideCopy></svg>
          Duplicate
        </div>
      </div>
    </ng-container>
    <ng-container uiDialog [controller]="rename">
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>Rename file</h2>
          <p uiDialogDescription>Names must be unique in a folder.</p>
        </div>
        <div uiField>
          <label uiFieldLabel>Name</label>
          <input uiInput defaultValue="report.pdf" />
        </div>
        <div data-slot="row">
          <button uiDialogClose>Cancel</button>
          <button uiDialogClose data-variant="solid" value="rename">
            Rename
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly rename = createDialogController()
}

export { Example }
