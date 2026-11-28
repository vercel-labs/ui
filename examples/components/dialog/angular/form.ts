import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  type DialogOpenChange,
} from "@ui-sdk/angular/dialog"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"

@Component({
  imports: [
    Dialog,
    DialogBackdrop,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    Field,
    FieldLabel,
    Input,
  ],
  template: `
    <ng-container uiDialog (beforeOpenChange)="onOpenChange($event)">
      <button uiDialogTrigger>New Article</button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>New article</h2>
          <p uiDialogDescription>Save it as a draft or publish it now.</p>
        </div>
        <form data-slot="stack" method="dialog">
          <div uiField>
            <label uiFieldLabel>Title</label>
            <input
              uiInput
              required
              defaultValue="Shipping updates for spring"
            />
          </div>
          <div data-slot="row">
            <button type="submit" value="draft">Save Draft</button>
            <button data-variant="solid" type="submit" value="published">
              Publish
            </button>
          </div>
        </form>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()

  onOpenChange(change: DialogOpenChange) {
    if (!change.value) {
      this.log(
        change.returnValue
          ? `Saved as ${change.returnValue}`
          : `Closed (${change.reason})`
      )
    }
  }
}

export { Example }
