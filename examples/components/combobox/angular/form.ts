import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideX } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@ui-sdk/angular/combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"

@Component({
  imports: [
    Combobox,
    ComboboxChip,
    ComboboxChipRemove,
    ComboboxChips,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    LucideCheck,
    LucideChevronDown,
    LucideX,
  ],
  template: `
    <form data-slot="stack" (submit)="submit($event)">
      <div uiField name="country">
        <label uiFieldLabel>Country</label>
        <ng-container uiCombobox required [itemToLabel]="countryLabel">
          <div data-slot="row">
            <input uiComboboxInput placeholder="Search countries…" />
            <button uiComboboxTrigger aria-label="Show countries">
              <svg lucideChevronDown></svg>
            </button>
          </div>
          <div *uiComboboxContent>
            <div uiComboboxEmpty>No countries found.</div>
            <div uiComboboxList>
              @for (country of countries; track country.value) {
                <div
                  uiComboboxItem
                  [value]="country.value"
                  [label]="country.label"
                >
                  {{ country.label }}
                  <span *uiComboboxItemIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </div>
              }
            </div>
          </div>
        </ng-container>
        <p uiFieldDescription>Where we ship your order.</p>
        <div>
          <div *uiFieldError="'valueMissing'">Choose a country.</div>
        </div>
      </div>
      <div uiField name="interests">
        <label uiFieldLabel>Interests</label>
        <ng-container uiCombobox multiple [defaultValue]="['Design']">
          <div uiComboboxChips>
            <span uiComboboxValue #comboboxValue="uiComboboxValue">
              @for (
                interest of itemsOf(comboboxValue.state().value);
                track interest
              ) {
                <div uiComboboxChip [value]="interest">
                  {{ interest }}
                  <button
                    uiComboboxChipRemove
                    [attr.aria-label]="\`Remove \${interest}\`"
                  >
                    <svg lucideX></svg>
                  </button>
                </div>
              }
            </span>
            <input uiComboboxInput placeholder="Add interests…" />
          </div>
          <div *uiComboboxContent>
            <div uiComboboxList>
              @for (interest of interests; track interest) {
                <div uiComboboxItem [value]="interest">
                  {{ interest }}
                  <span *uiComboboxItemIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </div>
              }
            </div>
          </div>
        </ng-container>
      </div>
      <div data-slot="row">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  readonly countries = [
    { value: "ar", label: "Argentina" },
    { value: "au", label: "Australia" },
    { value: "at", label: "Austria" },
    { value: "be", label: "Belgium" },
    { value: "br", label: "Brazil" },
    { value: "ca", label: "Canada" },
    { value: "cl", label: "Chile" },
    { value: "dk", label: "Denmark" },
    { value: "fi", label: "Finland" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "gr", label: "Greece" },
    { value: "jp", label: "Japan" },
    { value: "nl", label: "Netherlands" },
    { value: "es", label: "Spain" },
    { value: "se", label: "Sweden" },
    { value: "ch", label: "Switzerland" },
  ]

  readonly countryLabel = (value: string) =>
    this.countries.find((country) => country.value === value)?.label ?? value

  readonly interests = [
    "Design",
    "Engineering",
    "Marketing",
    "Research",
    "Sales",
  ]

  readonly log = useLog()

  submit(event: SubmitEvent) {
    event.preventDefault()
    const entries = [
      ...new FormData(event.currentTarget as HTMLFormElement),
    ].map(([name, value]) => `${name}=${value}`)
    this.log(`Submitted ${entries.join("&")}`)
  }

  itemsOf(items: unknown) {
    return items as string[]
  }
}

export { Example }
