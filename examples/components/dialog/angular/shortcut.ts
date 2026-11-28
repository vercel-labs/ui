import { Component } from "@angular/core"
import { LucidePlus } from "@lucide/angular"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"

@Component({
  imports: [
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogShortcut,
    DialogTitle,
    DialogTrigger,
    Field,
    FieldLabel,
    Input,
    LucidePlus,
  ],
  template: `
    <ng-container uiDialog>
      <button uiDialogTrigger shortcut="mod+j">
        <svg lucidePlus></svg>
        New Contact
        <kbd uiDialogShortcut></kbd>
      </button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>New contact</h2>
          <p uiDialogDescription>Add someone to your address book.</p>
        </div>
        <form data-slot="stack" method="dialog">
          <div uiField>
            <label uiFieldLabel>Name</label>
            <input uiInput name="name" required placeholder="Kofi Mensah" />
          </div>
          <div uiField>
            <label uiFieldLabel>Email</label>
            <input
              uiInput
              name="email"
              type="email"
              required
              placeholder="kofi@example.com"
            />
          </div>
          <div data-slot="row">
            <button uiDialogClose>Cancel</button>
            <button data-variant="solid" type="submit" value="save">
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
