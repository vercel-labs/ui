import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideX } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/angular/combobox"

@Component({
  imports: [
    Combobox,
    ComboboxClear,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxList,
    ComboboxTrigger,
    LucideCheck,
    LucideChevronDown,
    LucideX,
  ],
  template: `
    <ng-container
      uiCombobox
      [(value)]="value"
      (beforeValueChange)="
        log(
          ($event.value ? frameworkLabel($event.value) : 'Cleared') +
            ' (' +
            $event.reason +
            ')'
        )
      "
      [itemToLabel]="frameworkLabel"
    >
      <div data-slot="stack">
        <label uiComboboxLabel>Framework</label>
        <div data-slot="row">
          <input uiComboboxInput placeholder="Select a framework" />
          <button *uiComboboxClear aria-label="Clear framework">
            <svg lucideX></svg>
          </button>
          <button uiComboboxTrigger aria-label="Show frameworks">
            <svg lucideChevronDown></svg>
          </button>
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxEmpty>No frameworks found.</div>
        <div uiComboboxList>
          @for (framework of frameworks; track framework.value) {
            <div
              uiComboboxItem
              [value]="framework.value"
              [label]="framework.label"
            >
              {{ framework.label }}
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
  readonly frameworks = [
    { value: "next", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt", label: "Nuxt" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
    { value: "solidstart", label: "SolidStart" },
    { value: "qwik", label: "Qwik City" },
  ]

  readonly frameworkLabel = (value: string) =>
    this.frameworks.find((framework) => framework.value === value)?.label ??
    value

  readonly log = useLog()

  readonly value = signal<string | null>("sveltekit")
}

export { Example }
