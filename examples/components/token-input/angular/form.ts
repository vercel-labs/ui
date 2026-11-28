import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  TokenInput,
  TokenInputEditor,
  type TokenInputValue,
} from "@ui-sdk/angular/token-input"

let nextId = 0

@Component({
  imports: [
    Checkbox,
    CheckboxIndicator,
    Field,
    FieldLabel,
    TokenInput,
    TokenInputEditor,
    LucideCheck,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <label data-slot="label">
          <button
            uiCheckbox
            [checked]="disabled()"
            (beforeCheckedChange)="disabled.set($event.value === true)"
          >
            <span uiCheckboxIndicator>
              <svg lucideCheck></svg>
            </span>
          </button>
          Disabled
        </label>
        <label data-slot="label">
          <button
            uiCheckbox
            [checked]="readOnly()"
            (beforeCheckedChange)="readOnly.set($event.value === true)"
          >
            <span uiCheckboxIndicator>
              <svg lucideCheck></svg>
            </span>
          </button>
          Read-only
        </label>
      </div>
      <div data-slot="stack">
        <div uiField [disabled]="disabled()">
          <label uiFieldLabel>Prompt</label>
          <div
            uiTokenInput
            [form]="formId"
            name="prompt"
            required
            [defaultValue]="draft"
            [readOnly]="readOnly()"
          >
            <div uiTokenInputEditor></div>
          </div>
        </div>
        <form [id]="formId" data-slot="row" (submit)="onSubmit($event)">
          <button type="submit" data-variant="solid">Submit</button>
          <button type="reset">Reset</button>
        </form>
      </div>
    </div>
  `,
})
class Example {
  readonly draft: TokenInputValue = [
    "Explain ",
    { type: "file", value: "src/routes.ts", label: "routes.ts" },
    " in two sentences.",
  ]

  readonly log = useLog()

  readonly disabled = signal(false)

  readonly readOnly = signal(false)

  readonly formId = `message-form-${nextId++}`

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.log(
      `Submitted ${new FormData(event.currentTarget as HTMLFormElement).get("prompt") ?? ""}`
    )
  }
}

export { Example }
