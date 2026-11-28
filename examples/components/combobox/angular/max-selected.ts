import { Component } from "@angular/core"
import { LucideCheck, LucideX } from "@lucide/angular"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
} from "@ui-sdk/angular/combobox"

@Component({
  imports: [
    Combobox,
    ComboboxChip,
    ComboboxChipRemove,
    ComboboxChips,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxList,
    ComboboxValue,
    LucideCheck,
    LucideX,
  ],
  template: `
    <ng-container
      uiCombobox
      multiple
      [maxSelected]="3"
      [defaultValue]="['Bug', 'Design']"
    >
      <div data-slot="stack">
        <label uiComboboxLabel>Labels (up to 3)</label>
        <div uiComboboxChips>
          <span uiComboboxValue #comboboxValue="uiComboboxValue">
            @for (label of itemsOf(comboboxValue.state().value); track label) {
              <div uiComboboxChip [value]="label">
                {{ label }}
                <button
                  uiComboboxChipRemove
                  [attr.aria-label]="\`Remove \${label}\`"
                >
                  <svg lucideX></svg>
                </button>
              </div>
            }
          </span>
          <input uiComboboxInput placeholder="Add labels…" />
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxList>
          @for (label of labels; track label) {
            <div uiComboboxItem #comboboxItem="uiComboboxItem" [value]="label">
              {{ label }}
              @if (comboboxItem.state().maxReached) {
                <span data-slot="hint">Limit reached</span>
              }
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
  readonly labels = [
    "Bug",
    "Feature",
    "Documentation",
    "Design",
    "Performance",
    "Security",
    "Testing",
  ]

  itemsOf(items: unknown) {
    return items as string[]
  }
}

export { Example }
