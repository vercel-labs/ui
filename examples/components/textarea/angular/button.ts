import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Textarea, createInputController } from "@ui-sdk/angular/textarea"

@Component({
  imports: [Field, FieldLabel, Textarea],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField name="message">
        <label uiFieldLabel>Message</label>
        <textarea
          uiTextarea
          [controller]="message"
          required
          placeholder="Write a reply to Hollis Grant…"
        ></textarea>
      </div>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Send Message</button>
      </div>
    </form>
  `,
})
class Example {
  readonly log = useLog()

  readonly message = createInputController()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    this.log(`Sent “${data.get("message")}”`)
    this.message.clear()
  }
}

export { Example }
