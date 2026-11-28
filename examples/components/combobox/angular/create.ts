import { Component, signal } from "@angular/core"
import {
  LucideCheck,
  LucideLoaderCircle,
  LucidePlus,
  LucideX,
} from "@lucide/angular"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxCreate,
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
    ComboboxCreate,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxList,
    ComboboxValue,
    LucideCheck,
    LucideLoaderCircle,
    LucidePlus,
    LucideX,
  ],
  template: `
    <ng-container uiCombobox [(value)]="value" multiple>
      <div data-slot="stack">
        <label uiComboboxLabel>Labels</label>
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
          <input uiComboboxInput placeholder="Add or create a label…" />
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxList>
          @for (label of labels(); track label) {
            <div uiComboboxItem [value]="label">
              {{ label }}
              <span *uiComboboxItemIndicator>
                <svg lucideCheck></svg>
              </span>
            </div>
          }
          <div
            uiComboboxCreate
            #comboboxCreate="uiComboboxCreate"
            [minLength]="2"
            (create)="$event.waitUntil(create($event.query))"
          >
            @if (comboboxCreate.state().pending) {
              <svg lucideLoaderCircle data-slot="spinner"></svg>
              Creating “{{ comboboxCreate.state().query }}”…
            } @else {
              <svg lucidePlus></svg>
              <span data-slot="stack">
                Create “{{ comboboxCreate.state().query }}”
                @if (comboboxCreate.state().error) {
                  <span data-slot="hint">{{
                    messageOf(comboboxCreate.state().error)
                  }}</span>
                }
              </span>
            }
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly initialLabels = [
    "Bug",
    "Feature",
    "Documentation",
    "Design",
    "Performance",
    "Security",
    "Testing",
  ]

  saveLabel(name: string) {
    return new Promise<void>((resolve, reject) =>
      setTimeout(
        () =>
          name.length > 20
            ? reject(new Error("Labels are 20 characters at most."))
            : resolve(),
        800
      )
    )
  }

  readonly labels = signal(this.initialLabels)

  readonly value = signal<string[]>(["Bug"])

  async create(query: string) {
    await this.saveLabel(query)
    this.labels.set([...this.labels(), query])
    this.value.set([...this.value(), query])
  }

  itemsOf(items: unknown) {
    return items as string[]
  }

  messageOf(error: unknown) {
    return error instanceof Error ? error.message : ""
  }
}

export { Example }
