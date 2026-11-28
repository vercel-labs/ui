import { Component } from "@angular/core"
import { LucideX } from "@lucide/angular"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import {
  Input,
  InputClear,
  InputGroup,
  type InputValueChange,
} from "@ui-sdk/angular/input"
import { useLog } from "../../../shared/angular/log"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldLabel,
    Input,
    InputClear,
    InputGroup,
    LucideX,
  ],
  template: `
    <div uiField name="website">
      <label uiFieldLabel>Website</label>
      <div uiInputGroup>
        <span>https://</span>
        <input
          uiInput
          placeholder="example.com"
          defaultValue="hollisgrant.com"
          (beforeValueChange)="report($event)"
        />
        <button *uiInputClear aria-label="Clear website">
          <svg lucideX></svg>
        </button>
      </div>
      <p uiFieldDescription>Shown on your public profile.</p>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  report({ value, reason }: InputValueChange) {
    this.log(`${value ? `“${value}”` : "Empty"} (${reason})`)
  }
}

export { Example }
