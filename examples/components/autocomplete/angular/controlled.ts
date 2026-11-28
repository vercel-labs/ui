import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "@ui-sdk/angular/autocomplete"

@Component({
  imports: [
    Autocomplete,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
  ],
  template: `
    <div data-slot="stack">
      <ng-container
        uiAutocomplete
        [(value)]="value"
        [(open)]="open"
        debug
        (beforeValueChange)="changeValue($event.value, $event)"
        (beforeOpenChange)="
          log(($event.value ? 'opened' : 'closed') + ': ' + $event.reason)
        "
        (openChangeComplete)="
          log(($event ? 'opened' : 'closed') + ' and settled')
        "
        (highlight)="$event.value && log('highlighted ' + $event.value)"
      >
        <label uiAutocompleteLabel>Fruit (12 characters at most)</label>
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
    </div>
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

  readonly value = signal("")

  readonly open = signal(false)

  changeValue(next: string, details: { reason: string; cancel: () => void }) {
    if (next.length > 12) {
      return details.cancel()
    }
    this.log(`text: ${details.reason}`)
  }
}

export { Example }
