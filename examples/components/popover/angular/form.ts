import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"

@Component({
  imports: [
    Field,
    FieldLabel,
    Input,
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  ],
  template: `
    <ng-container uiPopover [(open)]="open">
      <button uiPopoverTrigger>Edit Profile</button>
      <div *uiPopoverContent>
        <h2 uiPopoverTitle>Edit profile</h2>
        <p uiPopoverDescription>Your name shows on your posts.</p>
        <form data-slot="stack" (submit)="onSubmit($event)">
          <div uiField>
            <label uiFieldLabel>Name</label>
            <input uiInput name="name" required defaultValue="Hollis Grant" />
          </div>
          <div data-slot="row">
            <button uiPopoverClose>Cancel</button>
            <button type="submit" data-variant="solid">Save</button>
          </div>
        </form>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()

  readonly open = signal(false)

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.log(
      `Saved ${new FormData(event.currentTarget as HTMLFormElement).get("name")}`
    )
    this.open.set(false)
  }
}

export { Example }
