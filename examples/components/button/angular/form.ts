import { Component } from "@angular/core"
import { Button } from "@ui-sdk/angular/button"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
import { useLog } from "../../../shared/angular/log"

@Component({
  imports: [Button, Field, FieldLabel, Input],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <label uiFieldLabel>Email</label>
        <input
          uiInput
          name="email"
          type="email"
          defaultValue="ada@example.com"
        />
      </div>
      <div data-slot="row">
        <button uiButton type="submit">Subscribe</button>
        <button uiButton type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  readonly log = useLog()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const email = new FormData(event.currentTarget as HTMLFormElement).get(
      "email"
    )
    this.log(`Subscribed ${email}`)
  }
}

export { Example }
