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
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"

@Component({
  imports: [
    Dialog,
    DialogBackdrop,
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
    <ng-container uiDialog>
      <button uiDialogTrigger>Account</button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>Account</h2>
          <p uiDialogDescription>Manage how you sign in.</p>
        </div>
        <div data-slot="card">
          <div data-slot="stack">
            <span>Password</span>
            <span data-slot="hint">Last changed 3 months ago</span>
          </div>
          <ng-container uiDialog>
            <button uiDialogTrigger>Change Password</button>
            <div *uiDialogBackdrop></div>
            <div *uiDialogContent>
              <div data-slot="stack">
                <h2 uiDialogTitle>Change password</h2>
                <p uiDialogDescription>Use at least 12 characters.</p>
              </div>
              <div uiField>
                <label uiFieldLabel>New password</label>
                <input uiInput type="password" />
              </div>
              <div data-slot="row">
                <button uiDialogClose>Cancel</button>
                <button uiDialogClose data-variant="solid">Update</button>
              </div>
            </div>
          </ng-container>
        </div>
        <div data-slot="row">
          <button uiDialogClose data-variant="solid">Done</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
