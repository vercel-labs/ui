import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
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
    <div data-slot="stack">
      <form id="select-newsletter" data-slot="stack" (submit)="submit($event)">
        <div uiField>
          <label uiFieldLabel>Country</label>
          <ng-container
            uiSelect
            name="country"
            autoComplete="country"
            required
            placeholder="Select a country"
          >
            <button uiSelectTrigger>
              <span uiSelectValue></span>
              <svg lucideChevronDown></svg>
            </button>
            <div *uiSelectContent>
              @for (country of countries; track country.value) {
                <div uiSelectItem [value]="country.value">
                  {{ country.label }}
                  <span *uiSelectItemIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </div>
              }
            </div>
          </ng-container>
        </div>
        <div uiField>
          <label uiFieldLabel>Topics</label>
          <ng-container
            uiSelect
            name="topics"
            multiple
            [defaultValue]="['Design']"
          >
            <button uiSelectTrigger>
              <span uiSelectValue></span>
              <svg lucideChevronDown></svg>
            </button>
            <div *uiSelectContent>
              @for (topic of topics; track topic) {
                <div uiSelectItem [value]="topic">
                  {{ topic }}
                  <span *uiSelectItemIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </div>
              }
            </div>
          </ng-container>
        </div>
      </form>
      <div uiField>
        <label uiFieldLabel>Frequency</label>
        <ng-container
          uiSelect
          name="frequency"
          form="select-newsletter"
          defaultValue="Weekly"
        >
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (frequency of frequencies; track frequency) {
              <div uiSelectItem [value]="frequency">
                {{ frequency }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
      <div data-slot="row">
        <button type="submit" form="select-newsletter" data-variant="solid">
          Save
        </button>
        <button type="reset" form="select-newsletter">Reset</button>
      </div>
    </div>
  `,
})
class Example {
  readonly countries = [
    { value: "au", label: "Australia" },
    { value: "br", label: "Brazil" },
    { value: "ca", label: "Canada" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "jp", label: "Japan" },
    { value: "es", label: "Spain" },
    { value: "se", label: "Sweden" },
  ]

  readonly topics = ["Design", "Engineering", "Marketing", "Research", "Sales"]

  readonly frequencies = ["Daily", "Weekly", "Monthly"]

  readonly log = useLog()

  submit(event: SubmitEvent) {
    event.preventDefault()
    const entries = [
      ...new FormData(event.currentTarget as HTMLFormElement),
    ].map(([name, value]) => `${name}=${value}`)
    this.log(`Submitted ${entries.join("&")}`)
  }
}

export { Example }
