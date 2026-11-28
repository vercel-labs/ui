import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
} from "@ui-sdk/angular/combobox"

@Component({
  imports: [
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxList,
    LucideCheck,
  ],
  template: `
    <ng-container
      uiCombobox
      allowCustomValue
      [(value)]="value"
      (beforeValueChange)="
        log(
          ($event.value ? '“' + $event.value + '”' : 'No title') +
            ' (' +
            $event.reason +
            ')'
        )
      "
    >
      <div data-slot="stack">
        <label uiComboboxLabel>Job title</label>
        <input uiComboboxInput placeholder="Type any title…" />
      </div>
      <div *uiComboboxContent>
        <div uiComboboxEmpty #comboboxEmpty="uiComboboxEmpty">
          @if (comboboxEmpty.state().empty) {
            Press Enter to use “{{ comboboxEmpty.state().query }}”.
          }
        </div>
        <div uiComboboxList>
          @for (title of titles; track title) {
            <div uiComboboxItem [value]="title">
              {{ title }}
              <span *uiComboboxItemIndicator>
                <svg lucideCheck></svg>
              </span>
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly titles = [
    "Designer",
    "Engineer",
    "Engineering manager",
    "Product manager",
    "Researcher",
  ]

  readonly log = useLog()

  readonly value = signal<string | null>(null)
}

export { Example }
