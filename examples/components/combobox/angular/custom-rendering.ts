import { Component } from "@angular/core"
import {
  LucideCheck,
  LucideChevronDown,
  LucideChevronUp,
  LucideSearch,
} from "@lucide/angular"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/angular/combobox"

@Component({
  imports: [
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxTrigger,
    LucideCheck,
    LucideChevronDown,
    LucideChevronUp,
    LucideSearch,
  ],
  template: `
    <ng-container uiCombobox>
      <div data-slot="stack">
        <label uiComboboxLabel>Assignee</label>
        <div data-slot="row">
          <div data-slot="row">
            <svg lucideSearch></svg>
            <input uiComboboxInput placeholder="Search people…" />
          </div>
          <button
            uiComboboxTrigger
            #comboboxTrigger="uiComboboxTrigger"
            aria-label="Show people"
          >
            @if (comboboxTrigger.state().open) {
              <svg lucideChevronUp></svg>
            } @else {
              <svg lucideChevronDown></svg>
            }
          </button>
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxEmpty>No one by that name.</div>
        <div uiComboboxList>
          @for (user of users; track user.id) {
            <div
              uiComboboxItem
              #comboboxItem="uiComboboxItem"
              [value]="user.username"
              [label]="user.name"
              [keywords]="[user.username]"
            >
              <span data-slot="badge">{{ user.name.slice(0, 1) }}</span>
              <span data-slot="stack">
                {{ user.name }}
                <span data-slot="hint">@{{ user.username }}</span>
              </span>
              @if (comboboxItem.state().selected) {
                <svg lucideCheck></svg>
              } @else if (comboboxItem.state().highlighted) {
                <kbd data-slot="kbd">Enter</kbd>
              }
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly users = [
    { id: 1, name: "Hollis Grant", username: "hollis", role: "Owner" },
    { id: 2, name: "Inès Moreau", username: "ines", role: "Admin" },
    { id: 3, name: "Kofi Mensah", username: "kofi", role: "Member" },
    { id: 4, name: "Wren Takahashi", username: "wren", role: "Member" },
    { id: 5, name: "Tomasz Wójcik", username: "tomasz", role: "Guest" },
  ]
}

export { Example }
