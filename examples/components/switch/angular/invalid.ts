import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    Switch,
    SwitchThumb,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <div data-slot="row">
          <div data-slot="stack">
            <label uiFieldLabel>Two-factor authentication</label>
            <p uiFieldDescription>Required for admins of this workspace.</p>
          </div>
          <button uiSwitch name="two-factor" required>
            <span uiSwitchThumb></span>
          </button>
        </div>
        <div *uiFieldError="'valueMissing'">Turn this on to continue.</div>
      </div>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Continue</button>
      </div>
    </form>
  `,
})
class Example {
  readonly log = useLog()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.log(
      `Submitted two-factor=${new FormData(event.currentTarget as HTMLFormElement).get("two-factor")}`
    )
  }
}

export { Example }
