import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/angular/radio"

let nextId = 0

@Component({
  imports: [Field, FieldLabel, Radio, RadioGroup, RadioIndicator],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Shipping speed</label>
        <div
          uiRadioGroup
          name="shipping"
          [form]="\`\${id}-checkout\`"
          required
          defaultValue="standard"
        >
          @for (speed of speeds; track speed.value) {
            <label data-slot="label">
              <button uiRadio [value]="speed.value">
                <span uiRadioIndicator></span>
              </button>
              {{ speed.label }}
              <span data-slot="hint">({{ speed.detail }})</span>
            </label>
          }
        </div>
      </div>
      <form
        data-slot="row"
        [id]="\`\${id}-checkout\`"
        (submit)="onSubmit($event)"
      >
        <button type="submit" data-variant="solid">Continue</button>
        <button type="reset">Reset</button>
      </form>
    </div>
  `,
})
class Example {
  readonly speeds = [
    { value: "standard", label: "Standard", detail: "Free, 5 to 7 days" },
    { value: "express", label: "Express", detail: "$9, 2 days" },
    { value: "overnight", label: "Overnight", detail: "$24, next day" },
  ]

  readonly log = useLog()

  readonly id = `plan-${nextId++}`

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.log(
      `Submitted shipping=${new FormData(event.currentTarget as HTMLFormElement).get("shipping")}`
    )
  }
}

export { Example }
