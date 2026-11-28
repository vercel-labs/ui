import { Component } from "@angular/core"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"

@Component({
  imports: [
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    Field,
    FieldLabel,
    Input,
  ],
  template: `
    <ng-container uiDialog presentation="sheet">
      <button uiDialogTrigger>Edit Profile</button>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>Edit profile</h2>
          <p uiDialogDescription>
            Make changes to your profile here. Save when you're done.
          </p>
        </div>
        <div uiField>
          <label uiFieldLabel>Name</label>
          <input uiInput defaultValue="Hollis Grant" />
        </div>
        <div uiField>
          <label uiFieldLabel>Username</label>
          <input uiInput defaultValue="@hollis" />
        </div>
        <div data-slot="row">
          <button uiDialogClose>Cancel</button>
          <button uiDialogClose data-variant="solid" value="save">
            Save Changes
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
