import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@ui-sdk/angular/autocomplete"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"

@Component({
  imports: [
    Autocomplete,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteList,
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
  ],
  template: `
    <form id="order" data-slot="stack" (submit)="submit($event)">
      <div uiField>
        <label uiFieldLabel>Fruit</label>
        <ng-container
          uiAutocomplete
          name="fruit"
          form="order"
          required
          defaultValue="Apple"
        >
          <input uiAutocompleteInput />
          <div *uiAutocompleteContent>
            <div uiAutocompleteEmpty>No fruits found.</div>
            <div uiAutocompleteList>
              @for (fruit of fruits; track fruit) {
                <div uiAutocompleteItem [value]="fruit">
                  {{ fruit }}
                </div>
              }
            </div>
          </div>
        </ng-container>
        <p uiFieldDescription>Any fruit, listed or not.</p>
        <div><div *uiFieldError></div></div>
      </div>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  readonly fruits = [
    "Apple",
    "Apricot",
    "Avocado",
    "Banana",
    "Blackberry",
    "Blueberry",
    "Cherry",
    "Grape",
    "Lemon",
    "Mango",
    "Orange",
    "Peach",
    "Pear",
    "Pineapple",
    "Strawberry",
  ]

  readonly log = useLog()

  submit(event: SubmitEvent) {
    event.preventDefault()
    const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
      ([name, value]) => `${name}=${value}`
    )
    this.log(`Submitted ${data.join("&")}`)
  }
}

export { Example }
