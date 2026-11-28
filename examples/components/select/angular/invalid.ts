import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <form data-slot="stack" (submit)="submit($event)">
      <div uiField name="shipping">
        <label uiFieldLabel>Shipping method</label>
        <ng-container uiSelect required placeholder="Select a shipping method">
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (method of methods; track method.value) {
              <div uiSelectItem [value]="method.value">
                {{ method.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
        <p uiFieldDescription>Express arrives in two business days.</p>
        <div *uiFieldError="'valueMissing'">Choose a shipping method.</div>
      </div>
      <button type="submit" data-variant="solid">Continue</button>
    </form>
  `,
})
class Example {
  readonly methods = [
    { value: "standard", label: "Standard" },
    { value: "express", label: "Express" },
    { value: "overnight", label: "Overnight" },
  ]

  readonly log = useLog()

  submit(event: SubmitEvent) {
    event.preventDefault()
    this.log(
      `Submitted shipping=${new FormData(event.currentTarget as HTMLFormElement).get("shipping")}`
    )
  }
}

export { Example }
